import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    analytics.trackPageView('unified-payments');
    loadData();
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
        status: 'completed',
        reconciled: true
      },
      {
        id: 2,
        date: '2024-09-20',
        family: 'Martinez',
        student: 'Carlos & Sofia',
        amount: 1166,
        method: 'ClassWallet ESA',
        engine: 'classwallet',
        status: 'completed',
        reconciled: false,
        needsAllocation: true,
        trancheId: 1
      },
      {
        id: 3,
        date: '2024-09-20',
        family: 'Williams',
        student: 'Noah Williams',
        amount: 1200,
        method: 'Stripe Auto-pay',
        engine: 'stripe',
        status: 'completed',
        reconciled: true
      },
      {
        id: 4,
        date: '2024-09-18',
        family: 'Brown',
        student: 'Olivia & Ethan',
        amount: 828,
        method: 'Stripe Auto-pay',
        engine: 'stripe',
        status: 'completed',
        reconciled: true
      },
      {
        id: 5,
        date: '2024-09-15',
        family: 'Chen',
        student: 'Alex Chen',
        amount: 0,
        method: 'Check',
        engine: 'manual',
        status: 'pending',
        reconciled: false,
        dueDate: '2024-09-30'
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

  const handleSyncToQuickBooks = (trancheId) => {
    setTrancheDeposits(prev => prev.map(t =>
      t.id === trancheId ? { ...t, quickbooksSync: true } : t
    ));
    
    toast.success('Synced to QuickBooks!');
    analytics.trackFeatureUsage('unifiedPayments', 'sync_quickbooks');
  };

  const handleReconcile = (transactionId) => {
    setTransactions(prev => prev.map(t =>
      t.id === transactionId ? { ...t, reconciled: true } : t
    ));
    
    toast.success('Transaction reconciled!');
    analytics.trackFeatureUsage('unifiedPayments', 'reconcile_transaction');
  };

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const unreconciledCount = transactions.filter(t => !t.reconciled).length;
  const connectedEnginesCount = engines.filter(e => e.status === 'connected').length;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
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
          <div className="mb-4 flex gap-4">
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                {filteredTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{txn.family}</div>
                      <div className="text-sm text-gray-500">{txn.student}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{txn.method}</div>
                      <div className="text-xs text-gray-500">{engines.find(e => e.id === txn.engine)?.name || txn.engine}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {txn.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                      {!txn.reconciled && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Unreconciled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!txn.reconciled && (
                        <button
                          onClick={() => handleReconcile(txn.id)}
                          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                          Reconcile
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'engines' && (
        <div>
          {/* Connected Engines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {engines.map(engine => (
              <div key={engine.id} className={`bg-white rounded-lg shadow p-6 border-2 ${
                engine.status === 'connected' ? 'border-green-200' : 'border-gray-200'
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
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">Payment Reconciliation</div>
            <div className="text-sm text-blue-700">
              Match bank deposits to student payments and sync to QuickBooks.
            </div>
          </div>

          {unreconciledCount > 0 ? (
            <div className="space-y-3">
              {transactions.filter(t => !t.reconciled).map(txn => (
                <div key={txn.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{txn.family} - {txn.student}</div>
                      <div className="text-sm text-gray-600">${txn.amount} via {txn.method}</div>
                      <div className="text-xs text-gray-500">{txn.date}</div>
                    </div>
                    <div className="flex gap-3">
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
  );
}

