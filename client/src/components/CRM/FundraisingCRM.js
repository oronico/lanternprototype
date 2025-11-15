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
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { fundraisingAPI } from '../../services/api';

/**
 * Best-in-Class Fundraising CRM for Microschools
 * 
 * Inspired by: Submittable, Fluxx, Blackbaud Grantmaking, Foundant, Salesforce NPSP
 * 
 * Features:
 * - Grant Discovery & Research Database
 * - Grant Pipeline Management (Research → Applied → Awarded → Reported)
 * - Deadline Tracking & Reminders
 * - Ask Amount vs. Awarded Amount Tracking
 * - Restricted vs. Unrestricted Revenue
 * - Contact Management (Program Officers, Foundation Reps)
 * - Document Library (LOIs, Proposals, Reports)
 * - Win/Loss Analysis
 * - Annual Goal Tracking with Weighted Forecast
 * - Reporting Requirements & Compliance
 */

// Enhanced pipeline stages inspired by Submittable + Fluxx
const PIPELINE_STAGES = [
  { id: 'research', name: 'Research', description: 'Grant discovery & eligibility check', color: 'gray', icon: MagnifyingGlassIcon },
  { id: 'qualify', name: 'Qualify', description: 'Mission aligned, building relationship', color: 'blue', icon: CheckCircleIcon },
  { id: 'loi', name: 'LOI Submitted', description: 'Letter of Intent submitted', color: 'indigo', icon: DocumentTextIcon },
  { id: 'invited', name: 'Invited to Apply', description: 'Full proposal invited', color: 'purple', icon: SparklesIcon },
  { id: 'in_progress', name: 'In Progress', description: 'Preparing full application', color: 'yellow', icon: PencilIcon },
  { id: 'submitted', name: 'Submitted', description: 'Application submitted, awaiting decision', color: 'amber', icon: ClockIcon },
  { id: 'awarded', name: 'Awarded', description: 'Grant secured!', color: 'green', icon: TrophyIcon },
  { id: 'declined', name: 'Declined', description: 'Not funded this cycle', color: 'red', icon: XMarkIcon },
  { id: 'reported', name: 'Reported', description: 'Final report submitted', color: 'teal', icon: CheckCircleIcon }
];

// Win probability weights (for forecast calculation)
const STAGE_WEIGHTS = {
  research: 0.05,
  qualify: 0.15,
  loi: 0.25,
  invited: 0.50,
  in_progress: 0.65,
  submitted: 0.75,
  awarded: 1.00,
  declined: 0,
  reported: 1.00
};

const GRANT_TYPES = [
  { value: 'foundation', label: 'Foundation Grant' },
  { value: 'corporate', label: 'Corporate Grant' },
  { value: 'government', label: 'Government Grant' },
  { value: 'individual', label: 'Major Gift (Individual)' },
  { value: 'event', label: 'Fundraising Event' },
  { value: 'campaign', label: 'Annual Campaign' }
];

const AWARD_TYPES = [
  { value: 'restricted', label: 'Restricted (Specific Use)', help: 'e.g., playground equipment, scholarships' },
  { value: 'unrestricted', label: 'Unrestricted (Operating)', help: 'Can be used for any school needs' }
];

const EMPTY_FORM = {
  name: '',
  grantType: 'foundation',
  awardType: 'restricted',
  stage: 'research',
  askAmount: '',
  amountAwarded: '',
  
  // Foundation/Funder Info
  funderName: '',
  funderWebsite: '',
  funderType: 'private',
  
  // Contact Info (Program Officer)
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  
  // Timeline
  discoveryDate: new Date().toISOString().split('T')[0],
  loiDueDate: '',
  proposalDueDate: '',
  decisionDate: '',
  reportDueDate: '',
  
  // Application Details
  eligibilityMatch: true,
  typicalRange: '',
  restrictions: '',
  purpose: '',
  
  // Internal Tracking
  leadStaffMember: '',
  priority: 'medium',
  notes: '',
  nextAction: '',
  
  // Reporting
  reportingFrequency: 'annual',
  metricsRequired: []
};

