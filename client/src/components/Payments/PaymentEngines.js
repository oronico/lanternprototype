import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  LinkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

/**
 * Payment Engines Integration
 * 
 * Manages connections to:
 * - ClassWallet (ESA/Voucher payments)
 * - Stripe (Credit cards, ACH, subscriptions)
 * - Omella (K-12 specialized payments)
 * 
 * Features:
 * - Connect/disconnect payment processors
 * - Track incoming payments from each source
 * - Handle tranche deposits (weekly batch deposits)
 * - Split deposits among students
 * - Sync to QuickBooks for reconciliation
 */

const PAYMENT_ENGINES = [
  {
    id: 'classwallet',
    name: 'ClassWallet',
    description: 'ESA and voucher payment processing',
    icon: '🎓',
    color: 'blue',
    features: ['ESA payments', 'Weekly tranche deposits', 'Voucher compliance', 'Parent portal'],
    typical: '60% of voucher schools',
    setupSteps: [
      'Register as approved vendor',
      'Get API credentials',
      'Map programs to ClassWallet categories',
      'Enable parent notifications'
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Credit cards, ACH, subscriptions',
    icon: '💳',
    color: 'purple',
    features: ['Credit/debit cards', 'ACH transfers', 'Recurring billing', 'Instant payouts'],
    typical: '80% market penetration',
    setupSteps: [
      'Create Stripe account',
      'Complete business verification',
      'Get API keys',
      'Set up payment methods'
    ]
  },
  {
    id: 'omella',
    name: 'Omella',
    description: 'K-12 specialized payment platform',
    icon: '🏫',
    color: 'green',
    features: ['Tuition billing', 'Event payments', 'Donations', 'Family portal'],
    typical: '15% of microschools',
    setupSteps: [
      'Create Omella account',
      'Set up school profile',
      'Configure payment plans',
      'Enable family portal'
    ]
  }
];

export default function PaymentEngines() {
  const emit = useEventEmit();
  const [connectedEngines, setConnectedEngines] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trancheDeposits, setTrancheDeposits] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(null);

  useEffect(() => {
    analytics.trackPageView('payment-engines');
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    // Demo connected engines
    setConnectedEngines([
      {
        id: 'classwallet',
        status: 'connected',
        connectedDate: '2024-08-15',
        lastSync: '2024-09-25 08:00 AM',
        accountId: 'CW-***4567',
        monthlyVolume: 16324,
        transactionCount: 28,
        nextTranche: '2024-09-27', // Friday
        trancheAmount: 16324
      },
      {
        id: 'stripe',
        status: 'connected',
        connectedDate: '2024-08-10',
        lastSync: '2024-09-25 09:15 AM',
        accountId: 'acct_***890',
        monthlyVolume: 4200,
        transactionCount: 7,
        instantPayouts: true
      }
    ]);

    // Demo tranche deposits (weekly batches from ClassWallet)
    setTrancheDeposits([
      {
        id: 1,
        engine: 'classwallet',
        depositDate: '2024-09-20',
        totalAmount: 16324,
        status: 'deposited',
        studentCount: 28,
        reconciled: false,
        quickbooksSync: false,
        students: [
          { name: 'Emma Johnson', family: 'Johnson', amount: 583, esaId: 'ESA-12345' },
          { name: 'Carlos Martinez', family: 'Martinez', amount: 583, esaId: 'ESA-12346' },
          { name: 'Sofia Martinez', family: 'Martinez', amount: 583, esaId: 'ESA-12347' },
          // ... more students
        ]
      },
      {
        id: 2,
        engine: 'classwallet',
        depositDate: '2024-09-13',
        totalAmount: 16324,
        status: 'deposited',
        studentCount: 28,
        reconciled: true,
        quickbooksSync: true,
        quickbooksSyncDate: '2024-09-13 10:30 AM',
        students: []
      }
    ]);

    // Demo recent transactions
    setRecentTransactions([
      {
        id: 1,
        date: '2024-09-25',
        family: 'Johnson',
        student: 'Emma Johnson',
        amount: 1200,
        method: 'Stripe - Auto-pay',
        status: 'completed',
        engine: 'stripe'
      },
      {
        id: 2,
        date: '2024-09-20',
        family: 'Martinez (ESA)',
        student: 'Carlos & Sofia',
        amount: 1166,
        method: 'ClassWallet Tranche',
        status: 'needs_allocation',
        engine: 'classwallet',
        trancheId: 1
      }
    ]);
  };

  const handleConnect = (engineId) => {
    setSelectedEngine(PAYMENT_ENGINES.find(e => e.id === engineId));
    setShowConnectModal(true);
    
    analytics.trackFeatureUsage('paymentEngines', 'start_connect', {
      engine: engineId
    });
  };

  const handleSyncToQuickBooks = (trancheId) => {
    analytics.trackFeatureUsage('paymentEngines', 'sync_quickbooks', {
      trancheId: trancheId
    });
    
    setTrancheDeposits(prev => prev.map(t => 
      t.id === trancheId 
        ? { ...t, quickbooksSync: true, quickbooksSyncDate: new Date().toLocaleString() }
        : t
    ));
    
    toast.success('Tranche synced to QuickBooks!');
    
    emit('payment.reconciled', {
      trancheId: trancheId,
      platform: 'quickbooks'
    });
  };

  const handleAllocateToStudents = (trancheId) => {
    analytics.trackFeatureUsage('paymentEngines', 'allocate_tranche', {
      trancheId: trancheId
    });
    
    setTrancheDeposits(prev => prev.map(t => 
      t.id === trancheId 
        ? { ...t, reconciled: true }
        : t
    ));
    
    toast.success('Payments allocated to students!');
  };

  const getEngineDetails = (engineId) => {
    return PAYMENT_ENGINES.find(e => e.id === engineId);
  };

  const isConnected = (engineId) => {
    return connectedEngines.some(e => e.id === engineId);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCardIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Engines</h1>
              <p className="text-gray-600">Manage ClassWallet, Stripe, and Omella integrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Engines Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PAYMENT_ENGINES.map(engine => {
          const connection = connectedEngines.find(c => c.id === engine.id);
          const connected = !!connection;
          
          return (
            <div key={engine.id} className={`bg-white rounded-lg shadow p-6 border-2 ${
              connected ? 'border-green-200' : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{engine.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{engine.name}</h3>
                    <p className="text-xs text-gray-500">{engine.typical}</p>
                  </div>
                </div>
                {connected && (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{engine.description}</p>

              {connected ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Monthly Volume:</span>
                      <span className="font-medium">${connection.monthlyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-medium">{connection.transactionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium text-xs">{connection.lastSync}</span>
                    </div>
                  </div>

                  {connection.nextTranche && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-700 mb-1">Next Tranche Deposit</div>
                      <div className="font-medium text-blue-900">{connection.nextTranche}</div>
                      <div className="text-sm text-blue-800">${connection.trancheAmount.toLocaleString()}</div>
                    </div>
                  )}

                  <button className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    Manage Connection
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(engine.id)}
                  className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  <LinkIcon className="h-4 w-4" />
                  Connect {engine.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Tranche Deposits Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tranche Deposits (Weekly Batches)</h2>
        <p className="text-sm text-gray-600 mb-6">
          ClassWallet deposits student payments in weekly batches. Allocate each deposit to individual students and sync to QuickBooks.
        </p>

        <div className="space-y-4">
          {trancheDeposits.map(tranche => {
            const engine = getEngineDetails(tranche.engine);
            
            return (
              <div key={tranche.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{engine.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {engine.name} Tranche Deposit
                      </div>
                      <div className="text-sm text-gray-600">
                        {tranche.depositDate} • {tranche.studentCount} students
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${tranche.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Total deposit</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    tranche.status === 'deposited' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tranche.status === 'deposited' ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      <ClockIcon className="h-4 w-4" />
                    )}
                    {tranche.status === 'deposited' ? 'Deposited' : 'Pending'}
                  </div>

                  {tranche.reconciled ? (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      <CheckCircleIcon className="h-4 w-4" />
                      Allocated to Students
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      Needs Allocation
                    </div>
                  )}

                  {tranche.quickbooksSync ? (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-4 w-4" />
                      Synced to QuickBooks
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      Not Synced
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {!tranche.reconciled && (
                    <button
                      onClick={() => handleAllocateToStudents(tranche.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Allocate to Students
                    </button>
                  )}
                  
                  {tranche.reconciled && !tranche.quickbooksSync && (
                    <button
                      onClick={() => handleSyncToQuickBooks(tranche.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Sync to QuickBooks
                    </button>
                  )}
                  
                  {tranche.students.length > 0 && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                      View {tranche.studentCount} Student Allocations
                    </button>
                  )}
                </div>

                {/* Student Allocation Preview (if available) */}
                {tranche.students.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Student Allocations ({tranche.students.length})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {tranche.students.slice(0, 3).map((student, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                          <span className="text-gray-700">{student.name} ({student.family})</span>
                          <span className="font-medium">${student.amount}</span>
                        </div>
                      ))}
                      {tranche.students.length > 3 && (
                        <div className="text-xs text-gray-500 italic">
                          + {tranche.students.length - 3} more students
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        
        <div className="space-y-3">
          {recentTransactions.map(txn => {
            const engine = getEngineDetails(txn.engine);
            
            return (
              <div key={txn.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{engine.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{txn.family}</div>
                    <div className="text-sm text-gray-600">{txn.student}</div>
                    <div className="text-xs text-gray-500">{txn.method}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${txn.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{txn.date}</div>
                  {txn.status === 'needs_allocation' && (
                    <div className="text-xs text-orange-600 mt-1">Needs allocation</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

