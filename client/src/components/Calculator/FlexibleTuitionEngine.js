import React, { useState } from 'react';
import { 
  CalculatorIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const FlexibleTuitionEngine = () => {
  const [inputs, setInputs] = useState({
    // Program Structure
    programType: 'full_time',
    programSchedule: {
      daysPerWeek: 5,
      hoursPerDay: 6,
      weeksPerYear: 36
    },
    
    // Current Situation
    studentCount: 28,
    currentTuition: 667, // $8000 annual / 12 months
    targetStudentCount: 35,
    
    // Location & Funding
    state: 'Florida',
    fundingOptions: {
      hasESA: true,
      hasVouchers: false,
      hasTaxCredits: false,
      primaryFunding: 'esa'
    },
    publicFunding: {
      annualAmount: 8000,
      monthlyEquivalent: 667,
      eligibleStudents: 18,
      programName: 'Florida ESA'
    },
    
    // Operating Costs
    facilityCost: 4500,
    payrollCost: 8500,
    ownerSalary: 4166,
    otherExpenses: 2000,
    operatingMargin: 0.15
  });

  const [activeTab, setActiveTab] = useState('program');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInputs(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value
        }
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        [field]: typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value
      }));
    }
  };

  const getStatePrograms = (state) => {
    const programs = {
      'Florida': [
        { type: 'esa', name: 'Florida ESA', amount: 8000, description: 'Education Savings Account' },
        { type: 'voucher', name: 'Step Up Scholarships', amount: 7500, description: 'Need-based voucher' }
      ],
      'Arizona': [
        { type: 'esa', name: 'Arizona ESA', amount: 7500, description: 'Universal ESA Program' },
        { type: 'tax_credit', name: 'Tax Credit Scholarships', amount: 4500, description: 'Donation-based credits' }
      ],
      'Texas': [
        { type: 'voucher', name: 'Private School Choice', amount: 8000, description: 'School choice voucher' }
      ],
      'North Carolina': [
        { type: 'voucher', name: 'Opportunity Scholarship', amount: 6000, description: 'Income-based voucher' }
      ],
      'Indiana': [
        { type: 'voucher', name: 'Choice Scholarship', amount: 5500, description: 'Income-based voucher' },
        { type: 'tax_credit', name: 'Tax Credit Scholarship', amount: 1000, description: 'Donation-based' }
      ],
      'None': [
        { type: 'private_pay', name: 'Private Pay Only', amount: 0, description: 'No public funding available' }
      ]
    };
    return programs[state] || programs['None'];
  };

  const getProgramTypeDescription = (type) => {
    const descriptions = {
      full_time: 'Traditional microschool (5 days/week, full curriculum)',
      part_time: 'Hybrid program (2-4 days/week, supplemental)',
      tutoring: 'Learning center (hourly or group sessions)',
      afterschool: 'Extended day program (after traditional school)',
      summer_program: 'Seasonal intensive program',
      homeschool_coop: 'Parent-led cooperative learning'
    };
    return descriptions[type] || 'Custom program structure';
  };

  // Calculate key metrics
  const totalCosts = inputs.facilityCost + inputs.payrollCost + inputs.ownerSalary + inputs.otherExpenses;
  const costPerStudent = Math.round(totalCosts / inputs.studentCount);
  const sustainableTuition = Math.round(costPerStudent * (1 + inputs.operatingMargin));
  const currentRevenue = inputs.studentCount * inputs.currentTuition;
  const currentProfit = currentRevenue - totalCosts;

  // Program-specific calculations
  const programMetrics = {
    full_time: {
      costPerStudent: costPerStudent,
      marketAverage: 750,
      targetMargin: 0.15
    },
    part_time: {
      costPerDay: Math.round(costPerStudent / inputs.programSchedule.daysPerWeek),
      marketAverage: 425,
      targetMargin: 0.20
    },
    tutoring: {
      costPerHour: Math.round(totalCosts / (inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay * 4.33)),
      marketAverage: 65,
      targetMargin: 0.25
    },
    afterschool: {
      costPerStudent: Math.round(totalCosts / (inputs.studentCount * 1.2)), // Higher capacity
      marketAverage: 350,
      targetMargin: 0.18
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <CalculatorIcon className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flexible Tuition Engine</h1>
            <p className="text-gray-600">Optimized for all education programs - microschools, tutoring centers, afterschool programs, and more</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('program')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'program'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Program Setup
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'funding'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Funding & State Programs
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pricing'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pricing Analysis
          </button>
        </nav>
      </div>

      {/* Program Setup Tab */}
      {activeTab === 'program' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Program Type Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Program Type & Structure
              </h3>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Type</label>
                  <select
                    value={inputs.programType}
                    onChange={(e) => handleInputChange('programType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="full_time">Full-Time Microschool</option>
                    <option value="part_time">Part-Time/Hybrid Program</option>
                    <option value="tutoring">Tutoring Center</option>
                    <option value="afterschool">Afterschool Program</option>
                    <option value="summer_program">Summer Program</option>
                    <option value="homeschool_coop">Homeschool Co-op</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    {getProgramTypeDescription(inputs.programType)}
                  </div>
                </div>
              </div>
              
              {/* Schedule Configuration */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days per Week</label>
                  <select
                    value={inputs.programSchedule.daysPerWeek}
                    onChange={(e) => handleInputChange('programSchedule.daysPerWeek', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours per Day</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={inputs.programSchedule.hoursPerDay}
                    onChange={(e) => handleInputChange('programSchedule.hoursPerDay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weeks per Year</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={inputs.programSchedule.weeksPerYear}
                    onChange={(e) => handleInputChange('programSchedule.weeksPerYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Program Intensity:</strong> {inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay} hours/week
                  • <strong>Annual Hours:</strong> {inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay * inputs.programSchedule.weeksPerYear} total
                </div>
              </div>
            </div>

            {/* Current Situation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Current Enrollment & Pricing
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Monthly Rate</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operating Margin</label>
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
          </div>

          {/* Results Preview */}
          <div className="space-y-6">
            {/* Program Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Program Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay}
                  </div>
                  <div className="text-sm text-blue-700">Hours per Week</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(totalCosts / (inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay * 4.33))}
                  </div>
                  <div className="text-sm text-green-700">Cost per Hour</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per Student:</span>
                  <span className="font-medium">${costPerStudent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sustainable Rate:</span>
                  <span className="font-medium text-green-600">${sustainableTuition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Profit:</span>
                  <span className={`font-medium ${currentProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${currentProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Market Position</h3>
              
              <div className="space-y-4">
                {inputs.programType === 'full_time' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Microschool Average:</span>
                      <span className="font-medium">$750/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Rate:</span>
                      <span className="font-medium">${inputs.currentTuition}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difference:</span>
                      <span className={`font-medium ${inputs.currentTuition < 750 ? 'text-red-600' : 'text-green-600'}`}>
                        {inputs.currentTuition < 750 ? '-' : '+'}${Math.abs(750 - inputs.currentTuition)}
                      </span>
                    </div>
                  </>
                )}

                {inputs.programType === 'tutoring' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tutoring Center Average:</span>
                      <span className="font-medium">$65/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Hourly Rate:</span>
                      <span className="font-medium">
                        ${Math.round(inputs.currentTuition / (inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay))}
                      </span>
                    </div>
                  </>
                )}

                {inputs.programType === 'afterschool' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Afterschool Average:</span>
                      <span className="font-medium">$350/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Rate:</span>
                      <span className="font-medium">${inputs.currentTuition}/month</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funding & State Programs Tab */}
      {activeTab === 'funding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* State Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Location & Available Programs
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={inputs.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Florida">Florida</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Texas">Texas</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="Indiana">Indiana</option>
                  <option value="None">No Public Funding Available</option>
                </select>
              </div>

              {/* Available Programs for State */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Available Funding Programs:</h4>
                {getStatePrograms(inputs.state).map((program, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="fundingProgram"
                          checked={inputs.publicFunding.programName === program.name}
                          onChange={() => {
                            handleInputChange('publicFunding.programName', program.name);
                            handleInputChange('publicFunding.annualAmount', program.amount);
                            handleInputChange('publicFunding.monthlyEquivalent', Math.round(program.amount / 12));
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900">{program.name}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        ${program.amount > 0 ? `${program.amount.toLocaleString()}/year` : 'Private Pay'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{program.description}</div>
                    {program.amount > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Monthly equivalent: ${Math.round(program.amount / 12)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Funding Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Students</label>
                  <input
                    type="number"
                    max={inputs.studentCount}
                    value={inputs.publicFunding.eligibleStudents}
                    onChange={(e) => handleInputChange('publicFunding.eligibleStudents', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Rate</label>
                  <div className="text-lg font-bold text-gray-900 py-2">
                    {Math.round((inputs.publicFunding.eligibleStudents / inputs.studentCount) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Monthly Public Funding:</strong> ${(inputs.publicFunding.eligibleStudents * inputs.publicFunding.monthlyEquivalent).toLocaleString()}
                  <br />
                  <strong>Private Pay Revenue:</strong> ${((inputs.studentCount - inputs.publicFunding.eligibleStudents) * inputs.currentTuition).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Funding Strategy Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Optimal Pricing Strategy</h3>
              
              {inputs.publicFunding.annualAmount > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-900 mb-2">Public Funding Strategy</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <div><strong>Set tuition at:</strong> ${inputs.publicFunding.monthlyEquivalent}/month</div>
                      <div><strong>Family contribution:</strong> $0 out-of-pocket</div>
                      <div><strong>Marketing message:</strong> "Fully covered by {inputs.publicFunding.programName}"</div>
                      <div><strong>Retention benefit:</strong> 90%+ retention rate for funded families</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-900 mb-2">Mixed Strategy Alternative</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div><strong>Set tuition at:</strong> ${sustainableTuition}/month</div>
                      <div><strong>Funded families pay:</strong> {inputs.publicFunding.programName} + ${Math.max(0, sustainableTuition - inputs.publicFunding.monthlyEquivalent)}</div>
                      <div><strong>Private families pay:</strong> ${sustainableTuition}/month</div>
                      <div><strong>Benefit:</strong> Higher margins, sustainable operations</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2">Private Pay Strategy</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div><strong>Recommended rate:</strong> ${sustainableTuition}/month</div>
                    <div><strong>Market position:</strong> Competitive pricing</div>
                    <div><strong>Value proposition:</strong> Quality education at fair price</div>
                    <div><strong>Flexibility:</strong> No compliance restrictions</div>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Requirements */}
            {inputs.publicFunding.annualAmount > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Compliance Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {inputs.publicFunding.programName} vendor approval required
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Quarterly expense reporting and documentation
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Annual compliance audit
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Approved educational expense categories only
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Analysis Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Scenario Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Break-even */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <h4 className="font-semibold text-gray-900 mb-3">Break-even</h4>
              <div className="text-2xl font-bold text-gray-900 mb-2">${costPerStudent}</div>
              <div className="text-sm text-gray-600 mb-4">Minimum to cover costs</div>
              <div className="text-xs text-red-600">⚠️ No margin for emergencies</div>
            </div>

            {/* Public Funding Optimized */}
            {inputs.publicFunding.annualAmount > 0 && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-900 mb-3">Public Funding Optimized</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">${inputs.publicFunding.monthlyEquivalent}</div>
                <div className="text-sm text-gray-600 mb-4">Matches {inputs.publicFunding.programName}</div>
                <div className="text-xs text-blue-600">✨ $0 family contribution</div>
              </div>
            )}

            {/* Sustainable */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-3">Sustainable</h4>
              <div className="text-2xl font-bold text-gray-900 mb-2">${sustainableTuition}</div>
              <div className="text-sm text-gray-600 mb-4">{Math.round(inputs.operatingMargin * 100)}% operating margin</div>
              <div className="text-xs text-green-600">📊 Long-term viability</div>
            </div>
          </div>

          {/* Program-Specific Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Program-Specific Recommendations</h3>
            
            {inputs.programType === 'full_time' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Full-Time Microschool Strategy</div>
                  <div className="text-sm text-blue-800">
                    Position as premium alternative to public school with personalized attention and family involvement.
                  </div>
                </div>
              </div>
            )}

            {inputs.programType === 'part_time' && (
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">Part-Time/Hybrid Strategy</div>
                  <div className="text-sm text-purple-800">
                    Market to homeschool families needing structured learning {inputs.programSchedule.daysPerWeek} days/week. 
                    Price per day: ${Math.round(inputs.currentTuition / inputs.programSchedule.daysPerWeek)}
                  </div>
                </div>
              </div>
            )}

            {inputs.programType === 'tutoring' && (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Tutoring Center Strategy</div>
                  <div className="text-sm text-green-800">
                    Hourly rate: ${Math.round(inputs.currentTuition / (inputs.programSchedule.daysPerWeek * inputs.programSchedule.hoursPerDay))}/hour.
                    Consider group sessions to increase profitability.
                  </div>
                </div>
              </div>
            )}

            {inputs.programType === 'afterschool' && (
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-900">Afterschool Program Strategy</div>
                  <div className="text-sm text-orange-800">
                    Target working parents needing 3-6pm care. Include homework help, activities, and snacks in pricing.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleTuitionEngine;
