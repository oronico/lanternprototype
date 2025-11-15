import React, { useState } from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  ArrowPathIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const PricingPlans = () => {
  const [studentCount, setStudentCount] = useState(28);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'DIY with guidance',
      price: 49,
      popular: false,
      description: 'For schools managing their own bookkeeping with smart automation',
      icon: ChartBarIcon,
      iconColor: 'text-blue-600',
      bgGradient: 'from-primary-100 to-primary-200',
      features: {
        core: [
          'Real-time financial dashboard',
          'Bank & credit card connections (up to 3)',
          'Transaction categorization suggestions',
          'Monthly P&L, Balance Sheet, Cash Flow',
          'Budget vs. actual tracking',
          'Invoice tracking & reminders'
        ],
        automation: [
          'Auto-categorize common transactions',
          'Basic receipt capture (mobile app)',
          'Payment reconciliation',
          'Monthly close checklist'
        ],
        reports: [
          'Standard financial reports',
          'PDF export for banks/grants',
          'Monthly cash flow forecast',
          'Enrollment revenue tracking'
        ],
        support: [
          'Email support (48hr response)',
          'Knowledge base access',
          'Video tutorials'
        ]
      },
      limitations: [
        'No full bookkeeping service',
        'Limited to 3 bank/card connections',
        'Manual journal entry creation',
        'No live bookkeeper review'
      ],
      bestFor: 'Schools with someone on staff who can handle basic bookkeeping with automated help',
      roi: {
        replaces: 'Part-time bookkeeper ($800-1,200/mo)',
        savings: 800,
        annual: 9600,
        note: 'You still need basic accounting knowledge'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      tagline: 'Automated bookkeeping',
      price: 99,
      popular: true,
      description: 'Full automated bookkeeping - we replace your bookkeeper',
      icon: ArrowPathIcon,
      iconColor: 'text-primary-600',
      bgGradient: 'from-primary-100 to-primary-200',
      features: {
        core: [
          '✨ Everything in Starter +',
          'UNLIMITED bank & credit card connections',
          'Full chart of accounts setup',
          'Automated transaction categorization (95%+ accuracy)',
          'Auto-sync to QuickBooks Online or Xero',
          'Automated ledger entries'
        ],
        automation: [
          '🤖 AI-powered bookkeeping',
          'Auto-categorize ALL transactions',
          'Smart receipt matching',
          'Automated reconciliation',
          'Auto-generate journal entries',
          'Payroll integration (Gusto, ADP)',
          'Revenue automation (Stripe, Square)',
          'Expense tracking (credit cards, ACH)'
        ],
        reports: [
          '📊 Bank-ready financial packages',
          'Loan application reports (ready to submit)',
          'Grant application financials',
          'Monthly board packages',
          'Custom report builder',
          'Real-time cash flow forecasting (90 days)',
          'Budget vs. actual with variance analysis'
        ],
        documents: [
          '📁 Document repository',
          'Lease storage & tracking',
          'Insurance policy management',
          'Contract repository',
          'License/certification tracking',
          'Auto-renewal reminders'
        ],
        support: [
          'Email & chat support (24hr response)',
          'Monthly financial review',
          'Quarterly bookkeeping audit',
          'Tax prep support'
        ]
      },
      replaces: 'Traditional bookkeeper + document management',
      bestFor: 'Schools that want bookkeeping done FOR them, not BY them',
      roi: {
        replaces: 'Full-time bookkeeper ($2,500-4,000/mo)',
        savings: 2400,
        annual: 28800,
        note: '95% of bookkeeping fully automated'
      },
      trustFactors: [
        '✓ Bank-approved financial reports',
        '✓ SBA loan application ready',
        '✓ Grant application packages',
        '✓ CPA/auditor friendly'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Chief of Staff for your back office',
      price: 199,
      popular: false,
      description: 'Complete back-office management + strategic CFO guidance',
      icon: BuildingLibraryIcon,
      iconColor: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      features: {
        core: [
          '✨ Everything in Professional +',
          'Dedicated success manager',
          'Custom chart of accounts design',
          'Multi-entity/multi-location support',
          'Advanced fund accounting',
          'Custom workflow automation'
        ],
        automation: [
          '🤖 Advanced AI automation',
          'Custom transaction rules',
          'Automated compliance tracking',
          'Smart vendor management',
          'Automated budget variance alerts',
          'Predictive cash flow modeling',
          'Scenario planning automation'
        ],
        reports: [
          '📊 Executive-level reporting',
          'Board presentation packages',
          'Investor/funder updates',
          'Custom KPI dashboards',
          'Multi-year trend analysis',
          'Benchmarking vs. similar schools',
          'Financial projections (3-5 years)'
        ],
        documents: [
          '📁 Advanced document management',
          'Compliance calendar',
          'Accreditation document tracking',
          'State licensing renewals',
          'Audit-ready document packages',
          'Digital signature workflows',
          'Secure board document portal'
        ],
        cfo: [
          '💼 CFO-level guidance',
          'Weekly strategic calls',
          'Cash flow strategy sessions',
          'Fundraising financial prep',
          'Board meeting attendance',
          'Financial policy development',
          'Risk assessment & mitigation'
        ],
        support: [
          'Priority phone & Slack support',
          'Same-day response guarantee',
          'Dedicated Slack channel',
          'Quarterly in-person/Zoom reviews',
          'Tax planning & coordination'
        ]
      },
      replaces: 'Bookkeeper + Controller + Part-time CFO',
      bestFor: 'Multi-site schools, networks, or schools seeking significant growth/funding',
      roi: {
        replaces: 'Bookkeeper + Controller + CFO ($6,000-10,000/mo)',
        savings: 5800,
        annual: 69600,
        note: 'Complete financial operations team'
      },
      trustFactors: [
        '✓ Venture capital ready',
        '✓ Multi-million dollar loan packages',
        '✓ Foundation grant applications',
        '✓ Board-presentation quality'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-full mb-4">
          <span className="text-sm font-bold text-primary-700 px-4 py-1">
            🚀 New: Replace Your Bookkeeper
          </span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stop paying $2,500+/month for bookkeeping
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Automated bookkeeping that banks trust • Bank-ready reports • Document repository
        </p>
        <p className="text-lg text-primary-600 font-medium">
          We connect to your bank, cards, and revenue systems → auto-build your books in QuickBooks or Xero
        </p>
        
        {/* Student Count Selector */}
        <div className="mt-8 inline-flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
          <UserGroupIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Your school size:</span>
          <input
            type="number"
            value={studentCount}
            onChange={(e) => setStudentCount(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium"
            min="1"
            max="500"
          />
          <span className="text-sm text-gray-600">students</span>
        </div>
      </div>

      {/* Value Proposition Banner */}
      <div className="mb-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <BanknotesIcon className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">95%+</div>
            <div className="text-sm opacity-90">Transactions auto-categorized</div>
          </div>
          <div>
            <DocumentCheckIcon className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">Bank-Ready</div>
            <div className="text-sm opacity-90">Reports for loans & grants</div>
          </div>
          <div>
            <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">Trusted</div>
            <div className="text-sm opacity-90">By lenders & CPAs</div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                plan.popular ? 'border-purple-500 transform scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular - Replaces Bookkeeper
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex p-4 bg-white rounded-xl shadow-md mb-4">
                    <Icon className={`h-8 w-8 ${plan.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm font-medium text-gray-600 mt-1">{plan.tagline}</p>
                  <p className="text-sm text-gray-700 mt-2">{plan.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-xl text-gray-600 ml-2">/month</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border-2 border-success-300">
                    <div className="text-xs text-gray-600">You save vs. {plan.roi.replaces}</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${plan.roi.savings.toLocaleString()}/mo
                    </div>
                    <div className="text-xs text-gray-500">${plan.roi.annual.toLocaleString()}/year</div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600 italic">
                    {plan.roi.note}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-6 p-4 bg-white rounded-lg">
                  <div className="text-xs font-bold text-gray-700 mb-1">BEST FOR:</div>
                  <div className="text-sm text-gray-600">{plan.bestFor}</div>
                </div>

                {/* Features by Category */}
                <div className="space-y-6 mb-6">
                  {/* Core Features */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <CheckIcon className="h-4 w-4 mr-1 text-green-600" />
                      Core Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.core.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Automation */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-1 text-primary-600" />
                      Automation
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.automation.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <SparklesIcon className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reports */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <ChartBarIcon className="h-4 w-4 mr-1 text-blue-600" />
                      Reports
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.reports.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <DocumentCheckIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documents (if available) */}
                  {plan.features.documents && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <DocumentCheckIcon className="h-4 w-4 mr-1 text-amber-600" />
                        Document Management
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.documents.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CFO Services (Enterprise only) */}
                  {plan.features.cfo && (
                    <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">
                        💼 CFO-Level Services
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.cfo.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckIcon className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Trust Factors */}
                {plan.trustFactors && (
                  <div className="mb-6 p-4 bg-white rounded-lg border-2 border-primary-300">
                    <div className="text-xs font-bold text-blue-900 mb-2">TRUSTED BY:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      {plan.trustFactors.map((factor, index) => (
                        <div key={index}>{factor}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limitations (Starter only) */}
                {plan.limitations && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-xs font-bold text-yellow-900 mb-2">LIMITATIONS:</div>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XMarkIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-yellow-800">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.id === 'starter' ? 'Start Free Trial' : 'Replace Your Bookkeeper'}
                </button>
                
                <div className="mt-3 text-center text-xs text-gray-500">
                  14-day free trial • No credit card required • Cancel anytime
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* What We Replace */}
      <div className="mb-16 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          💰 What We Replace (And How Much You Save)
        </h3>
        
        <div className="table-scroll">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">Traditional Solution</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Monthly Cost</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Our Platform</th>
                <th className="text-right py-4 px-4 font-bold text-green-600">You Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">Bookkeeper</div>
                  <div className="text-sm text-gray-600">10-20 hrs/month @ $50-75/hr</div>
                </td>
                <td className="py-4 px-4 text-red-600 font-bold">$500-1,500</td>
                <td className="py-4 px-4 text-green-600 font-bold">$49-199</td>
                <td className="py-4 px-4 text-right text-green-600 font-bold">$300-1,300</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">Document Management System</div>
                  <div className="text-sm text-gray-600">Dropbox Business + manual organization</div>
                </td>
                <td className="py-4 px-4 text-red-600 font-bold">$20-50</td>
                <td className="py-4 px-4 text-green-600 font-bold">Included</td>
                <td className="py-4 px-4 text-right text-green-600 font-bold">$20-50</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">Financial Report Prep</div>
                  <div className="text-sm text-gray-600">For loan/grant applications</div>
                </td>
                <td className="py-4 px-4 text-red-600 font-bold">$200-500/report</td>
                <td className="py-4 px-4 text-green-600 font-bold">Included</td>
                <td className="py-4 px-4 text-right text-green-600 font-bold">$200-500</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">Part-time CFO</div>
                  <div className="text-sm text-gray-600">(Enterprise plan only)</div>
                </td>
                <td className="py-4 px-4 text-red-600 font-bold">$3,000-6,000</td>
                <td className="py-4 px-4 text-green-600 font-bold">$199</td>
                <td className="py-4 px-4 text-right text-green-600 font-bold">$2,800-5,800</td>
              </tr>
              <tr className="bg-green-50 font-bold">
                <td className="py-4 px-4 text-gray-900">TOTAL (Professional Plan)</td>
                <td className="py-4 px-4 text-red-600">$720-2,050/mo</td>
                <td className="py-4 px-4 text-green-600">$99/mo</td>
                <td className="py-4 px-4 text-right text-green-600 text-xl">$621-1,951/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-300">
          <div className="text-sm text-primary-900">
            <strong>Annual Savings (Professional Plan):</strong> $7,452 - $23,412 per year
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          🔄 How Automated Bookkeeping Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Connect</h4>
            <p className="text-sm text-gray-700">
              Link your bank accounts, credit cards, Stripe/Square, and payroll (Gusto/ADP)
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Auto-Categorize</h4>
            <p className="text-sm text-gray-700">
              AI automatically categorizes 95%+ of transactions into proper accounting categories
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Build Ledger</h4>
            <p className="text-sm text-gray-700">
              We automatically create journal entries and sync to QuickBooks Online or Xero
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Bank-Ready Reports</h4>
            <p className="text-sm text-gray-700">
              Download P&L, Balance Sheet, Cash Flow statements ready for banks, grants, or investors
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
            See It In Action (2 min demo)
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Can banks and lenders trust your reports?</h4>
            <p className="text-sm text-gray-700">
              Yes. Our reports follow GAAP (Generally Accepted Accounting Principles) and are generated from properly categorized transactions. 
              We sync with QuickBooks Online and Xero, which are accepted by all major banks and SBA lenders. Many of our customers have 
              successfully used our reports for loans ranging from $50K to $2M+.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Do I still need QuickBooks or Xero?</h4>
            <p className="text-sm text-gray-700">
              For the Professional and Enterprise plans, we recommend keeping QuickBooks Online or Xero as your "system of record" for compliance 
              and CPA access. We do all the work (categorization, reconciliation, journal entries) and sync it to your QB/Xero account. 
              This gives you the best of both worlds: automation + bank/CPA trust.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-2">What if I already have a bookkeeper?</h4>
            <p className="text-sm text-gray-700">
              Many schools start by using our platform alongside their bookkeeper to reduce their hours (and cost) by 50-75%. 
              Once you see how much we automate, many schools transition to using us exclusively and save $2,000+/month.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-2">How accurate is the AI categorization?</h4>
            <p className="text-sm text-gray-700">
              Our AI achieves 95%+ accuracy on common school transactions (rent, payroll, supplies, tuition, etc.). 
              For the remaining 5%, we flag them for quick review. Over time, the AI learns your specific patterns and improves even further.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-2">What about document storage for loans/grants?</h4>
            <p className="text-sm text-gray-700">
              Professional and Enterprise plans include a secure document repository that organizes your lease, insurance policies, 
              licenses, certifications, contracts, and more. When you apply for a loan or grant, you can generate a complete 
              document package in minutes instead of hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
