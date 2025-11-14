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
        
        <div className="grid grid-cols-5 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Enrollment</div>
            <div className="text-2xl font-bold">{ENROLLMENT.current}/{ENROLLMENT.target}</div>
            <div className="text-xs text-primary-200">{ENROLLMENT.goalProgress}% to goal</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Operating Cash</div>
            <div className="text-2xl font-bold">{FINANCIAL.daysCash} days</div>
            <div className="text-xs text-primary-200">${(FINANCIAL.operatingCash / 1000).toFixed(0)}k checking</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Savings Reserve</div>
            <div className="text-2xl font-bold">${(FINANCIAL.savingsCash / 1000).toFixed(1)}k</div>
            <div className="text-xs text-primary-200">Emergency fund 💰</div>
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

      {/* Savings Builder - Gamified Encouragement */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏦</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Build Your Emergency Reserve! 💚
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              You've saved <strong>${FINANCIAL.savingsCash.toLocaleString()}</strong>! 
              Financial experts recommend 3-6 months of expenses as an emergency fund.
            </p>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Progress to 3-Month Reserve:</span>
                <span className="font-bold text-green-700">
                  ${FINANCIAL.savingsCash.toLocaleString()} of ${(FINANCIAL.monthlyExpenses * 3).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((FINANCIAL.savingsCash / (FINANCIAL.monthlyExpenses * 3)) * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-bold">
                    {Math.round((FINANCIAL.savingsCash / (FINANCIAL.monthlyExpenses * 3)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Save just <strong>${Math.round((FINANCIAL.monthlyExpenses * 3 - FINANCIAL.savingsCash) / 12).toLocaleString()}/month</strong> for a year to reach your 3-month goal!
              </div>
              <button 
                onClick={() => window.location.href = '/bookkeeping'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
              >
                Open High-Yield Savings
              </button>
            </div>
            
            <div className="mt-3 text-xs text-green-800 italic">
              💡 Partner banks offer 4-5% APY on business savings - your money works for you!
            </div>
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

      {/* Today's Top Priorities */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Today's Priorities</h3>
          <a href="/metrics" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            View All Metrics →
          </a>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Students Priority */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-3">👥 Students</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Enrolled:</span>
                <span className="font-semibold text-gray-900">{ENROLLMENT.current}/{ENROLLMENT.target}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Attendance:</span>
                <span className={`font-semibold ${ATTENDANCE.ytdRate >= 95 ? 'text-green-600' : 'text-gray-900'}`}>
                  {ATTENDANCE.ytdRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Money Priority */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-3">💰 Money</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Cash Position:</span>
                <span className="font-semibold text-gray-900">{FINANCIAL.daysCash} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Revenue:</span>
                <span className="font-semibold text-gray-900">${(FINANCIAL.monthlyRevenue / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Operations Priority */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-3">⚙️ Operations</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Contracts:</span>
                <span className="font-semibold text-gray-900">{OPERATIONS.contractCoverage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Collections:</span>
                <span className={`font-semibold ${OPERATIONS.onTimePayment >= 95 ? 'text-green-600' : 'text-gray-900'}`}>
                  {OPERATIONS.onTimePayment}%
                </span>
              </div>
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

