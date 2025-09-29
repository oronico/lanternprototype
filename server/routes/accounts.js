const express = require('express');
const router = express.Router();

// Financial Accounts Management (Credit Karma-style for Schools)
const connectedAccounts = {
  bankAccounts: [
    {
      id: 'bank_001',
      institutionName: 'Chase Business Banking',
      accountName: 'Sunshine Microschool Operating',
      accountType: 'checking',
      accountNumber: '****1234',
      routingNumber: '021000021',
      currentBalance: 3247.89,
      availableBalance: 3247.89,
      lastUpdated: '2024-11-15T10:30:00Z',
      status: 'connected',
      plaidAccountId: 'plaid_acc_001',
      
      // Recent transactions (last 7 days)
      recentTransactions: [
        { date: '2024-11-15', description: 'Omella Deposit', amount: 8750.00, type: 'deposit', category: 'tuition_revenue' },
        { date: '2024-11-14', description: 'Payroll - Gusto', amount: -8500.00, type: 'withdrawal', category: 'payroll_expense' },
        { date: '2024-11-13', description: 'Rent Payment', amount: -4500.00, type: 'withdrawal', category: 'facility_expense' },
        { date: '2024-11-12', description: 'Utilities - FPL', amount: -342.18, type: 'withdrawal', category: 'operating_expense' }
      ],
      
      // Account health metrics
      healthMetrics: {
        averageBalance: 4200.00,
        lowBalanceThreshold: 2000.00,
        daysUntilLowBalance: 7,
        monthlyInflow: 16324.00,
        monthlyOutflow: 19166.00,
        netCashFlow: -2842.00,
        volatilityScore: 'high'
      }
    },
    
    {
      id: 'bank_002', 
      institutionName: 'Chase Business Savings',
      accountName: 'Emergency Reserve Fund',
      accountType: 'savings',
      accountNumber: '****5678',
      currentBalance: 12500.00,
      availableBalance: 12500.00,
      lastUpdated: '2024-11-15T10:30:00Z',
      status: 'connected',
      plaidAccountId: 'plaid_acc_002',
      
      recentTransactions: [
        { date: '2024-10-01', description: 'Transfer from Operating', amount: 2500.00, type: 'deposit', category: 'emergency_fund' }
      ],
      
      healthMetrics: {
        targetBalance: 57500.00, // 3 months operating expenses
        monthsOfExpenses: 0.65,
        recommendedContribution: 1500.00,
        autoSaveEnabled: false
      }
    }
  ],
  
  creditAccounts: [
    {
      id: 'credit_001',
      institutionName: 'Chase Business Credit Card',
      accountName: 'Business Rewards Card',
      accountType: 'credit_card',
      accountNumber: '****9876',
      currentBalance: -2400.00, // Negative = owe money
      creditLimit: 15000.00,
      availableCredit: 12600.00,
      lastUpdated: '2024-11-15T10:30:00Z',
      status: 'connected',
      
      // Credit utilization and health
      creditMetrics: {
        utilizationRate: 0.16, // 16% utilization
        paymentDueDate: '2024-11-28',
        minimumPayment: 75.00,
        lastPaymentAmount: 800.00,
        lastPaymentDate: '2024-10-28',
        interestRate: 0.1899,
        creditScore: 'good', // Based on utilization and payment history
        alerts: []
      },
      
      recentTransactions: [
        { date: '2024-11-14', description: 'Office Supplies - Staples', amount: -156.78, category: 'office_supplies' },
        { date: '2024-11-12', description: 'Professional Development', amount: -299.00, category: 'staff_development' },
        { date: '2024-11-10', description: 'Marketing - Facebook Ads', amount: -125.00, category: 'marketing' }
      ]
    },
    
    {
      id: 'credit_002',
      institutionName: 'Capital One Business Line of Credit',
      accountName: 'Business Line of Credit',
      accountType: 'line_of_credit',
      accountNumber: '****4321',
      currentBalance: -8500.00,
      creditLimit: 25000.00,
      availableCredit: 16500.00,
      lastUpdated: '2024-11-15T10:30:00Z',
      status: 'connected',
      
      creditMetrics: {
        utilizationRate: 0.34, // 34% utilization  
        interestRate: 0.12,
        monthlyPayment: 425.00,
        paymentDueDate: '2024-11-30',
        purpose: 'Cash flow management',
        establishedDate: '2023-06-15',
        alerts: ['High utilization - consider reducing balance']
      }
    }
  ],
  
  loanAccounts: [
    {
      id: 'loan_001',
      institutionName: 'SBA Approved Lender',
      accountName: 'Equipment Financing',
      accountType: 'term_loan',
      accountNumber: '****7890',
      currentBalance: -16000.00,
      originalAmount: -25000.00,
      lastUpdated: '2024-11-15T10:30:00Z',
      status: 'connected',
      
      loanMetrics: {
        monthlyPayment: 425.00,
        interestRate: 0.0675,
        termRemaining: '28 months',
        nextPaymentDate: '2024-12-01',
        principalPaid: 9000.00,
        interestPaid: 2800.00,
        paymentHistory: 'excellent',
        purpose: 'Classroom furniture and technology'
      }
    }
  ]
};

