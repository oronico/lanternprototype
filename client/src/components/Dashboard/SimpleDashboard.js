import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BanknotesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
  ArrowRightIcon
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

const formatDelta = (delta, unit = '') => {
  if (!delta) return 'No change';
  const prefix = delta > 0 ? '+' : '';
  return `${prefix}${delta}${unit}`;
};

const trendColor = (delta, positiveIsUp = true) => {
  if (delta === 0) return 'text-gray-500';
  const isPositive = delta > 0;
  return (isPositive === positiveIsUp) ? 'text-emerald-600' : 'text-red-500';
};

const trendIcon = (delta, positiveIsUp = true) => {
  if (delta === 0) return null;
  const isPositive = delta > 0;
  const isUp = isPositive === positiveIsUp;
  return isUp ? <ArrowLongUpIcon className="h-4 w-4" /> : <ArrowLongDownIcon className="h-4 w-4" />;
};

const useSafeLocalStorage = (key, defaultValue = 0) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = Number(window.localStorage.getItem(key));
    if (!Number.isNaN(stored)) {
      setValue(stored);
    }
  }, [key]);

  const updateValue = (newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, String(newValue));
    }
  };

  return [value, updateValue];
};

const buildScoreboard = () => ([
  {
    id: 'cash',
    title: 'Cash Cushion',
    icon: BanknotesIcon,
    metric: `${FINANCIAL.daysCash} days`,
    detail: `${formatCurrency(FINANCIAL.operatingCash)} operating • ${formatCurrency(FINANCIAL.savingsCash)} savings`,
    story: FINANCIAL.daysCash >= FINANCIAL.cashGoal
      ? 'You can cover 3+ payrolls. Lenders love this.'
      : `Add ${FINANCIAL.cashGoal - FINANCIAL.daysCash} days to hit the 30-day benchmark.`,
    delta: FINANCIAL.daysCash - 20,
    positiveIsUp: true,
    cta: { label: 'Open Financials', href: '/financials' }
  },
  {
    id: 'students',
    title: 'Students & Seats',
    icon: UserGroupIcon,
    metric: `${ENROLLMENT.current}/${ENROLLMENT.target}`,
    detail: `${ENROLLMENT.goalProgress}% to goal • ${ATTENDANCE.todayRate}% attendance today`,
    story: ENROLLMENT.goalProgress >= 80
      ? 'Pipeline looks healthy. Keep nudging tours to contracts.'
      : 'You’re 3 families from yellow. Set two reminders now.',
    delta: ENROLLMENT.current - ENROLLMENT.target,
    positiveIsUp: true,
    cta: { label: 'View Students', href: '/students' }
  },
  {
    id: 'operations',
    title: 'Collections & Docs',
    icon: BuildingOfficeIcon,
    metric: `${OPERATIONS.onTimePayment}% on-time`,
    detail: `${OPERATIONS.contractCoverage}% contracts complete`,
    story: OPERATIONS.onTimePayment >= 95
      ? 'Cash is arriving when expected—ready for loan diligence.'
      : 'Prep gentle reminders so tuition lands before payroll.',
    delta: OPERATIONS.onTimePayment - OPERATIONS.paymentGoal,
    positiveIsUp: true,
    cta: { label: 'Cash & Collections', href: '/payments' }
  },
  {
    id: 'staff',
    title: 'People & Payroll',
    icon: UsersIcon,
    metric: `${Math.round(STAFF.staffingRatio * 100)}% labor cost`,
    detail: `${formatCurrency(STAFF.monthlyPayroll)} payroll • ${STAFF.openPositions} roles open`,
    story: STAFF.staffingRatio <= STAFF.staffingGoal
      ? 'Staffing costs are lean. Keep reserves flowing to instruction.'
      : 'Labor is running hot. Log substitutes + overtime notes.',
    delta: Math.round(STAFF.staffingRatio * 100) - (STAFF.staffingGoal * 100),
    positiveIsUp: false,
    cta: { label: 'Review Staffing', href: '/payroll' }
  },
  {
    id: 'future',
    title: 'Future Ready',
    icon: RocketLaunchIcon,
    metric: `${FINANCIAL.healthScore}/100`,
    detail: `${Math.round(FACILITY.facilityCapacityUtilization)}% capacity • lease ends ${FACILITY.leaseExpiration}`,
    story: FINANCIAL.healthScore >= 80
      ? 'Bank-ready. Keep monthly close checklist moving.'
      : 'Complete this month’s close and upload latest statements.',
    delta: FINANCIAL.healthScore - 72,
    positiveIsUp: true,
    cta: { label: 'View Scorecard', href: '/health' }
  }
]);

