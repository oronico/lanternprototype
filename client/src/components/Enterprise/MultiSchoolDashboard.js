import React, { useState, useEffect } from 'react';
import {
  BuildingOffice2Icon,
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  CalendarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';

/**
 * Enterprise Multi-School Dashboard
 * 
 * Aggregated view across all schools in a network:
 * - Total enrollment across all locations
 * - Combined financial health
 * - Attendance rates by location
 * - Revenue and cash flow
 * - Comparative metrics
 * - Network-wide trends
 * 
 * Perfect for:
 * - Multi-site microschool networks
 * - Charter school management organizations
 * - Education management companies
 * - Franchise operations
 */

export default function MultiSchoolDashboard() {
  const [schools, setSchools] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeframe, setTimeframe] = useState('month'); // week, month, quarter, year

  useEffect(() => {
    analytics.trackPageView('enterprise-multi-school');
    loadSchoolData();
  }, []);

  const loadSchoolData = () => {
    const networkSchools = [
      {
        id: 1,
        name: 'Sunshine Microschool',
        location: 'Tampa, FL',
        opened: '2022-08-15',
        yearsOpen: 2.1,
        
        // Enrollment
        enrollment: {
          current: 28,
          capacity: 35,
          utilization: 80,
          waitlist: 5,
          target: 35,
          ytdGrowth: 12 // +12% this year
        },
        
        // Financial
        financial: {
          monthlyRevenue: 16324,
          monthlyExpenses: 14200,
          netIncome: 2124,
          daysCash: 22,
          healthScore: 72,
          cashReserve: 14200
        },
        
        // Attendance
        attendance: {
          rate: 98,
          absences: 12,
          tardies: 8,
          trend: 'stable'
        },
        
        // Staff
        staff: {
          total: 4,
          teachers: 2,
          admin: 1,
          specialists: 1,
          turnover: 0 // 0% turnover
        },
        
        // Status
        status: 'healthy',
        alerts: 0,
        lastUpdated: '2 hours ago'
      },
      {
        id: 2,
        name: 'Riverside Learning Center',
        location: 'Orlando, FL',
        opened: '2023-01-10',
        yearsOpen: 1.7,
        
        enrollment: {
          current: 42,
          capacity: 50,
          utilization: 84,
          waitlist: 8,
          target: 50,
          ytdGrowth: 24 // +24% growth!
        },
        
        financial: {
          monthlyRevenue: 24500,
          monthlyExpenses: 21800,
          netIncome: 2700,
          daysCash: 18,
          healthScore: 68,
          cashReserve: 18600
        },
        
        attendance: {
          rate: 96,
          absences: 22,
          tardies: 15,
          trend: 'improving'
        },
        
        staff: {
          total: 6,
          teachers: 3,
          admin: 2,
          specialists: 1,
          turnover: 17 // 1 out of 6
        },
        
        status: 'growing',
        alerts: 1, // Cash a bit low
        lastUpdated: '1 hour ago'
      },
      {
        id: 3,
        name: 'Lakeside Academy',
        location: 'Miami, FL',
        opened: '2021-09-01',
        yearsOpen: 3.0,
        
        enrollment: {
          current: 48,
          capacity: 50,
          utilization: 96,
          waitlist: 12,
          target: 50,
          ytdGrowth: 4
        },
        
        financial: {
          monthlyRevenue: 32400,
          monthlyExpenses: 28900,
          netIncome: 3500,
          daysCash: 35,
          healthScore: 85,
          cashReserve: 32900
        },
        
        attendance: {
          rate: 97,
          absences: 18,
          tardies: 10,
          trend: 'stable'
        },
        
        staff: {
          total: 8,
          teachers: 4,
          admin: 2,
          specialists: 2,
          turnover: 0
        },
        
        status: 'excellent',
        alerts: 0,
        lastUpdated: '30 minutes ago'
      },
      {
        id: 4,
        name: 'Coastal Learning Pod',
        location: 'Fort Myers, FL',
        opened: '2024-01-08',
        yearsOpen: 0.7,
        
        enrollment: {
          current: 15,
          capacity: 25,
          utilization: 60,
          waitlist: 2,
          target: 25,
          ytdGrowth: 50 // Growing fast!
        },
        
        financial: {
          monthlyRevenue: 9750,
          monthlyExpenses: 11200,
          netIncome: -1450,
          daysCash: 8,
          healthScore: 52,
          cashReserve: 5600
        },
        
        attendance: {
          rate: 94,
          absences: 8,
          tardies: 12,
          trend: 'declining'
        },
        
        staff: {
          total: 3,
          teachers: 2,
          admin: 1,
          specialists: 0,
          turnover: 33 // 1 teacher left
        },
        
        status: 'needs_attention',
        alerts: 3, // Low cash, under-enrolled, attendance slipping
        lastUpdated: '4 hours ago'
      }
    ];

    setSchools(networkSchools);
  };

  // Calculate network-wide totals
  const networkTotals = {
    schools: schools.length,
    totalEnrollment: schools.reduce((sum, s) => sum + s.enrollment.current, 0),
    totalCapacity: schools.reduce((sum, s) => sum + s.enrollment.capacity, 0),
    avgUtilization: Math.round(schools.reduce((sum, s) => sum + s.enrollment.utilization, 0) / schools.length),
    totalRevenue: schools.reduce((sum, s) => sum + s.financial.monthlyRevenue, 0),
    totalCash: schools.reduce((sum, s) => sum + s.financial.cashReserve, 0),
    avgAttendance: Math.round(schools.reduce((sum, s) => sum + s.attendance.rate, 0) / schools.length),
    avgHealthScore: Math.round(schools.reduce((sum, s) => sum + s.financial.healthScore, 0) / schools.length),
    totalStaff: schools.reduce((sum, s) => sum + s.staff.total, 0),
    totalAlerts: schools.reduce((sum, s) => sum + s.alerts, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'green';
      case 'healthy': return 'blue';
      case 'growing': return 'purple';
      case 'needs_attention': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'healthy': return 'Healthy';
      case 'growing': return 'Growing';
      case 'needs_attention': return 'Needs Attention';
      default: return 'Unknown';
    }
  };

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  const viewSchoolDetails = (school) => {
    setSelectedSchool(school);
    setShowSchoolModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full">
            <BuildingOffice2Icon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Network Dashboard</h1>
              <p className="text-gray-600">{schools.length} schools in your network</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="touch-target w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <span className="touch-target w-full sm:w-auto px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full text-center">
              Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Network-Wide Metrics */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Schools</div>
          <div className="text-2xl font-bold text-gray-900">{networkTotals.schools}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-blue-600">{networkTotals.totalEnrollment}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Capacity</div>
          <div className="text-2xl font-bold text-gray-900">{networkTotals.totalCapacity}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Utilization</div>
          <div className="text-2xl font-bold text-primary-600">{networkTotals.avgUtilization}%</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Monthly Revenue</div>
          <div className="text-xl font-bold text-green-600">${(networkTotals.totalRevenue / 1000).toFixed(0)}k</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Cash Reserves</div>
          <div className="text-xl font-bold text-yellow-600">${(networkTotals.totalCash / 1000).toFixed(0)}k</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Avg Attendance</div>
          <div className="text-2xl font-bold text-green-600">{networkTotals.avgAttendance}%</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-600 mb-1">Health Score</div>
          <div className="text-2xl font-bold text-primary-600">{networkTotals.avgHealthScore}</div>
        </div>
      </div>

      {/* Alerts Summary */}
      {networkTotals.totalAlerts > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div>
              <div className="font-semibold text-red-900">
                {networkTotals.totalAlerts} Alert{networkTotals.totalAlerts !== 1 ? 's' : ''} Across Network
              </div>
              <div className="text-sm text-red-700">
                {schools.filter(s => s.alerts > 0).map(s => s.name).join(', ')} need{schools.filter(s => s.alerts > 0).length === 1 ? 's' : ''} attention
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schools Table - Scales to 10+ Schools */}
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cash</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Health</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schools.map(school => {
              const statusLabel = getStatusLabel(school.status);
              
              return (
                <tr 
                  key={school.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => viewSchoolDetails(school)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{school.name}</div>
                    <div className="text-sm text-gray-500">{school.location}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-medium text-gray-900">{school.enrollment.current}</div>
                    <div className="text-xs text-gray-500">{school.enrollment.utilization}% full</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-green-600">
                      ${(school.financial.monthlyRevenue / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`font-medium ${
                      school.financial.daysCash >= 30 ? 'text-green-600' :
                      school.financial.daysCash >= 20 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {school.financial.daysCash}
                    </div>
                    <div className="text-xs text-gray-500">days</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`font-medium ${
                      school.attendance.rate >= 95 ? 'text-green-600' :
                      school.attendance.rate >= 90 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {school.attendance.rate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`text-lg font-bold ${
                      school.financial.healthScore >= 85 ? 'text-green-600' :
                      school.financial.healthScore >= 70 ? 'text-blue-600' :
                      school.financial.healthScore >= 55 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {school.financial.healthScore}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      school.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      school.status === 'healthy' ? 'bg-blue-100 text-blue-800' :
                      school.status === 'growing' ? 'bg-primary-100 text-primary-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {statusLabel}
                    </span>
                    {school.alerts > 0 && (
                      <div className="text-xs text-red-600 mt-1">{school.alerts} alerts</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewSchoolDetails(school);
                      }}
                      className="touch-target inline-flex items-center justify-center px-3 py-2 text-primary-600 hover:text-primary-800 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {/* School Detail Modal */}
      {showSchoolModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedSchool.name}</h2>
                <div className="text-sm text-gray-600">{selectedSchool.location}</div>
              </div>
              <button 
                onClick={() => setShowSchoolModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-700">Students</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {selectedSchool.enrollment.current}/{selectedSchool.enrollment.capacity}
                  </div>
                  <div className="text-xs text-blue-600">{selectedSchool.enrollment.utilization}% full</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-700">Monthly Revenue</div>
                  <div className="text-2xl font-bold text-green-900">
                    ${(selectedSchool.financial.monthlyRevenue / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-green-600">{selectedSchool.financial.healthScore} health score</div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-primary-700">Days Cash</div>
                  <div className="text-2xl font-bold text-primary-900">
                    {selectedSchool.financial.daysCash}
                  </div>
                  <div className="text-xs text-primary-600">Goal: 30+ days</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">School Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Attendance Rate:</span>
                    <span className="font-medium">{selectedSchool.attendance.rate}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Staff Count:</span>
                    <span className="font-medium">{selectedSchool.staff.total}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Waitlist:</span>
                    <span className="font-medium">{selectedSchool.enrollment.waitlist} families</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">YTD Growth:</span>
                    <span className="font-medium text-green-600">+{selectedSchool.enrollment.ytdGrowth}%</span>
                  </div>
                </div>
              </div>

              {selectedSchool.alerts > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="font-medium text-red-900 mb-2">⚠️ {selectedSchool.alerts} Alerts</div>
                  <div className="text-sm text-red-700">
                    This school needs attention. Review enrollment, cash flow, or attendance.
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.href = '/dashboard'}
                className="touch-target w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Switch to This School
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            Top Performer
          </h3>
          <div>
            <div className="font-medium text-gray-900">Lakeside Academy</div>
            <div className="text-sm text-gray-600">96% utilization, 85 health score</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            Fastest Growing
          </h3>
          <div>
            <div className="font-medium text-gray-900">Coastal Learning Pod</div>
            <div className="text-sm text-gray-600">+50% enrollment growth YTD</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            Needs Support
          </h3>
          <div>
            <div className="font-medium text-gray-900">Coastal Learning Pod</div>
            <div className="text-sm text-gray-600">8 days cash, under-enrolled</div>
          </div>
        </div>
      </div>
    </div>
  );
}

