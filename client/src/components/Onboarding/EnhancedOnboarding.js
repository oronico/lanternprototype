import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Enhanced Onboarding - Captures Critical Business Setup
 * 
 * Required before school can use SchoolStack:
 * 1. Entity Type (LLC, C Corp, S Corp, 501c3)
 * 2. State Registration (EIN, State ID)
 * 3. Business Bank Account
 * 
 * This customizes the platform experience based on entity type
 */

const ENTITY_TYPES = [
  {
    value: 'llc',
    name: 'LLC (Limited Liability Company)',
    description: 'For-profit, simple structure, pass-through taxation',
    taxForms: ['1065 (Partnership)', 'Schedule K-1'],
    advantages: ['Simple setup', 'Flexible taxation', 'Limited liability'],
    considerations: ['Self-employment tax', 'Operating agreement required']
  },
  {
    value: 'scorp',
    name: 'S Corporation',
    description: 'For-profit, pass-through taxation, reasonable salary required',
    taxForms: ['1120-S', 'Schedule K-1', 'W-2 for owners'],
    advantages: ['Save on self-employment tax', 'Limited liability', 'Pass-through taxation'],
    considerations: ['Payroll required', 'More compliance', 'Ownership restrictions']
  },
  {
    value: 'ccorp',
    name: 'C Corporation',
    description: 'For-profit, double taxation, best for seeking investment',
    taxForms: ['1120', 'W-2 for owners'],
    advantages: ['Unlimited investors', 'Stock options', 'Attractive to VCs'],
    considerations: ['Double taxation', 'More complexity', 'Higher costs']
  },
  {
    value: '501c3',
    name: '501(c)(3) Nonprofit',
    description: 'Tax-exempt, mission-driven, can receive donations',
    taxForms: ['990', '990-EZ', '990-N'],
    advantages: ['Tax-exempt', 'Grant eligible', 'Donation deductibility'],
    considerations: ['No private profit', 'Board required', 'IRS compliance']
  }
];

