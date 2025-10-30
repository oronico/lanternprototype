import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  DocumentArrowUpIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

/**
 * Comprehensive Facility Management System
 * 
 * Tracks all facility-related costs:
 * - Lease/Rent
 * - Utilities (electric, water, internet, gas)
 * - Insurance
 * - Maintenance & Repairs
 * - Vendors & Contracts
 * - Key dates & renewals
 */
export default function FacilityManagement() {
  const emit = useEventEmit();
  const [activeTab, setActiveTab] = useState('overview');
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Track page view
  useEffect(() => {
    analytics.trackPageView('facility-management');
  }, []);

  // Load demo data
  useEffect(() => {
    loadFacilityData();
  }, []);

  const loadFacilityData = () => {
    // Demo facility data
    const demoFacility = {
      id: 1,
      name: 'Main School Building',
      address: '123 Education Way, Sunshine, FL 33xxx',
      squareFootage: 1600,
      
      // Lease Information
      lease: {
        monthlyRent: 3500,
        camCharges: 300,
        propertyTaxes: 400,
        buildingInsurance: 300,
        totalMonthly: 4500,
        leaseStart: '2024-01-01',
        leaseEnd: '2026-12-31',
        escalationRate: 5,
        securityDeposit: 9000,
        personalGuarantee: true,
        pricePerSqFt: 28.13,
        hasDocument: true,
        documentUploadDate: '2024-01-15'
      },
      
      // Utilities
      utilities: [
        { id: 1, type: 'Electric', provider: 'Sunshine Power Co', accountNumber: '****1234', monthlyAverage: 450, dueDate: 15, autopay: true, lastBill: 467, trend: 'up' },
        { id: 2, type: 'Water/Sewer', provider: 'City Water', accountNumber: '****5678', monthlyAverage: 120, dueDate: 10, autopay: true, lastBill: 115, trend: 'stable' },
        { id: 3, type: 'Internet', provider: 'FastNet Fiber', accountNumber: '****9012', monthlyAverage: 200, dueDate: 1, autopay: true, lastBill: 200, trend: 'stable' },
        { id: 4, type: 'Gas', provider: 'Natural Gas Co', accountNumber: '****3456', monthlyAverage: 80, dueDate: 20, autopay: false, lastBill: 95, trend: 'seasonal' }
      ],
      
      // Insurance Policies
      insurance: [
        { 
          id: 1, 
          type: 'General Liability', 
          carrier: 'State Farm Business', 
          policyNumber: 'GL-***789', 
          monthlyCost: 300, 
          coverage: '$2M/$4M', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          landlordInsured: true
        },
        { 
          id: 2, 
          type: 'Professional Liability', 
          carrier: 'Educators Insurance', 
          policyNumber: 'PL-***456', 
          monthlyCost: 200, 
          coverage: '$1M', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          covers: 'Educational malpractice'
        },
        { 
          id: 3, 
          type: 'Property Insurance', 
          carrier: 'Business Property Ins', 
          policyNumber: 'PR-***123', 
          monthlyCost: 150, 
          coverage: 'Replacement cost', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          deductible: '$5,000'
        },
        { 
          id: 4, 
          type: 'Workers Compensation', 
          carrier: 'Workers Comp Pro', 
          policyNumber: 'WC-***890', 
          monthlyCost: 350, 
          coverage: 'State required', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          classCode: '8868'
        },
        { 
          id: 5, 
          type: 'Cyber Liability', 
          carrier: 'CyberSafe Insurance', 
          policyNumber: 'CY-***234', 
          monthlyCost: 125, 
          coverage: '$1M data breach', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          covers: 'Student data protection'
        },
        { 
          id: 6, 
          type: 'Umbrella Policy', 
          carrier: 'Excess Coverage Inc', 
          policyNumber: 'UM-***567', 
          monthlyCost: 100, 
          coverage: '$5M additional', 
          renewalDate: '2024-12-31',
          daysUntilRenewal: 97,
          status: 'active',
          abovePrimary: true
        }
      ],
      
      // Vendors & Maintenance Contracts
      vendors: [
        { id: 1, name: 'ABC Janitorial', service: 'Cleaning', frequency: 'Daily', monthlyCost: 800, contract: 'Month-to-month', nextReview: '2024-10-01', status: 'active', contactPhone: '555-1234' },
        { id: 2, name: 'HVAC Masters', service: 'HVAC Maintenance', frequency: 'Quarterly', monthlyCost: 150, contract: 'Annual', nextReview: '2025-01-15', status: 'active', contactPhone: '555-2345' },
        { id: 3, name: 'Green Lawn Care', service: 'Landscaping', frequency: 'Weekly', monthlyCost: 200, contract: '6-month', nextReview: '2024-12-01', status: 'active', contactPhone: '555-3456' },
        { id: 4, name: 'SafeGuard Security', service: 'Alarm Monitoring', frequency: 'Continuous', monthlyCost: 50, contract: 'Annual', nextReview: '2025-03-01', status: 'active', contactPhone: '555-4567' },
        { id: 5, name: 'Pest Control Pro', service: 'Pest Control', frequency: 'Monthly', monthlyCost: 75, contract: 'Annual', nextReview: '2025-02-01', status: 'active', contactPhone: '555-5678' }
      ],
      
      // Recent Maintenance & Repairs
      maintenanceHistory: [
        { id: 1, date: '2024-09-15', description: 'HVAC compressor repair', vendor: 'HVAC Masters', cost: 850, category: 'Repair', urgent: true },
        { id: 2, date: '2024-09-01', description: 'Monthly pest control', vendor: 'Pest Control Pro', cost: 75, category: 'Maintenance', urgent: false },
        { id: 3, date: '2024-08-20', description: 'Plumbing leak repair', vendor: 'Quick Fix Plumbing', cost: 325, category: 'Repair', urgent: true },
        { id: 4, date: '2024-08-15', description: 'Fire extinguisher inspection', vendor: 'Safety First Inc', cost: 150, category: 'Compliance', urgent: false },
        { id: 5, date: '2024-08-01', description: 'Quarterly HVAC service', vendor: 'HVAC Masters', cost: 150, category: 'Maintenance', urgent: false }
      ],
      
      // Upcoming Critical Dates
      criticalDates: [
        { type: 'Insurance Renewal', description: 'All policies renew', date: '2024-12-31', daysUntil: 97, priority: 'high', action: 'Start shopping for quotes' },
        { type: 'Lease Escalation', description: 'Rent increases 5%', date: '2025-01-01', daysUntil: 98, priority: 'high', action: 'Budget for increase' },
        { type: 'HVAC Contract', description: 'Annual contract renewal', date: '2025-01-15', daysUntil: 112, priority: 'medium', action: 'Review performance' },
        { type: 'Fire Inspection', description: 'Annual fire safety inspection', date: '2024-11-15', daysUntil: 51, priority: 'high', action: 'Schedule with fire dept' },
        { type: 'Property Tax', description: 'Annual assessment due', date: '2025-03-01', daysUntil: 157, priority: 'medium', action: 'Review assessment' }
      ]
    };
    
    setFacilities([demoFacility]);
    setSelectedFacility(demoFacility);
  };

  const calculateTotalMonthlyCosts = (facility) => {
    if (!facility) return 0;
    
    const lease = facility.lease.totalMonthly;
    const utilities = facility.utilities.reduce((sum, u) => sum + u.monthlyAverage, 0);
    const insurance = facility.insurance.reduce((sum, i) => sum + i.monthlyCost, 0);
    const vendors = facility.vendors.reduce((sum, v) => sum + v.monthlyCost, 0);
    
    return lease + utilities + insurance + vendors;
  };

  const calculateAnnualCosts = (facility) => {
    return calculateTotalMonthlyCosts(facility) * 12;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Facility Management</h1>
              <p className="text-gray-600">Track all facility costs: lease, utilities, insurance, vendors, maintenance</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Expense
          </button>
        </div>
      </div>

      {selectedFacility && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Monthly</span>
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${calculateTotalMonthlyCosts(selectedFacility).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${calculateAnnualCosts(selectedFacility).toLocaleString()}/year
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Lease/Rent</span>
                <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${selectedFacility.lease.totalMonthly.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${selectedFacility.lease.pricePerSqFt}/sq ft
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Insurance</span>
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${selectedFacility.insurance.reduce((sum, i) => sum + i.monthlyCost, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedFacility.insurance.length} policies active
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Utilities & Vendors</span>
                <BoltIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${(
                  selectedFacility.utilities.reduce((sum, u) => sum + u.monthlyAverage, 0) +
                  selectedFacility.vendors.reduce((sum, v) => sum + v.monthlyCost, 0)
                ).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedFacility.utilities.length + selectedFacility.vendors.length} active services
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'lease', 'utilities', 'insurance', 'vendors', 'maintenance', 'calendar'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lease/Rent</span>
                    <span className="font-medium">${selectedFacility.lease.totalMonthly.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Utilities</span>
                    <span className="font-medium">
                      ${selectedFacility.utilities.reduce((sum, u) => sum + u.monthlyAverage, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">
                      ${selectedFacility.insurance.reduce((sum, i) => sum + i.monthlyCost, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vendors & Maintenance</span>
                    <span className="font-medium">
                      ${selectedFacility.vendors.reduce((sum, v) => sum + v.monthlyCost, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Total Monthly</span>
                    <span className="font-bold text-lg">${calculateTotalMonthlyCosts(selectedFacility).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Critical Dates */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Critical Dates</h3>
                <div className="space-y-3">
                  {selectedFacility.criticalDates.slice(0, 5).map(date => (
                    <div key={date.type} className={`flex items-center justify-between p-3 rounded-lg ${
                      date.priority === 'high' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <CalendarIcon className={`h-5 w-5 ${
                          date.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">{date.type}</div>
                          <div className="text-sm text-gray-600">{date.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{date.daysUntil} days</div>
                        <div className="text-xs text-gray-500">{date.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Maintenance */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance & Repairs</h3>
                <div className="space-y-2">
                  {selectedFacility.maintenanceHistory.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.urgent ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.description}</div>
                          <div className="text-xs text-gray-500">{item.vendor} • {item.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${item.cost}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lease' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Lease Information</h3>
                  {selectedFacility.lease.hasDocument ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircleIcon className="h-5 w-5" />
                      Document uploaded
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                      <CloudArrowUpIcon className="h-5 w-5" />
                      Upload Lease
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Monthly Costs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Rent:</span>
                        <span className="font-medium">${selectedFacility.lease.monthlyRent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CAM Charges:</span>
                        <span className="font-medium">${selectedFacility.lease.camCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Taxes:</span>
                        <span className="font-medium">${selectedFacility.lease.propertyTaxes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Building Insurance:</span>
                        <span className="font-medium">${selectedFacility.lease.buildingInsurance}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Monthly:</span>
                        <span className="font-bold">${selectedFacility.lease.totalMonthly}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Lease Terms</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{selectedFacility.lease.leaseStart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{selectedFacility.lease.leaseEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escalation Rate:</span>
                        <span className="font-medium text-red-600">{selectedFacility.lease.escalationRate}% annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">${selectedFacility.lease.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Personal Guarantee:</span>
                        <span className={`font-medium ${selectedFacility.lease.personalGuarantee ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedFacility.lease.personalGuarantee ? 'Yes ⚠️' : 'No ✓'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedFacility.lease.personalGuarantee && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-900">Personal Guarantee Alert</div>
                        <div className="text-sm text-red-700 mt-1">
                          You have personal liability for this lease. Consider negotiating to remove or cap this guarantee.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Analyze Lease
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Find Alternatives
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'utilities' && (
            <div className="space-y-4">
              {selectedFacility.utilities.map(utility => (
                <div key={utility.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <BoltIcon className="h-8 w-8 text-orange-500" />
                      <div>
                        <div className="font-semibold text-gray-900">{utility.type}</div>
                        <div className="text-sm text-gray-600">{utility.provider}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${utility.monthlyAverage}</div>
                      <div className="text-xs text-gray-500">avg/month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500">Last Bill</div>
                      <div className="font-medium">${utility.lastBill}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Due Date</div>
                      <div className="font-medium">{utility.dueDate}th of month</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Auto-Pay</div>
                      <div className={`font-medium ${utility.autopay ? 'text-green-600' : 'text-red-600'}`}>
                        {utility.autopay ? 'Yes ✓' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="space-y-4">
              {selectedFacility.insurance.map(policy => (
                <div key={policy.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                      <div>
                        <div className="font-semibold text-gray-900">{policy.type}</div>
                        <div className="text-sm text-gray-600">{policy.carrier}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${policy.monthlyCost}</div>
                      <div className="text-xs text-gray-500">/month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500">Coverage</div>
                      <div className="font-medium text-sm">{policy.coverage}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Policy #</div>
                      <div className="font-medium text-sm">{policy.policyNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Renewal</div>
                      <div className="font-medium text-sm">{policy.renewalDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Days Until</div>
                      <div className={`font-medium text-sm ${policy.daysUntilRenewal < 100 ? 'text-red-600' : 'text-green-600'}`}>
                        {policy.daysUntilRenewal} days
                      </div>
                    </div>
                  </div>

                  {policy.covers && (
                    <div className="mt-3 text-xs text-gray-600">
                      Covers: {policy.covers}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-4">
              {selectedFacility.vendors.map(vendor => (
                <div key={vendor.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <WrenchScrewdriverIcon className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-semibold text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-600">{vendor.service}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${vendor.monthlyCost}</div>
                      <div className="text-xs text-gray-500">/month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500">Frequency</div>
                      <div className="font-medium text-sm">{vendor.frequency}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Contract</div>
                      <div className="font-medium text-sm">{vendor.contract}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Next Review</div>
                      <div className="font-medium text-sm">{vendor.nextReview}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Contact</div>
                      <div className="font-medium text-sm">{vendor.contactPhone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

