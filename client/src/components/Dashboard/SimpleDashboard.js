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
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-100',
      iconBg: 'bg-green-600',
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
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600',
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
      gradient: 'from-purple-50 to-fuchsia-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-600',
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
      gradient: 'from-indigo-50 to-slate-50',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-600',
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
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [dailyWins, setDailyWins] = useState(0);

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

  const handleToggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      <CoachGreeting />
      <HealthScoreCard score={FINANCIAL.healthScore} />
      <CategoryScorecard
        categories={healthCategories}
        expandedCategory={expandedCategory}
        onToggle={handleToggleCategory}
      />
      {nudges.length > 0 && <CoachingNudges nudges={nudges} />}
      <DailyMomentum
        streaks={streaks}
        dailyWins={dailyWins}
        winsGoal={winsGoal}
        winsProgress={winsProgress}
        onLogWin={handleLogWin}
      />
    </div>
  );
}

const CoachGreeting = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Your business is covered.</h1>
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

const HealthScoreCard = ({ score }) => {
  const status = score >= 80 ? 'excellent' : score >= 65 ? 'good' : 'needs work';
  const color = score >= 80 ? 'text-green-600' : score >= 65 ? 'text-yellow-600' : 'text-red-600';
  const bg = score >= 80 ? 'bg-green-50' : score >= 65 ? 'bg-yellow-50' : 'bg-red-50';
  const borderColor = score >= 80 ? 'border-green-200' : score >= 65 ? 'border-yellow-200' : 'border-red-200';

  return (
    <section className={`${bg} border-2 ${borderColor} rounded-2xl p-6 shadow-sm`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow">
            <SparklesIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Business Health Score</p>
            <h2 className="text-4xl font-bold text-gray-900">{score}<span className="text-2xl text-gray-500">/100</span></h2>
            <p className="text-sm text-gray-700">Based on 22 years of underwriting microschools</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className={`text-lg font-semibold ${color} capitalize`}>{status}</p>
          <Link
            to="/health"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-800"
          >
            View full scorecard
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const CategoryScorecard = ({ categories, expandedCategory, onToggle }) => (
  <section className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">5 Category Health Check</p>
      <h3 className="text-xl font-bold text-gray-900">The metrics lenders care about, explained simply.</h3>
    </div>
    <div className="space-y-4">
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          expanded={expandedCategory === category.id}
          onToggle={() => onToggle(category.id)}
        />
      ))}
    </div>
  </section>
);

const CategoryCard = ({ category, expanded, onToggle }) => {
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
        <div className="flex items-center gap-3">
          {category.cta && (
            <Link
              to={category.cta.href}
              className="text-xs font-semibold text-primary-600 hover:text-primary-800"
            >
              {category.cta.label}
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/50 rounded-lg transition"
          >
            {expanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          {category.metrics.map(metric => (
            <MetricTile key={metric.label} metric={metric} />
          ))}
        </div>
      )}
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
  <section className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 space-y-4 shadow-sm">
    <div className="flex items-center gap-3">
      <SparklesIcon className="h-6 w-6 text-emerald-600" />
      <div>
        <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">Daily Momentum</p>
        <p className="text-sm text-gray-700">Small wins compound into big results.</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(streaks).map(([key, value]) => (
        <div key={key} className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">day streak</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl border border-emerald-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900">Daily Wins ({dailyWins}/{winsGoal})</p>
        <p className="text-xs text-gray-500">Log three wins to unlock tomorrow's insight.</p>
      </div>
      <div className="flex-1 md:px-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-emerald-500 rounded-full transition-all"
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
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {dailyWins >= winsGoal ? '✓ Wins logged' : 'Log a win'}
      </button>
    </div>
  </section>
);
