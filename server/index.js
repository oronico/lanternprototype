const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Security Configuration
const { 
  securityConfig, 
  createSecurityMiddleware,
  AuditLogger 
} = require('./config/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
const security = createSecurityMiddleware();

// Core Security Headers
app.use(security.helmet);

// CORS Configuration (Restrictive for Production)
const corsOptions = {
  origin: securityConfig.apiSecurity.allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Session Management (Secure)
app.use(session({
  secret: process.env.SESSION_SECRET || 'microschool_session_secret_change_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 30 * 60 * 1000, // 30 minutes
    sameSite: 'strict' // CSRF protection
  }
}));

// Request Logging (Security Monitoring)
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      // In production: send to security monitoring system
      console.log('ACCESS_LOG:', message.trim());
    }
  }
}));

// Body Parsing with Size Limits (Security)
app.use(express.json({ limit: securityConfig.apiSecurity.requestSizeLimit }));
app.use(express.urlencoded({ extended: true, limit: securityConfig.apiSecurity.requestSizeLimit }));

// Rate Limiting
app.use('/api/auth/', security.authRateLimit);
app.use('/api/payments/', security.financialRateLimit);
app.use('/api/health/', security.financialRateLimit);
app.use('/api/', security.generalRateLimit);

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const paymentsRoutes = require('./routes/payments');
const calculatorRoutes = require('./routes/calculator');
const healthRoutes = require('./routes/health');
const enrollmentRoutes = require('./routes/enrollment');
const leaseRoutes = require('./routes/lease');
const aiRoutes = require('./routes/ai');
const coachingRoutes = require('./routes/coaching');
const documentsRoutes = require('./routes/documents');
const reconciliationRoutes = require('./routes/reconciliation');

// Routes with Security Classifications
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', 
  security.classifyData(securityConfig.dataClassification.INTERNAL),
  security.auditAccess('dashboard'),
  dashboardRoutes
);
app.use('/api/payments', 
  security.classifyData(securityConfig.dataClassification.CONFIDENTIAL),
  security.auditAccess('payments'),
  security.protectFinancialData,
  paymentsRoutes
);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/health', 
  security.classifyData(securityConfig.dataClassification.CONFIDENTIAL),
  security.auditAccess('financial_health'),
  security.protectFinancialData,
  healthRoutes
);
app.use('/api/enrollment', 
  security.classifyData(securityConfig.dataClassification.RESTRICTED),
  security.auditAccess('student_data'),
  security.protectStudentData,
  enrollmentRoutes
);
app.use('/api/lease', leaseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/documents', 
  security.classifyData(securityConfig.dataClassification.CONFIDENTIAL),
  security.auditAccess('contracts'),
  documentsRoutes
);
app.use('/api/reconciliation',
  security.classifyData(securityConfig.dataClassification.CONFIDENTIAL),
  security.auditAccess('payment_reconciliation'),
  security.protectFinancialData,
  reconciliationRoutes
);

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🏮 SchoolStack.ai API server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:3000`);
  console.log(`🔌 API Health: http://localhost:${PORT}/api/health-check`);
  console.log(`🌐 Production: https://schoolstack.ai`);
});

module.exports = app;
