import React, { useState, useEffect } from 'react';
import {
  DocumentCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const OperationalMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [timeframe, setTimeframe] = useState('current-month');

  useEffect(() => {
    loadMetrics();
  }, [selectedProgram, timeframe]);

  const loadMetrics = async () => {
    // Mock data - replace with API call
    const mockMetrics = {
      // Contract Coverage
      contractCoverage: {
        total: 28,
        signed: 24,
        pending: 3,
        notSent: 1,
        percentage: 85.7,
        trend: 'up',
        trendValue: 5.2,
        urgentActions: [
          { family: 'Martinez Family', status: 'Sent 10 days ago, not signed' },
          { family: 'Chen Family', status: 'Contract not sent yet' },
          { family: 'Williams Family', status: 'Viewed but not signed (3 days)' }
        ]
      },
      
      // On-Time Payment
      onTimePayment: {
        totalPayments: 156,
        onTimePayments: 128,
        latePayments: 22,
        missedPayments: 6,
        percentage: 82.1,
        trend: 'up',
        trendValue: 3.4,
        breakdown: {
          excellent: 18, // 95%+ on-time
          good: 6,       // 85-94% on-time
          fair: 3,       // 70-84% on-time
          poor: 1        // <70% on-time
        },
        urgentActions: [
          { family: 'Johnson Family', daysLate: 15, amount: '$1,166' },
          { family: 'Garcia Family', daysLate: 8, amount: '$583' }
        ]
      },
      
      // Enrollment vs. Capacity (by program)
      utilizationByProgram: [
        {
          programId: 1,
          name: '5-Day Full-Time',
          type: 'full-time',
          capacity: 16,
          enrolled: 14,
          waitlist: 2,
          utilizationRate: 87.5,
          trend: 'stable',
          revenueImpact: 'High'
        },
        {
          programId: 2,
          name: '3-Day Program',
          type: 'part-time',
          capacity: 12,
          enrolled: 8,
          waitlist: 0,
          utilizationRate: 66.7,
          trend: 'down',
          revenueImpact: 'Medium'
        },
        {
          programId: 3,
          name: 'After-School',
          type: 'after-school',
          capacity: 20,
          enrolled: 6,
          waitlist: 0,
          utilizationRate: 30.0,
          trend: 'down',
          revenueImpact: 'Low'
        },
        {
          programId: 4,
          name: 'Online Learning',
          type: 'online',
          capacity: 25,
          enrolled: 12,
          waitlist: 1,
          utilizationRate: 48.0,
          trend: 'up',
          revenueImpact: 'Medium'
        }
      ],
      
      // Overall utilization
      overallUtilization: {
        totalCapacity: 73,
        totalEnrolled: 40,
        totalWaitlist: 3,
        percentage: 54.8,
        availableSpots: 33,
        trend: 'stable'
      },
      
      // Financial Impact
      financialImpact: {
        currentMonthlyRevenue: 32540,
        potentialMonthlyRevenue: 59390,
        revenueAtRisk: 4915, // Overdue payments
        utilizationGap: 26850 // If fully utilized
      }
    };
    
    setMetrics(mockMetrics);
  };

  if (!metrics) {
    return <div className="text-center py-12">Loading metrics...</div>;
  }

  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-100';
    if (rate >= 75) return 'text-blue-600 bg-blue-100';
    if (rate >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <span className="text-gray-400">—</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operational Metrics</h1>
          <p className="text-gray-600 mt-1">Key performance indicators for your school</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="current-month">Current Month</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="current-quarter">Current Quarter</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* Top 3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contract Coverage */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Contract Coverage</h3>
            </div>
            {getTrendIcon(metrics.contractCoverage.trend)}
          </div>
          
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.contractCoverage.percentage}%
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {metrics.contractCoverage.signed} of {metrics.contractCoverage.total} families signed
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Signed</span>
              <span className="font-semibold text-green-600">{metrics.contractCoverage.signed}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{metrics.contractCoverage.pending}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Not Sent</span>
              <span className="font-semibold text-red-600">{metrics.contractCoverage.notSent}</span>
            </div>
          </div>
          
          {metrics.contractCoverage.urgentActions.length > 0 && (
            <Link 
              to="/documents"
              className="mt-4 block text-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              {metrics.contractCoverage.urgentActions.length} Need Attention
            </Link>
          )}
        </div>

        {/* On-Time Payment % */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="h-6 w-6 text-green-600" />
              <h3 className="font-bold text-gray-900">On-Time Payment</h3>
            </div>
            {getTrendIcon(metrics.onTimePayment.trend)}
          </div>
          
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.onTimePayment.percentage}%
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {metrics.onTimePayment.onTimePayments} of {metrics.onTimePayment.totalPayments} payments on time
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Excellent (95%+)</span>
              <span className="font-semibold text-green-600">{metrics.onTimePayment.breakdown.excellent} families</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Good (85-94%)</span>
              <span className="font-semibold text-blue-600">{metrics.onTimePayment.breakdown.good} families</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Fair (70-84%)</span>
              <span className="font-semibold text-yellow-600">{metrics.onTimePayment.breakdown.fair} families</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Poor (&lt;70%)</span>
              <span className="font-semibold text-red-600">{metrics.onTimePayment.breakdown.poor} families</span>
            </div>
          </div>
          
          {metrics.onTimePayment.urgentActions.length > 0 && (
            <Link 
              to="/payments"
              className="mt-4 block text-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
            >
              {metrics.onTimePayment.urgentActions.length} Overdue
            </Link>
          )}
        </div>

        {/* Overall Utilization */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Enrollment vs. Capacity</h3>
            </div>
            {getTrendIcon(metrics.overallUtilization.trend)}
          </div>
          
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {metrics.overallUtilization.percentage}%
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {metrics.overallUtilization.totalEnrolled} of {metrics.overallUtilization.totalCapacity} spots filled
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Enrolled</span>
              <span className="font-semibold text-gray-900">{metrics.overallUtilization.totalEnrolled}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Waitlist</span>
              <span className="font-semibold text-blue-600">{metrics.overallUtilization.totalWaitlist}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">{metrics.overallUtilization.availableSpots}</span>
            </div>
          </div>
          
          <Link 
            to="/enrollment"
            className="mt-4 block text-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200"
          >
            View Enrollment Pipeline
          </Link>
        </div>
      </div>

      {/* Utilization by Program */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Utilization by Program</h2>
        
        <div className="space-y-4">
          {metrics.utilizationByProgram.map((program) => (
            <div key={program.programId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(program.utilizationRate)}`}>
                      {program.utilizationRate.toFixed(1)}%
                    </span>
                    {program.waitlist > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {program.waitlist} waitlist
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {program.enrolled} / {program.capacity} students • {program.type}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Revenue Impact</div>
                  <div className={`text-lg font-bold ${
                    program.revenueImpact === 'High' ? 'text-green-600' :
                    program.revenueImpact === 'Medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {program.revenueImpact}
                  </div>
                </div>
              </div>
              
              {/* Visual capacity bar */}
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                    program.utilizationRate >= 90 ? 'bg-green-500' :
                    program.utilizationRate >= 75 ? 'bg-blue-500' :
                    program.utilizationRate >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${program.utilizationRate}%` }}
                />
              </div>
              
              {program.utilizationRate < 75 && (
                <div className="mt-2 text-xs text-gray-600">
                  💡 {Math.round(program.capacity - program.enrolled)} spots available - potential revenue opportunity
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial Impact */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Impact Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Current Monthly Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              ${metrics.financialImpact.currentMonthlyRevenue.toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Revenue at Risk (Overdue)</div>
            <div className="text-2xl font-bold text-red-600">
              ${metrics.financialImpact.revenueAtRisk.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((metrics.financialImpact.revenueAtRisk / metrics.financialImpact.currentMonthlyRevenue) * 100).toFixed(1)}% of revenue
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Utilization Gap Opportunity</div>
            <div className="text-2xl font-bold text-green-600">
              +${metrics.financialImpact.utilizationGap.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              If all programs at 100% capacity
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Potential Monthly Revenue</div>
            <div className="text-2xl font-bold text-purple-600">
              ${metrics.financialImpact.potentialMonthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              At full capacity + on-time payments
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Recommended Actions</h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <div className="font-semibold text-yellow-900 mb-1">Priority: Contract Coverage</div>
            <div className="text-sm text-yellow-800">
              {metrics.contractCoverage.pending + metrics.contractCoverage.notSent} families need contracts. 
              Send automated reminders to increase coverage to 95%+.
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-blue-900 mb-1">Improve: On-Time Payment Rate</div>
            <div className="text-sm text-blue-800">
              Enable auto-pay for {metrics.onTimePayment.breakdown.fair + metrics.onTimePayment.breakdown.poor} families 
              with inconsistent payment history. Could improve rate to 92%+.
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="font-semibold text-green-900 mb-1">Opportunity: Increase Utilization</div>
            <div className="text-sm text-green-800">
              After-School program at 30% capacity. Targeted marketing could add $3,000-5,000/month in revenue.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalMetrics;

