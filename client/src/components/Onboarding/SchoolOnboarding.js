import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  RocketLaunchIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarIcon,
  CloudArrowUpIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SchoolOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    // Stage Selection
    operatingStage: null, // 'year-0', 'year-1-2', 'year-3-plus'
    
    // Basic Info
    schoolName: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    currentEnrollment: 0,
    targetEnrollment: 0,
    
    // Financial Connections
    accountingSystem: null, // 'quickbooks', 'xero', 'wave', 'none'
    payrollSystem: null, // 'gusto', 'adp', 'quickbooks', 'other', 'none'
    bankingConnected: false,
    creditCardsConnected: false,
    
    // Historical Data
    hasPreviousYearData: false,
    previousYearPL: null,
    previousYearCashFlow: null,
    hasLoans: false,
    loanDetails: [],
    
    // Current Year Planning
    hasProforma: false,
    proformaData: null,
    enrollmentData: null
  });

  const stages = [
    {
      id: 'year-0',
      title: 'Year 0 - Pre-Launch',
      description: "I'm planning to launch my school",
      icon: RocketLaunchIcon,
      color: 'from-purple-500 to-pink-500',
      features: ['Fundraising tools', 'Startup budget planning', 'Enrollment projections']
    },
    {
      id: 'year-1-2',
      title: 'Years 1-2 - Building',
      description: "I've been operating 1-2 years",
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-cyan-500',
      features: ['Growth modeling', 'Cash flow management', 'Basic analytics']
    },
    {
      id: 'year-3-plus',
      title: 'Year 3+ - Scaling',
      description: "I've been operating 3+ years",
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      features: ['Advanced forecasting', 'Historical analysis', 'Multi-year trends']
    }
  ];

  const updateData = (field, value) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    // In production, this would upload to your backend
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Uploading file...',
        success: () => {
          updateData(field, file);
          return 'File uploaded successfully!';
        },
        error: 'Upload failed'
      }
    );
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateCurrentStep = () => {
    switch(step) {
      case 1:
        if (!onboardingData.operatingStage) {
          toast.error('Please select your operating stage');
          return false;
        }
        return true;
      case 2:
        if (!onboardingData.schoolName || !onboardingData.fiscalYearStart) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data to backend
      toast.success('Onboarding complete! Welcome to SchoolStack.ai 🎉');
      onComplete(onboardingData);
    } catch (error) {
      toast.error('Failed to save onboarding data');
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-primary-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SchoolStack.ai! 👋</h1>
              <p className="text-lg text-gray-600 mb-8">Let's get your financial command center set up. First, where are you in your journey?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages.map((stage) => {
                  const Icon = stage.icon;
                  const isSelected = onboardingData.operatingStage === stage.id;
                  
                  return (
                    <button
                      key={stage.id}
                      onClick={() => updateData('operatingStage', stage.id)}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      )}
                      
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stage.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2">{stage.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{stage.description}</p>
                      
                      <div className="space-y-1">
                        {stage.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-500">
                            <CheckCircleIcon className="h-3 w-3 mr-1 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">School Basics</h2>
              <p className="text-gray-600 mb-6">Tell us about your school</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.schoolName}
                    onChange={(e) => updateData('schoolName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Acme Learning Lab"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      Fiscal Year Start *
                    </label>
                    <input
                      type="date"
                      value={onboardingData.fiscalYearStart}
                      onChange={(e) => updateData('fiscalYearStart', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      Fiscal Year End *
                    </label>
                    <input
                      type="date"
                      value={onboardingData.fiscalYearEnd}
                      onChange={(e) => updateData('fiscalYearEnd', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Enrollment
                    </label>
                    <input
                      type="number"
                      value={onboardingData.currentEnrollment}
                      onChange={(e) => updateData('currentEnrollment', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Enrollment
                    </label>
                    <input
                      type="number"
                      value={onboardingData.targetEnrollment}
                      onChange={(e) => updateData('targetEnrollment', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="32"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Systems</h2>
              <p className="text-gray-600 mb-6">Link your financial tools for automatic data sync (optional but recommended)</p>
              
              <div className="space-y-4">
                {/* Accounting System */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-900">Accounting System</span>
                    </div>
                    {onboardingData.accountingSystem && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['QuickBooks', 'Xero', 'Wave', 'None'].map((system) => (
                      <button
                        key={system}
                        onClick={() => updateData('accountingSystem', system.toLowerCase())}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          onboardingData.accountingSystem === system.toLowerCase()
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-gray-300 text-gray-700 hover:border-primary-300'
                        }`}
                      >
                        {system}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payroll System */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-900">Payroll System</span>
                    </div>
                    {onboardingData.payrollSystem && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {['Gusto', 'ADP', 'QuickBooks', 'Other', 'None'].map((system) => (
                      <button
                        key={system}
                        onClick={() => updateData('payrollSystem', system.toLowerCase())}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          onboardingData.payrollSystem === system.toLowerCase()
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-gray-300 text-gray-700 hover:border-primary-300'
                        }`}
                      >
                        {system}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banking & Cards */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <LinkIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-900">Bank Accounts & Credit Cards</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateData('bankingConnected', !onboardingData.bankingConnected)}
                      className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                        onboardingData.bankingConnected
                          ? 'bg-green-50 border-green-500'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Connect Bank Account via Plaid</span>
                        {onboardingData.bankingConnected ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => updateData('creditCardsConnected', !onboardingData.creditCardsConnected)}
                      className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                        onboardingData.creditCardsConnected
                          ? 'bg-green-50 border-green-500'
                          : 'border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Connect Credit Cards</span>
                        {onboardingData.creditCardsConnected ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (onboardingData.operatingStage === 'year-1-2' || onboardingData.operatingStage === 'year-3-plus') && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Historical Financial Data</h2>
              <p className="text-gray-600 mb-6">Upload your previous year's financials to improve forecasting accuracy</p>
              
              <div className="space-y-6">
                {/* Previous Year P&L */}
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-all">
                  <div className="text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Previous Year P&L</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload last year's Profit & Loss statement</p>
                    
                    <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Choose File (CSV, Excel, PDF)
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv,.xlsx,.xls,.pdf"
                        onChange={(e) => handleFileUpload('previousYearPL', e.target.files[0])}
                      />
                    </label>
                    
                    {onboardingData.previousYearPL && (
                      <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {onboardingData.previousYearPL.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Previous Year Cash Flow */}
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-all">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Previous Year Cash Flow</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload cash flow actuals for trend analysis</p>
                    
                    <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Choose File (CSV, Excel, PDF)
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv,.xlsx,.xls,.pdf"
                        onChange={(e) => handleFileUpload('previousYearCashFlow', e.target.files[0])}
                      />
                    </label>
                    
                    {onboardingData.previousYearCashFlow && (
                      <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {onboardingData.previousYearCashFlow.name}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => updateData('hasPreviousYearData', false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Skip - I don't have this data yet
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loans & Debt</h2>
              <p className="text-gray-600 mb-6">Help us track your obligations and calculate your debt service coverage</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateData('hasLoans', true)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      onboardingData.hasLoans
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-medium">Yes, I have loans</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => updateData('hasLoans', false)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      onboardingData.hasLoans === false
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-medium">No loans</div>
                    </div>
                  </button>
                </div>

                {onboardingData.hasLoans && (
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Add Loan Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>Equipment Loan</option>
                            <option>Line of Credit</option>
                            <option>SBA Loan</option>
                            <option>Personal Loan</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Principal Balance</label>
                          <input type="number" placeholder="24500" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
                          <input type="number" placeholder="1850" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                          <input type="number" step="0.1" placeholder="6.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium">
                        + Add Another Loan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Year Proforma</h2>
              <p className="text-gray-600 mb-6">Upload your budget/proforma for the current year</p>
              
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-all">
                  <div className="text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Current Year Budget</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload your proforma or budget for this fiscal year</p>
                    
                    <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Choose File (CSV, Excel, PDF)
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv,.xlsx,.xls,.pdf"
                        onChange={(e) => handleFileUpload('proformaData', e.target.files[0])}
                      />
                    </label>
                    
                    {onboardingData.proformaData && (
                      <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {onboardingData.proformaData.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-all">
                  <div className="text-center">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Enrollment Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload current enrollment roster (optional)</p>
                    
                    <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                      <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                      Choose CSV File
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv"
                        onChange={(e) => handleFileUpload('enrollmentData', e.target.files[0])}
                      />
                    </label>
                    
                    {onboardingData.enrollmentData && (
                      <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {onboardingData.enrollmentData.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>You're all set!</strong> We'll use this data to create personalized forecasts, identify opportunities, and guide you toward financial health.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Continue
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg font-medium transition-all"
              >
                Complete Setup 🎉
                <CheckCircleIcon className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboarding;

