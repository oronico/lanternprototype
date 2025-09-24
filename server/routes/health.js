const express = require('express');
const router = express.Router();

// Comprehensive financial health data with real-time calculations
const mockFinancialData = {
  // Current financial position
  currentCash: 3247,
  monthlyRevenue: 16324,
  monthlyExpenses: 19166,
  totalStudents: 28,
  goalStudents: 35,
  facilitySquareFootage: 1600,
  monthlyRent: 4500,
  staffingCosts: 8500,
  totalFacilityCosts: 4500,
  savingsBalance: 12500,
  totalDebt: 0,
  monthlyDebtService: 0,
  
  // Operational metrics
  newEnrollments: 3,
  withdrawals: 1,
  staffTurnover: 1,
  totalStaff: 4,
  
  // Historical data for trends
  previousMonthCash: 4447,
  previousMonthRevenue: 16324,
  yearToDateRetention: 0.89
};

const calculateHealthMetrics = (data) => {
  const metrics = {};
  
  // Days Cash on Hand
  const dailyExpenses = data.monthlyExpenses / 30;
  metrics.daysCashOnHand = {
    value: Math.round(data.currentCash / dailyExpenses),
    benchmark: 30,
    target: 45,
    calculation: `$${data.currentCash.toLocaleString()} ÷ ($${data.monthlyExpenses.toLocaleString()} ÷ 30)`,
    trend: data.currentCash > data.previousMonthCash ? 'improving' : 'declining'
  };
  
  // Rent to Revenue Ratio
  metrics.rentToRevenueRatio = {
    value: Math.round((data.monthlyRent / data.monthlyRevenue) * 100) / 100,
    benchmark: 0.20,
    target: 0.15,
    calculation: `$${data.monthlyRent.toLocaleString()} ÷ $${data.monthlyRevenue.toLocaleString()}`,
    trend: 'stable'
  };
  
  // Debt Service Coverage Ratio (DSCR)
  const netIncome = data.monthlyRevenue - data.monthlyExpenses;
  metrics.debtServiceCoverage = {
    value: data.monthlyDebtService > 0 ? Math.round((netIncome / data.monthlyDebtService) * 100) / 100 : null,
    benchmark: 1.25,
    target: 1.50,
    calculation: data.monthlyDebtService > 0 ? `$${netIncome.toLocaleString()} ÷ $${data.monthlyDebtService.toLocaleString()}` : 'No debt service',
    trend: 'stable'
  };
  
  // Savings as % of Monthly Expenses
  metrics.savingsRatio = {
    value: Math.round((data.savingsBalance / data.monthlyExpenses) * 100) / 100,
    benchmark: 3.0,
    target: 6.0,
    calculation: `$${data.savingsBalance.toLocaleString()} ÷ $${data.monthlyExpenses.toLocaleString()}`,
    trend: 'stable'
  };
  
  // Staffing Cost to Revenue Ratio
  metrics.staffingRatio = {
    value: Math.round((data.staffingCosts / data.monthlyRevenue) * 100) / 100,
    benchmark: 0.50,
    target: 0.45,
    calculation: `$${data.staffingCosts.toLocaleString()} ÷ $${data.monthlyRevenue.toLocaleString()}`,
    trend: 'stable'
  };
  
  // Staff Attrition Rate (annualized)
  metrics.staffAttrition = {
    value: Math.round((data.staffTurnover / data.totalStaff) * 12 * 100) / 100,
    benchmark: 0.20,
    target: 0.10,
    calculation: `${data.staffTurnover} departures ÷ ${data.totalStaff} staff × 12 months`,
    trend: 'stable'
  };
  
  // Student Retention Rate
  metrics.studentRetention = {
    value: data.yearToDateRetention,
    benchmark: 0.90,
    target: 0.95,
    calculation: 'Year-to-date retention based on enrollment data',
    trend: 'improving'
  };
  
  // Enrollment to Goal %
  metrics.enrollmentToGoal = {
    value: Math.round((data.totalStudents / data.goalStudents) * 100) / 100,
    benchmark: 0.90,
    target: 1.00,
    calculation: `${data.totalStudents} students ÷ ${data.goalStudents} goal`,
    trend: 'improving'
  };
  
  // Cost per Pupil
  metrics.costPerPupil = {
    value: Math.round(data.monthlyExpenses / data.totalStudents),
    benchmark: 600,
    target: 550,
    calculation: `$${data.monthlyExpenses.toLocaleString()} ÷ ${data.totalStudents} students`,
    trend: 'stable'
  };
  
  // Cost per Square Foot
  metrics.costPerSquareFoot = {
    value: Math.round((data.totalFacilityCosts / data.facilitySquareFootage) * 100) / 100,
    benchmark: 2.50,
    target: 2.00,
    calculation: `$${data.totalFacilityCosts.toLocaleString()} ÷ ${data.facilitySquareFootage} sq ft`,
    trend: 'stable'
  };
  
  // Add status and recommendations for each metric
  Object.keys(metrics).forEach(key => {
    const metric = metrics[key];
    if (metric.value === null) {
      metric.status = 'neutral';
      metric.recommendation = 'No action needed - metric not applicable';
      return;
    }
    
    const isRatio = metric.value <= 1;
    const percentageValue = isRatio ? metric.value : metric.value / 100;
    const benchmarkValue = metric.benchmark <= 1 ? metric.benchmark : metric.benchmark / 100;
    
    // Determine if higher or lower is better for this metric
    const higherIsBetter = ['debtServiceCoverage', 'savingsRatio', 'studentRetention', 'enrollmentToGoal'].includes(key);
    
    let status, recommendation;
    
    if (higherIsBetter) {
      if (metric.value >= metric.target) {
        status = 'excellent';
        recommendation = 'Excellent performance - maintain current practices';
      } else if (metric.value >= metric.benchmark) {
        status = 'good';
        recommendation = 'Good performance - minor improvements possible';
      } else if (metric.value >= metric.benchmark * 0.8) {
        status = 'warning';
        recommendation = 'Below benchmark - needs attention';
      } else {
        status = 'danger';
        recommendation = 'Critical - immediate action required';
      }
    } else {
      if (metric.value <= metric.target) {
        status = 'excellent';
        recommendation = 'Excellent efficiency - maintain current practices';
      } else if (metric.value <= metric.benchmark) {
        status = 'good';
        recommendation = 'Within acceptable range - monitor closely';
      } else if (metric.value <= metric.benchmark * 1.2) {
        status = 'warning';
        recommendation = 'Above benchmark - needs attention';
      } else {
        status = 'danger';
        recommendation = 'Critical - immediate action required';
      }
    }
    
    metric.status = status;
    metric.recommendation = recommendation;
  });
  
  return metrics;
};

