import React, { useEffect, useMemo, useState } from 'react';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  TrophyIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  DocumentTextIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { fundraisingAPI } from '../../services/api';

const PIPELINE_STAGES = [
  { id: 'prospect', name: 'Prospects', description: 'Research + alignment', color: 'blue' },
  { id: 'nurture', name: 'Nurture', description: 'Relationship building', color: 'indigo' },
  { id: 'pursue', name: 'Pursue', description: 'Preparing proposal / cultivation', color: 'purple' },
  { id: 'apply', name: 'Apply / Ask', description: 'Request submitted / event live', color: 'amber' },
  { id: 'closed_won', name: 'Closed Won', description: 'Funding secured', color: 'green' },
  { id: 'closed_lost', name: 'Closed Lost', description: 'Not awarded', color: 'red' }
];

const STAGE_WEIGHTS = {
  prospect: 0.15,
  nurture: 0.3,
  pursue: 0.45,
  apply: 0.65,
  closed_won: 1,
  closed_lost: 0
};

const EMPTY_FORM = {
  name: '',
  organizationType: 'foundation',
  pursuitType: 'grant',
  awardType: 'restricted',
  eventName: '',
  stage: 'prospect',
  askAmount: '',
  amountAwarded: '',
  contactName: '',
  contactOrganization: '',
  contactEmail: '',
  contactPhone: '',
  nextStep: '',
  dueDate: '',
  notes: ''
};

