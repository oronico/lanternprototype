import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventBus, useEventEmit } from '../../shared/hooks/useEventBus';
import { generateNudges, DEMO_STUDENTS } from '../../data/centralizedMetrics';
import toast from 'react-hot-toast';

/**
 * Action Center - Unified To-Do List
 * 
 * Aggregates actionable items from across the platform:
 * - Attendance follow-ups (call families with absences)
 * - Recruitment actions (schedule tours, send contracts)
 * - Payment follow-ups (collect overdue)
 * - Document renewals (insurance, licenses)
 * - Birthday reminders
 * 
 * Quick Actions:
 * - Check off (mark complete)
 * - Send email (opens composer)
 * - Send text (opens SMS)
 * - Make call (opens phone)
 * - Schedule (adds to calendar)
 */

const ACTION_TYPES = {
  ATTENDANCE: 'attendance',
  RECRUITMENT: 'recruitment',
  PAYMENT: 'payment',
  CELEBRATION: 'celebration',
  DOCUMENT: 'document',
  GENERAL: 'general',
  CONTRACT: 'contract',
  ENROLLMENT: 'enrollment',
  FINANCIAL: 'financial'
};

const PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Helper functions
const determineActions = (nudge) => {
  if (nudge.type === 'contract') return ['email', 'sendContract'];
  if (nudge.type === 'attendance') return ['call', 'text', 'email'];
  if (nudge.type === 'payment') return ['call', 'text', 'email'];
  if (nudge.type === 'financial') return ['view'];
  return ['email'];
};

const getSource = (type) => {
  const sources = {
    contract: 'Document Compliance',
    attendance: 'Daily Attendance',
    payment: 'Payments',
    enrollment: 'Recruitment',
    financial: 'Money Mission',
    fundraising: 'Fundraising Workspace'
  };
  return sources[type] || 'Command Center';
};

const PRIORITY_COLOR = {
  urgent: { border: 'border-red-500', pill: 'bg-red-100 text-red-800', iconBg: 'bg-red-50', icon: 'text-red-600' },
  high: { border: 'border-orange-500', pill: 'bg-orange-100 text-orange-800', iconBg: 'bg-orange-50', icon: 'text-orange-600' },
  medium: { border: 'border-yellow-500', pill: 'bg-yellow-100 text-yellow-800', iconBg: 'bg-yellow-50', icon: 'text-yellow-600' },
  low: { border: 'border-gray-400', pill: 'bg-gray-100 text-gray-800', iconBg: 'bg-gray-50', icon: 'text-gray-500' }
};

