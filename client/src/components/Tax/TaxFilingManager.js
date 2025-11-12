import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  BanknotesIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Tax Filing Manager - Entity-Type Aware
 * 
 * Adapts tax requirements based on entity type:
 * - LLC: Form 1065 + K-1s
 * - S Corp: Form 1120-S + K-1s + W-2s for owners
 * - C Corp: Form 1120 + W-2s
 * - 501(c)(3): Form 990/990-EZ/990-N
 * 
 * Features:
 * - Track all required tax filings by entity type
 * - Deadline reminders
 * - Quarterly estimated tax calculations
 * - Payroll tax tracking (via Gusto)
 * - State-specific requirements
 * - Document storage for filed returns
 */

const TAX_REQUIREMENTS = {
  llc: {
    entityName: 'LLC (Limited Liability Company)',
    federalForms: [
      {
        form: '1065',
        name: 'Partnership Return',
        frequency: 'Annual',
        deadline: 'March 15',
        description: 'Partnership tax return',
        estimatedCost: '$800-1,500 (CPA)'
      },
      {
        form: 'Schedule K-1',
        name: 'Partner\'s Share of Income',
        frequency: 'Annual',
        deadline: 'March 15',
        description: 'Issued to each member/partner',
        estimatedCost: 'Included with 1065'
      },
      {
        form: '1040-ES',
        name: 'Estimated Tax (Quarterly)',
        frequency: 'Quarterly',
        deadlines: ['Apr 15', 'Jun 15', 'Sep 15', 'Jan 15'],
        description: 'Quarterly estimated tax payments for members',
        estimatedCost: 'Based on income'
      }
    ],
    stateForms: [
      {
        form: 'State Partnership Return',
        deadline: 'Varies by state',
        description: 'Most states require separate filing'
      }
    ],
    payrollTaxes: [],
    specialConsiderations: [
      'Members pay self-employment tax on their share of profits',
      'Quarterly estimated taxes required',
      'May elect S Corp status to save on taxes'
    ]
  },
  
  scorp: {
    entityName: 'S Corporation',
    federalForms: [
      {
        form: '1120-S',
        name: 'S Corporation Return',
        frequency: 'Annual',
        deadline: 'March 15',
        description: 'S Corp tax return',
        estimatedCost: '$1,200-2,000 (CPA)'
      },
      {
        form: 'Schedule K-1',
        name: 'Shareholder\'s Share of Income',
        frequency: 'Annual',
        deadline: 'March 15',
        description: 'Issued to each shareholder',
        estimatedCost: 'Included with 1120-S'
      },
      {
        form: 'W-2',
        name: 'Wage Statement (Owner)',
        frequency: 'Annual',
        deadline: 'January 31',
        description: 'Required for owner-employees',
        estimatedCost: 'Via Gusto'
      },
      {
        form: '941',
        name: 'Quarterly Payroll Tax',
        frequency: 'Quarterly',
        deadlines: ['Apr 30', 'Jul 31', 'Oct 31', 'Jan 31'],
        description: 'Federal payroll tax return',
        estimatedCost: 'Via Gusto'
      }
    ],
    stateForms: [
      {
        form: 'State Corporate Return',
        deadline: 'March 15 (most states)',
        description: 'State income tax return'
      }
    ],
    payrollTaxes: ['941 Quarterly', '940 Annual FUTA', 'W-2 Annual', 'W-3 Annual'],
    specialConsiderations: [
      'Owner must take reasonable salary',
      'Payroll taxes on salary portion',
      'Distributions taxed differently than salary',
      'Quarterly payroll tax deposits required'
    ]
  },
  
  ccorp: {
    entityName: 'C Corporation',
    federalForms: [
      {
        form: '1120',
        name: 'C Corporation Return',
        frequency: 'Annual',
        deadline: 'April 15',
        description: 'Corporate tax return',
        estimatedCost: '$1,500-3,000 (CPA)'
      },
      {
        form: 'W-2',
        name: 'Wage Statements',
        frequency: 'Annual',
        deadline: 'January 31',
        description: 'For all employees including owners',
        estimatedCost: 'Via Gusto'
      },
      {
        form: '941',
        name: 'Quarterly Payroll Tax',
        frequency: 'Quarterly',
        deadlines: ['Apr 30', 'Jul 31', 'Oct 31', 'Jan 31'],
        description: 'Federal payroll tax return',
        estimatedCost: 'Via Gusto'
      },
      {
        form: '1120-W',
        name: 'Estimated Tax (Quarterly)',
        frequency: 'Quarterly',
        deadlines: ['Apr 15', 'Jun 15', 'Sep 15', 'Dec 15'],
        description: 'Corporate estimated tax payments',
        estimatedCost: 'Based on profit'
      }
    ],
    stateForms: [
      {
        form: 'State Corporate Return',
        deadline: 'April 15 (most states)',
        description: 'State corporate income tax'
      }
    ],
    payrollTaxes: ['941 Quarterly', '940 Annual FUTA', 'W-2 Annual', 'W-3 Annual'],
    specialConsiderations: [
      'Double taxation (corporate + personal)',
      'Can retain earnings in corporation',
      'Best for seeking outside investment',
      'More complex than S Corp'
    ]
  },
  
  '501c3': {
    entityName: '501(c)(3) Nonprofit',
    federalForms: [
      {
        form: '990',
        name: 'Return of Organization Exempt from Tax',
        frequency: 'Annual',
        deadline: 'May 15 (5 months after fiscal year)',
        description: 'For revenue > $200,000',
        estimatedCost: '$1,500-3,000 (CPA)'
      },
      {
        form: '990-EZ',
        name: 'Short Form Return',
        frequency: 'Annual',
        deadline: 'May 15',
        description: 'For revenue $50,000-$200,000',
        estimatedCost: '$800-1,500 (CPA)'
      },
      {
        form: '990-N',
        name: 'E-Postcard',
        frequency: 'Annual',
        deadline: 'May 15',
        description: 'For revenue < $50,000',
        estimatedCost: 'Free (self-file online)'
      },
      {
        form: 'W-2',
        name: 'Wage Statements',
        frequency: 'Annual',
        deadline: 'January 31',
        description: 'For all employees',
        estimatedCost: 'Via Gusto'
      },
      {
        form: '941',
        name: 'Quarterly Payroll Tax',
        frequency: 'Quarterly',
        deadlines: ['Apr 30', 'Jul 31', 'Oct 31', 'Jan 31'],
        description: 'Federal payroll tax return',
        estimatedCost: 'Via Gusto'
      }
    ],
    stateForms: [
      {
        form: 'State Charitable Registration',
        deadline: 'Annual',
        description: 'Required in most states for fundraising'
      },
      {
        form: 'State Sales Tax Exemption',
        deadline: 'One-time',
        description: 'Apply for sales tax exemption'
      }
    ],
    payrollTaxes: ['941 Quarterly', '940 Annual FUTA', 'W-2 Annual', 'W-3 Annual'],
    specialConsiderations: [
      'Tax-exempt on income related to mission',
      'Must file 990 even with no income',
      'Failure to file 990 for 3 years = automatic revocation',
      'Board minutes and governance critical',
      'Unrelated business income taxed separately (Form 990-T)'
    ]
  }
};

