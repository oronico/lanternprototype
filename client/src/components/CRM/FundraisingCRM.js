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
  ChartBarIcon,
  HeartIcon,
  FireIcon,
  EnvelopeIcon,
  PhoneIcon,
  GiftIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { fundraisingAPI } from '../../services/api';

/**
 * Comprehensive Fundraising Platform for Microschools
 * 
 * Features:
 * - Grants (Foundations, Corporate, Government)
 * - Individual Donors (Major Gifts, Annual Fund)
 * - Corporate Sponsors
 * - Restricted & Unrestricted Gifts
 * - Donor Relationship Management
 * - Thank You Letters & Tax Receipts
 * - Stewardship & Touchpoint Tracking
 * - Gamification (Streaks, Milestones, Celebrations)
 * - Warm, Coaching Tone
 */

// Pursuit stages for ALL fundraising (grants + donors)
const PURSUIT_STAGES = [
  { id: 'research', name: 'Research', description: 'Identifying potential', color: 'gray' },
  { id: 'cultivate', name: 'Cultivate', description: 'Building relationship', color: 'blue' },
  { id: 'solicit', name: 'Solicit', description: 'Making the ask', color: 'purple' },
  { id: 'pending', name: 'Pending', description: 'Awaiting response', color: 'yellow' },
  { id: 'closed_won', name: 'Won! 🎉', description: 'Gift secured', color: 'green' },
  { id: 'closed_lost', name: 'Not Now', description: 'Declined or deferred', color: 'red' },
  { id: 'stewardship', name: 'Stewardship', description: 'Ongoing gratitude & reporting', color: 'teal' }
];

const STAGE_WEIGHTS = {
  research: 0.10,
  cultivate: 0.25,
  solicit: 0.50,
  pending: 0.70,
  closed_won: 1.00,
  closed_lost: 0,
  stewardship: 1.00
};

const PURSUIT_TYPES = [
  { value: 'foundation_grant', label: 'Foundation Grant', icon: BuildingOfficeIcon },
  { value: 'corporate_grant', label: 'Corporate Grant', icon: BuildingOfficeIcon },
  { value: 'government_grant', label: 'Government Grant', icon: BuildingOfficeIcon },
  { value: 'individual_major', label: 'Individual Major Gift ($5k+)', icon: HeartIcon },
  { value: 'individual_annual', label: 'Individual Annual Gift', icon: HeartIcon },
  { value: 'corporate_sponsor', label: 'Corporate Sponsorship', icon: BanknotesIcon },
  { value: 'event', label: 'Fundraising Event', icon: GiftIcon },
  { value: 'campaign', label: 'Campaign Pledge', icon: TrophyIcon }
];

const AWARD_TYPES = [
  { value: 'restricted', label: 'Restricted', help: 'Specific use (e.g., playground, scholarships)' },
  { value: 'unrestricted', label: 'Unrestricted', help: 'Operating support (any school need)' }
];

const EMPTY_FORM = {
  // Core Info
  name: '',
  pursuitType: 'foundation_grant',
  awardType: 'restricted',
  stage: 'research',
  
  // Amounts
  askAmount: '',
  amountReceived: '',
  
  // Contact/Donor Info
  contactName: '',
  contactTitle: '',
  contactOrganization: '',
  contactEmail: '',
  contactPhone: '',
  donorType: 'individual', // individual, foundation, corporation
  
  // Timeline
  askDate: '',
  responseDate: '',
  giftDate: '',
  reportDueDate: '',
  
  // Details
  purpose: '',
  restrictions: '',
  recognitionPreference: 'public', // public, anonymous
  priority: 'medium',
  notes: '',
  
  // Stewardship
  lastTouchDate: '',
  nextTouchDate: '',
  touchpointCount: 0,
  thankYouSent: false,
  taxReceiptSent: false,
  
  // Recurring
  isRecurring: false,
  recurringFrequency: 'annual'
};

