import React, { useState, useEffect } from 'react';
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  PaperClipIcon,
  CheckIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';
import TransactionSplitModal from './TransactionSplitModal';
import { buildDefaultAllocations, normalizeAllocations } from '../../utils/financials';

/**
 * Unified Bookkeeping Hub
 * 
 * Combines:
 * 1. Bank Accounts - Plaid integration for all accounts
 * 2. Bookkeeping - Transaction categorization
 * 3. QuickBooks Sync - Automatic ledger updates
 * 4. Accounting Method - Cash vs Accrual tracking
 * 
 * All money movement tracked in one place
 */

const ACCOUNTING_METHODS = {
  CASH: {
    value: 'cash',
    name: 'Cash Basis',
    description: 'Revenue recorded when received, expenses when paid',
    bestFor: 'Most microschools and small schools (simpler, matches bank)',
    taxRule: 'Report income when cash received',
    example: 'Student pays September tuition in October → Count in October',
    recommended: true
  },
  ACCRUAL: {
    value: 'accrual',
    name: 'Accrual Basis',
    description: 'Revenue recorded when earned, expenses when incurred',
    bestFor: 'GAAP compliance required (bank loans, investors, audits)',
    taxRule: 'Report income when invoice sent',
    example: 'September tuition invoiced Sep 1 → Count in September (even if paid in October)',
    recommended: false
  }
};

const CHART_OF_ACCOUNTS = [
  { id: 'tuition_revenue', name: 'Tuition Revenue', description: 'Private-pay tuition collected from enrolled students' },
  { id: 'esa_funding', name: 'ESA / Scholarship Funding', description: 'Education savings accounts, vouchers, or scholarship tax credits' },
  { id: 'fundraising_restricted', name: 'Fundraising – Restricted', description: 'Donations earmarked for a specific purpose' },
  { id: 'fundraising_unrestricted', name: 'Fundraising – Unrestricted', description: 'Donations available for any program' },
  { id: 'rent', name: 'Rent & Facilities', description: 'Lease payments or facility costs' },
  { id: 'debt_service', name: 'Debt Service', description: 'Mortgage or facility loan payments' },
  { id: 'utilities', name: 'Utilities', description: 'Electric, water, internet' },
  { id: 'insurance', name: 'Insurance', description: 'Property, liability, and student insurance' },
  { id: 'payroll_teachers', name: 'Teacher Payroll', description: 'Wages for classroom staff' },
  { id: 'payroll_support', name: 'Support Staff Payroll', description: 'Admin/support wages' },
  { id: 'benefits', name: 'Payroll Taxes & Benefits', description: 'Employer taxes, health plans, retirement' },
  { id: 'supplies', name: 'Classroom Supplies', description: 'Books, art supplies, cleaning, testing materials' },
  { id: 'technology', name: 'Technology & Subscriptions', description: 'Software, devices, licenses' },
  { id: 'curriculum', name: 'Curriculum & Instructional Materials', description: 'Curriculum purchases, PD content' },
  { id: 'professional_services', name: 'Professional Services', description: 'Legal, accounting, consultants' },
  { id: 'marketing', name: 'Marketing & Enrollment', description: 'Advertising, tours, events' },
  { id: 'travel', name: 'Travel', description: 'Mileage, airfare, lodging, parking' },
  { id: 'meals', name: 'Meals & Nutrition', description: 'Student meals and snacks' },
  { id: 'facility_repairs', name: 'Facility Repairs & Maintenance', description: 'Repairs, janitorial, safety' },
  { id: 'facility_improvements', name: 'Facility Improvements (CapEx)', description: 'Capital upgrades, build-outs' },
  { id: 'ffe', name: 'Furniture, Fixtures & Equipment (FF&E)', description: 'Desks, seating, hardware' },
  { id: 'taxes', name: 'Taxes & Fees', description: 'Business license, registrations, filings' },
  { id: 'other_income', name: 'Other Operating Revenue', description: 'Aftercare, camps, ancillary programs' }
];

