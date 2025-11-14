const express = require('express');
const router = express.Router();

let fundraisingAnnualGoal = 150000;

const stageWeights = {
  prospect: 0.15,
  nurture: 0.3,
  pursue: 0.45,
  apply: 0.65,
  closed_won: 1,
  closed_lost: 0
};

let fundraisingOpportunities = [
  {
    id: 'opp_001',
    name: 'STEM Innovation Grant',
    organizationType: 'foundation',
    pursuitType: 'grant',
    awardType: 'restricted',
    stage: 'apply',
    askAmount: 75000,
    amountAwarded: 0,
    contact: {
      name: 'Sarah Patel',
      organization: 'Bright Futures Foundation',
      email: 'spatel@bff.org',
      phone: '555-4821'
    },
    nextStep: 'Submit financials + board roster',
    dueDate: '2024-11-30',
    lastTouch: '2024-10-05',
    notes: 'Requires audited financials for FY23',
    eventName: '',
    pursuitTheme: 'STEM Labs for Girls',
    createdAt: '2024-07-12',
    updatedAt: '2024-10-05'
  },
  {
    id: 'opp_002',
    name: 'Winter Giving Circle',
    organizationType: 'individual',
    pursuitType: 'request',
    awardType: 'unrestricted',
    stage: 'nurture',
    askAmount: 15000,
    amountAwarded: 0,
    contact: {
      name: 'Marcus Rivera',
      organization: 'Parent Giving Circle',
      email: 'marcus@givingcircle.io',
      phone: '555-2114'
    },
    nextStep: 'Invite to campus breakfast 10/25',
    dueDate: '2024-12-15',
    lastTouch: '2024-10-02',
    notes: 'Interested in literacy outcomes',
    eventName: '',
    pursuitTheme: 'Parent Annual Fund',
    createdAt: '2024-08-01',
    updatedAt: '2024-10-02'
  },
  {
    id: 'opp_003',
    name: 'Innovators Gala 2024',
    organizationType: 'corporation',
    pursuitType: 'event',
    awardType: 'restricted',
    stage: 'pursue',
    askAmount: 40000,
    amountAwarded: 0,
    contact: {
      name: 'Lena Wu',
      organization: 'TechNova',
      email: 'lena.wu@technova.com',
      phone: '555-9912'
    },
    nextStep: 'Confirm table sponsorship level',
    dueDate: '2024-10-25',
    lastTouch: '2024-10-06',
    notes: 'Will sponsor STEM showcase if naming rights available',
    eventName: 'Innovators Gala',
    pursuitTheme: 'Corporate STEM Showcase',
    createdAt: '2024-09-01',
    updatedAt: '2024-10-06'
  },
  {
    id: 'opp_004',
    name: 'Learning Recovery Fund',
    organizationType: 'foundation',
    pursuitType: 'grant',
    awardType: 'restricted',
    stage: 'closed_won',
    askAmount: 50000,
    amountAwarded: 50000,
    contact: {
      name: 'Dana Cole',
      organization: 'Rise Together Fund',
      email: 'dcole@risetogether.org',
      phone: '555-7710'
    },
    nextStep: 'Submit quarterly impact report 01/15',
    dueDate: '2024-09-01',
    lastTouch: '2024-09-05',
    notes: 'Supports intervention tutors. First installment received.',
    eventName: '',
    pursuitTheme: 'Academic Recovery',
    createdAt: '2024-04-15',
    updatedAt: '2024-09-05'
  },
  {
    id: 'opp_005',
    name: 'Community Impact Pitch',
    organizationType: 'corporation',
    pursuitType: 'request',
    awardType: 'unrestricted',
    stage: 'closed_lost',
    askAmount: 25000,
    amountAwarded: 0,
    contact: {
      name: 'Erin Blake',
      organization: 'MetroBank',
      email: 'erin.blake@metrobank.com',
      phone: '555-8844'
    },
    nextStep: 'Capture feedback for FY25 cycle',
    dueDate: '2024-08-15',
    lastTouch: '2024-08-20',
    notes: 'Great relationship, invited to apply next year.',
    eventName: '',
    pursuitTheme: 'Community Innovation Pitch',
    createdAt: '2024-03-22',
    updatedAt: '2024-08-20'
  }
];

