const express = require('express');
const router = express.Router();

// Mock payment data
const mockPayments = [
  {
    id: 1,
    family: 'Johnson Family',
    familyDetails: '2 children • ESA eligible',
    amount: 1166,
    source: { name: 'ClassWallet', icon: 'CW' },
    dueDate: '2024-11-01',
    status: 'late',
    statusText: '15 days late',
    action: 'Chase'
  },
  {
    id: 2,
    family: 'Martinez Family',
    familyDetails: '1 child • Monthly plan',
    amount: 583,
    source: { name: 'Omella', icon: 'OM' },
    dueDate: '2024-11-05',
    status: 'failed',
    statusText: 'Failed - Card Expired',
    action: 'Update Card'
  },
  {
    id: 3,
    family: 'Thompson Family',
    familyDetails: '3 children • Sibling discount',
    amount: 1458,
    source: { name: 'Stripe', icon: 'ST' },
    dueDate: '2024-11-01',
    status: 'paid',
    statusText: 'Paid Nov 1',
    action: null
  },
  {
    id: 4,
    family: 'Wilson Family',
    familyDetails: '1 child • Quarterly payer',
    amount: 1749,
    source: { name: 'Check', icon: 'CH' },
    dueDate: '2024-11-10',
    status: 'pending',
    statusText: 'Check #2847 - Processing',
    action: 'Log Deposit'
  },
  {
    id: 5,
    family: 'Davis Family',
    familyDetails: '2 children • Staff discount',
    amount: 800,
    source: { name: 'Zelle', icon: 'ZL' },
    dueDate: '2024-11-01',
    status: 'paid',
    statusText: 'Paid Nov 3',
    action: null
  }
];

const integrationStatus = [
  { 
    name: 'Omella', 
    type: 'payment_processor',
    status: 'connected', 
    lastSync: '2 minutes ago',
    description: 'K-12 payment processing',
    monthlyVolume: 8750,
    transactionCount: 15,
    features: ['ACH', 'Credit Cards', 'Payment Plans', 'ESA Integration']
  },
  { 
    name: 'ClassWallet', 
    type: 'esa_platform',
    status: 'connected', 
    lastSync: '5 minutes ago',
    description: 'ESA/voucher management',
    monthlyVolume: 12250,
    transactionCount: 21,
    features: ['ESA Payments', 'Vendor Management', 'Compliance', 'Reporting']
  },
  { 
    name: 'Stripe', 
    type: 'payment_processor',
    status: 'connected', 
    lastSync: '1 minute ago',
    description: 'General payment processing',
    monthlyVolume: 3500,
    transactionCount: 6,
    features: ['Credit Cards', 'ACH', 'Recurring', 'Subscriptions']
  },
  { 
    name: 'Plaid (Bank)', 
    type: 'banking',
    status: 'connected', 
    lastSync: '3 minutes ago',
    description: 'Bank account integration',
    monthlyVolume: null,
    transactionCount: null,
    features: ['Balance Sync', 'Transaction Import', 'Categorization', 'Reconciliation']
  },
  { 
    name: 'QuickBooks Online', 
    type: 'accounting',
    status: 'connected', 
    lastSync: '1 hour ago',
    description: 'Accounting & bookkeeping',
    monthlyVolume: null,
    transactionCount: 127,
    features: ['GL Sync', 'Invoice Matching', 'Tax Reports', 'P&L Automation']
  },
  { 
    name: 'Xero', 
    type: 'accounting',
    status: 'available', 
    lastSync: null,
    description: 'Alternative accounting platform',
    monthlyVolume: null,
    transactionCount: null,
    features: ['GL Sync', 'Bank Feeds', 'Reporting', 'Multi-Currency']
  },
  { 
    name: 'Gusto', 
    type: 'payroll',
    status: 'connected', 
    lastSync: '6 hours ago',
    description: 'Payroll & HR management',
    monthlyVolume: 8500,
    transactionCount: 4,
    features: ['Payroll Processing', 'Tax Filing', 'Benefits', 'Compliance']
  },
  { 
    name: 'PayPal', 
    type: 'payment_processor',
    status: 'available', 
    lastSync: null,
    description: 'Alternative payment method',
    monthlyVolume: null,
    transactionCount: null,
    features: ['PayPal Payments', 'Venmo', 'Buy Now Pay Later', 'International']
  },
  { 
    name: 'Square', 
    type: 'payment_processor',
    status: 'available', 
    lastSync: null,
    description: 'POS and online payments',
    monthlyVolume: null,
    transactionCount: null,
    features: ['In-Person', 'Online', 'Invoicing', 'Inventory']
  },
  { 
    name: 'Zelle', 
    type: 'bank_transfer',
    status: 'monitoring', 
    lastSync: '1 day ago',
    description: 'Bank-to-bank transfers',
    monthlyVolume: 800,
    transactionCount: 1,
    features: ['Instant Transfer', 'No Fees', 'Bank Integration', 'Manual Tracking']
  },
  { 
    name: 'Venmo', 
    type: 'p2p_payment',
    status: 'monitoring', 
    lastSync: null,
    description: 'Peer-to-peer payments',
    monthlyVolume: 0,
    transactionCount: 0,
    features: ['Social Payments', 'Mobile First', 'Instant Transfer', 'Manual Entry']
  },
  { 
    name: 'Cash App', 
    type: 'p2p_payment',
    status: 'available', 
    lastSync: null,
    description: 'Mobile payment app',
    monthlyVolume: null,
    transactionCount: null,
    features: ['QR Codes', 'Instant Transfer', 'Cash Card', 'Manual Tracking']
  }
];

