import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  LinkIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PaymentTracking = () => {
  const [integrations, setIntegrations] = useState(null);
  const [payments, setPayments] = useState([]);
  const [, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      const [integrationsResponse, paymentsResponse, statisticsResponse] = await Promise.all([
        paymentsAPI.getIntegrations(),
        paymentsAPI.getPayments(),
        paymentsAPI.getStatistics()
      ]);
      
      setIntegrations(integrationsResponse.data);
      setPayments(paymentsResponse.data.payments);
      setStatistics(statisticsResponse.data);
    } catch (error) {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const syncIntegration = async (providerName) => {
    try {
      toast.loading(`Syncing ${providerName}...`, { id: 'sync' });
      await paymentsAPI.syncPayments(providerName);
      toast.success(`${providerName} synced successfully`, { id: 'sync' });
      loadPaymentData();
    } catch (error) {
      toast.error(`Failed to sync ${providerName}`, { id: 'sync' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      connected: 'text-green-700 bg-green-100 border-green-200',
      available: 'text-gray-700 bg-gray-100 border-gray-200',
      setup_needed: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      monitoring: 'text-blue-700 bg-blue-100 border-blue-200',
      error: 'text-red-700 bg-red-100 border-red-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      connected: CheckCircleIcon,
      available: ClockIcon,
      setup_needed: ExclamationTriangleIcon,
      monitoring: ChartBarIcon,
      error: ExclamationTriangleIcon
    };
    const Icon = icons[status] || ClockIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeIcon = (type) => {
    const icons = {
      payment_processor: CreditCardIcon,
      accounting: ChartBarIcon,
      banking: BanknotesIcon,
      payroll: BanknotesIcon,
      esa_platform: CreditCardIcon,
      p2p_payment: CreditCardIcon,
      bank_transfer: BanknotesIcon
    };
    const Icon = icons[type] || CreditCardIcon;
    return <Icon className="h-5 w-5 text-gray-600" />;
  };

  const filteredPayments = payments.filter(payment => {
    if (activeFilter === 'all') return true;
    return payment.status === activeFilter;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
            <CreditCardIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Tracking Dashboard</h1>
              <p className="text-gray-600">Unified view across all payment sources • Auto-reconciled from {integrations?.summary?.connectedIntegrations} systems</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {integrations?.summary?.connectionRate}% systems connected
            </div>
            <button
              onClick={() => loadPaymentData()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh All
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${integrations?.summary?.totalMonthlyVolume?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Monthly Volume</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {integrations?.summary?.totalTransactions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {integrations?.summary?.connectedIntegrations || 0}/{integrations?.summary?.totalIntegrations || 0}
              </div>
              <div className="text-sm text-gray-600">Connected Systems</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {integrations?.summary?.dataFreshness || 'Real-time'}
              </div>
              <div className="text-sm text-gray-600">Data Freshness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Overview
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reconciliation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tranche Reconciliation
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Integrations
          </button>
        </nav>
      </div>

      {/* Payment Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Payment Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                <div className="flex space-x-2">
                  {['all', 'paid', 'pending', 'late', 'failed'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activeFilter === filter
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Family
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.family}</div>
                          <div className="text-sm text-gray-500">{payment.familyDetails}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 bg-gray-100 rounded text-xs flex items-center justify-center font-bold text-gray-600">
                            {payment.source.icon}
                          </div>
                          <div className="ml-2 text-sm text-gray-900">{payment.source.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'late' ? 'bg-red-100 text-red-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.action && (
                          <button className="text-blue-600 hover:text-blue-900 font-medium">
                            {payment.action}
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

      {/* Tranche Reconciliation Tab */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          {/* Omella Tranche Example */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Omella Tranche Payment - $8,750</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Needs Mapping
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">$8,750</div>
                <div className="text-sm text-blue-700">Total Tranche</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">5</div>
                <div className="text-sm text-green-700">Families Included</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">Nov 15</div>
                <div className="text-sm text-yellow-700">Received Date</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Family Payment Breakdown:</h4>
              <div className="space-y-2">
                {[
                  { name: 'Johnson Family', amount: 1166, students: 2, status: 'current', esaFunded: true },
                  { name: 'Martinez Family', amount: 583, students: 1, status: 'current', esaFunded: false },
                  { name: 'Thompson Family', amount: 1458, students: 3, status: 'current', esaFunded: true },
                  { name: 'Wilson Family', amount: 1749, students: 1, status: 'current', esaFunded: false },
                  { name: 'Davis Family', amount: 800, students: 2, status: 'current', esaFunded: true }
                ].map((family, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">{family.name}</div>
                        <div className="text-sm text-gray-600">
                          {family.students} student{family.students > 1 ? 's' : ''} • 
                          {family.esaFunded ? ' ESA Funded' : ' Private Pay'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">${family.amount.toLocaleString()}</div>
                      <div className="text-xs text-green-600">Contract Current</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">🔗 Accounting Integration</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <div className="text-blue-600">Deposit Account:</div>
                  <div className="font-medium">Operating Checking</div>
                </div>
                <div>
                  <div className="text-blue-600">Revenue Account:</div>
                  <div className="font-medium">Tuition Revenue</div>
                </div>
                <div>
                  <div className="text-blue-600">ESA Class:</div>
                  <div className="font-medium">$4,124 (4 families)</div>
                </div>
                <div>
                  <div className="text-blue-600">Private Class:</div>
                  <div className="font-medium">$2,332 (2 families)</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Auto-Map to QuickBooks
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  Manual Review
                </button>
              </div>
            </div>
          </div>

          {/* Contract Status Alert */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Contract Status Alerts</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                <div className="font-medium text-red-900">Roberts Family - Contract at Risk</div>
                <div className="text-sm text-red-800">
                  45 days late on payment • 3 consecutive late payments • ESA processing delays
                </div>
                <div className="text-sm text-red-700 mt-1">
                  <strong>Action:</strong> Schedule family meeting to address ESA issues and payment plan options
                </div>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                <div className="font-medium text-yellow-900">Brown Family - Payment Pattern Concern</div>
                <div className="text-sm text-yellow-800">
                  40 days late • ESA funding delays • Risk of withdrawal
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  <strong>Action:</strong> Contact ESA program coordinator and family to resolve funding issues
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Integration Categories */}
          {Object.entries(integrations?.integrationsByType || {}).map(([type, typeIntegrations]) => {
            if (typeIntegrations.length === 0) return null;
            
            return (
              <div key={type} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {type.replace('_', ' ')} Systems
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeIntegrations.map((integration, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(integration.type)}
                            <div>
                              <h4 className="font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-sm text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                            {getStatusIcon(integration.status)}
                            <span className="ml-1 capitalize">{integration.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                        
                        {integration.monthlyVolume && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Monthly Volume:</span>
                              <span className="font-medium">${integration.monthlyVolume.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Transactions:</span>
                              <span className="font-medium">{integration.transactionCount}</span>
                            </div>
                          </div>
                        )}
                        
                        {integration.lastSync && (
                          <div className="text-xs text-gray-500 mb-3">
                            Last sync: {integration.lastSync}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          {integration.status === 'connected' && (
                            <button
                              onClick={() => syncIntegration(integration.name)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <ArrowPathIcon className="h-3 w-3 mr-1" />
                              Sync
                            </button>
                          )}
                          <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                            <Cog6ToothIcon className="h-3 w-3 mr-1" />
                            {integration.status === 'connected' ? 'Settings' : 'Connect'}
                          </button>
                        </div>
                        
                        {integration.features && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Features:</div>
                            <div className="flex flex-wrap gap-1">
                              {integration.features.slice(0, 3).map((feature, idx) => (
                                <span key={idx} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                  {feature}
                                </span>
                              ))}
                              {integration.features.length > 3 && (
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                  +{integration.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentTracking;
