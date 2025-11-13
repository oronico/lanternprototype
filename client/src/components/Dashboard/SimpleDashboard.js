import React from 'react';
import { 
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ENROLLMENT, FINANCIAL, ATTENDANCE, OPERATIONS, STAFF, FACILITY } from '../../data/centralizedMetrics';
import { CoachingAlert } from '../Gamification/CoachingAlerts';

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Good Morning! 👋</h1>
        <p className="text-lg text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Performance Snapshot - Top of Page */}
      <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Performance Snapshot</h2>
            <p className="text-primary-100">Your key metrics at a glance</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{FINANCIAL.healthScore}</div>
            <div className="text-sm text-primary-100">Health Score</div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Enrollment</div>
            <div className="text-2xl font-bold">{ENROLLMENT.current}/{ENROLLMENT.target}</div>
            <div className="text-xs text-primary-200">{ENROLLMENT.goalProgress}% to goal</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Cash Position</div>
            <div className="text-2xl font-bold">{FINANCIAL.daysCash} days</div>
            <div className="text-xs text-primary-200">Operating cash: ${(FINANCIAL.operatingCash / 1000).toFixed(0)}k</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Attendance</div>
            <div className="text-2xl font-bold">{ATTENDANCE.ytdRate}%</div>
            <div className="text-xs text-primary-200">YTD average</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Collections</div>
            <div className="text-2xl font-bold">{OPERATIONS.onTimePayment}%</div>
            <div className="text-xs text-primary-200">On-time payments</div>
          </div>
        </div>
      </div>

      {/* Coaching Alerts - Gamified! */}
      {FINANCIAL.daysCash < 30 && (
        <div className="mb-8">
          <CoachingAlert 
            type="LOW_CASH"
            data={[FINANCIAL.daysCash]}
            onAction={() => window.location.href = '/payments'}
          />
        </div>
      )}

      {ENROLLMENT.current < ENROLLMENT.target && (
        <div className="mb-8">
          <CoachingAlert 
            type="BELOW_ENROLLMENT"
            data={[ENROLLMENT.current, ENROLLMENT.target, ENROLLMENT.ytdGrowth]}
            onAction={() => window.location.href = '/crm/recruitment'}
          />
        </div>
      )}

      {/* Metrics by Category */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Metrics by Category</h3>
        
        {/* Students & Enrollment */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-blue-500" />
            Students & Enrollment
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Enrolled</div>
              <div className="text-2xl font-bold text-blue-600">{ENROLLMENT.current}</div>
              <div className="text-xs text-gray-500">of {ENROLLMENT.target} goal</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Capacity</div>
              <div className="text-2xl font-bold text-gray-900">{ENROLLMENT.utilization}%</div>
              <div className="text-xs text-gray-500">{ENROLLMENT.current}/{ENROLLMENT.capacity}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Attendance</div>
              <div className="text-2xl font-bold text-green-600">{ATTENDANCE.ytdRate}%</div>
              <div className="text-xs text-gray-500">YTD average</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Retention</div>
              <div className="text-2xl font-bold text-purple-600">{ENROLLMENT.retentionRate}%</div>
              <div className="text-xs text-gray-500">students returned</div>
            </div>
          </div>
        </div>

        {/* Money & Finance */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-green-500" />
            Money & Finance
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Operating Cash</div>
              <div className="text-2xl font-bold text-green-600">${(FINANCIAL.operatingCash / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500">{FINANCIAL.daysCash} days</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Monthly Revenue</div>
              <div className="text-2xl font-bold text-gray-900">${(FINANCIAL.monthlyRevenue / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500">tuition income</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Monthly Expenses</div>
              <div className="text-2xl font-bold text-gray-900">${(FINANCIAL.monthlyExpenses / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500">total costs</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Net Income</div>
              <div className="text-2xl font-bold text-green-600">${(FINANCIAL.netIncome / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500">{FINANCIAL.profitMargin}% margin</div>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            Operations & Compliance
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Contracts Signed</div>
              <div className="text-2xl font-bold text-indigo-600">{OPERATIONS.contractCoverage}%</div>
              <div className="text-xs text-gray-500">{ENROLLMENT.current - OPERATIONS.missingContracts}/{ENROLLMENT.current}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">On-Time Payments</div>
              <div className="text-2xl font-bold text-green-600">{OPERATIONS.onTimePayment}%</div>
              <div className="text-xs text-gray-500">{ENROLLMENT.current - 1}/{ENROLLMENT.current} families</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Staff</div>
              <div className="text-2xl font-bold text-gray-900">{STAFF.total}</div>
              <div className="text-xs text-gray-500">{STAFF.w2Employees}W-2 + {STAFF.contractors1099}1099</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">Facility Burden</div>
              <div className="text-2xl font-bold text-orange-600">{Math.round(FACILITY.facilityBurden * 100)}%</div>
              <div className="text-xs text-gray-500">of revenue</div>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <a 
          href="/metrics"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Key Metrics</h4>
          <p className="text-sm text-gray-600 mb-4">
            View all comprehensive metrics by category
          </p>
          <div className="text-indigo-600 font-medium flex items-center gap-2">
            View All Metrics
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>
      </div>
    </div>
  );
}

