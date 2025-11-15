import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { FINANCIAL, ENROLLMENT, generateNudges } from '../../data/centralizedMetrics';
import { financialsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import TransactionSplitModal from './TransactionSplitModal';
import {
  buildDefaultAllocations,
  normalizeAllocations,
  computeActivitySummary,
  computeChecklistProgress
} from '../../utils/financials';

const defaultSplitModalState = { open: false, transaction: null, allocations: [], error: '', saving: false };
const COST_CENTERS = ['Instruction', 'Operations', 'Facilities', 'Administration', 'Development', 'Student Support', 'Technology'];

const FinancialsLanding = () => {
  const nudges = generateNudges().filter(n => ['payment', 'financial', 'fundraising'].includes(n.type)).slice(0, 3);
  const [activity, setActivity] = useState([]);
  const [statements, setStatements] = useState([]);
  const [activitySummary, setActivitySummary] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState('');
  const [splitModal, setSplitModal] = useState(defaultSplitModalState);
  const [checklist, setChecklist] = useState([]);
  const [checklistProgress, setChecklistProgress] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [statementError, setStatementError] = useState('');
  const statementReviewCount = useMemo(
    () => statements.reduce((sum, stmt) => sum + (stmt.lines?.filter(line => line.status !== 'matched').length || 0), 0),
    [statements]
  );
  const coachInsights = useMemo(() => {
    const insights = [];
    if (activitySummary?.needsSplitCount > 0) {
      insights.push({
        id: 'splits',
        title: 'Split deposits to students',
        description: `${activitySummary.needsSplitCount} deposits are waiting for per-student allocation before reconciliation.`,
        actionLabel: 'Open Receivables',
        actionHref: '/payments'
      });
    }
    if (statementReviewCount > 0) {
      insights.push({
        id: 'statements',
        title: 'Clear credit card statements',
        description: `${statementReviewCount} card or bank statement lines still need receipts or categorization.`,
        actionLabel: 'Review statements',
        actionHref: '/bookkeeping?tab=credit-cards'
      });
    }
    if (checklistProgress && checklistProgress.percent < 100) {
      const remaining = checklist.filter(step => !step.done).length;
      insights.push({
        id: 'close',
        title: 'Close the month',
        description: `${remaining} checklist step${remaining === 1 ? '' : 's'} left before books are bank-ready.`,
        actionLabel: 'Open close guide',
        actionHref: '/bookkeeping?tab=close'
      });
    }
    if (nudges.length > 0) {
      insights.push({
        id: 'nudge',
        title: nudges[0].title,
        description: nudges[0].description,
        actionLabel: 'View action center',
        actionHref: '/health'
      });
    }
    return insights;
  }, [activitySummary, statementReviewCount, checklistProgress, checklist, nudges]);

  useEffect(() => {
    loadActivity();
    loadChecklist();
  }, []);

  const loadActivity = async () => {
    setLoadingActivity(true);
    setActivityError('');
    try {
      const { data } = await financialsAPI.getActivityFeed();
      const items = data.activity || [];
      setActivity(items);
      setStatements(data.statements || []);
      setStatementError('');
      setActivitySummary(data.summary || computeActivitySummary(items));
    } catch (error) {
      console.error('Failed to load activity feed', error);
      setActivityError('Unable to load activity feed right now. Please refresh.');
      setActivity([]);
      setStatements([]);
      setActivitySummary(null);
    } finally {
      setLoadingActivity(false);
    }
  };

  const loadChecklist = async () => {
    setLoadingChecklist(true);
    try {
      const { data } = await financialsAPI.getMonthCloseChecklist();
      const steps = data.checklist || [];
      setChecklist(steps);
      setChecklistProgress(data.progress || computeChecklistProgress(steps));
    } catch (error) {
      console.error('Failed to load month-end checklist', error);
      setChecklist([]);
      setChecklistProgress(null);
    } finally {
      setLoadingChecklist(false);
    }
  };

  const openSplitModalForTransaction = (txn) => {
    setSplitModal({
      open: true,
      transaction: txn,
      allocations: buildDefaultAllocations(txn),
      error: '',
      saving: false
    });
  };

  const closeSplitModal = () => setSplitModal(defaultSplitModalState);

  const handleSplitSave = async (allocations) => {
    if (!splitModal.transaction) return;
    const txn = splitModal.transaction;
    const normalized = normalizeAllocations(allocations);
    const total = normalized.reduce((sum, alloc) => sum + alloc.amount, 0);

    if (Math.round(total * 100) !== Math.round(txn.amount * 100)) {
      setSplitModal(prev => ({ ...prev, error: `Allocation must total $${txn.amount}` }));
      return;
    }

    try {
      setSplitModal(prev => ({ ...prev, saving: true, error: '' }));
      await financialsAPI.splitTransaction(txn.id, normalized);
      setActivity(prev => {
        const updated = prev.map(item =>
          item.id === txn.id
            ? { ...item, requiresSplit: false, status: 'mapped', students: normalized }
            : item
        );
        setActivitySummary(computeActivitySummary(updated));
        return updated;
      });
      closeSplitModal();
    } catch (error) {
      console.error('Failed to save split', error);
      setSplitModal(prev => ({ ...prev, error: 'Unable to save split. Try again.' }));
    } finally {
      setSplitModal(prev => ({ ...prev, saving: false }));
    }
  };

  const handleMarkCategorized = async (txnId) => {
    try {
      await financialsAPI.markCategorized(txnId);
      setActivity(prev => {
        const updated = prev.map(item => item.id === txnId ? { ...item, status: 'mapped' } : item);
        setActivitySummary(computeActivitySummary(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to mark categorized', error);
      setActivityError('Unable to update transaction. Try again.');
    }
  };

  const handleMarkAsLEA = async (txnId) => {
    try {
      await financialsAPI.markAsLEADeposit(txnId);
      await loadActivity();
      toast.success('Marked as LEA / state funding deposit');
    } catch (error) {
      console.error('Failed to mark LEA deposit', error);
      setActivityError('Unable to update deposit. Try again.');
    }
  };

  const handleChecklistToggle = async (stepId, completed) => {
    try {
      const { data } = await financialsAPI.updateChecklistStep(stepId, completed);
      if (data?.checklist) {
        setChecklist(data.checklist);
        setChecklistProgress(data.progress || computeChecklistProgress(data.checklist));
      } else {
        setChecklist(prev => {
          const updated = prev.map(step => step.id === stepId ? { ...step, done: completed } : step);
          setChecklistProgress(computeChecklistProgress(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to update checklist', error);
    }
  };

  const handleStatementLineUpdate = async (statementId, lineId, updates, successMessage) => {
    try {
      setStatementError('');
      const { data } = await financialsAPI.updateStatementLine(statementId, lineId, updates);
      if (data?.statements) {
        setStatements(data.statements);
      } else {
        setStatements(prev => prev.map(stmt => {
          if (stmt.id !== statementId) return stmt;
          return {
            ...stmt,
            lines: stmt.lines?.map(line =>
              line.id === lineId ? { ...line, ...updates } : line
            ) || []
          };
        }));
      }
      if (successMessage) toast.success(successMessage);
    } catch (error) {
      console.error('Failed to update statement line', error);
      setStatementError('Unable to update statement line right now. Please retry.');
    }
  };

  const handleStatementStatusChange = (statementId, lineId, status) =>
    handleStatementLineUpdate(statementId, lineId, { status }, status === 'matched' ? 'Line reconciled' : 'Line flagged for review');

  const handleAttachReceipt = (statementId, lineId) =>
    handleStatementLineUpdate(statementId, lineId, { receiptAttached: true }, 'Receipt noted');

  const handleViewStatement = (statementId) => {
    const statement = statements.find(stmt => stmt.id === statementId);
    if (statement?.file) {
      window.open(statement.file, '_blank');
    } else {
      alert('Statement available soon.');
    }
  };

  const reviewCount = activitySummary?.needsReviewCount ?? activity.filter(a => a.status !== 'mapped').length;
  const splitCount = activitySummary?.needsSplitCount ?? activity.filter(a => a.requiresSplit).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="bg-white rounded-2xl shadow p-6 border border-primary-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-600">Financials</p>
            <h1 className="text-3xl font-bold text-gray-900">Money In · Money Out</h1>
            <p className="text-sm text-gray-600">Tuition, fundraising, expenses, and payroll—organized for underwriting-ready books.</p>
          </div>
          <div className="flex items-center gap-4">
            <MetricChip label="Days Cash" value={`${FINANCIAL.daysCash} / 30`} />
            <MetricChip label="Collections" value={`${FINANCIAL.collectionRate}%`} positive />
            <MetricChip label="Enrollment to Goal" value={`${ENROLLMENT.goalProgress}%`} />
          </div>
        </div>
      </header>

      {coachInsights.length > 0 && (
        <section className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-700 font-semibold">Built-in Consultant</p>
              <p className="text-sm text-gray-700">AI coach is watching your books and highlighting what matters most today.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {coachInsights.map((insight) => (
              <div key={insight.id} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white shadow-sm flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-600 flex-1">{insight.description}</p>
                {insight.actionHref && (
                  <Link
                    to={insight.actionHref}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800"
                  >
                    {insight.actionLabel}
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialColumn
          title="Receivables · Tuition & Funding"
          description="Track private-pay tuition, ESA reimbursements, and LEA/state deposits with the right reconciliation rules."
          cards={[
            {
              title: 'Cash & Collections (Private Tuition)',
              description: 'Map family payments per student, unbundle siblings, and chase on-time collections.',
              href: '/payments',
              icon: BanknotesIcon
            },
            {
              title: 'ESA & LEA Funding',
              description: 'Handle batch deposits from ESAs or local education agencies—mark as LEA when per-student splits aren’t required.',
              href: '/payments?program=esa',
              icon: CurrencyDollarIcon
            },
            {
              title: 'Cash Flow Forecast',
              description: 'Understand runway and scenario plan.',
              href: '/cash-reality',
              icon: ArrowTrendingUpIcon
            }
          ]}
        />
        <FinancialColumn
          title="Expenses · Bookkeeping & Payroll"
          description="Bookkeeping, cost centers, and payroll guidance in one lane."
          cards={[
            {
              title: 'Bookkeeping',
              description: 'Categorize expenses, enforce cost centers, attach receipts & statements.',
              href: '/bookkeeping',
              icon: DocumentTextIcon
            },
            {
              title: 'Payroll',
              description: 'Track runs, staff ratios, and benefit accruals.',
              href: '/payroll',
              icon: UserGroupIcon
            },
            {
              title: 'Finance Scorecard',
              description: 'Movement-based dashboard with coaching tips (Days Cash, Collections, Profit).',
              href: '/health',
              icon: CheckBadgeIcon
            }
          ]}
        />
      </section>

      <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <CreditCardIcon className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Unified Activity Feed</h2>
        </div>
        <p className="text-sm text-gray-600">Pulls Plaid bank + credit card feeds + uploaded statements into one queue with AI-suggested mappings. Private-pay tuition must be mapped per student; ESA or LEA/state funding can be marked accordingly.</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          <span className="px-3 py-1.5 rounded-full bg-gray-100">{reviewCount} transactions need review</span>
          <span className="px-3 py-1.5 rounded-full bg-gray-100">{splitCount} deposits need split per student</span>
          <span className="px-3 py-1.5 rounded-full bg-gray-100">{statements.length} statements uploaded this month</span>
        </div>
        <div className="space-y-3 min-h-[120px]">
          {loadingActivity && (
            <div className="text-sm text-gray-500">Loading Plaid feed...</div>
          )}
          {!loadingActivity && activity.length === 0 && (
            <div className="text-sm text-gray-500">No transactions ingested yet. Connect a Plaid account to get started.</div>
          )}
          {!loadingActivity && activity.length > 0 && activity.map(txn => (
            <div key={txn.id} className="flex flex-col gap-3 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {txn.direction === 'inbound' ? 'Deposit' : 'Expense'} · {txn.description}
                  </p>
                  <p className="text-xs text-gray-500">{txn.date} • {txn.account} • {txn.source}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className={`text-base font-bold ${txn.direction === 'inbound' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {txn.direction === 'inbound' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === 'mapped' ? 'bg-emerald-50 text-emerald-700' :
                    txn.status === 'needs_category' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                    {txn.status === 'mapped' ? 'Mapped' : txn.status === 'needs_category' ? 'Needs category' : 'Needs split'}
                  </span>
                  {txn.allocationType === 'lea' && (
                    <div className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-flex items-center gap-1">
                      <span className="font-semibold">LEA / State Funding</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600 flex flex-wrap gap-3">
                <span>{txn.memo}</span>
                {txn.family && <span>Family: {txn.family}</span>}
                {txn.vendor && <span>Vendor: {txn.vendor}</span>}
                {txn.statementId && (
                  <button className="text-primary-600 font-semibold" onClick={() => handleViewStatement(txn.statementId)}>
                    View statement
                  </button>
                )}
              </div>
              {txn.students && txn.students.length > 0 && (
                <div className="text-xs text-gray-600 bg-primary-50 border border-primary-100 rounded-lg p-2 flex flex-wrap gap-2">
                  {txn.students.map(s => (
                    <span key={s.name} className="font-medium text-primary-700">
                      {s.name}: ${s.amount.toLocaleString()}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {txn.requiresSplit && (
                  <button
                    className="px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded-lg"
                    onClick={() => openSplitModalForTransaction(txn)}
                  >
                    Split per student
                  </button>
                )}
                {txn.requiresSplit && txn.allowLea && (
                  <button
                    className="px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-lg"
                    onClick={() => handleMarkAsLEA(txn.id)}
                  >
                    Mark as LEA / State
                  </button>
                )}
                {txn.status === 'needs_category' && (
                  <button
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg"
                    onClick={() => handleMarkCategorized(txn.id)}
                  >
                    Mark categorized
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {activityError && <p className="text-xs text-red-600">{activityError}</p>}
        <StatementReconciliationTray
          statements={statements}
          loading={loadingActivity}
          error={statementError}
          onMarkStatus={handleStatementStatusChange}
          onAttachReceipt={handleAttachReceipt}
          onUpdateLine={handleStatementLineUpdate}
        />
      </section>

      <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <MonthCloseChecklist
          steps={checklist}
          loading={loadingChecklist}
          progress={checklistProgress}
          onToggle={handleChecklistToggle}
        />
      </section>

      {splitModal.open && (
        <TransactionSplitModal
          data={splitModal}
          onClose={closeSplitModal}
          onChangeAllocations={(allocs) => setSplitModal(prev => ({ ...prev, allocations: allocs, error: '' }))}
          onSave={handleSplitSave}
        />
      )}
    </div>
  );
};

const FinancialColumn = ({ title, description, cards }) => (
  <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="space-y-3">
      {cards.map(card => (
        <Link
          key={card.title}
          to={card.href}
          className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
        >
          <card.icon className="h-8 w-8 text-primary-500" />
          <div>
            <p className="font-semibold text-gray-900">{card.title}</p>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const MetricChip = ({ label, value, positive }) => (
  <div className={`px-4 py-2 rounded-xl border text-sm ${positive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-base font-semibold">{value}</p>
  </div>
);

const MonthCloseChecklist = ({ steps, loading, progress, onToggle }) => (
  <>
    <div className="flex items-center gap-3 mb-4">
      <BoltIcon className="h-6 w-6 text-primary-500" />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Month-End Close Guide</h2>
        {progress && (
          <p className="text-xs text-gray-500">
            {progress.completed}/{progress.total} completed · {progress.percent}% done
          </p>
        )}
      </div>
    </div>
    {loading ? (
      <div className="text-sm text-gray-500">Loading checklist...</div>
    ) : steps.length === 0 ? (
      <div className="text-sm text-gray-500">No checklist steps yet. Configure your close workflow.</div>
    ) : (
      <div className="space-y-3">
        {steps.map(step => (
          <label key={step.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(step.done)}
              onChange={(e) => onToggle(step.id, e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </label>
        ))}
      </div>
    )}
  </>
);

const StatementReconciliationTray = ({ statements, loading, error, onMarkStatus, onAttachReceipt, onUpdateLine }) => {
  const openStatement = (file) => {
    if (file) window.open(file, '_blank');
  };

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-gray-900 mb-2">Credit Card & Statement Reconciliation</p>
      <p className="text-xs text-gray-500 mb-3">
        Think Expensify: tag every expense to a cost center, add context, attach receipts, and mark when it’s reconciled.
      </p>
      {loading ? (
        <div className="text-xs text-gray-500">Syncing statements...</div>
      ) : statements.length === 0 ? (
        <div className="text-xs text-gray-500">Upload bank or credit card statements to reconcile.</div>
      ) : (
        <div className="space-y-4">
          {statements.map(stmt => (
            <div key={stmt.id} className="border border-gray-100 rounded-2xl p-4 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{stmt.account}</p>
                  <p className="text-xs text-gray-500">{stmt.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${stmt.status === 'uploaded' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {stmt.status === 'uploaded' ? 'Ready' : 'Processing'}
                  </span>
                  {stmt.file && (
                    <button
                      onClick={() => openStatement(stmt.file)}
                      className="text-xs text-primary-600 font-semibold"
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {stmt.lines && stmt.lines.map(line => (
                  <div key={line.id} className="p-3 bg-gray-50 rounded-xl flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{line.description}</p>
                      <p className="text-xs text-gray-500">{line.date} • {line.category || 'Uncategorized'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">${line.amount.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        line.status === 'matched'
                          ? 'bg-emerald-50 text-emerald-700'
                          : line.status === 'flagged'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {line.status === 'matched' ? 'Matched' : line.status === 'flagged' ? 'Flagged' : 'Needs review'}
                      </span>
                      {line.receiptAttached && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Receipt</span>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                      <select
                        value={line.costCenter || ''}
                        onChange={(e) => onUpdateLine(stmt.id, line.id, { costCenter: e.target.value }, 'Cost center saved')}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="">Cost center</option>
                        {COST_CENTERS.map(center => (
                          <option key={center} value={center}>{center}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        defaultValue={line.note || ''}
                        onBlur={(e) => onUpdateLine(stmt.id, line.id, { note: e.target.value }, 'Note saved')}
                        placeholder="Add description"
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {line.status !== 'matched' && (
                        <button
                          onClick={() => onMarkStatus(stmt.id, line.id, 'matched')}
                          className="px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded-lg"
                        >
                          Mark matched
                        </button>
                      )}
                      {!line.receiptAttached && (
                        <button
                          onClick={() => onAttachReceipt(stmt.id, line.id)}
                          className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg"
                        >
                          Attach receipt
                        </button>
                      )}
                      {line.status !== 'flagged' && (
                        <button
                          onClick={() => onMarkStatus(stmt.id, line.id, 'flagged')}
                          className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-700 rounded-lg"
                        >
                          Flag issue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FinancialsLanding;