// GET /api/payments
router.get('/', (req, res) => {
  try {
    const { status, month } = req.query;
    
    let filteredPayments = mockPayments;
    
    if (status && status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }
    
    res.json({
      payments: filteredPayments,
      total: filteredPayments.length,
      totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
      integrations: integrationStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET /api/payments/statistics
router.get('/statistics', (req, res) => {
  try {
    const stats = {
      totalReceivable: mockPayments.reduce((sum, payment) => sum + payment.amount, 0),
      totalPaid: mockPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0),
      totalPending: mockPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0),
      totalLate: mockPayments.filter(p => p.status === 'late' || p.status === 'failed').reduce((sum, payment) => sum + payment.amount, 0),
      collectionRate: 0.82,
      averageDaysToCollect: 8.5,
      paymentMethods: {
        'ClassWallet': 1166,
        'Omella': 583,
        'Stripe': 1458,
        'Check': 1749,
        'Zelle': 800
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment statistics' });
  }
});

// POST /api/payments/:id/action
router.post('/:id/action', (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { actionType } = req.body;
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Mock action handling
    const actionResults = {
      'chase': `Reminder sent to ${payment.family}`,
      'update_card': `Card update request sent to ${payment.family}`,
      'log_deposit': `Deposit logged for ${payment.family}`,
      'schedule_call': `Call scheduled with ${payment.family}`
    };
    
    const result = actionResults[actionType] || 'Action completed';
    
    res.json({
      success: true,
      message: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute payment action' });
  }
});

// GET /api/payments/integrations
router.get('/integrations', (req, res) => {
  try {
    const { type } = req.query;
    
    let filteredIntegrations = integrationStatus;
    if (type) {
      filteredIntegrations = integrationStatus.filter(integration => integration.type === type);
    }
    
    // Calculate summary stats
    const connectedIntegrations = integrationStatus.filter(i => i.status === 'connected');
    const totalMonthlyVolume = integrationStatus
      .filter(i => i.monthlyVolume)
      .reduce((sum, i) => sum + i.monthlyVolume, 0);
    const totalTransactions = integrationStatus
      .filter(i => i.transactionCount)
      .reduce((sum, i) => sum + i.transactionCount, 0);
    
    const integrationsByType = {
      payment_processor: integrationStatus.filter(i => i.type === 'payment_processor'),
      accounting: integrationStatus.filter(i => i.type === 'accounting'),
      banking: integrationStatus.filter(i => i.type === 'banking'),
      payroll: integrationStatus.filter(i => i.type === 'payroll'),
      esa_platform: integrationStatus.filter(i => i.type === 'esa_platform'),
      p2p_payment: integrationStatus.filter(i => i.type === 'p2p_payment'),
      bank_transfer: integrationStatus.filter(i => i.type === 'bank_transfer')
    };
    
    res.json({
      integrations: filteredIntegrations,
      integrationsByType,
      summary: {
        totalIntegrations: integrationStatus.length,
        connectedIntegrations: connectedIntegrations.length,
        connectionRate: Math.round((connectedIntegrations.length / integrationStatus.length) * 100),
        totalMonthlyVolume,
        totalTransactions,
        dataFreshness: 'Real-time'
      },
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integration status' });
  }
});

// GET /api/payments/integrations/:name
router.get('/integrations/:name', (req, res) => {
  try {
    const { name } = req.params;
    const integration = integrationStatus.find(i => 
      i.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '')
    );
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    // Mock detailed integration data
    const detailedData = {
      ...integration,
      apiVersion: '2024.1',
      webhookStatus: integration.status === 'connected' ? 'active' : 'inactive',
      permissions: getIntegrationPermissions(integration.name),
      lastError: null,
      uptime: integration.status === 'connected' ? '99.9%' : null,
      rateLimits: {
        current: Math.floor(Math.random() * 100),
        limit: 1000,
        resetTime: '1 hour'
      },
      recentActivity: generateRecentActivity(integration)
    };
    
    res.json(detailedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integration details' });
  }
});

// POST /api/payments/integrations/:name/connect
router.post('/integrations/:name/connect', (req, res) => {
  try {
    const { name } = req.params;
    const { credentials } = req.body;
    
    const integration = integrationStatus.find(i => 
      i.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '')
    );
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    // Mock connection process
    integration.status = 'connected';
    integration.lastSync = new Date().toISOString();
    
    res.json({
      success: true,
      message: `Successfully connected to ${integration.name}`,
      integration,
      nextSteps: getConnectionNextSteps(integration.name)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect integration' });
  }
});

// POST /api/payments/integrations/:name/disconnect
router.post('/integrations/:name/disconnect', (req, res) => {
  try {
    const { name } = req.params;
    
    const integration = integrationStatus.find(i => 
      i.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '')
    );
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    integration.status = 'available';
    integration.lastSync = null;
    
    res.json({
      success: true,
      message: `Successfully disconnected from ${integration.name}`,
      integration
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect integration' });
  }
});

function getIntegrationPermissions(name) {
  const permissions = {
    'Omella': ['read_payments', 'create_payment_links', 'access_reports'],
    'ClassWallet': ['read_esa_payments', 'vendor_management', 'compliance_reports'],
    'Stripe': ['read_payments', 'create_charges', 'manage_subscriptions', 'access_webhooks'],
    'Plaid (Bank)': ['read_accounts', 'read_transactions', 'read_balances'],
    'QuickBooks Online': ['read_company', 'write_transactions', 'read_reports', 'manage_invoices'],
    'Xero': ['read_accounts', 'write_transactions', 'read_reports'],
    'Gusto': ['read_payroll', 'read_employees', 'access_reports']
  };
  return permissions[name] || ['basic_access'];
}

function getConnectionNextSteps(name) {
  const nextSteps = {
    'Omella': [
      'Configure webhook endpoints',
      'Set up payment notification emails',
      'Test payment processing flow'
    ],
    'ClassWallet': [
      'Complete vendor verification',
      'Set up ESA payment categories',
      'Configure compliance reporting'
    ],
    'QuickBooks Online': [
      'Map chart of accounts',
      'Set up automatic categorization rules',
      'Configure tax reporting'
    ],
    'Xero': [
      'Set up bank feeds',
      'Configure invoice templates',
      'Map expense categories'
    ]
  };
  return nextSteps[name] || ['Complete initial setup', 'Test connection', 'Configure preferences'];
}

function generateRecentActivity(integration) {
  if (integration.status !== 'connected') return [];
  
  const activities = [
    'Transaction sync completed',
    'Webhook received and processed',
    'Monthly report generated',
    'Account balance updated',
    'Payment notification sent'
  ];
  
  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    action: activities[Math.floor(Math.random() * activities.length)],
    status: 'success'
  }));
}

// POST /api/payments/sync
router.post('/sync', (req, res) => {
  try {
    const { provider } = req.body;
    
    // Mock sync operation
    setTimeout(() => {
      res.json({
        success: true,
        message: `${provider} sync completed`,
        newTransactions: Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString()
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync payments' });
  }
});

module.exports = router;
