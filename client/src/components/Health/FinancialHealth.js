import React, { useState, useEffect } from 'react';
import { 
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { healthAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FinancialHealth = () => {
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadScorecard();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadScorecard, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadScorecard = async () => {
    try {
      const response = await healthAPI.getScorecard();
      setScorecard(response.data);
    } catch (error) {
      toast.error('Failed to load financial health scorecard');
    } finally {
      setLoading(false);
    }
  };

  const getOverallScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallScoreBackground = (score) => {
    if (score >= 85) return 'bg-green-50 border-success-300';
    if (score >= 70) return 'bg-blue-50 border-primary-300';
    if (score >= 55) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeartIcon className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Health Scorecard</h1>
              <p className="text-gray-600">Real-time monitoring of key financial metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {autoRefresh ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
            </button>
            <span className="text-sm text-gray-500">
              Updated: {new Date(scorecard?.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`mb-8 p-6 rounded-lg border-2 ${getOverallScoreBackground(scorecard?.overallScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Overall Financial Health Score</h2>
            <div className="flex items-center space-x-4">
              <div className={`text-4xl font-bold ${getOverallScoreColor(scorecard?.overallScore)}`}>
                {scorecard?.overallScore}
              </div>
              <div className="text-sm text-gray-600">
                <div className="capitalize font-medium">{scorecard?.overallStatus}</div>
                <div>Out of 100</div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2">Score Breakdown</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Critical Issues:</span>
                <span className="font-medium text-red-600">{scorecard?.criticalMetrics?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Warnings:</span>
                <span className="font-medium text-yellow-600">{scorecard?.warningMetrics?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Good Performance:</span>
                <span className="font-medium text-green-600">{scorecard?.excellentMetrics?.length + scorecard?.goodMetrics?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Metrics Alert */}
      {scorecard?.criticalMetrics?.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">
              Critical Issues Require Immediate Attention
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-700">
            {scorecard.criticalMetrics.length} metrics are in critical status and need immediate action.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Critical Metrics */}
        {scorecard?.criticalMetrics?.map((metric, index) => (
          <MetricCard key={`critical-${index}`} metric={metric} priority="critical" />
        ))}
        
        {/* Warning Metrics */}
        {scorecard?.warningMetrics?.map((metric, index) => (
          <MetricCard key={`warning-${index}`} metric={metric} priority="warning" />
        ))}
        
        {/* Good Metrics */}
        {scorecard?.goodMetrics?.map((metric, index) => (
          <MetricCard key={`good-${index}`} metric={metric} priority="good" />
        ))}
        
        {/* Excellent Metrics */}
        {scorecard?.excellentMetrics?.map((metric, index) => (
          <MetricCard key={`excellent-${index}`} metric={metric} priority="excellent" />
        ))}
      </div>

      {/* Quick Insights */}
      {scorecard?.insights?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scorecard.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                    <p className="text-sm font-medium text-gray-800 mt-2">{insight.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Actions */}
      {scorecard?.urgentActions?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Actions</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {scorecard.urgentActions.map((action, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          action.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {action.priority} priority
                        </span>
                        <span className="text-sm text-gray-500">{action.timeframe}</span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900">{action.metric}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.action}</p>
                      <div className="mt-3 flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-500">Current:</span>
                          <span className="ml-1 font-medium">{action.currentValue}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <span className="ml-1 font-medium text-green-600">{action.targetValue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ metric, priority }) => {
  const getStatusColor = (status) => {
    const colors = {
      excellent: 'text-green-700 bg-green-100 border-success-300',
      good: 'text-blue-700 bg-blue-100 border-primary-300',
      warning: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      danger: 'text-red-700 bg-red-100 border-red-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      excellent: CheckCircleIcon,
      good: CheckCircleIcon,
      warning: ExclamationTriangleIcon,
      danger: ExclamationTriangleIcon
    };
    const Icon = icons[status] || InformationCircleIcon;
    return <Icon className="h-5 w-5" />;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (trend === 'declining') return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className={`bg-white rounded-lg shadow card-shadow p-6 border-l-4 ${
      priority === 'critical' ? 'border-red-500' :
      priority === 'warning' ? 'border-yellow-500' :
      priority === 'good' ? 'border-blue-500' : 'border-green-500'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
        <div className="flex items-center space-x-2">
          {getTrendIcon(metric.trend)}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
            {getStatusIcon(metric.status)}
            <span className="ml-1 capitalize">{metric.status}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900">{metric.displayValue}</div>
        <div className="text-sm text-gray-600">
          Target: {metric.unit === '%' ? Math.round(metric.target * 100) + '%' : 
                   metric.unit === '$' ? `$${metric.target.toLocaleString()}` : 
                   metric.target + (metric.unit || '')}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-3" title={metric.calculation}>
        {metric.calculation}
      </div>
      
      <div className="text-sm text-gray-700">
        {metric.recommendation}
      </div>
    </div>
  );
};

const getInsightColor = (type) => {
  const colors = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    opportunity: 'bg-blue-50 border-primary-300',
    positive: 'bg-green-50 border-success-300'
  };
  return colors[type] || 'bg-gray-50 border-gray-200';
};

const getInsightIcon = (type) => {
  const icons = {
    critical: <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    opportunity: <ChartBarIcon className="h-5 w-5 text-blue-500" />,
    positive: <CheckCircleIcon className="h-5 w-5 text-green-500" />
  };
  return icons[type] || <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
};

export default FinancialHealth;
