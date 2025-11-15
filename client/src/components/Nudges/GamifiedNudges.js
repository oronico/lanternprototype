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
  ArrowTrendingUpIcon,
  CakeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventBus } from '../../shared/hooks/useEventBus';
import { EVENTS } from '../../shared/eventBus';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

/**
 * Gamified Nudge System (Habit-Building Approach)
 * 
 * Features:
 * - Daily streaks (login, attendance, engagement)
 * - Progress bars toward goals
 * - Celebrations for milestones
 * - Smart nudges based on behavior
 * - Positive reinforcement
 * - Urgent alerts (but kind)
 * 
 * Nudge Types:
 * - Attendance: Call families with 2+ absences
 * - Celebration: Birthdays, achievements, milestones
 * - Financial: Days cash improving, payment received
 * - Enrollment: New family enrolled, goal progress
 * - Engagement: Daily login streak, feature usage
 */

export default function GamifiedNudges() {
  const [nudges, setNudges] = useState([]);
  const [streaks, setStreaks] = useState({});
  const [goals, setGoals] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    analytics.trackPageView('gamified-nudges');
    loadNudgesAndProgress();
    
    // Listen to events to create dynamic nudges
    setupEventListeners();
  }, []);

  const setupEventListeners = () => {
    // These are examples - expand based on your events
  };

  // Use event bus to listen for triggers
  useEventBus(EVENTS.PAYMENT_RECEIVED, (payment) => {
    if (payment.amount >= 1000) {
      addCelebrationNudge('💰 Large payment received!', `${payment.familyName} just paid $${payment.amount}!`);
    }
  });

  useEventBus('attendance.perfect_day', (data) => {
    celebrate('🎉 Perfect Attendance!', `All ${data.studentCount} students present today!`);
  });

  useEventBus('attendance.absence', (data) => {
    if (data.absenceCount >= 2) {
      addUrgentNudge(
        'Attendance Follow-up',
        `${data.student.name} has ${data.absenceCount} absences. Consider calling family.`,
        'attendance',
        { studentId: data.student.id, phone: data.student.parentPhone }
      );
    }
  });

  const loadNudgesAndProgress = () => {
    // Demo streaks
    setStreaks({
      dailyLogin: 15,
      attendanceTaken: 12,
      enrollmentProgress: 8,
      cashReserveBuilding: 22
    });

    // Demo goals with progress
    setGoals({
      enrollment: {
        name: 'Enrollment Goal',
        current: 28,
        target: 35,
        unit: 'students',
        progress: (28 / 35) * 100,
        daysLeft: 45,
        icon: UserGroupIcon,
        color: 'blue',
        celebration: '🎉 Enrollment goal reached!'
      },
      attendance: {
        name: 'Attendance Rate',
        current: 98,
        target: 95,
        unit: '%',
        progress: 100, // Already exceeded!
        achieved: true,
        icon: CalendarIcon,
        color: 'green',
        celebration: '✨ Attendance goal achieved!'
      },
      cashReserve: {
        name: 'Days Cash on Hand',
        current: 22,
        target: 30,
        unit: 'days',
        progress: (22 / 30) * 100,
        daysLeft: null,
        icon: BanknotesIcon,
        color: 'yellow',
        celebration: '💪 30-day cash reserve built!'
      },
      financialHealth: {
        name: 'Financial Health Score',
        current: 72,
        target: 85,
        unit: 'points',
        progress: (72 / 85) * 100,
        icon: ChartBarIcon,
        color: 'purple',
        celebration: '🏆 Excellent financial health!'
      }
    });

    // Demo nudges
    setNudges([
      {
        id: 1,
        type: 'celebration',
        priority: 'positive',
        title: '🎂 Birthday Coming Up!',
        message: 'Emma Johnson\'s birthday is in 3 days (Oct 3). Send a card?',
        action: 'Send Birthday Card',
        actionUrl: '/crm/enrolled',
        timestamp: new Date().toISOString(),
        dismissed: false,
        icon: CakeIcon,
        color: 'pink'
      },
      {
        id: 2,
        type: 'attendance',
        priority: 'medium',
        title: 'Attendance Follow-up',
        message: 'Ethan Brown has been absent 2 times in the last 2 weeks. Everything okay with the family?',
        action: 'Call Parent (555-0501)',
        actionUrl: 'tel:555-0501',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
        icon: ExclamationCircleIcon,
        color: 'orange'
      },
      {
        id: 3,
        type: 'progress',
        priority: 'positive',
        title: '📈 Awesome Progress!',
        message: 'You\'re 80% toward your enrollment goal! Just 7 more students to reach 35.',
        action: 'View Recruitment Pipeline',
        actionUrl: '/crm/recruitment',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
        icon: TrophyIcon,
        color: 'blue'
      },
      {
        id: 4,
        type: 'financial',
        priority: 'positive',
        title: '💰 Cash Reserve Improving!',
        message: 'You\'ve increased days cash from 18 to 22 days! Keep building toward 30-day goal.',
        action: 'View Cash Flow',
        actionUrl: '/cash-reality',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
        icon: BanknotesIcon,
        color: 'green'
      },
      {
        id: 5,
        type: 'engagement',
        priority: 'positive',
        title: '🔥 15-Day Streak!',
        message: 'You\'ve logged in 15 days in a row! Your consistency is building a strong school.',
        action: 'Keep It Going',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        dismissed: false,
        icon: FireIcon,
        color: 'orange'
      }
    ]);
  };

  const addCelebrationNudge = (title, message) => {
    const nudge = {
      id: Date.now(),
      type: 'celebration',
      priority: 'positive',
      title: title,
      message: message,
      timestamp: new Date().toISOString(),
      dismissed: false,
      icon: SparklesIcon,
      color: 'purple'
    };
    
    setNudges(prev => [nudge, ...prev]);
    celebrate(title, message);
  };

  const addUrgentNudge = (title, message, type, actionData) => {
    const nudge = {
      id: Date.now(),
      type: type,
      priority: 'medium',
      title: title,
      message: message,
      timestamp: new Date().toISOString(),
      dismissed: false,
      actionData: actionData,
      icon: ExclamationCircleIcon,
      color: 'orange'
    };
    
    setNudges(prev => [nudge, ...prev]);
    toast(message, { icon: '⚠️' });
  };

  const celebrate = (title, message) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
    toast.success(title);
  };

  const dismissNudge = (nudgeId) => {
    setNudges(prev => prev.map(n => 
      n.id === nudgeId ? { ...n, dismissed: true } : n
    ));
    
    analytics.trackFeatureUsage('gamifiedNudges', 'dismiss_nudge', {
      nudgeId: nudgeId
    });
  };

  const activeNudges = nudges.filter(n => !n.dismissed);
  const urgentNudges = activeNudges.filter(n => n.priority === 'medium' || n.priority === 'urgent');
  const positiveNudges = activeNudges.filter(n => n.priority === 'positive');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={300} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Guidance & Progress</h1>
            <p className="text-gray-600">Your personalized nudges and goal tracking</p>
          </div>
        </div>
      </div>

      {/* Daily Streaks */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Login Streak</span>
            <FireIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.dailyLogin}</div>
          <div className="text-sm opacity-90">days in a row! 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-success-600 to-success-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Attendance Taken</span>
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.attendanceTaken}</div>
          <div className="text-sm opacity-90">days straight ✅</div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Building Reserve</span>
            <BanknotesIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.cashReserveBuilding}</div>
          <div className="text-sm opacity-90">days improving 💪</div>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Enrollment Progress</span>
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div className="text-4xl font-bold mb-1">{streaks.enrollmentProgress}</div>
          <div className="text-sm opacity-90">days of growth 🚀</div>
        </div>
      </div>

      {/* Goal Progress Tracking */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrophyIcon className="h-6 w-6 text-yellow-500" />
          Your Goals
        </h2>

        <div className="space-y-6">
          {Object.entries(goals).map(([key, goal]) => {
            const Icon = goal.icon;
            const achieved = goal.achieved || goal.progress >= 100;
            
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${goal.color}-100`}>
                      <Icon className={`h-6 w-6 text-${goal.color}-600`} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{goal.name}</div>
                      <div className="text-sm text-gray-600">
                        Current: {goal.current}{goal.unit} • Goal: {goal.target}{goal.unit}
                      </div>
                    </div>
                  </div>
                  {achieved && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircleIcon className="h-6 w-6" />
                      <span className="font-semibold">Achieved!</span>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{Math.round(goal.progress)}%</span>
                  </div>
                  <div className={`w-full bg-${goal.color}-100 rounded-full h-3`}>
                    <div 
                      className={`bg-${goal.color}-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    >
                      {goal.progress >= 20 && (
                        <span className="text-xs text-white font-bold">
                          {Math.round(goal.progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!achieved && (
                  <div className="text-sm text-gray-600">
                    {goal.unit === 'students' && `${goal.target - goal.current} more students to go!`}
                    {goal.unit === '%' && `Just ${goal.target - goal.current}% away!`}
                    {goal.unit === 'days' && `${goal.target - goal.current} more days to build!`}
                    {goal.unit === 'points' && `${goal.target - goal.current} points to reach excellent!`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgent Nudges */}
      {urgentNudges.length > 0 && (
        <div className="mb-8">
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
                              if (nudge.actionUrl) {
                                window.location.href = nudge.actionUrl;
                              }
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
                      className="text-orange-600 hover:text-orange-800 text-sm"
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
                <div key={nudge.id} className={`bg-gradient-to-br from-${nudge.color}-50 to-${nudge.color}-100 border border-${nudge.color}-200 rounded-lg p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-6 w-6 text-${nudge.color}-600`} />
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
                        if (nudge.actionUrl) {
                          window.location.href = nudge.actionUrl;
                        }
                        dismissNudge(nudge.id);
                      }}
                      className={`text-sm text-${nudge.color}-600 hover:text-${nudge.color}-800 font-medium`}
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
  );
}