export default function EnhancedOnboarding({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Entity, 2: Registration, 3: Banking, 4: Complete
  const [onboardingData, setOnboardingData] = useState({
    // Entity Information
    entityType: '',
    entityName: '',
    dbaName: '',
    stateOfIncorporation: '',
    dateIncorporated: '',
    
    // Tax IDs
    ein: '',
    stateBusinessId: '',
    
    // Registration Status
    hasEIN: false,
    hasStateRegistration: false,
    hasSalesTaxPermit: false,
    
    // Banking
    hasBankAccount: false,
    bankName: '',
    accountType: 'checking',
    routingNumber: '',
    accountNumberLast4: '',
    
    // 501c3 Specific
    irs501c3Determination: false,
    determinationLetterDate: '',
    
    // Additional Info
    fiscalYearEnd: '12-31', // Default to calendar year
    accountingMethod: 'cash', // Most small schools use cash basis
    numberOfFounders: 1,
    
    // Platform Setup
    primaryUseCase: '',
    currentStudentCount: '',
    projectedGrowth: ''
  });

  const handleInputChange = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntitySelect = (entityType) => {
    handleInputChange('entityType', entityType);
    
    analytics.trackFeatureUsage('onboarding', 'select_entity_type', {
      entityType: entityType
    });
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!onboardingData.entityType) {
          toast.error('Please select your entity type');
          return false;
        }
        if (!onboardingData.entityName) {
          toast.error('Please enter your legal entity name');
          return false;
        }
        return true;
      
      case 2:
        if (!onboardingData.hasEIN) {
          toast.error('EIN is required to use SchoolStack');
          return false;
        }
        if (!onboardingData.ein || onboardingData.ein.length !== 9) {
          toast.error('Please enter your 9-digit EIN');
          return false;
        }
        if (!onboardingData.hasStateRegistration) {
          toast.error('State business registration is required');
          return false;
        }
        return true;
      
      case 3:
        if (!onboardingData.hasBankAccount) {
          toast.error('Business bank account is required to use SchoolStack');
          return false;
        }
        if (!onboardingData.bankName) {
          toast.error('Please enter your bank name');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      
      analytics.trackFeatureUsage('onboarding', 'complete_step', {
        step: step,
        entityType: onboardingData.entityType
      });
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('entityType', onboardingData.entityType);
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('onboardingComplete', 'true');
    
    analytics.trackFeatureUsage('onboarding', 'complete', {
      entityType: onboardingData.entityType,
      hasEIN: true,
      hasBankAccount: true
    });
    
    if (onComplete) {
      onComplete(onboardingData);
    }
  };

  const selectedEntity = ENTITY_TYPES.find(e => e.value === onboardingData.entityType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SchoolStack.ai</h1>
          <p className="text-gray-600">Let's get your school set up properly</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Entity Type */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of entity is your school?</h2>
            <p className="text-gray-600 mb-6">This helps us customize tax filings, compliance, and reporting for you.</p>

            <div className="space-y-4 mb-6">
              {ENTITY_TYPES.map(entity => (
                <button
                  key={entity.value}
                  onClick={() => handleEntitySelect(entity.value)}
                  className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                    onboardingData.entityType === entity.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{entity.name}</div>
                      <div className="text-sm text-gray-600 mb-3">{entity.description}</div>
                    </div>
                    {onboardingData.entityType === entity.value && (
                      <CheckCircleIcon className="h-6 w-6 text-primary-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Tax Forms:</div>
                      <div className="text-gray-700">{entity.taxForms.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Key Benefits:</div>
                      <div className="text-gray-700">{entity.advantages[0]}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {onboardingData.entityType && (
              <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-primary-300">
                <h3 className="font-semibold text-blue-900">Legal Entity Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Entity Name *
                  </label>
                  <input
                    type="text"
                    value={onboardingData.entityName}
                    onChange={(e) => handleInputChange('entityName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Sunshine Learning LLC"
                  />
                  <p className="text-xs text-gray-500 mt-1">Exactly as it appears on your formation documents</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DBA / Operating Name (if different)
                  </label>
                  <input
                    type="text"
                    value={onboardingData.dbaName}
                    onChange={(e) => handleInputChange('dbaName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Sunshine Microschool"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State of Incorporation
                    </label>
                    <select
                      value={onboardingData.stateOfIncorporation}
                      onChange={(e) => handleInputChange('stateOfIncorporation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select state...</option>
                      <option value="FL">Florida</option>
                      <option value="TX">Texas</option>
                      <option value="CA">California</option>
                      <option value="AZ">Arizona</option>
                      <option value="NC">North Carolina</option>
                      {/* Add more states */}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Incorporated
                    </label>
                    <input
                      type="date"
                      value={onboardingData.dateIncorporated}
                      onChange={(e) => handleInputChange('dateIncorporated', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!onboardingData.entityType || !onboardingData.entityName}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              Continue to Registration
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Registration & Tax IDs */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Registration</h2>
            <p className="text-gray-600 mb-6">Your EIN and state registration are required to operate legally.</p>

            <div className="space-y-6">
              {/* EIN Requirement */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900 mb-1">EIN Required</div>
                    <div className="text-sm text-red-800">
                      You must have an Employer Identification Number (EIN) from the IRS to use SchoolStack.
                      This is required for payroll, taxes, and banking.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={onboardingData.hasEIN}
                    onChange={(e) => handleInputChange('hasEIN', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    I have an EIN from the IRS
                  </span>
                </label>

                {onboardingData.hasEIN && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer Identification Number (EIN) *
                    </label>
                    <input
                      type="text"
                      value={onboardingData.ein}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                        handleInputChange('ein', value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="XX-XXXXXXX"
                      maxLength="9"
                    />
                    <p className="text-xs text-gray-500 mt-1">9-digit number from IRS</p>
                  </div>
                )}
              </div>

              {!onboardingData.hasEIN && (
                <div className="p-4 bg-blue-50 border border-primary-300 rounded-lg">
                  <div className="font-medium text-blue-900 mb-2">Need an EIN?</div>
                  <div className="text-sm text-blue-800 mb-3">
                    You can apply for free at IRS.gov and receive it immediately online.
                  </div>
                  <a
                    href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Apply for EIN on IRS.gov
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </a>
                </div>
              )}

              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={onboardingData.hasStateRegistration}
                    onChange={(e) => handleInputChange('hasStateRegistration', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    I'm registered with my state (Secretary of State)
                  </span>
                </label>

                {onboardingData.hasStateRegistration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State Business ID / Registration Number
                    </label>
                    <input
                      type="text"
                      value={onboardingData.stateBusinessId}
                      onChange={(e) => handleInputChange('stateBusinessId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="L21000123456"
                    />
                  </div>
                )}
              </div>

              {/* 501c3 Specific */}
              {onboardingData.entityType === '501c3' && (
                <div>
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={onboardingData.irs501c3Determination}
                      onChange={(e) => handleInputChange('irs501c3Determination', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      I have IRS 501(c)(3) determination letter
                    </span>
                  </label>

                  {onboardingData.irs501c3Determination && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Determination Letter Date
                      </label>
                      <input
                        type="date"
                        value={onboardingData.determinationLetterDate}
                        onChange={(e) => handleInputChange('determinationLetterDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={onboardingData.hasSalesTaxPermit}
                    onChange={(e) => handleInputChange('hasSalesTaxPermit', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    I have a sales tax permit (if required in my state)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!onboardingData.hasEIN || !onboardingData.ein || !onboardingData.hasStateRegistration}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                Continue to Banking
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Business Bank Account */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Bank Account</h2>
            <p className="text-gray-600 mb-6">A dedicated business bank account is required for SchoolStack to track your finances properly.</p>

            <div className="space-y-6">
              {/* Bank Account Requirement */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900 mb-1">Business Bank Account Required</div>
                    <div className="text-sm text-red-800">
                      You must have a separate business bank account (not personal) to use SchoolStack.
                      This is essential for proper bookkeeping, tax compliance, and financial tracking.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={onboardingData.hasBankAccount}
                    onChange={(e) => handleInputChange('hasBankAccount', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    I have a business bank account in my school's legal name
                  </span>
                </label>

                {onboardingData.hasBankAccount && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={onboardingData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Chase Bank"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <select
                        value={onboardingData.accountType}
                        onChange={(e) => handleInputChange('accountType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="checking">Business Checking</option>
                        <option value="savings">Business Savings</option>
                      </select>
                    </div>

                    <div className="p-4 bg-green-50 border border-success-300 rounded-lg">
                      <div className="flex items-start gap-2">
                        <InformationCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                          You'll connect this account via Plaid in the next step for automatic transaction syncing.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!onboardingData.hasBankAccount && (
                <div className="p-4 bg-blue-50 border border-primary-300 rounded-lg">
                  <div className="font-medium text-blue-900 mb-2">Need a Business Bank Account?</div>
                  <div className="text-sm text-blue-800 mb-3">
                    We recommend these banks for small schools:
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>• Chase Business Checking (free for nonprofits)</li>
                    <li>• Bank of America Business Advantage</li>
                    <li>• Local credit unions (often best rates)</li>
                    <li>• Mercury (online business banking)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!onboardingData.hasBankAccount || !onboardingData.bankName}
                className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                Continue to Summary
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Completion */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
              <p className="text-gray-600">Review your information below</p>
            </div>

            <div className="space-y-6">
              {/* Entity Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Entity Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entity Type:</span>
                    <span className="font-medium">{selectedEntity?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Legal Name:</span>
                    <span className="font-medium">{onboardingData.entityName}</span>
                  </div>
                  {onboardingData.dbaName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">DBA:</span>
                      <span className="font-medium">{onboardingData.dbaName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{onboardingData.stateOfIncorporation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EIN:</span>
                    <span className="font-medium">XX-XXX{onboardingData.ein.slice(-4)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Forms You'll Need */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Tax Forms for {selectedEntity?.name}</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  {selectedEntity?.taxForms.map((form, idx) => (
                    <div key={idx}>• {form}</div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  SchoolStack will help you track and prepare these forms.
                </div>
              </div>

              {/* Banking Confirmed */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Banking Setup</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Bank:</span>
                    <span className="font-medium text-green-900">{onboardingData.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Account Type:</span>
                    <span className="font-medium text-green-900">Business {onboardingData.accountType}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full mt-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-lg"
            >
              Start Using SchoolStack! 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

