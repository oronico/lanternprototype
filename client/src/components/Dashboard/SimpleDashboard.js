import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BanknotesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
  ENROLLMENT,
  FINANCIAL,
  ATTENDANCE,
  OPERATIONS,
  STAFF,
  FACILITY,
  generateNudges,
  GAMIFICATION
} from '../../data/centralizedMetrics';

const formatCurrency = (value) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const getStatus = (value, goodThreshold, warningThreshold, isLowerBetter = false) => {
  if (isLowerBetter) {
    if (value <= goodThreshold) return 'good';
    if (value <= warningThreshold) return 'warning';
    return 'alarm';
  } else {
    if (value >= goodThreshold) return 'good';
    if (value >= warningThreshold) return 'warning';
    return 'alarm';
  }
};

const statusMeta = {
  good: { icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />, text: 'On Track', class: 'bg-green-100 text-green-800' },
  warning: { icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />, text: 'Needs Work', class: 'bg-yellow-100 text-yellow-800' },
  alarm: { icon: <XCircleIcon className="h-5 w-5 text-red-600" />, text: 'Alarm', class: 'bg-red-100 text-red-800' }
};

const buildHealthCategories = () => {
  const breakEvenRevenue = FINANCIAL.monthlyExpenses;
  const revenuePerStudent = Math.round(FINANCIAL.monthlyRevenue / ENROLLMENT.current);

  return [
    {
      id: 'financial',
      name: 'Finances',
      icon: BanknotesIcon,
      gradient: 'from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      iconBg: 'bg-teal-600',
      cta: { label: 'Open Financials', href: '/financials' },
      metrics: [
        {
          label: 'Days Cash on Hand',
          value: `${FINANCIAL.daysCash} days`,
          target: '30+ days',
          status: getStatus(FINANCIAL.daysCash, 30, 20),
          explanation: 'How long you can cover expenses with current cash'
        },
        {
          label: 'Operating Cash',
          value: formatCurrency(FINANCIAL.operatingCash),
          target: 'Checking account',
          status: 'good',
          explanation: 'Cash available for daily operations'
        },
        {
          label: 'Savings Reserve',
          value: formatCurrency(FINANCIAL.savingsCash),
          target: `${FINANCIAL.savingsProgress}% to 3-month goal`,
          status: getStatus(FINANCIAL.savingsProgress, 100, 50),
          explanation: 'Emergency fund for unexpected costs'
        },
        {
          label: 'Budget Variance',
          value: `${FINANCIAL.budgetVariancePercent}%`,
          target: FINANCIAL.budgetVariance < 0 ? 'Under budget' : 'Over budget',
          status: getStatus(Math.abs(FINANCIAL.budgetVariancePercent), 5, 10, true),
          explanation: 'How close you are to your budgeted revenue'
        },
        {
          label: 'Monthly Break-Even',
          value: formatCurrency(breakEvenRevenue),
          target: FINANCIAL.monthlyRevenue >= breakEvenRevenue ? 'Profitable' : 'Under target',
          status: FINANCIAL.monthlyRevenue >= breakEvenRevenue ? 'good' : 'alarm',
          explanation: 'Revenue needed to cover all expenses'
        },
        {
          label: 'Debt Service Coverage (DSCR)',
          value: `${FINANCIAL.dscr}x`,
          target: '≥1.2x for loans',
          status: getStatus(FINANCIAL.dscr, 1.2, 1.0),
          explanation: 'Ability to cover debt payments—lenders require 1.2x+'
        }
      ]
    },
    {
      id: 'students',
      name: 'Students',
      icon: UserGroupIcon,
      gradient: 'from-primary-50 to-primary-100',
      border: 'border-primary-200',
      iconBg: 'bg-primary-600',
      cta: { label: 'View Students', href: '/students' },
      metrics: [
        {
          label: 'Current Enrollment',
          value: `${ENROLLMENT.current} / ${ENROLLMENT.target}`,
          target: `${ENROLLMENT.goalProgress}% to goal`,
          status: getStatus(ENROLLMENT.goalProgress, 90, 75),
          explanation: 'Students enrolled vs your target for this year'
        },
        {
          label: 'Capacity Utilization',
          value: `${ENROLLMENT.utilization}%`,
          target: `${ENROLLMENT.capacity - ENROLLMENT.current} spots open`,
          status: getStatus(ENROLLMENT.utilization, 80, 60),
          explanation: 'How full your school is vs total capacity'
        },
        {
          label: 'Attendance Rate',
          value: `${ATTENDANCE.ytdRate}%`,
          target: `${ATTENDANCE.goal}% goal`,
          status: getStatus(ATTENDANCE.ytdRate, 95, 92),
          explanation: 'Year-to-date average attendance'
        },
        {
          label: 'Retention Rate',
          value: `${ENROLLMENT.retentionRate}%`,
          target: 'Students who returned',
          status: getStatus(ENROLLMENT.retentionRate, 90, 85),
          explanation: 'Percent of students who came back this year'
        },
        {
          label: 'Attrition Rate',
          value: `${ENROLLMENT.attritionRate}%`,
          target: 'Students who left',
          status: getStatus(ENROLLMENT.attritionRate, 5, 10, true),
          explanation: 'Percent of students who withdrew'
        }
      ]
    },
    {
      id: 'facility',
      name: 'Facility',
      icon: BuildingOfficeIcon,
      gradient: 'from-amber-50 to-orange-50',
      border: 'border-orange-100',
      iconBg: 'bg-orange-600',
      cta: { label: 'View Facility', href: '/facility' },
      metrics: [
        {
          label: 'Facility Burden',
          value: `${Math.round(FACILITY.facilityBurden * 100)}%`,
          target: 'Of revenue',
          status: getStatus(FACILITY.facilityBurden * 100, 20, 30, true),
          explanation: 'Total facility costs as % of revenue—target ≤20%'
        },
        {
          label: 'Rent to Revenue',
          value: `${Math.round(FACILITY.rentToRevenue * 100)}%`,
          target: 'Lease only',
          status: getStatus(FACILITY.rentToRevenue * 100, 15, 20, true),
          explanation: 'Rent as % of revenue—target ≤15%'
        },
        {
          label: 'Square Footage Per Student',
          value: `${FACILITY.currentSqFtPerStudent} sq ft`,
          target: `${FACILITY.optimalSqFtPerStudent} optimal`,
          status: getStatus(FACILITY.currentSqFtPerStudent, 50, 70, true),
          explanation: 'Space per student—50 sq ft is industry standard'
        },
        {
          label: 'Lease Expiration',
          value: FACILITY.leaseExpiration,
          target: 'Plan renewals early',
          status: 'good',
          explanation: 'When your lease ends—start planning 12-18 months ahead'
        }
      ]
    },
    {
      id: 'staff',
      name: 'Staff',
      icon: UsersIcon,
      gradient: 'from-gray-50 to-gray-100',
      border: 'border-gray-200',
      iconBg: 'bg-gray-600',
      cta: { label: 'View Staff', href: '/payroll' },
      metrics: [
        {
          label: 'Labor Cost Ratio',
          value: `${Math.round(STAFF.staffingRatio * 100)}%`,
          target: `Target ≤${Math.round(STAFF.staffingGoal * 100)}%`,
          status: getStatus(STAFF.staffingRatio * 100, 45, 55, true),
          explanation: 'Payroll + benefits as % of revenue—keep under 45%'
        },
        {
          label: 'Monthly Payroll',
          value: formatCurrency(STAFF.monthlyPayroll),
          target: `${STAFF.w2Employees} W-2 employees`,
          status: 'good',
          explanation: 'Total gross payroll for W-2 staff'
        },
        {
          label: 'Turnover Rate',
          value: `${STAFF.turnover}%`,
          target: 'Staff retention',
          status: getStatus(STAFF.turnover, 10, 20, true),
          explanation: 'Staff who left this year—high turnover is costly'
        }
      ]
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: RocketLaunchIcon,
      gradient: 'from-accent-50 to-amber-50',
      border: 'border-accent-200',
      iconBg: 'bg-accent-600',
      cta: { label: 'View Full Scorecard', href: '/health' },
      metrics: [
        {
          label: 'Business Health Score',
          value: `${FINANCIAL.healthScore}/100`,
          target: FINANCIAL.healthScore >= 80 ? 'Bank-ready' : 'Needs improvement',
          status: getStatus(FINANCIAL.healthScore, 80, 65),
          explanation: 'Overall financial fitness based on underwriting criteria'
        },
        {
          label: 'Contracts Complete',
          value: `${OPERATIONS.contractCoverage}%`,
          target: `${OPERATIONS.missingContracts} missing`,
          status: getStatus(OPERATIONS.contractCoverage, 95, 90),
          explanation: 'Students with all required docs—critical for compliance'
        }
      ]
    }
  ];
};

