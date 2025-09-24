const express = require('express');
const router = express.Router();

// Mock enrollment data
const mockEnrollmentData = {
  pipeline: {
    inquiries: 12,
    toursScheduled: 5,
    applications: 3,
    readyToEnroll: 2,
    currentFamilies: 28
  },
  families: [
    {
      id: 1,
      name: 'Peterson Family',
      stage: 'tour_scheduled',
      children: 2,
      monthlyValue: 1166,
      nextStep: 'Tour prep needed',
      inquiryDate: '2024-11-10',
      status: 'tour_tomorrow',
      notes: 'Interested in STEM focus'
    },
    {
      id: 2,
      name: 'Anderson Family',
      stage: 'application_pending',
      children: 1,
      monthlyValue: 750,
      nextStep: 'Follow up - 3 days',
      inquiryDate: '2024-11-08',
      status: 'application_pending',
      notes: 'ESA eligible, toured facility'
    },
    {
      id: 3,
      name: 'Chen Family',
      stage: 'ready_to_enroll',
      children: 1,
      monthlyValue: 583,
      nextStep: 'Send contract',
      inquiryDate: '2024-11-05',
      status: 'ready_to_enroll',
      notes: 'Application approved, needs contract'
    },
    {
      id: 4,
      name: 'Roberts Family',
      stage: 'current_risk',
      children: 2,
      monthlyValue: 1166,
      nextStep: 'Schedule meeting',
      inquiryDate: '2022-09-01',
      status: 'retention_risk',
      notes: 'Current family - 3 late payments, considering options'
    }
  ],
  conversionRates: {
    inquiryToTour: 0.42,
    tourToApplication: 0.60,
    applicationToEnrolled: 0.67,
    year1Retention: 0.78
  },
  insights: {
    bestTourDay: 'Saturday',
    saturdayConversionRate: 0.80,
    esaFamilyRetention: 0.90,
    latePayerRetentionRisk: 3.0,
    siblingFamilyLTV: 2.3
  }
};

// GET /api/enrollment/pipeline
router.get('/pipeline', (req, res) => {
  try {
    res.json({
      pipeline: mockEnrollmentData.pipeline,
      conversionRates: mockEnrollmentData.conversionRates,
      insights: mockEnrollmentData.insights,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollment pipeline' });
  }
});

// GET /api/enrollment/families
router.get('/families', (req, res) => {
  try {
    const { stage, status } = req.query;
    
    let filteredFamilies = mockEnrollmentData.families;
    
    if (stage) {
      filteredFamilies = filteredFamilies.filter(family => family.stage === stage);
    }
    
    if (status) {
      filteredFamilies = filteredFamilies.filter(family => family.status === status);
    }
    
    res.json({
      families: filteredFamilies,
      total: filteredFamilies.length,
      totalMonthlyValue: filteredFamilies.reduce((sum, family) => sum + family.monthlyValue, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch families' });
  }
});

// GET /api/enrollment/analytics
router.get('/analytics', (req, res) => {
  try {
    const analytics = {
      monthlyTrends: [
        { month: 'July', inquiries: 8, enrolled: 2 },
        { month: 'August', inquiries: 10, enrolled: 3 },
        { month: 'September', inquiries: 15, enrolled: 4 },
        { month: 'October', inquiries: 12, enrolled: 2 },
        { month: 'November', inquiries: 12, enrolled: 1 }
      ],
      sourceAnalysis: {
        'Word of Mouth': { count: 8, conversionRate: 0.75 },
        'Facebook Ads': { count: 15, conversionRate: 0.40 },
        'Google Search': { count: 10, conversionRate: 0.60 },
        'School Events': { count: 5, conversionRate: 0.80 },
        'Referrals': { count: 7, conversionRate: 0.85 }
      },
      demographicData: {
        ageGroups: {
          '5-7 years': 12,
          '8-10 years': 18,
          '11-13 years': 8
        },
        familySize: {
          '1 child': 15,
          '2 children': 10,
          '3+ children': 3
        },
        paymentMethod: {
          'ESA/Voucher': 18,
          'Private Pay': 10
        }
      },
      retentionFactors: {
        academicPerformance: 0.85,
        socialFit: 0.80,
        parentSatisfaction: 0.90,
        paymentConsistency: 0.95
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollment analytics' });
  }
});

// POST /api/enrollment/families/:id/action
router.post('/families/:id/action', (req, res) => {
  try {
    const familyId = parseInt(req.params.id);
    const { actionType, data } = req.body;
    
    const family = mockEnrollmentData.families.find(f => f.id === familyId);
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }
    
    // Mock action handling
    const actionResults = {
      'view_details': `Opened detailed profile for ${family.name}`,
      'send_followup': `Follow-up email sent to ${family.name}`,
      'generate_contract': `Contract generated for ${family.name}`,
      'schedule_meeting': `Meeting scheduled with ${family.name}`,
      'send_tour_confirmation': `Tour confirmation sent to ${family.name}`,
      'update_status': `Status updated for ${family.name}`
    };
    
    const result = actionResults[actionType] || 'Action completed';
    
    // Update family status if needed
    if (actionType === 'update_status' && data.newStatus) {
      family.status = data.newStatus;
      family.stage = data.newStage || family.stage;
    }
    
    res.json({
      success: true,
      message: result,
      family: family,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute family action' });
  }
});

// POST /api/enrollment/families
router.post('/families', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      children,
      inquirySource,
      notes,
      esaEligible = false
    } = req.body;
    
    const newFamily = {
      id: mockEnrollmentData.families.length + 1,
      name,
      email,
      phone,
      stage: 'inquiry',
      children: parseInt(children),
      monthlyValue: children * 583, // Base tuition calculation
      nextStep: 'Schedule tour',
      inquiryDate: new Date().toISOString(),
      status: 'new_inquiry',
      notes: notes || '',
      inquirySource,
      esaEligible,
      createdAt: new Date().toISOString()
    };
    
    mockEnrollmentData.families.push(newFamily);
    mockEnrollmentData.pipeline.inquiries += 1;
    
    res.status(201).json({
      success: true,
      family: newFamily,
      message: 'New family inquiry added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new family' });
  }
});

// GET /api/enrollment/recommendations
router.get('/recommendations', (req, res) => {
  try {
    const recommendations = [
      {
        type: 'conversion',
        title: 'Schedule Saturday Tours',
        description: 'Saturday tours convert 2x better than weekday tours',
        impact: 'Could improve tour-to-application rate from 60% to 80%',
        effort: 'Low',
        priority: 'High'
      },
      {
        type: 'retention',
        title: 'Implement Payment Monitoring',
        description: 'Families with 3+ late payments are 3x more likely to leave',
        impact: 'Could prevent 2-3 families from leaving annually',
        effort: 'Medium',
        priority: 'High'
      },
      {
        type: 'growth',
        title: 'Sibling Referral Program',
        description: 'Sibling families have 2.3x higher lifetime value',
        impact: 'Could increase average family value by 25%',
        effort: 'Medium',
        priority: 'Medium'
      },
      {
        type: 'marketing',
        title: 'Focus on Word-of-Mouth',
        description: 'Word-of-mouth has highest conversion rate (75%)',
        impact: 'Shifting 20% of marketing budget could improve ROI',
        effort: 'Low',
        priority: 'Medium'
      }
    ];
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