// Account aggregation summary
const accountSummary = {
  totalLiquidAssets: 15747.89, // Checking + Savings
  totalDebt: -26900.00, // Credit cards + loans  
  netWorth: -11152.11,
  monthlyDebtService: 925.00, // All monthly payments
  debtToIncomeRatio: 0.057, // Monthly debt service / monthly revenue
  creditUtilization: 0.22, // Average across all credit accounts
  financialHealthScore: 68, // 0-100 based on all factors
  
  alerts: [
    { type: 'critical', message: 'Operating account will go negative in 7 days without action', priority: 1 },
    { type: 'warning', message: 'Emergency fund below 1 month expenses target', priority: 2 },
    { type: 'info', message: 'Credit utilization healthy at 22%', priority: 3 }
  ],
  
  recommendations: [
    'Transfer $2,000 from savings to checking to prevent overdraft',
    'Set up automatic savings transfer of $500/month to build emergency fund',
    'Consider paying down line of credit to reduce interest expense',
    'Apply for SBA loan to consolidate debt at lower interest rate'
  ]
};

// GET /api/accounts/overview
router.get('/overview', (req, res) => {
  try {
    res.json({
      accounts: connectedAccounts,
      summary: accountSummary,
      lastRefresh: new Date().toISOString(),
      refreshStatus: 'completed',
      plaidStatus: 'connected'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch account overview' });
  }
});

// GET /api/accounts/health-score
router.get('/health-score', (req, res) => {
  try {
    const healthFactors = calculateAccountHealthFactors(connectedAccounts, accountSummary);
    
    res.json({
      overallScore: accountSummary.financialHealthScore,
      factors: healthFactors,
      trends: {
        direction: 'declining',
        monthOverMonth: -5,
        keyFactors: ['Negative cash flow', 'High debt utilization', 'Low emergency reserves']
      },
      benchmarks: {
        similarSchools: {
          averageScore: 74,
          topPerformer: 92,
          yourPercentile: 35
        }
      },
      improvement: {
        quickWins: [
          { action: 'Increase emergency fund', impact: '+8 points', timeframe: '30 days' },
          { action: 'Reduce credit utilization', impact: '+12 points', timeframe: '60 days' },
          { action: 'Improve cash flow', impact: '+15 points', timeframe: '90 days' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
});

// POST /api/accounts/connect
router.post('/connect', (req, res) => {
  try {
    const { institutionId, accountType, credentials } = req.body;
    
    // Mock Plaid-style account connection
    const newAccount = {
      id: `acc_${Date.now()}`,
      institutionName: institutionId,
      accountType,
      status: 'connecting',
      connectionDate: new Date().toISOString(),
      plaidLinkToken: `link_token_${Math.random()}`,
      
      // Connection steps
      steps: [
        { step: 'authenticate', status: 'completed', description: 'Bank authentication' },
        { step: 'verify', status: 'in_progress', description: 'Account verification' },
        { step: 'sync', status: 'pending', description: 'Initial data sync' },
        { step: 'categorize', status: 'pending', description: 'Transaction categorization' }
      ]
    };
    
    res.json({
      success: true,
      account: newAccount,
      nextSteps: [
        'Complete account verification',
        'Allow 24-48 hours for initial sync',
        'Review transaction categorization',
        'Set up account monitoring alerts'
      ],
      estimatedSyncTime: '2-4 hours'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect account' });
  }
});

// GET /api/accounts/cash-flow-forecast
router.get('/cash-flow-forecast', (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Generate cash flow forecast based on account patterns
    const forecast = generateCashFlowForecast(connectedAccounts, parseInt(days));
    
    res.json({
      forecast,
      assumptions: [
        'Based on historical transaction patterns',
        'Includes scheduled recurring payments',
        'Factors in seasonal variations',
        'Updates daily with new transaction data'
      ],
      confidence: 85, // Confidence percentage in forecast accuracy
      lastCalculated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cash flow forecast' });
  }
});

function calculateAccountHealthFactors(accounts, summary) {
  return {
    liquidityHealth: {
      score: summary.totalLiquidAssets > 10000 ? 85 : 45,
      factor: 'Emergency fund adequacy',
      current: `${(summary.totalLiquidAssets / 19166).toFixed(1)} months expenses`,
      target: '3+ months expenses',
      impact: 'high'
    },
    
    debtHealth: {
      score: summary.creditUtilization < 0.30 ? 75 : 45,
      factor: 'Credit utilization',
      current: `${Math.round(summary.creditUtilization * 100)}%`,
      target: '<30%',
      impact: 'medium'
    },
    
    cashFlowHealth: {
      score: summary.netWorth > 0 ? 85 : 35,
      factor: 'Net cash flow',
      current: summary.monthlyDebtService < 16324 * 0.1 ? 'healthy' : 'concerning',
      target: '<10% of revenue',
      impact: 'high'
    },
    
    paymentHistory: {
      score: 90, // Based on loan payment history
      factor: 'Payment reliability',
      current: 'Excellent payment history',
      target: 'Maintain current performance',
      impact: 'medium'
    }
  };
}

function generateCashFlowForecast(accounts, days) {
  const dailyForecast = [];
  let runningBalance = accounts.bankAccounts[0].currentBalance;
  
  // Projected daily changes based on historical patterns
  const dailyPatterns = {
    // Expected inflows
    tuitionInflow: 16324 / 30, // Monthly tuition spread over 30 days
    
    // Expected outflows  
    facilityOutflow: -4500 / 30,
    payrollOutflow: -8500 / 30,
    otherOutflow: -2500 / 30
  };
  
  for (let day = 0; day < days; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    
    // Calculate daily net change
    let dailyChange = 0;
    
    // Add scheduled payments/receipts
    if (day === 1) dailyChange += 1749; // Expected today
    if (day === 15) dailyChange -= 8500; // Payroll
    if (day === 1) dailyChange -= 4500; // Rent
    
    // Add daily operational flow
    dailyChange += (dailyPatterns.tuitionInflow + dailyPatterns.facilityOutflow + 
                   dailyPatterns.payrollOutflow + dailyPatterns.otherOutflow);
    
    runningBalance += dailyChange;
    
    dailyForecast.push({
      date: date.toISOString().split('T')[0],
      projectedBalance: Math.round(runningBalance * 100) / 100,
      dailyChange: Math.round(dailyChange * 100) / 100,
      status: runningBalance < 0 ? 'negative' : runningBalance < 1000 ? 'critical' : 'healthy',
      confidence: 85 - (day * 2) // Confidence decreases over time
    });
  }
  
  return dailyForecast;
}

module.exports = router;
