import React, { useState, useEffect } from 'react';
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
  GENERAL: 'general'
};

const PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export default function ActionCenter() {
  const emit = useEventEmit();
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, urgent, today, thisWeek

  useEffect(() => {
    analytics.trackPageView('action-center');
    loadActions();
  }, []);

  const loadActions = () => {
    // Aggregate actions from all sources
    const allActions = [
      // From Attendance
      {
        id: 'att_1',
        type: ACTION_TYPES.ATTENDANCE,
        priority: PRIORITY.HIGH,
        title: 'Call Ethan Brown\'s Family',
        description: '2 absences in last 2 weeks',
        dueDate: 'Today',
        family: 'Brown',
        student: 'Ethan Brown',
        phone: '555-0501',
        email: 'amanda@email.com',
        actions: ['call', 'text', 'email'],
        completed: false,
        source: 'Daily Attendance',
        icon: ExclamationCircleIcon,
        color: 'orange'
      },
      
      // From Recruitment Pipeline
      {
        id: 'rec_1',
        type: ACTION_TYPES.RECRUITMENT,
        priority: PRIORITY.HIGH,
        title: 'Schedule Tour - Johnson Family',
        description: 'New lead from Facebook, very interested',
        dueDate: 'Today',
        family: 'Johnson',
        contact: 'Sarah Johnson',
        phone: '555-0101',
        email: 'sarah@email.com',
        actions: ['text', 'email', 'schedule'],
        completed: false,
        source: 'Recruitment Pipeline',
        icon: CalendarIcon,
        color: 'blue'
      },
      {
        id: 'rec_2',
        type: ACTION_TYPES.RECRUITMENT,
        priority: PRIORITY.MEDIUM,
        title: 'Follow Up - Martinez Family',
        description: 'Interested stage, check on application status',
        dueDate: 'Today',
        family: 'Martinez',
        contact: 'Maria Martinez',
        phone: '555-0201',
        email: 'maria@email.com',
        actions: ['text', 'email'],
        completed: false,
        source: 'Recruitment Pipeline',
        icon: UserGroupIcon,
        color: 'purple'
      },
      {
        id: 'rec_3',
        type: ACTION_TYPES.RECRUITMENT,
        priority: PRIORITY.HIGH,
        title: 'Send Deposit Invoice - Chen Family',
        description: 'Application submitted, ready for deposit',
        dueDate: 'Today',
        family: 'Chen',
        contact: 'Wei Chen',
        phone: '555-0301',
        email: 'wei@email.com',
        actions: ['email', 'sendInvoice'],
        completed: false,
        source: 'Recruitment Pipeline',
        icon: BanknotesIcon,
        color: 'green'
      },
      {
        id: 'rec_4',
        type: ACTION_TYPES.RECRUITMENT,
        priority: PRIORITY.HIGH,
        title: 'Send Enrollment Contract - Williams Family',
        description: 'Deposit paid, ready for contract',
        dueDate: 'Today',
        family: 'Williams',
        contact: 'Lisa Williams',
        phone: '555-0402',
        email: 'lisa@email.com',
        actions: ['email', 'sendContract'],
        completed: false,
        source: 'Recruitment Pipeline',
        icon: DocumentTextIcon,
        color: 'blue'
      },
      {
        id: 'rec_5',
        type: ACTION_TYPES.RECRUITMENT,
        priority: PRIORITY.MEDIUM,
        title: 'Follow Up on Contract - Brown Family',
        description: 'Contract sent 9/18, waiting for signature',
        dueDate: 'Tomorrow',
        family: 'Brown',
        contact: 'Amanda Brown',
        phone: '555-0501',
        email: 'amanda@email.com',
        actions: ['text', 'email'],
        completed: false,
        source: 'Recruitment Pipeline',
        icon: DocumentTextIcon,
        color: 'yellow'
      },
      
      // Celebrations
      {
        id: 'cel_1',
        type: ACTION_TYPES.CELEBRATION,
        priority: PRIORITY.MEDIUM,
        title: 'Emma Johnson\'s Birthday in 3 Days',
        description: 'Send birthday card or call to wish happy birthday',
        dueDate: 'October 3',
        family: 'Johnson',
        student: 'Emma Johnson',
        phone: '555-0101',
        email: 'sarah@email.com',
        actions: ['email', 'text', 'sendCard'],
        completed: false,
        source: 'Student Records',
        icon: CalendarIcon,
        color: 'pink'
      }
    ];

    setActions(allActions);
  };

  const markComplete = (actionId) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, completed: true } : a
    ));
    
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case PRIORITY.URGENT: return 'red';
      case PRIORITY.HIGH: return 'orange';
      case PRIORITY.MEDIUM: return 'yellow';
      case PRIORITY.LOW: return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
          </div>
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

      {/* Action Items */}
      <div className="space-y-3">
        {filteredActions.map(action => {
          const Icon = action.icon;
          const priorityColor = getPriorityColor(action.priority);
          
          return (
            <div key={action.id} className={`bg-white rounded-lg shadow border-l-4 border-${priorityColor}-500 p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-4">
                {/* Left: Action Details */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg bg-${priorityColor}-50 flex-shrink-0`}>
                    <Icon className={`h-6 w-6 text-${priorityColor}-600`} />
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
                    onClick={() => markComplete(action.id)}
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

