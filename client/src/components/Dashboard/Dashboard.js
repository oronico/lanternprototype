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
        <h1 className="text-2xl font-bold text-gray-900">Good morning! Here's your financial snapshot</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • {(scorecard?.criticalMetrics?.length || 0) + (scorecard?.warningMetrics?.length || 0)} actions need attention today
        </p>
      </div>

      {/* Critical Alert */}
      {scorecard?.overallScore < 55 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">💡 Critical Alert: Financial Health Score: {scorecard.overallScore}/100</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white/90">
                <div>
                  <div className="text-sm opacity-90">Bank Balance (live via Plaid)</div>
                  <div className="text-xl font-bold">${summary?.bankBalance?.toLocaleString() || '3,247'}</div>
                  <div className="text-sm">↓ $1,200 from yesterday (payroll)</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Expected Today</div>
                  <div className="text-xl font-bold">${summary?.expectedToday?.toLocaleString() || '1,749'}</div>
                  <div className="text-sm">3 families • 2 via Omella, 1 check</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Outstanding Revenue</div>
                  <div className="text-xl font-bold">${summary?.outstandingRevenue?.toLocaleString() || '4,915'}</div>
                  <div className="text-sm">8 families late (was 5 yesterday)</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Days Cash on Hand</div>
                  <div className="text-xl font-bold">{summary?.daysCashOnHand || 7} days</div>
                  <div className="text-sm">Critical - need 30+ for safety</div>
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
          <div className="text-xs text-gray-500">Target: 30+ days</div>
          <div className="text-xs text-red-600 mt-2">⚠️ Cash crisis imminent</div>
        </div>

        {/* Debt Service Coverage Ratio */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Debt Service Coverage</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Warning</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">0.9x</div>
          <div className="text-xs text-gray-500">Target: 1.25x+</div>
          <div className="text-xs text-yellow-600 mt-2">Below lending standards</div>
        </div>

        {/* Debt to Revenue Ratio */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Debt to Revenue</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Good</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">12%</div>
          <div className="text-xs text-gray-500">Target: ≤15%</div>
          <div className="text-xs text-blue-600 mt-2">✓ Healthy debt level</div>
        </div>

        {/* Outstanding Debt */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Outstanding Debt</h4>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Monitor</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">$24,500</div>
          <div className="text-xs text-gray-500">Equipment loan + credit line</div>
          <div className="text-xs text-orange-600 mt-2">Monthly payment: $1,850</div>
        </div>

        {/* Student Attrition Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Student Attrition Rate</h4>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">18%</div>
          <div className="text-xs text-gray-500">Target: ≤10% annually</div>
          <div className="text-xs text-red-600 mt-2">High student turnover</div>
        </div>

        {/* Student Retention Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Student Retention</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Warning</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">82%</div>
          <div className="text-xs text-gray-500">Target: 90%+</div>
          <div className="text-xs text-yellow-600 mt-2">Below benchmark</div>
        </div>

        {/* Facility Burden */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Facility Burden</h4>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">28%</div>
          <div className="text-xs text-gray-500">Target: ≤20%</div>
          <div className="text-xs text-red-600 mt-2">Rent too high</div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Collection Rate</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Warning</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">82%</div>
          <div className="text-xs text-gray-500">Target: 95%+</div>
          <div className="text-xs text-yellow-600 mt-2">Need auto-pay setup</div>
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
              <div className="font-medium text-red-900">Multiple Critical Issues Detected</div>
              <div className="text-sm text-red-800 mt-1">
                Your school has 5 metrics in critical status. Priority actions: 
                1) Collect outstanding payments (cash crisis imminent), 
                2) Reduce facility costs (28% of revenue), 
                3) Address student retention issues (18% attrition rate).
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
            <h3 className="text-lg font-semibold text-gray-900">🔥 Urgent Collections</h3>
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
                    <div className="text-sm text-gray-600">15 days late • ESA payment • Usually reliable</div>
                  </div>
                  <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Send Reminder
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Martinez Family - $583</div>
                    <div className="text-sm text-gray-600">10 days late • Omella failed • Card expired</div>
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
            {/* Strategic Insight */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-purple-900 mb-1">Facility Cost Optimization Strategy</div>
                  <div className="text-sm text-purple-800 mb-2">
                    Your facility burden (28%) is 8% above healthy schools. Similar schools that reduced costs to 20% saw:
                  </div>
                  <div className="text-xs text-purple-700 space-y-1">
                    <div>• Average savings: $1,200/month</div>
                    <div>• Cash runway improvement: +18 days</div>
                    <div>• Success rate: 65% achieve reduction</div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                    Get Negotiation Strategy
                  </button>
                </div>
              </div>
            </div>

            {/* Growth Opportunity */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-900 mb-1">Enrollment Conversion Coaching</div>
                  <div className="text-sm text-green-800 mb-2">
                    Your inquiry-to-tour rate (42%) has room for improvement. Schools that reached 60%+ used:
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <div>• Saturday tours (convert 2x better)</div>
                    <div>• 2-hour response time to inquiries</div>
                    <div>• ESA family-specific materials</div>
                  </div>
                  <button className="mt-3 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    View Conversion Playbook
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
                  <div className="font-medium text-yellow-900 mb-1">Unlock Advanced Business Intelligence</div>
                  <div className="text-sm text-yellow-800 mb-2">
                    Professional plan includes weekly coaching insights worth $2,000+/month in consultant value:
                  </div>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <div>• Crisis management protocols</div>
                    <div>• Market opportunity analysis</div>
                    <div>• Competitive intelligence reports</div>
                    <div>• Growth strategy recommendations</div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 This Week's Cash Flow Forecast</h3>
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
