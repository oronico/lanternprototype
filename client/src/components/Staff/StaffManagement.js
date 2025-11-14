import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  PlusIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

/**
 * Staff Management System
 * 
 * Manages two types of staff:
 * 1. W-2 Employees (Full payroll via Gusto)
 * 2. 1099 Contractors (Track payments, issue 1099s)
 * 
 * Features:
 * - Gusto API integration for payroll
 * - Track contractor payments
 * - Generate 1099 forms
 * - Monitor payroll taxes
 * - Staff directory with roles
 */

const STAFF_TYPES = [
  { value: 'w2', label: 'W-2 Employee', description: 'Full-time/part-time staff with benefits' },
  { value: '1099', label: '1099 Contractor', description: 'Independent contractors, consultants' }
];

const STAFF_ROLES = [
  'Lead Teacher',
  'Assistant Teacher',
  'Teacher Aide',
  'Director',
  'Administrator',
  'Specialist (Art, Music, PE)',
  'Substitute Teacher',
  'Consultant',
  'Bookkeeper',
  'IT Support',
  'Custodian',
  'Other'
];

export default function StaffManagement() {
  const emit = useEventEmit();
  const [staff, setStaff] = useState([]);
  const [gustoConnected, setGustoConnected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState('all'); // all, w2, 1099

  useEffect(() => {
    analytics.trackPageView('staff-management');
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    const demoStaff = [
      {
        id: 1,
        type: 'w2',
        firstName: 'Sarah',
        lastName: 'Thompson',
        role: 'Lead Teacher',
        email: 'sarah.t@school.com',
        phone: '555-1001',
        startDate: '2024-01-15',
        
        // W-2 Specific
        salary: 45000,
        payFrequency: 'biweekly',
        hourlyRate: null,
        hoursPerWeek: 40,
        benefits: ['Health Insurance', '401k Match'],
        
        // Gusto Data
        gustoEmployeeId: 'emp_***123',
        lastPayrollRun: '2024-09-15',
        ytdGross: 31500,
        ytdTaxes: 6800,
        status: 'active'
      },
      {
        id: 2,
        type: 'w2',
        firstName: 'David',
        lastName: 'Kim',
        role: 'Assistant Teacher',
        email: 'david.k@school.com',
        phone: '555-1002',
        startDate: '2024-02-01',
        
        salary: 35000,
        payFrequency: 'biweekly',
        hourlyRate: null,
        hoursPerWeek: 30,
        benefits: [],
        
        gustoEmployeeId: 'emp_***124',
        lastPayrollRun: '2024-09-15',
        ytdGross: 24500,
        ytdTaxes: 5200,
        status: 'active'
      },
      {
        id: 3,
        type: '1099',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'Bookkeeper',
        email: 'maria@bookkeeping.com',
        phone: '555-1003',
        startDate: '2024-01-01',
        
        // 1099 Specific
        hourlyRate: 50,
        monthlyRetainer: 500,
        paymentSchedule: 'monthly',
        
        // Payment Tracking
        ytdPayments: 4500,
        last1099Sent: '2024-01-31',
        needsW9: false,
        w9OnFile: true,
        status: 'active'
      },
      {
        id: 4,
        type: '1099',
        firstName: 'James',
        lastName: 'Wilson',
        role: 'Specialist (Music)',
        email: 'james@music.com',
        phone: '555-1004',
        startDate: '2024-08-19',
        
        hourlyRate: 60,
        monthlyRetainer: null,
        paymentSchedule: 'per_session',
        
        ytdPayments: 720,
        last1099Sent: null,
        needsW9: true,
        w9OnFile: false,
        status: 'active'
      }
    ];

    setStaff(demoStaff);
    setGustoConnected(true);
  };

  const filteredStaff = selectedType === 'all' 
    ? staff 
    : staff.filter(s => s.type === selectedType);

  const w2Count = staff.filter(s => s.type === 'w2').length;
  const contractor1099Count = staff.filter(s => s.type === '1099').length;
  
  const totalW2Payroll = staff
    .filter(s => s.type === 'w2')
    .reduce((sum, s) => sum + (s.salary / 12), 0);
  
  const total1099Payments = staff
    .filter(s => s.type === '1099')
    .reduce((sum, s) => sum + (s.monthlyRetainer || 0), 0);

  const handleConnectGusto = () => {
    analytics.trackFeatureUsage('staffManagement', 'connect_gusto');
    toast.success('Redirecting to Gusto OAuth...');
    // In production, redirect to Gusto OAuth
  };

  const handleRunPayroll = () => {
    analytics.trackFeatureUsage('staffManagement', 'run_payroll');
    toast.success('Redirecting to Gusto to run payroll...');
    // In production, redirect to Gusto payroll interface
  };

  const handleGenerate1099 = (staffId) => {
    analytics.trackFeatureUsage('staffManagement', 'generate_1099', {
      staffId: staffId
    });
    toast.success('1099 generated and ready for download');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UsersIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600">Manage employees (W-2) and contractors (1099)</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {gustoConnected ? (
              <button
                onClick={handleRunPayroll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <BanknotesIcon className="h-5 w-5" />
                Run Payroll (Gusto)
              </button>
            ) : (
              <button
                onClick={handleConnectGusto}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <LinkIcon className="h-5 w-5" />
                Connect Gusto
              </button>
            )}
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Gusto Connection Status */}
      {gustoConnected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">Gusto Connected</div>
                <div className="text-sm text-green-700">Payroll synced automatically</div>
              </div>
            </div>
            <div className="text-sm text-green-700">
              Last sync: 2 hours ago
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Staff</div>
          <div className="text-3xl font-bold text-gray-900">{staff.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">W-2 Employees</div>
          <div className="text-3xl font-bold text-blue-600">{w2Count}</div>
          <div className="text-xs text-gray-500 mt-1">
            ${totalW2Payroll.toLocaleString()}/mo
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">1099 Contractors</div>
          <div className="text-3xl font-bold text-purple-600">{contractor1099Count}</div>
          <div className="text-xs text-gray-500 mt-1">
            ${total1099Payments.toLocaleString()}/mo
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Payroll</div>
          <div className="text-3xl font-bold text-green-600">
            ${(totalW2Payroll + total1099Payments).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">per month</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedType === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Staff ({staff.length})
        </button>
        <button
          onClick={() => setSelectedType('w2')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedType === 'w2'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          W-2 Employees ({w2Count})
        </button>
        <button
          onClick={() => setSelectedType('1099')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedType === '1099'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          1099 Contractors ({contractor1099Count})
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name / Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Compensation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                YTD Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStaff.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {person.firstName} {person.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{person.role}</div>
                  <div className="text-xs text-gray-500">{person.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    person.type === 'w2'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {person.type === 'w2' ? 'W-2 Employee' : '1099 Contractor'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {person.type === 'w2' ? (
                    <div>
                      <div className="font-medium">${person.salary.toLocaleString()}/yr</div>
                      <div className="text-xs text-gray-500">{person.payFrequency}</div>
                    </div>
                  ) : (
                    <div>
                      {person.monthlyRetainer ? (
                        <div className="font-medium">${person.monthlyRetainer}/mo</div>
                      ) : (
                        <div className="font-medium">${person.hourlyRate}/hr</div>
                      )}
                      <div className="text-xs text-gray-500">{person.paymentSchedule}</div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">
                    ${(person.ytdGross || person.ytdPayments).toLocaleString()}
                  </div>
                  {person.type === 'w2' && (
                    <div className="text-xs text-gray-500">
                      Taxes: ${person.ytdTaxes.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                      person.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {person.status === 'active' ? (
                        <CheckCircleIcon className="h-3 w-3" />
                      ) : null}
                      {person.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    
                    {person.type === '1099' && person.needsW9 && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        W-9 Needed
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {person.type === 'w2' && (
                      <button className="text-sm text-blue-600 hover:text-blue-800 text-left">
                        View in Gusto
                      </button>
                    )}
                    {person.type === '1099' && (
                      <button
                        onClick={() => handleGenerate1099(person.id)}
                        className="text-sm text-purple-600 hover:text-purple-800 text-left"
                      >
                        Generate 1099
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Summary (W-2 Only) */}
      {selectedType === 'all' || selectedType === 'w2' ? (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BanknotesIcon className="h-6 w-6 text-green-500" />
            Payroll Summary (W-2 Employees)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Monthly Gross Payroll</div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalW2Payroll.toLocaleString()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">YTD Payroll</div>
              <div className="text-2xl font-bold text-gray-900">
                ${staff.filter(s => s.type === 'w2').reduce((sum, s) => sum + s.ytdGross, 0).toLocaleString()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">YTD Taxes Withheld</div>
              <div className="text-2xl font-bold text-gray-900">
                ${staff.filter(s => s.type === 'w2').reduce((sum, s) => sum + s.ytdTaxes, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {gustoConnected && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-900">Next Payroll Run</div>
                  <div className="text-sm text-green-700">Friday, September 29, 2024</div>
                </div>
                <button
                  onClick={handleRunPayroll}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Run in Gusto
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* 1099 Summary */}
      {selectedType === 'all' || selectedType === '1099' ? (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-purple-500" />
            1099 Contractor Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total 1099 Contractors</div>
              <div className="text-2xl font-bold text-gray-900">{contractor1099Count}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">Monthly Payments</div>
              <div className="text-2xl font-bold text-gray-900">
                ${total1099Payments.toLocaleString()}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-1">YTD 1099 Payments</div>
              <div className="text-2xl font-bold text-gray-900">
                ${staff.filter(s => s.type === '1099').reduce((sum, s) => sum + s.ytdPayments, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {staff.filter(s => s.type === '1099' && s.needsW9).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-red-900">W-9 Forms Needed</div>
                  <div className="text-sm text-red-700">
                    {staff.filter(s => s.type === '1099' && s.needsW9).length} contractor(s) need to submit W-9 forms before year-end.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