const PROGRAM_CODES = [
  { id: 'full_time', name: 'Full-Time Microschool', description: 'Core instructional program' },
  { id: 'after_school', name: 'After-School Program', description: 'Extended day offerings' },
  { id: 'esa_program', name: 'ESA / Scholarship Program', description: 'Students funded through ESA or vouchers' },
  { id: 'summer', name: 'Summer Session', description: 'Seasonal programming' },
  { id: 'tutoring', name: 'Tutoring / Microsessions', description: 'Small group or 1:1 offerings' }
];

const defaultSplitModalState = {
  open: false,
  transaction: null,
  allocations: [],
  error: '',
  saving: false
};

export default function UnifiedBookkeeping() {
  const [activeTab, setActiveTab] = useState('accounts'); // accounts, categorization, sync, settings
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [quickbooksConnected, setQuickbooksConnected] = useState(false);
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [chartAccounts, setChartAccounts] = useState(CHART_OF_ACCOUNTS);
  const [programCodes, setProgramCodes] = useState(PROGRAM_CODES);
  const [newAccountName, setNewAccountName] = useState('');
  const [newProgramName, setNewProgramName] = useState('');
  const [splitModal, setSplitModal] = useState(defaultSplitModalState);

  useEffect(() => {
    analytics.trackPageView('unified-bookkeeping');
    
    // Load accounting method from onboarding (default to cash for small schools)
    const savedMethod = localStorage.getItem('accountingMethod') || 'cash';
    setAccountingMethod(savedMethod);
    
    loadData();
  }, []);

  useEffect(() => {
    setSelectedTransactions(prev =>
      prev.filter(id => transactions.some(txn => txn.id === id))
    );
  }, [transactions]);

  const loadData = () => {
    // Demo connected accounts via Plaid
    setPlaidConnected(true);
    setConnectedAccounts([
      {
        id: 1,
        name: 'Chase Business Checking',
        type: 'checking',
        lastFour: '4567',
        balance: 14200,
        institution: 'Chase Bank',
        connected: true,
        lastSync: '2 hours ago',
        plaidAccountId: 'plaid_***123'
      },
      {
        id: 2,
        name: 'Chase Business Savings',
        type: 'savings',
        lastFour: '8901',
        balance: 8500,
        institution: 'Chase Bank',
        connected: true,
        lastSync: '2 hours ago',
        plaidAccountId: 'plaid_***124'
      },
      {
        id: 3,
        name: 'Chase Credit Card',
        type: 'credit',
        lastFour: '2345',
        balance: -2400,
        institution: 'Chase Bank',
        connected: true,
        lastSync: '2 hours ago',
        plaidAccountId: 'plaid_***125'
      }
    ]);

    // Demo QuickBooks connection
    setQuickbooksConnected(true);

    // Demo recent transactions
    setTransactions([
      {
        id: 1,
        date: '2024-09-25',
        description: 'Johnson Family - Tuition',
        amount: 1200,
        account: 'Chase Checking',
        category: 'Tuition Revenue',
        glAccount: 'tuition_revenue',
        programCode: 'full_time',
        descriptionNote: 'September tuition payment',
        confidence: 98,
        status: 'categorized',
        syncedToQB: true,
        requiresSplit: false,
        receiptAttached: true
      },
      {
        id: 2,
        date: '2024-09-25',
        description: 'Electric Bill - Sunshine Power',
        amount: -467,
        account: 'Chase Checking',
        category: 'Utilities - Electric',
        glAccount: 'utilities',
        programCode: 'full_time',
        descriptionNote: 'September electric bill',
        confidence: 95,
        status: 'categorized',
        syncedToQB: true,
        requiresSplit: false,
        receiptAttached: true
      },
      {
        id: 3,
        date: '2024-09-24',
        description: 'Amazon Business Purchase',
        amount: -156,
        account: 'Chase Credit',
        category: 'Supplies',
        glAccount: '',
        programCode: '',
        descriptionNote: '',
        confidence: 85,
        status: 'review_needed',
        syncedToQB: false,
        requiresSplit: false,
        receiptAttached: false
      }
    ]);
  };

  const normalizeString = (value = '') => value.toLowerCase();

  const getHankSuggestions = (txn) => {
    const suggestion = {};
    const desc = normalizeString(txn.description);

    if (!txn.glAccount) {
      if (desc.includes('tuition') || desc.includes('family')) {
        suggestion.glAccount = 'tuition_revenue';
      } else if (desc.includes('esa') || desc.includes('voucher') || desc.includes('scholar')) {
        suggestion.glAccount = 'esa_funding';
      } else if (desc.includes('restricted')) {
        suggestion.glAccount = 'fundraising_restricted';
      } else if (desc.includes('donation') || desc.includes('gift') || desc.includes('grant')) {
        suggestion.glAccount = 'fundraising_unrestricted';
      } else if (desc.includes('rent') || desc.includes('lease')) {
        suggestion.glAccount = 'rent';
      } else if (desc.includes('loan') || desc.includes('debt')) {
        suggestion.glAccount = 'debt_service';
      } else if (desc.includes('electric') || desc.includes('power') || desc.includes('utility')) {
        suggestion.glAccount = 'utilities';
      } else if (desc.includes('insurance')) {
        suggestion.glAccount = 'insurance';
      } else if (desc.includes('payroll') || desc.includes('teacher')) {
        suggestion.glAccount = 'payroll_teachers';
      } else if (desc.includes('amazon') || desc.includes('supply') || desc.includes('supplies')) {
        suggestion.glAccount = 'supplies';
      } else if (desc.includes('tech') || desc.includes('software')) {
        suggestion.glAccount = 'technology';
      } else if (desc.includes('travel') || desc.includes('hotel') || desc.includes('gas')) {
        suggestion.glAccount = 'travel';
      } else if (desc.includes('meal') || desc.includes('food')) {
        suggestion.glAccount = 'meals';
      } else if (chartAccounts[0]) {
        suggestion.glAccount = chartAccounts[0].id;
      }
    }

    if (!txn.programCode) {
      if (desc.includes('after')) {
        suggestion.programCode = 'after_school';
      } else if (desc.includes('summer')) {
        suggestion.programCode = 'summer';
      } else if (desc.includes('esa') || desc.includes('voucher')) {
        suggestion.programCode = 'esa_program';
      } else {
        suggestion.programCode = 'full_time';
      }
    }

    if (!txn.descriptionNote) {
      suggestion.descriptionNote = txn.amount >= 0
        ? `Payment received: ${txn.description}`
        : `Expense paid: ${txn.description}`;
    }

    if (txn.requiresSplit && txn.amount >= 0) {
      suggestion.requiresSplit = false;
    }

    return suggestion;
  };

  const applyHankSuggestionsToTransaction = (txnId) => {
    let applied = false;
    setTransactions(prev =>
      prev.map(txn => {
        if (txn.id !== txnId) return txn;
        const suggestion = getHankSuggestions(txn);
        if (Object.keys(suggestion).length === 0) return txn;
        applied = true;
        return { ...txn, ...suggestion };
      })
    );
    if (applied) {
      toast.success('Hank filled in the details.');
    } else {
      toast('Looks good already.');
    }
  };

  const applyHankSuggestionsBulk = () => {
    if (!selectedTransactions.length) return;
    let applied = false;
    setTransactions(prev =>
      prev.map(txn => {
        if (!selectedTransactions.includes(txn.id)) return txn;
        const suggestion = getHankSuggestions(txn);
        if (Object.keys(suggestion).length === 0) return txn;
        applied = true;
        return { ...txn, ...suggestion };
      })
    );
    setSelectedTransactions([]);
    if (applied) {
      toast.success('Hank updated the selected transactions.');
    } else {
      toast('Those transactions were already ready.');
    }
  };

  const toggleSelectTransaction = (txnId) => {
    setSelectedTransactions(prev =>
      prev.includes(txnId)
        ? prev.filter(id => id !== txnId)
        : [...prev, txnId]
    );
  };

  const toggleSelectAllTransactions = (checked) => {
    if (checked) {
      setSelectedTransactions(transactions.map(txn => txn.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleConnectPlaid = () => {
    analytics.trackFeatureUsage('unifiedBookkeeping', 'connect_plaid');
    toast.success('Opening Plaid connection...');
    // In production: window.Plaid.create({ ... }).open();
  };

  const handleConnectQuickBooks = () => {
    analytics.trackFeatureUsage('unifiedBookkeeping', 'connect_quickbooks');
    toast.success('Redirecting to QuickBooks OAuth...');
    // In production: redirect to QuickBooks OAuth
  };

  const handleSyncNow = () => {
    analytics.trackFeatureUsage('unifiedBookkeeping', 'manual_sync');
    toast.success('Syncing all accounts...');
    
    setTimeout(() => {
      toast.success('All accounts synced!');
    }, 2000);
  };

  const totalBalance = connectedAccounts
    .filter(a => a.type !== 'credit')
    .reduce((sum, a) => sum + a.balance, 0);
  
  const categorizedCount = transactions.filter(t => t.status === 'categorized').length;
  const syncedToQBCount = transactions.filter(t => t.syncedToQB).length;

  const currentMethod = ACCOUNTING_METHODS[accountingMethod.toUpperCase()];

  const getTransactionStatus = (txn) => {
    if (txn.requiresSplit) return 'needs_split';
    if (!txn.glAccount) return 'needs_category';
    if (!txn.programCode) return 'needs_program';
    if (!txn.descriptionNote) return 'needs_description';
    if (!txn.receiptAttached) return 'needs_receipt';
    return 'ready';
  };

  const statusStyles = {
    ready: { label: 'Ready', className: 'bg-green-100 text-green-800' },
    needs_split: { label: 'Split deposit', className: 'bg-amber-100 text-amber-700' },
    needs_category: { label: 'Pick category', className: 'bg-amber-100 text-amber-700' },
    needs_program: { label: 'Assign program', className: 'bg-amber-100 text-amber-700' },
    needs_description: { label: 'Add description', className: 'bg-amber-100 text-amber-700' },
    needs_receipt: { label: 'Attach receipt', className: 'bg-amber-100 text-amber-700' }
  };

  const handleTransactionFieldChange = (id, field, value) => {
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === id ? { ...txn, [field]: value } : txn
      )
    );
  };

  const handleAttachReceipt = (id) => {
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === id ? { ...txn, receiptAttached: true } : txn
      )
    );
    toast.success('Receipt noted');
  };

  const openSplitModal = (txn) => {
    setSplitModal({
      open: true,
      transaction: txn,
      allocations: buildDefaultAllocations({ ...txn, family: txn.description }),
      error: '',
      saving: false
    });
  };

  const closeSplitModal = () => setSplitModal(defaultSplitModalState);

  const handleSplitSave = async (allocations) => {
    if (!splitModal.transaction) return;
    const normalized = normalizeAllocations(allocations);
    const total = normalized.reduce((sum, alloc) => sum + alloc.amount, 0);
    const txnAmount = Math.abs(splitModal.transaction.amount);
    if (Math.round(total * 100) !== Math.round(txnAmount * 100)) {
      setSplitModal(prev => ({ ...prev, error: `Split must total $${txnAmount}` }));
      return;
    }

    setTransactions(prev =>
      prev.map(txn =>
        txn.id === splitModal.transaction.id
          ? { ...txn, splitAllocations: normalized, requiresSplit: false }
          : txn
      )
    );
    toast.success('Split saved');
    closeSplitModal();
  };

  const transactionsNeedingAttention = transactions.filter(txn => getTransactionStatus(txn) !== 'ready');
  const needsReviewCount = transactionsNeedingAttention.length;
  const readyCount = transactions.length - needsReviewCount;
  const needsAttentionCount = needsReviewCount;
  const allTransactionsSelected = transactions.length > 0 && selectedTransactions.length === transactions.length;
  const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleAddChartAccount = () => {
    if (!newAccountName.trim()) {
      toast.error('Enter a name for the GL code');
      return;
    }
    const id = slugify(newAccountName);
    if (chartAccounts.some(acc => acc.id === id)) {
      toast.error('That GL code already exists');
      return;
    }
    setChartAccounts(prev => [
      ...prev,
      { id, name: newAccountName.trim(), description: 'Custom GL code added by your team' }
    ]);
    setNewAccountName('');
    toast.success('GL code added');
  };

  const handleAddProgram = () => {
    if (!newProgramName.trim()) {
      toast.error('Enter a program or project name');
      return;
    }
    const id = slugify(newProgramName);
    if (programCodes.some(program => program.id === id)) {
      toast.error('That program already exists');
      return;
    }
    setProgramCodes(prev => [
      ...prev,
      { id, name: newProgramName.trim(), description: 'Custom program added by your team' }
    ]);
    setNewProgramName('');
    toast.success('Program added');
  };

  const aiCoachInsights = [
    {
      id: 'weekly',
      title: 'Weekly Reconciliation',
      description: 'Sync Plaid feeds, split tranche receivables per student/program, and add descriptions for auditors.',
      status: needsReviewCount === 0 ? 'On track' : `${needsReviewCount} txns need review`,
      actionLabel: 'Review transactions',
      action: () => setActiveTab('categorization')
    },
    {
      id: 'chart',
      title: 'Chart of Accounts + Program Codes',
      description: 'AI recommends GL accounts + program tags so reports stay lender-ready.',
      status: 'Recommended',
      actionLabel: 'Generate recommendations',
      action: () => toast.success('AI chart of accounts coming right up (mock demo).')
    },
    {
      id: 'reports',
      title: 'Monthly Close Reports',
      description: 'Cash flow, P&L, balance sheet posted automatically when everything is categorized.',
      status: categorizedCount === transactions.length ? 'Ready to export' : 'Finish categorizing',
      actionLabel: 'Run reports',
      action: () => window.open('/health', '_blank')
    }
  ];

  const closeCheckpoints = [
    {
      id: 'month',
      label: 'Month End',
      why: 'Lock books so investors + board trust the numbers.',
      done: categorizedCount === transactions.length && needsReviewCount === 0 && syncedToQBCount === categorizedCount,
      steps: ['Categorize every txn', 'Attach bank/credit statements', 'Sync to QuickBooks', 'Generate CF / P&L / BS']
    },
    {
      id: 'quarter',
      label: 'Quarter Close',
      why: 'Spot trend shifts and prep for lender updates.',
      done: false,
      steps: ['Review program profitability', 'True-up deferred revenue', 'Update fundraising pipeline assumptions']
    },
    {
      id: 'year',
      label: 'Year Close',
      why: 'Audit-ready package with footnotes + board resolutions.',
      done: false,
      steps: ['Confirm 1099 + W2 totals', 'Finalize depreciation / amortization', 'Package audited-ready docs']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BuildingLibraryIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookkeeping</h1>
              <p className="text-gray-600">All accounts, transactions, and QuickBooks sync</p>
            </div>
          </div>
          
          <button
            onClick={handleSyncNow}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Sync Now
          </button>
        </div>
      </div>

      {/* Hank - AI Bookkeeper Coach */}
      <section className="mb-10 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Meet Hank, your AI bookkeeper</p>
              <h2 className="text-xl font-bold text-gray-900">Hank guides, coaches, and closes books like a controller</h2>
              <p className="text-sm text-gray-600">
                Why it matters: clean books unlock loans, board trust, and stress-free audits—Hank enforces the same controls a CPA would.
              </p>
            </div>
          </div>
          <button
            onClick={() => toast.success('Hank is reviewing every transaction right now.')}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
          >
            Ask Hank what to do next
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {aiCoachInsights.map((insight) => (
            <div key={insight.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{insight.title}</p>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
              <div className="text-xs font-semibold text-primary-600">{insight.status}</div>
              <button
                onClick={insight.action}
                className="text-sm font-semibold text-primary-600 hover:text-primary-800 inline-flex items-center gap-1"
              >
                {insight.actionLabel}
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {closeCheckpoints.map((checkpoint) => (
            <div key={checkpoint.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {checkpoint.id === 'month' && <ClipboardDocumentCheckIcon className="h-5 w-5 text-primary-600" />}
                  {checkpoint.id === 'quarter' && <ChartBarIcon className="h-5 w-5 text-primary-600" />}
                  {checkpoint.id === 'year' && <CalendarIcon className="h-5 w-5 text-primary-600" />}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{checkpoint.label}</p>
                  <p className="text-sm text-gray-600">{checkpoint.why}</p>
                </div>
              </div>
              <div className="mb-3 text-sm">
                <span className={`font-semibold ${checkpoint.done ? 'text-success-600' : 'text-primary-600'}`}>
                  {checkpoint.done ? 'Ready' : 'In progress'}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                {checkpoint.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-primary-300"></span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Accounting Method Notice */}
      <div className="mb-8 p-4 bg-blue-50 border border-primary-300 rounded-lg">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-blue-900 mb-1">
              Accounting Method: {currentMethod.name}
            </div>
            <div className="text-sm text-blue-800 mb-2">{currentMethod.description}</div>
            <div className="text-xs text-blue-700">
              <strong>Tax Rule:</strong> {currentMethod.taxRule}
            </div>
            <button 
              onClick={() => setActiveTab('settings')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Change Accounting Method →
            </button>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border-2 ${
          plaidConnected ? 'bg-green-50 border-success-300' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {plaidConnected ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <LinkIcon className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <div className="font-semibold text-gray-900">Plaid Integration</div>
                <div className="text-sm text-gray-600">Bank account connections</div>
              </div>
            </div>
            {!plaidConnected && (
              <button
                onClick={handleConnectPlaid}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Connect
              </button>
            )}
          </div>
          {plaidConnected && (
            <div className="mt-2 text-sm text-green-700">
              {connectedAccounts.length} accounts connected
            </div>
          )}
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          quickbooksConnected ? 'bg-green-50 border-success-300' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {quickbooksConnected ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <LinkIcon className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <div className="font-semibold text-gray-900">QuickBooks Online</div>
                <div className="text-sm text-gray-600">Accounting ledger sync</div>
              </div>
            </div>
            {!quickbooksConnected && (
              <button
                onClick={handleConnectQuickBooks}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Connect
              </button>
            )}
          </div>
          {quickbooksConnected && (
            <div className="mt-2 text-sm text-green-700">
              {syncedToQBCount} transactions synced
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Cash</div>
          <div className="text-3xl font-bold text-green-600">${totalBalance.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{connectedAccounts.filter(a => a.type !== 'credit').length} accounts</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Categorized</div>
          <div className="text-3xl font-bold text-blue-600">{categorizedCount}</div>
          <div className="text-xs text-gray-500 mt-1">transactions</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Needs Review</div>
          <div className={`text-3xl font-bold ${needsReviewCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {needsReviewCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">low confidence</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">QB Synced</div>
          <div className="text-3xl font-bold text-green-600">{syncedToQBCount}</div>
          <div className="text-xs text-gray-500 mt-1">to QuickBooks</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Connected Accounts
          </button>
          <button
            onClick={() => setActiveTab('categorization')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categorization'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorization {needsReviewCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                {needsReviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sync'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            QuickBooks Sync
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Connected Bank Accounts</h3>
            <button
              onClick={handleConnectPlaid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <LinkIcon className="h-5 w-5" />
              Add Account
            </button>
          </div>

          <div className="space-y-4">
            {connectedAccounts.map(account => (
              <div key={account.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <BuildingLibraryIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-semibold text-gray-900">{account.name}</div>
                      <div className="text-sm text-gray-600">
                        {account.institution} • ****{account.lastFour}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(account.balance).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{account.type}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Last synced: {account.lastSync}</span>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-800">
                    View Transactions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorization Tab */}
      {activeTab === 'categorization' && (
        <div>
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="font-medium text-primary-900 mb-1">AI-powered categorization</div>
            <div className="text-sm text-primary-700">
              Every transaction lands here. Choose the category (GL code), assign the program, add a plain-language description, and split if needed. Hank won’t close the books until each row is marked Ready.
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-100 mb-4">
            <div className="p-4 flex flex-wrap gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold text-gray-900">{readyCount}</span> ready for close
              </div>
              <div>
                <span className="font-semibold text-gray-900">{needsAttentionCount}</span> need details
              </div>
              <div className="text-gray-500">
                Hank requires category + program + description + split + receipt for every row.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-100">
            {selectedTransactions.length > 0 && (
              <div className="px-4 py-3 flex flex-wrap gap-3 items-center border-b border-gray-100 bg-primary-50">
                <div className="text-sm text-primary-800 font-medium">
                  Hank selected <span className="font-semibold">{selectedTransactions.length}</span> item{selectedTransactions.length === 1 ? '' : 's'}.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={applyHankSuggestionsBulk}
                    className="px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-1"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Apply Hank’s suggestion
                  </button>
                  <button
                    onClick={() => setSelectedTransactions([])}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            )}
            <div className="table-scroll">
              <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      checked={allTransactionsSelected}
                      onChange={(e) => toggleSelectAllTransactions(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Category (GL code)
                      <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-gray-400" title="Where this lands on your financial statements. Lenders look for consistent GL codes." />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Program / Project
                      <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-gray-400" title="Tie each dollar to the programs you offer so you can see which ones make money." />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center gap-1">
                      Description
                      <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-gray-400" title="Plain-language explanation that auditors and future you will understand." />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(txn => {
                  const hankSuggestion = getHankSuggestions(txn);
                  const suggestionAvailable = Object.keys(hankSuggestion).length > 0;
                  return (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(txn.id)}
                        onChange={() => toggleSelectTransaction(txn.id)}
                        className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{txn.description}</div>
                      <div className="text-xs text-gray-500">{txn.account}</div>
                    </td>
                    <td className={`px-6 py-4 font-medium ${
                      txn.amount >= 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {txn.amount >= 0 ? '+' : '-'}${Math.abs(txn.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={txn.glAccount || ''}
                        onChange={(e) => handleTransactionFieldChange(txn.id, 'glAccount', e.target.value)}
                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select GL code</option>
                        {chartAccounts.map(option => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={txn.programCode || ''}
                        onChange={(e) => handleTransactionFieldChange(txn.id, 'programCode', e.target.value)}
                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Choose program</option>
                        {programCodes.map(option => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <textarea
                        value={txn.descriptionNote || ''}
                        onChange={(e) => handleTransactionFieldChange(txn.id, 'descriptionNote', e.target.value)}
                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                        rows={2}
                        placeholder="Explain this in plain language"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAttachReceipt(txn.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                          txn.receiptAttached
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <PaperClipIcon className="h-4 w-4" />
                        {txn.receiptAttached ? 'Attached' : 'Attach'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${
                        txn.confidence >= 90 ? 'text-green-600' :
                        txn.confidence >= 75 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {txn.confidence}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        (statusStyles[getTransactionStatus(txn)] || {}).className || 'bg-gray-100 text-gray-700'
                      }`}>
                        {(statusStyles[getTransactionStatus(txn)] || {}).label || 'Review'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openSplitModal(txn)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Split
                      </button>
                      <button
                        onClick={() => applyHankSuggestionsToTransaction(txn.id)}
                        disabled={!suggestionAvailable}
                        className={`px-3 py-1.5 text-xs font-semibold border border-primary-200 rounded-lg ${
                          suggestionAvailable
                            ? 'text-primary-700 hover:bg-primary-50'
                            : 'text-gray-400 bg-gray-50 cursor-not-allowed border-gray-200'
                        }`}
                      >
                        Use Hank’s suggestion
                      </button>
                    </td>
                  </tr>
                );
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Chart of Accounts & Programs */}
      <div className="mb-10">
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <SparklesIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Hank’s chart builder</p>
                <h2 className="text-xl font-bold text-gray-900">Define the backbone once so every transaction falls into place</h2>
                <p className="text-sm text-gray-600">
                  Hank uses these GL codes and program tags to suggest categories, keep reports lender-ready, and prove you don’t need an outside bookkeeper.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue & expense GL codes</h3>
                  <p className="text-sm text-gray-600">Matches how boards, lenders, and Hank read your statements.</p>
                </div>
                <span className="text-xs text-gray-500">{chartAccounts.length} total</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {chartAccounts.map(account => (
                  <div key={account.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="font-semibold text-gray-900">{account.name}</div>
                    {account.description && (
                      <p className="text-xs text-gray-600 mt-1">{account.description}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Add a GL code (e.g., Transportation)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
                <button
                  onClick={handleAddChartAccount}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                >
                  + Add GL code
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Programs & Projects</h3>
                  <p className="text-sm text-gray-600">Tie every dollar to the offerings you actually run.</p>
                </div>
                <span className="text-xs text-gray-500">{programCodes.length} programs</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {programCodes.map(program => (
                  <div key={program.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="font-semibold text-gray-900">{program.name}</div>
                    {program.description && (
                      <p className="text-xs text-gray-600 mt-1">{program.description}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                  placeholder="Add a program (e.g., ESA Micro-Pods)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500	text-sm"
                />
                <button
                  onClick={handleAddProgram}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                >
                  + Add program
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why this matters</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Revenue accounts map private pay, ESA/voucher, and fundraising dollars per program.</li>
              <li>• Expense accounts cover facilities, payroll, curriculum, technology, travel, marketing, professional services, insurance, taxes, repairs, improvements, FF&E, meals, and more.</li>
              <li>• Program codes ensure every GL line can roll up by offering so lenders and boards see which programs make money.</li>
              <li>• Hank uses this list to auto-suggest categorizations and to prove controls were followed when books close.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* QuickBooks Sync Tab */}
      {activeTab === 'sync' && (
        <div>
          {quickbooksConnected ? (
            <div>
              <div className="mb-6 p-4 bg-green-50 border border-success-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-900">QuickBooks Online Connected</div>
                      <div className="text-sm text-green-700">Transactions sync automatically</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-700">
                    Last sync: 2 hours ago
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sync Status</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">Synced Transactions</span>
                    <span className="font-medium text-green-600">{syncedToQBCount} / {transactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">Last Sync</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">Auto-Sync</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700">Accounting Method</span>
                    <span className="font-medium">{currentMethod.name}</span>
                  </div>
                </div>

                <button
                  onClick={handleSyncNow}
                  className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Sync to QuickBooks Now
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect QuickBooks Online</h3>
              <p className="text-gray-600 mb-6">
                Automatically sync all transactions to your QuickBooks ledger
              </p>
              <button
                onClick={handleConnectQuickBooks}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Connect QuickBooks
              </button>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Accounting Method</h3>
            
            <div className="space-y-4">
              {Object.values(ACCOUNTING_METHODS).map(method => (
                <button
                  key={method.value}
                  onClick={() => {
                    setAccountingMethod(method.value);
                    localStorage.setItem('accountingMethod', method.value);
                    toast.success(`Accounting method updated to ${method.name}`);
                  }}
                  className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                    accountingMethod === method.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{method.name}</div>
                      <div className="text-sm text-gray-600 mb-3">{method.description}</div>
                    </div>
                    {accountingMethod === method.value && (
                      <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Best For:</div>
                      <div className="text-gray-700">{method.bestFor}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Tax Rule:</div>
                      <div className="text-gray-700">{method.taxRule}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
                    <strong>Example:</strong> {method.example}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Consult with your CPA before changing accounting methods.
                This affects how revenue and expenses are reported for taxes.
              </div>
            </div>
          </div>
        </div>
      )}
      {splitModal.open && (
        <TransactionSplitModal
          data={splitModal}
          onClose={closeSplitModal}
          onChangeAllocations={(allocs) => setSplitModal(prev => ({ ...prev, allocations: allocs, error: '' }))}
          onSave={handleSplitSave}
        />
      )}
    </div>
  );
}

