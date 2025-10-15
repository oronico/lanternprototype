import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ChiefOfStaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    loadBackOfficeData();
  }, []);

  const loadBackOfficeData = async () => {
    // Mock data - replace with API calls
    setTasks([
      {
        id: 1,
        title: 'Review and approve November payroll',
        category: 'payroll',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2),
        assignedTo: 'You',
        status: 'pending',
        estimatedTime: '15 min'
      },
      {
        id: 2,
        title: 'Renew workers comp insurance',
        category: 'insurance',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 86400000 * 15),
        assignedTo: 'You',
        status: 'pending',
        estimatedTime: '30 min'
      },
      {
        id: 3,
        title: 'Follow up on 3 overdue tuition payments',
        category: 'revenue',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000),
        assignedTo: 'You',
        status: 'in-progress',
        estimatedTime: '20 min'
      },
      {
        id: 4,
        title: 'Submit Q4 state enrollment report',
        category: 'compliance',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 7),
        assignedTo: 'You',
        status: 'pending',
        estimatedTime: '45 min'
      },
      {
        id: 5,
        title: 'Schedule fire safety inspection',
        category: 'facilities',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 30),
        assignedTo: 'You',
        status: 'pending',
        estimatedTime: '10 min'
      }
    ]);

    setCompliance([
      {
        id: 1,
        item: 'State Operating License',
        status: 'active',
        expiryDate: new Date('2025-08-31'),
        daysUntilExpiry: 290,
        category: 'license'
      },
      {
        id: 2,
        item: 'General Liability Insurance',
        status: 'active',
        expiryDate: new Date('2025-01-14'),
        daysUntilExpiry: 60,
        category: 'insurance'
      },
      {
        id: 3,
        item: 'Workers Comp Insurance',
        status: 'expiring-soon',
        expiryDate: new Date('2024-12-31'),
        daysUntilExpiry: 46,
        category: 'insurance'
      },
      {
        id: 4,
        item: 'Fire Safety Certificate',
        status: 'expiring-soon',
        expiryDate: new Date('2025-03-14'),
        daysUntilExpiry: 120,
        category: 'safety'
      },
      {
        id: 5,
        item: 'Commercial Lease',
        status: 'active',
        expiryDate: new Date('2025-07-31'),
        daysUntilExpiry: 260,
        category: 'facilities'
      }
    ]);

    setMetrics({
      bookkeeping: {
        transactionsProcessed: 270,
        needsReview: 12,
        accuracyRate: 95.6,
        lastSync: new Date()
      },
      documents: {
        total: 68,
        expiringSoon: 3,
        compliant: 65
      },
      cash: {
        current: 14200,
        daysCash: 22,
        upcomingObligations: 24500
      },
      operations: {
        openTasks: 12,
        completedThisWeek: 8,
        avgCompletionTime: '2.3 days'
      }
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[priority] || colors.medium;
  };

  const getComplianceStatus = (status) => {
    const statuses = {
      active: { color: 'text-green-600', icon: CheckCircleIcon, label: 'Active' },
      'expiring-soon': { color: 'text-yellow-600', icon: ExclamationTriangleIcon, label: 'Expiring Soon' },
      expired: { color: 'text-red-600', icon: ExclamationTriangleIcon, label: 'Expired' }
    };
    return statuses[status] || statuses.active;
  };

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
  const expiringCompliance = compliance.filter(c => c.status === 'expiring-soon' || c.status === 'expired');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Back Office Command Center</h1>
        <p className="text-lg text-gray-600">
          Your Chief of Staff dashboard - everything you need to manage your school's operations
        </p>
      </div>

      {/* Critical Alerts */}
      {(urgentTasks.length > 0 || expiringCompliance.length > 0) && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-3">⚠️ Urgent Items Requiring Attention</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentTasks.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-red-800 mb-2">High Priority Tasks:</div>
                    <ul className="space-y-1">
                      {urgentTasks.slice(0, 3).map(task => (
                        <li key={task.id} className="text-sm text-red-700">
                          • {task.title} (Due: {task.dueDate.toLocaleDateString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {expiringCompliance.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-red-800 mb-2">Expiring Documents:</div>
                    <ul className="space-y-1">
                      {expiringCompliance.slice(0, 3).map(item => (
                        <li key={item.id} className="text-sm text-red-700">
                          • {item.item} ({item.daysUntilExpiry} days left)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Bookkeeping Status */}
        <Link to="/bookkeeping" className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <BanknotesIcon className="h-8 w-8 text-green-600" />
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {metrics.bookkeeping?.accuracyRate}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.bookkeeping?.transactionsProcessed}</div>
          <div className="text-sm text-gray-600">Transactions Auto-Categorized</div>
          {metrics.bookkeeping?.needsReview > 0 && (
            <div className="text-xs text-yellow-600 mt-2">
              {metrics.bookkeeping.needsReview} need review
            </div>
          )}
        </Link>

        {/* Document Compliance */}
        <Link to="/documents/repository" className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            {metrics.documents?.expiringSoon > 0 && (
              <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {metrics.documents.expiringSoon} expiring
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.documents?.total}</div>
          <div className="text-sm text-gray-600">Documents Organized</div>
          <div className="text-xs text-green-600 mt-2">
            {metrics.documents?.compliant} compliant
          </div>
        </Link>

        {/* Cash Position */}
        <Link to="/cash-reality" className="bg-white rounded-xl shadow-md p-6 border-2 border-purple-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {metrics.cash?.daysCash} days
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">${metrics.cash?.current?.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Current Cash</div>
          <div className="text-xs text-gray-500 mt-2">
            ${metrics.cash?.upcomingObligations?.toLocaleString()} due (30d)
          </div>
        </Link>

        {/* Task Completion */}
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="h-8 w-8 text-amber-600" />
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {metrics.operations?.openTasks} open
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.operations?.completedThisWeek}</div>
          <div className="text-sm text-gray-600">Tasks Completed This Week</div>
          <div className="text-xs text-gray-500 mt-2">
            Avg: {metrics.operations?.avgCompletionTime}
          </div>
        </div>
      </div>

      {/* Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📋 Your Tasks</h2>
            <span className="text-sm font-medium text-gray-600">
              {tasks.filter(t => t.status === 'pending').length} pending
            </span>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 ${getPriorityColor(task.priority)} hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{task.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <CalendarIcon className="inline h-3 w-3 mr-1" />
                      Due: {task.dueDate.toLocaleDateString()} • {task.estimatedTime}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    task.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize text-gray-600">
                    {task.category}
                  </span>
                  {task.priority === 'urgent' && (
                    <span className="text-xs font-bold text-red-600 animate-pulse">
                      🔥 URGENT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Tasks →
          </button>
        </div>

        {/* Compliance Calendar */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📅 Compliance & Renewals</h2>
            <Link to="/documents/repository" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {compliance.slice(0, 5).map((item) => {
              const statusConfig = getComplianceStatus(item.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.item}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Expires: {item.expiryDate.toLocaleDateString()}
                      </div>
                    </div>
                    <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium capitalize text-gray-600">
                      {item.category}
                    </span>
                    <span className={`text-xs font-medium ${
                      item.daysUntilExpiry <= 30 ? 'text-red-600' :
                      item.daysUntilExpiry <= 90 ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {item.daysUntilExpiry} days left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border-2 border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          🚀 Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/bookkeeping"
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center"
          >
            <BanknotesIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">Review Bookkeeping</div>
          </Link>

          <Link 
            to="/reports/bank-ready"
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center"
          >
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">Generate Reports</div>
          </Link>

          <Link 
            to="/documents/repository"
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center"
          >
            <ShieldCheckIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">Check Compliance</div>
          </Link>

          <Link 
            to="/cash-reality"
            className="p-4 bg-white rounded-lg hover:shadow-md transition-all text-center"
          >
            <ArrowTrendingUpIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">View Cash Forecast</div>
          </Link>
        </div>
      </div>

      {/* AI Chief of Staff Insights */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">AI Chief of Staff Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-blue-900 mb-1">Cash Flow Optimization</div>
            <div className="text-sm text-blue-800">
              You have $4,915 in outstanding receivables. Collecting these would increase your days cash from 22 to 25 days. 
              <button className="text-blue-600 font-medium ml-1 hover:underline">Send reminders now →</button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="font-semibold text-amber-900 mb-1">Renewal Alert</div>
            <div className="text-sm text-amber-800">
              Workers comp insurance expires in 46 days. Early renewal (30+ days) typically saves 5-10% on premiums.
              <button className="text-amber-600 font-medium ml-1 hover:underline">Get quote now →</button>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="font-semibold text-green-900 mb-1">Great Job! 🎉</div>
            <div className="text-sm text-green-800">
              You completed 8 tasks this week - 33% faster than your average. Your operational efficiency is improving!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiefOfStaffDashboard;

