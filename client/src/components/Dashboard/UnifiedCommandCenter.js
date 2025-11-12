import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CakeIcon,
  BellIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventBus } from '../../shared/hooks/useEventBus';
import { EVENTS } from '../../shared/eventBus';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import ActionCenter from './ActionCenter';

/**
 * Unified Command Center
 * 
 * Combines:
 * - Command Center (daily overview)
 * - Gamified Nudges (streaks, progress)
 * - Daily Guidance (smart suggestions)
 * - Milestones (progress tracking)
 * 
 * Into ONE cohesive daily hub
 */

export default function UnifiedCommandCenter() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTab, setActiveTab] = useState('actions'); // actions, nudges, goals, milestones
  
  // Streaks (Duolingo-style)
  const [streaks, setStreaks] = useState({
    dailyLogin: 15,
    attendanceTaken: 12,
    enrollmentProgress: 8,
    cashReserveBuilding: 22
  });

  // Goals with progress
  const [goals, setGoals] = useState({
    enrollment: {
      name: 'Enrollment Goal',
      current: 28,
      target: 35,
      unit: 'students',
      progress: 80,
      icon: UserGroupIcon,
      color: 'blue'
    },
    attendance: {
      name: 'Attendance Rate',
      current: 98,
      target: 95,
      unit: '%',
      progress: 100,
      achieved: true,
      icon: CalendarIcon,
      color: 'green'
    },
    cashReserve: {
      name: 'Days Cash on Hand',
      current: 22,
      target: 30,
      unit: 'days',
      progress: 73,
      icon: BanknotesIcon,
      color: 'yellow'
    },
    financialHealth: {
      name: 'Financial Health Score',
      current: 72,
      target: 85,
      unit: 'points',
      progress: 85,
      icon: ChartBarIcon,
      color: 'purple'
    }
  });

  // Milestones
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: 'First 10 Students Enrolled',
      date: '2024-08-25',
      completed: true,
      category: 'enrollment'
    },
    {
      id: 2,
      title: 'Reached 20-Day Cash Reserve',
      date: '2024-09-15',
      completed: true,
      category: 'financial'
    },
    {
      id: 3,
      title: '95% Attendance Rate Achieved',
      date: '2024-09-20',
      completed: true,
      category: 'operations'
    },
    {
      id: 4,
      title: 'Reach 30 Students',
      date: null,
      completed: false,
      category: 'enrollment',
      progress: 93 // 28/30
    },
    {
      id: 5,
      title: 'Build 30-Day Cash Reserve',
      date: null,
      completed: false,
      category: 'financial',
      progress: 73 // 22/30
    }
  ]);

  // Smart nudges
  const [nudges, setNudges] = useState([
    {
      id: 1,
      type: 'celebration',
      priority: 'positive',
      title: '🎂 Emma\'s Birthday Tomorrow!',
      message: 'Send a card or call to wish her happy birthday',
      action: 'View Student',
      actionUrl: '/students',
      icon: CakeIcon,
      color: 'pink'
    },
    {
      id: 2,
      type: 'attendance',
      priority: 'medium',
      title: 'Attendance Follow-up',
      message: 'Ethan has 2 absences this week. Quick check-in call?',
      action: 'Call (555-0501)',
      actionUrl: 'tel:555-0501',
      icon: ExclamationCircleIcon,
      color: 'orange'
    },
    {
      id: 3,
      type: 'progress',
      priority: 'positive',
      title: '🎉 Almost There!',
      message: 'Just 7 more students to reach your enrollment goal!',
      action: 'View Recruitment',
      actionUrl: '/crm/recruitment',
      icon: TrophyIcon,
      color: 'blue'
    },
    {
      id: 4,
      type: 'financial',
      priority: 'positive',
      title: '💰 Cash Improving!',
      message: 'Days cash increased from 18 to 22! Keep building.',
      action: 'View Cash Flow',
      actionUrl: '/cash-reality',
      icon: BanknotesIcon,
      color: 'green'
    }
  ]);

  useEffect(() => {
    analytics.trackPageView('unified-command-center');
  }, []);

  // Listen for events to create dynamic nudges
  useEventBus(EVENTS.PAYMENT_RECEIVED, (payment) => {
    if (payment.amount >= 1000) {
      toast.success(`💰 ${payment.familyName} paid $${payment.amount}!`);
    }
  });

  useEventBus('attendance.perfect_day', () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  });

  const dismissNudge = (nudgeId) => {
    setNudges(prev => prev.filter(n => n.id !== nudgeId));
    analytics.trackFeatureUsage('commandCenter', 'dismiss_nudge', { nudgeId });
  };

  const urgentNudges = nudges.filter(n => n.priority === 'medium' || n.priority === 'urgent');
  const positiveNudges = nudges.filter(n => n.priority === 'positive');
  const completedMilestones = milestones.filter(m => m.completed);
  const activeMilestones = milestones.filter(m => !m.completed);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={300} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RocketLaunchIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
              <p className="text-gray-600">Your daily progress, nudges, and goals</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Today</div>
            <div className="font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Streaks Bar (Always Visible) */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Login Streak</span>
            <FireIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.dailyLogin}</div>
          <div className="text-sm opacity-90">days in a row! 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Attendance Taken</span>
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.attendanceTaken}</div>
          <div className="text-sm opacity-90">days straight ✅</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Building Reserve</span>
            <BanknotesIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.cashReserveBuilding}</div>
          <div className="text-sm opacity-90">days improving 💪</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Enrollment Progress</span>
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.enrollmentProgress}</div>
          <div className="text-sm opacity-90">days of growth 🚀</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'actions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5 inline mr-2" />
            Action Items
          </button>
          <button
            onClick={() => setActiveTab('nudges')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'nudges'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BellIcon className="h-5 w-5 inline mr-2" />
            Nudges & Wins
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'goals'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrophyIcon className="h-5 w-5 inline mr-2" />
            Your Goals
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'milestones'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <RocketLaunchIcon className="h-5 w-5 inline mr-2" />
            Milestones
          </button>
        </nav>
      </div>

      {/* Action Items Tab */}
      {activeTab === 'actions' && (
        <ActionCenter />
      )}

      {/* Nudges & Wins Tab */}
      {activeTab === 'nudges' && (
        <div className="space-y-6">
          {/* Urgent Nudges */}
          {urgentNudges.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ExclamationCircleIcon className="h-6 w-6 text-orange-500" />
                Action Needed
              </h2>
              
              <div className="space-y-3">
                {urgentNudges.map(nudge => {
                  const Icon = nudge.icon;
                  
                  return (
                    <div key={nudge.id} className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-orange-900 mb-1">{nudge.title}</div>
                            <div className="text-sm text-orange-800 mb-3">{nudge.message}</div>
                            {nudge.action && (
                              <button
                                onClick={() => {
                                  if (nudge.actionUrl) window.location.href = nudge.actionUrl;
                                  dismissNudge(nudge.id);
                                }}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                              >
                                {nudge.action}
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => dismissNudge(nudge.id)}
                          className="text-orange-600 hover:text-orange-800 text-sm ml-4"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Positive Nudges & Celebrations */}
          {positiveNudges.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HeartIcon className="h-6 w-6 text-pink-500" />
                Celebrations & Wins
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positiveNudges.map(nudge => {
                  const Icon = nudge.icon;
                  
                  return (
                    <div key={nudge.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-purple-600" />
                          <div className="font-semibold text-gray-900">{nudge.title}</div>
                        </div>
                        <button
                          onClick={() => dismissNudge(nudge.id)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">{nudge.message}</div>
                      {nudge.action && (
                        <button
                          onClick={() => {
                            if (nudge.actionUrl) window.location.href = nudge.actionUrl;
                            dismissNudge(nudge.id);
                          }}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          {nudge.action} →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Your Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            Your Goals & Progress
          </h2>

          <div className="space-y-6">
            {Object.entries(goals).map(([key, goal]) => {
              const Icon = goal.icon;
              const achieved = goal.achieved || goal.progress >= 100;
              
              return (
                <div key={key} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        achieved ? 'bg-green-100' : `bg-${goal.color}-100`
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          achieved ? 'text-green-600' : `text-${goal.color}-600`
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{goal.name}</div>
                        <div className="text-sm text-gray-600">
                          Current: <span className="font-medium">{goal.current}{goal.unit}</span> • 
                          Goal: <span className="font-medium">{goal.target}{goal.unit}</span>
                        </div>
                      </div>
                    </div>
                    {achieved && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircleIcon className="h-8 w-8" />
                        <span className="font-semibold text-lg">Achieved!</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`${
                          achieved ? 'bg-green-600' : `bg-${goal.color}-600`
                        } h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      >
                        <span className="text-xs text-white font-bold">
                          {Math.round(goal.progress)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {!achieved && (
                    <div className="text-sm text-gray-600">
                      {goal.unit === 'students' && `Just ${goal.target - goal.current} more students to go!`}
                      {goal.unit === '%' && `You're already at ${goal.current}% - you've exceeded your ${goal.target}% goal! 🎉`}
                      {goal.unit === 'days' && `${goal.target - goal.current} more days to build your reserve`}
                      {goal.unit === 'points' && `${goal.target - goal.current} more points to reach excellent health`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <RocketLaunchIcon className="h-6 w-6 text-purple-500" />
            Your Journey
          </h2>

          {/* Active Milestones */}
          {activeMilestones.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">In Progress</h3>
              <div className="space-y-4">
                {activeMilestones.map(milestone => (
                  <div key={milestone.id} className="bg-white rounded-lg shadow border-l-4 border-blue-500 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900">{milestone.title}</div>
                      {milestone.progress && (
                        <div className="text-sm font-medium text-blue-600">
                          {milestone.progress}%
                        </div>
                      )}
                    </div>
                    {milestone.progress && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    )}
                    <div className="text-sm text-gray-600 capitalize">
                      {milestone.category} goal
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Milestones */}
          {completedMilestones.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Completed 🎉</h3>
              <div className="space-y-3">
                {completedMilestones.map(milestone => (
                  <div key={milestone.id} className="bg-green-50 rounded-lg border border-green-200 p-4 flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{milestone.title}</div>
                      <div className="text-sm text-gray-600">{milestone.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

