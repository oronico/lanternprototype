import React, { useState, useEffect } from 'react';
import {
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CashRealityDashboard = ({ schoolData, cashFlowData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [scenarioMode, setScenarioMode] = useState(false);
  const [scenarioParams, setScenarioParams] = useState({
    enrollmentChange: 0,
    expenseChange: 0,
    delayHiring: false
  });

  // Calculate health status based on cash runway
  const getHealthStatus = (daysCash, upcomingObligations) => {
    const obligationsCovered = daysCash >= (upcomingObligations / cashFlowData?.dailyBurn || 30);
    
    if (daysCash >= 60 && obligationsCovered) {
      return { 
        status: 'healthy', 
        color: 'green', 
        label: 'Healthy', 
        icon: CheckCircleIcon,
        message: "You're in great shape! Keep building reserves."
      };
    } else if (daysCash >= 30 && obligationsCovered) {
      return { 
        status: 'good', 
        color: 'blue', 
        label: 'Good', 
        icon: CheckCircleIcon,
        message: 'Solid position. Focus on growing reserves to 60+ days.'
      };
    } else if (daysCash >= 20 || obligationsCovered) {
      return { 
        status: 'warning', 
        color: 'yellow', 
        label: 'Watch Closely', 
        icon: ExclamationTriangleIcon,
        message: 'Cash is tight. Review upcoming expenses and accelerate collections.'
      };
    } else if (daysCash >= 10) {
      return { 
        status: 'urgent', 
        color: 'orange', 
        label: 'Action Needed', 
        icon: ExclamationTriangleIcon,
        message: 'Urgent attention required. Consider expense cuts or emergency funding.'
      };
    } else {
      return { 
        status: 'critical', 
        color: 'red', 
        label: 'Critical', 
        icon: ExclamationTriangleIcon,
        message: 'CRITICAL: Immediate action required to avoid cash shortage.'
      };
    }
  };

  // Mock data - replace with real API calls
  const currentCash = schoolData?.currentCash || 14200;
  const dailyBurn = cashFlowData?.dailyBurn || 645;
  const daysCashOnHand = Math.floor(currentCash / dailyBurn);
  
  const obligationsData = {
    30: {
      payroll: 12500,
      rent: 5600,
      utilities: 1500,
      insurance: 2250,
      loan: 1850,
      supplies: 800,
      total: 24500
    },
    60: {
      payroll: 25000,
      rent: 11200,
      utilities: 3000,
      insurance: 2250,
      loan: 3700,
      supplies: 1600,
      total: 46750
    },
    90: {
      payroll: 37500,
      rent: 16800,
      utilities: 4500,
      insurance: 2250,
      loan: 5550,
      supplies: 2400,
      total: 69000
    }
  };

  const expectedRevenue = {
    30: 28000,
    60: 56000,
    90: 84000
  };

  const obligations = obligationsData[selectedPeriod];
  const revenue = expectedRevenue[selectedPeriod];
  const projectedCash = currentCash + revenue - obligations.total;
  
  const healthStatus = getHealthStatus(daysCashOnHand, obligations.total);

  // Scenario calculation
  const calculateScenario = () => {
    const enrollmentImpact = (revenue * scenarioParams.enrollmentChange) / 100;
    const expenseImpact = (obligations.total * scenarioParams.expenseChange) / 100;
    const hiringDelay = scenarioParams.delayHiring ? 3000 : 0;
    
    return {
      newRevenue: revenue + enrollmentImpact,
      newExpenses: obligations.total + expenseImpact - hiringDelay,
      newProjectedCash: currentCash + revenue + enrollmentImpact - (obligations.total + expenseImpact - hiringDelay),
      impact: enrollmentImpact - expenseImpact + hiringDelay
    };
  };

  const scenario = scenarioMode ? calculateScenario() : null;

  return (
    <div className="space-y-6">
      {/* Header with Health Status */}
      <div className={`p-6 rounded-2xl bg-gradient-to-br from-${healthStatus.color}-50 to-${healthStatus.color}-100 border-2 border-${healthStatus.color}-200`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl bg-${healthStatus.color}-200`}>
              <healthStatus.icon className={`h-8 w-8 text-${healthStatus.color}-700`} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">Cash Health Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${healthStatus.color}-200 text-${healthStatus.color}-800`}>
                  {healthStatus.label}
                </span>
              </div>
              <p className={`text-${healthStatus.color}-800 font-medium`}>{healthStatus.message}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">${currentCash.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Cash Today</div>
            <div className="text-xl font-bold text-gray-700 mt-1">{daysCashOnHand} days</div>
            <div className="text-xs text-gray-500">at current burn rate</div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">View Period:</span>
          <div className="flex space-x-1">
            {['30', '60', '90'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period} Days
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScenarioMode(!scenarioMode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            scenarioMode
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-400'
          }`}
        >
          <BeakerIcon className="h-5 w-5" />
          <span>Scenario Planning</span>
        </button>
      </div>

      {/* Scenario Planning Panel */}
      {scenarioMode && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 animate-fade-in-up">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2 text-purple-600" />
            What-If Scenarios
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Change (%)
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={scenarioParams.enrollmentChange}
                onChange={(e) => setScenarioParams({...scenarioParams, enrollmentChange: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm font-medium text-gray-900 mt-1">
                {scenarioParams.enrollmentChange > 0 ? '+' : ''}{scenarioParams.enrollmentChange}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Change (%)
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={scenarioParams.expenseChange}
                onChange={(e) => setScenarioParams({...scenarioParams, expenseChange: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-sm font-medium text-gray-900 mt-1">
                {scenarioParams.expenseChange > 0 ? '+' : ''}{scenarioParams.expenseChange}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scenarioParams.delayHiring}
                  onChange={(e) => setScenarioParams({...scenarioParams, delayHiring: e.target.checked})}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Delay hiring (-$3K/mo)</span>
              </label>
            </div>
          </div>

          {scenario && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-purple-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Projected Revenue</div>
                <div className="text-xl font-bold text-gray-900">${scenario.newRevenue.toLocaleString()}</div>
                <div className={`text-xs ${scenario.newRevenue > revenue ? 'text-green-600' : 'text-red-600'}`}>
                  {scenario.newRevenue > revenue ? '+' : ''}{(scenario.newRevenue - revenue).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Projected Expenses</div>
                <div className="text-xl font-bold text-gray-900">${scenario.newExpenses.toLocaleString()}</div>
                <div className={`text-xs ${scenario.newExpenses < obligations.total ? 'text-green-600' : 'text-red-600'}`}>
                  {scenario.newExpenses < obligations.total ? '' : '+'}{(scenario.newExpenses - obligations.total).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Ending Cash Position</div>
                <div className={`text-xl font-bold ${scenario.newProjectedCash > projectedCash ? 'text-green-600' : 'text-red-600'}`}>
                  ${scenario.newProjectedCash.toLocaleString()}
                </div>
                <div className={`text-xs ${scenario.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {scenario.impact > 0 ? '+' : ''}{scenario.impact.toLocaleString()} vs baseline
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cash Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Today */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Cash Today</h3>
            <BanknotesIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${currentCash.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Daily burn: ${dailyBurn.toLocaleString()}
          </div>
        </div>

        {/* Expected Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Expected Revenue</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            +${revenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Next {selectedPeriod} days
          </div>
        </div>

        {/* Obligations */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Obligations</h3>
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            -${obligations.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Due in {selectedPeriod} days
          </div>
        </div>
      </div>

      {/* Detailed Obligations Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Upcoming Obligations ({selectedPeriod} Days)
        </h3>
        
        <div className="space-y-3">
          {Object.entries(obligations).filter(([key]) => key !== 'total').map(([category, amount]) => {
            const percentage = (amount / obligations.total) * 100;
            const isLarge = percentage > 30;
            
            return (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                        isLarge ? 'bg-red-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">Total Obligations</span>
          <span className="text-xl font-bold text-gray-900">${obligations.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Projected Cash Position */}
      <div className={`p-6 rounded-xl border-2 ${
        projectedCash > currentCash 
          ? 'bg-green-50 border-green-300' 
          : projectedCash > 0 
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-red-50 border-red-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Projected Cash Position ({selectedPeriod} Days)
            </h3>
            <div className={`text-4xl font-bold ${
              projectedCash > currentCash 
                ? 'text-green-600' 
                : projectedCash > 0 
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              ${projectedCash.toLocaleString()}
            </div>
            <div className={`text-sm font-medium mt-1 ${
              projectedCash > currentCash ? 'text-green-700' : 'text-red-700'
            }`}>
              {projectedCash > currentCash ? '+' : ''}{(projectedCash - currentCash).toLocaleString()} vs today
            </div>
          </div>
          
          {projectedCash < currentCash * 0.5 && (
            <div className="flex items-start space-x-2 max-w-md">
              <LightBulbIcon className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <strong>Recommendation:</strong> Your cash position is declining. Consider accelerating collections, 
                delaying non-essential expenses, or exploring short-term financing options.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Budget vs Cash Reality Callout */}
      {obligations.total > currentCash + revenue && (
        <div className="p-6 bg-red-50 border-2 border-red-300 rounded-xl">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">
                ⚠️ Budget vs. Cash Reality Gap
              </h3>
              <p className="text-sm text-red-800 mb-3">
                Your budgeted expenses exceed projected cash availability. Even though these expenses may be in your budget, 
                you may not have sufficient cash to pay them.
              </p>
              <div className="text-sm text-red-900 font-medium">
                Gap: ${(obligations.total - (currentCash + revenue)).toLocaleString()}
              </div>
              <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                View Action Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashRealityDashboard;

