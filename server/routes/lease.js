const express = require('express');
const router = express.Router();

// Mock lease analysis data
const mockLeaseData = {
  currentLease: {
    id: 1,
    propertyAddress: '123 Education Way, Sunshine, FL 33xxx',
    baseRent: 3500,
    additionalCosts: {
      taxes: 400,
      insurance: 300,
      cam: 300
    },
    totalMonthlyRent: 4500,
    squareFootage: 1600,
    pricePerSqFt: 28,
    term: '3 years',
    escalation: 0.05,
    personalGuarantee: true,
    leaseType: 'Triple Net (NNN)',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    earlyTerminationClause: false
  },
  riskAnalysis: {
    overallRisk: 'high',
    riskFactors: [
      {
        type: 'personal_guarantee',
        severity: 'high',
        title: 'Personal Guarantee Detected',
        description: 'You\'re personally liable for $180,000 (3 years × $5,000/month). Your home and personal assets are at risk if the school fails.',
        financialImpact: 180000
      },
      {
        type: 'triple_net',
        severity: 'high',
        title: 'Triple Net (NNN) Terms',
        description: 'You\'re paying base rent ($3,500) PLUS taxes ($400), insurance ($300), and CAM ($300) = $4,500 total. That\'s 38% of your revenue.',
        financialImpact: 1000
      },
      {
        type: 'above_market',
        severity: 'medium',
        title: 'Above Market Rate',
        description: 'You\'re paying $28/sq ft. Similar spaces in your area: $18-22/sq ft. Churches with classrooms: $10-12/sq ft.',
        financialImpact: 800
      },
      {
        type: 'high_escalation',
        severity: 'medium',
        title: '5% Annual Escalation',
        description: 'Your rent increases 5% yearly (market average: 3%). Year 3 rent will be $5,208/month.',
        financialImpact: 708
      }
    ],
    marketComparison: {
      currentRate: 28,
      marketRange: [18, 22],
      churchSpaces: [10, 12],
      competitiveAdvantage: 'significantly_above_market'
    }
  },
  alternatives: [
    {
      id: 1,
      name: 'First Baptist Church Classrooms',
      address: '456 Faith Street',
      monthlyRent: 1200,
      squareFootage: 1400,
      pricePerSqFt: 10.3,
      distance: '0.8 miles',
      features: ['E-occupancy approved', 'Parking included', 'Kitchen access'],
      availability: 'Weekdays 8am-4pm',
      savings: 3300,
      pros: ['Massive cost savings', 'Established education use', 'Community connection'],
      cons: ['Limited weekend access', 'Shared facilities', 'Religious environment']
    },
    {
      id: 2,
      name: 'Sunshine Community Center',
      address: '789 Community Drive',
      monthlyRent: 2800,
      squareFootage: 1800,
      pricePerSqFt: 18.7,
      distance: '1.2 miles',
      features: ['Full day access', 'Playground included', 'Meeting rooms'],
      availability: 'Full access',
      savings: 1700,
      pros: ['Better price point', 'More space', 'Educational-friendly'],
      cons: ['Need permits', 'Renovation required', 'Longer commute']
    },
    {
      id: 3,
      name: 'Sublease Current Space',
      address: 'Current location',
      monthlyRent: 2700,
      squareFootage: 1600,
      pricePerSqFt: 20.3,
      distance: '0 miles',
      features: ['Keep current setup', 'Share 2 days/week', 'Reduce overhead'],
      availability: 'Mon-Wed-Fri',
      savings: 1800,
      pros: ['No moving costs', 'Maintain relationships', 'Easy transition'],
      cons: ['Coordination required', 'Limited expansion', 'Shared responsibilities']
    }
  ],
  recommendations: [
    {
      priority: 'immediate',
      action: 'Request rent reduction to $3,000',
      description: 'Use market comparables to negotiate 14% reduction',
      template: 'rent_reduction_letter',
      estimatedSavings: 500,
      timeline: '30 days',
      successProbability: 0.7
    },
    {
      priority: 'short_term',
      action: 'Find sublease partner for 2 days/week',
      description: 'Reduce effective rent by $1,800/month through shared use',
      template: 'sublease_posting',
      estimatedSavings: 1800,
      timeline: '60 days',
      successProbability: 0.6
    },
    {
      priority: 'medium_term',
      action: 'Explore First Baptist Church classrooms',
      description: 'Massive savings opportunity with established education use',
      template: 'church_inquiry_letter',
      estimatedSavings: 3300,
      timeline: '90 days',
      successProbability: 0.4
    }
  ]
};