export default function SimpleDashboard() {
  const [dailyWins, setDailyWins] = useState(0);
  const [movesExpanded, setMovesExpanded] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = Number(window.localStorage.getItem('dashboardDailyWins') || 0);
      setDailyWins(stored);
    }
  }, []);

  const healthCategories = useMemo(() => buildHealthCategories(), []);
  const nudges = useMemo(() => generateNudges().slice(0, 3), []);

  const streaks = GAMIFICATION?.streaks || {};
  const winsGoal = 3;
  const winsProgress = Math.min(100, Math.round((dailyWins / winsGoal) * 100));

  const handleLogWin = () => {
    const nextWins = Math.min(winsGoal, dailyWins + 1);
    setDailyWins(nextWins);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dashboardDailyWins', String(nextWins));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      <CoachGreeting />
      <DailyMomentum
        streaks={streaks}
        dailyWins={dailyWins}
        winsGoal={winsGoal}
        winsProgress={winsProgress}
        onLogWin={handleLogWin}
      />
      <HealthScoreCard score={FINANCIAL.healthScore} />
      <CategoryScorecard categories={healthCategories} />
      <MovesThatMatter expanded={movesExpanded} onToggle={() => setMovesExpanded(!movesExpanded)} />
      {nudges.length > 0 && <CoachingNudges nudges={nudges} />}
    </div>
  );
}