const buildQuickActions = () => ([
  {
    title: 'Collect Past-Due Tuition',
    description: 'Split deposits per student, send reminders, and sync to QuickBooks.',
    href: '/payments',
    icon: BanknotesIcon,
    color: 'bg-emerald-50'
  },
  {
    title: 'Categorize September AMEX',
    description: 'Match receipts, tag cost centers, and lock month-end.',
    href: '/bookkeeping?tab=credit-cards',
    icon: BuildingOfficeIcon,
    color: 'bg-blue-50'
  },
  {
    title: 'Update Board Minutes',
    description: 'Upload bylaws, minutes, and policies for governance-ready docs.',
    href: '/governance',
    icon: SparklesIcon,
    color: 'bg-purple-50'
  },
  {
    title: 'Review Fundraising Pipeline',
    description: 'Track prospects, amounts asked, and restricted vs unrestricted.',
    href: '/crm/fundraising',
    icon: ArrowTrendingUpIcon,
    color: 'bg-amber-50',
    requires501c3: true
  }
]);

export default function SimpleDashboard() {
  const [expandedTile, setExpandedTile] = useState(null);
  const [dailyWins, setDailyWins] = useSafeLocalStorage('dashboardDailyWins', 0);

  const healthTiles = useMemo(() => buildScoreboard(), []);
  const quickActions = useMemo(() => buildQuickActions(), []);

  const nudges = useMemo(() => generateNudges().slice(0, 4), []);

  const streaks = GAMIFICATION.streaks || {};
  const winsGoal = 3;
  const winsProgress = Math.min(100, Math.round((dailyWins / winsGoal) * 100));

  const handleLogWin = () => {
    const nextWins = Math.min(winsGoal, dailyWins + 1);
    setDailyWins(nextWins);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      <CoachGreeting />
      <Scoreboard
        tiles={healthTiles}
        expandedTile={expandedTile}
        onToggle={setExpandedTile}
      />
      <ActionStories nudges={nudges} />
      <GamifiedStrip
        streaks={streaks}
        dailyWins={dailyWins}
        winsGoal={winsGoal}
        winsProgress={winsProgress}
        onLogWin={handleLogWin}
      />
      <QuickActions actions={quickActions} />
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
    ? `${seatsToGoal} seats from capacity—nudge two families today.`
    : 'Enrollment goal met—lock in renewals early.';

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-3xl text-white p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-100">Today</p>
          <h1 className="text-3xl font-semibold">Hi Director, we’ve got the numbers covered.</h1>
          <p className="text-indigo-100">{today}</p>
        </div>
        <div className="bg-white/10 rounded-2xl px-4 py-3 flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-indigo-200">Focus</p>
          <p className="text-sm font-semibold">{focusText}</p>
        </div>
      </div>
    </section>
  );
};

const Scoreboard = ({ tiles, expandedTile, onToggle }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2">
      <SparklesIcon className="h-5 w-5 text-primary-500" />
      <div>
        <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">Readiness Dashboard</p>
        <p className="text-sm text-gray-600">Underwriting metrics translated into plain language.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tiles.map(tile => (
        <ScoreTile
          key={tile.id}
          tile={tile}
          expanded={expandedTile === tile.id}
          onToggle={() => onToggle(expandedTile === tile.id ? null : tile.id)}
        />
      ))}
    </div>
  </section>
);

