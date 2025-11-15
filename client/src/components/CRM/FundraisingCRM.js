import React, { useEffect, useMemo, useState } from 'react';
import {
  HeartIcon,
  TrophyIcon,
  PlusIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BanknotesIcon,
  ClockIcon,
  FireIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
  GiftIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { fundraisingAPI } from '../../services/api';

/**
 * Comprehensive Fundraising Platform
 * Best-in-class features from DonorPerfect, Bloomerang, Submittable, Fluxx
 * 
 * 4 Main Modules:
 * 1. Grants (Foundation, Corporate, Government)
 * 2. Individual Donors (Major Gifts, Annual Fund)
 * 3. Corporate Sponsors
 * 4. Events & Campaigns
 */

// Grant-specific stages
const GRANT_STAGES = [
  { id: 'research', name: 'Research', desc: 'Eligibility & alignment', color: 'gray' },
  { id: 'loi', name: 'LOI', desc: 'Letter of Intent', color: 'blue' },
  { id: 'invited', name: 'Invited', desc: 'Full proposal invited', color: 'indigo' },
  { id: 'drafting', name: 'Drafting', desc: 'Writing application', color: 'purple' },
  { id: 'submitted', name: 'Submitted', desc: 'Under review', color: 'yellow' },
  { id: 'awarded', name: 'Awarded', desc: 'Grant won!', color: 'green' },
  { id: 'declined', name: 'Declined', desc: 'Not funded', color: 'red' },
  { id: 'reporting', name: 'Reporting', desc: 'Compliance', color: 'teal' }
];

// Donor cultivation stages
const DONOR_STAGES = [
  { id: 'prospect', name: 'Prospect', desc: 'Potential donor', color: 'gray' },
  { id: 'cultivate', name: 'Cultivate', desc: 'Building relationship', color: 'blue' },
  { id: 'ask', name: 'Ask Made', desc: 'Solicitation sent', color: 'purple' },
  { id: 'committed', name: 'Committed', desc: 'Pledge secured', color: 'green' },
  { id: 'stewarded', name: 'Stewarded', desc: 'Ongoing engagement', color: 'teal' },
  { id: 'lapsed', name: 'Lapsed', desc: 'Not giving currently', color: 'red' }
];

const PURSUIT_TYPES = [
  { value: 'foundation_grant', label: 'Foundation Grant', icon: BuildingOfficeIcon, category: 'grant' },
  { value: 'corporate_grant', label: 'Corporate Grant', icon: BuildingOfficeIcon, category: 'grant' },
  { value: 'government_grant', label: 'Government Grant', icon: BuildingOfficeIcon, category: 'grant' },
  { value: 'individual_major', label: 'Individual Major Gift ($5k+)', icon: HeartIcon, category: 'donor' },
  { value: 'individual_annual', label: 'Individual Annual Gift', icon: HeartIcon, category: 'donor' },
  { value: 'corporate_sponsor', label: 'Corporate Sponsorship', icon: BanknotesIcon, category: 'corporate' },
  { value: 'event', label: 'Fundraising Event', icon: GiftIcon, category: 'event' }
];

const AWARD_TYPES = [
  { value: 'restricted', label: 'Restricted', help: 'Specific use only' },
  { value: 'unrestricted', label: 'Unrestricted', help: 'Operating support' }
];

const EMPTY_OPPORTUNITY = {
  name: '',
  pursuitType: 'foundation_grant',
  awardType: 'restricted',
  stage: 'research',
  askAmount: '',
  amountReceived: '',
  
  // Grant fields
  funderName: '',
  funderWebsite: '',
  programOfficer: '',
  loiDueDate: '',
  proposalDueDate: '',
  decisionDate: '',
  reportDueDate: '',
  eligibilityNotes: '',
  
  // Donor fields
  contactName: '',
  contactTitle: '',
  contactOrganization: '',
  contactEmail: '',
  contactPhone: '',
  mailingAddress: '',
  recognitionName: '',
  recognitionPreference: 'public',
  
  // Shared
  purpose: '',
  restrictions: '',
  priority: 'medium',
  notes: '',
  nextAction: '',
  leadStaffMember: '',
  
  // Stewardship
  lastTouchDate: '',
  nextTouchDate: '',
  thankYouSent: false,
  taxReceiptSent: false,
  
  // Recurring
  isRecurring: false,
  recurringFrequency: 'annual'
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [view, setView] = useState('overview'); // overview, grants, donors, corporate, events, analytics
  const [annualGoal, setAnnualGoal] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState({
    annualGoal: 0,
    totalReceived: 0,
    restrictedReceived: 0,
    unrestrictedReceived: 0,
    pipelineTotal: 0,
    donorCount: 0,
    grantCount: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [newOpportunity, setNewOpportunity] = useState(EMPTY_OPPORTUNITY);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goalDirty, setGoalDirty] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('entityType') || 'llc-single';
      setEntityType(stored);
    }
  }, []);

  useEffect(() => {
    if (entityType === '501c3') {
      loadData();
    } else {
      setLoading(false);
    }
  }, [entityType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await fundraisingAPI.getOpportunities();
      setAnnualGoal(data.annualGoal ?? 0);
      setOpportunities(data.opportunities || []);
      setSummary(data.summary || summary);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    try {
      await fundraisingAPI.updateGoal(annualGoal);
      setGoalDirty(false);
      toast.success('🎯 Goal updated!');
    } catch (error) {
      toast.error('Unable to save');
    }
  };

  const handleCreate = async () => {
    if (!newOpportunity.name) {
      toast.error('Please enter a name');
      return;
    }

    try {
      const { data } = await fundraisingAPI.createOpportunity(newOpportunity);
      setOpportunities(prev => [data.opportunity, ...prev]);
      setSummary(data.summary);
      setShowAddModal(false);
      setNewOpportunity(EMPTY_OPPORTUNITY);
      toast.success('✨ Added to pipeline!');
    } catch (error) {
      toast.error('Unable to create');
    }
  };

  const handleStageChange = async (opp, nextStage) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(opp.id, { stage: nextStage });
      setOpportunities(prev => prev.map(o => o.id === opp.id ? data.opportunity : o));
      setSummary(data.summary);
      
      if (nextStage === 'awarded' || nextStage === 'committed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
        toast.success(`🎉 ${opp.name} secured!`);
      }
    } catch (error) {
      toast.error('Unable to update');
    }
  };

  const viewDetails = (opp) => {
    setSelectedOpportunity(opp);
    setShowDetailModal(true);
  };

  const generateThankYou = (opp) => {
    toast.success(`📝 Thank you letter for ${opp.contactName || opp.funderName}`);
    handleUpdate(opp.id, { thankYouSent: true });
  };

  const generateTaxReceipt = (opp) => {
    toast.success(`📄 Tax receipt for ${opp.contactName || opp.funderName}`);
    handleUpdate(opp.id, { taxReceiptSent: true });
  };

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(id, updates);
      setOpportunities(prev => prev.map(o => o.id === id ? data.opportunity : o));
    } catch (error) {
      console.error(error);
    }
  };

  // Segment by type
  const grants = opportunities.filter(o => ['foundation_grant', 'corporate_grant', 'government_grant'].includes(o.pursuitType));
  const individualDonors = opportunities.filter(o => ['individual_major', 'individual_annual'].includes(o.pursuitType));
  const corporateSponsors = opportunities.filter(o => o.pursuitType === 'corporate_sponsor');
  const events = opportunities.filter(o => o.pursuitType === 'event');

  // Donor list with aggregation
  const donorProfiles = useMemo(() => {
    const map = {};
    [...individualDonors, ...corporateSponsors].forEach(opp => {
      const key = opp.contactName || opp.funderName;
      if (!map[key]) {
        map[key] = {
          name: key,
          organization: opp.contactOrganization,
          email: opp.contactEmail,
          phone: opp.contactPhone,
          gifts: [],
          totalGiven: 0,
          lastGiftDate: null
        };
      }
      if (opp.stage === 'awarded' || opp.stage === 'committed' || opp.stage === 'stewarded') {
        map[key].gifts.push(opp);
        map[key].totalGiven += Number(opp.amountReceived || 0);
        if (opp.giftDate && (!map[key].lastGiftDate || opp.giftDate > map[key].lastGiftDate)) {
          map[key].lastGiftDate = opp.giftDate;
        }
      }
    });
    return Object.values(map).sort((a, b) => b.totalGiven - a.totalGiven);
  }, [individualDonors, corporateSponsors]);

  // Gamification
  const monthlyWins = opportunities.filter(o => 
    (o.stage === 'awarded' || o.stage === 'committed') &&
    o.giftDate && new Date(o.giftDate).getMonth() === new Date().getMonth()
  ).length;

  if (entityType !== '501c3') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-2">Fundraising is for 501(c)(3) schools</h2>
              <p className="text-sm text-yellow-800 mb-4">
                Grant management, donor relationships, and gift tracking unlock when entity type is nonprofit.
              </p>
              <button
                onClick={() => { window.location.href = '/settings'; }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={400} />}
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <HeartIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fundraising & Development</h1>
            <p className="text-gray-600">Building partnerships that fuel your mission 💙</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Opportunity
        </button>
      </div>

      {/* Momentum & Gamification */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-orange-600" />
              <div>
                <div className="text-xs text-gray-600">Streak</div>
                <div className="text-2xl font-bold text-gray-900">3 mo.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="text-xs text-gray-600">This Month</div>
                <div className="text-2xl font-bold text-gray-900">{monthlyWins} wins</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-purple-900 font-medium">
            💪 Every relationship matters—you're building something special!
          </div>
        </div>
      </div>

      {/* Annual Goal & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-primary-100 mb-2">Annual Goal</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs">$</span>
            <input
              type="number"
              value={annualGoal}
              onChange={(e) => {
                setAnnualGoal(Number(e.target.value));
                setGoalDirty(true);
              }}
              className="bg-transparent text-3xl font-bold text-white border-none focus:outline-none w-full"
              placeholder="0"
            />
          </div>
          {goalDirty && (
            <button onClick={handleSaveGoal} className="mt-2 px-3 py-1 bg-white/20 rounded text-xs">
              Save
            </button>
          )}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-primary-100">
            ${summary.totalReceived?.toLocaleString() || '0'} raised ({annualGoal > 0 ? Math.round((summary.totalReceived / annualGoal) * 100) : 0}%)
          </div>
        </div>

        <MetricCard icon={TrophyIcon} label="Total Raised" value={`$${summary.totalReceived?.toLocaleString() || '0'}`} subtitle={`${summary.donorCount || 0} donors`} color="green" />
        <MetricCard icon={BanknotesIcon} label="Restricted" value={`$${summary.restrictedReceived?.toLocaleString() || '0'}`} subtitle="Specific use" color="blue" />
        <MetricCard icon={BanknotesIcon} label="Unrestricted" value={`$${summary.unrestrictedReceived?.toLocaleString() || '0'}`} subtitle="Operating" color="green" />
        <MetricCard icon={ClockIcon} label="Pipeline" value={`$${summary.pipelineTotal?.toLocaleString() || '0'}`} subtitle={`${opportunities.length} active`} color="yellow" />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <Tab active={view === 'overview'} onClick={() => setView('overview')} icon={ChartBarIcon} label="Overview" />
          <Tab active={view === 'grants'} onClick={() => setView('grants')} icon={BuildingOfficeIcon} label="Grants" badge={grants.length} />
          <Tab active={view === 'donors'} onClick={() => setView('donors')} icon={HeartIcon} label="Individual Donors" badge={individualDonors.length} />
          <Tab active={view === 'corporate'} onClick={() => setView('corporate')} icon={BanknotesIcon} label="Corporate" badge={corporateSponsors.length} />
          <Tab active={view === 'events'} onClick={() => setView('events')} icon={GiftIcon} label="Events" badge={events.length} />
        </nav>
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <OverviewView
          grants={grants}
          donors={donorProfiles}
          corporateSponsors={corporateSponsors}
          events={events}
          summary={summary}
          annualGoal={annualGoal}
        />
      )}

      {/* Grants Module */}
      {view === 'grants' && (
        <GrantsView
          grants={grants}
          onStageChange={handleStageChange}
          onViewDetails={viewDetails}
        />
      )}

      {/* Individual Donors Module */}
      {view === 'donors' && (
        <DonorsView
          donors={donorProfiles}
          onGenerateThankYou={generateThankYou}
          onGenerateTaxReceipt={generateTaxReceipt}
        />
      )}

      {/* Corporate Sponsors Module */}
      {view === 'corporate' && (
        <CorporateView
          sponsors={corporateSponsors}
          onViewDetails={viewDetails}
        />
      )}

      {/* Events Module */}
      {view === 'events' && (
        <EventsView events={events} onViewDetails={viewDetails} />
      )}

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <AddOpportunityModal
          opportunity={newOpportunity}
          setOpportunity={setNewOpportunity}
          onClose={() => {
            setShowAddModal(false);
            setNewOpportunity(EMPTY_OPPORTUNITY);
          }}
          onCreate={handleCreate}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOpportunity && (
        <DetailModal
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOpportunity(null);
          }}
          onStageChange={handleStageChange}
          onGenerateThankYou={generateThankYou}
          onGenerateTaxReceipt={generateTaxReceipt}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