const CoachGreeting = () => {
  const userName = 'Sarah'; // Prototype user

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const seatsToGoal = Math.max(0, ENROLLMENT.target - ENROLLMENT.current);
  const focusText = seatsToGoal > 0
    ? `You're ${seatsToGoal} students from your goal—keep nudging those tours.`
    : `Enrollment goal met—time to lock in renewals.`;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Welcome back</p>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {userName}.</h1>
          <p className="text-gray-600">{today}</p>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-3">
          <p className="text-xs uppercase tracking-wide text-primary-700 font-semibold">Today's Focus</p>
          <p className="text-sm font-medium text-gray-900">{focusText}</p>
        </div>
      </div>
    </section>
  );
};

const MovesThatMatter = ({ expanded, onToggle }) => {
  const moves = [
    {
      id: 'enrollment',
      priority: 1,
      title: 'Hit 100% Enrollment',
      current: `${ENROLLMENT.goalProgress}%`,
      target: `${ENROLLMENT.current}/${ENROLLMENT.target} students`,
      status: getStatus(ENROLLMENT.goalProgress, 100, 90),
      action: 'View recruitment pipeline',
      href: '/crm/recruitment',
      why: 'Revenue is tied to enrollment—every empty seat costs you tuition.'
    },
    {
      id: 'attrition',
      priority: 2,
      title: 'Keep Attrition Below 10%',
      current: `${ENROLLMENT.attritionRate}%`,
      target: 'Target: <10%',
      status: getStatus(ENROLLMENT.attritionRate, 10, 15, true),
      action: 'Review student retention',
      href: '/students',
      why: 'Replacing students is expensive—retention protects your margins.'
    },
    {
      id: 'retention',
      priority: 3,
      title: 'Maintain 90%+ Retention',
      current: `${ENROLLMENT.retentionRate}%`,
      target: 'Target: ≥90%',
      status: getStatus(ENROLLMENT.retentionRate, 90, 85),
      action: 'Track family satisfaction',
      href: '/students',
      why: 'Happy families renew and refer—your best marketing channel.'
    },
    {
      id: 'attendance',
      priority: 4,
      title: 'Maintain 95%+ Attendance',
      current: `${ATTENDANCE.ytdRate}%`,
      target: 'Target: ≥95%',
      status: getStatus(ATTENDANCE.ytdRate, 95, 92),
      action: 'Review attendance patterns',
      href: '/students',
      why: 'Lenders watch attendance—it signals program quality and stability.'
    },
    {
      id: 'autopay',
      priority: 5,
      title: 'Set Up Automated Tuition Collection',
      current: 'Manual invoicing',
      target: 'Stripe, Omella, or ClassWallet',
      status: 'warning',
      action: 'Connect payment provider',
      href: '/payments',
      why: 'Autopay improves collections from 85% to 98%—lenders require it for underwriting.'
    }
  ];

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">Financial Health Drivers</p>
            <h3 className="text-xl font-bold text-gray-900">The Moves That Matter Most</h3>
            <p className="text-sm text-gray-600">Focus on these to unlock loan-readiness and profitability.</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      {expanded && (
        <div className="space-y-3">
          {moves.map(move => {
            const statusInfo = statusMeta[move.status] || statusMeta.good;
            return (
              <div key={move.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                    {move.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900">{move.title}</h4>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Current:</span> {move.current} • {move.target}
                    </p>
                    <p className="text-xs text-gray-600 italic">{move.why}</p>
                  </div>
                </div>
                <Link
                  to={move.href}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  {move.action}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const HealthScoreCard = ({ score }) => {
  const status = score >= 80 ? 'excellent' : score >= 65 ? 'good' : 'needs work';
  const color = score >= 80 ? 'text-teal-700' : score >= 65 ? 'text-teal-600' : 'text-teal-600';

  return (
    <section className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow">
            <SparklesIcon className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-teal-700 font-semibold">Business Health Score</p>
            <h2 className="text-4xl font-bold text-gray-900">{score}<span className="text-2xl text-gray-500">/100</span></h2>
            <p className="text-sm text-teal-800">Based on 22 years of underwriting microschools</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className={`text-lg font-semibold ${color} capitalize`}>{status}</p>
          <Link
            to="/health"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View full scorecard
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const CategoryScorecard = ({ categories }) => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">5 Category Health Check</p>
      <h3 className="text-xl font-bold text-gray-900">The metrics lenders care about, explained simply.</h3>
    </div>
    <div className="space-y-4">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  </section>
);

const CategoryCard = ({ category }) => {
  const Icon = category.icon;
  const goodCount = category.metrics.filter(m => m.status === 'good').length;
  const warningCount = category.metrics.filter(m => m.status === 'warning').length;
  const alarmCount = category.metrics.filter(m => m.status === 'alarm').length;

  return (
    <div className={`bg-gradient-to-br ${category.gradient} border-2 ${category.border} rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${category.iconBg}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{category.name}</h4>
            <p className="text-xs text-gray-600">
              {goodCount} on track • {warningCount} needs work • {alarmCount} alarm
            </p>
          </div>
        </div>
        {category.cta && (
          <Link
            to={category.cta.href}
            className="text-xs font-semibold text-primary-600 hover:text-primary-800"
          >
            {category.cta.label}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
        {category.metrics.map(metric => (
          <MetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
};

const MetricTile = ({ metric }) => {
  const status = statusMeta[metric.status] || statusMeta.good;

  return (
    <div className="bg-white rounded-xl border border-white/80 shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">{metric.label}</p>
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          <p className="text-xs text-gray-600">{metric.target}</p>
        </div>
        {status.icon}
      </div>
      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
        {status.text}
      </div>
      {metric.explanation && (
        <p className="text-xs text-gray-600 italic">{metric.explanation}</p>
      )}
    </div>
  );
};

const CoachingNudges = ({ nudges }) => (
  <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Coaching Nudges</p>
        <h3 className="text-lg font-bold text-gray-900">Quick wins that move the needle.</h3>
      </div>
      <Link to="/command-center" className="text-sm font-semibold text-primary-600 hover:text-primary-800">
        View all →
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nudges.map(nudge => (
        <div key={nudge.title} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">{nudge.type}</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">{nudge.title}</p>
          <p className="text-xs text-gray-600">{nudge.description || nudge.family}</p>
          {nudge.action && (
            <button
              onClick={() => { window.location.href = '/command-center'; }}
              className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-800"
            >
              {nudge.action} →
            </button>
          )}
        </div>
      ))}
    </div>
  </section>
);

const DailyMomentum = ({ streaks, dailyWins, winsGoal, winsProgress, onLogWin }) => (
  <section className="bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-2xl p-6 space-y-4 shadow-sm">
    <div className="flex items-center gap-3">
      <SparklesIcon className="h-6 w-6 text-success-600" />
      <div>
        <p className="text-xs uppercase tracking-wide text-success-700 font-semibold">Daily Momentum</p>
        <p className="text-sm text-gray-700">Small wins compound into big results.</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(streaks).map(([key, value]) => (
        <div key={key} className="bg-white rounded-xl border border-success-100 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">day streak</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl border border-success-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900">Daily Wins ({dailyWins}/{winsGoal})</p>
        <p className="text-xs text-gray-500">Log three wins to unlock tomorrow's insight.</p>
      </div>
      <div className="flex-1 md:px-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-success-500 rounded-full transition-all"
            style={{ width: `${winsProgress}%` }}
          />
        </div>
      </div>
      <button
        onClick={onLogWin}
        disabled={dailyWins >= winsGoal}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
          dailyWins >= winsGoal
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-success-600 text-white hover:bg-success-700'
        }`}
      >
        {dailyWins >= winsGoal ? '✓ Wins logged' : 'Log a win'}
      </button>
    </div>
  </section>
);