const DEFAULT_SUMMARY = {
  annualGoal: 0,
  securedRestricted: 0,
  securedUnrestricted: 0,
  pipelineTotal: 0,
  weightedForecast: 0,
  winRate: 0,
  averageGrantSize: 0,
  totalAsked: 0,
  totalAwarded: 0
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
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return days;
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [view, setView] = useState('pipeline'); // pipeline, grants, contacts, reports
  const [annualGoal, setAnnualGoal] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);
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
  }, [entityType]);

  const loadFundraisingData = async () => {
    try {
      setLoading(true);
      const { data } = await fundraisingAPI.getOpportunities();
      setAnnualGoal(data.annualGoal ?? data.summary?.annualGoal ?? 0);
      setOpportunities(data.opportunities || []);
      setSummary(data.summary || DEFAULT_SUMMARY);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load fundraising data');
    } finally {
      setGoalDirty(false);
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    try {
      setSavingGoal(true);
      await fundraisingAPI.updateGoal(annualGoal);
      setGoalDirty(false);
      toast.success('Annual goal updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to save goal');
    } finally {
      setSavingGoal(false);
    }
  };

  const handleCreateOpportunity = async () => {
    if (!newOpportunity.name || !newOpportunity.funderName) {
      toast.error('Please fill in grant name and funder');
      return;
    }

    try {
      setCreatingOpportunity(true);
      const { data } = await fundraisingAPI.createOpportunity(newOpportunity);
      setOpportunities(prev => [data.opportunity, ...prev]);
      setSummary(data.summary);
      setShowAddModal(false);
      setNewOpportunity(EMPTY_FORM);
      toast.success('Grant added to pipeline');
    } catch (error) {
      console.error(error);
      toast.error('Unable to create grant');
    } finally {
      setCreatingOpportunity(false);
    }
  };

  const handleStageChange = async (opportunity, nextStage) => {
    try {
      const updates = { stage: nextStage };
      const { data } = await fundraisingAPI.updateOpportunity(opportunity.id, updates);
      setOpportunities(prev => prev.map(op => op.id === opportunity.id ? data.opportunity : op));
      setSummary(data.summary);
      toast.success(`Moved to ${PIPELINE_STAGES.find(s => s.id === nextStage)?.name}`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update stage');
    }
  };

  const viewGrantDetails = (grant) => {
    setSelectedGrant(grant);
    setShowDetailModal(true);
  };

  // Filtered and searched opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(op => {
      const matchesStage = selectedStageFilter === 'all' || op.stage === selectedStageFilter;
      const matchesSearch = !searchTerm || 
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.funderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.purpose && op.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStage && matchesSearch;
    });
  }, [opportunities, selectedStageFilter, searchTerm]);

  // Organize by stage for Kanban view
  const opportunitiesByStage = useMemo(() => {
    const result = {};
    PIPELINE_STAGES.forEach(stage => {
      result[stage.id] = filteredOpportunities.filter(op => op.stage === stage.id);
    });
    return result;
  }, [filteredOpportunities]);

  // Calculate upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const deadlines = [];
    opportunities.forEach(op => {
      if (op.loiDueDate) {
        deadlines.push({ grant: op, type: 'LOI', date: op.loiDueDate, label: 'LOI Due' });
      }
      if (op.proposalDueDate) {
        deadlines.push({ grant: op, type: 'Proposal', date: op.proposalDueDate, label: 'Proposal Due' });
      }
      if (op.reportDueDate && op.stage === 'awarded') {
        deadlines.push({ grant: op, type: 'Report', date: op.reportDueDate, label: 'Report Due' });
      }
    });
    return deadlines
      .filter(d => parseDate(d.date))
      .sort((a, b) => parseDate(a.date) - parseDate(b.date))
      .slice(0, 10); // Top 10 upcoming
  }, [opportunities]);

  // Non-profit check
  if (entityType !== '501c3') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-2">Fundraising workspace is for 501(c)(3) schools</h2>
              <p className="text-sm text-yellow-800 mb-4">
                Grant management, foundation tracking, and donor relationships unlock automatically when your entity type is set to nonprofit.
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

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fundraising & Grants</h1>
              <p className="text-gray-600">Grant pipeline, foundation relationships, and compliance tracking</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add Grant
          </button>
        </div>
      </div>

      {/* Annual Goal & Key Metrics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Annual Goal - Editable */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-primary-100" />
            <span className="text-sm text-primary-100">Annual Goal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-primary-100">$</span>
            <input
              type="number"
              value={annualGoal}
              onChange={(e) => {
                setAnnualGoal(Number(e.target.value));
                setGoalDirty(true);
              }}
              className="bg-transparent text-3xl font-bold text-white border-none focus:outline-none focus:ring-0 w-full"
              placeholder="0"
            />
          </div>
          {goalDirty && (
            <button
              onClick={handleSaveGoal}
              disabled={savingGoal}
              className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold"
            >
              {savingGoal ? 'Saving...' : 'Save Goal'}
            </button>
          )}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min((summary.totalAwarded / annualGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-primary-100">
            {formatCurrency(summary.totalAwarded)} secured ({annualGoal > 0 ? Math.round((summary.totalAwarded / annualGoal) * 100) : 0}%)
          </div>
        </div>

        {/* Secured (Awarded) */}
        <MetricCard
          icon={TrophyIcon}
          label="Awarded YTD"
          value={formatCurrency(summary.totalAwarded)}
          subtitle={`${opportunities.filter(o => o.stage === 'awarded').length} grants`}
          color="green"
        />

        {/* Weighted Forecast */}
        <MetricCard
          icon={ChartBarIcon}
          label="Forecast"
          value={formatCurrency(summary.weightedForecast)}
          subtitle="Weighted pipeline"
          color="blue"
        />

        {/* In Pipeline */}
        <MetricCard
          icon={ClockIcon}
          label="In Pipeline"
          value={formatCurrency(summary.pipelineTotal)}
          subtitle={`${opportunities.filter(o => !['awarded', 'declined', 'reported'].includes(o.stage)).length} active`}
          color="yellow"
        />

        {/* Win Rate */}
        <MetricCard
          icon={CheckCircleIcon}
          label="Win Rate"
          value={`${summary.winRate || 0}%`}
          subtitle={`Avg grant: ${formatCurrency(summary.averageGrantSize)}`}
          color="purple"
        />
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <ViewTab active={view === 'pipeline'} onClick={() => setView('pipeline')} label="Pipeline View" />
          <ViewTab active={view === 'grants'} onClick={() => setView('grants')} label="All Grants" />
          <ViewTab active={view === 'deadlines'} onClick={() => setView('deadlines')} label="Deadlines" badge={upcomingDeadlines.length} />
          <ViewTab active={view === 'reports'} onClick={() => setView('reports')} label="Analytics" />
        </nav>
      </div>

      {/* Pipeline Kanban View */}
      {view === 'pipeline' && (
        <PipelineKanbanView
          opportunitiesByStage={opportunitiesByStage}
          onStageChange={handleStageChange}
          onViewDetails={viewGrantDetails}
        />
      )}

      {/* All Grants Table View */}
      {view === 'grants' && (
        <GrantsTableView
          opportunities={filteredOpportunities}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStageFilter={selectedStageFilter}
          setSelectedStageFilter={setSelectedStageFilter}
          onViewDetails={viewGrantDetails}
        />
      )}

      {/* Deadlines View */}
      {view === 'deadlines' && (
        <DeadlinesView upcomingDeadlines={upcomingDeadlines} onViewDetails={viewGrantDetails} />
      )}

      {/* Analytics View */}
      {view === 'reports' && (
        <AnalyticsView opportunities={opportunities} summary={summary} annualGoal={annualGoal} />
      )}

      {/* Add Grant Modal */}
      {showAddModal && (
        <AddGrantModal
          newOpportunity={newOpportunity}
          setNewOpportunity={setNewOpportunity}
          onClose={() => {
            setShowAddModal(false);
            setNewOpportunity(EMPTY_FORM);
          }}
          onCreate={handleCreateOpportunity}
          creating={creatingOpportunity}
        />
      )}

      {/* Grant Detail Modal */}
      {showDetailModal && selectedGrant && (
        <GrantDetailModal
          grant={selectedGrant}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedGrant(null);
          }}
          onStageChange={handleStageChange}
        />
      )}
    </div>
  );
};

