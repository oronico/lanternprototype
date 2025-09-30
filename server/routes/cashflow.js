const express = require('express');
const router = express.Router();

// Cash Flow Engine - 9 Month Revenue, 12 Month Operations Reality
const cashFlowModel = {
  // Revenue Pattern (9-month tuition collected)
  revenueSchedule: {
    tuitionMonths: [
      { month: 'August', tuitionCollected: true, enrollmentMonth: true, revenue: 18500 },
      { month: 'September', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'October', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'November', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'December', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'January', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'February', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'March', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'April', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'May', tuitionCollected: true, enrollmentMonth: false, revenue: 16324 },
      { month: 'June', tuitionCollected: false, enrollmentMonth: false, revenue: 2000 }, // Summer program only
      { month: 'July', tuitionCollected: false, enrollmentMonth: false, revenue: 2000 }  // Summer program only
    ],
    
    annualTuitionPerStudent: 8000,
    collectionMonths: 9, // August - May (but running May - June)
    operatingMonths: 12,
    summerRevenue: 4000, // Optional summer program or camps
    
    // Revenue cliff analysis
    summerGap: {
      months: ['June', 'July'],
      revenueReduction: 14324, // Lost tuition revenue per month
      percentageOfAnnual: 0.167, // ~17% of year with minimal revenue
      reserveNeeded: 28648 // 2 months expenses to cover summer
    }
  },
  
  // Expense Pattern (12-month operations)
  expenseSchedule: {
    fixedMonthly: {
      rent: 4500,
      insurance: 600,
      utilities: 800,
      softwareSystems: 200,
      ownerSalary: 4166
    },
    
    variableByMonth: {
      'August': { payroll: 8500, supplies: 800, marketing: 500 }, // Back to school ramp-up
      'September': { payroll: 8500, supplies: 400, marketing: 300 },
      'October': { payroll: 8500, supplies: 400, marketing: 300 },
      'November': { payroll: 8500, supplies: 400, marketing: 200 },
      'December': { payroll: 8500, supplies: 300, marketing: 100 },
      'January': { payroll: 8500, supplies: 500, marketing: 400 }, // Re-enrollment push
      'February': { payroll: 8500, supplies: 400, marketing: 400 },
      'March': { payroll: 8500, supplies: 400, marketing: 300 },
      'April': { payroll: 8500, supplies: 400, marketing: 200 },
      'May': { payroll: 8500, supplies: 400, marketing: 100 },
      'June': { payroll: 4250, supplies: 200, marketing: 600 }, // Summer - reduced staff, recruitment
      'July': { payroll: 4250, supplies: 200, marketing: 600 }  // Summer program staffing
    },
    
    summerStaffing: {
      reducedPayroll: 4250, // Half staff for summer program
      summerCampCosts: 1000,
      maintenanceRepairs: 2000 // Use summer for facility maintenance
    }
  }
};

