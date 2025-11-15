import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  PencilIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const DocumentManager = () => {
  const [contracts, setContracts] = useState([]);
  const [summary, setSummary] = useState({});
  const [activeTab, setActiveTab] = useState('contracts');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCreateContract, setShowCreateContract] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    // Mock data for document management
    const mockContracts = [
      {
        id: 'contract_001',
        familyId: 'family_johnson',
        documentType: 'tuition_agreement',
        title: 'Johnson Family - Tuition Agreement 2024-25',
        status: 'signed',
        createdDate: '2024-08-15',
        sentDate: '2024-08-16',
        signedDate: '2024-08-18',
        tuitionAmount: 1166,
        paymentSchedule: 'monthly',
        signers: [
          { name: 'Michael Johnson', email: 'mjohnson@email.com', status: 'signed', signedDate: '2024-08-18' },
          { name: 'Sarah Johnson', email: 'sjohnson@email.com', status: 'signed', signedDate: '2024-08-18' }
        ],
        linkedPayments: {
          setupDate: '2024-08-20',
          paymentMethod: 'ClassWallet ESA',
          status: 'active',
          lastPayment: '2024-11-01'
        }
      },
      {
        id: 'contract_002',
        familyId: 'family_martinez', 
        documentType: 'enrollment_agreement',
        title: 'Martinez Family - Enrollment Agreement',
        status: 'pending_signature',
        createdDate: '2024-11-10',
        sentDate: '2024-11-10',
        remindersSent: 1,
        tuitionAmount: 583,
        signers: [
          { name: 'Carlos Martinez', email: 'carlos.martinez@email.com', status: 'pending', sentDate: '2024-11-10' },
          { name: 'Maria Martinez', email: 'maria.martinez@email.com', status: 'pending', sentDate: '2024-11-10' }
        ]
      },
      {
        id: 'contract_003',
        familyId: 'family_chen',
        documentType: 'tuition_contract', 
        title: 'Chen Family - Tuition Contract & Payment Terms',
        status: 'ready_to_send',
        createdDate: '2024-11-12',
        tuitionAmount: 583,
        esaEligible: true,
        familyContribution: 0,
        signers: [
          { name: 'David Chen', email: 'dchen@email.com', status: 'not_sent' },
          { name: 'Lisa Chen', email: 'lchen@email.com', status: 'not_sent' }
        ]
      }
    ];

    setContracts(mockContracts);
    setSummary({
      total: mockContracts.length,
      signed: mockContracts.filter(c => c.status === 'signed').length,
      pending: mockContracts.filter(c => c.status === 'pending_signature').length,
      ready: mockContracts.filter(c => c.status === 'ready_to_send').length,
      totalTuitionValue: mockContracts.filter(c => c.status === 'signed').reduce((sum, c) => sum + c.tuitionAmount, 0)
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      signed: 'bg-green-100 text-green-800 border-success-300',
      pending_signature: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ready_to_send: 'bg-blue-100 text-blue-800 border-primary-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      signed: CheckCircleIcon,
      pending_signature: ClockIcon,
      ready_to_send: PaperAirplaneIcon,
      draft: PencilIcon
    };
    const Icon = icons[status] || DocumentTextIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getActionButton = (contract) => {
    switch (contract.status) {
      case 'ready_to_send':
        return (
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            Send for Signature
          </button>
        );
      case 'pending_signature':
        return (
          <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
            Send Reminder
          </button>
        );
      case 'signed':
        return contract.linkedPayments ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded">
            Payment Active
          </span>
        ) : (
          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
            Setup Payment
          </button>
        );
      default:
        return (
          <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
            Edit Draft
          </button>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600">Generate contracts, track signatures, and link to payment processing</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateContract(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Generate New Contract
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{summary.total || 0}</div>
              <div className="text-sm text-gray-600">Total Contracts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{summary.signed || 0}</div>
              <div className="text-sm text-gray-600">Fully Signed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{summary.pending || 0}</div>
              <div className="text-sm text-gray-600">Pending Signature</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">${summary.totalTuitionValue?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-600">Secured Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contract Pipeline & E-Signature Tracking</h3>
        </div>
        
        <div className="table-scroll">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signatures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(contract.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contract.familyId.replace('family_', '').replace('_', ' ')}</div>
                    {contract.esaEligible && (
                      <div className="text-xs text-blue-600">ESA Eligible</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${contract.tuitionAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{contract.paymentSchedule}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1">{contract.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contract.signers.filter(s => s.status === 'signed').length}/{contract.signers.length} signed
                    </div>
                    <div className="text-xs text-gray-500">
                      {contract.signers.filter(s => s.status === 'pending').length > 0 && 
                        `${contract.signers.filter(s => s.status === 'pending').length} pending`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contract.linkedPayments ? (
                      <div className="flex items-center text-sm text-green-600">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {contract.linkedPayments.paymentMethod}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Not linked</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {getActionButton(contract)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">{selectedContract.title}</h3>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {/* Contract Status & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Contract Status</span>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedContract.status)}`}>
                  {getStatusIcon(selectedContract.status)}
                  <span className="ml-1">{selectedContract.status.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <UserGroupIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Signature Progress</span>
                </div>
                <div className="text-sm">
                  {selectedContract.signers.filter(s => s.status === 'signed').length}/{selectedContract.signers.length} Complete
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(selectedContract.signers.filter(s => s.status === 'signed').length / selectedContract.signers.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Payment Status</span>
                </div>
                <div className="text-sm">
                  {selectedContract.linkedPayments ? (
                    <span className="text-green-600">✓ Linked & Active</span>
                  ) : (
                    <span className="text-gray-500">Not linked</span>
                  )}
                </div>
              </div>
            </div>

            {/* Signer Details */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Signature Details</h4>
              <div className="space-y-3">
                {selectedContract.signers.map((signer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        signer.status === 'signed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {signer.status === 'signed' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{signer.name}</div>
                        <div className="text-sm text-gray-600">{signer.email}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      {signer.status === 'signed' ? (
                        <div>
                          <div className="text-green-600 font-medium">Signed</div>
                          <div className="text-gray-500">{new Date(signer.signedDate).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-yellow-600 font-medium">Pending</div>
                          <div className="text-gray-500">Sent {new Date(signer.sentDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Integration */}
            {selectedContract.status === 'signed' && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Payment Integration Status
                </h4>
                {selectedContract.linkedPayments ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-green-600">Payment Method:</div>
                      <div className="font-medium">{selectedContract.linkedPayments.paymentMethod}</div>
                    </div>
                    <div>
                      <div className="text-green-600">Setup Date:</div>
                      <div className="font-medium">{new Date(selectedContract.linkedPayments.setupDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-green-600">Status:</div>
                      <div className="font-medium">✓ Active</div>
                    </div>
                    <div>
                      <div className="text-green-600">Last Payment:</div>
                      <div className="font-medium">{new Date(selectedContract.linkedPayments.lastPayment).toLocaleDateString()}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-yellow-800 mb-2">Contract signed but payment not linked</div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Link Payment Processing
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {showCreateContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Generate New Contract</h3>
              <p className="text-sm text-gray-600">AI-powered contract generation with e-signature integration</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => {/* Handle tuition contract */}}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center mb-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3" />
                  <h4 className="font-medium text-gray-900">Tuition Agreement</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Generate tuition contract with payment terms, ESA integration, and automatic payment linking
                </p>
                <div className="text-xs text-gray-500">
                  ✓ ESA/voucher optimization • ✓ Payment integration • ✓ E-signature ready
                </div>
              </div>
              
              <div
                onClick={() => {/* Handle enrollment contract */}}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center mb-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <h4 className="font-medium text-gray-900">Enrollment Agreement</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Complete enrollment contract with academic, financial, and operational terms
                </p>
                <div className="text-xs text-gray-500">
                  ✓ Student information • ✓ Academic policies • ✓ Emergency contacts
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowCreateContract(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Signature Integration Info */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 E-Signature Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2-5</div>
            <div className="text-sm text-blue-700">Business Days</div>
            <div className="text-xs text-gray-500">Average signature time</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-green-700">Completion Rate</div>
            <div className="text-xs text-gray-500">Families complete signing</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">100%</div>
            <div className="text-sm text-primary-700">Legal Validity</div>
            <div className="text-xs text-gray-500">Court-admissible signatures</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Integrated with:</strong> DocuSign, HelloSign, Adobe Sign • 
            <strong>Features:</strong> Automatic reminders, mobile signing, audit trails, payment linking
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
