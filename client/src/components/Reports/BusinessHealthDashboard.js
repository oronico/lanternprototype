import React from 'react';
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UsersIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ENROLLMENT, FINANCIAL, FACILITY, ATTENDANCE, STAFF } from '../../data/centralizedMetrics';

/**
 * Business Health Dashboard
 * 
 * 5 Categories with Traffic Light System:
 * - Financial (6 metrics)
 * - Facility (4 metrics)
 * - Students (5 metrics)
 * - Staff (3 metrics)
 * - Future Ready (2 metrics)
 * 
 * Visual indicators: ✓ Green, ⚠️ Yellow, 🚨 Red
 */

export default function BusinessHealthDashboard() {
  const breakEvenRevenue = FINANCIAL.monthlyExpenses;
  const revenuePerStudent = Math.round(FINANCIAL.monthlyRevenue / ENROLLMENT.current);
  const annualRevenuePerStudent = revenuePerStudent * 12;

  const getStatusIcon = (status) => {
    if (status === 'good') return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (status === 'warning') return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
    return <XCircleIcon className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'good') return 'text-green-600';
    if (status === 'warning') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusLabel = (status) => {
    if (status === 'good') return { text: 'On Track', class: 'bg-green-100 text-green-800' };
    if (status === 'warning') return { text: 'Needs Work', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Alarm', class: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Health Dashboard</h1>
        <p className="text-gray-600">Track all key metrics organized by category</p>
      </div>

      {/* Overall Summary */}
      <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overall Health Score</h2>
            <p className="text-primary-100">At a glance: 12 on track, 6 needs work, 2 alarms</p>
          </div>
          <div className="text-6xl font-bold">{FINANCIAL.healthScore}</div>
        </div>
      </div>

      {/* 1. FINANCIAL */}
      <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-600 rounded-lg">
            <BanknotesIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">💰 Financial</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DCOH */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Days Cash on Hand</div>
              {getStatusIcon(FINANCIAL.daysCash >= 30 ? 'good' : FINANCIAL.daysCash >= 20 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FINANCIAL.daysCash >= 30 ? 'good' : FINANCIAL.daysCash >= 20 ? 'warning' : 'alarm')}`}>
              {FINANCIAL.daysCash}
            </div>
            <div className="text-xs text-gray-600">Target: 30+ days</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FINANCIAL.daysCash >= 30 ? 'good' : FINANCIAL.daysCash >= 20 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(FINANCIAL.daysCash >= 30 ? 'good' : FINANCIAL.daysCash >= 20 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Operating Cash */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Operating Cash</div>
              {getStatusIcon('good')}
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${(FINANCIAL.operatingCash / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-gray-600">Checking account</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>

          {/* Savings */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Savings Reserve</div>
              {getStatusIcon(FINANCIAL.savingsProgress >= 100 ? 'good' : FINANCIAL.savingsProgress >= 50 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FINANCIAL.savingsProgress >= 100 ? 'good' : FINANCIAL.savingsProgress >= 50 ? 'warning' : 'alarm')}`}>
              ${(FINANCIAL.savingsCash / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-gray-600">{FINANCIAL.savingsProgress}% to 3-month goal</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FINANCIAL.savingsProgress >= 100 ? 'good' : FINANCIAL.savingsProgress >= 50 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(FINANCIAL.savingsProgress >= 100 ? 'good' : FINANCIAL.savingsProgress >= 50 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Budget Variance */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Budget Variance YTD</div>
              {getStatusIcon(Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'good' : 'warning')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'good' : 'warning')}`}>
              {FINANCIAL.budgetVariancePercent}%
            </div>
            <div className="text-xs text-gray-600">{FINANCIAL.budgetVariance < 0 ? 'Under' : 'Over'} budget</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'good' : 'warning').class
            }`}>
              {getStatusLabel(Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'good' : 'warning').text}
            </div>
          </div>

          {/* Break-Even */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Monthly Break-Even</div>
              {getStatusIcon(FINANCIAL.monthlyRevenue >= breakEvenRevenue ? 'good' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FINANCIAL.monthlyRevenue >= breakEvenRevenue ? 'good' : 'alarm')}`}>
              ${(breakEvenRevenue / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-gray-600">Revenue: ${(FINANCIAL.monthlyRevenue / 1000).toFixed(1)}k</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Above Break-Even
            </div>
          </div>

          {/* Revenue Per Student */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Revenue Per Student</div>
              {getStatusIcon('good')}
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${annualRevenuePerStudent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Annually (${revenuePerStudent}/mo)</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>
        </div>
      </div>

      {/* 2. FACILITY */}
      <div className="mb-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-600 rounded-lg">
            <BuildingOfficeIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">🏢 Facility</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Capacity Used */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">% Capacity Used</div>
              {getStatusIcon(ENROLLMENT.utilization >= 75 ? 'good' : ENROLLMENT.utilization >= 50 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(ENROLLMENT.utilization >= 75 ? 'good' : ENROLLMENT.utilization >= 50 ? 'warning' : 'alarm')}`}>
              {ENROLLMENT.utilization}%
            </div>
            <div className="text-xs text-gray-600">{ENROLLMENT.current} of {ENROLLMENT.capacity}</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(ENROLLMENT.utilization >= 75 ? 'good' : ENROLLMENT.utilization >= 50 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(ENROLLMENT.utilization >= 75 ? 'good' : ENROLLMENT.utilization >= 50 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Rent to Revenue */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Rent to Revenue %</div>
              {getStatusIcon(FACILITY.rentToRevenue <= 0.20 ? 'good' : FACILITY.rentToRevenue <= 0.25 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FACILITY.rentToRevenue <= 0.20 ? 'good' : FACILITY.rentToRevenue <= 0.25 ? 'warning' : 'alarm')}`}>
              {Math.round(FACILITY.rentToRevenue * 100)}%
            </div>
            <div className="text-xs text-gray-600">Target: ≤20%</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FACILITY.rentToRevenue <= 0.20 ? 'good' : FACILITY.rentToRevenue <= 0.25 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(FACILITY.rentToRevenue <= 0.20 ? 'good' : FACILITY.rentToRevenue <= 0.25 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Cost Per Sq Ft */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Cost Per Sq Ft</div>
              {getStatusIcon(FACILITY.costPerSqFt <= FACILITY.marketRate ? 'good' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FACILITY.costPerSqFt <= FACILITY.marketRate ? 'good' : 'alarm')}`}>
              ${FACILITY.costPerSqFt.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Market: ${FACILITY.marketRate}</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FACILITY.costPerSqFt <= FACILITY.marketRate ? 'good' : 'alarm').class
            }`}>
              {getStatusLabel(FACILITY.costPerSqFt <= FACILITY.marketRate ? 'good' : 'alarm').text}
            </div>
          </div>

          {/* Cost Per Student */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Facility Cost/Student</div>
              {getStatusIcon('warning')}
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              ${FACILITY.costPerStudent}
            </div>
            <div className="text-xs text-gray-600">Per student/month</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Needs Work
            </div>
          </div>
        </div>
      </div>

      {/* 3. STUDENTS */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">👥 Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Enrollment Count */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Enrolled</div>
              {getStatusIcon('good')}
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {ENROLLMENT.current}
            </div>
            <div className="text-xs text-gray-600">Current students</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>

          {/* Enrollment to Goal */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Enrollment to Goal</div>
              {getStatusIcon(ENROLLMENT.goalProgress >= 90 ? 'good' : ENROLLMENT.goalProgress >= 70 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(ENROLLMENT.goalProgress >= 90 ? 'good' : ENROLLMENT.goalProgress >= 70 ? 'warning' : 'alarm')}`}>
              {ENROLLMENT.goalProgress}%
            </div>
            <div className="text-xs text-gray-600">{ENROLLMENT.current}/{ENROLLMENT.target}</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(ENROLLMENT.goalProgress >= 90 ? 'good' : ENROLLMENT.goalProgress >= 70 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(ENROLLMENT.goalProgress >= 90 ? 'good' : ENROLLMENT.goalProgress >= 70 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Daily Attendance */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Daily Attendance</div>
              {getStatusIcon(ATTENDANCE.ytdRate >= 95 ? 'good' : ATTENDANCE.ytdRate >= 90 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(ATTENDANCE.ytdRate >= 95 ? 'good' : ATTENDANCE.ytdRate >= 90 ? 'warning' : 'alarm')}`}>
              {ATTENDANCE.ytdRate}%
            </div>
            <div className="text-xs text-gray-600">YTD average</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>

          {/* Attrition */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Attrition Rate</div>
              {getStatusIcon(ENROLLMENT.attritionRate <= 10 ? 'good' : ENROLLMENT.attritionRate <= 15 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(ENROLLMENT.attritionRate <= 10 ? 'good' : ENROLLMENT.attritionRate <= 15 ? 'warning' : 'alarm')}`}>
              {ENROLLMENT.attritionRate}%
            </div>
            <div className="text-xs text-gray-600">Target: <10%</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>

          {/* Retention */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Retention % (YoY)</div>
              {getStatusIcon(ENROLLMENT.retentionRate >= 90 ? 'good' : ENROLLMENT.retentionRate >= 80 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(ENROLLMENT.retentionRate >= 90 ? 'good' : ENROLLMENT.retentionRate >= 80 ? 'warning' : 'alarm')}`}>
              {ENROLLMENT.retentionRate}%
            </div>
            <div className="text-xs text-gray-600">Students returned</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>
        </div>
      </div>

      {/* 4. STAFF */}
      <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600 rounded-lg">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">👨‍🏫 Staff</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hired to Goal */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Hired to Goal</div>
              {getStatusIcon(STAFF.total >= 5 ? 'good' : 'warning')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(STAFF.total >= 5 ? 'good' : 'warning')}`}>
              {STAFF.total}/5
            </div>
            <div className="text-xs text-gray-600">Need 1 more for goal</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Needs Work
            </div>
          </div>

          {/* Staff Retention */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Staff Retention</div>
              {getStatusIcon(STAFF.turnover === 0 ? 'good' : 'warning')}
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {100 - STAFF.turnover}%
            </div>
            <div className="text-xs text-gray-600">{STAFF.turnover}% turnover</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>

          {/* Staff Attendance */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Staff Attendance</div>
              {getStatusIcon('good')}
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              98%
            </div>
            <div className="text-xs text-gray-600">YTD average</div>
            <div className="mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              On Track
            </div>
          </div>
        </div>
      </div>

      {/* 5. FUTURE READY */}
      <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-600 rounded-lg">
            <RocketLaunchIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">🔮 Future Ready</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DSCR */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Debt Service Coverage Ratio</div>
              {getStatusIcon(FINANCIAL.dscr >= 1.25 ? 'good' : FINANCIAL.dscr >= 1.0 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FINANCIAL.dscr >= 1.25 ? 'good' : FINANCIAL.dscr >= 1.0 ? 'warning' : 'alarm')}`}>
              {FINANCIAL.dscr.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-600">Lender target: 1.25x+</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FINANCIAL.dscr >= 1.25 ? 'good' : FINANCIAL.dscr >= 1.0 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(FINANCIAL.dscr >= 1.25 ? 'good' : FINANCIAL.dscr >= 1.0 ? 'warning' : 'alarm').text}
            </div>
          </div>

          {/* Savings Reserve */}
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Emergency Reserve</div>
              {getStatusIcon(FINANCIAL.monthsOfExpensesCovered >= 3 ? 'good' : FINANCIAL.monthsOfExpensesCovered >= 1 ? 'warning' : 'alarm')}
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStatusColor(FINANCIAL.monthsOfExpensesCovered >= 3 ? 'good' : FINANCIAL.monthsOfExpensesCovered >= 1 ? 'warning' : 'alarm')}`}>
              ${(FINANCIAL.savingsCash / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-gray-600">{FINANCIAL.monthsOfExpensesCovered.toFixed(1)} months covered</div>
            <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              getStatusLabel(FINANCIAL.monthsOfExpensesCovered >= 3 ? 'good' : FINANCIAL.monthsOfExpensesCovered >= 1 ? 'warning' : 'alarm').class
            }`}>
              {getStatusLabel(FINANCIAL.monthsOfExpensesCovered >= 3 ? 'good' : FINANCIAL.monthsOfExpensesCovered >= 1 ? 'warning' : 'alarm').text}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Health Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-gray-600">✓ On Track</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">6</div>
            <div className="text-sm text-gray-600">⚠️ Needs Work</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">2</div>
            <div className="text-sm text-gray-600">🚨 Alarm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

