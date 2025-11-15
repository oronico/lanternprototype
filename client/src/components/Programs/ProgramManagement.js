import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [showCreateProgram, setShowCreateProgram] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    // Mock data
    const mockPrograms = [
      {
        id: 1,
        name: '5-Day Full-Time Program',
        type: 'full-time',
        daysPerWeek: 5,
        totalCapacity: 16,
        currentEnrollment: 14,
        waitlistCount: 2,
        basePriceMonthly: 1200,
        hasSlidingScale: true,
        slidingScaleTiers: [
          { name: 'Tier 1: $0-50K', pricePerMonth: 800 },
          { name: 'Tier 2: $50-75K', pricePerMonth: 1000 },
          { name: 'Tier 3: $75-100K', pricePerMonth: 1200 },
          { name: 'Tier 4: $100K+', pricePerMonth: 1400 }
        ],
        discountRules: [
          { type: 'sibling', name: '2nd Child', discountValue: 15, discountType: 'percentage' },
          { type: 'staff', name: 'Staff Discount', discountValue: 50, discountType: 'percentage' }
        ],
        isActive: true
      },
      {
        id: 2,
        name: '3-Day Program',
        type: 'part-time',
        daysPerWeek: 3,
        totalCapacity: 12,
        currentEnrollment: 8,
        waitlistCount: 0,
        basePriceMonthly: 750,
        hasSlidingScale: true,
        slidingScaleTiers: [
          { name: 'Tier 1: $0-50K', pricePerMonth: 500 },
          { name: 'Tier 2: $50-75K', pricePerMonth: 650 },
          { name: 'Tier 3: $75-100K+', pricePerMonth: 750 }
        ],
        discountRules: [
          { type: 'sibling', name: '2nd Child', discountValue: 10, discountType: 'percentage' }
        ],
        isActive: true
      },
      {
        id: 3,
        name: 'After-School Program',
        type: 'after-school',
        totalCapacity: 20,
        currentEnrollment: 6,
        waitlistCount: 0,
        basePriceMonthly: 400,
        hasSlidingScale: false,
        discountRules: [
          { type: 'sibling', name: 'Sibling Discount', discountValue: 50, discountType: 'fixed-amount' }
        ],
        isActive: true
      },
      {
        id: 4,
        name: 'Online Learning Hub',
        type: 'online',
        totalCapacity: 25,
        currentEnrollment: 12,
        waitlistCount: 1,
        basePriceMonthly: 600,
        hasSlidingScale: false,
        discountRules: [],
        isActive: true
      }
    ];
    
    setPrograms(mockPrograms);
  };

  const getUtilizationColor = (program) => {
    const rate = (program.currentEnrollment / program.totalCapacity) * 100;
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 75) return 'text-blue-600 bg-blue-100';
    if (rate >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getUtilizationRate = (program) => {
    return ((program.currentEnrollment / program.totalCapacity) * 100).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-600 mt-1">Manage programs, pricing, and capacity</p>
        </div>
        
        <button
          onClick={() => setShowCreateProgram(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => {
          const utilizationRate = getUtilizationRate(program);
          const availableSpots = program.totalCapacity - program.currentEnrollment;
          
          return (
            <div key={program.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="h-6 w-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{program.type.replace(/-/g, ' ')}</p>
                </div>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <PencilIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Enrollment Status */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">{program.currentEnrollment}</div>
                  <div className="text-xs text-gray-600">Enrolled</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">{availableSpots}</div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">{program.waitlistCount}</div>
                  <div className="text-xs text-gray-600">Waitlist</div>
                </div>
              </div>

              {/* Utilization Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Utilization Rate</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getUtilizationColor(program)}`}>
                    {utilizationRate}%
                  </span>
                </div>
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      parseFloat(utilizationRate) >= 90 ? 'bg-green-500' :
                      parseFloat(utilizationRate) >= 75 ? 'bg-blue-500' :
                      parseFloat(utilizationRate) >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${utilizationRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {program.currentEnrollment} / {program.totalCapacity} capacity
                </div>
              </div>

              {/* Pricing Info */}
              <div className="mb-4 p-4 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Pricing Structure</span>
                </div>
                
                {program.hasSlidingScale ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">Sliding Scale Tiers:</div>
                    {program.slidingScaleTiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{tier.name}</span>
                        <span className="font-medium text-gray-900">${tier.pricePerMonth}/mo</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">
                    ${program.basePriceMonthly}/month
                  </div>
                )}
              </div>

              {/* Discounts */}
              {program.discountRules.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Active Discounts:</div>
                  <div className="space-y-1">
                    {program.discountRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-green-50 px-3 py-2 rounded">
                        <span className="text-gray-700">{rule.name}</span>
                        <span className="font-semibold text-green-700">
                          {rule.discountType === 'percentage' ? `${rule.discountValue}% off` : `-$${rule.discountValue}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Info */}
              {program.daysPerWeek && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{program.daysPerWeek} days per week</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium">
                  View Enrollments
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  Edit Program
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-6 border-2 border-primary-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Program Portfolio Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Programs</div>
            <div className="text-3xl font-bold text-gray-900">{programs.length}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Capacity</div>
            <div className="text-3xl font-bold text-gray-900">
              {programs.reduce((sum, p) => sum + p.totalCapacity, 0)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Enrolled</div>
            <div className="text-3xl font-bold text-gray-900">
              {programs.reduce((sum, p) => sum + p.currentEnrollment, 0)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Overall Utilization</div>
            <div className="text-3xl font-bold text-gray-900">
              {(
                (programs.reduce((sum, p) => sum + p.currentEnrollment, 0) /
                programs.reduce((sum, p) => sum + p.totalCapacity, 0)) * 100
              ).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Program Management Tips</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>Sliding Scale Pricing:</strong> Offer income-based tuition to increase accessibility and enrollment.
          </div>
          <div>
            <strong>Sibling Discounts:</strong> Encourage families to enroll multiple children (typically 10-20% off 2nd child).
          </div>
          <div>
            <strong>Staff Discounts:</strong> Offer 25-50% off for staff families as an employee benefit.
          </div>
          <div>
            <strong>Capacity Planning:</strong> Aim for 85-95% utilization - full enough to be profitable, with room for growth.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramManagement;

