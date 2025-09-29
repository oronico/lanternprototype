import React, { useState, useEffect } from 'react';
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  LinkIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const PaymentReconciliation = () => {
  const [tranches, setTranches] = useState([]);
  const [contractStatuses, setContractStatuses] = useState([]);
  const [selectedTranche, setSelectedTranche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tranches');

  useEffect(() => {
    loadReconciliationData();
  }, []);

  const loadReconciliationData = async () => {
    // Mock data for tranche payments and contract tracking
    const mockTranches = [
      {
        id: 'tranche_001',
        provider: 'Omella',
        trancheDate: '2024-11-15',
        totalAmount: 8750.00,
        status: 'received',
        reconciliationStatus: 'partially_mapped',
        familyCount: 5,
        familyPayments: [
          { familyName: 'Johnson Family', amount: 1166.00, contractStatus: 'current', daysLate: 0, esaFunded: true },
          { familyName: 'Martinez Family', amount: 583.00, contractStatus: 'current', daysLate: 0, esaFunded: false },
          { familyName: 'Thompson Family', amount: 1458.00, contractStatus: 'current', daysLate: 0, esaFunded: true },
          { familyName: 'Wilson Family', amount: 1749.00, contractStatus: 'current', daysLate: 0, esaFunded: false },
          { familyName: 'Davis Family', amount: 800.00, contractStatus: 'current', daysLate: 0, esaFunded: true }
        ]
      },
      {
        id: 'tranche_002',
        provider: 'ClassWallet',
        trancheDate: '2024-10-31',
        totalAmount: 4665.00,
        status: 'received',
        reconciliationStatus: 'needs_attention',
        familyCount: 2,
        familyPayments: [
          { familyName: 'Roberts Family', amount: 1166.00, contractStatus: 'at_risk', daysLate: 45, esaFunded: true },
          { familyName: 'Brown Family', amount: 583.00, contractStatus: 'at_risk', daysLate: 40, esaFunded: true }
        ]
      }
    ];

    const mockContracts = [
      {
        contractId: 'contract_001',
        familyName: 'Johnson Family',
        studentCount: 2,
        monthlyTuition: 1166.00,
        contractStatus: 'current',
        nextPaymentDue: '2024-12-01',
        riskLevel: 'low',
        esaFunded: true,
        paymentHistory: [
          { date: '2024-11-01', amount: 1166.00, status: 'paid', daysLate: 0 },
          { date: '2024-10-01', amount: 1166.00, status: 'paid', daysLate: 3 }
        ]
      },
      {
        contractId: 'contract_007',
        familyName: 'Roberts Family',
        studentCount: 2,
        monthlyTuition: 1166.00,
        contractStatus: 'at_risk',
        nextPaymentDue: '2024-11-01',
        riskLevel: 'high',
        esaFunded: true,
        interventionNeeded: true,
        paymentHistory: [
          { date: '2024-10-01', amount: 1166.00, status: 'late', daysLate: 45 },
          { date: '2024-09-01', amount: 1166.00, status: 'late', daysLate: 25 }
        ]
      }
    ];

    setTranches(mockTranches);
    setContractStatuses(mockContracts);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      current: 'bg-green-100 text-green-800 border-green-200',
      at_risk: 'bg-red-100 text-red-800 border-red-200',
      late: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      needs_attention: 'bg-red-100 text-red-800 border-red-200',
      partially_mapped: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      fully_mapped: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      current: CheckCircleIcon,
      at_risk: ExclamationTriangleIcon,
      late: ClockIcon,
      needs_attention: ExclamationTriangleIcon,
      partially_mapped: ClockIcon,
      fully_mapped: CheckCircleIcon
    };
    const Icon = icons[status] || ClockIcon;
    return <Icon className="h-4 w-4" />;
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
        <div className="flex items-center space-x-3">
          <BanknotesIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
            <p className="text-gray-600">Map tranche payments to individual families and sync with accounting systems</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${tranches.reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Tranche Value</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {tranches.reduce((sum, t) => sum + t.familyCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Families in Tranches</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {contractStatuses.filter(c => c.contractStatus === 'at_risk').length}
              </div>
              <div className="text-sm text-gray-600">Contracts at Risk</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {contractStatuses.filter(c => c.contractStatus === 'current').length}
              </div>
              <div className="text-sm text-gray-600">Current Contracts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tranches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tranches'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tranche Payments
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contracts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contract Status
          </button>
        </nav>
      </div>

      {/* Tranche Payments Tab */}
      {activeTab === 'tranches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tranche Payment Reconciliation</h3>
              <p className="text-sm text-gray-600">Map bulk payments from Omella/ClassWallet to individual families</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Families</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tranches.map((tranche, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{tranche.provider}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tranche.trancheDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${tranche.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tranche.familyCount} families
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tranche.reconciliationStatus)}`}>
                          {getStatusIcon(tranche.reconciliationStatus)}
                          <span className="ml-1">{tranche.reconciliationStatus.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedTranche(tranche)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {tranche.reconciliationStatus === 'needs_attention' ? 'Review & Map' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tranche Detail Modal */}
          {selectedTranche && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTranche.provider} Tranche - ${selectedTranche.totalAmount.toLocaleString()}
                </h3>
                <button
                  onClick={() => setSelectedTranche(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tranche Date:</span>
                    <span className="font-medium">{new Date(selectedTranche.trancheDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">${selectedTranche.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family Count:</span>
                    <span className="font-medium">{selectedTranche.familyCount}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedTranche.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTranche.reconciliationStatus)}`}>
                      {selectedTranche.reconciliationStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Family Payment Breakdown */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Family Payment Breakdown</h4>
                <div className="space-y-2">
                  {selectedTranche.familyPayments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          payment.contractStatus === 'current' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {payment.contractStatus === 'current' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{payment.familyName}</div>
                          <div className="text-sm text-gray-600">
                            {payment.esaFunded ? 'ESA Funded' : 'Private Pay'} • 
                            {payment.daysLate > 0 ? ` ${payment.daysLate} days late` : ' Current'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">${payment.amount.toLocaleString()}</div>
                        <div className={`text-xs ${payment.contractStatus === 'current' ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.contractStatus.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accounting Integration */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Accounting System Integration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600">Deposit Account:</div>
                    <div className="font-medium">Operating Checking</div>
                  </div>
                  <div>
                    <div className="text-blue-600">Revenue Account:</div>
                    <div className="font-medium">Tuition Revenue</div>
                  </div>
                  <div>
                    <div className="text-blue-600">Journal Entry:</div>
                    <div className="font-medium">Auto-generated</div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Sync to QuickBooks
                  </button>
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                    Sync to Xero
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contract Status Tab */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contract Status & Payment Health</h3>
              <p className="text-sm text-gray-600">Monitor which families are current vs. late on their contracts</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Tuition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contractStatuses.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contract.familyName}</div>
                        <div className="text-sm text-gray-500">
                          {contract.esaFunded ? 'ESA Funded' : 'Private Pay'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.studentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${contract.monthlyTuition.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.contractStatus)}`}>
                          {getStatusIcon(contract.contractStatus)}
                          <span className="ml-1">{contract.contractStatus.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(contract.nextPaymentDue).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          contract.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          contract.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {contract.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.interventionNeeded ? (
                          <button className="text-red-600 hover:text-red-900 font-medium">
                            Intervention Needed
                          </button>
                        ) : (
                          <span className="text-green-600">✓ Current</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contract Health Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Health Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((contractStatuses.filter(c => c.contractStatus === 'current').length / contractStatuses.length) * 100)}%
                </div>
                <div className="text-sm text-green-700">Contracts Current</div>
                <div className="text-xs text-gray-500">Target: 95%+</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {contractStatuses.filter(c => c.interventionNeeded).length}
                </div>
                <div className="text-sm text-red-700">Need Intervention</div>
                <div className="text-xs text-gray-500">Immediate action required</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${contractStatuses.filter(c => c.riskLevel === 'high').reduce((sum, c) => sum + c.monthlyTuition, 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Revenue at Risk</div>
                <div className="text-xs text-gray-500">From high-risk contracts</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReconciliation;
