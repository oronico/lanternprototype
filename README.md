# Microschool Platform - Unified Financial Operating System

A comprehensive platform designed specifically for microschool operators to manage finances, track enrollment, analyze facilities, and generate essential documents using AI assistance.

## 🌟 Key Features

### 📊 Real-Time Financial Health Scorecard
Monitor critical financial metrics with automated scoring:
- **Days Cash on Hand** - Track liquidity and cash runway
- **Rent to Revenue Ratio** - Monitor facility cost efficiency  
- **Debt Service Coverage Ratio (DSCR)** - Assess loan readiness
- **Savings Buffer** - Measure emergency fund adequacy
- **Staffing Cost Ratio** - Track personnel expense efficiency
- **Staff Attrition Rate** - Monitor team stability
- **Student Retention Rate** - Track academic program success
- **Enrollment to Goal %** - Monitor growth progress
- **Cost per Pupil** - Benchmark operational efficiency
- **Cost per Square Foot** - Optimize facility utilization

### 🤖 AI Assistant for Document Generation
Generate and review essential documents:
- **Corporate Bylaws** - Nonprofit incorporation documents
- **Family Handbooks** - Comprehensive policy guides
- **Enrollment Agreements** - Legal contracts for families
- **Staff Handbooks** - HR policies and procedures
- **Safety Plans** - Emergency response protocols
- **Board Resolutions** - Formal governance documents
- **Lease Analysis** - AI-powered contract review
- **Policy Templates** - Custom school policies

### 💰 Financial Management & Integrations
- **Unified Payment Dashboard** - Single view across all payment sources
- **Real-Time Sync** - Auto-reconciliation from 12+ systems
- **Multi-Platform Support** - Works with all major back-office apps
- **Pricing Calculator** - Dynamic tuition modeling
- **Cash Flow Forecasting** - Week-ahead projections
- **Collections Management** - Automated follow-up workflows
- **Grant Opportunity Tracking** - Available funding alerts

#### 🔗 **Supported Integrations:**

**Payment Processors:**
- ✅ **Omella** - K-12 specialized payment processing
- ✅ **Stripe** - Credit cards, ACH, subscriptions
- ✅ **Square** - POS and online payments
- ✅ **PayPal** - Alternative payment methods

**ESA/Voucher Platforms:**
- ✅ **ClassWallet** - ESA payment management
- ✅ **ESA vendor compliance** - Automated reporting

**Accounting Systems:**
- ✅ **QuickBooks Online** - Full GL sync and automation
- ✅ **Xero** - Alternative accounting platform
- ✅ **Automated categorization** - Smart transaction matching

**Payroll & HR:**
- ✅ **Gusto** - Payroll processing and compliance
- ✅ **Tax filing integration** - Automated reporting

**Banking:**
- ✅ **Plaid** - Bank account integration
- ✅ **Real-time balance sync** - Live cash monitoring
- ✅ **Transaction import** - Automated reconciliation

**Alternative Payment Methods:**
- ✅ **Zelle** - Bank transfers (monitoring)
- ✅ **Venmo/Cash App** - P2P payments (tracking)
- ✅ **Check processing** - Manual entry system

### 🏢 Facility Management
- **Lease Analysis** - AI review of contract terms
- **Market Comparisons** - Rental rate benchmarking
- **Alternative Space Finder** - Cost-saving opportunities
- **Negotiation Templates** - Pre-built landlord communications

