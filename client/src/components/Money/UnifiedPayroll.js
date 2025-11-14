import React, { useState, useEffect } from 'react';
import {
  BanknotesIcon,
  UsersIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  LinkIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { getAvailableProviders, getPayrollProvider } from '../../services/payrollProviders';
import { STAFF, FINANCIAL } from '../../data/centralizedMetrics';
import toast from 'react-hot-toast';

/**
 * Unified Payroll Hub
 * 
 * Provider-agnostic payroll management:
 * - Supports Gusto, ADP, Paychex, QuickBooks Payroll
 * - Clean provider abstraction
 * - Easy to add new providers
 * - Professional UX
 */

export default function UnifiedPayroll() {
  const [selectedProvider, setSelectedProvider] = useState('gusto'); // Current provider
  const [isConnected, setIsConnected] = useState(true); // Demo: Gusto connected
  const [activeTab, setActiveTab] = useState('overview'); // overview, providers, history

  const availableProviders = getAvailableProviders();
  const currentProvider = availableProviders.find(p => p.id === selectedProvider);

  useEffect(() => {
    analytics.trackPageView('unified-payroll');
  }, []);

  const handleConnect = async (providerId) => {
    const provider = getPayrollProvider(providerId);
    
    analytics.trackFeatureUsage('payroll', 'connect_provider', {
      provider: providerId
    });
    
    toast.loading(`Connecting to ${provider.getProviderName()}...`);
    
    const result = await provider.connect();
    
    if (result.success) {
      toast.success(`Connected to ${provider.getProviderName()}!`);
      setSelectedProvider(providerId);
      setIsConnected(true);
      // In production: window.location.href = result.redirectUrl;
    }
  };

  const handleRunPayroll = async () => {
    const provider = getPayrollProvider(selectedProvider);
    
    analytics.trackFeatureUsage('payroll', 'run_payroll', {
      provider: selectedProvider
    });
    
    const result = await provider.runPayroll();
    
    if (result.success) {
      toast.success(result.message);
      // In production: window.location.href = result.redirectUrl;
    }
  };

  const handleSwitchProvider = (newProvider) => {
    if (isConnected) {
      toast('To switch providers, please disconnect from current provider first.');
      return;
    }
    setSelectedProvider(newProvider);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payroll & Staff Costs</h1>
              <p className="text-gray-600">Manage payroll across all providers</p>
            </div>
          </div>
          
          {isConnected && (
            <button
              onClick={handleRunPayroll}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2"
            >
              <BanknotesIcon className="h-5 w-5" />
              Run Payroll
            </button>
          )}
        </div>
      </div>

      {/* Current Provider Status */}
      {isConnected && (
        <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentProvider.logo}</div>
              <div>
                <div className="font-semibold text-green-900 text-lg">
                  Connected to {currentProvider.name}
                </div>
                <div className="text-sm text-green-700">
                  Payroll synced automatically • Last sync: 2 hours ago
                </div>
              </div>
            </div>
            <button className="text-sm text-green-700 hover:text-green-900 font-medium">
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Payroll Summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Monthly Payroll</div>
          <div className="text-3xl font-bold text-gray-900">
            ${STAFF.monthlyPayroll.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">W-2 employees</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Contractors</div>
          <div className="text-3xl font-bold text-purple-600">
            ${STAFF.monthlyContractors.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">1099 payments</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Labor</div>
          <div className="text-3xl font-bold text-blue-600">
            ${STAFF.totalLaborCost.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(STAFF.staffingRatio * 100)}% of revenue</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">YTD Taxes</div>
          <div className="text-3xl font-bold text-orange-600">
            ${STAFF.ytdTaxes.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Withheld & filed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'providers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payroll Providers
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payroll History
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Next Payroll */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Payroll Run</h3>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Friday, September 30, 2024</div>
                  <div className="text-sm text-blue-700">Biweekly payroll for 2 employees</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">$5,833</div>
                <div className="text-sm text-blue-700">Gross pay</div>
              </div>
            </div>
          </div>

          {/* Staff Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">W-2 Employees</div>
                <div className="text-2xl font-bold text-gray-900">{STAFF.w2Employees}</div>
                <div className="text-xs text-gray-500">Full/part-time</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">1099 Contractors</div>
                <div className="text-2xl font-bold text-gray-900">{STAFF.contractors1099}</div>
                <div className="text-xs text-gray-500">Independent contractors</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">Choose Your Payroll Provider</div>
            <div className="text-sm text-blue-700">
              SchoolStack integrates with all major payroll systems. Pick the one that works best for you.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableProviders.map(provider => {
              const isCurrent = provider.id === selectedProvider && isConnected;
              
              return (
                <div
                  key={provider.id}
                  className={`bg-white rounded-lg shadow p-6 border-2 transition-all ${
                    isCurrent 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{provider.logo}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                      </div>
                    </div>
                    {provider.recommended && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mb-4 space-y-1 text-sm text-gray-600">
                    {provider.features.map((feature, idx) => (
                      <div key={idx}>✓ {feature}</div>
                    ))}
                  </div>

                  <div className="mb-4 text-sm">
                    <span className="text-gray-600">Market Share:</span>
                    <span className="font-medium text-gray-900 ml-2">{provider.marketShare}</span>
                  </div>

                  <div className="mb-4 text-sm">
                    <span className="text-gray-600">Pricing:</span>
                    <span className="font-medium text-gray-900 ml-2">{provider.pricing}</span>
                  </div>

                  {isCurrent ? (
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircleIcon className="h-5 w-5" />
                      Connected
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(provider.id)}
                      className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Connect {provider.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="table-scroll">
              <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross Pay</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Taxes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Employees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Sep 15, 2024</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">$5,833</td>
                  <td className="px-6 py-4 text-sm text-right text-red-600">$1,200</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-green-600">$4,633</td>
                  <td className="px-6 py-4 text-sm text-right">2</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Sep 1, 2024</td>
                  <td className="px-6 py-4 text-sm text-right font-medium">$5,833</td>
                  <td className="px-6 py-4 text-sm text-right text-red-600">$1,200</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-green-600">$4,633</td>
                  <td className="px-6 py-4 text-sm text-right">2</td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Info */}
      <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-3">Why Payroll Integration Matters</h3>
        <div className="text-sm text-purple-800 space-y-2">
          <div>✓ <strong>Automatic tax filing:</strong> No manual quarterly 941 forms</div>
          <div>✓ <strong>W-2 generation:</strong> Year-end forms created automatically</div>
          <div>✓ <strong>Compliance:</strong> Always up-to-date with tax law changes</div>
          <div>✓ <strong>Time savings:</strong> Run payroll in 5 minutes, not hours</div>
          <div>✓ <strong>Employee self-service:</strong> Staff can access pay stubs online</div>
        </div>
      </div>
    </div>
  );
}

