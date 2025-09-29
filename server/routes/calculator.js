const express = require('express');
const router = express.Router();

// POST /api/calculator/tuition-engine
router.post('/tuition-engine', (req, res) => {
  try {
    const {
      // Current Situation
      studentCount = 28,
      currentTuition = 667, // $8000 annual / 12 months
      targetStudentCount = 35,
      
      // Program Structure
      programType = 'full_time', // full_time, part_time, tutoring, afterschool
      programSchedule = {
        daysPerWeek: 5,
        hoursPerDay: 6,
        weeksPerYear: 36,
        sessions: 'full_year' // full_year, semester, trimester, hourly
      },
      
      // Funding Sources (Flexible by State)
      fundingOptions = {
        hasESA: true,
        hasVouchers: false,
        hasTaxCredits: false,
        hasPrivatePay: true,
        primaryFunding: 'esa' // esa, voucher, tax_credit, private_pay, mixed
      },
      
      // ESA/Voucher Data (when applicable)
      publicFunding = {
        annualAmount: 8000, // ESA annual amount
        monthlyEquivalent: 667,
        eligibleStudents: 18,
        programName: 'Florida ESA',
        restrictions: ['approved_vendors', 'educational_expenses'],
        stateProgramDetails: {
          florida: { esa: 8000, stepUp: 7500 },
          arizona: { esa: 7500, taxCredit: 4500 },
          texas: { privateSchoolChoice: 8000 },
          northCarolina: { opportunityScholarship: 6000 }
        }
      },
      
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
      growthTarget = 0.20,
      profitabilityGoal = 'sustainable',
      marketPosition = 'competitive'
    } = req.body;

    // Calculate comprehensive cost structure
    const totalMonthlyCosts = facilityCost + payrollCost + ownerSalary + utilitiesCost + 
                             insuranceCost + suppliesCost + marketingCost + otherExpenses;
    
    // Program Structure Analysis
    const programAnalysis = analyzeProgramStructure(programType, programSchedule, totalMonthlyCosts);
    
    // Market Landscape Analysis (Program-Specific)
    const marketData = getMarketLandscape(state, zipCode, programType);
    
    // Public Funding Analysis (State-Specific)
    const fundingAnalysis = analyzePublicFunding(fundingOptions, publicFunding, studentCount, state);
    
    // Cost Analysis (Adjusted for Program Type)
    const costAnalysis = analyzeCostStructure({
      facilityCost, payrollCost, ownerSalary, utilitiesCost, 
      insuranceCost, suppliesCost, marketingCost, otherExpenses
    }, studentCount, programSchedule);
    
    // Calculate multiple tuition scenarios
    const scenarios = calculateTuitionScenarios({
      totalMonthlyCosts,
      studentCount,
      targetStudentCount,
      currentTuition,
      publicFunding,
      fundingOptions,
      programSchedule,
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

// Program Structure Analysis
function analyzeProgramStructure(programType, schedule, totalCosts) {
  const analysis = {
    programType,
    schedule,
    costStructure: {},
    pricingModel: {},
    utilization: {}
  };
  
  // Calculate utilization and cost allocation
  const annualHours = schedule.daysPerWeek * schedule.hoursPerDay * schedule.weeksPerYear;
  const monthlyHours = annualHours / 12;
  
  analysis.utilization = {
    annualHours,
    monthlyHours,
    utilizationRate: schedule.daysPerWeek / 5, // vs. full-time
    efficiency: monthlyHours / (schedule.daysPerWeek * 4.33 * schedule.hoursPerDay) // actual vs. theoretical
  };
  
  // Program-specific cost models
  switch (programType) {
    case 'full_time':
      analysis.costStructure = {
        model: 'per_student_monthly',
        baseUnit: 'student',
        costPerUnit: Math.round(totalCosts / 28), // assuming 28 students
        includes: ['full_curriculum', 'meals', 'supervision', 'activities']
      };
      break;
      
    case 'part_time':
      analysis.costStructure = {
        model: 'per_student_per_day',
        baseUnit: 'student_day', 
        costPerUnit: Math.round(totalCosts / (28 * schedule.daysPerWeek)),
        includes: ['curriculum', 'supervision', 'materials']
      };
      break;
      
    case 'tutoring':
      analysis.costStructure = {
        model: 'per_hour',
        baseUnit: 'hour',
        costPerUnit: Math.round(totalCosts / monthlyHours),
        includes: ['instruction', 'materials', 'assessment']
      };
      break;
      
    case 'afterschool':
      analysis.costStructure = {
        model: 'per_student_monthly',
        baseUnit: 'student',
        costPerUnit: Math.round(totalCosts / 40), // typically higher capacity
        includes: ['supervision', 'activities', 'snacks', 'homework_help']
      };
      break;
  }
  
  return analysis;
}

// Public Funding Analysis (State-Flexible)
function analyzePublicFunding(fundingOptions, publicFunding, studentCount, state) {
  const analysis = {
    state,
    availableFunding: [],
    eligibilityAnalysis: {},
    optimizationStrategy: {},
    complianceRequirements: []
  };
  
  // State-specific funding programs
  const stateFunding = {
    florida: [
      { type: 'esa', name: 'Florida ESA', amount: 8000, eligibility: 'income_based', restrictions: ['approved_vendors'] },
      { type: 'voucher', name: 'Step Up Scholarships', amount: 7500, eligibility: 'low_income', restrictions: ['approved_schools'] }
    ],
    arizona: [
      { type: 'esa', name: 'Arizona ESA', amount: 7500, eligibility: 'broad', restrictions: ['educational_expenses'] },
      { type: 'tax_credit', name: 'Arizona Tax Credit', amount: 4500, eligibility: 'donations', restrictions: ['nonprofit_schools'] }
    ],
    texas: [
      { type: 'voucher', name: 'Texas Private School Choice', amount: 8000, eligibility: 'income_based', restrictions: ['accredited_schools'] }
    ],
    north_carolina: [
      { type: 'voucher', name: 'Opportunity Scholarship', amount: 6000, eligibility: 'income_based', restrictions: ['approved_schools'] }
    ],
    indiana: [
      { type: 'voucher', name: 'Indiana Choice Scholarship', amount: 5500, eligibility: 'income_based', restrictions: ['accredited_schools'] },
      { type: 'tax_credit', name: 'Indiana Tax Credit', amount: 1000, eligibility: 'donations', restrictions: ['nonprofit_only'] }
    ]
  };
  
  analysis.availableFunding = stateFunding[state.toLowerCase()] || [];
  
  // Funding optimization strategy
  if (fundingOptions.hasESA || fundingOptions.hasVouchers) {
    const primaryProgram = analysis.availableFunding.find(f => f.type === fundingOptions.primaryFunding);
    
    analysis.optimizationStrategy = {
      recommendedFunding: primaryProgram,
      familyContribution: Math.max(0, publicFunding.monthlyEquivalent - primaryProgram?.amount / 12 || 0),
      eligibilityRate: publicFunding.eligibleStudents / studentCount,
      revenueStability: primaryProgram ? 'high' : 'medium',
      marketingAdvantage: primaryProgram ? 'significant' : 'none',
      retentionBenefit: primaryProgram ? '90% retention rate' : 'standard'
    };
    
    // Compliance requirements based on funding type
    if (primaryProgram) {
      analysis.complianceRequirements = [
        `${primaryProgram.name} vendor approval required`,
        'Quarterly expense reporting', 
        'Annual audit compliance',
        'Approved educational expense categories only'
      ];
    }
  } else {
    analysis.optimizationStrategy = {
      recommendedFunding: 'private_pay',
      familyContribution: publicFunding.monthlyEquivalent,
      eligibilityRate: 1.0,
      revenueStability: 'medium',
      marketingAdvantage: 'flexibility',
      pricing: 'market_competitive'
    };
  }
  
  return analysis;
}

// Market Landscape Analysis (Program-Specific)
function getMarketLandscape(state, zipCode, programType) {
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
    competitorAnalysis: getCompetitorsByProgramType(programType),
    marketRates: getMarketRatesByProgram(programType),
    economicFactors: {
      unemploymentRate: 0.034,
      costOfLivingIndex: 98.5,
      housingAffordability: 0.72,
      educationPriority: 'high'
    }
  };
  
  return marketData;
}

// Program-Specific Competitor Analysis
function getCompetitorsByProgramType(programType) {
  const competitors = {
    full_time: {
      microschools: [
        { name: 'Learning Lab Academy', tuition: 675, students: 25, distance: 2.1, schedule: '5 days/week' },
        { name: 'Bright Minds Micro', tuition: 750, students: 32, distance: 3.8, schedule: '5 days/week' },
        { name: 'Future Leaders School', tuition: 825, students: 28, distance: 1.5, schedule: '5 days/week' }
      ],
      privateSchools: [
        { name: 'St. Mary Catholic', tuition: 1200, students: 450, distance: 2.8 },
        { name: 'Sunshine Prep Academy', tuition: 1450, students: 320, distance: 4.2 }
      ]
    },
    
    part_time: {
      microschools: [
        { name: 'Flexible Learning Co-op', tuition: 350, students: 20, distance: 1.8, schedule: '3 days/week' },
        { name: 'Morning Microschool', tuition: 425, students: 15, distance: 2.5, schedule: '3 days/week' },
        { name: 'Hybrid Academy', tuition: 500, students: 25, distance: 3.2, schedule: '4 days/week' }
      ],
      homeschoolCoops: [
        { name: 'Community Learning Hub', tuition: 250, students: 35, distance: 2.0, schedule: '2 days/week' }
      ]
    },
    
    tutoring: {
      tutoringCenters: [
        { name: 'Sylvan Learning', hourlyRate: 65, students: 150, distance: 1.2, model: 'group_tutoring' },
        { name: 'Kumon Math & Reading', monthlyRate: 180, students: 200, distance: 2.8, model: 'self_paced' },
        { name: 'Mathnasium', hourlyRate: 75, students: 100, distance: 3.1, model: 'math_specialist' }
      ],
      privateTutors: [
        { type: 'individual', hourlyRate: 85, availability: 'high' },
        { type: 'small_group', hourlyRate: 45, availability: 'medium' }
      ]
    },
    
    afterschool: {
      afterschoolPrograms: [
        { name: 'YMCA After School', monthlyRate: 320, students: 80, distance: 1.5, hours: '3-6pm' },
        { name: 'Boys & Girls Club', monthlyRate: 280, students: 120, distance: 2.2, hours: '3-6pm' },
        { name: 'Learning Express', monthlyRate: 450, students: 40, distance: 1.8, hours: '3-6pm' }
      ],
      daycareExtended: [
        { name: 'Sunshine Daycare Extended', monthlyRate: 400, students: 60, distance: 2.5 }
      ]
    }
  };
  
  return competitors[programType] || competitors.full_time;
}

// Market Rates by Program Type
function getMarketRatesByProgram(programType) {
  const rates = {
    full_time: {
      microschoolAverage: 750,
      microschoolRange: [625, 875],
      privateSchoolAverage: 1325,
      publicSchoolCostPerPupil: 9800
    },
    
    part_time: {
      microschoolAverage: 425,
      microschoolRange: [300, 550],
      homeschoolCoopAverage: 250,
      perDayAverage: 85
    },
    
    tutoring: {
      groupTutoringAverage: 65,
      groupTutoringRange: [45, 85],
      individualTutoringAverage: 85,
      learningCenterAverage: 180
    },
    
    afterschool: {
      afterschoolAverage: 350,
      afterschoolRange: [280, 450],
      daycareExtendedAverage: 400,
      perHourAverage: 25
    }
  };
  
  return rates[programType] || rates.full_time;
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