export default function ActionCenter() {
  const emit = useEventEmit();
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, urgent, today, thisWeek
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(0);
  const [todayWins, setTodayWins] = useState({
    attendance: false,
    payments: false,
    fundraising: false
  });

  useEffect(() => {
    analytics.trackPageView('action-center');
    loadActions();
    const storedCompleted = localStorage.getItem('action_center_completed_today');
    if (storedCompleted) setCompletedToday(parseInt(storedCompleted));
    const storedWins = localStorage.getItem('action_center_wins');
    if (storedWins) setTodayWins(JSON.parse(storedWins));
  }, []);

  const loadActions = () => {
    try {
      const generatedNudges = generateNudges();
      const iconMap = {
        contract: DocumentTextIcon,
        attendance: ExclamationCircleIcon,
        payment: BanknotesIcon,
        enrollment: UserGroupIcon,
        financial: BanknotesIcon,
        fundraising: BanknotesIcon,
        celebration: CalendarIcon
      };

      const actionPayload = generatedNudges.map((nudge, index) => ({
        id: `${nudge.type}_${index}`,
        type: nudge.type,
        priority: nudge.priority === 'urgent' ? PRIORITY.URGENT : nudge.priority,
        title: nudge.title,
        description: nudge.description || '',
        dueDate: nudge.priority === 'urgent' ? 'Today' : 'This Week',
        family: nudge.family || '',
        student: nudge.student || '',
        phone: nudge.phone || '',
        email: nudge.email || '',
        actions: determineActions(nudge),
        completed: false,
        source: getSource(nudge.type),
        icon: iconMap[nudge.type] || ExclamationCircleIcon,
        color: nudge.priority
      }));

      setActions(actionPayload);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (actionId, meta = {}) => {
    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, completed: true } : a))
    );

    const updatedCount = completedToday + 1;
    setCompletedToday(updatedCount);
    localStorage.setItem('action_center_completed_today', String(updatedCount));

    if (meta.type && todayWins[meta.type] === false) {
      const updatedWins = { ...todayWins, [meta.type]: true };
      setTodayWins(updatedWins);
      localStorage.setItem('action_center_wins', JSON.stringify(updatedWins));
    }
    
    analytics.trackFeatureUsage('actionCenter', 'mark_complete', {
      actionId: actionId
    });
    
    toast.success('Action completed! ✅');
    
    emit('action.completed', { actionId });
  };

  const sendEmail = (action) => {
    const subject = encodeURIComponent(action.title);
    const body = encodeURIComponent(`Hi ${action.contact || action.family},\n\n${action.description}\n\nBest,\nSchool Team`);
    window.location.href = `mailto:${action.email}?subject=${subject}&body=${body}`;
    
    analytics.trackFeatureUsage('actionCenter', 'send_email', {
      actionType: action.type,
      actionId: action.id
    });
  };

  const sendText = (action) => {
    // In production, would open SMS composer or Twilio integration
    const message = `Hi ${action.contact || action.family}! ${action.description}`;
    
    analytics.trackFeatureUsage('actionCenter', 'send_text', {
      actionType: action.type,
      actionId: action.id
    });
    
    toast.success(`Opening text to ${action.phone}...`);
    // window.location.href = `sms:${action.phone}&body=${encodeURIComponent(message)}`;
  };

  const makeCall = (action) => {
    analytics.trackFeatureUsage('actionCenter', 'make_call', {
      actionType: action.type,
      actionId: action.id
    });
    
    toast.success(`Calling ${action.phone}...`);
    window.location.href = `tel:${action.phone}`;
  };

  const sendInvoice = (action) => {
    analytics.trackFeatureUsage('actionCenter', 'send_invoice', {
      actionId: action.id
    });
    
    toast.success('Deposit invoice sent to ' + action.email);
    markComplete(action.id);
  };

  const sendContract = (action) => {
    analytics.trackFeatureUsage('actionCenter', 'send_contract', {
      actionId: action.id
    });
    
    toast.success('Enrollment contract sent to ' + action.email);
    markComplete(action.id);
  };

  const sendCard = (action) => {
    analytics.trackFeatureUsage('actionCenter', 'send_birthday_card', {
      actionId: action.id
    });
    
    toast.success('Birthday card reminder set!');
    markComplete(action.id);
  };

  const filteredActions = actions.filter(a => {
    if (a.completed) return false;
    
    if (filter === 'urgent') {
      return a.priority === PRIORITY.URGENT || a.priority === PRIORITY.HIGH;
    }
    if (filter === 'today') {
      return a.dueDate === 'Today';
    }
    if (filter === 'thisWeek') {
      return a.dueDate === 'Today' || a.dueDate === 'Tomorrow' || a.dueDate.includes('days');
    }
    return true;
  });

  const urgentCount = actions.filter(a => !a.completed && (a.priority === PRIORITY.URGENT || a.priority === PRIORITY.HIGH)).length;
  const todayCount = actions.filter(a => !a.completed && a.dueDate === 'Today').length;
  const totalCount = actions.filter(a => !a.completed).length;

  const encouragementCopy = useMemo(() => {
    if (loading) return 'Loading your nudges...';
    if (totalCount === 0) return 'All caught up! Enjoy the calm. 🌤️';
    if (urgentCount > 0) return 'Tackle the red badges first—then celebrate!';
    if (todayCount > 0) return 'A few quick wins and you’ll be done. 💪';
    return 'Keep the rhythm going—consistency compounds.';
  }, [loading, totalCount, urgentCount, todayCount]);

  const winChips = [
    { key: 'attendance', label: 'Daily attendance done' },
    { key: 'payments', label: 'Payments checked' },
    { key: 'fundraising', label: 'Fundraising touch' }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary-200 border-t-primary-600 rounded-full mb-4"></div>
          <p className="text-sm text-gray-600">Pulling the latest nudges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Action Center</h1>
              <p className="text-gray-600">All your to-dos in one place</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600">actions pending</div>
            {completedToday > 0 && (
              <div className="text-xs text-primary-600 mt-1">{completedToday} wins today 🎉</div>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">{encouragementCopy}</p>
      </div>

      {/* Daily wins meter */}
      <div className="bg-gradient-to-r from-primary-50 via-white to-indigo-50 border border-primary-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-600">Daily rhythm</p>
            <h3 className="text-lg font-semibold text-gray-900">3 wins to protect each day</h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">
              {Object.values(todayWins).filter(Boolean).length}/3
            </p>
            <p className="text-xs text-gray-500">Complete them for a perfect day</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {winChips.map((chip) => (
            <span
              key={chip.key}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                todayWins[chip.key]
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {todayWins[chip.key] ? '✓ ' : '○ '}
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'urgent'
              ? 'bg-red-600 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Urgent ({urgentCount})
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'today'
              ? 'bg-orange-600 text-white'
              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
          }`}
        >
          Today ({todayCount})
        </button>
      </div>

      {/* Encouragement banner */}
      <div className="bg-white border border-primary-100 rounded-xl p-5">
        <p className="text-sm text-gray-700">{encouragementCopy}</p>
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        {filteredActions.map(action => {
          const Icon = action.icon;
          const priorityStyles = PRIORITY_COLOR[action.priority] || PRIORITY_COLOR.low;
          
          return (
            <div key={action.id} className={`bg-white rounded-lg shadow border-l-4 ${priorityStyles.border} p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-4">
                {/* Left: Action Details */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${priorityStyles.iconBg} flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${priorityStyles.icon}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        action.priority === PRIORITY.URGENT ? 'bg-red-100 text-red-800' :
                        action.priority === PRIORITY.HIGH ? 'bg-orange-100 text-orange-800' :
                        action.priority === PRIORITY.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {action.dueDate}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Family: {action.family}</span>
                      {action.student && <span>Student: {action.student}</span>}
                      <span className="text-gray-400">•</span>
                      <span>From: {action.source}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Contact Actions */}
                  <div className="flex gap-1">
                    {action.actions.includes('call') && (
                      <button
                        onClick={() => makeCall(action)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition-colors"
                        title={`Call ${action.phone}`}
                      >
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {action.actions.includes('text') && (
                      <button
                        onClick={() => sendText(action)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        title="Send text"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {action.actions.includes('email') && (
                      <button
                        onClick={() => sendEmail(action)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-500 hover:text-purple-600 transition-colors"
                        title={`Email ${action.email}`}
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Special Actions */}
                  {action.actions.includes('sendInvoice') && (
                    <button
                      onClick={() => sendInvoice(action)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Send Invoice
                    </button>
                  )}
                  
                  {action.actions.includes('sendContract') && (
                    <button
                      onClick={() => sendContract(action)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Send Contract
                    </button>
                  )}
                  
                  {action.actions.includes('schedule') && (
                    <button
                      onClick={() => {
                        toast.success('Opening calendar...');
                        markComplete(action.id);
                      }}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                    >
                      Schedule
                    </button>
                  )}
                  
                  {action.actions.includes('sendCard') && (
                    <button
                      onClick={() => sendCard(action)}
                      className="px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
                    >
                      Send Card
                    </button>
                  )}

                  {/* Mark Complete */}
                  <button
                    onClick={() => markComplete(action.id, { type: action.type })}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-colors"
                    title="Mark complete"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => {
                      setActions(prev => prev.filter(a => a.id !== action.id));
                      toast('Action dismissed');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Dismiss"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up! 🎉</h3>
          <p className="text-gray-600">No pending actions right now.</p>
        </div>
      )}
    </div>
  );
}

