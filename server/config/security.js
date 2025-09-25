const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Security Configuration for Microschool Platform
const securityConfig = {
  // Data Classification Levels
  dataClassification: {
    PUBLIC: 'public',           // Marketing materials, general info
    INTERNAL: 'internal',       // Financial reports, staff info  
    CONFIDENTIAL: 'confidential', // Student records, payment data
    RESTRICTED: 'restricted'    // SSN, medical records, financial accounts
  },

  // FERPA Compliance Requirements
  ferpaCompliance: {
    enabled: true,
    requireParentConsent: true,
    dataRetentionYears: 7,
    auditLogRetention: 10,
    encryptionRequired: true,
    accessLogging: true
  },

  // Financial Data Protection (PCI DSS Level)
  financialDataSecurity: {
    encryptionStandard: 'AES-256',
    tokenizePaymentData: true,
    requireTwoFactorAuth: true,
    auditFinancialAccess: true,
    segregateFinancialData: true
  },

  // Access Control Framework
  accessControl: {
    roleBasedAccess: true,
    principleOfLeastPrivilege: true,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    accountLockoutDuration: 15, // minutes
    passwordComplexity: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },

  // API Security
  apiSecurity: {
    enableCORS: true,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    enableAPIKeyAuth: true,
    rateLimiting: true,
    requestSizeLimit: '10mb',
    enableRequestLogging: true
  },

  // Data Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyDerivation: 'pbkdf2',
    saltLength: 32,
    iterations: 100000,
    tagLength: 16
  }
};

// Rate Limiting Configuration
const rateLimiters = {
  // General API requests
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      retryAfter: '15 minutes'
    }
  }),

  // Authentication endpoints (stricter)
  auth: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // limit each IP to 10 login attempts per 15 minutes
    skipSuccessfulRequests: true,
    message: {
      error: 'Too many login attempts',
      retryAfter: '15 minutes'
    }
  }),

  // Financial endpoints (very strict)
  financial: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: {
      error: 'Financial API rate limit exceeded',
      retryAfter: '1 minute'
    }
  }),

  // Student data endpoints (FERPA protected)
  studentData: rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
      error: 'Student data access rate limit exceeded',
      retryAfter: '1 minute'
    }
  })
};

// Helmet Security Headers Configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.plaid.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for payment processors
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Data Encryption Utilities
class DataEncryption {
  static generateKey() {
    return crypto.randomBytes(32);
  }

  static encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  static decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher('aes-256-gcm', key, Buffer.from(encryptedData.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Audit Logging for Compliance
class AuditLogger {
  static logAccess(userId, resource, action, ipAddress, userAgent) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      resource,
      action,
      ipAddress,
      userAgent,
      sessionId: crypto.randomUUID()
    };
    
    // In production: write to secure audit database
    console.log('AUDIT:', JSON.stringify(logEntry));
    
    return logEntry;
  }

  static logFinancialAccess(userId, financialResource, action, amount = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      type: 'FINANCIAL_ACCESS',
      resource: financialResource,
      action,
      amount,
      classification: securityConfig.dataClassification.CONFIDENTIAL
    };
    
    // In production: write to secure financial audit log
    console.log('FINANCIAL_AUDIT:', JSON.stringify(logEntry));
    
    return logEntry;
  }

  static logStudentDataAccess(userId, studentId, action, dataType) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      type: 'STUDENT_DATA_ACCESS',
      studentId,
      action,
      dataType,
      classification: securityConfig.dataClassification.RESTRICTED,
      ferpaProtected: true
    };
    
    // In production: write to FERPA-compliant audit log
    console.log('FERPA_AUDIT:', JSON.stringify(logEntry));
    
    return logEntry;
  }
}

// Security Middleware Factory
const createSecurityMiddleware = () => {
  return {
    // Apply helmet security headers
    helmet: helmet(helmetConfig),
    
    // Rate limiting
    generalRateLimit: rateLimiters.general,
    authRateLimit: rateLimiters.auth,
    financialRateLimit: rateLimiters.financial,
    studentDataRateLimit: rateLimiters.studentData,
    
    // Data classification middleware
    classifyData: (classification) => (req, res, next) => {
      req.dataClassification = classification;
      next();
    },
    
    // Audit logging middleware
    auditAccess: (resource) => (req, res, next) => {
      const userId = req.user?.id || 'anonymous';
      const action = req.method;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      AuditLogger.logAccess(userId, resource, action, ipAddress, userAgent);
      next();
    },
    
    // Financial data protection
    protectFinancialData: (req, res, next) => {
      if (req.dataClassification === securityConfig.dataClassification.CONFIDENTIAL) {
        AuditLogger.logFinancialAccess(req.user?.id, req.originalUrl, req.method, req.body?.amount);
      }
      next();
    },
    
    // Student data protection (FERPA)
    protectStudentData: (req, res, next) => {
      if (req.dataClassification === securityConfig.dataClassification.RESTRICTED) {
        AuditLogger.logStudentDataAccess(req.user?.id, req.params?.studentId, req.method, 'student_record');
      }
      next();
    }
  };
};

module.exports = {
  securityConfig,
  rateLimiters,
  helmetConfig,
  DataEncryption,
  AuditLogger,
  createSecurityMiddleware
};
