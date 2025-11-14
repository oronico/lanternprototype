import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { FINANCIAL, FACILITY, STAFF, ENROLLMENT } from '../../data/centralizedMetrics';

/**
 * Budget to Actual Comparison
 * 
 * Shows planned budget vs actual spending
 * Helps identify variances and manage to budget
 * Critical for financial discipline
 */

export default function BudgetToActual() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    analytics.trackPageView('budget-to-actual');
  }, []);

  // Budget data (planned)
  const budget = {
    revenue: {
      tuition: 20000, // Budgeted for 25 students × $800 avg
      fees: 500,
      donations: 300,
      total: 20800
    },
    expenses: {
      // Staff
      salaries: 6667,
      benefits: 800,
      professionalDev: 200,
      
      // Facility
      rent: 4500,
      utilities: 850,
      insurance: 1225,
      maintenance: 400,
      
      // Operations
      supplies: 600,
      curriculum: 300,
      technology: 200,
      marketing: 400,
      administrative: 350,
      
      total: 17042
    },
    netIncome: 3758 // Budgeted profit
  };

  // Actual data (from centralized metrics)
  const actual = {
    revenue: {
      tuition: FINANCIAL.monthlyRevenue, // $19,774
      fees: 0,
      donations: 0,
      total: FINANCIAL.monthlyRevenue
    },
    expenses: {
      // Staff
      salaries: STAFF.monthlyPayroll, // $6,667
      benefits: 800,
      professionalDev: 150,
      
      // Facility
      rent: FACILITY.monthlyLease, // $4,500
      utilities: FACILITY.monthlyUtilities, // $850
      insurance: FACILITY.monthlyInsurance, // $1,225
      maintenance: FACILITY.monthlyMaintenance, // $200
      
      // Operations
      supplies: 550,
      curriculum: 280,
      technology: 180,
      marketing: 350,
      administrative: 318,
      
      total: FINANCIAL.monthlyExpenses // $17,650
    },
    netIncome: FINANCIAL.netIncome // $2,124
  };

  // Calculate variances
  const variance = {
    revenue: {
      tuition: actual.revenue.tuition - budget.revenue.tuition,
      total: actual.revenue.total - budget.revenue.total
    },
    expenses: {
      total: actual.expenses.total - budget.expenses.total
    },
    netIncome: actual.netIncome - budget.netIncome
  };

  const getVarianceColor = (variance, isRevenue = false) => {
    if (isRevenue) {
      return variance >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      // For expenses, under budget is good
      return variance <= 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const getVarianceLabel = (variance, isRevenue = false) => {
    if (variance === 0) return 'On Budget';
    if (isRevenue) {
      return variance > 0 ? 'Above Budget' : 'Below Budget';
    } else {
      return variance > 0 ? 'Over Budget' : 'Under Budget';
    }
  };

  const categories = [
    // Revenue
    { 
      name: 'Tuition Revenue', 
      budget: budget.revenue.tuition, 
      actual: actual.revenue.tuition, 
      variance: variance.revenue.tuition,
      isRevenue: true,
      category: 'revenue'
    },
    
    // Staff Expenses
    { 
      name: 'Salaries & Wages', 
      budget: budget.expenses.salaries, 
      actual: actual.expenses.salaries, 
      variance: actual.expenses.salaries - budget.expenses.salaries,
      isRevenue: false,
      category: 'staff'
    },
    { 
      name: 'Benefits', 
      budget: budget.expenses.benefits, 
      actual: actual.expenses.benefits, 
      variance: actual.expenses.benefits - budget.expenses.benefits,
      isRevenue: false,
      category: 'staff'
    },
    
    // Facility Expenses
    { 
      name: 'Rent & Lease', 
      budget: budget.expenses.rent, 
      actual: actual.expenses.rent, 
      variance: actual.expenses.rent - budget.expenses.rent,
      isRevenue: false,
      category: 'facility'
    },
    { 
      name: 'Utilities', 
      budget: budget.expenses.utilities, 
      actual: actual.expenses.utilities, 
      variance: actual.expenses.utilities - budget.expenses.utilities,
      isRevenue: false,
      category: 'facility'
    },
    { 
      name: 'Insurance', 
      budget: budget.expenses.insurance, 
      actual: actual.expenses.insurance, 
      variance: actual.expenses.insurance - budget.expenses.insurance,
      isRevenue: false,
      category: 'facility'
    },
    
    // Operations
    { 
      name: 'Supplies', 
      budget: budget.expenses.supplies, 
      actual: actual.expenses.supplies, 
      variance: actual.expenses.supplies - budget.expenses.supplies,
      isRevenue: false,
      category: 'operations'
    },
    { 
      name: 'Marketing', 
      budget: budget.expenses.marketing, 
      actual: actual.expenses.marketing, 
      variance: actual.expenses.marketing - budget.expenses.marketing,
      isRevenue: false,
      category: 'operations'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget vs Actual</h1>
              <p className="text-gray-600">Track your financial performance against budget</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Revenue</div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              ${actual.revenue.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              / ${budget.revenue.total.toLocaleString()}
            </div>
          </div>
          <div className={`text-sm font-medium ${getVarianceColor(variance.revenue.total, true)}`}>
            {variance.revenue.total >= 0 ? '+' : ''}${Math.abs(variance.revenue.total).toLocaleString()} 
            ({getVarianceLabel(variance.revenue.total, true)})
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Expenses</div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-2xl font-bold text-gray-900">
              ${actual.expenses.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              / ${budget.expenses.total.toLocaleString()}
            </div>
          </div>
          <div className={`text-sm font-medium ${getVarianceColor(variance.expenses.total, false)}`}>
            {variance.expenses.total >= 0 ? '+' : ''}${Math.abs(variance.expenses.total).toLocaleString()} 
            ({getVarianceLabel(variance.expenses.total, false)})
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Net Income</div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className={`text-2xl font-bold ${actual.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${actual.netIncome.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              / ${budget.netIncome.toLocaleString()}
            </div>
          </div>
          <div className={`text-sm font-medium ${variance.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {variance.netIncome >= 0 ? '+' : ''}${Math.abs(variance.netIncome).toLocaleString()} variance
          </div>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Variance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((item, idx) => {
              const percentOfBudget = item.budget > 0 ? Math.round((item.actual / item.budget) * 100) : 0;
              
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    ${item.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    ${item.actual.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${getVarianceColor(item.variance, item.isRevenue)}`}>
                    {item.variance >= 0 ? '+' : ''}${item.variance.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    percentOfBudget <= 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {percentOfBudget}%
                  </td>
                </tr>
              );
            })}
            
            {/* Totals */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-4 text-sm">Total Revenue</td>
              <td className="px-6 py-4 text-sm text-right">${budget.revenue.total.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-right">${actual.revenue.total.toLocaleString()}</td>
              <td className={`px-6 py-4 text-sm text-right ${getVarianceColor(variance.revenue.total, true)}`}>
                {variance.revenue.total >= 0 ? '+' : ''}${variance.revenue.total.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {Math.round((actual.revenue.total / budget.revenue.total) * 100)}%
              </td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-4 text-sm">Total Expenses</td>
              <td className="px-6 py-4 text-sm text-right">${budget.expenses.total.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-right">${actual.expenses.total.toLocaleString()}</td>
              <td className={`px-6 py-4 text-sm text-right ${getVarianceColor(variance.expenses.total, false)}`}>
                {variance.expenses.total >= 0 ? '+' : ''}${variance.expenses.total.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {Math.round((actual.expenses.total / budget.expenses.total) * 100)}%
              </td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td className="px-6 py-4 text-sm">Net Income</td>
              <td className="px-6 py-4 text-sm text-right">${budget.netIncome.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-right">${actual.netIncome.toLocaleString()}</td>
              <td className={`px-6 py-4 text-sm text-right ${variance.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {variance.netIncome >= 0 ? '+' : ''}${variance.netIncome.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {budget.netIncome > 0 ? Math.round((actual.netIncome / budget.netIncome) * 100) : 'N/A'}%
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border-l-4 ${
          variance.revenue.total < 0 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
        }`}>
          <h3 className="font-semibold text-gray-900 mb-2">Revenue Analysis</h3>
          <div className="text-sm text-gray-700">
            {variance.revenue.total < 0 ? (
              <>
                Revenue is <strong>${Math.abs(variance.revenue.total).toLocaleString()} under budget</strong>. 
                Budgeted for 25 students but have {ENROLLMENT.current}. 
                Enroll {ENROLLMENT.target - ENROLLMENT.current} more students to reach target.
              </>
            ) : (
              <>
                Revenue is on track! Currently at <strong>{Math.round((actual.revenue.total / budget.revenue.total) * 100)}% of budget</strong>.
              </>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-lg border-l-4 ${
          variance.expenses.total > 0 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
        }`}>
          <h3 className="font-semibold text-gray-900 mb-2">Expense Control</h3>
          <div className="text-sm text-gray-700">
            {variance.expenses.total > 0 ? (
              <>
                Expenses are <strong>${Math.abs(variance.expenses.total).toLocaleString()} over budget</strong>.
                Review spending in facility and operations categories.
              </>
            ) : (
              <>
                Great expense control! <strong>${Math.abs(variance.expenses.total).toLocaleString()} under budget</strong>.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