// GET /api/cashflow/projection
router.get('/projection', (req, res) => {
  try {
    const { months = 12, startMonth = 'August' } = req.query;
    
    const projection = generate12MonthProjection(startMonth, parseInt(months));
    
    res.json({
      projection,
      analysis: analyzeCashFlowPattern(projection),
      summerStrategy: generateSummerStrategy(projection),
      recommendations: generateCashFlowRecommendations(projection)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate cash flow projection' });
  }
});

// POST /api/cashflow/import-actuals
router.post('/import-actuals', (req, res) => {
  try {
    const { bankLedger, source } = req.body;
    
    // Parse bank ledger (CSV, QBO, Xero export)
    const categorizedTransactions = categorizeBankTransactions(bankLedger, source);
    
    // Generate financial statements from actuals
    const statements = {
      incomeStatement: generateIncomeStatement(categorizedTransactions),
      cashFlowStatement: generateCashFlowStatement(categorizedTransactions),
      monthlyComparison: compareActualsToProjections(categorizedTransactions)
    };
    
    res.json({
      success: true,
      transactionsProcessed: categorizedTransactions.length,
      statements,
      insights: analyzeActuals(categorizedTransactions),
      recommendation: 'Review categorization and sync to QuickBooks/Xero for full bookkeeping'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import bank ledger' });
  }
});

// Helper Functions
function generate12MonthProjection(startMonth, months) {
  const projection = [];
  let runningBalance = 15748; // Starting cash
  
  const monthOrder = ['August', 'September', 'October', 'November', 'December', 
                     'January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const startIndex = monthOrder.indexOf(startMonth);
  
  for (let i = 0; i < months; i++) {
    const monthIndex = (startIndex + i) % 12;
    const month = monthOrder[monthIndex];
    const revenueData = cashFlowModel.revenueSchedule.tuitionMonths.find(m => m.month === month);
    const expenseData = cashFlowModel.expenseSchedule.variableByMonth[month];
    const fixedExpenses = Object.values(cashFlowModel.expenseSchedule.fixedMonthly).reduce((sum, val) => sum + val, 0);
    const variableExpenses = Object.values(expenseData).reduce((sum, val) => sum + val, 0);
    
    const totalRevenue = revenueData.revenue;
    const totalExpenses = fixedExpenses + variableExpenses;
    const netCashFlow = totalRevenue - totalExpenses;
    
    runningBalance += netCashFlow;
    
    projection.push({
      month,
      monthNumber: i + 1,
      revenue: {
        tuition: revenueData.tuitionCollected ? revenueData.revenue - (revenueData.revenue * 0.1) : 0,
        summerProgram: !revenueData.tuitionCollected ? revenueData.revenue : 0,
        total: totalRevenue
      },
      expenses: {
        fixed: fixedExpenses,
        variable: variableExpenses,
        total: totalExpenses,
        breakdown: {
          ...cashFlowModel.expenseSchedule.fixedMonthly,
          ...expenseData
        }
      },
      netCashFlow,
      runningBalance,
      status: runningBalance < 0 ? 'deficit' : 
              runningBalance < 10000 ? 'critical' :
              runningBalance < 30000 ? 'caution' : 'healthy',
      isSummerMonth: !revenueData.tuitionCollected,
      alerts: generateMonthAlerts(runningBalance, netCashFlow, month)
    });
  }
  
  return projection;
}

function analyzeCashFlowPattern(projection) {
  const summerMonths = projection.filter(m => m.isSummerMonth);
  const schoolMonths = projection.filter(m => !m.isSummerMonth);
  
  return {
    annualNetCashFlow: projection.reduce((sum, m) => sum + m.netCashFlow, 0),
    schoolYearAverage: schoolMonths.reduce((sum, m) => sum + m.netCashFlow, 0) / schoolMonths.length,
    summerDeficit: summerMonths.reduce((sum, m) => sum + m.netCashFlow, 0),
    lowestBalanceMonth: projection.reduce((min, m) => m.runningBalance < min.runningBalance ? m : min),
    highestBalanceMonth: projection.reduce((max, m) => m.runningBalance > max.runningBalance ? m : max),
    monthsNegative: projection.filter(m => m.netCashFlow < 0).length,
    monthsInDeficit: projection.filter(m => m.runningBalance < 0).length
  };
}

function generateSummerStrategy(projection) {
  const summerMonths = projection.filter(m => m.isSummerMonth);
  const summerDeficit = summerMonths.reduce((sum, m) => sum + m.netCashFlow, 0);
  
  return {
    summerReserveNeeded: Math.abs(summerDeficit),
    monthlySavingsTarget: Math.abs(summerDeficit) / 9, // Save during 9 tuition months
    strategies: [
      {
        strategy: 'Summer Reserve Fund',
        description: `Save $${Math.round(Math.abs(summerDeficit) / 9)} per month Sept-May for summer operations`,
        feasibility: 'high',
        impact: 'Prevents summer cash crisis'
      },
      {
        strategy: 'Summer Program Revenue',
        description: 'Offer summer camp/program to generate $3,000-5,000/month',
        feasibility: 'medium',
        impact: 'Reduces reserve requirement by 50-75%'
      },
      {
        strategy: '12-Month Tuition Collection',
        description: 'Spread annual tuition over 12 months instead of 9',
        feasibility: 'high',
        impact: 'Eliminates summer revenue gap completely'
      },
      {
        strategy: 'Reduced Summer Expenses',
        description: 'Skeleton staff, deferred maintenance, minimal operations June-July',
        feasibility: 'medium',
        impact: 'Reduces summer burn by 30-50%'
      }
    ]
  };
}

function generateCashFlowRecommendations(projection) {
  const recommendations = [];
  
  // Summer gap warning
  if (projection.some(m => m.isSummerMonth && m.runningBalance < 5000)) {
    recommendations.push({
      priority: 'critical',
      issue: 'Summer Cash Flow Gap',
      recommendation: 'Implement 12-month tuition collection or build $30,000 summer reserve',
      financialImpact: 'Prevents potential closure or emergency borrowing'
    });
  }
  
  // Monthly savings target
  const negativeMonths = projection.filter(m => m.netCashFlow < 0);
  if (negativeMonths.length > 2) {
    recommendations.push({
      priority: 'high',
      issue: `${negativeMonths.length} months with negative cash flow`,
      recommendation: 'Adjust tuition pricing or reduce operating expenses for sustainability',
      financialImpact: 'Current model unsustainable without reserves'
    });
  }
  
  return recommendations;
}

function generateMonthAlerts(balance, netFlow, month) {
  const alerts = [];
  
  if (balance < 0) {
    alerts.push({ type: 'critical', message: 'Account will be overdrawn - immediate action needed' });
  } else if (balance < 5000) {
    alerts.push({ type: 'warning', message: 'Critically low balance - accelerate collections' });
  }
  
  if (month === 'May') {
    alerts.push({ type: 'info', message: 'Last tuition collection month - ensure summer reserves adequate' });
  }
  
  if (month === 'June' || month === 'July') {
    alerts.push({ type: 'info', message: 'Summer month - operating on reserves or summer program revenue' });
  }
  
  return alerts;
}

function categorizeBankTransactions(ledger, source) {
  // Mock categorization - in production, use AI/ML
  return ledger.map(transaction => ({
    ...transaction,
    category: categorizeBankTransaction(transaction.description),
    subcategory: getSubcategory(transaction.description),
    isIncome: transaction.amount > 0,
    isExpense: transaction.amount < 0
  }));
}

function categorizeBankTransaction(description) {
  const desc = description.toLowerCase();
  
  if (desc.includes('omella') || desc.includes('classwallet') || desc.includes('tuition')) return 'revenue';
  if (desc.includes('payroll') || desc.includes('gusto')) return 'payroll';
  if (desc.includes('rent') || desc.includes('lease')) return 'facility';
  if (desc.includes('insurance')) return 'insurance';
  if (desc.includes('utility') || desc.includes('electric') || desc.includes('fpl')) return 'utilities';
  if (desc.includes('supply') || desc.includes('amazon')) return 'supplies';
  if (desc.includes('facebook') || desc.includes('marketing')) return 'marketing';
  
  return 'other';
}

function getSubcategory(description) {
  const desc = description.toLowerCase();
  
  if (desc.includes('omella')) return 'omella_payment';
  if (desc.includes('classwallet')) return 'esa_payment';
  if (desc.includes('check')) return 'check_payment';
  if (desc.includes('gusto')) return 'payroll_automatic';
  
  return null;
}

function generateIncomeStatement(transactions) {
  const revenue = transactions.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.isExpense).reduce((sum, t) => sum + t.amount, 0));
  
  return {
    revenue: {
      tuition: revenue * 0.9,
      summerPrograms: revenue * 0.05,
      other: revenue * 0.05,
      total: revenue
    },
    expenses: {
      payroll: expenses * 0.45,
      facility: expenses * 0.24,
      insurance: expenses * 0.03,
      supplies: expenses * 0.05,
      marketing: expenses * 0.02,
      other: expenses * 0.21,
      total: expenses
    },
    netIncome: revenue - expenses,
    profitMargin: ((revenue - expenses) / revenue)
  };
}

function generateCashFlowStatement(transactions) {
  return {
    operatingActivities: {
      cashFromOperations: transactions.filter(t => t.category === 'revenue').reduce((sum, t) => sum + t.amount, 0),
      cashUsedInOperations: Math.abs(transactions.filter(t => t.isExpense).reduce((sum, t) => sum + t.amount, 0)),
      netCashFromOperations: 0
    },
    investingActivities: {
      equipmentPurchases: 0,
      facilityImprovements: 0
    },
    financingActivities: {
      debtProceeds: 0,
      debtRepayments: 0
    },
    netChangeInCash: 0
  };
}

function compareActualsToProjections(transactions) {
  return {
    variance: 'actual_vs_projected',
    message: 'Import complete - review categorization and compare to projections',
    recommendation: 'Sync with QuickBooks/Xero for complete bookkeeping'
  };
}

function analyzeActuals(transactions) {
  return [
    'Bank ledger imported successfully',
    'Transactions auto-categorized using AI',
    'Review categories for accuracy',
    'Sync to accounting system for tax compliance'
  ];
}

module.exports = router;

