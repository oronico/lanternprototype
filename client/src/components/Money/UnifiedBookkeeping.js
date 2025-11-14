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
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

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

export default function UnifiedBookkeeping() {
  const [activeTab, setActiveTab] = useState('accounts'); // accounts, categorization, sync, settings
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [quickbooksConnected, setQuickbooksConnected] = useState(false);
  const [plaidConnected, setPlaidConnected] = useState(false);

  useEffect(() => {
    analytics.trackPageView('unified-bookkeeping');
    
    // Load accounting method from onboarding (default to cash for small schools)
    const savedMethod = localStorage.getItem('accountingMethod') || 'cash';
    setAccountingMethod(savedMethod);
    
    loadData();
  }, []);

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
        confidence: 98,
        status: 'categorized',
        syncedToQB: true
      },
      {
        id: 2,
        date: '2024-09-25',
        description: 'Electric Bill - Sunshine Power',
        amount: -467,
        account: 'Chase Checking',
        category: 'Utilities - Electric',
        confidence: 95,
        status: 'categorized',
        syncedToQB: true
      },
      {
        id: 3,
        date: '2024-09-24',
        description: 'Amazon Business Purchase',
        amount: -156,
        account: 'Chase Credit',
        category: 'Supplies',
        confidence: 85,
        status: 'review_needed',
        syncedToQB: false
      }
    ]);
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
  const needsReviewCount = transactions.filter(t => t.status === 'review_needed').length;
  const syncedToQBCount = transactions.filter(t => t.syncedToQB).length;

  const currentMethod = ACCOUNTING_METHODS[accountingMethod.toUpperCase()];

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

      {/* Accounting Method Notice */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
          plaidConnected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
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
          quickbooksConnected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
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
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">AI-Powered Categorization</div>
            <div className="text-sm text-blue-700">
              Transactions are automatically categorized and synced to QuickBooks.
              Review any with low confidence (&lt;90%).
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="table-scroll">
              <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(txn => (
                  <tr key={txn.id} className={txn.status === 'review_needed' ? 'bg-orange-50' : 'hover:bg-gray-50'}>
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
                    <td className="px-6 py-4 text-sm">{txn.category}</td>
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
                      {txn.status === 'categorized' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Categorized
                        </span>
                      ) : (
                        <button className="touch-target px-3 py-2 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QuickBooks Sync Tab */}
      {activeTab === 'sync' && (
        <div>
          {quickbooksConnected ? (
            <div>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
    </div>
  );
}

