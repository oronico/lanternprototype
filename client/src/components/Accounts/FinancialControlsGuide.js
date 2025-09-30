import React from 'react';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const FinancialControlsGuide = () => {
  const controlCategories = [
    {
      id: 'liquidity',
      title: 'Liquidity Management',
      icon: BanknotesIcon,
      priority: 'critical',
      description: 'Maintain adequate cash reserves for operational stability',
      controls: [
        {
          control: 'Operating Cash Minimum',
          standard: 'Maintain 3-6 months of operating expenses in liquid accounts',
          current: '$15,748 (0.82 months)',
          target: '$57,500+ (3+ months)',
          status: 'critical',
          action: 'Establish automatic transfer triggers when balance falls below $5,000'
        },
        {
          control: 'Cash Flow Monitoring',
          standard: 'Weekly cash flow forecasting with 90-day rolling projections',
          current: 'Monthly review',
          target: 'Weekly automated monitoring',
          status: 'warning',
          action: 'Implement automated cash flow dashboard with alerts'
        },
        {
          control: 'Seasonal Reserve Planning',
          standard: 'Additional reserves for summer enrollment gaps and unexpected closures',
          current: 'No seasonal planning',
          target: 'Summer enrollment impact fund',
          status: 'warning',
          action: 'Build summer reserve equal to 2 months additional expenses'
        }
      ]
    },
    {
      id: 'debt',
      title: 'Debt Management',
      icon: CreditCardIcon,
      priority: 'high',
      description: 'Conservative debt levels that protect against revenue volatility',
      controls: [
        {
          control: 'Debt Service Coverage',
          standard: 'Monthly debt service &lt;10% of revenue (optimal &lt;5%)',
          current: '5.7% of revenue ($925/$16,324)',
          target: '&lt;5% of revenue',
          status: 'warning',
          action: 'Consider refinancing or extending terms to reduce monthly payments'
        },
        {
          control: 'Credit Utilization',
          standard: 'Business credit utilization &lt;20% (optimal &lt;10%)',
          current: '22% utilization',
          target: '&lt;10% utilization',
          status: 'warning',
          action: 'Pay down high-balance accounts and preserve credit capacity'
        },
        {
          control: 'Debt-to-Revenue Ratio',
          standard: 'Total debt &lt;1.5x annual revenue',
          current: '1.65x annual revenue',
          target: '&lt;1.5x annual revenue',
          status: 'warning',
          action: 'Focus on debt reduction before taking on additional financing'
        }
      ]
    },
    {
      id: 'enrollment',
      title: 'Enrollment Optimization',
      icon: ChartBarIcon,
      priority: 'critical',
      description: 'Enrollment is everything - achieve and maintain optimal student count',
      controls: [
        {
          control: 'Enrollment Sweet Spot',
          standard: 'Maintain enrollment 5-8 students above break-even point',
          current: '28 students (break-even: 25, optimal: 32-35)',
          target: '32-35 students for healthy margins',
          status: 'warning',
          action: 'Focus all marketing on reaching 32+ students - every seat matters'
        },
        {
          control: 'Student Retention Rate',
          standard: '95%+ annual retention (lose maximum 1-2 families)',
          current: '85% retention (lost 4 families this year)',
          target: '95%+ retention rate',
          status: 'critical',
          action: 'Monthly family check-ins, satisfaction surveys, early intervention'
        },
        {
          control: 'Summer Enrollment Planning',
          standard: 'Secure 80%+ of families for following year by March',
          current: 'Need to track re-enrollment commitments',
          target: '80% committed by March 1st',
          status: 'warning',
          action: 'Implement early re-enrollment process with incentives'
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Financial Compliance',
      icon: DocumentTextIcon,
      priority: 'high',
      description: 'Maintain proper financial documentation and oversight',
      controls: [
        {
          control: 'Monthly Financial Statements',
          standard: 'Prepare P&L, Balance Sheet, and Cash Flow within 15 days of month-end',
          current: 'Quarterly statements',
          target: 'Monthly statements by 15th',
          status: 'warning',
          action: 'Implement monthly closing procedures and automated reporting'
        },
        {
          control: 'Board Financial Oversight',
          standard: 'Monthly financial review with board treasurer and annual audit',
          current: 'Quarterly board review',
          target: 'Monthly treasurer review',
          status: 'warning',
          action: 'Schedule monthly treasurer calls and annual independent audit'
        },
        {
          control: 'Internal Controls',
          standard: 'Segregation of duties, dual approval for payments >$500',
          current: 'Single signature authority',
          target: 'Dual approval system',
          status: 'critical',
          action: 'Implement two-signature requirement for significant expenses'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      critical: 'text-red-700 bg-red-100 border-red-200',
      warning: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      good: 'text-green-700 bg-green-100 border-green-200',
      info: 'text-blue-700 bg-blue-100 border-blue-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Financial Controls Guide</h1>
            <p className="text-gray-600">Conservative financial management principles for education businesses</p>
          </div>
        </div>
        
        {/* Control Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-600">Critical Controls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">Warning Status</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">Good Standing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">68%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Control Categories */}
      <div className="space-y-8">
        {controlCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(category.priority)}`}>
                    {category.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {category.controls.map((control, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{control.control}</h4>
                          <p className="text-sm text-gray-600 mb-2">{control.standard}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(control.status)}`}>
                          {control.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">CURRENT STATE</div>
                          <div className="text-sm text-gray-900">{control.current}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">TARGET STATE</div>
                          <div className="text-sm text-gray-900">{control.target}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs font-medium text-gray-500 mb-1">RECOMMENDED ACTION</div>
                        <div className="text-sm text-gray-900">{control.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Implementation Timeline */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Implementation Timeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-red-700 mb-2">Immediate (0-30 days)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Enroll 4+ students to reach 32+ total</strong></li>
              <li>• Launch family retention check-ins</li>
              <li>• Establish $5,000 operating minimum</li>
              <li>• Begin weekly enrollment tracking</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-yellow-700 mb-2">Short-term (1-3 months)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Secure 80% re-enrollment commitments</strong></li>
              <li>• Implement family satisfaction surveys</li>
              <li>• Build emergency fund to 1 month</li>
              <li>• Calculate true cost per student</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-700 mb-2">Long-term (3-12 months)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Maintain 32-35 student sweet spot</strong></li>
              <li>• Achieve 95%+ annual retention rate</li>
              <li>• Build 3+ month summer reserve fund</li>
              <li>• Establish sustainable owner salary</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
          Financial Control Best Practices for Education Businesses
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Liquidity Management</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Maintain 3-6 months operating expenses in cash</li>
              <li>• Separate operating and emergency funds</li>
              <li>• Weekly cash flow forecasting</li>
              <li>• Automatic transfer triggers</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Risk Management</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Conservative debt levels (&lt;10% debt service)</li>
              <li>• Diversified revenue streams</li>
              <li>• Annual financial audits</li>
              <li>• Comprehensive insurance coverage</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Operational Controls</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Monthly financial statements by 15th</li>
              <li>• Segregation of financial duties</li>
              <li>• Board treasurer oversight</li>
              <li>• Dual approval for significant expenses</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Growth Planning</h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Sustainable expansion funding</li>
              <li>• Contract-based revenue security</li>
              <li>• Capital expenditure planning</li>
              <li>• Emergency contingency protocols</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialControlsGuide;
