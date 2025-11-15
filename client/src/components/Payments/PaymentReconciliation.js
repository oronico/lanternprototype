import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  SparklesIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PaymentReconciliation = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('needs-review');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [allocationMode, setAllocationMode] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    // Mock data showing real-world scenarios
    const mockPayments = [
      {
        id: 'pay_001',
        source: 'stripe',
        externalTransactionId: 'pi_abc123',
        familyName: 'Johnson Family',
        familyId: 'fam_001',
        totalAmount: 1166.00,
        fees: 34.98,
        netAmount: 1131.02,
        paymentDate: new Date('2024-11-01'),
        receivedDate: new Date('2024-11-03'),
        batchId: 'batch_stripe_110324',
        attributionStatus: 'auto-matched',
        attributionConfidence: 0.99,
        attributionMethod: 'exact-match',
        students: [
          { name: 'Emma Johnson', enrollment: 'Full-Time 5-Day', tuition: 1166.00, allocated: 1131.02 }
        ],
        status: 'allocated',
        reconciledToBank: true,
        syncedToQuickBooks: true
      },
      {
        id: 'pay_002',
        source: 'classwallet',
        externalTransactionId: 'cw_xyz789',
        familyName: 'Martinez Family',
        familyId: 'fam_002',
        totalAmount: 1749.00,  // Payment for 2 kids
        fees: 0,
        netAmount: 1749.00,
        paymentDate: new Date('2024-11-05'),
        receivedDate: new Date('2024-11-08'),  // ClassWallet batches weekly
        batchId: 'batch_cw_110824',
        attributionStatus: 'auto-matched',
        attributionConfidence: 0.99,
        attributionMethod: 'exact-match',
        students: [
          { name: 'Sofia Martinez', enrollment: 'Full-Time 5-Day', tuition: 1166.00, allocated: 1166.00 },
          { name: 'Lucas Martinez', enrollment: '3-Day Program', tuition: 583.00, allocated: 583.00 }
        ],
        status: 'allocated',
        reconciledToBank: false,  // Batch not yet transferred
        syncedToQuickBooks: true
      },
      {
        id: 'pay_003',
        source: 'omella',
        externalTransactionId: 'om_def456',
        familyName: 'Chen Family',
        familyId: 'fam_003',
        totalAmount: 1750.00,  // Prepaid 3 months for 1 child
        fees: 17.50,
        netAmount: 1732.50,
        paymentDate: new Date('2024-11-10'),
        receivedDate: null,  // Not yet transferred
        batchId: 'batch_omella_pending',
        attributionStatus: 'auto-matched',
        attributionConfidence: 0.90,
        attributionMethod: 'amount-match',
        students: [
          { 
            name: 'Michael Chen', 
            enrollment: '3-Day Program', 
            tuition: 583.00,
            allocated: 1732.50,  // 3 months prepaid
            months: 3,
            note: 'Prepaid Nov-Jan'
          }
        ],
        status: 'allocated',
        reconciledToBank: false,
        syncedToQuickBooks: false
      },
      {
        id: 'pay_004',
        source: 'stripe',
        externalTransactionId: 'pi_ghi789',
        familyName: 'Williams Family',
        familyId: 'fam_004',
        totalAmount: 875.00,  // Partial payment?
        fees: 26.25,
        netAmount: 848.75,
        paymentDate: new Date('2024-11-12'),
        receivedDate: new Date('2024-11-14'),
        batchId: 'batch_stripe_111424',
        attributionStatus: 'needs-review',  // Unusual amount
        attributionConfidence: 0.45,
        attributionMethod: 'ai-suggested',
        students: [
          { 
            name: 'Olivia Williams', 
            enrollment: 'Full-Time 5-Day', 
            tuition: 1166.00,
            allocated: 848.75,  // Short payment?
            note: 'AI suggests partial payment or payment plan'
          }
        ],
        status: 'needs-review',
        reconciledToBank: true,
        syncedToQuickBooks: false
      },
      {
        id: 'pay_005',
        source: 'classwallet',
        externalTransactionId: 'cw_batch_111524',
        familyName: 'Multiple Families (Batch)',
        familyId: null,  // Batch transfer, not attributed yet
        totalAmount: 8745.00,  // Batch of 15 payments
        fees: 0,
        netAmount: 8745.00,
        paymentDate: new Date('2024-11-15'),
        receivedDate: new Date('2024-11-18'),
        batchId: 'batch_cw_111824',
        attributionStatus: 'needs-review',
        attributionConfidence: 0.00,
        students: [],
        status: 'needs-review',
        reconciledToBank: true,
        syncedToQuickBooks: false,
        note: 'Batch transfer - contains 15 family payments that need to be split'
      }
    ];
    
    setPayments(mockPayments);
  };

  const getStatusBadge = (status) => {
    const configs = {
      'auto-matched': { color: 'bg-green-100 text-green-700', label: '✓ Auto-Matched' },
      'manual-matched': { color: 'bg-blue-100 text-blue-700', label: '✓ Manual Match' },
      'needs-review': { color: 'bg-yellow-100 text-yellow-700', label: '⚠️ Needs Review' },
      'unmatched': { color: 'bg-red-100 text-red-700', label: '❌ Unmatched' },
      'split-payment': { color: 'bg-primary-100 text-primary-700', label: '🔀 Split Payment' }
    };
    return configs[status] || configs['needs-review'];
  };

  const getSourceBadge = (source) => {
    const configs = {
      stripe: { color: 'bg-blue-100 text-blue-700', label: 'Stripe' },
      omella: { color: 'bg-primary-100 text-primary-700', label: 'Omella' },
      classwallet: { color: 'bg-green-100 text-green-700', label: 'ClassWallet' },
      check: { color: 'bg-gray-100 text-gray-700', label: 'Check' },
      cash: { color: 'bg-amber-100 text-amber-700', label: 'Cash' }
    };
    return configs[source] || configs.check;
  };

  const approveAttribution = async (paymentId) => {
    toast.success('Payment attribution approved and synced to QuickBooks');
    // In production: API call to approve
    setPayments(prev => prev.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'allocated', syncedToQuickBooks: true }
        : p
    ));
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'needs-review') return p.attributionStatus === 'needs-review' || p.status === 'needs-review';
    if (filter === 'allocated') return p.status === 'allocated';
    if (filter === 'unreconciled') return !p.reconciledToBank;
    return true;
  });

  const needsReviewCount = payments.filter(p => p.attributionStatus === 'needs-review').length;
  const unreconciledCount = payments.filter(p => !p.reconciledToBank).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Reconciliation</h1>
          <p className="text-gray-600 mt-1">
            Map batch payments to individual students and sync to QuickBooks
          </p>
        </div>
        
        <button 
          onClick={() => toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
              loading: 'Syncing payments from Stripe, Omella, ClassWallet...',
              success: 'Payment sync complete!',
              error: 'Sync failed'
            }
          )}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Sync Payments</span>
        </button>
      </div>

      {/* Alert for Items Needing Review */}
      {needsReviewCount > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">
                {needsReviewCount} Payment{needsReviewCount > 1 ? 's' : ''} Need Manual Review
              </h3>
              <p className="text-sm text-yellow-800">
                These payments couldn't be automatically matched to students. Review and allocate manually.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setFilter('needs-review')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'needs-review' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Needs Review ({needsReviewCount})
        </button>
        <button
          onClick={() => setFilter('allocated')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'allocated' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Allocated
        </button>
        <button
          onClick={() => setFilter('unreconciled')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'unreconciled' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Not Reconciled ({unreconciledCount})
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Payment Date</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Family/Source</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Students</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Attribution</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => {
                const statusBadge = getStatusBadge(payment.attributionStatus);
                const sourceBadge = getSourceBadge(payment.source);
                
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.paymentDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Received: {payment.receivedDate?.toLocaleDateString() || 'Pending'}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">{payment.familyName}</div>
                      <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${sourceBadge.color}`}>
                        {sourceBadge.label}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-gray-900">
                        ${payment.netAmount.toLocaleString()}
                      </div>
                      {payment.fees > 0 && (
                        <div className="text-xs text-gray-500">
                          Fees: ${payment.fees.toFixed(2)}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-4">
                      {payment.students.length > 0 ? (
                        <div className="space-y-1">
                          {payment.students.map((student, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-gray-600">
                                ${student.allocated.toFixed(2)} {student.months > 1 ? `(${student.months} months)` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">Not allocated yet</div>
                      )}
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                        {payment.attributionConfidence > 0 && (
                          <div className="text-xs text-gray-500">
                            {(payment.attributionConfidence * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {payment.attributionMethod?.replace('-', ' ')}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-start space-y-1">
                        {payment.syncedToQuickBooks && (
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            QB Synced
                          </span>
                        )}
                        {payment.reconciledToBank && (
                          <span className="text-xs text-blue-600 flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Bank Reconciled
                          </span>
                        )}
                        {!payment.receivedDate && (
                          <span className="text-xs text-yellow-600 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Batch Pending
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      {payment.attributionStatus === 'needs-review' ? (
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="touch-target px-3 py-2 bg-yellow-600 text-white rounded-lg text-xs font-medium hover:bg-yellow-700"
                        >
                          Review & Allocate
                        </button>
                      ) : payment.status !== 'allocated' ? (
                        <button
                          onClick={() => approveAttribution(payment.id)}
                          className="touch-target px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                          Approve
                        </button>
                      ) : (
                        <button className="touch-target px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium cursor-default">
                          ✓ Complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Allocation Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Allocate Payment</h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Payment Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Family</div>
                  <div className="font-semibold text-gray-900">{selectedPayment.familyName}</div>
                </div>
                <div>
                  <div className="text-gray-600">Source</div>
                  <div className="font-semibold text-gray-900 capitalize">{selectedPayment.source}</div>
                </div>
                <div>
                  <div className="text-gray-600">Payment Date</div>
                  <div className="font-semibold text-gray-900">{selectedPayment.paymentDate.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Net Amount</div>
                  <div className="font-semibold text-green-600">${selectedPayment.netAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* AI Suggested Allocation */}
            {selectedPayment.students.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <SparklesIcon className="h-5 w-5 text-primary-600" />
                  <h3 className="font-bold text-gray-900">AI Suggested Allocation</h3>
                  <span className="text-xs text-gray-500">
                    ({(selectedPayment.attributionConfidence * 100).toFixed(0)}% confidence)
                  </span>
                </div>
                
                <div className="space-y-2">
                  {selectedPayment.students.map((student, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-primary-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-600">{student.enrollment}</div>
                          {student.note && (
                            <div className="text-xs text-blue-700 mt-1">{student.note}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${student.allocated.toFixed(2)}</div>
                          <div className="text-xs text-gray-600">
                            Tuition: ${student.tuition.toFixed(2)}/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Override */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Adjust Allocation (if needed)</h3>
              <div className="space-y-3">
                {selectedPayment.students.map((student, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="text-sm text-gray-700">{student.name}</label>
                    </div>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        defaultValue={student.allocated.toFixed(2)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        step="0.01"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  approveAttribution(selectedPayment.id);
                  setSelectedPayment(null);
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Approve & Sync to QuickBooks
              </button>
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-6 border-2 border-primary-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 How Payment Attribution Works</h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <strong>Daily Sync:</strong> We pull payments from Stripe, Omella, and ClassWallet every night
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <strong>Smart Matching:</strong> AI matches payments to families using:
              <ul className="ml-4 mt-1 text-xs space-y-1">
                <li>• External payer ID (Stripe customer ID, ClassWallet student ID)</li>
                <li>• Payment amount (exact match to expected tuition)</li>
                <li>• Email address or phone number</li>
                <li>• Payment patterns and history</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-accent-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <strong>Multi-Student Allocation:</strong> For families with multiple children, payment is split according to each child's tuition
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              4
            </div>
            <div>
              <strong>QuickBooks Sync:</strong> Once approved, payment is recorded in QB with proper revenue categorization
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReconciliation;
