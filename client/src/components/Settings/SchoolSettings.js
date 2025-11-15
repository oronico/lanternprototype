import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import BusinessBasicsChecklist from './BusinessBasicsChecklist';

const SchoolSettings = () => {
  const [schoolData, setSchoolData] = useState({
    // Basic Information
    schoolName: '',
    state: 'Florida',
    zipCode: '',
    programType: 'full_time',
    
    // Current Operations
    currentStudents: '',
    targetStudents: '',
    gradeRange: '',
    operatingDays: 5,
    hoursPerDay: 6,
    weeksPerYear: 36,
    
    // Revenue & Pricing
    currentMonthlyTuition: '',
    esaEligibleStudents: '',
    esaMonthlyAmount: '',
    esaProgramName: '',
    averageMonthlyRevenue: '',
    
    // Operating Costs (Monthly)
    facilityRent: '',
    camCharges: '',
    propertyTaxes: '',
    facilityCost: '',
    staffPayroll: '',
    ownerSalary: '',
    utilitiesCost: '',
    insuranceCost: '',
    suppliesCost: '',
    marketingCost: '',
    otherExpenses: '',
    
    // Financial Position
    currentCashBalance: '',
    savingsBalance: '',
    outstandingDebt: '',
    monthlyDebtPayment: '',
    creditCardBalances: '',
    creditLimits: '',
    
    // Performance Metrics (User Tracked)
    studentsEnrolledThisYear: '',
    studentsLeftThisYear: '',
    studentsReturningNextYear: '',
    staffCount: '',
    staffTurnoverThisYear: '',
    
    // Payment Patterns
    familiesPaidOnTime: '',
    familiesLateOnPayment: '',
    averageDaysLate: '',
    autoPayEnabled: false,
    
    // Dates & Contracts
    leaseStartDate: '',
    leaseEndDate: '',
    insuranceRenewalDate: '',
    academicYearStart: '',
    academicYearEnd: ''
  });

  const [activeSection, setActiveSection] = useState('basic');
  const [completionStatus, setCompletionStatus] = useState({});
  const [saveStatus, setSaveStatus] = useState('unsaved');

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('schoolSettings');
    if (savedData) {
      setSchoolData(JSON.parse(savedData));
    }
    calculateCompletion();
  }, [schoolData]);

  const calculateCompletion = () => {
    const sections = {
      basic: ['schoolName', 'state', 'currentStudents'].every(field => schoolData[field]),
      revenue: ['currentMonthlyTuition', 'averageMonthlyRevenue'].every(field => schoolData[field]),
      costs: ['facilityRent', 'staffPayroll', 'ownerSalary'].every(field => schoolData[field]),
      financial: ['currentCashBalance', 'outstandingDebt'].every(field => schoolData[field]),
      performance: ['studentsEnrolledThisYear', 'familiesPaidOnTime'].every(field => schoolData[field])
    };
    setCompletionStatus(sections);
  };

  const handleInputChange = (field, value) => {
    setSchoolData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveStatus('unsaved');
  };

  const handleSave = () => {
    localStorage.setItem('schoolSettings', JSON.stringify(schoolData));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('unsaved'), 2000);
  };

  const calculateTotalMonthlyCosts = () => {
    const costs = [
      'facilityRent', 'camCharges', 'propertyTaxes',
      'staffPayroll', 'ownerSalary', 'utilitiesCost',
      'insuranceCost', 'suppliesCost', 'marketingCost', 'otherExpenses'
    ];
    return costs.reduce((sum, field) => sum + (parseFloat(schoolData[field]) || 0), 0);
  };

  const calculateRetentionRate = () => {
    const enrolled = parseInt(schoolData.studentsEnrolledThisYear) || 0;
    const left = parseInt(schoolData.studentsLeftThisYear) || 0;
    if (enrolled === 0) return 0;
    return Math.round(((enrolled - left) / enrolled) * 100);
  };

  const getCompletionColor = (isComplete) => {
    return isComplete ? 'text-green-600' : 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your School Information</h1>
              <p className="text-gray-600">Enter your actual data for personalized analysis and recommendations</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-medium ${
              saveStatus === 'saved'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saveStatus === 'saved' ? (
              <>
                <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                Saved!
              </>
            ) : (
              'Save My Information'
            )}
          </button>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm text-gray-600">
            {Object.values(completionStatus).filter(Boolean).length} / 5 sections complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.values(completionStatus).filter(Boolean).length / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: 'basics', label: 'Business Basics', icon: CheckCircleIcon },
          { id: 'basic', label: 'Basic Info', icon: BuildingOfficeIcon },
          { id: 'revenue', label: 'Revenue & Students', icon: UserGroupIcon },
          { id: 'costs', label: 'Operating Costs', icon: CurrencyDollarIcon },
          { id: 'financial', label: 'Financial Position', icon: BanknotesIcon },
          { id: 'performance', label: 'Performance Data', icon: AcademicCapIcon }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${
              activeSection === section.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {React.createElement(section.icon, { className: `h-4 w-4 mr-2 ${getCompletionColor(completionStatus[section.id])}` })}
            {section.label}
            {completionStatus[section.id] && (
              <CheckCircleIcon className="h-4 w-4 ml-2 text-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* Business Basics Checklist */}
      {activeSection === 'basics' && (
        <BusinessBasicsChecklist />
      )}

      {/* Basic Information */}
      {activeSection === 'basic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic School Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
                <input
                  type="text"
                  value={schoolData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sunshine Microschool"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  value={schoolData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Florida">Florida</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Texas">Texas</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Other">Other State</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={schoolData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="33xxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Type *</label>
                <select
                  value={schoolData.programType}
                  onChange={(e) => handleInputChange('programType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full_time">Full-Time Microschool</option>
                  <option value="part_time">Part-Time/Hybrid Program</option>
                  <option value="tutoring">Tutoring Center</option>
                  <option value="afterschool">Afterschool Program</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Students *</label>
                <input
                  type="number"
                  value={schoolData.currentStudents}
                  onChange={(e) => handleInputChange('currentStudents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="28"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Students</label>
                <input
                  type="number"
                  value={schoolData.targetStudents}
                  onChange={(e) => handleInputChange('targetStudents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="35"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Range</label>
                <input
                  type="text"
                  value={schoolData.gradeRange}
                  onChange={(e) => handleInputChange('gradeRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="K-8"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue & Students */}
      {activeSection === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Enrollment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Monthly Tuition (per student) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.currentMonthlyTuition}
                    onChange={(e) => handleInputChange('currentMonthlyTuition', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="667"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Monthly Revenue *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.averageMonthlyRevenue}
                    onChange={(e) => handleInputChange('averageMonthlyRevenue', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="16324"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Calculated: ${(parseInt(schoolData.currentStudents) || 0) * (parseInt(schoolData.currentMonthlyTuition) || 0)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ESA/Voucher Eligible Students</label>
                <input
                  type="number"
                  value={schoolData.esaEligibleStudents}
                  onChange={(e) => handleInputChange('esaEligibleStudents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="18"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {schoolData.currentStudents && schoolData.esaEligibleStudents && (
                    `${Math.round((parseInt(schoolData.esaEligibleStudents) / parseInt(schoolData.currentStudents)) * 100)}% of students`
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ESA/Voucher Monthly Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.esaMonthlyAmount}
                    onChange={(e) => handleInputChange('esaMonthlyAmount', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="667"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Annual equivalent: ${(parseInt(schoolData.esaMonthlyAmount) || 0) * 12}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">ESA/Voucher Program Name</label>
                <input
                  type="text"
                  value={schoolData.esaProgramName}
                  onChange={(e) => handleInputChange('esaProgramName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Florida ESA, Step Up, etc."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Costs */}
      {activeSection === 'costs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Operating Costs</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your actual monthly expenses</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facility Costs */}
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-3">Facility Costs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Base Rent *</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.facilityRent}
                        onChange={(e) => handleInputChange('facilityRent', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="3500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CAM Charges</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.camCharges}
                        onChange={(e) => handleInputChange('camCharges', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Property Taxes</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.propertyTaxes}
                        onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Utilities</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.utilitiesCost}
                        onChange={(e) => handleInputChange('utilitiesCost', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personnel Costs */}
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-3">Personnel Costs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Staff Payroll *</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.staffPayroll}
                        onChange={(e) => handleInputChange('staffPayroll', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="8500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Owner Salary *</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={schoolData.ownerSalary}
                        onChange={(e) => handleInputChange('ownerSalary', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="4166"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Important: Pay yourself!</div>
                  </div>
                </div>
              </div>

              {/* Other Operating Costs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.insuranceCost}
                    onChange={(e) => handleInputChange('insuranceCost', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplies & Materials</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.suppliesCost}
                    onChange={(e) => handleInputChange('suppliesCost', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marketing</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.marketingCost}
                    onChange={(e) => handleInputChange('marketingCost', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.otherExpenses}
                    onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>
            
            {/* Total Calculation */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-primary-300">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">Total Monthly Operating Costs:</span>
                <span className="text-2xl font-bold text-blue-600">${calculateTotalMonthlyCosts().toLocaleString()}</span>
              </div>
              {schoolData.currentStudents && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-blue-700">Cost per Student:</span>
                  <span className="font-medium text-blue-800">
                    ${Math.round(calculateTotalMonthlyCosts() / parseInt(schoolData.currentStudents))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Financial Position */}
      {activeSection === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Financial Position</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Cash in Bank *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.currentCashBalance}
                    onChange={(e) => handleInputChange('currentCashBalance', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3247"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Savings/Reserve Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.savingsBalance}
                    onChange={(e) => handleInputChange('savingsBalance', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Outstanding Debt *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.outstandingDebt}
                    onChange={(e) => handleInputChange('outstandingDebt', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24500"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">Loans, credit cards, lines of credit</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Debt Payments</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={schoolData.monthlyDebtPayment}
                    onChange={(e) => handleInputChange('monthlyDebtPayment', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="925"
                  />
                </div>
              </div>
            </div>
            
            {/* Financial Health Preview */}
            {schoolData.currentCashBalance && calculateTotalMonthlyCosts() > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-medium text-yellow-900 mb-2">Days Cash on Hand</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {Math.round((parseInt(schoolData.currentCashBalance) + (parseInt(schoolData.savingsBalance) || 0)) / (calculateTotalMonthlyCosts() / 30))} days
                </div>
                <div className="text-sm text-yellow-800 mt-1">
                  {Math.round((parseInt(schoolData.currentCashBalance) + (parseInt(schoolData.savingsBalance) || 0)) / (calculateTotalMonthlyCosts() / 30)) < 30 
                    ? '⚠️ Below 30-day target' 
                    : '✓ Meets minimum standard'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student & Staff Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Students Enrolled This Year *</label>
                <input
                  type="number"
                  value={schoolData.studentsEnrolledThisYear}
                  onChange={(e) => handleInputChange('studentsEnrolledThisYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="32"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Students Who Left This Year</label>
                <input
                  type="number"
                  value={schoolData.studentsLeftThisYear}
                  onChange={(e) => handleInputChange('studentsLeftThisYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {schoolData.studentsEnrolledThisYear && schoolData.studentsLeftThisYear && (
                    `Retention rate: ${calculateRetentionRate()}% (Target: 85%)`
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Students Returning Next Year</label>
                <input
                  type="number"
                  value={schoolData.studentsReturningNextYear}
                  onChange={(e) => handleInputChange('studentsReturningNextYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Count</label>
                <input
                  type="number"
                  value={schoolData.staffCount}
                  onChange={(e) => handleInputChange('staffCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Families Paying On Time *</label>
                <input
                  type="number"
                  value={schoolData.familiesPaidOnTime}
                  onChange={(e) => handleInputChange('familiesPaidOnTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="23"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {schoolData.currentStudents && schoolData.familiesPaidOnTime && (
                    `Collection rate: ${Math.round((parseInt(schoolData.familiesPaidOnTime) / parseInt(schoolData.currentStudents)) * 100)}%`
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Families Late on Payment</label>
                <input
                  type="number"
                  value={schoolData.familiesLateOnPayment}
                  onChange={(e) => handleInputChange('familiesLateOnPayment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-primary-300">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Why We Need Your Actual Data</h4>
            <p className="text-sm text-blue-800">
              SchoolStack.ai analyzes YOUR specific situation - not generic examples. 
              The more accurate information you provide, the better our recommendations will be. 
              All data is encrypted and secure.
            </p>
            <div className="mt-3 text-xs text-blue-700">
              <strong>Fields marked with *</strong> are essential for basic analysis. 
              Complete all sections for comprehensive business intelligence.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettings;