// View Tab Component
const ViewTab = ({ active, onClick, label, badge }) => (
  <button
    onClick={onClick}
    className={`touch-target py-4 px-1 border-b-2 font-medium text-sm ${
      active
        ? 'border-primary-500 text-primary-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
    {badge !== undefined && badge > 0 && (
      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">
        {badge}
      </span>
    )}
  </button>
);

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, subtitle, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  const iconColorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  );
};

// Pipeline Kanban View Component
const PipelineKanbanView = ({ opportunitiesByStage, onStageChange, onViewDetails }) => (
  <div className="overflow-x-auto pb-4">
    <div className="inline-flex gap-4 min-w-full">
      {PIPELINE_STAGES.map(stage => {
        const grants = opportunitiesByStage[stage.id] || [];
        const total = grants.reduce((sum, g) => sum + (Number(g.askAmount) || 0), 0);
        const StageIcon = stage.icon;

        return (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className={`bg-${stage.color}-50 border-2 border-${stage.color}-200 rounded-t-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StageIcon className={`h-5 w-5 text-${stage.color}-600`} />
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                </div>
                <span className="text-sm font-bold text-gray-600">{grants.length}</span>
              </div>
              <div className="text-xs text-gray-600">{stage.description}</div>
              <div className="text-xs font-semibold text-gray-900 mt-2">
                Total: {formatCurrency(total)}
              </div>
            </div>

            <div className="bg-gray-50 border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-xl p-3 space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto">
              {grants.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No grants in this stage
                </div>
              ) : (
                grants.map(grant => (
                  <GrantCard
                    key={grant.id}
                    grant={grant}
                    stage={stage}
                    onViewDetails={onViewDetails}
                    onStageChange={onStageChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Grant Card Component (for Kanban)
const GrantCard = ({ grant, stage, onViewDetails, onStageChange }) => {
  const deadline = grant.proposalDueDate || grant.loiDueDate;
  const daysLeft = deadline ? daysUntil(deadline) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(grant)}
    >
      <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{grant.name}</div>
      <div className="text-xs text-gray-600 mb-2">{grant.funderName}</div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-primary-600">
          {formatCurrency(grant.askAmount || grant.amountAwarded)}
        </span>
        {grant.awardType && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
            grant.awardType === 'unrestricted'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {grant.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'}
          </span>
        )}
      </div>

      {deadline && (
        <div className={`flex items-center gap-1 text-xs ${
          isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'
        }`}>
          <ClockIcon className="h-3 w-3" />
          {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days` : 'Overdue'}
        </div>
      )}

      {grant.priority === 'high' && (
        <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
          <ExclamationTriangleIcon className="h-3 w-3" />
          High Priority
        </div>
      )}
    </div>
  );
};

// Grants Table View Component
const GrantsTableView = ({ opportunities, searchTerm, setSearchTerm, selectedStageFilter, setSelectedStageFilter, onViewDetails }) => (
  <div>
    {/* Filters */}
    <div className="mb-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search grants, funders, or purpose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="touch-target w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <select
        value={selectedStageFilter}
        onChange={(e) => setSelectedStageFilter(e.target.value)}
        className="touch-target px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Stages</option>
        {PIPELINE_STAGES.map(stage => (
          <option key={stage.id} value={stage.id}>{stage.name}</option>
        ))}
      </select>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg shadow">
      <div className="table-scroll">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ask Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Awarded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {opportunities.map(grant => {
              const deadline = grant.proposalDueDate || grant.loiDueDate;
              const daysLeft = deadline ? daysUntil(deadline) : null;
              const stage = PIPELINE_STAGES.find(s => s.id === grant.stage);

              return (
                <tr key={grant.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewDetails(grant)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{grant.name}</div>
                    <div className="text-xs text-gray-500">{grant.purpose}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{grant.funderName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(grant.askAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {grant.amountAwarded ? formatCurrency(grant.amountAwarded) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${stage?.color}-100 text-${stage?.color}-800`}>
                      {stage?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {deadline ? (
                      <div className={daysLeft !== null && daysLeft <= 7 && daysLeft >= 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days` : 'Overdue'}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="touch-target text-primary-600 hover:text-primary-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {opportunities.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        No grants match your filters. Try adjusting your search or adding a new grant.
      </div>
    )}
  </div>
);

// Deadlines View Component
const DeadlinesView = ({ upcomingDeadlines, onViewDetails }) => (
  <div className="space-y-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <ClockIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900">Upcoming Deadlines</h3>
          <p className="text-sm text-yellow-800">Stay on top of LOI, proposal, and report due dates.</p>
        </div>
      </div>
    </div>

    {upcomingDeadlines.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">No upcoming deadlines. You're all caught up!</p>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingDeadlines.map((deadline, idx) => {
                const daysLeft = daysUntil(deadline.date);
                const isUrgent = daysLeft <= 7 && daysLeft >= 0;
                const isOverdue = daysLeft < 0;

                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{deadline.grant.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{deadline.grant.funderName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        {deadline.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(deadline.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${
                        isOverdue ? 'text-red-600' :
                        isUrgent ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {isOverdue ? 'Overdue!' : daysLeft <= 0 ? 'Today!' : `${daysLeft} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetails(deadline.grant)}
                        className="touch-target text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        View Grant
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

// Analytics View Component
const AnalyticsView = ({ opportunities, summary, annualGoal }) => {
  const byType = {};
  const byAwardType = { restricted: 0, unrestricted: 0 };
  const byStage = {};

  opportunities.forEach(op => {
    // By Grant Type
    if (!byType[op.grantType]) byType[op.grantType] = { count: 0, total: 0 };
    byType[op.grantType].count++;
    byType[op.grantType].total += Number(op.askAmount || 0);

    // By Award Type
    if (op.stage === 'awarded' && op.amountAwarded) {
      if (op.awardType === 'restricted') {
        byAwardType.restricted += Number(op.amountAwarded);
      } else {
        byAwardType.unrestricted += Number(op.amountAwarded);
      }
    }

    // By Stage
    if (!byStage[op.stage]) byStage[op.stage] = 0;
    byStage[op.stage]++;
  });

  return (
    <div className="space-y-6">
      {/* Goal Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Goal Progress</h3>
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
            style={{ width: `${Math.min((summary.totalAwarded / annualGoal) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{formatCurrency(summary.totalAwarded)} secured</span>
          <span className="text-gray-600">{formatCurrency(annualGoal)} goal</span>
        </div>
      </div>

      {/* Restricted vs. Unrestricted */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Restricted</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(byAwardType.restricted)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 mb-1">Unrestricted</div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(byAwardType.unrestricted)}</div>
          </div>
        </div>
      </div>

      {/* By Grant Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">By Grant Type</h3>
        <div className="space-y-3">
          {Object.entries(byType).map(([type, data]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 capitalize">{type.replace('_', ' ')}</div>
                <div className="text-xs text-gray-500">{data.count} grant{data.count !== 1 ? 's' : ''}</div>
              </div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(data.total)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* By Stage */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Distribution</h3>
        <div className="space-y-2">
          {PIPELINE_STAGES.map(stage => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="w-32 text-sm text-gray-700">{stage.name}</div>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stage.color}-500 transition-all`}
                  style={{ width: `${(byStage[stage.id] || 0) / Math.max(opportunities.length, 1) * 100}%` }}
                />
              </div>
              <div className="w-8 text-sm font-semibold text-gray-900">{byStage[stage.id] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add Grant Modal Component
const AddGrantModal = ({ newOpportunity, setNewOpportunity, onClose, onCreate, creating }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Grant</h2>
        <button onClick={onClose} className="touch-target p-2 hover:bg-gray-100 rounded-lg">
          <XMarkIcon className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Grant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grant Name *</label>
          <input
            type="text"
            value={newOpportunity.name}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, name: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Knight Foundation STEM Grant"
          />
        </div>

        {/* Funder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funder Name *</label>
          <input
            type="text"
            value={newOpportunity.funderName}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, funderName: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Knight Foundation"
          />
        </div>

        {/* Grant Type & Award Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grant Type</label>
            <select
              value={newOpportunity.grantType}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, grantType: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {GRANT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Award Type</label>
            <select
              value={newOpportunity.awardType}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, awardType: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {AWARD_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ask Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ask Amount</label>
          <input
            type="number"
            value={newOpportunity.askAmount}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, askAmount: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="50000"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Use of Funds</label>
          <textarea
            value={newOpportunity.purpose}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, purpose: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="e.g., STEM lab equipment, teacher salaries, facility improvements"
          />
        </div>

        {/* Proposal Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Deadline</label>
          <input
            type="date"
            value={newOpportunity.proposalDueDate}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, proposalDueDate: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input
              type="text"
              value={newOpportunity.contactName}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactName: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Program Officer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={newOpportunity.contactEmail}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="officer@foundation.org"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={newOpportunity.notes}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, notes: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={2}
            placeholder="Additional notes..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="touch-target px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onCreate}
          disabled={creating}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold disabled:opacity-50"
        >
          {creating ? 'Adding...' : 'Add Grant'}
        </button>
      </div>
    </div>
  </div>
);

// Grant Detail Modal Component
const GrantDetailModal = ({ grant, onClose, onStageChange }) => {
  const stage = PIPELINE_STAGES.find(s => s.id === grant.stage);
  const StageIcon = stage?.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{grant.name}</h2>
            <div className="text-sm text-primary-100 mt-1">{grant.funderName}</div>
          </div>
          <button onClick={onClose} className="touch-target p-2 hover:bg-primary-500 rounded-lg">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Stage */}
          <div className={`p-4 rounded-lg border-2 bg-${stage?.color}-50 border-${stage?.color}-200`}>
            <div className="flex items-center gap-2 mb-2">
              {StageIcon && <StageIcon className={`h-5 w-5 text-${stage?.color}-600`} />}
              <span className="font-semibold text-gray-900">Current Stage: {stage?.name}</span>
            </div>
            <div className="text-sm text-gray-700">{stage?.description}</div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Ask Amount" value={formatCurrency(grant.askAmount)} />
            <DetailItem label="Awarded Amount" value={grant.amountAwarded ? formatCurrency(grant.amountAwarded) : '—'} />
            <DetailItem label="Grant Type" value={grant.grantType?.replace('_', ' ')} />
            <DetailItem label="Award Type" value={grant.awardType === 'unrestricted' ? 'Unrestricted (Operating)' : 'Restricted (Specific Use)'} />
          </div>

          {/* Timeline */}
          {(grant.proposalDueDate || grant.loiDueDate || grant.decisionDate) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-2">
                {grant.loiDueDate && <TimelineItem label="LOI Due" date={grant.loiDueDate} />}
                {grant.proposalDueDate && <TimelineItem label="Proposal Due" date={grant.proposalDueDate} />}
                {grant.decisionDate && <TimelineItem label="Decision Date" date={grant.decisionDate} />}
                {grant.reportDueDate && <TimelineItem label="Report Due" date={grant.reportDueDate} />}
              </div>
            </div>
          )}

          {/* Contact */}
          {grant.contactName && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-900">{grant.contactName}</div>
                {grant.contactTitle && <div className="text-sm text-gray-600">{grant.contactTitle}</div>}
                {grant.contactEmail && (
                  <a href={`mailto:${grant.contactEmail}`} className="text-sm text-primary-600 hover:text-primary-800">
                    {grant.contactEmail}
                  </a>
                )}
                {grant.contactPhone && <div className="text-sm text-gray-600">{grant.contactPhone}</div>}
              </div>
            </div>
          )}

          {/* Purpose */}
          {grant.purpose && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Purpose / Use of Funds</h3>
              <p className="text-gray-700">{grant.purpose}</p>
            </div>
          )}

          {/* Notes */}
          {grant.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-4">{grant.notes}</p>
            </div>
          )}

          {/* Stage Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Move to Stage</h3>
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onStageChange(grant, s.id);
                    onClose();
                  }}
                  disabled={s.id === grant.stage}
                  className={`touch-target px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    s.id === grant.stage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : `bg-${s.color}-100 text-${s.color}-700 hover:bg-${s.color}-200`
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="touch-target px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={() => alert('Edit grant - coming soon!')}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Grant
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-medium text-gray-900">{value || '—'}</div>
  </div>
);

const TimelineItem = ({ label, date }) => {
  const daysLeft = daysUntil(date);
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{new Date(date).toLocaleDateString()}</span>
        {daysLeft !== null && (
          <span className={`text-xs font-semibold ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
            ({daysLeft >= 0 ? `${daysLeft} days` : 'overdue'})
          </span>
        )}
      </div>
    </div>
  );
};

export default FundraisingCRM;
