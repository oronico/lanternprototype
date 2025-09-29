import React, { useState, useEffect } from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [studentCount, setStudentCount] = useState(28);

  useEffect(() => {
    loadPricingPlans();
  }, [studentCount]);

  const loadPricingPlans = async () => {
    // Mock pricing data - in production, fetch from API
    const mockPlans = [
      {
        id: 'freemium',
        name: 'Education Starter',
        price: 0,
        maxStudents: 25,
        popular: false,
        description: 'Perfect for new education programs getting started',
        features: [
          'Basic financial dashboard',
          'Simple payment tracking (2 sources)',
          'Basic enrollment pipeline', 
          'Monthly financial health score',
          'Community forum access',
          '5 essential document templates'
        ],
        limitations: [
          'Limited to 2 payment integrations',
          'Monthly coaching insights only',
          'Basic document templates',
          'Email support only',
          'No advanced analytics'
        ],
        coaching: [
          'Monthly financial health tips',
          'Basic optimization suggestions',
          'Community-shared best practices'
        ],
        roi: {
          monthlySavings: 2000,
          annualSavings: 24000,
          description: 'vs. hiring part-time bookkeeper'
        }
      },
      {
        id: 'professional', 
        name: 'Education Professional',
        price: 149,
        maxStudents: 50,
        popular: true,
        description: 'Most popular - complete business operations platform',
        features: [
          'Complete financial health monitoring (10 metrics)',
          'Unlimited payment integrations',
          'AI-powered coaching insights (weekly)',
          'Advanced enrollment analytics',
          '20+ AI document templates',
          'Lease analysis with insurance requirements',
          'Real-time cash flow forecasting',
          'Priority email + chat support'
        ],
        coaching: [
          'Weekly strategic insights',
          'Automated optimization recommendations', 
          'Peer benchmarking analysis',
          'Crisis management protocols',
          'Growth strategy guidance',
          'Market opportunity alerts'
        ],
        roi: {
          monthlySavings: studentCount < 30 ? 1851 : 2851,
          annualSavings: studentCount < 30 ? 22212 : 34212,
          description: 'vs. professional bookkeeping services'
        }
      },
      {
        id: 'expert',
        name: 'Education Expert', 
        price: 299,
        maxStudents: 100,
        popular: false,
        description: 'Advanced business intelligence for growing education businesses',
        features: [
          'Everything in Professional +',
          'Daily coaching insights',
          'Advanced predictive analytics',
          'Custom document generation', 
          'Priority integration requests',
          'Phone support',
          'Quarterly business review',
          'White-label options'
        ],
        coaching: [
          'Daily strategic recommendations',
          'Proactive problem identification',
          'Advanced scenario planning',
          'Market opportunity analysis', 
          'Competitive intelligence',
          'Expert consultation access (2 hours/month)',
          'Board presentation assistance'
        ],
        roi: {
          monthlySavings: studentCount < 50 ? 3701 : 4701,
          annualSavings: studentCount < 50 ? 44412 : 56412,
          description: 'vs. CFO consultant + bookkeeper'
        }
      }
    ];

    setPlans(mockPlans);
  };

  const getSchoolFit = (plan) => {
    if (plan.id === 'freemium') {
      return studentCount <= 15 ? 'perfect' : studentCount <= 25 ? 'good' : 'outgrown';
    }
    if (plan.id === 'professional') {
      return studentCount >= 15 && studentCount <= 40 ? 'perfect' : 'consider';
    }
    if (plan.id === 'expert') {
      return studentCount >= 35 ? 'perfect' : 'premium';
    }
    return 'consider';
  };

  const getFitColor = (fit) => {
    const colors = {
      perfect: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      consider: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      premium: 'bg-purple-100 text-purple-800 border-purple-200',
      outgrown: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[fit] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFitText = (fit) => {
    const texts = {
      perfect: 'Perfect Fit',
      good: 'Good Choice', 
      consider: 'Consider This',
      premium: 'Premium Option',
      outgrown: 'Too Small'
    };
    return texts[fit] || 'Consider';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Education Business Intelligence Plan
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          From free starter tools to expert business coaching - designed for all education businesses
        </p>
        
        {/* Student Count Selector */}
        <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow p-4">
          <UserGroupIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Your program size:</span>
          <input
            type="number"
            value={studentCount}
            onChange={(e) => setStudentCount(parseInt(e.target.value) || 1)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            min="1"
            max="500"
          />
          <span className="text-sm text-gray-600">students/participants</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const fit = getSchoolFit(plan);
          const isSelected = selectedPlan === plan.id;
          
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-lg shadow-lg border-2 cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 transform scale-105' : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* School Fit Badge */}
              <div className="absolute -top-2 right-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getFitColor(fit)}`}>
                  {getFitText(fit)}
                </span>
              </div>

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                  
                  {plan.price > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      Save ${plan.roi.monthlySavings.toLocaleString()}/month vs. traditional bookkeeper
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Core Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coaching & Expertise */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <LightBulbIcon className="h-4 w-4 mr-1" />
                    AI Business Coaching
                  </h4>
                  <ul className="space-y-2">
                    {plan.coaching.map((coaching, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <SparklesIcon className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{coaching}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations (for freemium) */}
                {plan.limitations && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Limitations</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XMarkIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ROI Information */}
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Financial Impact</span>
                  </div>
                  <div className="text-sm text-green-800">
                    <div>Monthly Savings: <strong>${plan.roi.monthlySavings.toLocaleString()}</strong></div>
                    <div>Annual Savings: <strong>${plan.roi.annualSavings.toLocaleString()}</strong></div>
                    <div className="text-xs mt-1">{plan.roi.description}</div>
                  </div>
                </div>

                {/* Action Button */}
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.id === 'freemium' 
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}>
                  {plan.id === 'freemium' ? 'Start Free' : 'Start 14-Day Trial'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 SchoolStack.ai vs. Traditional Solutions</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Traditional Bookkeeper</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Our Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Value Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Financial Reporting</td>
                <td className="py-4 px-4 text-sm text-gray-600">Monthly P&L (backwards-looking)</td>
                <td className="py-4 px-4 text-sm text-green-700">Real-time dashboard + 7-day forecast</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Predictive vs. reactive</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Cash Flow Management</td>
                <td className="py-4 px-4 text-sm text-gray-600">Manual tracking, monthly alerts</td>
                <td className="py-4 px-4 text-sm text-green-700">Daily monitoring + crisis protocols</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Prevents cash crises</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Business Strategy</td>
                <td className="py-4 px-4 text-sm text-gray-600">Not included</td>
                <td className="py-4 px-4 text-sm text-green-700">AI coaching + optimization recommendations</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Strategic guidance included</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Integration Management</td>
                <td className="py-4 px-4 text-sm text-gray-600">Manual data entry from multiple sources</td>
                <td className="py-4 px-4 text-sm text-green-700">Automated sync across 12+ systems</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Zero manual work</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Industry Expertise</td>
                <td className="py-4 px-4 text-sm text-gray-600">Generic business knowledge</td>
                <td className="py-4 px-4 text-sm text-green-700">Education-specific best practices</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Specialized expertise</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-medium text-gray-900">Availability</td>
                <td className="py-4 px-4 text-sm text-gray-600">Business hours, scheduled meetings</td>
                <td className="py-4 px-4 text-sm text-green-700">24/7 monitoring + instant alerts</td>
                <td className="py-4 px-4 text-sm font-medium text-green-600">Always-on support</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-4 px-4 font-bold text-gray-900">Total Cost</td>
                <td className="py-4 px-4 text-sm font-bold text-red-600">$2,500-4,000/month</td>
                <td className="py-4 px-4 text-sm font-bold text-green-600">$0-299/month</td>
                <td className="py-4 px-4 text-sm font-bold text-green-600">90%+ cost reduction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Coaching Examples */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-purple-600" />
            AI Business Coaching Examples
          </h4>
          
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-lg">
              <div className="font-medium text-red-900">Cash Crisis Alert</div>
              <div className="text-sm text-red-800">
                "Your cash will go negative in 7 days. Execute this proven 3-step recovery plan used by 127 schools..."
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
              <div className="font-medium text-blue-900">Facility Optimization</div>
              <div className="text-sm text-blue-800">
                "Your rent ($28/sq ft) is 40% above market. Here's the exact negotiation strategy that saved similar schools $1,200/month..."
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
              <div className="font-medium text-green-900">Enrollment Growth</div>
              <div className="text-sm text-green-800">
                "Saturday tours convert 2x better. Schools that switched saw 40% enrollment increase within 90 days..."
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
            ROI Calculator for Your School
          </h4>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Current bookkeeping cost:</div>
              <div className="text-xl font-bold text-gray-900">
                ${studentCount < 30 ? '$2,000' : studentCount < 50 ? '$3,000' : '$4,000'}/month
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600">Professional plan cost:</div>
              <div className="text-xl font-bold text-green-700">$149/month</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600">Annual savings:</div>
              <div className="text-xl font-bold text-blue-700">
                ${((studentCount < 30 ? 2000 : studentCount < 50 ? 3000 : 4000) - 149) * 12}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600">ROI:</div>
              <div className="text-xl font-bold text-purple-700">
                {Math.round(((studentCount < 30 ? 2000 : studentCount < 50 ? 3000 : 4000) - 149) / 149 * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freemium Strategy */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Flexible Pricing Strategy</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">FREE Forever (Starter)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Basic financial health monitoring</li>
              <li>• Simple payment tracking (2 sources)</li>
              <li>• Monthly coaching insights</li>
              <li>• Community forum access</li>
              <li>• 5 essential document templates</li>
            </ul>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>Perfect for:</strong> New education programs (≤25 students/participants) getting started
                  </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">PREMIUM Value (Professional+)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Weekly strategic coaching insights</li>
              <li>• Unlimited payment integrations</li>
              <li>• Advanced predictive analytics</li>
              <li>• Crisis management protocols</li>
              <li>• 20+ AI document generator</li>
              <li>• Peer benchmarking analysis</li>
            </ul>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <div className="text-sm text-purple-800">
                <strong>ROI:</strong> Saves $22,000-44,000 annually vs. traditional bookkeeping services
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