const ScoreTile = ({ tile, expanded, onToggle }) => {
  const Icon = tile.icon;
  const deltaText = formatDelta(tile.delta, tile.id === 'cash' ? ' days' : '');
  const color = trendColor(tile.delta, tile.positiveIsUp);
  const icon = trendIcon(tile.delta, tile.positiveIsUp);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gray-100">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">CFO Lens</p>
            <h3 className="text-lg font-semibold text-gray-900">{tile.title}</h3>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-xs font-semibold text-primary-600 hover:text-primary-800"
        >
          {expanded ? 'Hide detail' : 'Explain it'}
        </button>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{tile.metric}</p>
        <p className="text-sm text-gray-600">{tile.detail}</p>
        <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
          {icon}
          {deltaText}
        </div>
      </div>
      {expanded && (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <p className="text-sm text-gray-800">{tile.story}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Our next move</span>
            <Link to={tile.cta.href} className="inline-flex items-center gap-1 text-primary-600 font-semibold">
              {tile.cta.label}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionStories = ({ nudges }) => {
  if (!nudges.length) return null;
  return (
    <section className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Coaching Stories</p>
          <h3 className="text-lg font-semibold text-gray-900">Here’s where a 10-minute push compounds.</h3>
        </div>
        <Link to="/command-center" className="text-xs font-semibold text-primary-600 hover:text-primary-800">
          Open Command Center →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nudges.map(nudge => (
          <div key={nudge.title} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">{nudge.type}</p>
            <p className="text-base font-semibold text-gray-900">{nudge.title}</p>
            <p className="text-sm text-gray-600">{nudge.description || nudge.family}</p>
            {nudge.action && (
              <button
                className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-800"
                onClick={() => { window.location.href = '/command-center'; }}
              >
                {nudge.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const GamifiedStrip = ({ streaks, dailyWins, winsGoal, winsProgress, onLogWin }) => (
  <section className="bg-gradient-to-r from-emerald-50 to-primary-50 border border-emerald-100 rounded-3xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <SparklesIcon className="h-6 w-6 text-emerald-500" />
      <div>
        <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">Daily Momentum</p>
        <p className="text-sm text-gray-700">Wins compound. Keep the streak alive.</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(streaks).map(([key, value]) => (
        <div key={key} className="bg-white rounded-2xl border border-white/80 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-2xl font-bold text-gray-900">{value} days</p>
          <p className="text-xs text-gray-500">Keep it up</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900">Daily Wins ({dailyWins}/{winsGoal})</p>
        <p className="text-xs text-gray-500">Log three wins to unlock tomorrow’s coach insight.</p>
      </div>
      <div className="flex-1 md:px-6">
        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 bg-emerald-500 rounded-full transition-all"
            style={{ width: `${winsProgress}%` }}
          />
        </div>
      </div>
      <button
        onClick={onLogWin}
        disabled={dailyWins >= winsGoal}
        className={`px-4 py-2 rounded-xl text-sm font-semibold ${
          dailyWins >= winsGoal
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {dailyWins >= winsGoal ? 'Wins logged' : 'Log a win'}
      </button>
    </div>
  </section>
);

const QuickActions = ({ actions }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Frictionless Workflows</p>
        <h3 className="text-lg font-semibold text-gray-900">Tap into the CFO toolkit.</h3>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map(action => {
        if (action.requires501c3) {
          const entityType = typeof window !== 'undefined' ? window.localStorage.getItem('entityType') : null;
          if (entityType !== '501c3') return null;
        }
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            to={action.href}
            className={`${action.color} rounded-2xl border border-white shadow-sm p-5 flex items-start gap-4 hover:border-primary-200 transition`}
          >
            <div className="p-2 rounded-xl bg-white shadow">
              <Icon className="h-5 w-5 text-gray-800" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{action.title}</p>
              <p className="text-xs text-gray-600 mb-2">{action.description}</p>
              <span className="inline-flex items-center text-xs font-semibold text-primary-600">
                Open workflow
                <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);