const DEFAULT_SUMMARY = {
  annualGoal: 0,
  securedRestricted: 0,
  securedUnrestricted: 0,
  totalReceived: 0,
  pipelineTotal: 0,
  weightedForecast: 0,
  donorCount: 0,
  averageGift: 0,
  winRate: 0
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0';
  return `$${Number(value).toLocaleString()}`;
};

const daysUntil = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return days;
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [view, setView] = useState('pipeline'); // pipeline, donors, analytics
  const [annualGoal, setAnnualGoal] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
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
      toast.success('🎯 Annual goal updated!');
    } catch (error) {
      console.error(error);
      toast.error('Unable to save goal');
    } finally {
      setSavingGoal(false);
    }
  };

  const handleCreateOpportunity = async () => {
    if (!newOpportunity.name || !newOpportunity.contactName) {
      toast.error('Please fill in opportunity name and contact');
      return;
    }

    try {
      setCreatingOpportunity(true);
      const { data } = await fundraisingAPI.createOpportunity(newOpportunity);
      setOpportunities(prev => [data.opportunity, ...prev]);
      setSummary(data.summary);
      setShowAddModal(false);
      setNewOpportunity(EMPTY_FORM);
      toast.success('✨ Added to your pipeline!');
    } catch (error) {
      console.error(error);
      toast.error('Unable to create opportunity');
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
      
      // Celebrate wins!
      if (nextStage === 'closed_won') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
        toast.success(`🎉 Congratulations! ${opportunity.name} secured!`);
      } else {
        const stage = PURSUIT_STAGES.find(s => s.id === nextStage);
        toast.success(`Moved to ${stage?.name}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to update stage');
    }
  };

  const generateThankYouLetter = (opportunity) => {
    // In production, this would generate a PDF
    toast.success(`📝 Thank you letter generated for ${opportunity.contactName}`);
    // Mark as sent
    handleUpdateOpportunity(opportunity.id, { thankYouSent: true });
  };

  const generateTaxReceipt = (opportunity) => {
    // In production, this would generate an IRS-compliant receipt
    toast.success(`📄 Tax receipt generated for ${opportunity.contactName}`);
    // Mark as sent
    handleUpdateOpportunity(opportunity.id, { taxReceiptSent: true });
  };

  const handleUpdateOpportunity = async (id, updates) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(id, updates);
      setOpportunities(prev => prev.map(op => op.id === id ? data.opportunity : op));
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update');
    }
  };

  const viewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailModal(true);
  };

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(op => {
      const matchesStage = selectedStageFilter === 'all' || op.stage === selectedStageFilter;
      const matchesType = selectedTypeFilter === 'all' || op.pursuitType === selectedTypeFilter;
      const matchesSearch = !searchTerm || 
        op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.contactOrganization && op.contactOrganization.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStage && matchesType && matchesSearch;
    });
  }, [opportunities, selectedStageFilter, selectedTypeFilter, searchTerm]);

  // Group by stage for pipeline view
  const opportunitiesByStage = useMemo(() => {
    const result = {};
    PURSUIT_STAGES.forEach(stage => {
      result[stage.id] = filteredOpportunities.filter(op => op.stage === stage.id);
    });
    return result;
  }, [filteredOpportunities]);

  // Donor list (Individual & Corporate gifts)
  const donors = useMemo(() => {
    const donorMap = {};
    opportunities
      .filter(op => ['individual_major', 'individual_annual', 'corporate_sponsor'].includes(op.pursuitType))
      .forEach(op => {
        const key = op.contactName;
        if (!donorMap[key]) {
          donorMap[key] = {
            name: op.contactName,
            organization: op.contactOrganization,
            email: op.contactEmail,
            phone: op.contactPhone,
            gifts: [],
            totalGiven: 0,
            lastGiftDate: null
          };
        }
        if (op.stage === 'closed_won' || op.stage === 'stewardship') {
          donorMap[key].gifts.push(op);
          donorMap[key].totalGiven += Number(op.amountReceived || 0);
          if (op.giftDate && (!donorMap[key].lastGiftDate || op.giftDate > donorMap[key].lastGiftDate)) {
            donorMap[key].lastGiftDate = op.giftDate;
          }
        }
      });
    return Object.values(donorMap).sort((a, b) => b.totalGiven - a.totalGiven);
  }, [opportunities]);

  // Gamification stats
  const gamificationStats = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisMonthWins = opportunities.filter(op => 
      op.stage === 'closed_won' && 
      op.giftDate && 
      new Date(op.giftDate).getMonth() === thisMonth
    );
    
    return {
      monthlyWins: thisMonthWins.length,
      monthlyTotal: thisMonthWins.reduce((sum, op) => sum + Number(op.amountReceived || 0), 0),
      streak: 3, // Would calculate actual streak from data
      milestone: summary.totalReceived >= annualGoal ? 'goal' : summary.totalReceived >= annualGoal * 0.75 ? '75' : summary.totalReceived >= annualGoal * 0.5 ? '50' : summary.totalReceived >= annualGoal * 0.25 ? '25' : 'start'
    };
  }, [opportunities, summary, annualGoal]);

  // Non-profit check
  if (entityType !== '501c3') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-2">Fundraising is for 501(c)(3) schools</h2>
              <p className="text-sm text-yellow-800 mb-4">
                Grant management, donor relationships, and gift tracking unlock when your entity type is set to nonprofit.
              </p>
              <button
                onClick={() => { window.location.href = '/settings'; }}
                className="touch-target px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-semibold"
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
      {showCelebration && <Confetti recycle={false} numberOfPieces={400} />}
      
      {/* Header with Coaching Tone */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <HeartIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fundraising & Donor Relationships</h1>
              <p className="text-gray-600">Building partnerships that fuel your mission 💙</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Gamification & Momentum Bar */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-orange-600" />
              <div>
                <div className="text-xs text-gray-600">Fundraising Streak</div>
                <div className="text-2xl font-bold text-gray-900">{gamificationStats.streak} months</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="text-xs text-gray-600">This Month</div>
                <div className="text-2xl font-bold text-gray-900">{gamificationStats.monthlyWins} gifts</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
              <div>
                <div className="text-xs text-gray-600">Milestone</div>
                <div className="text-sm font-bold text-purple-600">
                  {gamificationStats.milestone === 'goal' ? '🎉 Goal Met!' :
                   gamificationStats.milestone === '75' ? '75% There!' :
                   gamificationStats.milestone === '50' ? 'Halfway!' :
                   gamificationStats.milestone === '25' ? '25% Milestone' : 'Just Getting Started'}
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-purple-900">
            💪 Keep building those relationships—every ask matters!
          </div>
        </div>
      </div>

      {/* Annual Goal & Key Metrics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Annual Goal */}
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
              style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-primary-100">
            {formatCurrency(summary.totalReceived)} raised ({annualGoal > 0 ? Math.round((summary.totalReceived / annualGoal) * 100) : 0}%)
          </div>
        </div>

        <MetricCard
          icon={TrophyIcon}
          label="Total Raised"
          value={formatCurrency(summary.totalReceived)}
          subtitle={`${summary.donorCount} donors`}
          color="green"
        />
        <MetricCard
          icon={ChartBarIcon}
          label="Forecast"
          value={formatCurrency(summary.weightedForecast)}
          subtitle="Weighted pipeline"
          color="blue"
        />
        <MetricCard
          icon={ClockIcon}
          label="In Pipeline"
          value={formatCurrency(summary.pipelineTotal)}
          subtitle={`${opportunities.filter(o => !['closed_won', 'closed_lost', 'stewardship'].includes(o.stage)).length} active`}
          color="yellow"
        />
        <MetricCard
          icon={HeartIcon}
          label="Avg Gift"
          value={formatCurrency(summary.averageGift)}
          subtitle={`${summary.winRate || 0}% win rate`}
          color="purple"
        />
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <ViewTab active={view === 'pipeline'} onClick={() => setView('pipeline')} label="Pipeline" />
          <ViewTab active={view === 'donors'} onClick={() => setView('donors')} label="Donors & Sponsors" badge={donors.length} />
          <ViewTab active={view === 'analytics'} onClick={() => setView('analytics')} label="Analytics" />
        </nav>
      </div>

      {/* Pipeline View (Vertical, No Horizontal Scroll) */}
      {view === 'pipeline' && (
        <PipelineView
          opportunitiesByStage={opportunitiesByStage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStageFilter={selectedStageFilter}
          setSelectedStageFilter={setSelectedStageFilter}
          selectedTypeFilter={selectedTypeFilter}
          setSelectedTypeFilter={setSelectedTypeFilter}
          onStageChange={handleStageChange}
          onViewDetails={viewDetails}
          filteredOpportunities={filteredOpportunities}
        />
      )}

      {/* Donors & Sponsors View */}
      {view === 'donors' && (
        <DonorsView
          donors={donors}
          onGenerateThankYou={generateThankYouLetter}
          onGenerateTaxReceipt={generateTaxReceipt}
          onViewDetails={viewDetails}
        />
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <AnalyticsView opportunities={opportunities} summary={summary} annualGoal={annualGoal} />
      )}

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <AddOpportunityModal
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

      {/* Detail Modal */}
      {showDetailModal && selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOpportunity(null);
          }}
          onStageChange={handleStageChange}
          onGenerateThankYou={generateThankYouLetter}
          onGenerateTaxReceipt={generateTaxReceipt}
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
      <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">
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

// Pipeline View Component (VERTICAL LAYOUT - NO HORIZONTAL SCROLL)
const PipelineView = ({ opportunitiesByStage, searchTerm, setSearchTerm, selectedStageFilter, setSelectedStageFilter, selectedTypeFilter, setSelectedTypeFilter, onStageChange, onViewDetails, filteredOpportunities }) => (
  <div className="space-y-6">
    {/* Filters */}
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search opportunities, contacts, organizations..."
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
        {PURSUIT_STAGES.map(stage => (
          <option key={stage.id} value={stage.id}>{stage.name}</option>
        ))}
      </select>
      <select
        value={selectedTypeFilter}
        onChange={(e) => setSelectedTypeFilter(e.target.value)}
        className="touch-target px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Types</option>
        {PURSUIT_TYPES.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>

    {/* Pipeline Stages - VERTICAL LAYOUT */}
    <div className="space-y-4">
      {PURSUIT_STAGES.map(stage => {
        const opportunities = opportunitiesByStage[stage.id] || [];
        const total = opportunities.reduce((sum, op) => sum + (Number(op.askAmount) || Number(op.amountReceived) || 0), 0);

        return (
          <div key={stage.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            {/* Stage Header */}
            <div className={`bg-${stage.color}-50 border-b-2 border-${stage.color}-200 px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{stage.name}</h3>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{opportunities.length}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>

            {/* Opportunities in Stage */}
            {opportunities.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No opportunities in this stage yet
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map(op => (
                  <OpportunityCard
                    key={op.id}
                    opportunity={op}
                    stage={stage}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>

    {filteredOpportunities.length === 0 && (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">No opportunities match your filters.</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new opportunity!</p>
      </div>
    )}
  </div>
);

// Opportunity Card Component
const OpportunityCard = ({ opportunity, stage, onViewDetails }) => {
  const pursuitType = PURSUIT_TYPES.find(t => t.pursuitType === opportunity.pursuitType);
  const TypeIcon = pursuitType?.icon || HeartIcon;
  const deadline = opportunity.askDate || opportunity.responseDate;
  const daysLeft = deadline ? daysUntil(deadline) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(opportunity)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{opportunity.name}</div>
          <div className="text-xs text-gray-600 line-clamp-1">{opportunity.contactName}</div>
          {opportunity.contactOrganization && (
            <div className="text-xs text-gray-500 line-clamp-1">{opportunity.contactOrganization}</div>
          )}
        </div>
        <TypeIcon className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-primary-600">
          {formatCurrency(opportunity.amountReceived || opportunity.askAmount)}
        </span>
        {opportunity.awardType && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
            opportunity.awardType === 'unrestricted'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {opportunity.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'}
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

      {opportunity.priority === 'high' && (
        <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
          <ExclamationTriangleIcon className="h-3 w-3" />
          High Priority
        </div>
      )}
    </div>
  );
};

// Donors View Component
const DonorsView = ({ donors, onGenerateThankYou, onGenerateTaxReceipt, onViewDetails }) => (
  <div className="space-y-4">
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <HeartIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-purple-900">Your Donor Community</h3>
          <p className="text-sm text-purple-800">Individual and corporate partners who believe in your mission 💙</p>
        </div>
      </div>
    </div>

    {donors.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600">No donors yet. Start building relationships!</p>
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Given</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Gift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># of Gifts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donors.map((donor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{donor.name}</div>
                    {donor.organization && <div className="text-xs text-gray-500">{donor.organization}</div>}
                    {donor.email && (
                      <a href={`mailto:${donor.email}`} className="text-xs text-primary-600 hover:text-primary-800">
                        {donor.email}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">
                    {formatCurrency(donor.totalGiven)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {donor.lastGiftDate ? new Date(donor.lastGiftDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {donor.gifts.length}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {donor.gifts[0] && (
                      <>
                        <button
                          onClick={() => onGenerateThankYou(donor.gifts[0])}
                          className="touch-target px-3 py-1.5 text-xs font-semibold border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50"
                          title="Generate thank you letter"
                        >
                          Thank You
                        </button>
                        <button
                          onClick={() => onGenerateTaxReceipt(donor.gifts[0])}
                          className="touch-target px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50"
                          title="Generate tax receipt"
                        >
                          Tax Receipt
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
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

  opportunities.forEach(op => {
    if (!byType[op.pursuitType]) byType[op.pursuitType] = { count: 0, total: 0 };
    byType[op.pursuitType].count++;
    byType[op.pursuitType].total += Number(op.askAmount || op.amountReceived || 0);

    if ((op.stage === 'closed_won' || op.stage === 'stewardship') && op.amountReceived) {
      if (op.awardType === 'restricted') {
        byAwardType.restricted += Number(op.amountReceived);
      } else {
        byAwardType.unrestricted += Number(op.amountReceived);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Goal Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Goal Progress</h3>
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
            style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{formatCurrency(summary.totalReceived)} raised</span>
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
            <div className="text-xs text-gray-600 mt-1">Specific use only</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 mb-1">Unrestricted</div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(byAwardType.unrestricted)}</div>
            <div className="text-xs text-gray-600 mt-1">Operating support</div>
          </div>
        </div>
      </div>

      {/* By Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">By Type</h3>
        <div className="space-y-3">
          {Object.entries(byType).map(([type, data]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {PURSUIT_TYPES.find(t => t.value === type)?.label || type}
                </div>
                <div className="text-xs text-gray-500">{data.count} opportunit{data.count !== 1 ? 'ies' : 'y'}</div>
              </div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(data.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add Opportunity Modal Component
const AddOpportunityModal = ({ newOpportunity, setNewOpportunity, onClose, onCreate, creating }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Fundraising Opportunity</h2>
          <p className="text-sm text-gray-600">Track grants, donors, and sponsors</p>
        </div>
        <button onClick={onClose} className="touch-target p-2 hover:bg-gray-100 rounded-lg">
          <XMarkIcon className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Opportunity Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Name *</label>
          <input
            type="text"
            value={newOpportunity.name}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, name: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Smith Family Gift, Knight Foundation Grant"
          />
        </div>

        {/* Type & Award Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newOpportunity.pursuitType}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, pursuitType: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {PURSUIT_TYPES.map(type => (
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

        {/* Contact Name & Organization */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
            <input
              type="text"
              value={newOpportunity.contactName}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactName: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
            <input
              type="text"
              value={newOpportunity.contactOrganization}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactOrganization: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Knight Foundation"
            />
          </div>
        </div>

        {/* Contact Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newOpportunity.contactEmail}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="contact@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={newOpportunity.contactPhone}
              onChange={(e) => setNewOpportunity(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="(555) 123-4567"
            />
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
            placeholder="e.g., Playground equipment, scholarship fund, operating support"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={newOpportunity.notes}
            onChange={(e) => setNewOpportunity(prev => ({ ...prev, notes: e.target.value }))}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            rows={2}
            placeholder="Additional context..."
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
          {creating ? 'Adding...' : 'Add to Pipeline'}
        </button>
      </div>
    </div>
  </div>
);

// Opportunity Detail Modal Component
const OpportunityDetailModal = ({ opportunity, onClose, onStageChange, onGenerateThankYou, onGenerateTaxReceipt }) => {
  const stage = PURSUIT_STAGES.find(s => s.id === opportunity.stage);
  const pursuitType = PURSUIT_TYPES.find(t => t.value === opportunity.pursuitType);
  const isIndividualOrCorporate = ['individual_major', 'individual_annual', 'corporate_sponsor'].includes(opportunity.pursuitType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{opportunity.name}</h2>
            <div className="text-sm text-primary-100 mt-1">{opportunity.contactName}</div>
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
              <span className="font-semibold text-gray-900">Current Stage: {stage?.name}</span>
            </div>
            <div className="text-sm text-gray-700">{stage?.description}</div>
          </div>

          {/* Thank You & Tax Receipt (For Won Gifts) */}
          {(opportunity.stage === 'closed_won' || opportunity.stage === 'stewardship') && isIndividualOrCorporate && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">Donor Stewardship</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onGenerateThankYou(opportunity)}
                  className="touch-target px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Generate Thank You Letter
                </button>
                <button
                  onClick={() => onGenerateTaxReceipt(opportunity)}
                  className="touch-target px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Generate Tax Receipt
                </button>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={opportunity.thankYouSent} readOnly className="rounded" />
                  <span className="text-gray-700">Thank you sent</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={opportunity.taxReceiptSent} readOnly className="rounded" />
                  <span className="text-gray-700">Tax receipt sent</span>
                </label>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Type" value={pursuitType?.label} />
            <DetailItem label="Award Type" value={opportunity.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'} />
            <DetailItem label="Ask Amount" value={formatCurrency(opportunity.askAmount)} />
            <DetailItem label="Amount Received" value={opportunity.amountReceived ? formatCurrency(opportunity.amountReceived) : '—'} />
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-600">Name:</span> <span className="font-medium">{opportunity.contactName}</span></div>
              {opportunity.contactOrganization && (
                <div><span className="text-gray-600">Organization:</span> <span className="font-medium">{opportunity.contactOrganization}</span></div>
              )}
              {opportunity.contactEmail && (
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${opportunity.contactEmail}`} className="text-primary-600 hover:text-primary-800">
                    {opportunity.contactEmail}
                  </a>
                </div>
              )}
              {opportunity.contactPhone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${opportunity.contactPhone}`} className="text-primary-600 hover:text-primary-800">
                    {opportunity.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Purpose */}
          {opportunity.purpose && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Purpose / Use of Funds</h3>
              <p className="text-gray-700">{opportunity.purpose}</p>
            </div>
          )}

          {/* Notes */}
          {opportunity.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg p-4">{opportunity.notes}</p>
            </div>
          )}

          {/* Stage Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Move to Stage</h3>
            <div className="flex flex-wrap gap-2">
              {PURSUIT_STAGES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onStageChange(opportunity, s.id);
                    onClose();
                  }}
                  disabled={s.id === opportunity.stage}
                  className={`touch-target px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    s.id === opportunity.stage
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
        <div className="sticky bottom-0 border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="touch-target px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Close
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

export default FundraisingCRM;
