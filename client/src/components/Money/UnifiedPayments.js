import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';
import TransactionSplitModal from './TransactionSplitModal';
import { financialsAPI } from '../../services/api';
import { buildDefaultAllocations, normalizeAllocations, computeActivitySummary } from '../../utils/financials';

/**
 * Unified Payments Hub
 * 
 * Combines three features into one:
 * 1. Payment Tracking - See all payments
 * 2. Payment Engines - ClassWallet, Stripe, Omella connections
 * 3. Payment Reconciliation - Match payments to students
 * 
 * Uses tabs for organization, not separate pages
 */

export default function UnifiedPayments() {
  const emit = useEventEmit();
  const [activeTab, setActiveTab] = useState('transactions'); // transactions, engines, reconcile
  const [transactions, setTransactions] = useState([]);
  const [engines, setEngines] = useState([]);
  const [trancheDeposits, setTrancheDeposits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statements, setStatements] = useState([]);
  const [activitySummary, setActivitySummary] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState('');
  const defaultSplitModalState = { open: false, transaction: null, allocations: [], error: '', saving: false };
  const [splitModal, setSplitModal] = useState(defaultSplitModalState);

  useEffect(() => {
    analytics.trackPageView('unified-payments');
    loadData();
    loadActivityFeed();
  }, []);

  const loadData = () => {
    // Demo payment engines
    setEngines([
      {
        id: 'classwallet',
        name: 'ClassWallet',
        icon: '🎓',
        status: 'connected',
        monthlyVolume: 16324,
        transactionCount: 28,
        nextTranche: '2024-09-27',
        lastSync: '2 hours ago'
      },
      {
        id: 'stripe',
        name: 'Stripe',
        icon: '💳',
        status: 'connected',
        monthlyVolume: 4200,
        transactionCount: 7,
        lastSync: '1 hour ago'
      },
      {
        id: 'omella',
        name: 'Omella',
        icon: '🏫',
        status: 'not_connected',
        monthlyVolume: 0,
        transactionCount: 0
      }
    ]);

    // Demo transactions (all sources combined)
    setTransactions([
      {
        id: 1,
        date: '2024-09-25',
        family: 'Johnson',
        student: 'Emma Johnson',
        amount: 1200,
        method: 'Stripe Auto-pay',
        engine: 'stripe',
        direction: 'inbound',
        status: 'mapped',
        requiresSplit: false,
        reconciled: true,
        students: [{ name: 'Emma Johnson', amount: 1200 }],
        allowLea: false
      },
      {
        id: 2,
        date: '2024-09-20',
        family: 'Martinez',
        student: 'Carlos & Sofia',
        amount: 1166,
        method: 'ClassWallet ESA',
        engine: 'classwallet',
        direction: 'inbound',
        status: 'needs_split',
        requiresSplit: true,
        reconciled: false,
        statementId: 'stmt_sep_operating',
        allowLea: true
      },
      {
        id: 3,
        date: '2024-09-20',
        family: 'Williams',
        student: 'Noah Williams',
        amount: 1200,
        method: 'Stripe Auto-pay',
        engine: 'stripe',
        direction: 'inbound',
        status: 'mapped',
        requiresSplit: false,
        reconciled: true,
        students: [{ name: 'Noah Williams', amount: 1200 }],
        allowLea: false
      },
      {
        id: 4,
        date: '2024-09-18',
        family: 'Brown',
        student: 'Olivia & Ethan',
        amount: 828,
        method: 'Stripe Auto-pay',
        engine: 'stripe',
        direction: 'inbound',
        status: 'mapped',
        requiresSplit: false,
        reconciled: true,
        students: [
          { name: 'Olivia Brown', amount: 414 },
          { name: 'Ethan Brown', amount: 414 }
        ],
        allowLea: false
      },
      {
        id: 5,
        date: '2024-09-15',
        family: 'Chen',
        student: 'Alex Chen',
        amount: 0,
        method: 'Check',
        engine: 'manual',
        direction: 'outbound',
        status: 'needs_category',
        reconciled: false,
        vendor: 'Supplies Co',
        memo: 'STEM classroom kits',
        allowLea: false
      }
    ]);

    // Demo tranche deposits
    setTrancheDeposits([
      {
        id: 1,
        date: '2024-09-20',
        amount: 16324,
        studentCount: 28,
        reconciled: false,
        quickbooksSync: false
      }
    ]);
  };

  const loadActivityFeed = async () => {
    setActivityLoading(true);
    setActivityError('');
    try {
      const { data } = await financialsAPI.getActivityFeed();
      const normalized = (data.activity || []).map(txn => ({
        ...txn,
        reconciled: txn.reconciled ?? false
      }));
      setTransactions(normalized);
      setStatements(data.statements || []);
      setActivitySummary(data.summary || computeActivitySummary(normalized));
    } catch (error) {
      console.error('Failed to load activity feed', error);
      setActivityError('Unable to load Plaid feed right now. Showing cached data.');
      setActivitySummary(prev => prev || computeActivitySummary(transactions));
    } finally {
      setActivityLoading(false);
    }
  };

  const openSplitModalForTransaction = (txn) => {
    setSplitModal({
      open: true,
      transaction: txn,
      allocations: buildDefaultAllocations(txn),
      error: '',
      saving: false
    });
  };

  const closeSplitModal = () => setSplitModal(defaultSplitModalState);

  const handleSplitSave = async (allocations) => {
    if (!splitModal.transaction) return;
    const txn = splitModal.transaction;
    const normalized = normalizeAllocations(allocations);
    const total = normalized.reduce((sum, alloc) => sum + alloc.amount, 0);

    if (Math.round(total * 100) !== Math.round(txn.amount * 100)) {
      setSplitModal(prev => ({ ...prev, error: `Allocation must total $${txn.amount}` }));
      return;
    }

    try {
      setSplitModal(prev => ({ ...prev, saving: true, error: '' }));
      await financialsAPI.splitTransaction(txn.id, normalized);
      await loadActivityFeed();
      closeSplitModal();
      toast.success('Deposit mapped per student');
    } catch (error) {
      console.error('Failed to save split', error);
      setSplitModal(prev => ({ ...prev, error: 'Unable to save split. Try again.' }));
    } finally {
      setSplitModal(prev => ({ ...prev, saving: false }));
    }
  };

  const handleMarkCategorized = async (txnId) => {
    try {
      await financialsAPI.markCategorized(txnId);
      await loadActivityFeed();
      toast.success('Expense categorized');
    } catch (error) {
      console.error('Failed to mark categorized', error);
      setActivityError('Unable to update transaction. Try again.');
    }
  };

  const handleMarkAsLEA = async (txnId) => {
    try {
      await financialsAPI.markAsLEADeposit(txnId);
      await loadActivityFeed();
      toast.success('Marked as LEA / state funding');
    } catch (error) {
      console.error('Failed to mark LEA deposit', error);
      setActivityError('Unable to update deposit. Try again.');
    }
  };

  const handleViewStatement = (statementId) => {
    const statement = statements.find(stmt => stmt.id === statementId);
    if (statement?.file) {
      window.open(statement.file, '_blank');
    } else {
      toast('Statement available soon.');
    }
  };

  const handleSyncToQuickBooks = (trancheId) => {
    setTrancheDeposits(prev => prev.map(t =>
      t.id === trancheId ? { ...t, quickbooksSync: true } : t
    ));
    
    toast.success('Synced to QuickBooks!');
    analytics.trackFeatureUsage('unifiedPayments', 'sync_quickbooks');
  };

  const handleReconcile = (transactionId) => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn) return;

    if (txn.requiresSplit) {
      toast.error('Split this deposit per student before reconciling.');
      return;
    }

    if (txn.status !== 'mapped') {
      toast.error('Categorize this transaction before reconciling.');
      return;
    }

    setTransactions(prev => prev.map(t =>
      t.id === transactionId ? { ...t, reconciled: true } : t
    ));
    
    toast.success('Transaction reconciled!');
    analytics.trackFeatureUsage('unifiedPayments', 'reconcile_transaction');
  };

  const totalRevenue = activitySummary?.inboundAmount ??
    transactions
      .filter(t => t.direction === 'inbound')
      .reduce((sum, t) => sum + t.amount, 0);
  
  const unreconciledCount = transactions.filter(t => !t.reconciled).length;
  const connectedEnginesCount = engines.filter(e => e.status === 'connected').length;
  const reviewCount = activitySummary?.needsReviewCount ?? transactions.filter(t => t.status !== 'mapped').length;
  const needsSplitCount = activitySummary?.needsSplitCount ?? transactions.filter(t => t.requiresSplit).length;
  const statementsNeedingReview = useMemo(
    () => statements.reduce((sum, stmt) => sum + (stmt.lines?.filter(line => line.status !== 'matched').length || 0), 0),
    [statements]
  );
  const coachPrompts = useMemo(() => {
    const prompts = [];
    if (needsSplitCount > 0) {
      prompts.push({
        id: 'split',
        text: `Let's split ${needsSplitCount} deposit${needsSplitCount === 1 ? '' : 's'} to the right students so reconciliation stays clean.`,
        actions: [{ label: 'Split deposits', onClick: () => setActiveTab('transactions') }]
      });
    }
    if (statementsNeedingReview > 0) {
      prompts.push({
        id: 'statements',
        text: `${statementsNeedingReview} statement line${statementsNeedingReview === 1 ? '' : 's'} still need receipts or categorization.`,
        actions: [{ label: 'Review statements', onClick: () => setActiveTab('transactions') }]
      });
    }
    if (unreconciledCount > 0) {
      prompts.push({
        id: 'reconcile',
        text: `${unreconciledCount} transaction${unreconciledCount === 1 ? '' : 's'} are ready for reconciliation.`,
        actions: [{ label: 'Open reconcile tab', onClick: () => setActiveTab('reconcile') }]
      });
    }
    return prompts;
  }, [needsSplitCount, statementsNeedingReview, unreconciledCount]);
  const primaryCoachPrompt = coachPrompts[0];
  const runCoachAction = (action) => {
    if (action.onClick) action.onClick();
    if (action.href) window.location.href = action.href;
  };

  const filteredTransactions = transactions.filter(t => {
    const searchLower = searchTerm.toLowerCase();
    const familyName = (t.family || '').toLowerCase();
    const studentName = t.student
      ? t.student.toLowerCase()
      : (t.students || []).map(s => s.name || '').join(' ').toLowerCase();
    const matchesSearch = familyName.includes(searchLower) || studentName.includes(searchLower);
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
          ? t.status === 'mapped' && !t.requiresSplit
          : t.status !== 'mapped' || t.requiresSplit;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600">All payment sources, tracking, and reconciliation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">This Month</div>
          <div className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">total received</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Payment Engines</div>
          <div className="text-3xl font-bold text-blue-600">{connectedEnginesCount}/3</div>
          <div className="text-xs text-gray-500 mt-1">connected</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Transactions</div>
          <div className="text-3xl font-bold text-gray-900">{transactions.length}</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Unreconciled</div>
          <div className={`text-3xl font-bold ${unreconciledCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {unreconciledCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">need attention</div>
        </div>
      </div>

      {primaryCoachPrompt && (
        <div className="mb-6 bg-gradient-to-r from-primary-100 to-primary-200 border border-primary-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-primary-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">AI Coach</p>
              <p className="text-sm text-gray-800">{primaryCoachPrompt.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {primaryCoachPrompt.actions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => runCoachAction(action)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white text-primary-700 border border-primary-200 rounded-lg shadow-sm"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveTab('engines')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'engines'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payment Engines
          </button>
          <button
            onClick={() => setActiveTab('reconcile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reconcile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reconciliation {unreconciledCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                {unreconciledCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'transactions' && (
        <div>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by family or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="touch-target w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-600">
            <span className="px-3 py-1.5 bg-gray-100 rounded-full">{reviewCount} transactions need review</span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-full">{needsSplitCount} deposits need student splits</span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-full">{statements.length} statements available</span>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="table-scroll">
              <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family / Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activityLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                      Loading Plaid feed...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-sm text-gray-500">
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : filteredTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{txn.family}</div>
                      <div className="text-sm text-gray-500">{txn.student}</div>
                      {txn.students && txn.students.length > 0 && (
                        <div className="mt-1 text-xs text-primary-700 space-x-2">
                          {txn.students.map(s => (
                            <span key={`${txn.id}-${s.name}`}>{s.name}: ${s.amount.toLocaleString()}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{txn.method}</div>
                      <div className="text-xs text-gray-500">{engines.find(e => e.id === txn.engine)?.name || txn.engine}</div>
                      {txn.statementId && (
                        <button
                          onClick={() => handleViewStatement(txn.statementId)}
                          className="mt-2 text-xs text-primary-600 font-semibold"
                        >
                          View statement
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === 'mapped' && !txn.requiresSplit
                          ? 'bg-green-100 text-green-800'
                          : txn.status === 'needs_category'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {txn.status === 'mapped' && !txn.requiresSplit ? 'Ready' : txn.status === 'needs_category' ? 'Needs category' : 'Needs split'}
                        </span>
                        {txn.allocationType === 'lea' && (
                          <div className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-flex">
                            LEA / State Funding
                          </div>
                        )}
                      </div>
                      {!txn.reconciled && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Unreconciled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {txn.requiresSplit && (
                          <button
                            onClick={() => openSplitModalForTransaction(txn)}
                            className="touch-target px-3 py-2 text-xs font-semibold bg-primary-600 text-white rounded-lg"
                          >
                            Split per student
                          </button>
                        )}
                        {txn.requiresSplit && txn.allowLea && (
                          <button
                            onClick={() => handleMarkAsLEA(txn.id)}
                            className="touch-target px-3 py-2 text-xs font-semibold border border-primary-300 text-blue-700 rounded-lg"
                          >
                            Mark LEA / State
                          </button>
                        )}
                        {txn.status === 'needs_category' && (
                          <button
                            onClick={() => handleMarkCategorized(txn.id)}
                            className="touch-target px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg"
                          >
                            Mark categorized
                          </button>
                        )}
                        {!txn.reconciled && (
                          <button
                            onClick={() => handleReconcile(txn.id)}
                            className="touch-target px-3 py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                          >
                            Reconcile
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
          {activityError && (
            <div className="mt-3 text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
              {activityError}
            </div>
          )}
        </div>
      )}

      {activeTab === 'engines' && (
        <div>
          {/* Connected Engines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {engines.map(engine => (
              <div key={engine.id} className={`bg-white rounded-lg shadow p-6 border-2 ${
                engine.status === 'connected' ? 'border-success-300' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{engine.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{engine.name}</h3>
                    </div>
                  </div>
                  {engine.status === 'connected' && (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  )}
                </div>

                {engine.status === 'connected' ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly:</span>
                      <span className="font-medium">${engine.monthlyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-medium">{engine.transactionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium text-xs">{engine.lastSync}</span>
                    </div>
                    {engine.nextTranche && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                        Next tranche: {engine.nextTranche}
                      </div>
                    )}
                  </div>
                ) : (
                  <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Connect {engine.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tranche Deposits */}
          {trancheDeposits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ClassWallet Tranche Deposits</h3>
              <div className="space-y-4">
                {trancheDeposits.map(tranche => (
                  <div key={tranche.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-gray-900">Weekly Batch Deposit</div>
                        <div className="text-sm text-gray-600">{tranche.date} • {tranche.studentCount} students</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${tranche.amount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!tranche.reconciled && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Allocate to Students
                        </button>
                      )}
                      {tranche.reconciled && !tranche.quickbooksSync && (
                        <button
                          onClick={() => handleSyncToQuickBooks(tranche.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                          Sync to QuickBooks
                        </button>
                      )}
                      {tranche.quickbooksSync && (
                        <div className="px-4 py-2 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5" />
                          Synced to QuickBooks
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reconcile' && (
        <div>
          <div className="mb-6 p-4 bg-blue-50 border border-primary-300 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">Payment Reconciliation</div>
            <div className="text-sm text-blue-700">
              Match bank deposits to student payments and sync to QuickBooks.
            </div>
          </div>

          {unreconciledCount > 0 ? (
            <div className="space-y-3">
              {transactions.filter(t => !t.reconciled).map(txn => (
                <div key={txn.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-medium text-gray-900">{txn.family} - {txn.student}</div>
                      <div className="text-sm text-gray-600">${txn.amount} via {txn.method}</div>
                      <div className="text-xs text-gray-500">{txn.date}</div>
                      {txn.requiresSplit && (
                        <div className="mt-2 text-xs text-orange-700">
                          Split this deposit per student before reconciling.
                        </div>
                      )}
                      {txn.status === 'needs_category' && !txn.requiresSplit && (
                        <div className="mt-2 text-xs text-yellow-700">
                          Categorize this transaction before reconciling.
                        </div>
                      )}
                      {txn.allocationType === 'lea' && (
                        <div className="mt-2 text-xs text-blue-700">
                          Marked as LEA / state funding deposit.
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {txn.requiresSplit && (
                        <button
                          onClick={() => openSplitModalForTransaction(txn)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Split deposit
                        </button>
                      )}
                      {txn.requiresSplit && txn.allowLea && (
                        <button
                          onClick={() => handleMarkAsLEA(txn.id)}
                          className="px-4 py-2 border border-primary-300 rounded-lg text-blue-700 hover:bg-blue-50"
                        >
                          Mark LEA / State
                        </button>
                      )}
                      {txn.status === 'needs_category' && !txn.requiresSplit && (
                        <button
                          onClick={() => handleMarkCategorized(txn.id)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Mark categorized
                        </button>
                      )}
                      <button
                        onClick={() => handleReconcile(txn.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Reconcile
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Reconciled! 🎉</h3>
              <p className="text-gray-600">All transactions match your bank account.</p>
            </div>
          )}
        </div>
      )}
    </div>
    {splitModal.open && (
      <TransactionSplitModal
        data={splitModal}
        onClose={closeSplitModal}
        onChangeAllocations={(allocs) => setSplitModal(prev => ({ ...prev, allocations: allocs, error: '' }))}
        onSave={handleSplitSave}
      />
    )}
    </>
  );
}

