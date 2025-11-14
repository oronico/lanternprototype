import React, { useState } from 'react';
import { 
  CalculatorIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const PricingCalculator = () => {
  const [inputs, setInputs] = useState({
    studentCount: 28,
    currentTuition: 583,
    targetStudentCount: 35,
    esaAmount: 583,
    esaEligibleStudents: 18,
    facilityCost: 4500,
    payrollCost: 8500,
    ownerSalary: 4166,
    otherExpenses: 2000,
    operatingMargin: 0.15
  });

  const [activeTab, setActiveTab] = useState('inputs');

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value
    }));
  };

  // Calculate key metrics for display
  const totalCosts = inputs.facilityCost + inputs.payrollCost + inputs.ownerSalary + inputs.otherExpenses;
  const breakEvenTuition = Math.round(totalCosts / inputs.studentCount);
  const sustainableTuition = Math.round((totalCosts / inputs.studentCount) * (1 + inputs.operatingMargin));
  const currentRevenue = inputs.studentCount * inputs.currentTuition;
  const currentProfit = currentRevenue - totalCosts;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <CalculatorIcon className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tuition Engine</h1>
            <p className="text-gray-600">Comprehensive tuition optimization with market analysis, ESA integration, and sustainability modeling</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inputs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            School Inputs
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scenarios'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tuition Scenarios
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'market'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Market Analysis
          </button>
        </nav>
      </div>

      {/* School Inputs Tab */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Current Situation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Current Situation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Students</label>
                  <input
                    type="number"
                    value={inputs.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Students</label>
                  <input
                    type="number"
                    value={inputs.targetStudentCount}
                    onChange={(e) => handleInputChange('targetStudentCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Monthly Tuition</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.currentTuition}
                      onChange={(e) => handleInputChange('currentTuition', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operating Margin Target</label>
                  <select
                    value={inputs.operatingMargin}
                    onChange={(e) => handleInputChange('operatingMargin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={0.10}>10% - Minimal</option>
                    <option value={0.15}>15% - Recommended</option>
                    <option value={0.20}>20% - Conservative</option>
                    <option value={0.25}>25% - Growth-focused</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ESA & Voucher Data */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                ESA & Voucher Programs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ESA Amount (Monthly)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.esaAmount}
                      onChange={(e) => handleInputChange('esaAmount', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ESA-Eligible Students</label>
                  <input
                    type="number"
                    value={inputs.esaEligibleStudents}
                    onChange={(e) => handleInputChange('esaEligibleStudents', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>{Math.round((inputs.esaEligibleStudents / inputs.studentCount) * 100)}%</strong> of your families are ESA-eligible
                  • ESA families have <strong>90% retention rates</strong>
                </div>
              </div>
            </div>

            {/* Operating Costs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Monthly Operating Costs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility (Rent + CAM)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.facilityCost}
                      onChange={(e) => handleInputChange('facilityCost', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Payroll</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.payrollCost}
                      onChange={(e) => handleInputChange('payrollCost', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Salary (Required!)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.ownerSalary}
                      onChange={(e) => handleInputChange('ownerSalary', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.otherExpenses}
                      onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  <strong>Total Monthly Costs:</strong> ${totalCosts.toLocaleString()}
                  • <strong>Cost per Student:</strong> ${Math.round(totalCosts / inputs.studentCount)}
                </div>
              </div>
            </div>
          </div>

          {/* Results Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Tuition Recommendation</h3>
              <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${sustainableTuition}
                </div>
                <div className="text-sm text-gray-600 mb-4">per month</div>
                <div className="text-sm text-green-700">
                  Sustainable pricing with {Math.round(inputs.operatingMargin * 100)}% operating margin
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Tuition:</span>
                  <span className="font-medium">${inputs.currentTuition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Required Increase:</span>
                  <span className={`font-medium ${sustainableTuition > inputs.currentTuition ? 'text-red-600' : 'text-green-600'}`}>
                    {sustainableTuition > inputs.currentTuition ? '+' : ''}${sustainableTuition - inputs.currentTuition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Average:</span>
                  <span className="font-medium">$750</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Monthly Profit:</span>
                  <span className={`font-medium ${currentProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${currentProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                ESA Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ESA Coverage:</span>
                  <span className="font-medium">
                    {Math.round((inputs.esaAmount / sustainableTuition) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Family Contribution:</span>
                  <span className="font-medium">
                    ${Math.max(0, sustainableTuition - inputs.esaAmount)}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESA-Eligible Students:</span>
                  <span className="font-medium">{inputs.esaEligibleStudents}/{inputs.studentCount}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Strategy:</strong> ESA + ${Math.max(0, sustainableTuition - inputs.esaAmount)} family investment. 
                  Position as "educational choice made affordable."
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-even Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even Tuition:</span>
                  <span className="font-medium text-red-600">${breakEvenTuition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even Students:</span>
                  <span className="font-medium">{Math.ceil(totalCosts / inputs.currentTuition)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimal Size:</span>
                  <span className="font-medium text-green-600">{inputs.targetStudentCount} students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tuition Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Break-even Scenario */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <h4 className="font-semibold text-gray-900 mb-3">Break-even</h4>
              <div className="text-2xl font-bold text-gray-900 mb-2">${breakEvenTuition}</div>
              <div className="text-sm text-gray-600 mb-4">Minimum to cover all costs</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span>${(breakEvenTuition * inputs.studentCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span className="text-red-600">$0</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-red-600">⚠️ Unsustainable - no emergency margin</div>
            </div>

            {/* ESA-Optimized Scenario */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-3">ESA-Optimized</h4>
              <div className="text-2xl font-bold text-gray-900 mb-2">${inputs.esaAmount}</div>
              <div className="text-sm text-gray-600 mb-4">Matches ESA amount exactly</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span>${(inputs.esaAmount * inputs.studentCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span className={`${(inputs.esaAmount * inputs.studentCount) - totalCosts > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${((inputs.esaAmount * inputs.studentCount) - totalCosts).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-600">✨ Families pay $0 out of pocket</div>
            </div>

            {/* Market-Competitive Scenario */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-3">Market-Competitive</h4>
              <div className="text-2xl font-bold text-gray-900 mb-2">$750</div>
              <div className="text-sm text-gray-600 mb-4">Average microschool rate</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span>${(750 * inputs.studentCount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span className={`${(750 * inputs.studentCount) - totalCosts > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${((750 * inputs.studentCount) - totalCosts).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-600">📊 Market-aligned pricing</div>
            </div>
          </div>

          {/* Recommended Strategy */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommended Strategy</h3>
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Set tuition at $750/month (Market Rate)</h4>
                  <p className="text-gray-700 mb-4">
                    This balances sustainability with accessibility. ESA families pay only $167/month out of pocket, 
                    while you maintain healthy {Math.round(((750 * inputs.studentCount - totalCosts) / (750 * inputs.studentCount)) * 100)}% margins.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Monthly Revenue</div>
                      <div className="font-bold text-green-600">${(750 * inputs.studentCount).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Monthly Profit</div>
                      <div className="font-bold text-green-600">${((750 * inputs.studentCount) - totalCosts).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Days Cash Added</div>
                      <div className="font-bold text-green-600">{Math.round(((750 - inputs.currentTuition) * inputs.studentCount) / (totalCosts / 30))}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Analysis Tab */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Competitive Landscape */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Competitive Landscape</h3>
            <div className="table-scroll">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">School</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Tuition</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Students</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-4 text-sm text-gray-900">Learning Lab Academy</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Microschool</td>
                    <td className="py-2 px-4 text-sm font-medium">$675</td>
                    <td className="py-2 px-4 text-sm text-gray-600">25</td>
                    <td className="py-2 px-4 text-sm text-gray-600">2.1 mi</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm text-gray-900">Bright Minds Micro</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Microschool</td>
                    <td className="py-2 px-4 text-sm font-medium">$750</td>
                    <td className="py-2 px-4 text-sm text-gray-600">32</td>
                    <td className="py-2 px-4 text-sm text-gray-600">3.8 mi</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm text-gray-900">Future Leaders School</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Microschool</td>
                    <td className="py-2 px-4 text-sm font-medium">$825</td>
                    <td className="py-2 px-4 text-sm text-gray-600">28</td>
                    <td className="py-2 px-4 text-sm text-gray-600">1.5 mi</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="py-2 px-4 text-sm font-bold text-gray-900">Your School</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Microschool</td>
                    <td className="py-2 px-4 text-sm font-bold">${inputs.currentTuition}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">{inputs.studentCount}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm text-gray-900">St. Mary Catholic</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Private School</td>
                    <td className="py-2 px-4 text-sm font-medium">$1,200</td>
                    <td className="py-2 px-4 text-sm text-gray-600">450</td>
                    <td className="py-2 px-4 text-sm text-gray-600">2.8 mi</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm text-gray-900">Sunshine Prep Academy</td>
                    <td className="py-2 px-4 text-sm text-gray-600">Private School</td>
                    <td className="py-2 px-4 text-sm font-medium">$1,450</td>
                    <td className="py-2 px-4 text-sm text-gray-600">320</td>
                    <td className="py-2 px-4 text-sm text-gray-600">4.2 mi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Positioning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Microschool Market
              </h4>
              <div className="text-2xl font-bold text-blue-600">$750</div>
              <div className="text-sm text-gray-600">Average rate</div>
              <div className="text-xs text-gray-500 mt-2">Range: $625 - $875</div>
              <div className="mt-3 text-xs">
                You're <strong>${Math.abs(750 - inputs.currentTuition)}</strong> {inputs.currentTuition < 750 ? 'below' : 'above'} average
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600" />
                Private Schools
              </h4>
              <div className="text-2xl font-bold text-purple-600">$1,325</div>
              <div className="text-sm text-gray-600">Average rate</div>
              <div className="text-xs text-gray-500 mt-2">Traditional schools</div>
              <div className="mt-3 text-xs">
                Families save <strong>${(1325 - sustainableTuition) * 12}</strong> annually with your school
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" />
                ESA Value Proposition
              </h4>
              <div className="text-2xl font-bold text-green-600">
                {sustainableTuition <= inputs.esaAmount ? '100%' : Math.round((inputs.esaAmount / sustainableTuition) * 100) + '%'}
              </div>
              <div className="text-sm text-gray-600">ESA coverage</div>
              <div className="text-xs text-gray-500 mt-2">
                {sustainableTuition <= inputs.esaAmount ? 'Fully covered by ESA' : `ESA + $${sustainableTuition - inputs.esaAmount}/month family cost`}
              </div>
            </div>
          </div>

          {/* Cost Structure Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Structure Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Facility', amount: inputs.facilityCost, target: 0.20 },
                { label: 'Payroll', amount: inputs.payrollCost, target: 0.45 },
                { label: 'Owner Salary', amount: inputs.ownerSalary, target: 0.15 },
                { label: 'Other', amount: inputs.otherExpenses, target: 0.20 }
              ].map((item, index) => {
                const percentage = item.amount / totalCosts;
                const isOptimal = percentage <= item.target;
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${isOptimal ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    <div className="text-lg font-bold text-gray-900">${item.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{Math.round(percentage * 100)}% of total</div>
                    <div className={`text-xs mt-1 ${isOptimal ? 'text-green-600' : 'text-red-600'}`}>
                      Target: ≤{Math.round(item.target * 100)}% {isOptimal ? '✓' : '⚠️'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="font-medium text-yellow-900 mb-2">💡 Key Insight</h5>
              <p className="text-yellow-800 text-sm">
                Your facility costs ({Math.round((inputs.facilityCost / totalCosts) * 100)}%) are above the 20% target. 
                Each $100 reduction in rent adds $1,200 to annual profit and {Math.round(100 / (totalCosts / 30))} days of cash runway.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;