const Tab = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`touch-target py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
      active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
    {badge > 0 && <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">{badge}</span>}
  </button>
);

const MetricCard = ({ icon: Icon, label, value, subtitle, color }) => {
  const colors = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };
  return (
    <div className={`rounded-2xl border-2 p-6 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  );
};

// Overview View
const OverviewView = ({ grants, donors, corporateSponsors, events, summary, annualGoal }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <QuickAccessCard
      icon={BuildingOfficeIcon}
      title="Grants"
      count={grants.length}
      description="Foundation, corporate, government"
      color="blue"
    />
    <QuickAccessCard
      icon={HeartIcon}
      title="Individual Donors"
      count={donors.length}
      description="Major gifts & annual fund"
      color="purple"
    />
    <QuickAccessCard
      icon={BanknotesIcon}
      title="Corporate Sponsors"
      count={corporateSponsors.length}
      description="Business partnerships"
      color="teal"
    />
    <QuickAccessCard
      icon={GiftIcon}
      title="Events"
      count={events.length}
      description="Galas, auctions, campaigns"
      color="yellow"
    />
  </div>
);

const QuickAccessCard = ({ icon: Icon, title, count, description, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors[color]} mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 my-2">{count}</div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// Grants View
const GrantsView = ({ grants, onStageChange, onViewDetails }) => {
  const grantsByStage = {};
  GRANT_STAGES.forEach(stage => {
    grantsByStage[stage.id] = grants.filter(g => g.stage === stage.id);
  });

  return (
    <div className="space-y-4">
      {GRANT_STAGES.map(stage => {
        const stageGrants = grantsByStage[stage.id] || [];
        const total = stageGrants.reduce((sum, g) => sum + (Number(g.askAmount) || 0), 0);

        return (
          <div key={stage.id} className="bg-white rounded-xl shadow border border-gray-200">
            <div className={`bg-${stage.color}-50 border-b border-${stage.color}-200 px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{stage.name}</h3>
                  <p className="text-sm text-gray-600">{stage.desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{stageGrants.length}</div>
                  <div className="text-xs text-gray-600">${total.toLocaleString()}</div>
                </div>
              </div>
            </div>
            {stageGrants.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No grants</div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageGrants.map(g => <OpportunityCard key={g.id} opp={g} onClick={onViewDetails} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Donors View
const DonorsView = ({ donors, onGenerateThankYou, onGenerateTaxReceipt }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="table-scroll">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Given</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Gift</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Gifts</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {donors.map((d, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{d.name}</div>
                {d.email && <a href={`mailto:${d.email}`} className="text-xs text-primary-600">{d.email}</a>}
              </td>
              <td className="px-6 py-4 text-base font-bold text-green-600">${d.totalGiven?.toLocaleString() || '0'}</td>
              <td className="px-6 py-4 text-sm">{d.lastGiftDate ? new Date(d.lastGiftDate).toLocaleDateString() : '—'}</td>
              <td className="px-6 py-4 text-sm font-semibold">{d.gifts?.length || 0}</td>
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => onGenerateThankYou(d.gifts?.[0])} className="touch-target px-3 py-1.5 text-xs font-semibold border border-purple-200 text-purple-700 rounded-lg">Thank You</button>
                <button onClick={() => onGenerateTaxReceipt(d.gifts?.[0])} className="touch-target px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-lg">Tax Receipt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Corporate View
const CorporateView = ({ sponsors, onViewDetails }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {sponsors.map(s => <OpportunityCard key={s.id} opp={s} onClick={onViewDetails} />)}
  </div>
);

// Events View
const EventsView = ({ events, onViewDetails }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {events.map(e => <OpportunityCard key={e.id} opp={e} onClick={onViewDetails} />)}
  </div>
);

const OpportunityCard = ({ opp, onClick }) => (
  <div onClick={() => onClick(opp)} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
    <div className="font-semibold text-gray-900 mb-1">{opp.name}</div>
    <div className="text-xs text-gray-600 mb-3">{opp.funderName || opp.contactOrganization || opp.contactName}</div>
    <div className="text-base font-bold text-primary-600">${opp.askAmount?.toLocaleString() || '0'}</div>
  </div>
);

// Add Modal - COMPREHENSIVE FORM
const AddOpportunityModal = ({ opportunity, setOpportunity, onClose, onCreate }) => {
  const isGrant = ['foundation_grant', 'corporate_grant', 'government_grant'].includes(opportunity.pursuitType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Add Fundraising Opportunity</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            value={opportunity.pursuitType}
            onChange={(e) => setOpportunity(prev => ({ ...prev, pursuitType: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {PURSUIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">{isGrant ? 'Grant Name' : 'Donor/Sponsor Name'} *</label>
          <input
            type="text"
            value={opportunity.name}
            onChange={(e) => setOpportunity(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={isGrant ? "Knight Foundation STEM Grant" : "John & Mary Smith"}
          />
        </div>

        {/* Grant-Specific Fields */}
        {isGrant && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Funder Name *</label>
                <input
                  type="text"
                  value={opportunity.funderName}
                  onChange={(e) => setOpportunity(prev => ({ ...prev, funderName: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Knight Foundation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Program Officer</label>
                <input
                  type="text"
                  value={opportunity.programOfficer}
                  onChange={(e) => setOpportunity(prev => ({ ...prev, programOfficer: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Jane Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">LOI Due Date</label>
                <input type="date" value={opportunity.loiDueDate} onChange={(e) => setOpportunity(prev => ({ ...prev, loiDueDate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proposal Due Date</label>
                <input type="date" value={opportunity.proposalDueDate} onChange={(e) => setOpportunity(prev => ({ ...prev, proposalDueDate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Eligibility Notes</label>
              <textarea value={opportunity.eligibilityNotes} onChange={(e) => setOpportunity(prev => ({ ...prev, eligibilityNotes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} placeholder="Requirements, restrictions, focus areas..." />
            </div>
          </>
        )}

        {/* Donor-Specific Fields */}
        {!isGrant && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name *</label>
                <input type="text" value={opportunity.contactName} onChange={(e) => setOpportunity(prev => ({ ...prev, contactName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organization</label>
                <input type="text" value={opportunity.contactOrganization} onChange={(e) => setOpportunity(prev => ({ ...prev, contactOrganization: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={opportunity.contactEmail} onChange={(e) => setOpportunity(prev => ({ ...prev, contactEmail: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" value={opportunity.contactPhone} onChange={(e) => setOpportunity(prev => ({ ...prev, contactPhone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </>
        )}

        {/* Shared Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ask Amount</label>
            <input type="number" value={opportunity.askAmount} onChange={(e) => setOpportunity(prev => ({ ...prev, askAmount: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="50000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Award Type</label>
            <select value={opportunity.awardType} onChange={(e) => setOpportunity(prev => ({ ...prev, awardType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
              {AWARD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purpose / Use of Funds</label>
          <textarea value={opportunity.purpose} onChange={(e) => setOpportunity(prev => ({ ...prev, purpose: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Playground equipment, scholarships, operating support..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={opportunity.notes} onChange={(e) => setOpportunity(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add to Pipeline</button>
        </div>
      </div>
    </div>
  );
};

// Detail Modal - COMPREHENSIVE
const DetailModal = ({ opportunity, onClose, onStageChange, onGenerateThankYou, onGenerateTaxReceipt, onUpdate }) => {
  const isGrant = ['foundation_grant', 'corporate_grant', 'government_grant'].includes(opportunity.pursuitType);
  const stages = isGrant ? GRANT_STAGES : DONOR_STAGES;
  const currentStage = stages.find(s => s.id === opportunity.stage);
  const isWon = opportunity.stage === 'awarded' || opportunity.stage === 'committed' || opportunity.stage === 'stewarded';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{opportunity.name}</h2>
            <div className="text-sm text-primary-100 mt-1">{opportunity.funderName || opportunity.contactName}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-500 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Stage */}
          <div className={`p-4 rounded-lg border-2 bg-${currentStage?.color}-50 border-${currentStage?.color}-200`}>
            <div className="font-semibold text-gray-900 mb-1">Stage: {currentStage?.name}</div>
            <div className="text-sm text-gray-700">{currentStage?.desc}</div>
          </div>

          {/* Grant Details */}
          {isGrant && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Grant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Funder" value={opportunity.funderName} />
                <DetailField label="Program Officer" value={opportunity.programOfficer} />
                <DetailField label="LOI Due" value={opportunity.loiDueDate} />
                <DetailField label="Proposal Due" value={opportunity.proposalDueDate} />
                <DetailField label="Decision Date" value={opportunity.decisionDate} />
                <DetailField label="Report Due" value={opportunity.reportDueDate} />
              </div>
              {opportunity.eligibilityNotes && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Eligibility Notes</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{opportunity.eligibilityNotes}</div>
                </div>
              )}
            </div>
          )}

          {/* Donor Contact Details */}
          {!isGrant && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Name" value={opportunity.contactName} />
                <DetailField label="Organization" value={opportunity.contactOrganization} />
                <DetailField label="Email" value={opportunity.contactEmail} />
                <DetailField label="Phone" value={opportunity.contactPhone} />
              </div>
            </div>
          )}

          {/* Financial */}
          <div className="grid grid-cols-3 gap-4">
            <DetailField label="Ask Amount" value={`$${opportunity.askAmount?.toLocaleString() || '0'}`} />
            <DetailField label="Amount Received" value={opportunity.amountReceived ? `$${opportunity.amountReceived.toLocaleString()}` : '—'} />
            <DetailField label="Award Type" value={opportunity.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'} />
          </div>

          {/* Purpose */}
          {opportunity.purpose && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Purpose / Use of Funds</div>
              <div className="text-sm text-gray-700">{opportunity.purpose}</div>
            </div>
          )}

          {/* Notes */}
          {opportunity.notes && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
              <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 p-3 rounded">{opportunity.notes}</div>
            </div>
          )}

          {/* Thank You & Tax Receipt */}
          {isWon && !isGrant && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">Donor Stewardship</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => onGenerateThankYou(opportunity)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  Generate Thank You
                </button>
                <button onClick={() => onGenerateTaxReceipt(opportunity)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Tax Receipt
                </button>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={opportunity.thankYouSent} readOnly className="rounded" />
                  <span>Thank you sent</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={opportunity.taxReceiptSent} readOnly className="rounded" />
                  <span>Tax receipt sent</span>
                </label>
              </div>
            </div>
          )}

          {/* Stage Movement */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Move to Stage</h3>
            <div className="flex flex-wrap gap-2">
              {stages.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onStageChange(opportunity, s.id); onClose(); }}
                  disabled={s.id === opportunity.stage}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                    s.id === opportunity.stage ? 'bg-gray-200 text-gray-500' : `bg-${s.color}-100 text-${s.color}-700 hover:bg-${s.color}-200`
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-medium text-gray-900">{value || '—'}</div>
  </div>
);

export default FundraisingCRM;