export default function TaxFilingManager() {
  const [entityType, setEntityType] = useState('');
  const [filings, setFilings] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    analytics.trackPageView('tax-filing-manager');
    
    // Get entity type from onboarding (default to LLC for demo)
    const storedEntityType = localStorage.getItem('entityType') || 'llc';
    setEntityType(storedEntityType);
    
    loadFilingData(storedEntityType);
    
    // Show helpful message
    toast(`Showing tax forms for ${storedEntityType.toUpperCase()}. Change in Settings if needed.`, {
      duration: 3000,
      icon: '📋'
    });
  }, []);

  const loadFilingData = (entityType) => {
    // Demo filing data
    const demoFilings = [
      {
        id: 1,
        form: entityType === '501c3' ? '990-EZ' : entityType === 'scorp' ? '1120-S' : '1065',
        taxYear: 2023,
        deadline: entityType === '501c3' ? '2024-05-15' : '2024-03-15',
        status: 'filed',
        filedDate: entityType === '501c3' ? '2024-04-10' : '2024-02-28',
        preparedBy: 'ABC Tax Services'
      },
      {
        id: 2,
        form: '941',
        quarter: 'Q3 2024',
        deadline: '2024-10-31',
        status: 'pending',
        daysUntil: 36,
        preparedBy: 'Gusto (automatic)'
      }
    ];

    setFilings(demoFilings);

    // Calculate upcoming deadlines
    const requirements = TAX_REQUIREMENTS[entityType];
    if (requirements) {
      const deadlines = [];
      
      requirements.federalForms.forEach(form => {
        if (form.deadline) {
          deadlines.push({
            form: form.form,
            name: form.name,
            deadline: form.deadline,
            type: 'federal',
            frequency: form.frequency
          });
        }
        if (form.deadlines) {
          form.deadlines.forEach((dl, idx) => {
            deadlines.push({
              form: `${form.form} Q${idx + 1}`,
              name: form.name,
              deadline: dl,
              type: 'federal',
              frequency: 'Quarterly'
            });
          });
        }
      });
      
      setUpcomingDeadlines(deadlines.slice(0, 5));
    }
  };

  const requirements = TAX_REQUIREMENTS[entityType];

  if (!requirements) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <InformationCircleIcon className="mx-auto h-12 w-12 text-yellow-600 mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Entity Type Not Set
          </h3>
          <p className="text-yellow-800 mb-4">
            Please complete onboarding to set your entity type for customized tax guidance.
          </p>
          <button
            onClick={() => window.location.href = '/settings'}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tax Filing Manager</h1>
            <p className="text-gray-600">
              Tax requirements for {requirements.entityName}
            </p>
          </div>
        </div>
      </div>

      {/* Entity Type Card */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                Your Entity Type: {requirements.entityName}
              </h3>
              <div className="text-sm text-blue-800 mb-3">
                <strong>What This Means for Your Tax Filings:</strong>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                {requirements.specialConsiderations.slice(0, 3).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/settings'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <Cog6ToothIcon className="h-4 w-4" />
            Change Entity
          </button>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-red-500" />
          Upcoming Tax Deadlines
        </h2>
        
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-900">{deadline.form} - {deadline.name}</div>
                  <div className="text-sm text-red-700">{deadline.frequency}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-red-600">{deadline.deadline}</div>
                <div className="text-xs text-red-500">Mark on calendar</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Federal Tax Forms Required */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Federal Tax Forms</h2>
        
        <div className="space-y-4">
          {requirements.federalForms.map((form, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    Form {form.form}
                  </div>
                  <div className="text-sm text-gray-600">{form.name}</div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    form.frequency === 'Quarterly' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {form.frequency}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Deadline</div>
                  <div className="font-medium text-gray-900">
                    {form.deadline || form.deadlines?.join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Estimated Cost</div>
                  <div className="font-medium text-gray-900">{form.estimatedCost}</div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                {form.description}
              </div>

              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View Requirements →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* State Tax Forms */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">State Tax Forms</h2>
        
        <div className="space-y-4">
          {requirements.stateForms.map((form, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-5">
              <div className="font-semibold text-gray-900 mb-2">{form.form}</div>
              <div className="text-sm text-gray-600 mb-2">{form.description}</div>
              <div className="text-sm">
                <span className="text-gray-500">Deadline: </span>
                <span className="font-medium">{form.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Taxes (if applicable) */}
      {requirements.payrollTaxes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BanknotesIcon className="h-6 w-6 text-green-500" />
            Payroll Tax Filings
          </h2>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-green-900 mb-1">
                  Automated via Gusto
                </div>
                <div className="text-sm text-green-700">
                  All payroll tax filings are handled automatically by Gusto including deposits, quarterly returns, and annual forms.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {requirements.payrollTaxes.map((tax, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-900">{tax}</div>
                <div className="text-xs text-gray-600 mt-1">Auto-filed</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

