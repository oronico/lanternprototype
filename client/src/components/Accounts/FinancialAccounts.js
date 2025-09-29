import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon,
  CreditCardIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LinkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const FinancialAccounts = () => {
  const [accounts, setAccounts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    // Mock data for Credit Karma-style financial overview
    const mockAccounts = {
      bankAccounts: [
        {
          id: 'bank_001',
          institutionName: 'Chase Business Banking',
          accountName: 'Operating Account',
          accountType: 'checking',
          accountNumber: '****1234',
          currentBalance: 3247.89,
          availableBalance: 3247.89,
          status: 'connected',
          healthMetrics: {
            daysUntilLowBalance: 7,
            monthlyInflow: 16324.00,
            monthlyOutflow: 19166.00,
            volatilityScore: 'high'
          },
          recentTransactions: [
            { date: '2024-11-15', description: 'Omella Deposit', amount: 8750.00, type: 'deposit' },
            { date: '2024-11-14', description: 'Payroll - Gusto', amount: -8500.00, type: 'withdrawal' },
            { date: '2024-11-13', description: 'Rent Payment', amount: -4500.00, type: 'withdrawal' }
          ]
        },
        {
          id: 'bank_002',
          institutionName: 'Chase Business Savings', 
          accountName: 'Emergency Reserve',
          accountType: 'savings',
          accountNumber: '****5678',
          currentBalance: 12500.00,
          availableBalance: 12500.00,
          status: 'connected',
          healthMetrics: {
            monthsOfExpenses: 0.65,
            targetBalance: 57500.00,
            recommendedContribution: 1500.00
          }
        }
      ],
      creditAccounts: [
        {
          id: 'credit_001',
          institutionName: 'Chase Business Credit Card',
          accountName: 'Business Rewards Card',
          accountType: 'credit_card',
          accountNumber: '****9876',
          currentBalance: -2400.00,
          creditLimit: 15000.00,
          availableCredit: 12600.00,
          status: 'connected',
          creditMetrics: {
            utilizationRate: 0.16,
            paymentDueDate: '2024-11-28',
            minimumPayment: 75.00,
            interestRate: 0.1899
          }
        },
        {
          id: 'credit_002',
          institutionName: 'Capital One Line of Credit',
          accountName: 'Business Line of Credit',
          accountType: 'line_of_credit',
          accountNumber: '****4321',
          currentBalance: -8500.00,
          creditLimit: 25000.00,
          availableCredit: 16500.00,
          status: 'connected',
          creditMetrics: {
            utilizationRate: 0.34,
            monthlyPayment: 425.00,
            paymentDueDate: '2024-11-30'
          }
        }
      ]
    };

    const mockSummary = {
      totalLiquidAssets: 15747.89,
      totalDebt: -26900.00,
      netWorth: -11152.11,
      monthlyDebtService: 925.00,
      creditUtilization: 0.22,
      financialHealthScore: 68,
      alerts: [
        { type: 'critical', message: 'Operating account will go negative in 7 days', priority: 1 },
        { type: 'warning', message: 'Emergency fund below target', priority: 2 }
      ]
    };

    setAccounts(mockAccounts);
    setSummary(mockSummary);
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    if (!showBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getAccountIcon = (accountType) => {
    const icons = {
      checking: BanknotesIcon,
      savings: BanknotesIcon,
      credit_card: CreditCardIcon,
      line_of_credit: CreditCardIcon,
      term_loan: BanknotesIcon
    };
    const Icon = icons[accountType] || BanknotesIcon;
    return <Icon className="h-6 w-6 text-gray-600" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      connected: 'text-green-700 bg-green-100',
      connecting: 'text-yellow-700 bg-yellow-100',
      error: 'text-red-700 bg-red-100',
      disconnected: 'text-gray-700 bg-gray-100'
    };
    return colors[status] || 'text-gray-700 bg-gray-100';
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Accounts</h1>
              <p className="text-gray-600">Your complete financial picture - bank accounts, credit cards, and loans</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {showBalances ? <EyeSlashIcon className="h-4 w-4 mr-2" /> : <EyeIcon className="h-4 w-4 mr-2" />}
              {showBalances ? 'Hide' : 'Show'} Balances
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Link Account
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Health Score</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-4xl font-bold ${getHealthColor(summary?.financialHealthScore)}`}>
                {summary?.financialHealthScore || 0}
              </div>
              <div className="text-sm text-gray-600">
                <div>/100</div>
                <div className="text-yellow-600 font-medium">Needs Improvement</div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2">Key Factors</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Net Worth:</span>
                <span className={`font-medium ${summary?.netWorth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary?.netWorth || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Credit Utilization:</span>
                <span className={`font-medium ${(summary?.creditUtilization || 0) < 0.3 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round((summary?.creditUtilization || 0) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Fund:</span>
                <span className="font-medium text-yellow-600">0.65 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary?.totalLiquidAssets || 0)}
              </div>
              <div className="text-sm text-gray-600">Total Cash</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary?.totalDebt || 0)}
              </div>
              <div className="text-sm text-gray-600">Total Debt</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className={`text-2xl font-bold ${(summary?.netWorth || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary?.netWorth || 0)}
              </div>
              <div className="text-sm text-gray-600">Net Worth</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <div className={`text-2xl font-bold ${(summary?.creditUtilization || 0) < 0.3 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round((summary?.creditUtilization || 0) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Credit Utilization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bank Accounts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BanknotesIcon className="h-5 w-5 mr-2" />
              Bank Accounts
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {accounts?.bankAccounts?.map((account, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getAccountIcon(account.accountType)}
                    <div>
                      <div className="font-medium text-gray-900">{account.accountName}</div>
                      <div className="text-sm text-gray-600">{account.institutionName}</div>
                      <div className="text-xs text-gray-500">{account.accountNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(account.currentBalance)}
                    </div>
                    <div className={`text-xs ${getStatusColor(account.status)}`}>
                      {account.status}
                    </div>
                  </div>
                </div>
                
                {account.healthMetrics && (
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>Monthly Inflow: {formatCurrency(account.healthMetrics.monthlyInflow)}</div>
                    <div>Monthly Outflow: {formatCurrency(account.healthMetrics.monthlyOutflow)}</div>
                    {account.healthMetrics.daysUntilLowBalance && (
                      <div className="col-span-2 text-red-600 font-medium">
                        ⚠️ Low balance in {account.healthMetrics.daysUntilLowBalance} days
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credit Accounts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Credit & Loans
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {accounts?.creditAccounts?.map((account, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getAccountIcon(account.accountType)}
                    <div>
                      <div className="font-medium text-gray-900">{account.accountName}</div>
                      <div className="text-sm text-gray-600">{account.institutionName}</div>
                      <div className="text-xs text-gray-500">{account.accountNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(account.currentBalance)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Limit: {formatCurrency(account.creditLimit)}
                    </div>
                  </div>
                </div>
                
                {account.creditMetrics && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Utilization:</span>
                      <span className={`font-medium ${account.creditMetrics.utilizationRate < 0.3 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.round(account.creditMetrics.utilizationRate * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="font-medium">
                        {formatCurrency(account.creditMetrics.minimumPayment || account.creditMetrics.monthlyPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">
                        {new Date(account.creditMetrics.paymentDueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
            Financial Alerts
          </h3>
          
          <div className="space-y-3">
            {summary?.alerts?.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className={`font-medium ${
                  alert.type === 'critical' ? 'text-red-900' :
                  alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                }`}>
                  {alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'} 
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
            AI Recommendations
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="font-medium text-green-900">Transfer $2,000 to Operating</div>
              <div className="text-sm text-green-800">
                Move funds from savings to prevent overdraft in 7 days
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-900">Set Up Emergency Fund Auto-Save</div>
              <div className="text-sm text-blue-800">
                Automatically transfer $500/month to reach 3-month target
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-purple-900">Consider Debt Consolidation</div>
              <div className="text-sm text-purple-800">
                SBA loan at 6.75% could reduce monthly payments by $200
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bank-Level Security</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="font-medium text-green-900">256-bit Encryption</div>
            <div className="text-green-700">Same security as your bank</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-900">Read-Only Access</div>
            <div className="text-blue-700">Cannot move or transfer funds</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="font-medium text-purple-900">Multi-Factor Auth</div>
            <div className="text-purple-700">Additional security layers</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Powered by Plaid • Used by millions • Trusted by major financial institutions
        </div>
      </div>
    </div>
  );
};

export default FinancialAccounts;
