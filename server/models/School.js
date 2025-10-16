const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['equipment', 'line-of-credit', 'sba', 'personal', 'other'],
    required: true
  },
  principalBalance: {
    type: Number,
    required: true
  },
  monthlyPayment: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  startDate: Date,
  maturityDate: Date,
  lender: String,
  notes: String
});

const historicalDataSchema = new mongoose.Schema({
  year: Number,
  profitLoss: {
    revenue: Number,
    expenses: Number,
    netIncome: Number,
    breakdown: mongoose.Schema.Types.Mixed
  },
  cashFlow: {
    beginning: Number,
    ending: Number,
    operatingCash: Number,
    investingCash: Number,
    financingCash: Number,
    monthlyData: [mongoose.Schema.Types.Mixed]
  },
  enrollment: {
    beginning: Number,
    ending: Number,
    average: Number,
    monthlyData: [mongoose.Schema.Types.Mixed]
  }
});

const schoolSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic Information
  name: {
    type: String,
    required: true
  },
  operatingStage: {
    type: String,
    enum: ['year-0', 'year-1-2', 'year-3-plus'],
    required: true
  },
  fiscalYearStart: {
    type: Date,
    required: true
  },
  fiscalYearEnd: {
    type: Date,
    required: true
  },
  
  // Enrollment
  currentEnrollment: {
    type: Number,
    default: 0
  },
  targetEnrollment: {
    type: Number,
    default: 0
  },
  breakEvenEnrollment: Number,
  
  // Financial Connections
  connections: {
    accountingSystem: {
      type: String,
      enum: ['quickbooks', 'xero', 'wave', 'none']
    },
    accountingConnected: {
      type: Boolean,
      default: false
    },
    accountingCredentials: mongoose.Schema.Types.Mixed,
    
    payrollSystem: {
      type: String,
      enum: ['gusto', 'adp', 'quickbooks', 'other', 'none']
    },
    payrollConnected: {
      type: Boolean,
      default: false
    },
    payrollCredentials: mongoose.Schema.Types.Mixed,
    
    bankingConnected: {
      type: Boolean,
      default: false
    },
    plaidAccessToken: String,
    plaidItemId: String,
    
    creditCardsConnected: {
      type: Boolean,
      default: false
    },
    creditCardAccounts: [mongoose.Schema.Types.Mixed]
  },
  
  // Loans & Debt
  loans: [loanSchema],
  
  // Historical Data
  historicalData: [historicalDataSchema],
  
  // Current Year Proforma
  proforma: {
    year: Number,
    projectedRevenue: Number,
    projectedExpenses: Number,
    projectedNetIncome: Number,
    monthlyProjections: [mongoose.Schema.Types.Mixed],
    assumptions: mongoose.Schema.Types.Mixed
  },
  
  // Onboarding Status
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  onboardingCompletedAt: Date,
  
  // Settings
  settings: {
    // Accounting Method
    accountingMethod: {
      type: String,
      enum: ['cash', 'accrual'],
      default: 'cash'  // Most schools use cash accounting
    },
    
    cashReserveTarget: {
      type: Number,
      default: 30 // days
    },
    debtServiceCoverageTarget: {
      type: Number,
      default: 1.25
    },
    enrollmentWarningThreshold: {
      type: Number,
      default: 0.9 // 90% of target
    },
    enableDailyNudges: {
      type: Boolean,
      default: true
    },
    enableMilestones: {
      type: Boolean,
      default: true
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Virtual for total debt
schoolSchema.virtual('totalDebt').get(function() {
  return this.loans.reduce((sum, loan) => sum + loan.principalBalance, 0);
});

// Virtual for monthly debt service
schoolSchema.virtual('monthlyDebtService').get(function() {
  return this.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
});

module.exports = mongoose.model('School', schoolSchema);