const mockHealthData = calculateHealthMetrics(mockFinancialData);

// GET /api/health/scorecard - Real-time financial health scorecard
router.get('/scorecard', (req, res) => {
  try {
    const metrics = calculateHealthMetrics(mockFinancialData);
    const overallScore = calculateOverallHealthScore(metrics);
    
    // Create prioritized scorecard
    const scorecard = {
      overallScore,
      overallStatus: getOverallStatus(overallScore),
      lastUpdated: new Date().toISOString(),
      criticalMetrics: [],
      warningMetrics: [],
      goodMetrics: [],
      excellentMetrics: []
    };
    
    // Categorize metrics by status
    Object.entries(metrics).forEach(([key, metric]) => {
      const metricData = {
        key,
        name: getMetricDisplayName(key),
        value: metric.value,
        benchmark: metric.benchmark,
        target: metric.target,
        status: metric.status,
        trend: metric.trend,
        calculation: metric.calculation,
        recommendation: metric.recommendation,
        unit: getMetricUnit(key),
        displayValue: formatMetricValue(key, metric.value)
      };
      
      if (metric.status === 'danger') {
        scorecard.criticalMetrics.push(metricData);
      } else if (metric.status === 'warning') {
        scorecard.warningMetrics.push(metricData);
      } else if (metric.status === 'good') {
        scorecard.goodMetrics.push(metricData);
      } else if (metric.status === 'excellent') {
        scorecard.excellentMetrics.push(metricData);
      }
    });
    
    // Add quick insights
    scorecard.insights = generateQuickInsights(metrics);
    scorecard.urgentActions = generateUrgentActions(metrics);
    
    res.json(scorecard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health scorecard' });
  }
});

// GET /api/health/metrics
router.get('/metrics', (req, res) => {
  try {
    const overallScore = calculateOverallHealthScore(mockHealthData);
    
    res.json({
      overallScore,
      metrics: mockHealthData,
      lastUpdated: new Date().toISOString(),
      insights: generateInsights(mockHealthData)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// GET /api/health/loan-readiness
router.get('/loan-readiness', (req, res) => {
  try {
    const loanReadiness = calculateLoanReadiness(mockHealthData);
    
    res.json({
      score: loanReadiness.score,
      status: loanReadiness.status,
      requirements: loanReadiness.requirements,
      improvements: loanReadiness.improvements,
      timeline: loanReadiness.timeline
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate loan readiness' });
  }
});

// GET /api/health/trends
router.get('/trends', (req, res) => {
  try {
    // Mock historical data for trends
    const trends = {
      daysCashOnHand: [
        { month: 'July', value: 12 },
        { month: 'August', value: 9 },
        { month: 'September', value: 8 },
        { month: 'October', value: 7 },
        { month: 'November', value: 7 }
      ],
      collectionRate: [
        { month: 'July', value: 0.89 },
        { month: 'August', value: 0.86 },
        { month: 'September', value: 0.84 },
        { month: 'October', value: 0.83 },
        { month: 'November', value: 0.82 }
      ],
      revenue: [
        { month: 'July', value: 15500 },
        { month: 'August', value: 16200 },
        { month: 'September', value: 16324 },
        { month: 'October', value: 16324 },
        { month: 'November', value: 16324 }
      ]
    };
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health trends' });
  }
});

// POST /api/health/action-plan
router.post('/action-plan', (req, res) => {
  try {
    const { priority = 'high' } = req.body;
    
    const actionPlan = generateActionPlan(mockHealthData, priority);
    
    res.json({
      actionPlan,
      estimatedImpact: calculateActionImpact(actionPlan),
      timeline: '90 days',
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate action plan' });
  }
});

function calculateOverallHealthScore(healthData) {
  const weights = {
    daysCashOnHand: 0.20,
    rentToRevenueRatio: 0.15,
    debtServiceCoverage: 0.10,
    savingsRatio: 0.15,
    staffingRatio: 0.10,
    staffAttrition: 0.05,
    studentRetention: 0.10,
    enrollmentToGoal: 0.10,
    costPerPupil: 0.05
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(metric => {
    const data = healthData[metric];
    if (!data || data.value === null) return;
    
    let score = 0;
    
    switch (data.status) {
      case 'excellent':
        score = 100;
        break;
      case 'good':
        score = 80;
        break;
      case 'warning':
        score = 60;
        break;
      case 'danger':
        score = 20;
        break;
      default:
        score = 50;
    }
    
    totalScore += score * weights[metric];
    totalWeight += weights[metric];
  });
  
  return Math.round(totalScore / totalWeight);
}

function getOverallStatus(score) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'warning';
  return 'critical';
}

function getMetricDisplayName(key) {
  const names = {
    daysCashOnHand: 'Days Cash on Hand',
    rentToRevenueRatio: 'Rent to Revenue Ratio',
    debtServiceCoverage: 'Debt Service Coverage Ratio',
    savingsRatio: 'Savings Buffer',
    staffingRatio: 'Staffing Cost Ratio',
    staffAttrition: 'Staff Attrition Rate',
    studentRetention: 'Student Retention Rate',
    enrollmentToGoal: 'Enrollment to Goal',
    costPerPupil: 'Cost per Pupil',
    costPerSquareFoot: 'Cost per Square Foot'
  };
  return names[key] || key;
}

function getMetricUnit(key) {
  const units = {
    daysCashOnHand: 'days',
    rentToRevenueRatio: '%',
    debtServiceCoverage: 'x',
    savingsRatio: 'months',
    staffingRatio: '%',
    staffAttrition: '%',
    studentRetention: '%',
    enrollmentToGoal: '%',
    costPerPupil: '$',
    costPerSquareFoot: '$/sq ft'
  };
  return units[key] || '';
}

function formatMetricValue(key, value) {
  if (value === null) return 'N/A';
  
  const percentageMetrics = ['rentToRevenueRatio', 'staffingRatio', 'staffAttrition', 'studentRetention', 'enrollmentToGoal'];
  const currencyMetrics = ['costPerPupil'];
  const ratioMetrics = ['debtServiceCoverage'];
  
  if (percentageMetrics.includes(key)) {
    return `${Math.round(value * 100)}%`;
  } else if (currencyMetrics.includes(key)) {
    return `$${value.toLocaleString()}`;
  } else if (ratioMetrics.includes(key)) {
    return `${value}x`;
  } else if (key === 'savingsRatio') {
    return `${value} months`;
  } else if (key === 'costPerSquareFoot') {
    return `$${value}/sq ft`;
  } else {
    return value.toString();
  }
}

function generateQuickInsights(metrics) {
  const insights = [];
  
  // Cash flow insights
  if (metrics.daysCashOnHand.status === 'danger') {
    insights.push({
      type: 'critical',
      title: 'Cash Crisis Imminent',
      message: `Only ${metrics.daysCashOnHand.value} days of cash remaining`,
      action: 'Collect outstanding payments immediately'
    });
  }
  
  // Facility cost insights
  if (metrics.rentToRevenueRatio.status === 'danger') {
    insights.push({
      type: 'warning',
      title: 'Facility Costs Too High',
      message: `Rent consumes ${Math.round(metrics.rentToRevenueRatio.value * 100)}% of revenue`,
      action: 'Renegotiate lease or find shared space'
    });
  }
  
  // Enrollment insights
  if (metrics.enrollmentToGoal.value < 0.85) {
    insights.push({
      type: 'opportunity',
      title: 'Enrollment Below Target',
      message: `At ${Math.round(metrics.enrollmentToGoal.value * 100)}% of enrollment goal`,
      action: 'Accelerate marketing and outreach efforts'
    });
  }
  
  // Retention insights
  if (metrics.studentRetention.status === 'excellent') {
    insights.push({
      type: 'positive',
      title: 'Excellent Student Retention',
      message: `${Math.round(metrics.studentRetention.value * 100)}% retention rate`,
      action: 'Maintain current practices and use as marketing tool'
    });
  }
  
  return insights;
}

function generateUrgentActions(metrics) {
  const actions = [];
  
  Object.entries(metrics).forEach(([key, metric]) => {
    if (metric.status === 'danger') {
      actions.push({
        priority: 'high',
        metric: getMetricDisplayName(key),
        currentValue: formatMetricValue(key, metric.value),
        targetValue: formatMetricValue(key, metric.target),
        action: metric.recommendation,
        timeframe: 'Immediate (1-2 weeks)'
      });
    } else if (metric.status === 'warning') {
      actions.push({
        priority: 'medium',
        metric: getMetricDisplayName(key),
        currentValue: formatMetricValue(key, metric.value),
        targetValue: formatMetricValue(key, metric.target),
        action: metric.recommendation,
        timeframe: 'Short-term (1 month)'
      });
    }
  });
  
  // Sort by priority
  return actions.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    return 0;
  });
}

function calculateLoanReadiness(healthData) {
  const requirements = [
    {
      requirement: 'Debt Service Coverage Ratio ≥ 1.25',
      current: healthData.debtServiceCoverage.value,
      target: 1.25,
      met: false,
      impact: 'High'
    },
    {
      requirement: 'Days Cash on Hand ≥ 30',
      current: healthData.daysCashOnHand.value,
      target: 30,
      met: false,
      impact: 'High'
    },
    {
      requirement: 'Collection Rate ≥ 90%',
      current: healthData.collectionRate.value * 100,
      target: 90,
      met: false,
      impact: 'Medium'
    },
    {
      requirement: 'Owner Compensation > $40k annually',
      current: healthData.ownerCompensation.value,
      target: 40000,
      met: false,
      impact: 'Medium'
    },
    {
      requirement: 'Facility Burden < 25%',
      current: healthData.facilityBurden.value * 100,
      target: 25,
      met: false,
      impact: 'Low'
    }
  ];
  
  const metRequirements = requirements.filter(req => req.met).length;
  const score = Math.round((metRequirements / requirements.length) * 100);
  
  let status = 'not_ready';
  if (score >= 80) status = 'ready';
  else if (score >= 60) status = 'nearly_ready';
  
  const improvements = requirements
    .filter(req => !req.met)
    .map(req => ({
      action: `Improve ${req.requirement}`,
      currentGap: req.target - req.current,
      priority: req.impact
    }));
  
  return {
    score,
    status,
    requirements,
    improvements,
    timeline: score >= 60 ? '3-6 months' : '6-12 months'
  };
}

function generateInsights(healthData) {
  const insights = [];
  
  if (healthData.daysCashOnHand.value < 15) {
    insights.push({
      type: 'critical',
      title: 'Cash Flow Crisis',
      description: 'Your school is at immediate risk of running out of cash',
      actions: ['Collect outstanding payments', 'Secure emergency funding', 'Reduce non-essential expenses']
    });
  }
  
  if (healthData.facilityBurden.value > 0.30) {
    insights.push({
      type: 'warning',
      title: 'Facility Costs Too High',
      description: 'Facility costs are consuming too much of your revenue',
      actions: ['Renegotiate lease terms', 'Find sublease opportunities', 'Consider relocation']
    });
  }
  
  if (healthData.collectionRate.value < 0.85) {
    insights.push({
      type: 'opportunity',
      title: 'Payment Collection Issues',
      description: 'Improving collections could significantly boost cash flow',
      actions: ['Implement auto-pay', 'Stricter late payment policies', 'Regular follow-up system']
    });
  }
  
  return insights;
}

function generateActionPlan(healthData, priority) {
  const actions = [];
  
  if (priority === 'high' || priority === 'all') {
    if (healthData.daysCashOnHand.status === 'danger') {
      actions.push({
        priority: 'immediate',
        title: 'Emergency Cash Flow Management',
        steps: [
          'Contact all families with outstanding payments',
          'Offer payment plans to struggling families',
          'Delay non-critical expenses',
          'Explore emergency funding options'
        ],
        timeline: '1-2 weeks',
        estimatedImpact: '$4,915 potential collection'
      });
    }
    
    if (healthData.facilityBurden.status === 'danger') {
      actions.push({
        priority: 'high',
        title: 'Reduce Facility Burden',
        steps: [
          'Schedule meeting with landlord',
          'Research comparable lease rates',
          'Explore sublease opportunities',
          'Consider shared space arrangements'
        ],
        timeline: '30-60 days',
        estimatedImpact: '$500-1000/month savings'
      });
    }
  }
  
  if (priority === 'medium' || priority === 'all') {
    actions.push({
      priority: 'medium',
      title: 'Improve Payment Collections',
      steps: [
        'Set up automatic payment processing',
        'Implement late payment fees',
        'Create payment reminder system',
        'Offer early payment discounts'
      ],
      timeline: '30 days',
      estimatedImpact: '5-10% improvement in collection rate'
    });
  }
  
  return actions;
}

function calculateActionImpact(actionPlan) {
  return {
    potentialCashImprovement: '$6,000-8,000',
    timeToPositiveChange: '30-45 days',
    riskReduction: 'High',
    loanReadinessImprovement: '+25-35 points'
  };
}

module.exports = router;