let fundraisingDocuments = [
  {
    id: 'doc_001',
    opportunityId: 'opp_004',
    name: 'Award Letter - Learning Recovery Fund',
    type: 'award_letter',
    status: 'stored',
    lastUpdated: '2024-09-05',
    url: 'https://schoolstack.ai/docs/learning-recovery-award.pdf',
    required: true
  },
  {
    id: 'doc_002',
    opportunityId: 'opp_001',
    name: '990-EZ FY23',
    type: 'irs_form',
    status: 'awaiting_upload',
    lastUpdated: '2024-10-01',
    url: '',
    required: true
  },
  {
    id: 'doc_003',
    opportunityId: 'opp_003',
    name: 'Sponsorship Agreement Draft',
    type: 'contract',
    status: 'in_review',
    lastUpdated: '2024-10-07',
    url: '',
    required: false
  }
];

let bookkeepingSyncQueue = [
  {
    id: 'sync_001',
    opportunityId: 'opp_004',
    description: 'Learning Recovery Fund installment',
    account: '4230 · Restricted Grants',
    amount: 50000,
    status: 'ready_to_sync',
    lastSynced: '2024-09-08'
  },
  {
    id: 'sync_002',
    opportunityId: 'opp_003',
    description: 'Innovators Gala pledges',
    account: '4250 · Events Revenue',
    amount: 40000,
    status: 'pending_amount',
    lastSynced: null
  }
];

const buildSummary = () => {
  const securedRestricted = fundraisingOpportunities
    .filter(op => op.stage === 'closed_won' && op.awardType === 'restricted')
    .reduce((sum, op) => sum + (op.amountAwarded || 0), 0);

  const securedUnrestricted = fundraisingOpportunities
    .filter(op => op.stage === 'closed_won' && op.awardType === 'unrestricted')
    .reduce((sum, op) => sum + (op.amountAwarded || 0), 0);

  const pipelineTotal = fundraisingOpportunities
    .filter(op => op.stage !== 'closed_won' && op.stage !== 'closed_lost')
    .reduce((sum, op) => sum + (op.askAmount || 0), 0);

  const weightedForecast = fundraisingOpportunities.reduce((sum, op) => {
    const weight = stageWeights[op.stage] ?? 0;
    return sum + (op.askAmount || 0) * weight;
  }, 0);

  const wonCount = fundraisingOpportunities.filter(op => op.stage === 'closed_won').length;
  const closedCount = fundraisingOpportunities.filter(op => ['closed_won', 'closed_lost'].includes(op.stage)).length;

  return {
    annualGoal: fundraisingAnnualGoal,
    securedRestricted,
    securedUnrestricted,
    pipelineTotal,
    weightedForecast,
    winRate: closedCount ? Math.round((wonCount / closedCount) * 100) : 0
  };
};

router.get('/opportunities', (req, res) => {
  res.json({
    annualGoal: fundraisingAnnualGoal,
    opportunities: fundraisingOpportunities,
    documents: fundraisingDocuments,
    bookkeepingSync: bookkeepingSyncQueue,
    summary: buildSummary()
  });
});

router.post('/opportunities', (req, res) => {
  const {
    name,
    organizationType,
    pursuitType,
    awardType,
    eventName,
    stage,
    askAmount,
    amountAwarded,
    contact,
    nextStep,
    dueDate,
    notes
  } = req.body;

  const newOpportunity = {
    id: `opp_${Date.now()}`,
    name,
    organizationType,
    pursuitType,
    awardType,
    eventName: pursuitType === 'event' ? eventName : '',
    stage,
    askAmount: Number(askAmount) || 0,
    amountAwarded: stage === 'closed_won' ? Number(amountAwarded || askAmount || 0) : 0,
    contact,
    nextStep,
    dueDate,
    lastTouch: new Date().toISOString().split('T')[0],
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  fundraisingOpportunities = [newOpportunity, ...fundraisingOpportunities];

  res.json({
    success: true,
    opportunity: newOpportunity,
    summary: buildSummary()
  });
});

router.put('/opportunities/:id', (req, res) => {
  const { id } = req.params;
  const idx = fundraisingOpportunities.findIndex(op => op.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  fundraisingOpportunities[idx] = {
    ...fundraisingOpportunities[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    opportunity: fundraisingOpportunities[idx],
    summary: buildSummary()
  });
});

router.put('/goal', (req, res) => {
  const { goal } = req.body;
  fundraisingAnnualGoal = Number(goal) || fundraisingAnnualGoal;

  res.json({
    success: true,
    annualGoal: fundraisingAnnualGoal,
    summary: buildSummary()
  });
});

module.exports = router;

