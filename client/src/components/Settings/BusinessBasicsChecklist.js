import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const BusinessBasicsChecklist = () => {
  const [checklist, setChecklist] = useState({
    // Legal Structure
    hasEIN: false,
    businessStructure: '', // LLC, nonprofit, sole_proprietor
    hasBusinessLicense: false,
    hasStateLicense: false,
    
    // Banking & Finance
    hasBusinessBankAccount: false,
    separateBusinessPersonal: false,
    hasBookkeepingSystem: false,
    
    // Insurance (Critical)
    hasGeneralLiability: false,
    hasProfessionalLiability: false,
    hasWorkersComp: false,
    hasPropertyInsurance: false,
    
    // Payroll & Employment
    hasPayrollSystem: false,
    w2EmployeesPaidThroughPayroll: false,
    contractors1099Properly: false,
    
    // Pricing & Revenue
    tuitionCoversAllCosts: false,
    marginForEmergencies: false,
    ownerTakingSalary: false,
    
    // Compliance
    ferpaCompliance: false,
    backgroundChecksComplete: false,
    stateReportingCurrent: false
  });

  const handleToggle = (field) => {
    setChecklist(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const checklistSections = [
    {
      id: 'legal',
      title: 'Legal Foundation',
      icon: DocumentTextIcon,
      description: 'Essential legal requirements for operating',
      items: [
        { 
          key: 'hasEIN', 
          label: 'EIN (Employer Identification Number)', 
          critical: true,
          help: 'Required for payroll, banking, and taxes. Get free from IRS.gov',
          priority: 1
        },
        { 
          key: 'businessStructure', 
          label: 'Business Entity (LLC or Nonprofit)', 
          critical: true,
          help: 'Protects personal assets. Choose LLC (for-profit) or 501(c)(3) (nonprofit)',
          priority: 1
        },
        { 
          key: 'hasBusinessLicense', 
          label: 'Business Operating License', 
          critical: true,
          help: 'City/county business license required to operate',
          priority: 1
        },
        { 
          key: 'hasStateLicense', 
          label: 'Educational License (if required)', 
          critical: false,
          help: 'Some states require private school license. Check your state requirements',
          priority: 2
        }
      ]
    },
    {
      id: 'banking',
      title: 'Banking & Finance',
      icon: BanknotesIcon,
      description: 'Separate business finances from personal',
      items: [
        { 
          key: 'hasBusinessBankAccount', 
          label: 'Dedicated Business Bank Account', 
          critical: true,
          help: 'REQUIRED: Never mix business and personal money. Opens with EIN',
          priority: 1
        },
        { 
          key: 'separateBusinessPersonal', 
          label: 'Business/Personal Finances Separated', 
          critical: true,
          help: 'All school income/expenses through business account only',
          priority: 1
        },
        { 
          key: 'hasBookkeepingSystem', 
          label: 'Bookkeeping System in Place', 
          critical: true,
          help: 'QuickBooks, Xero, or SchoolStack.ai to track all money',
          priority: 1
        }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance Coverage',
      icon: ShieldCheckIcon,
      description: 'Protect your school and personal assets',
      items: [
        { 
          key: 'hasGeneralLiability', 
          label: 'General Liability Insurance ($1M-2M)', 
          critical: true,
          help: 'REQUIRED: Protects against accidents, injuries. Typically $200-400/month',
          priority: 1
        },
        { 
          key: 'hasProfessionalLiability', 
          label: 'Professional/E&O Insurance', 
          critical: true,
          help: 'REQUIRED: Covers educational malpractice claims. ~$150-300/month',
          priority: 1
        },
        { 
          key: 'hasWorkersComp', 
          label: 'Workers Compensation (if employees)', 
          critical: true,
          help: 'STATE REQUIRED: Covers employee injuries. Cost based on payroll',
          priority: 1
        },
        { 
          key: 'hasPropertyInsurance', 
          label: 'Property/Contents Insurance', 
          critical: false,
          help: 'Covers equipment, supplies. Often required by lease',
          priority: 2
        }
      ]
    },
    {
      id: 'payroll',
      title: 'Payroll & Employment',
      icon: UserGroupIcon,
      description: 'Proper employee and contractor management',
      items: [
        { 
          key: 'hasPayrollSystem', 
          label: 'Payroll System (Gusto, ADP, etc.)', 
          critical: true,
          help: 'REQUIRED if you have W-2 employees. Handles taxes automatically',
          priority: 1
        },
        { 
          key: 'w2EmployeesPaidThroughPayroll', 
          label: 'All W-2 Employees Paid Through Payroll', 
          critical: true,
          help: 'NEVER pay employees as contractors or cash. Major legal/tax risk',
          priority: 1
        },
        { 
          key: 'contractors1099Properly', 
          label: 'Contract Workers Properly Classified', 
          critical: true,
          help: 'Part-time specialists can be 1099. Issue 1099 forms if >$600/year',
          priority: 1
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing & Profitability',
      icon: CalculatorIcon,
      description: 'Ensure sustainable business model',
      items: [
        { 
          key: 'tuitionCoversAllCosts', 
          label: 'Tuition Covers All Operating Costs', 
          critical: true,
          help: 'Total monthly tuition > total monthly expenses. Use pricing calculator',
          priority: 1
        },
        { 
          key: 'marginForEmergencies', 
          label: '10-15% Margin Built Into Pricing', 
          critical: true,
          help: 'Not just break-even. Need buffer for unexpected expenses',
          priority: 1
        },
        { 
          key: 'ownerTakingSalary', 
          label: 'Owner Taking Reasonable Salary', 
          critical: true,
          help: 'You must pay yourself! Build into tuition. Target: $3,000-5,000/month',
          priority: 1
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance & Safety',
      icon: ShieldCheckIcon,
      description: 'Student safety and regulatory requirements',
      items: [
        { 
          key: 'backgroundChecksComplete', 
          label: 'Background Checks for All Staff', 
          critical: true,
          help: 'REQUIRED: State and federal background checks for anyone with student contact',
          priority: 1
        },
        { 
          key: 'ferpaCompliance', 
          label: 'Student Privacy Policies (FERPA)', 
          critical: false,
          help: 'Required for most schools. Protects student records and data',
          priority: 2
        },
        { 
          key: 'stateReportingCurrent', 
          label: 'State Reporting Up to Date', 
          critical: false,
          help: 'Enrollment counts, attendance, required state reports',
          priority: 2
        }
      ]
    }
  ];

  const calculateProgress = () => {
    const criticalItems = checklistSections.flatMap(s => s.items.filter(i => i.critical));
    const completedCritical = criticalItems.filter(item => checklist[item.key]).length;
    return {
      total: criticalItems.length,
      completed: completedCritical,
      percentage: Math.round((completedCritical / criticalItems.length) * 100)
    };
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Basics Checklist</h1>
        <p className="text-gray-600">
          Essential requirements for running a compliant, sustainable education business
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Business Foundation Progress</h3>
            <p className="text-sm text-gray-600">Critical items completed: {progress.completed} / {progress.total}</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              progress.percentage >= 90 ? 'text-green-600' :
              progress.percentage >= 70 ? 'text-blue-600' :
              progress.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {progress.percentage}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              progress.percentage >= 90 ? 'bg-green-600' :
              progress.percentage >= 70 ? 'bg-blue-600' :
              progress.percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        
        {progress.percentage < 100 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Complete all critical items (marked with red badges) before accepting students. 
              These protect you legally and financially.
            </p>
          </div>
        )}
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {checklistSections.map(section => {
          const Icon = section.icon;
          const sectionComplete = section.items.filter(i => i.critical).every(item => checklist[item.key]);
          
          return (
            <div key={section.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  {sectionComplete && (
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map(item => (
                    <div key={item.key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <button
                        onClick={() => handleToggle(item.key)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {checklist[item.key] ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <label 
                            onClick={() => handleToggle(item.key)}
                            className={`font-medium cursor-pointer ${
                              checklist[item.key] ? 'text-gray-900 line-through' : 'text-gray-900'
                            }`}
                          >
                            {item.label}
                          </label>
                          {item.critical && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-medium">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.help}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Alert */}
      {progress.percentage >= 90 ? (
        <div className="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900">Great work! Your business foundation is solid.</h4>
              <p className="text-sm text-green-800 mt-1">
                You have the essential business basics in place. Now focus on enrollment growth and financial optimization.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Building Your Foundation</h4>
              <p className="text-sm text-blue-800 mt-1">
                Complete the required items above before accepting students. These protect you legally and financially. 
                SchoolStack.ai can help you set up each item properly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessBasicsChecklist;
