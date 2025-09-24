const express = require('express');
const router = express.Router();

// Mock data for demonstration - replace with real database queries
const mockFinancialData = {
  bankBalance: 3247,
  expectedToday: 1749,
  outstandingRevenue: 4915,
  daysCashOnHand: 7,
  urgentCollections: [
    {
      id: 1,
      family: 'Johnson Family',
      amount: 1166,
      daysLate: 15,
      type: 'ESA payment',
      note: 'Usually reliable'
    },
    {
      id: 2,
      family: 'Martinez Family',
      amount: 583,
      daysLate: 10,
      type: 'Omella failed',
      note: 'Card expired'
    },
    {
      id: 3,
      family: 'Smith Family',
      amount: 750,
      daysLate: 30,
      type: 'Need payment plan',
      note: 'High risk'
    }
  ],
  quickWins: [
    {
      id: 1,
      title: 'Raise tuition by $75/month',
      impact: 'Would add 15 days cash',
      context: 'Still $200 below market'
    },
    {
      id: 2,
      title: '3 enrollment inquiries pending',
      impact: 'Worth $1,749/month',
      context: 'Follow up today'
    },
    {
      id: 3,
      title: 'Apply for FL Opportunity Grant',
      impact: '$15,000 available',
      context: 'Due in 10 days'
    }
  ],
  weeklyForecast: [
    { day: 'Today (Tue)', balance: 3247, change: '+$1,749 expected', status: 'danger' },
    { day: 'Wed', balance: 4996, change: 'No transactions', status: 'warning' },
    { day: 'Thu', balance: 3496, change: '-$1,500 utilities', status: 'warning' },
    { day: 'Fri', balance: 1246, change: '-$2,250 insurance', status: 'danger' },
    { day: 'Mon', balance: -254, change: 'NEGATIVE!', status: 'critical' }
  ]
};

// GET /api/dashboard/summary
router.get('/summary', (req, res) => {
  try {
    const summary = {
      timestamp: new Date().toISOString(),
      schoolName: 'Sunshine Microschool',
      ...mockFinancialData
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// GET /api/dashboard/alerts
router.get('/alerts', (req, res) => {
  try {
    const alerts = [
      {
        id: 1,
        type: 'critical',
        title: 'Cash will go negative in 7 days',
        description: 'Critical alert: Cash will go negative in 7 days without action',
        actionRequired: true,
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'warning',
        title: '8 families late on payments',
        description: 'Outstanding revenue increased by $1,200 from yesterday',
        actionRequired: true,
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        type: 'opportunity',
        title: 'Grant application deadline approaching',
        description: 'FL Opportunity Grant ($15,000) due in 10 days',
        actionRequired: false,
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// POST /api/dashboard/action
router.post('/action', (req, res) => {
  try {
    const { actionType, targetId, data } = req.body;
    
    // Mock action handling - replace with real business logic
    const actionResults = {
      'send_reminder': 'Reminder email sent successfully',
      'request_new_card': 'Card update request sent to family',
      'call_now': 'Call scheduled for today at 2:00 PM',
      'see_template': 'Template letter generated',
      'view_leads': 'Redirecting to enrollment pipeline',
      'start_application': 'Grant application portal opened'
    };
    
    const result = actionResults[actionType] || 'Action completed';
    
    res.json({
      success: true,
      message: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute action' });
  }
});

module.exports = router;
