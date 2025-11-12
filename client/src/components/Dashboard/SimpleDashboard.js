import React from 'react';
import { 
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ENROLLMENT, FINANCIAL, ATTENDANCE, OPERATIONS } from '../../data/centralizedMetrics';

/**
 * Simple Dashboard - Clean, Fast, No API Dependencies
 * 
 * Shows key metrics directly from centralized data
 * No loading states, no conditionals, just works
 */

export default function SimpleDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Operating Cash</span>
            <BanknotesIcon className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${FINANCIAL.operatingCash.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">{FINANCIAL.daysCash} days cash</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Enrolled Students</span>
            <UserGroupIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{ENROLLMENT.current}</div>
          <div className="text-sm text-gray-500 mt-1">Target: {ENROLLMENT.target}</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Revenue</span>
            <ChartBarIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${FINANCIAL.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">From tuition</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Attendance Rate</span>
            <CalendarIcon className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{ATTENDANCE.ytdRate}%</div>
          <div className="text-sm text-gray-500 mt-1">YTD average</div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Financial Health Score</h2>
            <p className="text-primary-100">Strong progress! Keep building toward your goals.</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold">{FINANCIAL.healthScore}</div>
            <div className="text-sm text-primary-100 mt-1">out of 100</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{ENROLLMENT.utilization}%</div>
            <div className="text-sm text-gray-600">Capacity Utilized</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{OPERATIONS.contractCoverage}%</div>
            <div className="text-sm text-gray-600">Contracts Signed</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{OPERATIONS.onTimePayment}%</div>
            <div className="text-sm text-gray-600">On-Time Payments</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{FINANCIAL.profitMargin}%</div>
            <div className="text-sm text-gray-600">Profit Margin</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a 
          href="/command-center"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Today's Actions</h4>
          <p className="text-sm text-gray-600 mb-4">
            View action items, nudges, and daily tasks
          </p>
          <div className="text-primary-600 font-medium flex items-center gap-2">
            Go to Command Center
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>

        <a 
          href="/students"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Student Management</h4>
          <p className="text-sm text-gray-600 mb-4">
            View all {ENROLLMENT.current} enrolled students and take attendance
          </p>
          <div className="text-blue-600 font-medium flex items-center gap-2">
            Go to Students
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>

        <a 
          href="/payments"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-green-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Payments</h4>
          <p className="text-sm text-gray-600 mb-4">
            Track payments and reconcile transactions
          </p>
          <div className="text-green-600 font-medium flex items-center gap-2">
            Go to Payments
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>
      </div>
    </div>
  );
}

