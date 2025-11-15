const express = require('express');
const router = express.Router();

const financialActivity = [
  {
    id: 'txn_001',
    date: '2024-09-27',
    description: 'ACH CLASSWALLET BATCH',
    amount: 2332,
    direction: 'inbound',
    account: 'Chase Operating',
    memo: 'ACH CLASSWALLET * 10331',
    family: 'Lopez',
    requiresSplit: true,
    status: 'needs_split',
    source: 'Plaid'
  },
  {
    id: 'txn_002',
    date: '2024-09-26',
    description: 'Stripe Auto-Pay',
    amount: 1200,
    direction: 'inbound',
    account: 'Chase Operating',
    memo: 'STRIPE*Emma Johnson',
    family: 'Johnson',
    requiresSplit: false,
    status: 'mapped',
    students: [{ name: 'Emma Johnson', amount: 1200 }],
    source: 'Plaid'
  },
  {
    id: 'txn_003',
    date: '2024-09-25',
    description: 'Staples Store 885',
    amount: 218,
    direction: 'outbound',
    account: 'AmEx Card',
    memo: 'Office supplies',
    vendor: 'Staples',
    requiresSplit: false,
    status: 'needs_category',
    source: 'Statement',
    statementId: 'stmt_sep_card'
  },
  {
    id: 'txn_004',
    date: '2024-09-24',
    description: 'Gusto Payroll Debit',
    amount: 8421,
    direction: 'outbound',
    account: 'Chase Operating',
    memo: 'Payroll batch 09/24',
    requiresSplit: false,
    status: 'mapped',
    source: 'Plaid'
  }
];

const financialStatements = [
  {
    id: 'stmt_sep_card',
    account: 'AmEx School Card',
    period: 'Sep 2024',
    file: 'https://files.schoolstack.ai/statements/amex-sep-2024.pdf',
    status: 'uploaded',
    type: 'credit_card',
    lines: [
      { id: 'line_card_1', date: '2024-09-22', description: 'Staples Store 885', amount: 218, category: 'Classroom Supplies', status: 'needs_review', receiptAttached: false },
      { id: 'line_card_2', date: '2024-09-20', description: 'Home Depot #442', amount: 146, category: 'Facilities', status: 'matched', receiptAttached: true },
      { id: 'line_card_3', date: '2024-09-18', description: 'Uber Trip', amount: 32, category: 'Travel', status: 'flagged', receiptAttached: false }
    ]
  },
  {
    id: 'stmt_sep_operating',
    account: 'Chase Operating',
    period: 'Sep 2024',
    file: 'https://files.schoolstack.ai/statements/chase-operating-sep-2024.pdf',
    status: 'processing',
    type: 'bank',
    lines: [
      { id: 'line_bank_1', date: '2024-09-27', description: 'ACH CLASSWALLET BATCH', amount: 2332, category: 'Tuition Deposits', status: 'needs_review', receiptAttached: false },
      { id: 'line_bank_2', date: '2024-09-24', description: 'Gusto Payroll Debit', amount: 8421, category: 'Payroll', status: 'matched', receiptAttached: false }
    ]
  }
];

let monthCloseChecklist = [
  { id: 'step_plaid_sync', title: 'Review Plaid feed', description: 'Categorize all transactions & split per student', done: false },
  { id: 'step_statements', title: 'Attach bank & card statements', description: 'Upload PDF statements or Plaid Assets reports', done: false },
  { id: 'step_tuition', title: 'Confirm tuition per student', description: 'Every deposit mapped to individual students + GL', done: false },
  { id: 'step_expenses', title: 'Categorize expenses to GL accounts', description: 'Ensure uncategorized bucket is under 10%', done: false },
  { id: 'step_payroll', title: 'Verify payroll + benefits', description: 'Confirm gross payroll, taxes & reimbursements', done: false },
  { id: 'step_reports', title: 'Generate bank-ready financials', description: 'Export cash flow, P&L, and balance sheet', done: false }
];

const summarizeActivity = () => {
  const needsReviewCount = financialActivity.filter(txn => txn.status !== 'mapped').length;
  const needsSplitCount = financialActivity.filter(txn => txn.requiresSplit).length;
  const inboundAmount = financialActivity
    .filter(txn => txn.direction === 'inbound')
    .reduce((sum, txn) => sum + txn.amount, 0);

  return {
    needsReviewCount,
    needsSplitCount,
    inboundAmount
  };
};

const summarizeChecklist = () => {
  if (!monthCloseChecklist.length) {
    return { completed: 0, total: 0, percent: 0 };
  }
  const completed = monthCloseChecklist.filter(step => step.done).length;
  const total = monthCloseChecklist.length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100)
  };
};

router.get('/activity', (req, res) => {
  res.json({
    activity: financialActivity,
    statements: financialStatements,
    summary: summarizeActivity(),
    lastUpdated: new Date().toISOString()
  });
});

router.post('/activity/:activityId/split', (req, res) => {
  const { activityId } = req.params;
  const { allocations } = req.body;

  if (!Array.isArray(allocations) || allocations.length === 0) {
    return res.status(400).json({ error: 'Allocations are required' });
  }

  const transaction = financialActivity.find(txn => txn.id === activityId);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const totalAllocation = allocations.reduce((sum, alloc) => sum + Number(alloc.amount || 0), 0);
  if (Math.round(totalAllocation * 100) !== Math.round(transaction.amount * 100)) {
    return res.status(400).json({ error: 'Allocations must total transaction amount' });
  }

  transaction.requiresSplit = false;
  transaction.status = 'mapped';
  transaction.students = allocations.map(alloc => ({
    name: alloc.name,
    amount: Number(alloc.amount || 0),
    grade: alloc.grade || ''
  }));

  res.json({
    success: true,
    transaction,
    summary: summarizeActivity()
  });
});

router.post('/activity/:activityId/mark-categorized', (req, res) => {
  const { activityId } = req.params;
  const transaction = financialActivity.find(txn => txn.id === activityId);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transaction.status = 'mapped';

  res.json({
    success: true,
    transaction,
    summary: summarizeActivity()
  });
});

router.get('/month-close', (req, res) => {
  res.json({
    checklist: monthCloseChecklist,
    progress: summarizeChecklist(),
    lastUpdated: new Date().toISOString()
  });
});

router.post('/month-close/:stepId', (req, res) => {
  const { stepId } = req.params;
  const { completed } = req.body;

  const stepIndex = monthCloseChecklist.findIndex(step => step.id === stepId);
  if (stepIndex === -1) {
    return res.status(404).json({ error: 'Checklist step not found' });
  }

  monthCloseChecklist[stepIndex].done = Boolean(completed);

  res.json({
    success: true,
    checklist: monthCloseChecklist,
    progress: summarizeChecklist()
  });
});

router.post('/statements/:statementId/lines/:lineId', (req, res) => {
  const { statementId, lineId } = req.params;
  const updates = req.body || {};

  const statement = financialStatements.find(stmt => stmt.id === statementId);
  if (!statement) {
    return res.status(404).json({ error: 'Statement not found' });
  }

  const lineIndex = statement.lines.findIndex(line => line.id === lineId);
  if (lineIndex === -1) {
    return res.status(404).json({ error: 'Statement line not found' });
  }

  statement.lines[lineIndex] = {
    ...statement.lines[lineIndex],
    ...updates
  };

  res.json({
    success: true,
    statements: financialStatements
  });
});

module.exports = router;

