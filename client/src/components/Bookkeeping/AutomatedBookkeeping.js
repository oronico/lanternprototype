import React, { useState, useEffect } from 'react';
import {
  BanknotesIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SparklesIcon,
  DocumentCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AutomatedBookkeeping = () => {
  const [connections, setConnections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categorizationStatus, setCategorizationStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    loadConnections();
    loadTransactions();
    loadCategorizationStatus();
    loadSyncStatus();
  }, []);

  const loadConnections = async () => {
    // Mock data - replace with API call
    const mockConnections = [
      {
        id: 1,
        type: 'bank',
        institution: 'Chase Business',
        accountName: 'Operating Account',
        accountNumber: '****4532',
        balance: 14200,
        status: 'connected',
        lastSync: new Date(),
        monthlyTransactions: 124
      },
      {
        id: 2,
        type: 'credit_card',
        institution: 'American Express',
        accountName: 'Business Card',
        accountNumber: '****1005',
        balance: -3420,
        status: 'connected',
        lastSync: new Date(Date.now() - 3600000),
        monthlyTransactions: 45
      },
      {
        id: 3,
        type: 'revenue',
        institution: 'Stripe',
        accountName: 'Tuition Payments',
        accountNumber: 'acct_xxx',
        balance: 28450,
        status: 'connected',
        lastSync: new Date(Date.now() - 1800000),
        monthlyTransactions: 89
      },
      {
        id: 4,
        type: 'payroll',
        institution: 'Gusto',
        accountName: 'Payroll System',
        accountNumber: 'company_xxx',
        balance: -12500,
        status: 'connected',
        lastSync: new Date(Date.now() - 7200000),
        monthlyTransactions: 12
      }
    ];
    
    setConnections(mockConnections);
  };

  const loadTransactions = async () => {
    // Mock recent transactions
    const mockTransactions = [
      {
        id: 1,
        date: new Date(),
        description: 'COSTCO WHOLESALE',
        amount: -234.56,
        source: 'American Express ****1005',
        category: 'Supplies & Materials',
        confidence: 0.98,
        status: 'auto-categorized',
        ledgerEntry: 'Created',
        syncedToQB: true
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000),
        description: 'Stripe Transfer - Tuition',
        amount: 1749.00,
        source: 'Stripe',
        category: 'Tuition Revenue',
        confidence: 0.99,
        status: 'auto-categorized',
        ledgerEntry: 'Created',
        syncedToQB: true
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000),
        description: 'LANDLORD LLC - Rent Payment',
        amount: -5600.00,
        source: 'Chase ****4532',
        category: 'Rent Expense',
        confidence: 0.97,
        status: 'auto-categorized',
        ledgerEntry: 'Created',
        syncedToQB: true
      },
      {
        id: 4,
        date: new Date(Date.now() - 259200000),
        description: 'AMAZON BUSINESS',
        amount: -87.43,
        source: 'American Express ****1005',
        category: 'Office Supplies',
        confidence: 0.89,
        status: 'auto-categorized',
        ledgerEntry: 'Created',
        syncedToQB: true
      },
      {
        id: 5,
        date: new Date(Date.now() - 345600000),
        description: 'UNKNOWN VENDOR LLC',
        amount: -450.00,
        source: 'Chase ****4532',
        category: null,
        confidence: 0.45,
        status: 'needs-review',
        ledgerEntry: 'Pending',
        syncedToQB: false
      }
    ];
    
    setTransactions(mockTransactions);
  };

  const loadCategorizationStatus = async () => {
    setCategorizationStatus({
      total: 270,
      autoCategorized: 258,
      needsReview: 12,
      accuracy: 95.6,
      lastProcessed: new Date()
    });
  };

  const loadSyncStatus = async () => {
    setSyncStatus({
      platform: 'QuickBooks Online',
      connected: true,
      lastSync: new Date(Date.now() - 1800000),
      pendingEntries: 0,
      failedEntries: 0,
      status: 'healthy'
    });
  };

  const getConnectionIcon = (type) => {
    switch(type) {
      case 'bank': return BanknotesIcon;
      case 'credit_card': return CreditCardIcon;
      case 'revenue': return ChartBarIcon;
      case 'payroll': return DocumentCheckIcon;
      default: return BanknotesIcon;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automated Bookkeeping</h1>
          <p className="text-gray-600 mt-1">
            AI-powered transaction categorization & ledger sync
          </p>
        </div>
        
        <button 
          onClick={() => toast.success('Syncing all connections...')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Sync All</span>
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <SparklesIcon className="h-8 w-8 text-green-600" />
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {categorizationStatus?.accuracy}%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {categorizationStatus?.autoCategorized}
          </div>
          <div className="text-sm text-gray-600">Auto-Categorized</div>
          <div className="text-xs text-gray-500 mt-1">
            of {categorizationStatus?.total} transactions
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {categorizationStatus?.needsReview}
          </div>
          <div className="text-sm text-gray-600">Need Review</div>
          <div className="text-xs text-gray-500 mt-1">
            Low confidence / unusual
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {connections.length}
          </div>
          <div className="text-sm text-gray-600">Connected Accounts</div>
          <div className="text-xs text-gray-500 mt-1">
            Bank, cards, revenue, payroll
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <DocumentCheckIcon className="h-8 w-8 text-purple-600" />
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              syncStatus?.status === 'healthy' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            }`}>
              {syncStatus?.status}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {syncStatus?.platform}
          </div>
          <div className="text-sm text-gray-600">Sync Status</div>
          <div className="text-xs text-gray-500 mt-1">
            Last: {syncStatus?.lastSync?.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Connected Accounts</h2>
        
        <div className="space-y-4">
          {connections.map((connection) => {
            const Icon = getConnectionIcon(connection.type);
            
            return (
              <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-gray-900">{connection.institution}</div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(connection.status)}`}>
                        {connection.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{connection.accountName} • {connection.accountNumber}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {connection.monthlyTransactions} transactions/month • Last sync: {connection.lastSync.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold ${connection.balance >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    ${Math.abs(connection.balance).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{connection.balance >= 0 ? 'Balance' : 'Owed'}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 font-medium transition-colors">
          + Connect Another Account
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
              All
            </button>
            <button className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-medium">
              Needs Review ({categorizationStatus?.needsReview})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">DATE</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">DESCRIPTION</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">SOURCE</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">CATEGORY</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">CONFIDENCE</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">STATUS</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {transaction.date.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500">
                    {transaction.source}
                  </td>
                  <td className="py-3 px-2">
                    {transaction.category ? (
                      <span className="text-sm text-gray-700">{transaction.category}</span>
                    ) : (
                      <span className="text-sm text-yellow-600 font-medium">Uncategorized</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${transaction.confidence >= 0.9 ? 'bg-green-500' : transaction.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${transaction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{(transaction.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {transaction.status === 'auto-categorized' ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Auto</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Review</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className={`text-sm font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    {transaction.syncedToQB && (
                      <div className="text-xs text-gray-500">✓ Synced to QB</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Transactions →
        </button>
      </div>

      {/* QuickBooks Sync Status */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ✓ Synced with {syncStatus?.platform}
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              All categorized transactions are automatically synced to your QuickBooks Online account. 
              Your books are always up-to-date and ready for your CPA or bank.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Last Sync</div>
                <div className="font-semibold text-gray-900">{syncStatus?.lastSync?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Pending Entries</div>
                <div className="font-semibold text-gray-900">{syncStatus?.pendingEntries}</div>
              </div>
              <div>
                <div className="text-gray-600">Failed Entries</div>
                <div className="font-semibold text-gray-900">{syncStatus?.failedEntries}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How Automated Bookkeeping Works</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <div className="font-semibold text-gray-900">Automatic Transaction Import</div>
              <div className="text-sm text-gray-600">
                Every night, we pull new transactions from all your connected accounts (banks, cards, Stripe, Gusto).
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <div className="font-semibold text-gray-900">AI Categorization</div>
              <div className="text-sm text-gray-600">
                Our AI (trained on 1M+ school transactions) automatically categorizes 95%+ of transactions into proper accounting categories.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <div className="font-semibold text-gray-900">Journal Entry Creation</div>
              <div className="text-sm text-gray-600">
                We create proper double-entry journal entries (debits/credits) following GAAP accounting standards.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <div className="font-semibold text-gray-900">QuickBooks/Xero Sync</div>
              <div className="text-sm text-gray-600">
                All entries are automatically pushed to your QuickBooks Online or Xero account, keeping your books current.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedBookkeeping;