### 👨‍👩‍👧‍👦 Enrollment Pipeline
- **Lead Tracking** - Inquiry to enrollment funnel
- **Conversion Analytics** - Optimize marketing ROI
- **Family Management** - Comprehensive profiles
- **Retention Monitoring** - Early warning systems

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (optional - uses mock data by default)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd microschool-platform
npm run install-all
```

2. **Start the development servers:**
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

### Demo Login
- **Email:** admin@sunshine-microschool.com
- **Password:** admin123

## 🏗️ Architecture

### Backend (Node.js/Express)
- RESTful API with comprehensive endpoints
- Mock data for demonstration (easily replaced with real databases)
- Modular route structure for scalability
- Error handling and validation

### Frontend (React/Tailwind CSS)
- Modern React with hooks and context
- Responsive design for all devices
- Real-time data updates
- Component-based architecture

### Key API Endpoints

#### Financial Health
- `GET /api/health/scorecard` - Real-time financial metrics
- `GET /api/health/metrics` - Detailed health analysis
- `GET /api/health/loan-readiness` - Loan qualification assessment

#### AI Assistant
- `GET /api/ai/templates` - Available document templates
- `POST /api/ai/generate` - Generate documents with AI
- `POST /api/ai/review` - AI-powered document review

#### Dashboard
- `GET /api/dashboard/summary` - Financial snapshot
- `GET /api/dashboard/alerts` - Critical notifications
- `POST /api/dashboard/action` - Execute quick actions

## 📈 Financial Health Scoring

The platform calculates a comprehensive health score (0-100) based on:

| Metric | Weight | Target | Benchmark |
|--------|--------|--------|-----------|
| Days Cash on Hand | 20% | 45+ days | 30 days |
| Rent to Revenue Ratio | 15% | ≤15% | ≤20% |
| Debt Service Coverage | 10% | ≥1.50x | ≥1.25x |
| Savings Buffer | 15% | 6+ months | 3 months |
| Staffing Cost Ratio | 10% | ≤45% | ≤50% |
| Staff Attrition Rate | 5% | ≤10% | ≤20% |
| Student Retention | 10% | ≥95% | ≥90% |
| Enrollment to Goal | 10% | 100% | 90% |
| Cost per Pupil | 5% | ≤$550 | ≤$600 |

**Score Ranges:**
- 85-100: Excellent (Green)
- 70-84: Good (Blue) 
- 55-69: Warning (Yellow)
- 0-54: Critical (Red)

## 🎯 Real-Time Features

### Auto-Refresh Dashboard
- Live financial metrics update every 30 seconds
- Real-time cash flow monitoring
- Instant alerts for critical thresholds

### Intelligent Recommendations
- Automated action suggestions based on current metrics
- Prioritized task lists for maximum impact
- Market-based pricing recommendations

### Predictive Analytics
- 7-day cash flow forecasting
- Enrollment trend analysis
- Facility cost optimization opportunities

## 🔧 Configuration

### Environment Variables
Create `.env` files in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/microschool_platform

# External Integrations (optional)
STRIPE_SECRET_KEY=your_stripe_key
PLAID_SECRET=your_plaid_secret
OPENAI_API_KEY=your_openai_key
```

## 🚀 Production Deployment

### Backend Deployment
1. Set up MongoDB database
2. Configure environment variables
3. Deploy to cloud provider (AWS, Heroku, etc.)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API_URL in client environment

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests  
cd client && npm test
```

## 📚 API Documentation

### Health Scorecard Response
```json
{
  "overallScore": 68,
  "overallStatus": "warning",
  "lastUpdated": "2024-11-12T10:30:00.000Z",
  "criticalMetrics": [
    {
      "key": "daysCashOnHand",
      "name": "Days Cash on Hand", 
      "value": 7,
      "displayValue": "7 days",
      "benchmark": 30,
      "target": 45,
      "status": "danger",
      "trend": "declining",
      "recommendation": "Critical: Collect outstanding payments immediately"
    }
  ],
  "insights": [
    {
      "type": "critical",
      "title": "Cash Crisis Imminent",
      "message": "Only 7 days of cash remaining",
      "action": "Collect outstanding payments immediately"
    }
  ]
}
```

## 🤝 Contributing

This is a prototype platform. For production use:

1. Replace mock data with real database integration
2. Implement actual payment gateway connections
3. Add proper authentication and authorization
4. Set up monitoring and logging
5. Add comprehensive testing suite

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions about implementation or customization:
- Review the API documentation in `/server/routes/`
- Check component examples in `/client/src/components/`
- Examine the financial calculation logic in `/server/routes/health.js`

---

**Built for microschool operators who need powerful financial insights without the complexity of enterprise software.**
# lanternprototype
