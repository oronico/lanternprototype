import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { dashboardAPI, healthAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryResponse, scorecardResponse] = await Promise.all([
        dashboardAPI.getSummary(),
        healthAPI.getScorecard()
      ]);
      setSummary(summaryResponse.data);
      setScorecard(scorecardResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning! Your business performance snapshot</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {(scorecard?.criticalMetrics?.length || 0) + (scorecard?.warningMetrics?.length || 0)} key metrics need attention
        </p>
      </div>

      {/* Critical Alert */}
      {scorecard?.overallScore < 55 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">⚠️ Business Health Alert - Performance Score: {scorecard.overallScore}/100</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white/90">
                <div>
                  <div className="text-sm opacity-90">Operating Cash Balance</div>
                  <div className="text-xl font-bold">${summary?.bankBalance?.toLocaleString() || '3,247'}</div>
                  <div className="text-sm">↓ $1,200 from yesterday (payroll)</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Expected Receipts Today</div>
                  <div className="text-xl font-bold">${summary?.expectedToday?.toLocaleString() || '1,749'}</div>
                  <div className="text-sm">3 families • 2 via Omella, 1 check</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Outstanding Receivables</div>
                  <div className="text-xl font-bold">${summary?.outstandingRevenue?.toLocaleString() || '4,915'}</div>
                  <div className="text-sm">8 accounts past due</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Days Cash on Hand</div>
                  <div className="text-xl font-bold">{summary?.daysCashOnHand || 7} days</div>
                  <div className="text-sm">Target: 30+ days (industry standard)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Financial Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Days Cash on Hand */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Days Cash on Hand</h4>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">5 days</div>
          <div className="text-xs text-gray-500">Industry standard: 30+ days</div>
          <div className="text-xs text-red-600 mt-2">⚠️ Cash runway critically low</div>
        </div>

        {/* Debt Service Coverage Ratio */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Debt Service Coverage</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Warning</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">0.9x</div>
          <div className="text-xs text-gray-500">Lender requirement: 1.25x+</div>
          <div className="text-xs text-yellow-600 mt-2">Below lending standards</div>
        </div>

        {/* What You Owe vs What You Make */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">What You Owe vs What You Make</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Good</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">12%</div>
          <div className="text-xs text-gray-500">Goal: Keep under 15%</div>
          <div className="text-xs text-blue-600 mt-2">✓ Manageable debt</div>
        </div>

        {/* Total Money You Owe */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Money You Owe</h4>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Watch</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">$24,500</div>
          <div className="text-xs text-gray-500">Equipment loan + credit line</div>
          <div className="text-xs text-orange-600 mt-2">You pay $1,850/month</div>
        </div>

        {/* Enrollment vs Capacity */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Enrollment vs Sweet Spot</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Below Target</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">28 / 32</div>
          <div className="text-xs text-gray-500">Current / Optimal (Break-even: 25)</div>
          <div className="text-xs text-yellow-600 mt-2">4 students needed for healthy margins</div>
        </div>

        {/* Student Retention Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Student Retention Rate</h4>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">85%</div>
          <div className="text-xs text-gray-500">Industry benchmark: 95%+</div>
          <div className="text-xs text-red-600 mt-2">Lost 4 families this year</div>
        </div>

        {/* Rent to Revenue Ratio */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Rent to Revenue Ratio</h4>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">28%</div>
          <div className="text-xs text-gray-500">Industry standard: ≤20%</div>
          <div className="text-xs text-red-600 mt-2">Facility burden too high</div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Collection Rate</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Warning</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">82%</div>
          <div className="text-xs text-gray-500">Industry benchmark: 95%+</div>
          <div className="text-xs text-yellow-600 mt-2">Implement auto-pay systems</div>
        </div>
      </div>

      {/* Financial Health Score Summary */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Financial Health Score</h3>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              scorecard?.overallScore >= 85 ? 'text-green-600' :
              scorecard?.overallScore >= 70 ? 'text-blue-600' :
              scorecard?.overallScore >= 55 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {scorecard?.overallScore || 53}
            </div>
            <div className="text-sm text-gray-600">out of 100</div>
            <div className="text-xs text-red-600 font-medium">Critical Status</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">5</div>
            <div className="text-sm text-red-700">Critical Issues</div>
            <div className="text-xs text-gray-500">Need immediate action</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-yellow-700">Warning Metrics</div>
            <div className="text-xs text-gray-500">Monitor closely</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">2</div>
            <div className="text-sm text-blue-700">Good Performance</div>
            <div className="text-xs text-gray-500">Stable metrics</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-700">Excellent</div>
            <div className="text-xs text-gray-500">Top performers</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-red-900">Business Performance Alert</div>
              <div className="text-sm text-red-800 mt-1">
                5 key performance indicators require immediate attention. Priority actions: 
                1) Accelerate receivables collection (critical for cash flow), 
                2) Execute enrollment growth strategy (28→32+ students for optimal margins), 
                3) Implement retention initiatives (prevent further revenue churn).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Urgent Collections */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💰 Accounts Receivable</h3>
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {summary?.urgentCollections?.length || 5}
            </span>
          </div>
          <div className="space-y-3">
            {summary?.urgentCollections?.slice(0, 3).map((collection, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{collection.family} - ${collection.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{collection.daysLate} days late • {collection.type} • {collection.note}</div>
                </div>
                <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  Send Reminder
                </button>
              </div>
            )) || (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Johnson Family - $1,166</div>
                    <div className="text-sm text-gray-600">15 days late • Usually pays on time</div>
                  </div>
                  <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Send Reminder
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Martinez Family - $583</div>
                    <div className="text-sm text-gray-600">10 days late • Credit card expired</div>
                  </div>
                  <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Request New Card
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Business Coaching */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              🧠 AI Business Coach
            </h3>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Professional Plan
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Critical Enrollment Focus */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-red-900 mb-1">🎯 Enrollment Optimization Strategy</div>
                  <div className="text-sm text-red-800 mb-2">
                    Current: 28 students | Target: 32+ for optimal margins. Benefits of reaching target:
                  </div>
                  <div className="text-xs text-red-700 space-y-1">
                    <div>• $4,000-6,000 additional monthly revenue</div>
                    <div>• Sustainable owner compensation ($3,000+/month)</div>
                    <div>• Summer operating reserve fund</div>
                    <div>• Improved debt service coverage ratio</div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    View Enrollment Playbook
                  </button>
                </div>
              </div>
            </div>

            {/* Retention Focus */}
            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-orange-900 mb-1">🔄 Customer Retention Management</div>
                  <div className="text-sm text-orange-800 mb-2">
                    Current retention: 85% | Industry benchmark: 95%+. Lost revenue impact: $1,000+ per family/month.
                  </div>
                  <div className="text-xs text-orange-700 space-y-1">
                    <div>• Implement monthly family satisfaction surveys</div>
                    <div>• Early intervention protocols for at-risk students</div>
                    <div>• Q1 re-enrollment commitment campaigns</div>
                    <div>• Proactive parent communication strategies</div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                    View Retention Playbook
                  </button>
                </div>
              </div>
            </div>

            {/* Freemium Upgrade Prompt */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">💎</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-yellow-900 mb-1">💎 Professional Growth Tools</div>
                  <div className="text-sm text-yellow-800 mb-2">
                    Professional Plan ($149/month) - Advanced business intelligence for scaling operations:
                  </div>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <div>• Enrollment optimization modeling & forecasting</div>
                    <div>• Customer satisfaction tracking & churn prediction</div>
                    <div>• Automated re-enrollment campaigns</div>
                    <div>• Marketing ROI attribution & channel analytics</div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                    Upgrade to Professional ($149/mo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Forecast */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Cash Flow Forecast - 5 Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {summary?.weeklyForecast?.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">{day.day}</div>
              <div className={`text-xl font-bold ${
                day.status === 'critical' ? 'text-red-600' :
                day.status === 'danger' ? 'text-red-500' :
                day.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                ${day.balance.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{day.change}</div>
            </div>
          )) || (
            <>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Today (Tue)</div>
                <div className="text-xl font-bold text-red-600">$3,247</div>
                <div className="text-xs text-gray-500">+$1,749 expected</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Wed</div>
                <div className="text-xl font-bold text-yellow-600">$4,996</div>
                <div className="text-xs text-gray-500">No transactions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Thu</div>
                <div className="text-xl font-bold text-yellow-600">$3,496</div>
                <div className="text-xs text-gray-500">-$1,500 utilities</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Fri</div>
                <div className="text-xl font-bold text-red-500">$1,246</div>
                <div className="text-xs text-gray-500">-$2,250 insurance</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Mon</div>
                <div className="text-xl font-bold text-red-600">-$254</div>
                <div className="text-xs text-red-600">NEGATIVE!</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
