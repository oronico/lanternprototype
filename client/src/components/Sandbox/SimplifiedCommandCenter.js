import React, { useMemo } from 'react';
import {
  CheckCircleIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { DAILY_SNAPSHOT, FINANCIAL, generateNudges } from '../../data/centralizedMetrics';

export default function SimplifiedCommandCenter() {
  const nudges = useMemo(() => generateNudges().slice(0, 3), []);
  const winsToday = [
    { label: 'Attendance submitted', done: true },
    { label: 'Payments reviewed', done: false },
    { label: 'Fundraising touchpoint', done: false }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="bg-white rounded-2xl shadow p-6 border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-600">Sandbox</p>
            <h1 className="text-2xl font-bold text-gray-900">Simplified Command Center</h1>
            <p className="text-sm text-gray-600">Daily snapshot + top actions, AI-ready layout.</p>
          </div>
          <TrophyIcon className="h-10 w-10 text-primary-500" />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Days Cash" value={`${FINANCIAL.daysCash} days`} helper="8 days until 30-day cushion" positive />
        <StatCard title="Collections" value="96% on time" helper="1 family needs nudge" />
        <StatCard title="Enrollment" value={`${DAILY_SNAPSHOT.enrollment}/35`} helper="11 seats to goal" />
      </section>

      <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Daily Wins</h2>
          <span className="text-sm text-primary-600">{winsToday.filter(w => w.done).length}/3 complete</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {winsToday.map(win => (
            <span
              key={win.label}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                win.done ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {win.done ? '✓' : '○'} {win.label}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <ArrowTrendingUpIcon className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Coaching Nudges</h2>
        </div>
        <div className="space-y-3">
          {nudges.map((nudge, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{nudge.title}</p>
                <p className="text-xs text-gray-600">{nudge.description || 'AI will summarize this soon.'}</p>
              </div>
              <div className="flex gap-2">
                {nudge.phone && (
                  <ActionButton title="Call" icon={PhoneIcon} onClick={() => window.location.href = `tel:${nudge.phone}`} />
                )}
                {nudge.email && (
                  <ActionButton title="Email" icon={EnvelopeIcon} onClick={() => window.location.href = `mailto:${nudge.email}`} />
                )}
                <ActionButton title="Log" icon={CheckCircleIcon} onClick={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value, helper, positive }) => (
  <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
    <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    <p className={`text-sm mt-2 ${positive ? 'text-emerald-600' : 'text-gray-600'}`}>{helper}</p>
  </div>
);

const ActionButton = ({ title, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
    title={title}
  >
    <Icon className="h-4 w-4" />
  </button>
);