const DEFAULT_SUMMARY = {
  annualGoal: 0,
  securedRestricted: 0,
  securedUnrestricted: 0,
  pipelineTotal: 0,
  weightedForecast: 0,
  winRate: 0
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0';
  return `$${Number(value).toLocaleString()}`;
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const daysUntil = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const daysSince = (value) => {
  const date = parseDate(value);
  if (!date) return null;
  return Math.ceil((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [annualGoal, setAnnualGoal] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [bookkeepingSync, setBookkeepingSync] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goalDirty, setGoalDirty] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState(EMPTY_FORM);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedType = localStorage.getItem('entityType') || 'llc-single';
      setEntityType(storedType);
    }
  }, []);

  useEffect(() => {
    if (entityType === '501c3') {
      loadFundraisingData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType]);

  const loadFundraisingData = async () => {
    try {
      setLoading(true);
      const { data } = await fundraisingAPI.getOpportunities();
      setAnnualGoal(data.annualGoal ?? data.summary?.annualGoal ?? 0);
      setOpportunities(data.opportunities || []);
      setDocuments(data.documents || []);
      setBookkeepingSync(data.bookkeepingSync || []);
      setSummary(data.summary || DEFAULT_SUMMARY);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load fundraising data');
    } finally {
      setGoalDirty(false);
      setLoading(false);
    }
  };

  const upsertOpportunity = (updatedOpportunity, nextSummary) => {
    setOpportunities((prev) => {
      const index = prev.findIndex((op) => op.id === updatedOpportunity.id);
      if (index === -1) return [updatedOpportunity, ...prev];
      const clone = [...prev];
      clone[index] = updatedOpportunity;
      return clone;
    });
    if (nextSummary) {
      setSummary(nextSummary);
    }
  };

  const handleStageChange = async (opportunity, nextStage) => {
    try {
      const updates = { stage: nextStage };
      if (nextStage === 'closed_won' && !opportunity.amountAwarded) {
        updates.amountAwarded = opportunity.askAmount;
      }
      const { data } = await fundraisingAPI.updateOpportunity(opportunity.id, updates);
      upsertOpportunity(data.opportunity, data.summary);
      toast.success(`Moved to ${PIPELINE_STAGES.find((s) => s.id === nextStage)?.name || nextStage}`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update stage');
    }
  };

  const handleAmountAwardedChange = async (opportunity, value) => {
    try {
      const amountAwarded = Number(value) || 0;
      const { data } = await fundraisingAPI.updateOpportunity(opportunity.id, { amountAwarded });
      upsertOpportunity(data.opportunity, data.summary);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update award amount');
    }
  };

  const handleNewOpportunityChange = (field, value) => {
    setNewOpportunity((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    const payload = {
      name: newOpportunity.name,
      organizationType: newOpportunity.organizationType,
      pursuitType: newOpportunity.pursuitType,
      awardType: newOpportunity.awardType,
      eventName: newOpportunity.pursuitType === 'event' ? newOpportunity.eventName : '',
      stage: newOpportunity.stage,
      askAmount: Number(newOpportunity.askAmount) || 0,
      amountAwarded:
        newOpportunity.stage === 'closed_won'
          ? Number(newOpportunity.amountAwarded || newOpportunity.askAmount || 0)
          : 0,
      contact: {
        name: newOpportunity.contactName,
        organization: newOpportunity.contactOrganization,
        email: newOpportunity.contactEmail,
        phone: newOpportunity.contactPhone
      },
      nextStep: newOpportunity.nextStep || 'Define next action',
      dueDate: newOpportunity.dueDate || '',
      notes: newOpportunity.notes
    };

    try {
      setCreatingOpportunity(true);
      const { data } = await fundraisingAPI.createOpportunity(payload);
      setOpportunities((prev) => [data.opportunity, ...prev]);
      if (data.summary) setSummary(data.summary);
      toast.success('Opportunity added');
      setShowAddModal(false);
      setNewOpportunity(EMPTY_FORM);
    } catch (error) {
      console.error(error);
      toast.error('Unable to add opportunity');
    } finally {
      setCreatingOpportunity(false);
    }
  };

  const handleGoalBlur = async () => {
    if (!goalDirty) return;
    try {
      setSavingGoal(true);
      const { data } = await fundraisingAPI.updateGoal(annualGoal);
      if (data.summary) setSummary(data.summary);
      toast.success('Goal updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update goal');
    } finally {
      setSavingGoal(false);
      setGoalDirty(false);
    }
  };

  const filteredContacts = useMemo(() => {
    const unique = new Map();
    opportunities.forEach((op) => {
      if (!op.contact?.email) return;
      unique.set(op.contact.email, {
        name: op.contact.name,
        organization: op.contact.organization,
        email: op.contact.email,
        phone: op.contact.phone,
        lastTouch: op.lastTouch,
        stage: op.stage,
        pursuitType: op.pursuitType
      });
    });
    return Array.from(unique.values());
  }, [opportunities]);

  const stageBuckets = useMemo(() => {
    return PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage.id] = opportunities.filter((op) => op.stage === stage.id);
      return acc;
    }, {});
  }, [opportunities]);

  const wonTotal = useMemo(
    () =>
      opportunities
        .filter((op) => op.stage === 'closed_won')
        .reduce((sum, op) => sum + (op.amountAwarded || 0), 0),
    [opportunities]
  );

  const restrictedTotal = summary?.securedRestricted ?? opportunities
    .filter((op) => op.stage === 'closed_won' && op.awardType === 'restricted')
    .reduce((sum, op) => sum + (op.amountAwarded || 0), 0);

  const unrestrictedTotal = summary?.securedUnrestricted ?? Math.max(wonTotal - restrictedTotal, 0);

  const weightedForecast = summary?.weightedForecast ?? opportunities.reduce((sum, op) => {
    const weight = STAGE_WEIGHTS[op.stage] ?? 0;
    return sum + (op.askAmount || 0) * weight;
  }, 0);

  const documentsNeedingAction = useMemo(
    () => documents.filter((doc) => doc.status && doc.status !== 'stored'),
    [documents]
  );

  const bookkeepingReady = useMemo(
    () => bookkeepingSync.filter((entry) => entry.status !== 'synced'),
    [bookkeepingSync]
  );

  const automationQueue = useMemo(() => {
    const upcoming = opportunities.filter((op) => {
      if (!op.dueDate) return false;
      const days = daysUntil(op.dueDate);
      return days !== null && days >= 0 && days <= 7 && !['closed_won', 'closed_lost'].includes(op.stage);
    });
    const stale = opportunities.filter((op) => {
      const age = daysSince(op.lastTouch);
      return age !== null && age >= 21 && !['closed_won', 'closed_lost'].includes(op.stage);
    });
    const merged = [...upcoming, ...stale];
    const unique = [];
    const seen = new Set();
    merged.forEach((item) => {
      if (!seen.has(item.id)) {
        unique.push(item);
        seen.add(item.id);
      }
    });
    return unique.slice(0, 4);
  }, [opportunities]);

  const handleReminderAction = (opportunity, action) => {
    toast.success(`${action} queued for ${opportunity.name}`);
  };

  const handleDocumentAction = (doc) => {
    if (doc.url) {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    } else {
      toast('Attach the award letter or IRS form from your files.');
    }
  };

  const handleBookkeepingSync = (entry) => {
    toast.success(`Marked ${entry.description} for QuickBooks sync`);
  };

  if (entityType !== '501c3') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-2">Fundraising is unlocked for 501(c)(3) schools</h2>
              <p className="text-sm text-yellow-800 mb-4">
                Grants, donor tracking, and audit-ready revenue workflows display automatically when your entity type is set to nonprofit.
              </p>
              <button
                onClick={() => { window.location.href = '/settings'; }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold"
              >
                Update Entity Type
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary-300 border-t-purple-600 rounded-full mb-4"></div>
          <p className="text-sm text-gray-600">Loading fundraising workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="h-10 w-10 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fundraising</h1>
            <p className="text-sm text-gray-600">
              Manage donors, grants, events, and audit-ready revenue from one mobile workspace.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Opportunity
          </button>
          <button
            onClick={loadFundraisingData}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Goal tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/80">Annual Goal</p>
              <h3 className="text-3xl font-bold">{formatCurrency(annualGoal)}</h3>
            </div>
            <ArrowTrendingUpIcon className="h-10 w-10 text-white/70" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Secured</span>
              <span className="font-semibold">{formatCurrency(wonTotal)}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2.5">
              <div
                className="bg-white rounded-full h-2.5"
                style={{ width: `${annualGoal ? Math.min((wonTotal / annualGoal) * 100, 100) : 0}%` }}
              />
            </div>
            <div className="text-xs text-white/70">
              {annualGoal ? ((wonTotal / annualGoal) * 100).toFixed(1) : 0}% to goal • {formatCurrency(Math.max(annualGoal - wonTotal, 0))} remaining
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Update goal</p>
              <h3 className="text-lg font-semibold text-gray-900">Leader-set target</h3>
            </div>
            <TrophyIcon className="h-8 w-8 text-amber-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Annual fundraising goal</label>
            <input
              type="number"
              min="0"
              value={annualGoal}
              onChange={(e) => {
                setAnnualGoal(Number(e.target.value) || 0);
                setGoalDirty(true);
              }}
              onBlur={handleGoalBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 flex items-center gap-2">
              {savingGoal ? 'Saving…' : 'Adjust anytime. Progress updates instantly.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Award type mix</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(restrictedTotal)}</h3>
              <p className="text-xs text-gray-500">Restricted awards</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(unrestrictedTotal)}</h3>
              <p className="text-xs text-gray-500">Unrestricted awards</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
              <p className="text-green-600 font-semibold">Restricted</p>
              <p className="text-gray-600 mt-1">Audit-ready, tied to program delivery.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-primary-200">
              <p className="text-blue-600 font-semibold">Unrestricted</p>
              <p className="text-gray-600 mt-1">Flexible ops + cash runway.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Weighted forecast</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(weightedForecast)}</h3>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-xs text-gray-600">
            Pipeline weighted by stage probability. Perfect for board updates and cash runway planning.
          </p>
        </div>
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedStageFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            selectedStageFilter === 'all'
              ? 'bg-primary-600 text-white border-purple-600'
              : 'text-gray-600 border-gray-200 hover:border-purple-300 hover:text-primary-600'
          }`}
        >
          All Opportunities ({opportunities.length})
        </button>
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStageFilter(stage.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              selectedStageFilter === stage.id
                ? `bg-${stage.color}-600 text-white border-${stage.color}-600`
                : 'text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {stage.name}
            <span className="ml-1">
              ({stageBuckets[stage.id]?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Pipeline board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {PIPELINE_STAGES.map((stage) => {
          const items = stageBuckets[stage.id] || [];
          if (selectedStageFilter !== 'all' && selectedStageFilter !== stage.id) {
            return null;
          }
          return (
            <div key={stage.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                  <p className="text-xs text-gray-500">{stage.description}</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">{items.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-auto">
                {items.length === 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
                    No records in this stage yet.
                  </div>
                )}
                {items.map((opportunity) => (
                  <div key={opportunity.id} className="border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-base font-semibold text-gray-900">{opportunity.name}</h5>
                        <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                          {opportunity.organizationType}
                        </p>
                      </div>
                      <select
                        value={opportunity.stage}
                        onChange={(e) => handleStageChange(opportunity, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500"
                      >
                        {PIPELINE_STAGES.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">
                        Ask: {formatCurrency(opportunity.askAmount)}
                      </span>
                      <span className={`px-2 py-1 rounded-full bg-${opportunity.pursuitType === 'event' ? 'amber' : 'blue'}-50 text-${opportunity.pursuitType === 'event' ? 'amber' : 'blue'}-700 capitalize`}>
                        {opportunity.pursuitType}
                        {opportunity.pursuitType === 'event' && opportunity.eventName ? ` · ${opportunity.eventName}` : ''}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {opportunity.awardType}
                      </span>
                    </div>
                    {opportunity.stage === 'closed_won' && (
                      <div className="mt-3 text-sm text-green-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          Awarded {formatCurrency(opportunity.amountAwarded)}
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={opportunity.amountAwarded ?? ''}
                          onChange={(e) => handleAmountAwardedChange(opportunity, e.target.value)}
                          className="w-full sm:w-32 px-2 py-1 text-xs border border-success-300 rounded-md focus:ring-1 focus:ring-green-500"
                          placeholder="Update amount"
                        />
                      </div>
                    )}
                    {opportunity.stage === 'closed_lost' && (
                      <div className="mt-3 text-xs text-red-600">
                        Outcome recorded. Capture feedback in notes for next cycle.
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        Due {opportunity.dueDate || 'TBD'}
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
                        Next: {opportunity.nextStep || 'Define action'}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Relationship owner: <span className="font-semibold">{opportunity.contact?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Automation & Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Automation & reminders</h3>
            <SparklesIcon className="h-6 w-6 text-primary-500" />
          </div>
          {automationQueue.length === 0 ? (
            <p className="text-sm text-gray-500">All prospects are on schedule. Great job!</p>
          ) : (
            <div className="space-y-3">
              {automationQueue.map((item) => {
                const dueIn = daysUntil(item.dueDate);
                const lastTouch = daysSince(item.lastTouch);
                return (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.contact?.name} • {item.organizationType}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 capitalize">
                        {item.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-4">
                      {dueIn !== null && (
                        <span className={dueIn < 0 ? 'text-red-600' : 'text-gray-700'}>
                          {dueIn < 0 ? `${Math.abs(dueIn)} days overdue` : `Due in ${dueIn} days`}
                        </span>
                      )}
                      {lastTouch !== null && <span>Last touch {lastTouch} days ago</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleReminderAction(item, 'Email')}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={() => handleReminderAction(item, 'Call')}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Schedule Call
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Finance sync & forecasts</h3>
            <BanknotesIcon className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Ready to sync</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(
              bookkeepingReady.reduce((sum, entry) => sum + (entry.amount || 0), 0)
            )}</p>
            <p className="text-xs text-gray-500">{bookkeepingReady.length} entries mapped to GL accounts</p>
          </div>
          <div className="space-y-3 max-h-72 overflow-auto">
            {bookkeepingReady.length === 0 && (
              <p className="text-sm text-gray-500">All gift revenue is synced to QuickBooks.</p>
            )}
            {bookkeepingReady.map((entry) => (
              <div key={entry.id} className="border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{entry.description}</p>
                  <p className="text-xs text-gray-500">{entry.account}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(entry.amount)}</span>
                  <button
                    onClick={() => handleBookkeepingSync(entry)}
                    className="px-3 py-1 text-xs text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    Sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents & contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Award documents & compliance</h3>
            <DocumentTextIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="table-scroll">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b">
                  <th className="py-2">Document</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                      No fundraising documents uploaded yet.
                    </td>
                  </tr>
                )}
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="py-2">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">Linked to {doc.opportunityId}</p>
                    </td>
                    <td className="py-2 text-xs capitalize">{doc.type?.replace('_', ' ')}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        doc.status === 'stored'
                          ? 'bg-emerald-50 text-emerald-700'
                          : doc.status === 'awaiting_upload'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleDocumentAction(doc)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {doc.url ? 'Open' : 'Upload'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Relationship contacts</h3>
            <UserGroupIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="table-scroll">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b">
                  <th className="py-2">Contact</th>
                  <th className="py-2">Org / Type</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContacts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                      Add opportunities to populate your contact roll-up.
                    </td>
                  </tr>
                )}
                {filteredContacts.map((contact) => (
                  <tr key={contact.email}>
                    <td className="py-2">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.stage.replace('_', ' ')}</p>
                    </td>
                    <td className="py-2 text-xs text-gray-600">{contact.organization}</td>
                    <td className="py-2 text-xs text-primary-600">{contact.email}</td>
                    <td className="py-2 text-xs text-gray-600">{contact.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add fundraising opportunity</h3>
                <p className="text-xs text-gray-500">Each field maps directly to finance and audit requirements.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddOpportunity} className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Opportunity name</label>
                  <input
                    type="text"
                    value={newOpportunity.name}
                    onChange={(e) => handleNewOpportunityChange('name', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Organization type</label>
                  <select
                    value={newOpportunity.organizationType}
                    onChange={(e) => handleNewOpportunityChange('organizationType', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="foundation">Foundation</option>
                    <option value="corporation">Corporation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Pursuit type</label>
                  <select
                    value={newOpportunity.pursuitType}
                    onChange={(e) => handleNewOpportunityChange('pursuitType', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="grant">Grant</option>
                    <option value="request">Request</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                {newOpportunity.pursuitType === 'event' && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Event name</label>
                    <input
                      type="text"
                      value={newOpportunity.eventName}
                      onChange={(e) => handleNewOpportunityChange('eventName', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 uppercase">Award type</label>
                  <select
                    value={newOpportunity.awardType}
                    onChange={(e) => handleNewOpportunityChange('awardType', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="restricted">Restricted</option>
                    <option value="unrestricted">Unrestricted</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Stage</label>
                  <select
                    value={newOpportunity.stage}
                    onChange={(e) => handleNewOpportunityChange('stage', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {PIPELINE_STAGES.map((stage) => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Ask amount</label>
                  <input
                    type="number"
                    min="0"
                    value={newOpportunity.askAmount}
                    onChange={(e) => handleNewOpportunityChange('askAmount', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {newOpportunity.stage === 'closed_won' && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Amount awarded</label>
                    <input
                      type="number"
                      min="0"
                      value={newOpportunity.amountAwarded}
                      onChange={(e) => handleNewOpportunityChange('amountAwarded', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 uppercase">Next step</label>
                  <input
                    type="text"
                    value={newOpportunity.nextStep}
                    onChange={(e) => handleNewOpportunityChange('nextStep', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Due date / event date</label>
                  <input
                    type="date"
                    value={newOpportunity.dueDate}
                    onChange={(e) => handleNewOpportunityChange('dueDate', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Primary contact</label>
                  <input
                    type="text"
                    value={newOpportunity.contactName}
                    onChange={(e) => handleNewOpportunityChange('contactName', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={newOpportunity.contactOrganization}
                    onChange={(e) => handleNewOpportunityChange('contactOrganization', e.target.value)}
                    placeholder="Organization / Title"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Email</label>
                    <input
                      type="email"
                      value={newOpportunity.contactEmail}
                      onChange={(e) => handleNewOpportunityChange('contactEmail', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Phone</label>
                    <input
                      type="text"
                      value={newOpportunity.contactPhone}
                      onChange={(e) => handleNewOpportunityChange('contactPhone', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Notes</label>
                <textarea
                  rows="3"
                  value={newOpportunity.notes}
                  onChange={(e) => handleNewOpportunityChange('notes', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Stewardship details, restrictions, audit notes, etc."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm"
                  disabled={creatingOpportunity}
                >
                  {creatingOpportunity ? 'Saving…' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraisingCRM;

