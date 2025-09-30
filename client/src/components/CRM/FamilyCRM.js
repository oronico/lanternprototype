import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const FamilyCRM = () => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newFamily, setNewFamily] = useState({
    familyName: '',
    primaryContact: { name: '', email: '', phone: '' },
    students: [{ firstName: '', lastName: '', grade: '', dateOfBirth: '', esaEligible: false, programEnrollment: '' }],
    inquirySource: ''
  });

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = () => {
    // Mock CRM data - each family connected to students, contracts, payments
    const mockFamilies = [
      {
        id: 'family_001',
        familyName: 'Johnson',
        primaryContact: { name: 'Michael Johnson', email: 'mjohnson@email.com', phone: '555-0101' },
        students: [
          { firstName: 'Emma', grade: '3rd', esaEligible: true },
          { firstName: 'Liam', grade: '1st', esaEligible: true }
        ],
        contract: { status: 'signed', monthlyTuition: 1166, contractId: 'contract_001' },
        payments: { status: 'current', averageDaysLate: 1, autoPayEnabled: true },
        familyHealth: { overallStatus: 'excellent', satisfactionScore: 9.5, retentionRisk: 'low' }
      },
      {
        id: 'family_007',
        familyName: 'Roberts',
        primaryContact: { name: 'David Roberts', email: 'droberts@email.com', phone: '555-0701' },
        students: [
          { firstName: 'Chloe', grade: '4th', esaEligible: true, concerns: ['academic_performance'] },
          { firstName: 'Dylan', grade: '2nd', esaEligible: true }
        ],
        contract: { status: 'signed', monthlyTuition: 1166, contractId: 'contract_007' },
        payments: { status: 'at_risk', averageDaysLate: 28, totalOutstanding: 1166, autoPayEnabled: false },
        familyHealth: { overallStatus: 'at_risk', satisfactionScore: 6.0, retentionRisk: 'high' }
      }
    ];

    setFamilies(mockFamilies);
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'border-green-500 bg-green-50',
      good: 'border-blue-500 bg-blue-50',
      at_risk: 'border-red-500 bg-red-50',
      new: 'border-purple-500 bg-purple-50'
    };
    return colors[status] || 'border-gray-500 bg-gray-50';
  };

  const getRiskBadge = (risk) => {
    const badges = {
      low: { color: 'bg-green-100 text-green-800', text: 'Low Risk' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Risk' },
      high: { color: 'bg-red-100 text-red-800', text: 'High Risk' }
    };
    return badges[risk] || badges.low;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family & Student CRM</h1>
              <p className="text-gray-600">Complete view: Students → Contracts → Payments for each family</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddFamily(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Family
          </button>
        </div>
      </div>

      {/* Connection Flow Diagram */}
      <div className="mb-8 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">How It Works: Students → Contract → Payments</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex-1 text-center">
            <div className="bg-blue-100 rounded-lg p-3 mb-2">
              <AcademicCapIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="font-medium text-blue-900">1. Add Students</div>
              <div className="text-xs text-blue-700">Emma & Liam Johnson</div>
            </div>
          </div>
          
          <div className="px-2 text-blue-600">→</div>
          
          <div className="flex-1 text-center">
            <div className="bg-green-100 rounded-lg p-3 mb-2">
              <DocumentTextIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="font-medium text-green-900">2. Generate Contract</div>
              <div className="text-xs text-green-700">Auto-fills student names</div>
            </div>
          </div>
          
          <div className="px-2 text-blue-600">→</div>
          
          <div className="flex-1 text-center">
            <div className="bg-purple-100 rounded-lg p-3 mb-2">
              <LinkIcon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="font-medium text-purple-900">3. Link Payment</div>
              <div className="text-xs text-purple-700">ClassWallet for Emma & Liam</div>
            </div>
          </div>
          
          <div className="px-2 text-blue-600">→</div>
          
          <div className="flex-1 text-center">
            <div className="bg-yellow-100 rounded-lg p-3 mb-2">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="font-medium text-yellow-900">4. Auto-Match</div>
              <div className="text-xs text-yellow-700">$1,166 → Emma & Liam</div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-blue-700 mt-3">
          Every payment automatically knows which students it's for!
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{families.length}</div>
              <div className="text-sm text-gray-600">Total Families</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {families.reduce((sum, f) => sum + f.students.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {families.filter(f => f.familyHealth.overallStatus === 'excellent').length}
              </div>
              <div className="text-sm text-gray-600">Excellent Health</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {families.filter(f => f.familyHealth.overallStatus === 'at_risk').length}
              </div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Family List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Family Records</h3>
          <p className="text-sm text-gray-600">Click any family to see complete record: students, contract, payments, communications</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {families.map((family) => {
            const riskBadge = getRiskBadge(family.familyHealth.retentionRisk);
            
            return (
              <div
                key={family.id}
                onClick={() => setSelectedFamily(family)}
                className={`p-6 hover:bg-gray-50 cursor-pointer border-l-4 ${getStatusColor(family.familyHealth.overallStatus)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{family.familyName} Family</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${riskBadge.color}`}>
                        {riskBadge.text}
                      </span>
                      {family.payments.autoPayEnabled && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Auto-Pay ✓
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      {/* Students */}
                      <div>
                        <div className="text-gray-500 mb-1">Students</div>
                        {family.students.map((student, idx) => (
                          <div key={idx} className="font-medium text-gray-900">
                            {student.firstName} ({student.grade})
                            {student.esaEligible && <span className="text-blue-600 text-xs ml-1">ESA</span>}
                          </div>
                        ))}
                      </div>
                      
                      {/* Contract */}
                      <div>
                        <div className="text-gray-500 mb-1">Contract</div>
                        <div className="font-medium text-gray-900">{family.contract.status}</div>
                        <div className="text-gray-600">${family.contract.monthlyTuition}/month</div>
                      </div>
                      
                      {/* Payment Status */}
                      <div>
                        <div className="text-gray-500 mb-1">Payment Status</div>
                        <div className={`font-medium ${
                          family.payments.status === 'current' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {family.payments.status}
                        </div>
                        <div className="text-gray-600">Avg late: {family.payments.averageDaysLate} days</div>
                      </div>
                      
                      {/* Satisfaction */}
                      <div>
                        <div className="text-gray-500 mb-1">Satisfaction</div>
                        <div className="font-medium text-gray-900">
                          {family.familyHealth.satisfactionScore}/10
                        </div>
                        <div className={`text-xs ${
                          family.familyHealth.satisfactionScore >= 8 ? 'text-green-600' : 
                          family.familyHealth.satisfactionScore >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {family.familyHealth.satisfactionScore >= 8 ? 'Very satisfied' : 
                           family.familyHealth.satisfactionScore >= 6 ? 'Satisfied' : 'Concerns'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View Full Record →
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions for At-Risk */}
                {family.familyHealth.overallStatus === 'at_risk' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center text-sm text-red-800">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <strong>Action Needed:</strong> 
                      <span className="ml-2">
                        {family.payments.status === 'at_risk' && 'Payment intervention required • '}
                        {family.students.some(s => s.concerns?.length) && 'Academic support needed • '}
                        Schedule family meeting this week
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Family Detail Modal */}
      {selectedFamily && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{selectedFamily.familyName} Family - Complete Record</h3>
              <button
                onClick={() => setSelectedFamily(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Connected Data View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Students ({selectedFamily.students.length})
                </h4>
                {selectedFamily.students.map((student, idx) => (
                  <div key={idx} className="mb-2 text-sm">
                    <div className="font-medium text-blue-900">
                      {student.firstName} {student.grade}
                      {student.esaEligible && <span className="ml-2 text-xs bg-blue-200 px-1 rounded">ESA</span>}
                    </div>
                    {student.concerns && (
                      <div className="text-red-700 text-xs">⚠️ {student.concerns.join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Contract - Shows Connection */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Contract (Links Students to Payments)
                </h4>
                <div className="text-sm space-y-2">
                  <div className="bg-green-100 p-2 rounded">
                    <div className="font-medium text-green-900 mb-1">Contract connects:</div>
                    <div className="text-green-800 text-xs space-y-1">
                      <div>• Students: {selectedFamily.students.map(s => s.firstName).join(', ')}</div>
                      <div>• Payment: ${selectedFamily.contract.monthlyTuition}/month</div>
                      <div>• ID: {selectedFamily.contract.contractId}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="font-medium text-green-900">{selectedFamily.contract.status}</span>
                  </div>
                  
                  {selectedFamily.contract.status !== 'signed' && (
                    <button className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                      Generate Contract for {selectedFamily.students.length} Student{selectedFamily.students.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Payment History */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Payment Performance
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Status:</span>
                    <span className={`font-medium ${
                      selectedFamily.payments.status === 'current' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedFamily.payments.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Avg Days Late:</span>
                    <span className="font-medium text-yellow-900">{selectedFamily.payments.averageDaysLate} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Auto-Pay:</span>
                    <span className="font-medium text-yellow-900">
                      {selectedFamily.payments.autoPayEnabled ? '✓ Enabled' : '✗ Not Set Up'}
                    </span>
                  </div>
                  {selectedFamily.payments.totalOutstanding > 0 && (
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span>Outstanding:</span>
                      <span>${selectedFamily.payments.totalOutstanding}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Family Health */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Family Health Score
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Satisfaction:</span>
                    <span className="font-medium text-purple-900">{selectedFamily.familyHealth.satisfactionScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Retention Risk:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskBadge(selectedFamily.familyHealth.retentionRisk).color}`}>
                      {getRiskBadge(selectedFamily.familyHealth.retentionRisk).text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Actions */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
              <div className="space-y-2 text-sm">
                {selectedFamily.familyHealth.overallStatus === 'at_risk' ? (
                  <>
                    <div className="flex items-center text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      Schedule immediate family meeting
                    </div>
                    {!selectedFamily.payments.autoPayEnabled && (
                      <div className="flex items-center text-yellow-700">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        Set up auto-pay to prevent future delays
                      </div>
                    )}
                    {selectedFamily.students.some(s => s.concerns) && (
                      <div className="flex items-center text-orange-700">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        Implement academic intervention plan
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center text-green-700">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Family in excellent standing - maintain regular check-ins
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Family Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Family & Students</h3>
              <button onClick={() => setShowAddFamily(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              {/* Family Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Family Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Last Name</label>
                    <input
                      type="text"
                      value={newFamily.familyName}
                      onChange={(e) => setNewFamily({...newFamily, familyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Johnson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name</label>
                    <input
                      type="text"
                      value={newFamily.primaryContact.name}
                      onChange={(e) => setNewFamily({...newFamily, primaryContact: {...newFamily.primaryContact, name: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Michael Johnson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newFamily.primaryContact.email}
                      onChange={(e) => setNewFamily({...newFamily, primaryContact: {...newFamily.primaryContact, email: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="mjohnson@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newFamily.primaryContact.phone}
                      onChange={(e) => setNewFamily({...newFamily, primaryContact: {...newFamily.primaryContact, phone: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="555-0101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Source</label>
                    <select
                      value={newFamily.inquirySource}
                      onChange={(e) => setNewFamily({...newFamily, inquirySource: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select source...</option>
                      <option value="word_of_mouth">Word of Mouth</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google Search</option>
                      <option value="referral">Referral</option>
                      <option value="event">School Event</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Students</h4>
                  <button
                    onClick={() => setNewFamily({
                      ...newFamily,
                      students: [...newFamily.students, { firstName: '', lastName: '', grade: '', dateOfBirth: '', esaEligible: false, programEnrollment: '' }]
                    })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Another Student
                  </button>
                </div>
                
                {newFamily.students.map((student, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">Student {index + 1}</span>
                      {index > 0 && (
                        <button
                          onClick={() => setNewFamily({
                            ...newFamily,
                            students: newFamily.students.filter((_, i) => i !== index)
                          })}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={student.firstName}
                          onChange={(e) => {
                            const updated = [...newFamily.students];
                            updated[index].firstName = e.target.value;
                            setNewFamily({...newFamily, students: updated});
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Emma"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={student.lastName}
                          onChange={(e) => {
                            const updated = [...newFamily.students];
                            updated[index].lastName = e.target.value;
                            setNewFamily({...newFamily, students: updated});
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Johnson"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
                        <select
                          value={student.grade}
                          onChange={(e) => {
                            const updated = [...newFamily.students];
                            updated[index].grade = e.target.value;
                            setNewFamily({...newFamily, students: updated});
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Select grade...</option>
                          <option value="PreK">PreK</option>
                          <option value="K">Kindergarten</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={`${i+1}th`}>{i+1}th Grade</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Program Enrollment</label>
                        <select
                          value={student.programEnrollment}
                          onChange={(e) => {
                            const updated = [...newFamily.students];
                            updated[index].programEnrollment = e.target.value;
                            setNewFamily({...newFamily, students: updated});
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Select program...</option>
                          <option value="full_time">Full-Time (5 days/week)</option>
                          <option value="part_time_3">Part-Time (3 days/week)</option>
                          <option value="part_time_2">Part-Time (2 days/week)</option>
                          <option value="virtual">Virtual/Online</option>
                          <option value="summer_camp">Summer Camp Only</option>
                          <option value="afterschool">Afterschool Program</option>
                          <option value="tutoring">Tutoring Sessions</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={student.dateOfBirth}
                          onChange={(e) => {
                            const updated = [...newFamily.students];
                            updated[index].dateOfBirth = e.target.value;
                            setNewFamily({...newFamily, students: updated});
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={student.esaEligible}
                            onChange={(e) => {
                              const updated = [...newFamily.students];
                              updated[index].esaEligible = e.target.checked;
                              setNewFamily({...newFamily, students: updated});
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">ESA/Voucher Eligible</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    // Add family logic here
                    console.log('Adding family:', newFamily);
                    setShowAddFamily(false);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Family & Generate Contract
                </button>
                <button
                  onClick={() => setShowAddFamily(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                After adding family, you can generate their enrollment contract with student names pre-filled
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyCRM;
