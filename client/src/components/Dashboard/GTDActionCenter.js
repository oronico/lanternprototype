import React, { useState, useEffect } from 'react';
import {
  PhoneIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { generateNudges } from '../../data/centralizedMetrics';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

/**
 * GTD Action Center - David Allen's Getting Things Done
 * 
 * Organizes by ACTION TYPE (not just priority):
 * - To Call (phone calls needed)
 * - To Email (emails to send)
 * - To Do (tasks to complete)
 * - Deadlines (time-sensitive)
 * - Financial Suggestions (opportunities)
 * 
 * Plus: Checkboxes, celebrations, encouragement!
 */

export default function GTDActionCenter() {
  const [actions, setActions] = useState([]);
  const [archivedActions, setArchivedActions] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    analytics.trackPageView('gtd-action-center');
    loadActions();
    loadCompletedActions();
    
    // Load completed count for today
    const today = new Date().toDateString();
    const savedCompleted = localStorage.getItem(`completed_${today}`);
    if (savedCompleted) {
      setCompletedToday(parseInt(savedCompleted));
    }
  }, []);

  const loadCompletedActions = () => {
    const archived = JSON.parse(localStorage.getItem('completedActions') || '[]');
    setArchivedActions(archived);
  };

  const loadActions = () => {
    const generatedNudges = generateNudges();
    
    // Organize into GTD categories
    const allActions = [
      // To Call
      {
        id: 'call_1',
        type: 'call',
        title: 'Call Evelyn Jackson\'s Family',
        description: '6 absences + payment past due',
        phone: '555-1901',
        priority: 'high',
        completed: false
      },
      {
        id: 'call_2',
        type: 'call',
        title: 'Call Ethan Brown\'s Family',
        description: '4 absences this month',
        phone: '555-0801',
        priority: 'medium',
        completed: false
      },
      
      // To Email
      {
        id: 'email_1',
        type: 'email',
        title: 'Send Enrollment Contract - Mia Chen',
        description: 'Missing contract, family is ready',
        email: 'wei.c@email.com',
        priority: 'high',
        completed: false
      },
      {
        id: 'email_2',
        type: 'email',
        title: 'Send Handbook - Isabella Garcia',
        description: 'Missing signed handbook',
        email: 'rosa.g@email.com',
        priority: 'medium',
        completed: false
      },
      {
        id: 'email_3',
        type: 'email',
        title: 'Send Handbook - James Thompson',
        description: 'Missing signed handbook',
        email: 'robert.t@email.com',
        priority: 'medium',
        completed: false
      },
      
      // To Do
      {
        id: 'todo_1',
        type: 'todo',
        title: 'Take Daily Attendance',
        description: 'Mark present/tardy/absent for 24 students',
        priority: 'high',
        completed: false,
        estimatedTime: '5 min'
      },
      {
        id: 'todo_2',
        type: 'todo',
        title: 'Review Recruitment Pipeline',
        description: '5 families need follow-up',
        priority: 'medium',
        completed: false,
        estimatedTime: '15 min'
      },
      
      // Deadlines
      {
        id: 'deadline_1',
        type: 'deadline',
        title: 'Insurance Renewal',
        description: 'All 3 policies expire Dec 31',
        dueDate: '2024-12-31',
        daysUntil: 47,
        priority: 'high',
        completed: false
      },
      {
        id: 'deadline_2',
        type: 'deadline',
        title: 'Quarterly Tax Payment',
        description: '1040-ES estimated tax due',
        dueDate: '2025-01-15',
        daysUntil: 62,
        priority: 'medium',
        completed: false
      },
      
      // Financial Suggestions
      {
        id: 'financial_1',
        type: 'financial',
        title: 'Build to 30 Days Cash',
        description: 'You\'re at 22 days - save $4,400 to reach goal',
        impact: 'High',
        difficulty: 'Medium',
        completed: false
      },
      {
        id: 'financial_2',
        type: 'financial',
        title: 'Negotiate Facility Costs',
        description: 'At 41% of revenue, target is 25%. Shop utilities & insurance.',
        impact: 'High',
        difficulty: 'Medium',
        completed: false
      },
      {
        id: 'financial_3',
        type: 'financial',
        title: 'Enroll 11 More Students',
        description: 'Reach 35-student goal = $9k more monthly revenue',
        impact: 'Very High',
        difficulty: 'High',
        completed: false
      }
    ];
    
    setActions(allActions);
  };

  const handleComplete = (actionId) => {
    const completedAction = actions.find(a => a.id === actionId);
    if (!completedAction) return;
    
    // Mark as completed
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, completed: true } : a
    ));
    
    // Archive the completed action
    const archivedAction = {
      ...completedAction,
      completedAt: new Date().toISOString(),
      completedDate: new Date().toLocaleDateString()
    };
    
    const newArchived = [archivedAction, ...archivedActions].slice(0, 50); // Keep last 50
    setArchivedActions(newArchived);
    localStorage.setItem('completedActions', JSON.stringify(newArchived));
    
    // Track completion
    const newCount = completedToday + 1;
    setCompletedToday(newCount);
    
    const today = new Date().toDateString();
    localStorage.setItem(`completed_${today}`, newCount.toString());
    
    analytics.trackFeatureUsage('gtdActionCenter', 'complete_action', {
      actionType: completedAction.type
    });
    
    toast.success('Nice work! ✅');
    
    // Celebration at milestones
    if (newCount === 3) {
      celebrate('3 actions done! You\'re on a roll! 🔥');
    } else if (newCount === 5) {
      celebrate('5 actions completed! Crushing it! 💪');
    } else if (newCount === 10) {
      celebrate('10 actions! You\'re a productivity legend! 🏆');
    }
  };

  const celebrate = (message) => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
    toast.success(message, { duration: 4000 });
  };

  const toCalls = actions.filter(a => a.type === 'call' && !a.completed);
  const toEmails = actions.filter(a => a.type === 'email' && !a.completed);
  const toDos = actions.filter(a => a.type === 'todo' && !a.completed);
  const deadlines = actions.filter(a => a.type === 'deadline' && !a.completed);
  const financialSuggestions = actions.filter(a => a.type === 'financial' && !a.completed);
  
  const totalActions = actions.filter(a => !a.completed).length;
  const completedActions = actions.filter(a => a.completed).length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
              <p className="text-gray-600">Your progress, goals, and actions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              {showArchive ? 'Hide' : 'Show'} Completed ({archivedActions.length})
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{completedToday}</div>
              <div className="text-sm text-gray-600">done today! 🎉</div>
            </div>
          </div>
        </div>
      </div>

      {/* Noom-Style Streaks - KEEP THESE! */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Login Streak</span>
            <FireIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">15</div>
          <div className="text-sm opacity-90">days in a row! 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Actions Completed</span>
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{completedToday}</div>
          <div className="text-sm opacity-90">today! ✅</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Building Reserve</span>
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">22</div>
          <div className="text-sm opacity-90">days cash 💪</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Enrollment Progress</span>
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">69%</div>
          <div className="text-sm opacity-90">to goal 🚀</div>
        </div>
      </div>

      {/* Encouragement Banner */}
      {totalActions > 0 && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                You've got {totalActions} action{totalActions !== 1 ? 's' : ''} to tackle! 💪
              </h3>
              <p className="text-sm text-gray-700">
                {completedToday > 0 && `You've already completed ${completedToday} today - keep the momentum going!`}
                {completedToday === 0 && `Start with the quick wins - calls take 5 minutes, build momentum!`}
              </p>
            </div>
            <div className="text-6xl">
              {completedToday >= 5 ? '🏆' : completedToday >= 3 ? '🔥' : '💪'}
            </div>
          </div>
        </div>
      )}

      {/* To Call */}
      {toCalls.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">To Call ({toCalls.length})</h2>
          </div>
          
          <div className="space-y-3">
            {toCalls.map(action => (
              <div key={action.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500 flex items-center gap-4">
                <input
                  type="checkbox"
                  onChange={() => handleComplete(action.id)}
                  className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.phone}</div>
                </div>
                <button
                  onClick={() => window.location.href = `tel:${action.phone}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <PhoneIcon className="h-4 w-4" />
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* To Email */}
      {toEmails.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">To Email ({toEmails.length})</h2>
          </div>
          
          <div className="space-y-3">
            {toEmails.map(action => (
              <div key={action.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500 flex items-center gap-4">
                <input
                  type="checkbox"
                  onChange={() => handleComplete(action.id)}
                  className="w-6 h-6 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.email}</div>
                </div>
                <button
                  onClick={() => window.location.href = `mailto:${action.email}`}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Email
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* To Do */}
      {toDos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">To Do ({toDos.length})</h2>
          </div>
          
          <div className="space-y-3">
            {toDos.map(action => (
              <div key={action.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500 flex items-center gap-4">
                <input
                  type="checkbox"
                  onChange={() => handleComplete(action.id)}
                  className="w-6 h-6 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                  {action.estimatedTime && (
                    <div className="text-xs text-gray-500 mt-1">⏱️ {action.estimatedTime}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadlines */}
      {deadlines.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Deadlines ({deadlines.length})</h2>
          </div>
          
          <div className="space-y-3">
            {deadlines.map(action => (
              <div key={action.id} className={`bg-white rounded-lg shadow p-5 border-l-4 ${
                action.daysUntil <= 30 ? 'border-red-500' : 'border-orange-500'
              } flex items-center gap-4`}>
                <input
                  type="checkbox"
                  onChange={() => handleComplete(action.id)}
                  className="w-6 h-6 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                  <div className={`text-sm mt-1 font-medium ${
                    action.daysUntil <= 30 ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    Due: {action.dueDate} ({action.daysUntil} days)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Suggestions */}
      {financialSuggestions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <LightBulbIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Financial Growth Opportunities ({financialSuggestions.length})</h2>
          </div>
          
          <div className="space-y-3">
            {financialSuggestions.map(action => (
              <div key={action.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-5 border-l-4 border-yellow-500 flex items-center gap-4">
                <input
                  type="checkbox"
                  onChange={() => handleComplete(action.id)}
                  className="w-6 h-6 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-700">{action.description}</div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-gray-600">Impact: <strong>{action.impact}</strong></span>
                    <span className="text-gray-600">Difficulty: <strong>{action.difficulty}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Done! */}
      {totalActions === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600">You've completed all your actions. Great work!</p>
          <p className="text-sm text-gray-500 mt-2">Check back tomorrow for new items</p>
        </div>
      )}

      {/* Completed Actions Archive */}
      {showArchive && archivedActions.length > 0 && (
        <div className="mt-8 border-t pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recently Completed 🎉</h3>
          <div className="space-y-2">
            {archivedActions.slice(0, 10).map((action, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 opacity-60">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-through">{action.title}</div>
                  <div className="text-xs text-gray-500">Completed {action.completedDate}</div>
                </div>
              </div>
            ))}
          </div>
          {archivedActions.length > 10 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              ...and {archivedActions.length - 10} more completed actions
            </div>
          )}
        </div>
      )}
    </div>
  );
}

