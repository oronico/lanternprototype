const express = require('express');
const router = express.Router();

// POST /api/calculator/tuition-engine
router.post('/tuition-engine', (req, res) => {
  try {
    const {
      // Current Situation
      studentCount = 28,
      currentTuition = 583,
      targetStudentCount = 35,
      
      // ESA & Voucher Data
      esaAmount = 583,
      esaEligibleStudents = 18,
      voucherPrograms = ['Florida ESA', 'Step Up'],
      
      // Operating Costs
      facilityCost = 4500,
      payrollCost = 8500,
      ownerSalary = 4166,
      utilitiesCost = 800,
      insuranceCost = 600,
      suppliesCost = 400,
      marketingCost = 300,
      otherExpenses = 1200,
      
      // Business Parameters
      operatingMargin = 0.15,
      daysCashReserve = 30,
      
      // Market Analysis
      zipCode = '33xxx',
      state = 'Florida',
      competitorAnalysis = true,
      
      // Strategic Goals
      growthTarget = 0.20, // 20% growth
      profitabilityGoal = 'sustainable',
      marketPosition = 'competitive' // affordable, competitive, premium
    } = req.body;

    // Calculate comprehensive cost structure
    const totalMonthlyCosts = facilityCost + payrollCost + ownerSalary + utilitiesCost + 
                             insuranceCost + suppliesCost + marketingCost + otherExpenses;
    
    // Market Landscape Analysis
    const marketData = getMarketLandscape(state, zipCode);
    
    // ESA Analysis
    const esaAnalysis = analyzeESAOpportunity(esaAmount, esaEligibleStudents, studentCount, voucherPrograms);
    
    // Cost Analysis
    const costAnalysis = analyzeCostStructure({
      facilityCost, payrollCost, ownerSalary, utilitiesCost, 
      insuranceCost, suppliesCost, marketingCost, otherExpenses
    }, studentCount);
    
    // Calculate multiple tuition scenarios
    const scenarios = calculateTuitionScenarios({
      totalMonthlyCosts,
      studentCount,
      targetStudentCount,
      currentTuition,
      esaAmount,
      esaEligibleStudents,
      operatingMargin,
      marketData,
      marketPosition
    });
    
    // Optimization recommendations
    const recommendations = generateTuitionRecommendations({
      scenarios,
      marketData,
      esaAnalysis,
      costAnalysis,
      profitabilityGoal,
      growthTarget
    });
    
    // Competitive positioning
    const positioning = analyzeCompetitivePosition(scenarios.recommended.tuition, marketData, esaAmount);
    
    // Financial projections
    const projections = calculateFinancialProjections(scenarios.recommended, growthTarget, daysCashReserve);
    
    const result = {
      currentSituation: {
        studentCount,
        currentTuition,
        monthlyRevenue: studentCount * currentTuition,
        totalMonthlyCosts,
        monthlyProfit: (studentCount * currentTuition) - totalMonthlyCosts,
        profitMargin: ((studentCount * currentTuition) - totalMonthlyCosts) / (studentCount * currentTuition)
      },
      marketLandscape: marketData,
      esaAnalysis,
      costAnalysis,
      scenarios,
      recommendations,
      competitivePositioning: positioning,
      projections,
      timestamp: new Date().toISOString()
    };

    res.json(result);
  } catch (error) {
    console.error('Pricing calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

// GET /api/calculator/benchmarks
router.get('/benchmarks', (req, res) => {
  try {
    const benchmarks = {
      tuitionByRegion: {
        'Southeast': { average: 750, range: [600, 900] },
        'Northeast': { average: 1200, range: [900, 1500] },
        'Midwest': { average: 650, range: [500, 800] },
        'West': { average: 950, range: [750, 1200] }
      },
      operatingRatios: {
        facilityCost: { healthy: [0.15, 0.20], warning: [0.20, 0.25], danger: [0.25, 1.0] },
        staffCost: { healthy: [0.45, 0.50], warning: [0.50, 0.55], danger: [0.55, 1.0] },
        operatingMargin: { healthy: [0.15, 0.25], warning: [0.10, 0.15], danger: [0.0, 0.10] }
      },
      studentMetrics: {
        optimalSize: { min: 25, max: 35, ideal: 30 },
        teacherToStudentRatio: { target: 8, max: 12 },
        retentionRate: { target: 0.90, minimum: 0.80 }
      },
      financialHealth: {
        daysCashOnHand: { target: 30, minimum: 15 },
        debtServiceCoverage: { target: 1.25, minimum: 1.0 },
        collectionRate: { target: 0.95, minimum: 0.85 }
      }
    };

    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch benchmarks' });
  }
});

// POST /api/calculator/scenario
router.post('/scenario', (req, res) => {
  try {
    const { baseScenario, changes } = req.body;
    
    // Apply changes to base scenario
    const scenario = { ...baseScenario, ...changes };
    
    // Recalculate with new parameters
    const calculationResult = calculatePricing(scenario);
    
    res.json({
      scenario,
      results: calculationResult,
      comparison: {
        revenueDifference: calculationResult.monthlyRevenue - baseScenario.monthlyRevenue,
        profitDifference: calculationResult.monthlyProfit - baseScenario.monthlyProfit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate scenario' });
  }
});

// Market Landscape Analysis
function getMarketLandscape(state, zipCode) {
  // Mock market data - in production, integrate with real estate APIs and school databases
  const marketData = {
    region: state,
    zipCode,
    demographics: {
      medianIncome: 78500,
      educationSpending: 12400,
      privateschoolEnrollment: 0.18,
      homeschoolRate: 0.08
    },
    competitorAnalysis: {
      microschools: [
        { name: 'Learning Lab Academy', tuition: 675, students: 25, distance: 2.1 },
        { name: 'Bright Minds Micro', tuition: 750, students: 32, distance: 3.8 },
        { name: 'Future Leaders School', tuition: 825, students: 28, distance: 1.5 }
      ],
      privateSchools: [
        { name: 'St. Mary Catholic', tuition: 1200, students: 450, distance: 2.8 },
        { name: 'Sunshine Prep Academy', tuition: 1450, students: 320, distance: 4.2 }
      ],
      publicSchoolRating: 6.2,
      averageClassSize: 24
    },
    marketRates: {
      microschoolAverage: 750,
      microschoolRange: [625, 875],
      privateSchoolAverage: 1325,
      publicSchoolCostPerPupil: 9800,
      tutorRatePerHour: 65
    },
    economicFactors: {
      unemploymentRate: 0.034,
      costOfLivingIndex: 98.5,
      housingAffordability: 0.72,
      educationPriority: 'high'
    }
  };
  
  return marketData;
}

// ESA Opportunity Analysis
function analyzeESAOpportunity(esaAmount, esaEligibleStudents, totalStudents, programs) {
  const analysis = {
    programsAvailable: programs,
    eligibleStudents: esaEligibleStudents,
    eligibilityRate: esaEligibleStudents / totalStudents,
    averageESAAmount: esaAmount,
    monthlyESARevenue: esaEligibleStudents * esaAmount,
    
    // ESA Program Details
    programDetails: {
      'Florida ESA': {
        amount: 8000, // Annual
        monthlyEquivalent: 667,
        eligibilityIncome: 185000, // Family income threshold
        restrictions: ['Approved vendors', 'Educational expenses only'],
        growthRate: 0.25 // 25% annual growth
      },
      'Step Up': {
        amount: 7500, // Annual
        monthlyEquivalent: 625,
        eligibilityIncome: 62000,
        restrictions: ['Lower income families', 'Approved schools'],
        growthRate: 0.15
      }
    },
    
    // Optimization opportunities
    opportunities: {
      maxESAUtilization: esaAmount,
      familyContributionNeeded: 0, // If tuition > ESA amount
      marketingToESAFamilies: 'High priority - 90% retention rate',
      complianceRequirements: ['Vendor approval', 'Expense documentation', 'Quarterly reporting']
    },
    
    recommendations: [
      'Target ESA-eligible families in marketing',
      'Ensure vendor compliance for all programs',
      'Consider tuition at or below ESA amounts for full coverage',
      'Develop ESA-specific enrollment materials'
    ]
  };
  
  return analysis;
}

// Cost Structure Analysis
function analyzeCostStructure(costs, studentCount) {
  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  
  const analysis = {
    totalMonthlyCosts: totalCosts,
    costPerStudent: Math.round(totalCosts / studentCount),
    costBreakdown: {
      facility: { amount: costs.facilityCost, percentage: costs.facilityCost / totalCosts },
      payroll: { amount: costs.payrollCost, percentage: costs.payrollCost / totalCosts },
      ownerSalary: { amount: costs.ownerSalary, percentage: costs.ownerSalary / totalCosts },
      utilities: { amount: costs.utilitiesCost, percentage: costs.utilitiesCost / totalCosts },
      insurance: { amount: costs.insuranceCost, percentage: costs.insuranceCost / totalCosts },
      supplies: { amount: costs.suppliesCost, percentage: costs.suppliesCost / totalCosts },
      marketing: { amount: costs.marketingCost, percentage: costs.marketingCost / totalCosts },
      other: { amount: costs.otherExpenses, percentage: costs.otherExpenses / totalCosts }
    },
    benchmarks: {
      facilityTarget: 0.20, // 20% of total costs
      payrollTarget: 0.45,   // 45% of total costs
      ownerSalaryTarget: 0.15, // 15% of total costs
      otherTarget: 0.20      // 20% for all other expenses
    },
    optimizationOpportunities: []
  };
  
  // Identify optimization opportunities
  if (analysis.costBreakdown.facility.percentage > 0.25) {
    analysis.optimizationOpportunities.push({
      area: 'Facility Costs',
      current: Math.round(analysis.costBreakdown.facility.percentage * 100) + '%',
      target: '20%',
      potential: `$${Math.round((analysis.costBreakdown.facility.percentage - 0.20) * totalCosts)}/month savings`,
      actions: ['Renegotiate lease', 'Find shared space', 'Sublease unused areas']
    });
  }
  
  if (analysis.costBreakdown.payroll.percentage > 0.50) {
    analysis.optimizationOpportunities.push({
      area: 'Payroll Costs',
      current: Math.round(analysis.costBreakdown.payroll.percentage * 100) + '%',
      target: '45%',
      potential: `$${Math.round((analysis.costBreakdown.payroll.percentage - 0.45) * totalCosts)}/month savings`,
      actions: ['Optimize staffing ratios', 'Cross-train teachers', 'Use part-time specialists']
    });
  }
  
  return analysis;
}

// Calculate Multiple Tuition Scenarios
function calculateTuitionScenarios(params) {
  const { totalMonthlyCosts, studentCount, targetStudentCount, currentTuition, 
          esaAmount, esaEligibleStudents, operatingMargin, marketData, marketPosition } = params;
  
  const scenarios = {};
  
  // Break-even scenario
  scenarios.breakeven = {
    name: 'Break-even',
    tuition: Math.round(totalMonthlyCosts / studentCount),
    description: 'Minimum to cover all costs',
    monthlyRevenue: totalMonthlyCosts,
    monthlyProfit: 0,
    profitMargin: 0,
    sustainability: 'Unsustainable - no margin for emergencies'
  };
  
  // Current scenario
  scenarios.current = {
    name: 'Current',
    tuition: currentTuition,
    description: 'Your current tuition rate',
    monthlyRevenue: studentCount * currentTuition,
    monthlyProfit: (studentCount * currentTuition) - totalMonthlyCosts,
    profitMargin: ((studentCount * currentTuition) - totalMonthlyCosts) / (studentCount * currentTuition),
    sustainability: ((studentCount * currentTuition) - totalMonthlyCosts) > 0 ? 'Profitable' : 'Losing money'
  };
  
  // Sustainable scenario (with margin)
  const sustainableCostPerStudent = totalMonthlyCosts / studentCount;
  scenarios.sustainable = {
    name: 'Sustainable',
    tuition: Math.round(sustainableCostPerStudent * (1 + operatingMargin)),
    description: `${Math.round(operatingMargin * 100)}% operating margin`,
    monthlyRevenue: Math.round(sustainableCostPerStudent * (1 + operatingMargin)) * studentCount,
    monthlyProfit: Math.round(sustainableCostPerStudent * operatingMargin * studentCount),
    profitMargin: operatingMargin,
    sustainability: 'Sustainable with healthy margins'
  };
  
  // ESA-optimized scenario
  scenarios.esaOptimized = {
    name: 'ESA-Optimized',
    tuition: esaAmount,
    description: 'Matches ESA amount for full coverage',
    monthlyRevenue: esaAmount * studentCount,
    monthlyProfit: (esaAmount * studentCount) - totalMonthlyCosts,
    profitMargin: ((esaAmount * studentCount) - totalMonthlyCosts) / (esaAmount * studentCount),
    sustainability: (esaAmount * studentCount) > totalMonthlyCosts ? 'Profitable' : 'Need cost reduction',
    esaBenefit: 'Families pay $0 out of pocket'
  };
  
  // Market-competitive scenario
  scenarios.marketCompetitive = {
    name: 'Market-Competitive',
    tuition: marketData.marketRates.microschoolAverage,
    description: 'Average microschool rate in your area',
    monthlyRevenue: marketData.marketRates.microschoolAverage * studentCount,
    monthlyProfit: (marketData.marketRates.microschoolAverage * studentCount) - totalMonthlyCosts,
    profitMargin: ((marketData.marketRates.microschoolAverage * studentCount) - totalMonthlyCosts) / (marketData.marketRates.microschoolAverage * studentCount),
    sustainability: 'Market-aligned pricing'
  };
  
  // Growth-optimized scenario (for target student count)
  const growthCostPerStudent = totalMonthlyCosts / targetStudentCount;
  scenarios.growthOptimized = {
    name: 'Growth-Optimized',
    tuition: Math.round(growthCostPerStudent * (1 + operatingMargin)),
    description: `Optimized for ${targetStudentCount} students`,
    monthlyRevenue: Math.round(growthCostPerStudent * (1 + operatingMargin)) * targetStudentCount,
    monthlyProfit: Math.round(growthCostPerStudent * operatingMargin * targetStudentCount),
    profitMargin: operatingMargin,
    sustainability: 'Optimized for scale',
    targetStudents: targetStudentCount
  };
  
  // Recommended scenario (best of all factors)
  scenarios.recommended = determineRecommendedScenario(scenarios, marketPosition, esaAmount);
  
  return scenarios;
}

// Determine Best Recommended Scenario
function determineRecommendedScenario(scenarios, marketPosition, esaAmount) {
  let recommended;
  
  if (marketPosition === 'affordable' && scenarios.esaOptimized.profitMargin > 0.10) {
    recommended = scenarios.esaOptimized;
    recommended.reasoning = 'ESA-optimized pricing provides accessibility while maintaining profitability';
  } else if (marketPosition === 'premium' && scenarios.marketCompetitive.profitMargin > 0.15) {
    recommended = scenarios.marketCompetitive;
    recommended.reasoning = 'Market-competitive pricing balances accessibility and sustainability';
  } else {
    recommended = scenarios.sustainable;
    recommended.reasoning = 'Sustainable pricing ensures long-term viability with healthy margins';
  }
  
  return recommended;
}

// Generate Comprehensive Recommendations
function generateTuitionRecommendations(params) {
  const { scenarios, marketData, esaAnalysis, costAnalysis, profitabilityGoal, growthTarget } = params;
  
  const recommendations = [];
  
  // Primary tuition recommendation
  recommendations.push({
    type: 'primary',
    priority: 'high',
    title: `Set tuition at $${scenarios.recommended.tuition}/month`,
    description: scenarios.recommended.reasoning,
    impact: {
      monthlyRevenue: `$${scenarios.recommended.monthlyRevenue.toLocaleString()}`,
      monthlyProfit: `$${scenarios.recommended.monthlyProfit.toLocaleString()}`,
      profitMargin: `${Math.round(scenarios.recommended.profitMargin * 100)}%`
    },
    implementation: {
      timeline: '30-60 days notice to families',
      effectiveDate: 'Next semester or academic year',
      communicationStrategy: 'Emphasize value proposition and market comparison'
    }
  });
  
  // ESA optimization if applicable
  if (esaAnalysis.eligibilityRate > 0.50 && scenarios.esaOptimized.profitMargin > 0.05) {
    recommendations.push({
      type: 'esa_strategy',
      priority: 'medium',
      title: 'Consider ESA-aligned pricing strategy',
      description: `${Math.round(esaAnalysis.eligibilityRate * 100)}% of families are ESA-eligible`,
      impact: {
        familyBenefit: 'Families pay $0 out of pocket',
        marketingAdvantage: 'Strong competitive differentiator',
        retentionBoost: 'ESA families have 90% retention rate'
      },
      considerations: [
        'Requires vendor compliance',
        'May limit pricing flexibility',
        'Strong family value proposition'
      ]
    });
  }
  
  // Cost optimization opportunities
  if (costAnalysis.optimizationOpportunities.length > 0) {
    recommendations.push({
      type: 'cost_optimization',
      priority: 'medium',
      title: 'Reduce operating costs to improve margins',
      description: `${costAnalysis.optimizationOpportunities.length} cost reduction opportunities identified`,
      opportunities: costAnalysis.optimizationOpportunities,
      impact: {
        potentialSavings: costAnalysis.optimizationOpportunities.reduce((sum, opp) => {
          const savings = parseInt(opp.potential.match(/\$(\d+)/)[1]);
          return sum + savings;
        }, 0),
        marginImprovement: '3-5%'
      }
    });
  }
  
  // Market positioning recommendation
  const marketPosition = scenarios.recommended.tuition < marketData.marketRates.microschoolAverage ? 'below_market' : 'at_market';
  recommendations.push({
    type: 'market_positioning',
    priority: 'low',
    title: `Current positioning: ${marketPosition.replace('_', ' ')}`,
    description: `Your recommended rate is ${marketPosition === 'below_market' ? 'below' : 'at'} market average`,
    marketComparison: {
      yourRate: scenarios.recommended.tuition,
      marketAverage: marketData.marketRates.microschoolAverage,
      difference: scenarios.recommended.tuition - marketData.marketRates.microschoolAverage,
      percentileRank: calculatePercentileRank(scenarios.recommended.tuition, marketData.competitorAnalysis.microschools)
    }
  });
  
  return recommendations;
}

// Competitive Position Analysis
function analyzeCompetitivePosition(proposedTuition, marketData, esaAmount) {
  const microschools = marketData.competitorAnalysis.microschools;
  const rates = microschools.map(school => school.tuition).sort((a, b) => a - b);
  
  const analysis = {
    proposedTuition,
    marketPosition: {
      percentile: calculatePercentileRank(proposedTuition, microschools),
      cheaperThan: microschools.filter(s => s.tuition > proposedTuition).length,
      moreExpensiveThan: microschools.filter(s => s.tuition < proposedTuition).length,
      nearestCompetitors: microschools
        .map(s => ({ ...s, difference: Math.abs(s.tuition - proposedTuition) }))
        .sort((a, b) => a.difference - b.difference)
        .slice(0, 2)
    },
    valueProposition: {
      vsPublicSchool: {
        costDifference: proposedTuition * 12 - (marketData.marketRates.publicSchoolCostPerPupil || 9800),
        classSizeAdvantage: '8-12 vs 24 students',
        personalizedLearning: 'Highly individualized',
        flexibility: 'Family-centered approach'
      },
      vsPrivateSchool: {
        costSavings: (marketData.marketRates.privateSchoolAverage || 1325) - proposedTuition,
        annualSavings: ((marketData.marketRates.privateSchoolAverage || 1325) - proposedTuition) * 12,
        additionalBenefits: ['Smaller class sizes', 'More family involvement', 'Flexible curriculum']
      },
      vsESA: {
        familyContribution: Math.max(0, proposedTuition - esaAmount),
        coveragePercentage: Math.min(1, esaAmount / proposedTuition),
        messaging: proposedTuition <= esaAmount ? 'Fully covered by ESA' : `ESA + $${proposedTuition - esaAmount} family contribution`
      }
    }
  };
  
  return analysis;
}

// Financial Projections
function calculateFinancialProjections(recommendedScenario, growthTarget, cashReserveDays) {
  const projections = {
    year1: {
      revenue: recommendedScenario.monthlyRevenue * 12,
      profit: recommendedScenario.monthlyProfit * 12,
      profitMargin: recommendedScenario.profitMargin,
      cashGenerated: recommendedScenario.monthlyProfit * 12
    },
    year2: {
      // Assume growth target achieved
      studentGrowth: Math.round(recommendedScenario.targetStudents * (1 + growthTarget)),
      revenueGrowth: recommendedScenario.monthlyRevenue * 12 * (1 + growthTarget),
      estimatedProfit: recommendedScenario.monthlyProfit * 12 * (1 + growthTarget * 0.8), // Costs grow slower
      marginImprovement: 'Economies of scale improve margins'
    },
    cashFlow: {
      currentRunway: '7 days',
      projectedRunway: `${Math.round((recommendedScenario.monthlyProfit / (recommendedScenario.monthlyRevenue / 30)))} days`,
      targetReserve: `$${Math.round((recommendedScenario.monthlyRevenue / 30) * cashReserveDays).toLocaleString()}`,
      timeToTarget: recommendedScenario.monthlyProfit > 0 ? 
        Math.ceil(((recommendedScenario.monthlyRevenue / 30) * cashReserveDays) / recommendedScenario.monthlyProfit) : null
    },
    investmentOpportunities: [
      'Technology upgrades',
      'Facility improvements', 
      'Additional programming',
      'Marketing expansion',
      'Staff development'
    ]
  };
  
  return projections;
}

// Helper function to calculate percentile rank
function calculatePercentileRank(value, schools) {
  const rates = schools.map(s => s.tuition);
  const belowCount = rates.filter(rate => rate < value).length;
  return Math.round((belowCount / rates.length) * 100);
}

function calculatePricing(params) {
  const {
    studentCount,
    currentTuition,
    facilityCost,
    payrollCost,
    ownerSalary,
    otherExpenses,
    operatingMargin
  } = params;

  const totalMonthlyCosts = facilityCost + payrollCost + ownerSalary + otherExpenses;
  const monthlyRevenue = studentCount * currentTuition;
  const monthlyProfit = monthlyRevenue - totalMonthlyCosts;
  
  return {
    totalMonthlyCosts,
    monthlyRevenue,
    monthlyProfit,
    profitMargin: monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) : 0
  };
}

module.exports = router;
