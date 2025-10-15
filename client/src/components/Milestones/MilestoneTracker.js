import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  RocketLaunchIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

const MilestoneTracker = ({ schoolId, onMilestoneAchieved }) => {
  const [milestones, setMilestones] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrating, setCelebrating] = useState(null);

  useEffect(() => {
    loadMilestones();
  }, [schoolId]);

  const loadMilestones = async () => {
    // Mock data - replace with API call
    const mockMilestones = [
      {
        id: 1,
        type: 'days-cash-milestone',
        category: 'financial',
        title: '30 Days Cash Reserve',
        description: 'Build a 30-day cash cushion for stability',
        targetValue: 30,
        currentValue: 22,
        achieved: false,
        priority: 'high',
        celebrationType: 'confetti',
        celebrationMessage: 'Amazing! You\'ve built a solid 30-day cash reserve! This is a major milestone in financial stability.',
        icon: BanknotesIcon,
        color: 'blue'
      },
      {
        id: 2,
        type: 'enrollment-target',
        category: 'operational',
        title: 'Target Enrollment (32 students)',
        description: 'Reach optimal enrollment for financial sustainability',
        targetValue: 32,
        currentValue: 28,
        achieved: false,
        priority: 'critical',
        celebrationType: 'fireworks',
        celebrationMessage: 'Incredible! You\'ve reached your target enrollment! This puts you on solid financial footing.',
        icon: UserGroupIcon,
        color: 'green'
      },
      {
        id: 3,
        type: 'first-profitable-month',
        category: 'financial',
        title: 'First Profitable Month',
        description: 'Achieve positive net income for a full month',
        targetValue: 0,
        currentValue: -1200,
        achieved: false,
        priority: 'high',
        celebrationType: 'trophy',
        celebrationMessage: 'Congratulations! Your first profitable month is a huge milestone. The hard work is paying off!',
        icon: ChartBarIcon,
        color: 'purple'
      },
      {
        id: 4,
        type: 'collection-rate-improvement',
        category: 'efficiency',
        title: '95% Collection Rate',
        description: 'Achieve 95%+ on-time payment rate',
        targetValue: 95,
        currentValue: 82,
        achieved: false,
        priority: 'medium',
        celebrationType: 'star',
        celebrationMessage: 'Outstanding! Your improved collection rate means more predictable cash flow.',
        icon: CheckCircleIcon,
        color: 'yellow'
      },
      {
        id: 5,
        type: 'cash-reserve-goal',
        category: 'financial',
        title: '60 Days Cash Reserve',
        description: 'Build a 60-day cash cushion for resilience',
        targetValue: 60,
        currentValue: 22,
        achieved: false,
        priority: 'medium',
        celebrationType: 'confetti',
        celebrationMessage: 'Exceptional! A 60-day cash reserve gives you real financial freedom and security.',
        icon: TrophyIcon,
        color: 'gold'
      },
      {
        id: 6,
        type: 'break-even',
        category: 'financial',
        title: 'Break-Even Operations',
        description: 'Cover all expenses from revenue (no personal subsidy)',
        targetValue: 25,
        currentValue: 28,
        achieved: true,
        achievedAt: new Date(Date.now() - 604800000), // 1 week ago
        priority: 'high',
        celebrationType: 'trophy',
        celebrationMessage: 'You did it! Your school is self-sustaining!',
        icon: RocketLaunchIcon,
        color: 'green'
      }
    ];

    setMilestones(mockMilestones);
  };

  const celebrate = (milestone) => {
    setCelebrating(milestone);
    setShowConfetti(true);

    // Stop confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
      setCelebrating(null);
    }, 5000);

    if (onMilestoneAchieved) {
      onMilestoneAchieved(milestone);
    }

    toast.custom((t) => (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-xl">
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

  const getProgressPercentage = (milestone) => {
    if (milestone.achieved) return 100;
    if (milestone.targetValue === 0) return 0;
    
    const progress = (milestone.currentValue / milestone.targetValue) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        progress: 'bg-blue-500',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        progress: 'bg-green-500',
        icon: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        progress: 'bg-purple-500',
        icon: 'text-purple-600'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        progress: 'bg-yellow-500',
        icon: 'text-yellow-600'
      },
      gold: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        progress: 'bg-amber-500',
        icon: 'text-amber-600'
      }
    };
    
    return colors[color] || colors.blue;
  };

  const activeMilestones = milestones.filter(m => !m.achieved);
  const achievedMilestones = milestones.filter(m => m.achieved);
  const completionRate = milestones.length > 0 
    ? Math.round((achievedMilestones.length / milestones.length) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
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
      {celebrating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <TrophyIcon className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Milestone Achieved! 🎉
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {celebrating.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {celebrating.celebrationMessage}
            </p>
            <button
              onClick={() => {
                setCelebrating(null);
                setShowConfetti(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <TrophyIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Milestones</h1>
              <p className="text-sm text-gray-600">
                Track your progress toward financial excellence
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{completionRate}%</div>
            <div className="text-sm text-gray-600">Complete</div>
            <div className="text-xs text-gray-500 mt-1">
              {achievedMilestones.length} of {milestones.length} milestones
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Active Milestones */}
      {activeMilestones.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
            In Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMilestones.map((milestone) => {
              const Icon = milestone.icon;
              const colors = getColorClasses(milestone.color);
              const progress = getProgressPercentage(milestone);
              const isCloseToGoal = progress >= 75;
              
              return (
                <div
                  key={milestone.id}
                  className={`relative p-6 rounded-xl border-2 ${colors.bg} ${colors.border} transition-all hover:shadow-md ${
                    isCloseToGoal ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                  }`}
                >
                  {/* Priority Badge */}
                  {milestone.priority === 'critical' && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        Critical
                      </span>
                    </div>
                  )}

                  {/* Close to Goal Badge */}
                  {isCloseToGoal && (
                    <div className="absolute top-4 right-4">
                      <SparklesIcon className="h-6 w-6 text-yellow-500 animate-pulse" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-white mb-4`}>
                    <Icon className={`h-7 w-7 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {milestone.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">
                        {milestone.currentValue}{milestone.type.includes('rate') ? '%' : ''} / {milestone.targetValue}{milestone.type.includes('rate') ? '%' : ''}
                      </span>
                      <span className={`font-bold ${colors.text}`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${colors.progress} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Distance to Goal */}
                  {milestone.targetValue > milestone.currentValue && (
                    <div className="text-xs text-gray-500">
                      {Math.abs(milestone.targetValue - milestone.currentValue).toFixed(0)} 
                      {milestone.type.includes('rate') ? ' percentage points' : 
                       milestone.type.includes('enrollment') ? ' students' : 
                       milestone.type.includes('cash') ? ' days' : ' units'} to go
                    </div>
                  )}

                  {/* Test Celebrate Button (for demo) */}
                  {isCloseToGoal && (
                    <button
                      onClick={() => celebrate(milestone)}
                      className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                    >
                      🎉 Celebrate (Demo)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achieved Milestones */}
      {achievedMilestones.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            Achieved ({achievedMilestones.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievedMilestones.map((milestone) => {
              const Icon = milestone.icon;
              
              return (
                <div
                  key={milestone.id}
                  className="relative p-5 rounded-xl bg-green-50 border-2 border-green-200 opacity-75"
                >
                  {/* Checkmark */}
                  <div className="absolute top-4 right-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>

                  {/* Icon */}
                  <div className="inline-flex p-2 rounded-lg bg-green-100 mb-3">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {milestone.title}
                  </h3>
                  
                  {milestone.achievedAt && (
                    <div className="flex items-center text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {new Date(milestone.achievedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      {activeMilestones.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <SparklesIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Keep Going! 💪</h3>
              <p className="text-sm text-gray-700">
                You're making real progress. Each milestone you achieve strengthens your school's foundation 
                and brings you closer to financial independence. Stay focused on the next goal!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;

