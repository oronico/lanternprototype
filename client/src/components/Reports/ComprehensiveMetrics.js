import React from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ENROLLMENT, FINANCIAL, FACILITY, ATTENDANCE, OPERATIONS } from '../../data/centralizedMetrics';

/**
 * Comprehensive Key Metrics Dashboard
 * 
 * All important metrics organized by category:
 * - Money & Finance (DSCR, Days Cash, Budget Variance)
 * - Enrollment (Enrollment to Goal %, Attrition)
 * - Facility (Occupancy, Rent to Revenue)
 * - Operations (Contracts, Payments, Attendance)
 */

export default function ComprehensiveMetrics() {
  const getStatusColor = (value, benchmark, higherIsBetter = true) => {
    if (higherIsBetter) {
      return value >= benchmark ? 'text-green-600' : value >= benchmark * 0.8 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return value <= benchmark ? 'text-green-600' : value <= benchmark * 1.2 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const getStatusBadge = (value, benchmark, higherIsBetter = true) => {
    if (higherIsBetter) {
      if (value >= benchmark) return { label: 'Good', color: 'bg-green-100 text-green-800' };
      if (value >= benchmark * 0.8) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
      return { label: 'Needs Attention', color: 'bg-red-100 text-red-800' };
    } else {
      if (value <= benchmark) return { label: 'Good', color: 'bg-green-100 text-green-800' };
      if (value <= benchmark * 1.2) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
      return { label: 'High', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Key Metrics</h1>
            <p className="text-gray-600">Comprehensive operational and financial metrics</p>
          </div>
        </div>
      </div>

      {/* Money & Finance */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BanknotesIcon className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Money & Finance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DSCR */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Debt Service Coverage Ratio</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                FINANCIAL.dscr >= 1.25 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {FINANCIAL.dscr >= 1.25 ? 'Good' : 'Fair'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FINANCIAL.dscr >= 1.25 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {FINANCIAL.dscr.toFixed(2)}x
            </div>
            <div className="text-sm text-gray-600">
              Target: 1.25x+ (lender requirement)
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Income covers debt {FINANCIAL.dscr.toFixed(1)}x over
            </div>
          </div>

          {/* Days Cash */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Days Cash on Hand</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                FINANCIAL.daysCash >= 30 ? 'bg-green-100 text-green-800' : 
                FINANCIAL.daysCash >= 20 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {FINANCIAL.daysCash >= 30 ? 'Good' : FINANCIAL.daysCash >= 20 ? 'Building' : 'Low'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FINANCIAL.daysCash >= 30 ? 'text-green-600' : 
              FINANCIAL.daysCash >= 20 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {FINANCIAL.daysCash}
            </div>
            <div className="text-sm text-gray-600">
              Target: 30+ days minimum
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {FINANCIAL.cashReserveProgress}% toward 30-day goal
            </div>
          </div>

          {/* Budget Variance */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Budget to Actual Variance</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {Math.abs(FINANCIAL.budgetVariancePercent) <= 5 ? 'On Track' : 'Off Budget'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FINANCIAL.budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {FINANCIAL.budgetVariancePercent}%
            </div>
            <div className="text-sm text-gray-600">
              Budget: ${(FINANCIAL.budgetedRevenue / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {FINANCIAL.budgetVariance >= 0 ? 'Above' : 'Below'} budget by ${Math.abs(FINANCIAL.budgetVariance).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment & Students */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserGroupIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Enrollment & Students</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enrollment to Goal */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Enrollment to Goal %</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ENROLLMENT.goalProgress >= 90 ? 'bg-green-100 text-green-800' : 
                ENROLLMENT.goalProgress >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {ENROLLMENT.goalProgress >= 90 ? 'Excellent' : ENROLLMENT.goalProgress >= 70 ? 'On Track' : 'Below Target'}
              </span>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {ENROLLMENT.goalProgress}%
            </div>
            <div className="text-sm text-gray-600">
              {ENROLLMENT.current} of {ENROLLMENT.target} students
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {ENROLLMENT.target - ENROLLMENT.current} more students needed
            </div>
          </div>

          {/* Attrition Rate */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Attrition Rate</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ENROLLMENT.attritionRate <= 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ENROLLMENT.attritionRate <= 10 ? 'Good' : 'High'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              ENROLLMENT.attritionRate <= 10 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {ENROLLMENT.attritionRate}%
            </div>
            <div className="text-sm text-gray-600">
              Target: Below 10%
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {ENROLLMENT.attritionRate <= 5 ? '⭐ Gold Standard!' : 'Good retention'}
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Attendance Rate</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ATTENDANCE.ytdRate >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ATTENDANCE.ytdRate >= 95 ? 'Excellent' : 'Good'}
              </span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {ATTENDANCE.ytdRate}%
            </div>
            <div className="text-sm text-gray-600">
              Target: 95%+ YTD
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {ATTENDANCE.ytdRate >= 95 ? '✓ Goal exceeded!' : `${95 - ATTENDANCE.ytdRate}% to goal`}
            </div>
          </div>
        </div>
      </div>

      {/* Facility */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BuildingOfficeIcon className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Facility & Occupancy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Facility Occupancy */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Facility Occupancy</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                FACILITY.facilityOccupancy >= 80 ? 'bg-green-100 text-green-800' : 
                FACILITY.facilityOccupancy >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {FACILITY.facilityOccupancy >= 80 ? 'Efficient' : FACILITY.facilityOccupancy >= 60 ? 'Fair' : 'Underutilized'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FACILITY.facilityOccupancy >= 80 ? 'text-green-600' : 
              FACILITY.facilityOccupancy >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {FACILITY.facilityOccupancy}%
            </div>
            <div className="text-sm text-gray-600">
              {FACILITY.currentSqFtPerStudent} sq ft per student
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Optimal: {FACILITY.optimalSqFtPerStudent} sq ft per student
            </div>
          </div>

          {/* Rent to Revenue */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Rent to Revenue %</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                FACILITY.rentToRevenue <= 0.20 ? 'bg-green-100 text-green-800' : 
                FACILITY.rentToRevenue <= 0.25 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {FACILITY.rentToRevenue <= 0.20 ? 'Good' : FACILITY.rentToRevenue <= 0.25 ? 'High' : 'Critical'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FACILITY.rentToRevenue <= 0.20 ? 'text-green-600' : 
              FACILITY.rentToRevenue <= 0.25 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {Math.round(FACILITY.rentToRevenue * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              Target: ≤20% of revenue
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Rent: ${FACILITY.monthlyLease.toLocaleString()}/month
            </div>
          </div>

          {/* Total Facility Burden */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Total Facility Burden</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                FACILITY.facilityBurden <= 0.25 ? 'bg-green-100 text-green-800' : 
                FACILITY.facilityBurden <= 0.35 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {FACILITY.facilityBurden <= 0.25 ? 'Good' : FACILITY.facilityBurden <= 0.35 ? 'High' : 'Critical'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              FACILITY.facilityBurden <= 0.25 ? 'text-green-600' : 
              FACILITY.facilityBurden <= 0.35 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {Math.round(FACILITY.facilityBurden * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              Target: ≤25% of revenue
            </div>
            <div className="text-xs text-gray-500 mt-2">
              All facility costs: ${FACILITY.totalMonthlyCost.toLocaleString()}/month
            </div>
          </div>
        </div>
      </div>

      {/* Operations & Compliance */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Operations & Compliance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contract Coverage */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Contract Coverage</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                OPERATIONS.contractCoverage >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {OPERATIONS.contractCoverage >= 95 ? 'Excellent' : 'Good'}
              </span>
            </div>
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {OPERATIONS.contractCoverage}%
            </div>
            <div className="text-sm text-gray-600">
              {ENROLLMENT.current - OPERATIONS.missingContracts}/{ENROLLMENT.current} signed
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {OPERATIONS.missingContracts} missing contracts
            </div>
          </div>

          {/* On-Time Payment */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">On-Time Payment Rate</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Excellent
              </span>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {OPERATIONS.onTimePayment}%
            </div>
            <div className="text-sm text-gray-600">
              {ENROLLMENT.current - 1}/{ENROLLMENT.current} families on-time
            </div>
            <div className="text-xs text-gray-500 mt-2">
              1 family past due
            </div>
          </div>

          {/* Program Utilization */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Program Utilization</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ENROLLMENT.utilization >= 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ENROLLMENT.utilization >= 75 ? 'Good' : 'Room to Grow'}
              </span>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {ENROLLMENT.utilization}%
            </div>
            <div className="text-sm text-gray-600">
              {ENROLLMENT.current} of {ENROLLMENT.capacity} capacity
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {ENROLLMENT.capacity - ENROLLMENT.current} spots available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