// GET /api/lease/analysis
router.get('/analysis', (req, res) => {
  try {
    res.json({
      currentLease: mockLeaseData.currentLease,
      riskAnalysis: mockLeaseData.riskAnalysis,
      lastAnalyzed: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lease analysis' });
  }
});

// GET /api/lease/alternatives
router.get('/alternatives', (req, res) => {
  try {
    const { maxRent, maxDistance, features } = req.query;
    
    let filteredAlternatives = mockLeaseData.alternatives;
    
    if (maxRent) {
      filteredAlternatives = filteredAlternatives.filter(alt => alt.monthlyRent <= parseInt(maxRent));
    }
    
    if (maxDistance) {
      filteredAlternatives = filteredAlternatives.filter(alt => 
        parseFloat(alt.distance.split(' ')[0]) <= parseFloat(maxDistance)
      );
    }
    
    res.json({
      alternatives: filteredAlternatives,
      totalOptions: filteredAlternatives.length,
      averageSavings: filteredAlternatives.reduce((sum, alt) => sum + alt.savings, 0) / filteredAlternatives.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lease alternatives' });
  }
});

// GET /api/lease/recommendations
router.get('/recommendations', (req, res) => {
  try {
    res.json({
      recommendations: mockLeaseData.recommendations,
      totalPotentialSavings: mockLeaseData.recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0),
      averageTimeline: '60 days'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lease recommendations' });
  }
});

// POST /api/lease/analyze - AI-powered comprehensive lease analysis
router.post('/analyze', (req, res) => {
  try {
    const { leaseFile, leaseText, schoolInfo } = req.body;
    
    // Comprehensive AI lease analysis - simulating advanced AI extraction
    const analysisResult = {
      extractedTerms: {
        // Basic Terms
        baseRent: 3500,
        cam: 300,
        taxes: 400,
        insurance: 300,
        totalMonthlyRent: 4500,
        squareFootage: 1600,
        pricePerSqFt: 28.13,
        
        // Lease Structure
        leaseType: 'Triple Net (NNN)',
        term: '36 months',
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        renewalOptions: 'One 3-year option',
        
        // Financial Terms
        securityDeposit: 9000, // 2 months
        escalation: {
          rate: 5.0,
          frequency: 'annual',
          compounding: true,
          capAmount: null
        },
        personalGuarantee: {
          present: true,
          amount: 162000, // 3 years total
          limitations: null
        },
        
        // Critical Deadlines
        keyDeadlines: [
          { type: 'Renewal Notice Required', date: '2026-06-30', daysFromNow: 614 },
          { type: 'First Escalation', date: '2025-01-01', daysFromNow: 98 },
          { type: 'Insurance Renewal', date: '2024-12-31', daysFromNow: 97 },
          { type: 'Property Tax Assessment', date: '2025-03-01', daysFromNow: 157 }
        ],
        
        // Building & Use Terms
        buildingType: 'Educational/Office',
        permittedUses: ['Educational services', 'Daycare', 'Tutoring'],
        restrictedUses: ['Retail', 'Food service', 'Manufacturing'],
        parkingSpaces: 25,
        hoursOfOperation: '6:00 AM - 8:00 PM Monday-Saturday',
        
        // Maintenance & Improvements
        maintenanceResponsibility: 'Tenant (NNN)',
        improvementAllowance: 0,
        alterationRequirements: 'Landlord approval required',
        restorationClause: 'Return to original condition',
        
        // Insurance Requirements (Critical for Schools)
        insuranceRequirements: {
          generalLiability: {
            required: true,
            minimumCoverage: 2000000, // $2M per occurrence
            aggregateLimit: 4000000,  // $4M aggregate
            estimatedCost: 3600, // Annual premium
            carriers: 'AM Best A-rated required'
          },
          professionalLiability: {
            required: true,
            minimumCoverage: 1000000, // $1M for educational malpractice
            estimatedCost: 2400,
            specific: 'Educational/childcare professional liability'
          },
          propertyInsurance: {
            required: true,
            coverage: 'Full replacement cost',
            deductible: 5000,
            estimatedCost: 1800,
            includedItems: ['Equipment', 'Supplies', 'Business personal property']
          },
          workersCompensation: {
            required: true,
            stateRequired: true,
            estimatedCost: 4200, // Based on payroll
            classCode: '8868 - Schools: Colleges, Universities, Professional Schools'
          },
          umbrellaPolicy: {
            required: true,
            minimumCoverage: 5000000, // $5M umbrella
            estimatedCost: 1200,
            purpose: 'Additional protection above primary policies'
          },
          cyberLiability: {
            required: false,
            recommended: true,
            minimumCoverage: 1000000,
            estimatedCost: 1500,
            reason: 'Student data protection and privacy'
          },
          directorsAndOfficers: {
            required: false,
            recommended: true,
            minimumCoverage: 1000000,
            estimatedCost: 800,
            reason: 'Board member protection for nonprofit schools'
          },
          businessInterruption: {
            required: false,
            recommended: true,
            coverage: '12 months operating expenses',
            estimatedCost: 2100,
            reason: 'Protection against forced closure (COVID-like events)'
          },
          totalEstimatedAnnualCost: 17600, // Sum of all insurance costs
          monthlyInsuranceBudget: 1467,
          
          // Special Requirements for Educational Use
          educationSpecific: {
            backgroundChecks: 'All staff must pass background checks for coverage',
            supervisionRatios: 'Must maintain state-required adult:child ratios',
            emergencyProcedures: 'Written emergency and evacuation plans required',
            transportationCoverage: 'Additional coverage if providing transportation',
            fieldTripInsurance: 'Per-event coverage for off-site activities',
            mandatedReporting: 'Staff training on mandated reporting requirements'
          },
          
          // Lease-Specific Insurance Clauses
          leaseInsuranceClause: {
            landlordAdditionalInsured: true,
            primaryAndNonContributory: true,
            waiverOfSubrogation: true,
            certificateDelivery: '30 days before lease commencement and annually',
            cancellationNotice: '30 days written notice to landlord required',
            selfInsuranceProhibited: true
          }
        }
      },
      
      // Financial Impact Analysis
      financialImpact: {
        currentAnnualCost: 54000,
        projectedCosts: [
          { year: 1, cost: 54000 },
          { year: 2, cost: 56700 }, // 5% escalation
          { year: 3, cost: 59535 }  // Compounded
        ],
        totalLeaseCommitment: 170235,
        requiredTuitionToBreakEven: calculateLeaseBreakEven(4500, schoolInfo?.studentCount || 28),
        facilityAsPercentOfRevenue: calculateFacilityBurden(4500, schoolInfo?.monthlyRevenue || 16324)
      },
      
      // Risk Assessment
      riskAnalysis: {
        overallRiskScore: 85, // Out of 100 (higher = more risk)
        riskFactors: [
          {
            category: 'Financial',
            severity: 'critical',
            factor: 'Personal Guarantee',
            description: 'Unlimited personal liability for $162,000 lease commitment',
            impact: 'Personal assets (home, savings) at risk if business fails',
            recommendation: 'Negotiate cap at 6 months rent or remove entirely'
          },
          {
            category: 'Market',
            severity: 'high',
            factor: 'Above Market Rate',
            description: 'Paying $28.13/sq ft vs market average $20-22/sq ft',
            impact: '$800-1,000/month overpayment',
            recommendation: 'Request rent reduction to $3,200-3,500 based on market data'
          },
          {
            category: 'Operational',
            severity: 'high',
            factor: 'High Escalation Rate',
            description: '5% annual increases vs market standard 3%',
            impact: '$5,535 additional cost over lease term',
            recommendation: 'Negotiate cap at 3% or CPI, whichever is lower'
          },
          {
            category: 'Flexibility',
            severity: 'medium',
            factor: 'Limited Early Termination',
            description: 'No early termination clause',
            impact: 'Locked in for full term regardless of business changes',
            recommendation: 'Add early termination with 6-month notice and penalty'
          },
          {
            category: 'Facility',
            severity: 'medium',
            factor: 'Facility Burden',
            description: `${Math.round(calculateFacilityBurden(4500, schoolInfo?.monthlyRevenue || 16324))}% of revenue goes to facility`,
            impact: 'Exceeds recommended 20% maximum',
            recommendation: 'Reduce rent or increase enrollment to improve ratio'
          }
        ],
        
        // Compliance & Legal Risks
        complianceRisks: [
          'Educational use permits may need renewal',
          'Fire code compliance for student capacity',
          'ADA accessibility requirements',
          'Zoning verification for educational use'
        ],
        
        // Insurance-Specific Risk Assessment
        insuranceRisks: [
          {
            type: 'Coverage Gap',
            severity: 'high',
            description: 'Professional liability coverage may not include tutoring/educational malpractice',
            impact: 'Potential $1M+ liability exposure',
            solution: 'Verify coverage includes educational services specifically'
          },
          {
            type: 'Premium Shock',
            severity: 'medium',
            description: 'Insurance costs ($1,467/month) represent 9% of current revenue',
            impact: 'Above typical 3-5% for educational facilities',
            solution: 'Shop multiple carriers, consider higher deductibles, implement safety programs'
          },
          {
            type: 'State Compliance',
            severity: 'high',
            description: 'Florida requires specific insurance minimums for educational facilities',
            impact: 'Operating without proper coverage could result in shutdown',
            solution: 'Verify compliance with FL Department of Education requirements'
          },
          {
            type: 'Cyber Security',
            severity: 'medium',
            description: 'Student data breach could cost $200+ per record',
            impact: 'Average breach costs $4.45M nationally',
            solution: 'Add cyber liability coverage and implement data security protocols'
          }
        ]
      },
      
      // AI-Generated Insights
      insights: {
        keyFindings: [
          'Lease consumes 28% of revenue - should be ≤20%',
          'Personal guarantee creates $162K liability exposure',
          'Annual 5% escalations will increase costs 35% over 5 years',
          'Insurance requirements add $1,467/month (9% of revenue)',
          'Professional liability coverage critical for educational services',
          'No early exit strategy if enrollment drops',
          'Cyber liability recommended for student data protection'
        ],
        opportunityAssessment: {
          negotiationLeverage: 'Medium - established tenant with good payment history',
          marketConditions: 'Favor tenants - high vacancy rates in area',
          timingAdvantage: '18 months before renewal - good negotiation window'
        },
        alternativeStrategies: [
          'Sublease 2 days/week to reduce effective rent by $1,800/month',
          'Negotiate graduated rent starting lower in Year 1',
          'Request tenant improvement allowance for classroom upgrades',
          'Explore shared space with complementary businesses'
        ]
      },
      
      // Required Tuition Analysis
      tuitionRequirements: {
        currentLeaseRequirement: Math.round(4500 / (schoolInfo?.studentCount || 28)),
        breakEvenTuition: calculateLeaseBreakEven(4500, schoolInfo?.studentCount || 28),
        sustainableTuition: Math.round(calculateLeaseBreakEven(4500, schoolInfo?.studentCount || 28) * 1.15),
        esaCompatibility: {
          esaAmount: schoolInfo?.esaAmount || 583,
          coverage: Math.min(100, Math.round((schoolInfo?.esaAmount || 583) / calculateLeaseBreakEven(4500, schoolInfo?.studentCount || 28) * 100)),
          familyContribution: Math.max(0, calculateLeaseBreakEven(4500, schoolInfo?.studentCount || 28) - (schoolInfo?.esaAmount || 583))
        }
      }
    };
    
    res.json({
      success: true,
      analysis: analysisResult,
      processedAt: new Date().toISOString(),
      confidence: 92, // AI confidence in extraction accuracy
      documentType: 'Commercial Lease Agreement'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze lease' });
  }
});

// GET /api/lease/templates/:type
router.get('/templates/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    const templates = {
      rent_reduction_letter: {
        title: 'Rent Reduction Request Letter',
        content: `Dear [Landlord Name],

I hope this letter finds you well. I am writing to discuss the current rental rate for [Property Address], which houses [School Name].

After conducting market research, I've found that similar properties in our area are leasing for $18-22 per square foot, while our current rate is $28 per square foot. Given the current market conditions and our successful tenancy, I would like to request a rent reduction to $3,000 per month.

This adjustment would:
- Align with current market rates
- Ensure our continued successful operation
- Maintain our excellent tenant relationship

I have attached market comparables for your review. I would appreciate the opportunity to discuss this request and explore mutually beneficial terms.

Thank you for your consideration.

Sincerely,
[Your Name]
[School Director]`,
        variables: ['Landlord Name', 'Property Address', 'School Name', 'Your Name'],
        usage: 'Send via certified mail with market comparables attached'
      },
      sublease_posting: {
        title: 'Sublease Opportunity Posting',
        content: `Educational Space Available for Sublease

Prime educational facility available for sublease 2-3 days per week.

Details:
- 1,600 sq ft of classroom and common space
- Fully equipped with educational furnishings
- Parking available
- Located in [City], FL
- Available Tuesday/Thursday and weekends
- $900/month for 2-day access

Perfect for:
- Tutoring centers
- Art/music programs  
- Community education classes
- Test prep services

Serious inquiries only. References required.

Contact: [Your Email] | [Your Phone]`,
        variables: ['City', 'Your Email', 'Your Phone'],
        usage: 'Post on Facebook Marketplace, Craigslist, and local education groups'
      },
      church_inquiry_letter: {
        title: 'Church Space Inquiry Letter',
        content: `Dear [Pastor/Facility Manager],

Greetings! I am [Your Name], director of [School Name], a microschool serving [Number] students in our community.

We are seeking educational space for our growing school and believe your facility could be an excellent fit. Our program operates Monday-Friday, 8:00 AM - 3:00 PM, and we would be interested in:

- Classroom space for 25-30 students
- Access to common areas for lunch/activities
- Parking for staff and family pickup/dropoff

We are experienced educators who understand the importance of maintaining a respectful, clean environment. We would be happy to provide references from our current location.

Our budget allows for $1,000-1,500 per month, and we are flexible on specific arrangements that work best for your congregation's schedule.

Would you be available for a brief conversation about this opportunity?

Blessings,
[Your Name]
[Phone] | [Email]`,
        variables: ['Pastor/Facility Manager', 'Your Name', 'School Name', 'Number', 'Phone', 'Email'],
        usage: 'Send to local churches with educational-appropriate facilities'
      }
    };
    
    const template = templates[type];
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// GET /api/lease/market-data
router.get('/market-data', (req, res) => {
  try {
    const { zipCode = '33xxx', propertyType = 'educational' } = req.query;
    
    const marketData = {
      averageRates: {
        educational: { min: 18, max: 22, average: 20 },
        retail: { min: 25, max: 35, average: 30 },
        office: { min: 20, max: 28, average: 24 },
        church: { min: 8, max: 15, average: 12 }
      },
      recentTransactions: [
        { address: '123 Learning Lane', sqft: 1500, rate: 19, type: 'educational' },
        { address: '456 Study Street', sqft: 1800, rate: 21, type: 'educational' },
        { address: '789 School Road', sqft: 1200, rate: 18, type: 'educational' }
      ],
      trends: {
        direction: 'stable',
        yearOverYear: 0.02,
        quarterOverQuarter: 0.005
      },
      lastUpdated: new Date().toISOString()
    };
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Helper Functions for Lease Analysis

function calculateLeaseBreakEven(monthlyRent, studentCount) {
  // Calculate the tuition required just to cover lease costs
  return Math.round(monthlyRent / studentCount);
}

function calculateFacilityBurden(monthlyRent, monthlyRevenue) {
  // Calculate facility costs as percentage of revenue
  return Math.round((monthlyRent / monthlyRevenue) * 100);
}

function calculateInsuranceImpact(insuranceRequirements, studentCount, monthlyRevenue) {
  const monthlyInsuranceCost = insuranceRequirements.monthlyInsuranceBudget;
  
  return {
    costPerStudent: Math.round(monthlyInsuranceCost / studentCount),
    percentageOfRevenue: Math.round((monthlyInsuranceCost / monthlyRevenue) * 100),
    tuitionImpact: Math.round(monthlyInsuranceCost / studentCount),
    annualCost: monthlyInsuranceCost * 12,
    complianceRisk: assessInsuranceCompliance(insuranceRequirements)
  };
}

function assessInsuranceCompliance(requirements) {
  const criticalPolicies = [
    'generalLiability',
    'professionalLiability', 
    'workersCompensation',
    'propertyInsurance'
  ];
  
  const compliance = {
    requiredPolicies: criticalPolicies.length,
    adequateCoverage: true, // Mock assessment
    stateCompliant: true,
    gaps: [],
    recommendations: [
      'Verify professional liability includes educational malpractice',
      'Ensure workers comp covers all staff including part-time',
      'Add cyber liability for student data protection',
      'Consider umbrella policy for additional protection'
    ]
  };
  
  return compliance;
}

module.exports = router;
