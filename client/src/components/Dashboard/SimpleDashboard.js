import React from 'react';
import {
  BanknotesIcon,
  UserGroupIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  UsersIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ENROLLMENT, FINANCIAL, ATTENDANCE, OPERATIONS, STAFF, FACILITY } from '../../data/centralizedMetrics';
import { CoachingAlert } from '../Gamification/CoachingAlerts';

/**
 * Simple Dashboard - Clean, Fast, No API Dependencies
 * 
 * Shows key metrics directly from centralized data
 * No loading states, no conditionals, just works
 */

const formatCurrency = (value) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const getStatus = (value, goodThreshold, warningThreshold, invert = false) => {
  if (invert) {
    if (value <= goodThreshold) return 'good';
    if (value <= warningThreshold) return 'warning';
    return 'alarm';
  }
  if (value >= goodThreshold) return 'good';
  if (value >= warningThreshold) return 'warning';
  return 'alarm';
};

const statusMeta = {
  good: { text: 'On Track', badge: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="h-4 w-4 text-green-600" /> },
  warning: { text: 'Needs Work', badge: 'bg-yellow-100 text-yellow-800', icon: <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" /> },
  alarm: { text: 'Alarm', badge: 'bg-red-100 text-red-800', icon: <XCircleIcon className="h-4 w-4 text-red-600" /> }
};

const buildHealthCategories = () => ([
  {
    id: 'financial',
    name: 'Financial Fitness',
    icon: BanknotesIcon,
    accent: 'green',
    cta: { label: 'Open Financials', href: '/financials' },
    metrics: [
      { label: 'Days Cash on Hand', value: `${FINANCIAL.daysCash} days`, status: getStatus(FINANCIAL.daysCash, 30, 20) },
      { label: 'Collections', value: `${OPERATIONS.onTimePayment}%`, status: getStatus(OPERATIONS.onTimePayment, 95, 90) },
      { label: 'Profit Margin', value: `${FINANCIAL.profitMargin}%`, status: getStatus(FINANCIAL.profitMargin, 12, 8) }
    ]
  },
  {
    id: 'facility',
    name: 'Facility & Safety',
    icon: BuildingOfficeIcon,
    accent: 'purple',
    cta: { label: 'View Facility Plan', href: '/facility' },
    metrics: [
      { label: 'Rent to Revenue', value: `${Math.round(FINANCIAL.facilityBurden * 100)}%`, status: getStatus(FINANCIAL.facilityBurden * 100, 20, 25, true) },
      { label: 'Occupancy', value: `${FACILITY.facilityCapacityUtilization}%`, status: getStatus(FACILITY.facilityCapacityUtilization, 85, 70) },
      { label: 'Compliance Docs', value: FACILITY.fireInspectionsCurrent ? 'Up to date' : 'Needs update', status: FACILITY.fireInspectionsCurrent ? 'good' : 'warning' }
    ]
  },
  {
    id: 'students',
    name: 'Students & Enrollment',
    icon: UserGroupIcon,
    accent: 'blue',
    cta: { label: 'Open Enrollment', href: '/crm/recruitment' },
    metrics: [
      { label: 'Enrollment to Goal', value: `${ENROLLMENT.goalProgress}%`, status: getStatus(ENROLLMENT.goalProgress, 90, 80) },
      { label: 'Attendance', value: `${ATTENDANCE.ytdRate}%`, status: getStatus(ATTENDANCE.ytdRate, 95, 92) },
      { label: 'Retention', value: `${ENROLLMENT.retentionRate}%`, status: getStatus(ENROLLMENT.retentionRate, 90, 85) }
    ]
  },
  {
    id: 'staff',
    name: 'People & Payroll',
    icon: UsersIcon,
    accent: 'orange',
    cta: { label: 'Review Staffing', href: '/staff' },
    metrics: [
      { label: 'Labor Cost %', value: `${Math.round(STAFF.staffingRatio * 100)}%`, status: getStatus(STAFF.staffingRatio * 100, 55, 60, true) },
      { label: 'Next Payroll', value: STAFF.nextPayrollDate || 'N/A', status: 'good' },
      { label: 'Open Roles', value: STAFF.openRoles || 0, status: STAFF.openRoles > 0 ? 'warning' : 'good' }
    ]
  },
  {
    id: 'future',
    name: 'Future Ready',
    icon: RocketLaunchIcon,
    accent: 'indigo',
    cta: { label: 'See Future Ready', href: '/health' },
    metrics: [
      { label: 'Innovation Funded', value: `${FINANCIAL.fundraisingSecuredYTD ? `$${(FINANCIAL.fundraisingSecuredYTD / 1000).toFixed(1)}k` : '$0'}`, status: FINANCIAL.fundraisingSecuredYTD > 0 ? 'good' : 'warning' },
      { label: 'Strategic Projects', value: OPERATIONS.projectsOnTrack ? 'On track' : 'Needs attention', status: OPERATIONS.projectsOnTrack ? 'good' : 'warning' }
    ]
  }
]);

export default function SimpleDashboard() {
  const healthCategories = buildHealthCategories();
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Good Morning! 👋</h1>
        <p className="text-lg text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Performance Snapshot - Top of Page */}
      <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Performance Snapshot</h2>
            <p className="text-primary-100">Your key metrics at a glance</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{FINANCIAL.healthScore}</div>
            <div className="text-sm text-primary-100">Health Score</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Enrollment</div>
            <div className="text-2xl font-bold">{ENROLLMENT.current}/{ENROLLMENT.target}</div>
            <div className="text-xs text-primary-200">{ENROLLMENT.goalProgress}% to goal</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Operating Cash</div>
            <div className="text-2xl font-bold">{FINANCIAL.daysCash} days</div>
            <div className="text-xs text-primary-200">${(FINANCIAL.operatingCash / 1000).toFixed(0)}k checking</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Savings Reserve</div>
            <div className="text-2xl font-bold">${(FINANCIAL.savingsCash / 1000).toFixed(1)}k</div>
            <div className="text-xs text-primary-200">Emergency fund 💰</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Attendance</div>
            <div className="text-2xl font-bold">{ATTENDANCE.ytdRate}%</div>
            <div className="text-xs text-primary-200">YTD average</div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="text-xs text-primary-100 mb-1">Collections</div>
            <div className="text-2xl font-bold">{OPERATIONS.onTimePayment}%</div>
            <div className="text-xs text-primary-200">On-time payments</div>
          </div>
        </div>
      </div>

      <HealthOverview categories={healthCategories} />
      <QuickStatSection
        title="Student Snapshot"
        description="Enrollment health indicators pulled directly from your SIS."
        cards={[
          { label: 'Current Enrollment', value: `${ENROLLMENT.current} students`, sublabel: `Goal ${ENROLLMENT.target}` },
          { label: 'Enrollment to Goal', value: `${ENROLLMENT.goalProgress}%`, sublabel: 'Including pending offers' },
          { label: 'Attrition Rate', value: `${ENROLLMENT.attritionRate}%`, sublabel: 'Students who left this year' },
          { label: 'Retention Rate', value: `${ENROLLMENT.retentionRate}%`, sublabel: 'Students returning' },
          { label: 'Daily Attendance', value: `${ATTENDANCE.todayRate}%`, sublabel: 'Today’s check-ins' },
          { label: 'Students with IEP/SpEd', value: `${ENROLLMENT.specialEducationPercent}%`, sublabel: 'Require accommodations' },
          { label: 'Free & Reduced Lunch', value: `${ENROLLMENT.freeReducedLunchPercent}%`, sublabel: 'Need financial support' }
        ]}
      />
      <QuickStatSection
        title="Financial Pulse"
        description="Cash runway, break-even, and debt coverage in one glance."
        cards={[
          { label: 'Operating Cash', value: formatCurrency(FINANCIAL.operatingCash), sublabel: 'Checking balance' },
          { label: 'Days Cash on Hand', value: `${FINANCIAL.daysCash} days`, sublabel: 'Goal 30+' },
          { label: 'Monthly Break Even', value: formatCurrency(FINANCIAL.monthlyBreakEven), sublabel: 'Expenses to cover' },
          { label: 'Revenue Needed per Student', value: formatCurrency(FINANCIAL.revenuePerStudent), sublabel: `${ENROLLMENT.current} enrolled` },
          { label: 'Savings Balance', value: formatCurrency(FINANCIAL.savingsCash), sublabel: `${FINANCIAL.savingsProgress}% of reserve goal` },
          { label: 'DSCR', value: `${FINANCIAL.dscr}x`, sublabel: 'Debt coverage ratio' },
          { label: 'MADS', value: formatCurrency(FINANCIAL.mads), sublabel: 'Max annual debt service' }
        ]}
      />
      <QuickStatSection
        title="Facility & Operations"
        description="Facilities cost profile and capacity in one place."
        cards={[
          { label: 'Monthly Facility Cost', value: formatCurrency(FACILITY.totalMonthlyCost), sublabel: 'Lease + operations' },
          { label: 'Rent to Revenue', value: `${Math.round(FACILITY.rentToRevenue * 100)}%`, sublabel: 'Target ≤ 20%' },
          { label: 'Capacity Utilization', value: `${FACILITY.facilityCapacityUtilization}%`, sublabel: 'Students vs. space' },
          { label: 'Lease Expiration', value: FACILITY.leaseExpiration, sublabel: 'Plan renewals early' }
        ]}
      />
      <DetailedMetrics />

      {/* Savings Builder - Gamified Encouragement */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏦</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Build Your Emergency Reserve! 💚
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              You've saved <strong>${FINANCIAL.savingsCash.toLocaleString()}</strong>! 
              Financial experts recommend 3-6 months of expenses as an emergency fund.
            </p>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Progress to 3-Month Reserve:</span>
                <span className="font-bold text-green-700">
                  ${FINANCIAL.savingsCash.toLocaleString()} of ${(FINANCIAL.monthlyExpenses * 3).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((FINANCIAL.savingsCash / (FINANCIAL.monthlyExpenses * 3)) * 100, 100)}%` }}
                >
                  <span className="text-xs text-white font-bold">
                    {Math.round((FINANCIAL.savingsCash / (FINANCIAL.monthlyExpenses * 3)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-gray-600">
                Save just <strong>${Math.round((FINANCIAL.monthlyExpenses * 3 - FINANCIAL.savingsCash) / 12).toLocaleString()}/month</strong> for a year to reach your 3-month goal!
              </div>
              <button 
                onClick={() => window.location.href = '/bookkeeping'}
                className="touch-target w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm text-center"
              >
                Open High-Yield Savings
              </button>
            </div>
            
            <div className="mt-3 text-xs text-green-800 italic">
              💡 Partner banks offer 4-5% APY on business savings - your money works for you!
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Alerts - Gamified! */}
      {FINANCIAL.daysCash < 30 && (
        <div className="mb-8">
          <CoachingAlert 
            type="LOW_CASH"
            data={[FINANCIAL.daysCash]}
            onAction={() => window.location.href = '/payments'}
          />
        </div>
      )}

      {ENROLLMENT.current < ENROLLMENT.target && (
        <div className="mb-8">
          <CoachingAlert 
            type="BELOW_ENROLLMENT"
            data={[ENROLLMENT.current, ENROLLMENT.target, ENROLLMENT.ytdGrowth]}
            onAction={() => window.location.href = '/crm/recruitment'}
          />
        </div>
      )}


      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <a 
          href="/command-center"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Today's Actions</h4>
          <p className="text-sm text-gray-600 mb-4">
            View action items, nudges, and daily tasks
          </p>
          <div className="text-primary-600 font-medium flex items-center gap-2">
            Go to Command Center
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>

        <a 
          href="/students"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Student Management</h4>
          <p className="text-sm text-gray-600 mb-4">
            View all {ENROLLMENT.current} enrolled students and take attendance
          </p>
          <div className="text-blue-600 font-medium flex items-center gap-2">
            Go to Students
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>

        <a 
          href="/payments"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-green-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Payments</h4>
          <p className="text-sm text-gray-600 mb-4">
            Track payments and reconcile transactions
          </p>
          <div className="text-green-600 font-medium flex items-center gap-2">
            Go to Payments
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>

        <a 
          href="/metrics"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-indigo-500"
        >
          <h4 className="font-semibold text-gray-900 mb-2">Key Metrics</h4>
          <p className="text-sm text-gray-600 mb-4">
            View all comprehensive metrics by category
          </p>
          <div className="text-indigo-600 font-medium flex items-center gap-2">
            View All Metrics
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </a>
      </div>
    </div>
  );
}

const HealthOverview = ({ categories }) => (
  <section className="mb-10">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-600 rounded-lg">
          <SparklesIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold">Financial Health</p>
          <h3 className="text-xl font-bold text-gray-900">Scorecard Snapshot</h3>
        </div>
      </div>
      <a
        href="/health"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600"
      >
        View full scorecard
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {categories.map(category => (
        <HealthCategoryCard key={category.id} category={category} />
      ))}
    </div>
  </section>
);

const accentClasses = {
  green: { bg: 'from-green-50 to-emerald-50', border: 'border-green-100' },
  purple: { bg: 'from-purple-50 to-fuchsia-50', border: 'border-purple-100' },
  blue: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
  orange: { bg: 'from-amber-50 to-orange-50', border: 'border-orange-100' },
  indigo: { bg: 'from-slate-50 to-indigo-50', border: 'border-indigo-100' }
};

const HealthCategoryCard = ({ category }) => {
  const Icon = category.icon;
  const accent = accentClasses[category.accent] || accentClasses.green;

  return (
    <div className={`rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.bg} p-5 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white shadow">
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Category</p>
            <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
          </div>
        </div>
        {category.cta && (
          <a href={category.cta.href} className="text-xs font-semibold text-primary-600 hover:text-primary-800">
            {category.cta.label}
          </a>
        )}
      </div>
      <div className="space-y-3">
        {category.metrics.map(metric => {
          const status = statusMeta[metric.status] || statusMeta.good;
          return (
            <div key={metric.label} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.badge}`}>
                {status.icon}
                {status.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuickStatSection = ({ title, description, cards }) => (
  <section className="mb-10">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{card.label}</p>
          <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          {card.sublabel && <p className="text-xs text-gray-500 mt-1">{card.sublabel}</p>}
        </div>
      ))}
    </div>
  </section>
);

const detailedMetricsConfig = [
  {
    title: 'Students & Enrollment',
    icon: UserGroupIcon,
    accent: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    cards: [
      { label: 'Enrolled', value: `${ENROLLMENT.current}`, sub: `of ${ENROLLMENT.target} goal`, tone: 'text-blue-600' },
      { label: 'Capacity', value: `${ENROLLMENT.utilization}%`, sub: `${ENROLLMENT.current}/${ENROLLMENT.capacity}`, tone: 'text-gray-900' },
      { label: 'Attendance', value: `${ATTENDANCE.ytdRate}%`, sub: 'YTD average', tone: 'text-green-600' },
      { label: 'Retention', value: `${ENROLLMENT.retentionRate}%`, sub: 'students returned', tone: 'text-purple-600' }
    ]
  },
  {
    title: 'Money & Finance',
    icon: BanknotesIcon,
    accent: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
    cards: [
      { label: 'Operating Cash', value: `$${(FINANCIAL.operatingCash / 1000).toFixed(1)}k`, sub: `${FINANCIAL.daysCash} days`, tone: 'text-green-600' },
      { label: 'Monthly Revenue', value: `$${(FINANCIAL.monthlyRevenue / 1000).toFixed(1)}k`, sub: 'tuition income', tone: 'text-gray-900' },
      { label: 'Monthly Expenses', value: `$${(FINANCIAL.monthlyExpenses / 1000).toFixed(1)}k`, sub: 'total costs', tone: 'text-gray-900' },
      { label: 'Net Income', value: `$${(FINANCIAL.netIncome / 1000).toFixed(1)}k`, sub: `${FINANCIAL.profitMargin}% margin`, tone: 'text-green-600' }
    ]
  },
  {
    title: 'Operations & Compliance',
    icon: BuildingOfficeIcon,
    accent: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-100',
    cards: [
      { label: 'Contracts Signed', value: `${OPERATIONS.contractCoverage}%`, sub: `${ENROLLMENT.current - OPERATIONS.missingContracts}/${ENROLLMENT.current}`, tone: 'text-indigo-600' },
      { label: 'On-Time Payments', value: `${OPERATIONS.onTimePayment}%`, sub: 'families current', tone: 'text-green-600' },
      { label: 'Staff Count', value: `${STAFF.total}`, sub: `${STAFF.w2Employees} W-2 / ${STAFF.contractors1099} 1099`, tone: 'text-orange-600' },
      { label: 'Facility Burden', value: `${Math.round(FACILITY.facilityBurden * 100)}%`, sub: 'of revenue', tone: 'text-orange-600' }
    ]
  }
];

const DetailedMetrics = () => (
  <section className="mb-10 space-y-8">
    <h3 className="text-xl font-bold text-gray-900">Your School at a Glance</h3>
    {detailedMetricsConfig.map(section => (
      <div
        key={section.title}
        className={`bg-gradient-to-br ${section.accent} rounded-2xl p-6 border ${section.border}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white shadow rounded-lg">
            <section.icon className="h-6 w-6 text-gray-700" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {section.cards.map(card => (
            <div key={card.label} className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-600 mb-1">{card.label}</div>
              <div className={`text-2xl font-bold ${card.tone}`}>{card.value}</div>
              <div className="text-xs text-gray-500">{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </section>
);

