import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { FINANCIAL, ENROLLMENT, STAFF, FACILITY } from '../../data/centralizedMetrics';

/**
 * Five-Year Proforma Financial Projections
 * 
 * Critical for:
 * - Fundraising (show investors 5-year plan)
 * - Bank loans (lenders require projections)
 * - Strategic planning
 * - Grant applications
 * 
 * Based on current actuals + growth assumptions
 */

export default function FiveYearProforma() {
  const [assumptions, setAssumptions] = useState({
    enrollmentGrowth: 15, // % annual growth
    tuitionIncrease: 3, // % annual increase
    expenseGrowth: 4, // % annual growth
    newTeacherYear: 2, // Add teacher in year 2
    facilityExpansionYear: 3 // Move to bigger space year 3
  });

  const [showAssumptions, setShowAssumptions] = useState(false);

  useEffect(() => {
    analytics.trackPageView('five-year-proforma');
  }, []);

  // Calculate 5-year projections
  const calculateProjections = () => {
    const years = [];
    
    // Year 1 (Current - baseline)
    years.push({
      year: 1,
      label: '2024-25',
      enrollment: ENROLLMENT.current, // 24
      avgTuition: Math.round(FINANCIAL.monthlyRevenue / ENROLLMENT.current), // $824
      monthlyRevenue: FINANCIAL.monthlyRevenue, // $19,774
      annualRevenue: FINANCIAL.annualRevenue, // $237,288
      
      staffCost: STAFF.monthlyPayroll * 12, // $80,004
      facilityCost: FACILITY.totalMonthlyCost * 12, // $96,600
      operatingCost: (FINANCIAL.monthlyExpenses - STAFF.monthlyPayroll - FACILITY.totalMonthlyCost) * 12, // $35,196
      totalExpenses: FINANCIAL.annualExpenses, // $211,800
      
      netIncome: FINANCIAL.annualProfit, // $25,488
      margin: FINANCIAL.profitMargin, // 11%
      
      cashStart: FINANCIAL.operatingCash, // $14,200
      cashEnd: FINANCIAL.operatingCash + FINANCIAL.annualProfit // $39,688
    });

    // Years 2-5 (Projections)
    for (let i = 2; i <= 5; i++) {
      const prev = years[i - 2];
      
      // Enrollment growth
      const enrollment = Math.round(prev.enrollment * (1 + assumptions.enrollmentGrowth / 100));
      
      // Tuition increases
      const avgTuition = Math.round(prev.avgTuition * (1 + assumptions.tuitionIncrease / 100));
      
      // Revenue
      const monthlyRevenue = enrollment * avgTuition;
      const annualRevenue = monthlyRevenue * 12;
      
      // Expenses
      let staffCost = prev.staffCost * (1 + assumptions.expenseGrowth / 100);
      if (i === assumptions.newTeacherYear) {
        staffCost += 45000; // Add new teacher
      }
      
      let facilityCost = prev.facilityCost * (1 + assumptions.expenseGrowth / 100);
      if (i === assumptions.facilityExpansionYear) {
        facilityCost *= 1.4; // 40% increase for bigger space
      }
      
      const operatingCost = prev.operatingCost * (1 + assumptions.expenseGrowth / 100);
      
      const totalExpenses = staffCost + facilityCost + operatingCost;
      
      // Net income
      const netIncome = annualRevenue - totalExpenses;
      const margin = Math.round((netIncome / annualRevenue) * 100);
      
      // Cash
      const cashStart = prev.cashEnd;
      const cashEnd = cashStart + netIncome;
      
      years.push({
        year: i,
        label: `${2023 + i}-${(2023 + i + 1).toString().slice(-2)}`,
        enrollment,
        avgTuition,
        monthlyRevenue,
        annualRevenue,
        staffCost,
        facilityCost,
        operatingCost,
        totalExpenses,
        netIncome,
        margin,
        cashStart,
        cashEnd
      });
    }
    
    return years;
  };

  const projections = calculateProjections();

  const updateAssumption = (key, value) => {
    setAssumptions(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">5-Year Financial Proforma</h1>
              <p className="text-gray-600">Strategic projections for planning and fundraising</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <PencilIcon className="h-5 w-5" />
              Edit Assumptions
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {/* Assumptions Panel */}
      {showAssumptions && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Growth Assumptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Enrollment Growth
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={assumptions.enrollmentGrowth}
                  onChange={(e) => updateAssumption('enrollmentGrowth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Tuition Increase
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={assumptions.tuitionIncrease}
                  onChange={(e) => updateAssumption('tuitionIncrease', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Expense Growth
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={assumptions.expenseGrowth}
                  onChange={(e) => updateAssumption('expenseGrowth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Year Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Year 5 Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            ${Math.round(projections[4].annualRevenue / 1000)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {projections[4].enrollment} students
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Year 5 Profit</div>
          <div className={`text-2xl font-bold ${projections[4].netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.round(projections[4].netIncome / 1000)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {projections[4].margin}% margin
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total 5-Year Revenue</div>
          <div className="text-2xl font-bold text-blue-600">
            ${Math.round(projections.reduce((sum, y) => sum + y.annualRevenue, 0) / 1000)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cumulative
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total 5-Year Profit</div>
          <div className="text-2xl font-bold text-purple-600">
            ${Math.round(projections.reduce((sum, y) => sum + y.netIncome, 0) / 1000)}k
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cumulative
          </div>
        </div>
      </div>

      {/* Detailed Projection Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Students</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Tuition</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expenses</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Income</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cash Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projections.map((year, idx) => (
              <tr key={idx} className={idx === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Year {year.year} {idx === 0 && <span className="text-blue-600">(Current)</span>}
                  <div className="text-xs text-gray-500">{year.label}</div>
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium">{year.enrollment}</td>
                <td className="px-6 py-4 text-sm text-right">${year.avgTuition}</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-green-600">
                  ${Math.round(year.annualRevenue / 1000)}k
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900">
                  ${Math.round(year.totalExpenses / 1000)}k
                </td>
                <td className={`px-6 py-4 text-sm text-right font-bold ${
                  year.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.round(year.netIncome / 1000)}k
                </td>
                <td className="px-6 py-4 text-sm text-right">{year.margin}%</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-blue-600">
                  ${Math.round(year.cashEnd / 1000)}k
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-4">Projected Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <UserGroupIcon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Break-even Enrollment</div>
              <div className="text-sm text-gray-600">
                Currently at {ENROLLMENT.current} students. Profitable at current level.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <BanknotesIcon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Cash Reserve Goal</div>
              <div className="text-sm text-gray-600">
                Build to $100k cash reserve by Year 3 (currently ${Math.round(FINANCIAL.operatingCash / 1000)}k)
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <BuildingOfficeIcon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Facility Expansion</div>
              <div className="text-sm text-gray-600">
                Year 3: Move to larger space (2,400 sq ft) for {projections[2]?.enrollment || 32} students
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <UsersIcon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Staff Growth</div>
              <div className="text-sm text-gray-600">
                Year 2: Add 3rd teacher. Year 4: Add admin staff.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">Use This Proforma For:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <div className="font-medium mb-1">🏦 Bank Loans</div>
            <div className="text-xs">Lenders require 3-5 year projections</div>
          </div>
          <div>
            <div className="font-medium mb-1">💰 Investor Pitches</div>
            <div className="text-xs">Show growth trajectory and ROI</div>
          </div>
          <div>
            <div className="font-medium mb-1">📋 Grant Applications</div>
            <div className="text-xs">Many grants require financial projections</div>
          </div>
        </div>
      </div>
    </div>
  );
}

