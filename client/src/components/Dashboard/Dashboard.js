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
          })} • {scorecard?.criticalMetrics?.length + scorecard?.warningMetrics?.length || 0} actions need attention today
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
                  <div className="text-xl font-bold">${summary?.currentCash?.toLocaleString() || '3,247'}</div>
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

      {/* Financial Health Score Card */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Financial Health Score</h3>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              scorecard?.overallScore >= 85 ? 'text-green-600' :
              scorecard?.overallScore >= 70 ? 'text-blue-600' :
              scorecard?.overallScore >= 55 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {scorecard?.overallScore || 0}
            </div>
            <div className="text-sm text-gray-600">out of 100</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{scorecard?.criticalMetrics?.length || 0}</div>
            <div className="text-sm text-red-700">Critical Issues</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{scorecard?.warningMetrics?.length || 0}</div>
            <div className="text-sm text-yellow-700">Warnings</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(scorecard?.excellentMetrics?.length || 0) + (scorecard?.goodMetrics?.length || 0)}
            </div>
            <div className="text-sm text-green-700">Healthy Metrics</div>
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

        {/* Quick Wins */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Wins Available</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">Raise tuition by $75/month</div>
                <div className="text-sm text-gray-600">Would add 15 days cash • Still $200 below market</div>
              </div>
              <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                See Template
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">3 enrollment inquiries pending</div>
                <div className="text-sm text-gray-600">Follow up today • Worth $1,749/month</div>
              </div>
              <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                View Leads
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">Apply for FL Opportunity Grant</div>
                <div className="text-sm text-gray-600">You qualify • $15,000 available • Due in 10 days</div>
              </div>
              <button className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                Start Application
              </button>
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
