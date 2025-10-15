import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

const NudgeCenter = ({ schoolId }) => {
  const [nudges, setNudges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'urgent', 'info'

  useEffect(() => {
    loadNudges();
    checkForCelebrations();
  }, [schoolId]);

  const loadNudges = async () => {
    // Mock data - replace with API call
    const mockNudges = [
      {
        id: 1,
        type: 'daily-check-in',
        urgency: 'info',
        title: 'Good morning! Ready to tackle today?',
        message: "Let's review your financial priorities for the day.",
        actionItems: [
          { text: 'Review today\'s expected payments ($1,749)', actionType: 'link', actionUrl: '/payments' },
          { text: 'Follow up on 2 overdue invoices', actionType: 'link', actionUrl: '/payments?filter=overdue' }
        ],
        delivered: true,
        read: false,
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'cash-flow-warning',
        urgency: 'warning',
        title: 'Cash position declining next week',
        message: 'Your 5-day forecast shows a potential cash shortfall on Monday. You have $2,250 in expenses due but only $1,246 projected in your account.',
        actionItems: [
          { text: 'View cash flow forecast', actionType: 'link', actionUrl: '/dashboard' },
          { text: 'Accelerate collections', actionType: 'button', actionUrl: '/payments/collect' },
          { text: 'Review expense timing', actionType: 'link', actionUrl: '/expenses' }
        ],
        context: {
          currentValue: 1246,
          targetValue: 2250,
          trend: 'declining',
          relatedMetric: 'cash-balance'
        },
        delivered: true,
        read: false,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 3,
        type: 'enrollment-opportunity',
        urgency: 'reminder',
        title: '4 students away from target enrollment',
        message: 'You\'re at 28/32 students. Reaching your target would add $4,000-6,000 in monthly revenue and enable sustainable owner compensation.',
        actionItems: [
          { text: 'View enrollment playbook', actionType: 'link', actionUrl: '/playbooks/enrollment' },
          { text: 'Review pipeline', actionType: 'link', actionUrl: '/enrollment' }
        ],
        context: {
          currentValue: 28,
          targetValue: 32,
          trend: 'stable'
        },
        delivered: true,
        read: false,
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 4,
        type: 'milestone-progress',
        urgency: 'info',
        title: '🎯 Milestone progress: 30 Days Cash',
        message: 'You\'re 8 days away from reaching your 30-day cash reserve goal! Current: 22 days. Keep up the great work!',
        actionItems: [
          { text: 'View all milestones', actionType: 'link', actionUrl: '/milestones' }
        ],
        context: {
          currentValue: 22,
          targetValue: 30,
          trend: 'improving'
        },
        delivered: true,
        read: false,
        timestamp: new Date(Date.now() - 86400000)
      }
    ];

    setNudges(mockNudges);
  };

  const checkForCelebrations = async () => {
    // Mock - check if any milestones were recently achieved
    // In production, this would be an API call
    const recentMilestone = null; // Set to milestone data if achieved
    
    if (recentMilestone) {
      celebrateMilestone(recentMilestone);
    }
  };

  const celebrateMilestone = (milestone) => {
    setCelebrationData(milestone);
    setShowConfetti(true);
    
    // Stop confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    toast.custom((t) => (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <TrophyIcon className="h-8 w-8" />
          <div>
            <div className="font-bold text-lg">🎉 Milestone Achieved!</div>
            <div className="text-sm">{milestone.title}</div>
          </div>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const getUrgencyConfig = (urgency) => {
    const configs = {
      critical: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        icon: ExclamationTriangleIcon,
        badge: 'Critical'
      },
      urgent: {
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        icon: ExclamationTriangleIcon,
        badge: 'Urgent'
      },
      warning: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600',
        icon: ExclamationTriangleIcon,
        badge: 'Warning'
      },
      reminder: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600',
        icon: InformationCircleIcon,
        badge: 'Reminder'
      },
      info: {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        textColor: 'text-gray-800',
        iconColor: 'text-gray-600',
        icon: InformationCircleIcon,
        badge: 'Info'
      }
    };
    
    return configs[urgency] || configs.info;
  };

  const markAsRead = async (nudgeId) => {
    // API call to mark as read
    setNudges(prev => prev.map(n => 
      n.id === nudgeId ? { ...n, read: true } : n
    ));
  };

  const dismissNudge = async (nudgeId) => {
    // API call to dismiss
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
    toast.success('Nudge dismissed');
  };

  const filteredNudges = nudges.filter(nudge => {
    if (filter === 'urgent') {
      return ['critical', 'urgent', 'warning'].includes(nudge.urgency);
    }
    if (filter === 'info') {
      return ['info', 'reminder'].includes(nudge.urgency);
    }
    return true;
  });

  const unreadCount = nudges.filter(n => !n.read).length;
  const urgentCount = nudges.filter(n => ['critical', 'urgent', 'warning'].includes(n.urgency)).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Confetti for celebrations */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <TrophyIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Congratulations! 🎉
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {celebrationData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {celebrationData.message}
            </p>
            <button
              onClick={() => setCelebrationData(null)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Daily Guidance</h1>
              <p className="text-sm text-gray-600">
                {unreadCount} unread • {urgentCount} requiring attention
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'urgent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Urgent ({urgentCount})
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'info'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Nudges List */}
      <div className="space-y-4">
        {filteredNudges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You're all caught up! 🎉</p>
          </div>
        ) : (
          filteredNudges.map((nudge) => {
            const config = getUrgencyConfig(nudge.urgency);
            const Icon = config.icon;
            const isUnread = !nudge.read;
            
            return (
              <div
                key={nudge.id}
                className={`relative p-5 rounded-xl border-2 transition-all ${config.bgColor} ${config.borderColor} ${
                  isUnread ? 'shadow-md' : 'opacity-75'
                }`}
                onClick={() => !nudge.read && markAsRead(nudge.id)}
              >
                {/* Unread indicator */}
                {isUnread && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Dismiss button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNudge(nudge.id);
                  }}
                  className="absolute top-4 right-10 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg bg-white/50`}>
                    <Icon className={`h-6 w-6 ${config.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.textColor} bg-white/50`}>
                        {config.badge}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(nudge.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-lg font-bold ${config.textColor} mb-2`}>
                      {nudge.title}
                    </h3>

                    {/* Message */}
                    <p className={`text-sm ${config.textColor} mb-4`}>
                      {nudge.message}
                    </p>

                    {/* Context (if available) */}
                    {nudge.context && (
                      <div className="flex items-center space-x-4 mb-4 p-3 bg-white/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Current</div>
                          <div className="text-lg font-bold text-gray-900">
                            {nudge.context.currentValue?.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Target</div>
                          <div className="text-lg font-bold text-gray-900">
                            {nudge.context.targetValue?.toLocaleString()}
                          </div>
                        </div>
                        {nudge.context.trend && (
                          <div className="ml-auto">
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              nudge.context.trend === 'improving' ? 'bg-green-100 text-green-700' :
                              nudge.context.trend === 'declining' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {nudge.context.trend === 'improving' ? '📈' : nudge.context.trend === 'declining' ? '📉' : '➡️'} 
                              {' '}{nudge.context.trend}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Items */}
                    {nudge.actionItems && nudge.actionItems.length > 0 && (
                      <div className="space-y-2">
                        {nudge.actionItems.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to action URL
                              window.location.href = action.actionUrl;
                            }}
                            className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 transition-all"
                          >
                            {action.text} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Daily Affirmation */}
      <div className="mt-8 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
        <div className="flex items-start space-x-3">
          <HeartIcon className="h-6 w-6 text-pink-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">💪 You've got this!</h3>
            <p className="text-sm text-gray-700">
              Managing a school's finances is challenging work. Remember: every small step forward is progress. 
              You're building something meaningful for your students and community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NudgeCenter;

