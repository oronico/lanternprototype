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
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Family
          </button>
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
              
              {/* Contract */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Contract Status
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="font-medium text-green-900">{selectedFamily.contract.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Monthly Tuition:</span>
                    <span className="font-medium text-green-900">${selectedFamily.contract.monthlyTuition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Contract ID:</span>
                    <span className="font-medium text-green-900">{selectedFamily.contract.contractId}</span>
                  </div>
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
    </div>
  );
};

export default FamilyCRM;
