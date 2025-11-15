import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const BudgetVsCash = ({ budgetData, cashData, period = 'monthly' }) => {
  // Mock data structure - replace with real data
  const data = budgetData || {
    budgetedExpenses: {
      payroll: 12500,
      rent: 5600,
      utilities: 1500,
      supplies: 800,
      insurance: 2250,
      loan: 1850,
      other: 1200
    },
    totalBudgeted: 25700,
    currentCash: 14200,
    expectedRevenue: 28000,
    projectedCash: 16500
  };

  const items = Object.entries(data.budgetedExpenses).map(([category, budgetAmount]) => {
    const canAfford = data.currentCash >= budgetAmount;
    const willBeAbleToAfford = data.projectedCash >= budgetAmount;
    const percentage = (budgetAmount / data.totalBudgeted) * 100;
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      budgetAmount,
      canAfford,
      willBeAbleToAfford,
      percentage,
      status: canAfford ? 'good' : willBeAbleToAfford ? 'warning' : 'critical'
    };
  });

  const overallStatus = data.projectedCash >= data.totalBudgeted ? 'good' : 
                        data.projectedCash >= data.totalBudgeted * 0.8 ? 'warning' : 'critical';

  const statusConfig = {
    good: {
      color: 'green',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-success-300',
      textColor: 'text-green-800',
      label: 'Covered'
    },
    warning: {
      color: 'yellow',
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      label: 'Tight'
    },
    critical: {
      color: 'red',
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      label: 'At Risk'
    }
  };

  const config = statusConfig[overallStatus];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <div className={`p-6 rounded-xl border-2 ${config.bgColor} ${config.borderColor}`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-white`}>
            <Icon className={`h-6 w-6 text-${config.color}-600`} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Budget vs. Cash Reality
            </h2>
            <p className={`text-sm ${config.textColor} mb-4`}>
              {overallStatus === 'good' && (
                "Good news! Your projected cash covers all budgeted expenses this period."
              )}
              {overallStatus === 'warning' && (
                "Your cash position is tight. Some budgeted expenses may need to be timed carefully or deferred."
              )}
              {overallStatus === 'critical' && (
                "⚠️ Critical: Your projected cash does not cover all budgeted expenses. Immediate action required."
              )}
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Total Budgeted</div>
                <div className="text-lg font-bold text-gray-900">
                  ${data.totalBudgeted.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Current Cash</div>
                <div className="text-lg font-bold text-gray-900">
                  ${data.currentCash.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Projected Cash</div>
                <div className={`text-lg font-bold ${
                  data.projectedCash >= data.totalBudgeted ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${data.projectedCash.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Expense-by-Expense Analysis</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>This {period}</span>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const itemConfig = statusConfig[item.status];
            const ItemIcon = itemConfig.icon;
            
            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${itemConfig.borderColor} ${itemConfig.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className={`h-5 w-5 text-${itemConfig.color}-600`} />
                    <div>
                      <div className="font-semibold text-gray-900">{item.category}</div>
                      <div className="text-xs text-gray-500">
                        {item.percentage.toFixed(0)}% of total budget
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${item.budgetAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ItemIcon className={`h-4 w-4 text-${itemConfig.color}-600`} />
                      <span className={`text-xs font-medium ${itemConfig.textColor}`}>
                        {itemConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual indicator */}
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-${itemConfig.color}-500 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {/* Cash coverage indicator */}
                <div className="mt-3 flex items-start space-x-2">
                  <InformationCircleIcon className={`h-4 w-4 text-${itemConfig.color}-600 mt-0.5 flex-shrink-0`} />
                  <div className={`text-xs ${itemConfig.textColor}`}>
                    {item.canAfford && (
                      <span>✓ You have cash to cover this expense today</span>
                    )}
                    {!item.canAfford && item.willBeAbleToAfford && (
                      <span>⚠️ Need to wait for revenue before paying this expense</span>
                    )}
                    {!item.canAfford && !item.willBeAbleToAfford && (
                      <span>❌ Insufficient cash projected - consider deferring or cutting</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      {overallStatus !== 'good' && (
        <div className="bg-blue-50 border-2 border-primary-300 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <BanknotesIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Recommended Actions</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {data.projectedCash < data.totalBudgeted && (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>Prioritize expenses: Pay payroll and rent first, then utilities, then discretionary items</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>Accelerate collections: Follow up on outstanding invoices to bring in cash faster</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>Time expenses strategically: Coordinate payment dates with expected revenue</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <span>Consider short-term options: Line of credit or payment plans with vendors</span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Create Action Plan
                </button>
                <button className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50">
                  Adjust Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <InformationCircleIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <strong>Understanding Budget vs. Cash:</strong> Your budget shows what you <em>plan</em> to spend, 
            but cash flow shows what you <em>can actually afford</em> to spend right now. Even if an expense is 
            budgeted, you need to have the cash available to pay it when it's due. This is why timing matters as 
            much as the total amount.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetVsCash;

