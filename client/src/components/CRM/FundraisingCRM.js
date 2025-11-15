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
  PencilIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { fundraisingAPI } from '../../services/api';

/**
 * Comprehensive Fundraising Platform
 * Best-in-class from DonorPerfect, Bloomerang, Submittable, Fluxx
 */

// Grant stages
const GRANT_STAGES = [
  { id: 'research', name: 'Research', desc: 'Eligibility check', color: 'gray' },
  { id: 'loi', name: 'LOI', desc: 'Letter of Intent', color: 'blue' },
  { id: 'invited', name: 'Invited', desc: 'Proposal invited', color: 'indigo' },
  { id: 'drafting', name: 'Drafting', desc: 'Writing app', color: 'purple' },
  { id: 'submitted', name: 'Submitted', desc: 'Under review', color: 'yellow' },
  { id: 'awarded', name: 'Awarded', desc: 'Won!', color: 'green' },
  { id: 'declined', name: 'Declined', desc: 'Not funded', color: 'red' },
  { id: 'reporting', name: 'Reporting', desc: 'Compliance', color: 'teal' }
];

// Donor stages
const DONOR_STAGES = [
  { id: 'prospect', name: 'Prospect', desc: 'Potential', color: 'gray' },
  { id: 'cultivate', name: 'Cultivate', desc: 'Building relationship', color: 'blue' },
  { id: 'ask', name: 'Ask Made', desc: 'Solicitation sent', color: 'purple' },
  { id: 'committed', name: 'Committed', desc: 'Pledge secured', color: 'green' },
  { id: 'stewarded', name: 'Stewarded', desc: 'Ongoing', color: 'teal' }
];

const PURSUIT_TYPES = [
  { value: 'foundation_grant', label: 'Foundation Grant', icon: BuildingOfficeIcon },
  { value: 'corporate_grant', label: 'Corporate Grant', icon: BuildingOfficeIcon },
  { value: 'government_grant', label: 'Government Grant', icon: BuildingOfficeIcon },
  { value: 'individual_major', label: 'Individual Major Gift ($5k+)', icon: HeartIcon },
  { value: 'individual_annual', label: 'Individual Annual Gift', icon: HeartIcon },
  { value: 'corporate_sponsor', label: 'Corporate Sponsorship', icon: BanknotesIcon },
  { value: 'event', label: 'Event/Campaign', icon: GiftIcon }
];

const EMPTY_OPP = {
  name: '', pursuitType: 'foundation_grant', awardType: 'restricted', stage: 'research',
  askAmount: '', amountReceived: '',
  funderName: '', funderWebsite: '', programOfficer: '',
  loiDueDate: '', proposalDueDate: '', decisionDate: '', reportDueDate: '', eligibilityNotes: '',
  contactName: '', contactOrganization: '', contactEmail: '', contactPhone: '',
  purpose: '', notes: '', priority: 'medium',
  thankYouSent: false, taxReceiptSent: false
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [view, setView] = useState('overview');
  const [annualGoal, setAnnualGoal] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState({ annualGoal: 0, totalReceived: 0, restrictedReceived: 0, unrestrictedReceived: 0, pipelineTotal: 0, donorCount: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [newOpp, setNewOpp] = useState(EMPTY_OPP);
  const [showCelebration, setShowCelebration] = useState(false);
  const [goalDirty, setGoalDirty] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEntityType(localStorage.getItem('entityType') || 'llc-single');
    }
  }, []);

  useEffect(() => {
    if (entityType === '501c3') loadData();
  }, [entityType]);

  const loadData = async () => {
    try {
      const { data } = await fundraisingAPI.getOpportunities();
      setAnnualGoal(data.annualGoal ?? 0);
      setOpportunities(data.opportunities || []);
      setSummary(data.summary || summary);
    } catch (e) {
      toast.error('Unable to load');
    }
  };

  const handleSaveGoal = async () => {
    try {
      await fundraisingAPI.updateGoal(annualGoal);
      setGoalDirty(false);
      toast.success('🎯 Goal saved!');
    } catch (e) {
      toast.error('Unable to save');
    }
  };

  const handleCreate = async () => {
    if (!newOpp.name) return toast.error('Enter a name');
    try {
      const { data } = await fundraisingAPI.createOpportunity(newOpp);
      setOpportunities(prev => [data.opportunity, ...prev]);
      setSummary(data.summary);
      setShowAddModal(false);
      setNewOpp(EMPTY_OPP);
      toast.success('✨ Added!');
    } catch (e) {
      toast.error('Error');
    }
  };

  const handleStageChange = async (opp, stage) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(opp.id, { stage });
      setOpportunities(prev => prev.map(o => o.id === opp.id ? data.opportunity : o));
      setSummary(data.summary);
      if (stage === 'awarded' || stage === 'committed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
        toast.success(`🎉 ${opp.name} secured!`);
      }
    } catch (e) {
      toast.error('Error');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(id, updates);
      setOpportunities(prev => prev.map(o => o.id === id ? data.opportunity : o));
    } catch (e) {
      console.error(e);
    }
  };

  const grants = opportunities.filter(o => ['foundation_grant', 'corporate_grant', 'government_grant'].includes(o.pursuitType));
  const individualDonors = opportunities.filter(o => ['individual_major', 'individual_annual'].includes(o.pursuitType));
  const corporateSponsors = opportunities.filter(o => o.pursuitType === 'corporate_sponsor');
  const events = opportunities.filter(o => o.pursuitType === 'event');

  const donorProfiles = useMemo(() => {
    const map = {};
    [...individualDonors, ...corporateSponsors].forEach(opp => {
      const key = opp.contactName;
      if (!key) return;
      if (!map[key]) map[key] = { name: key, org: opp.contactOrganization, email: opp.contactEmail, phone: opp.contactPhone, gifts: [], total: 0, lastDate: null };
      if (opp.stage === 'committed' || opp.stage === 'stewarded') {
        map[key].gifts.push(opp);
        map[key].total += Number(opp.amountReceived || 0);
        if (opp.giftDate && (!map[key].lastDate || opp.giftDate > map[key].lastDate)) map[key].lastDate = opp.giftDate;
      }
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [individualDonors, corporateSponsors]);

  const monthlyWins = opportunities.filter(o => 
    (o.stage === 'awarded' || o.stage === 'committed') && o.giftDate && new Date(o.giftDate).getMonth() === new Date().getMonth()
  ).length;

  if (entityType !== '501c3') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <SparklesIcon className="h-10 w-10 text-yellow-600 mb-4" />
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">Fundraising is for 501(c)(3) schools</h2>
          <button onClick={() => window.location.href = '/settings'} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Update Entity Type</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={400} />}
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeartIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Fundraising & Development</h1>
            <p className="text-gray-600">Building partnerships that fuel your mission 💙</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Opportunity
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-orange-600" />
              <div>
                <div className="text-xs text-gray-600">Streak</div>
                <div className="text-2xl font-bold">3 mo.</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
              <div>
                <div className="text-xs text-gray-600">This Month</div>
                <div className="text-2xl font-bold">{monthlyWins} wins</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-purple-900 font-medium">💪 Every relationship matters—you're building something special!</div>
        </div>
      </div>

      {/* GOAL - Users can edit here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-primary-100 mb-2">Annual Goal</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs">$</span>
            <input
              type="number"
              value={annualGoal}
              onChange={(e) => { setAnnualGoal(Number(e.target.value)); setGoalDirty(true); }}
              className="bg-transparent text-3xl font-bold text-white border-none focus:outline-none w-full"
            />
          </div>
          {goalDirty && <button onClick={handleSaveGoal} className="mt-2 px-3 py-1 bg-white/20 rounded text-xs">Save</button>}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-primary-100">${summary.totalReceived?.toLocaleString() || '0'} ({annualGoal > 0 ? Math.round((summary.totalReceived / annualGoal) * 100) : 0}%)</div>
        </div>

        <MetricCard icon={TrophyIcon} label="Total Raised" value={`$${summary.totalReceived?.toLocaleString() || '0'}`} subtitle={`${summary.donorCount || 0} donors`} color="green" />
        <MetricCard icon={BanknotesIcon} label="Restricted" value={`$${summary.restrictedReceived?.toLocaleString() || '0'}`} subtitle="Specific use" color="blue" />
        <MetricCard icon={BanknotesIcon} label="Unrestricted" value={`$${summary.unrestrictedReceived?.toLocaleString() || '0'}`} subtitle="Operating" color="green" />
        <MetricCard icon={ClockIcon} label="Pipeline" value={`$${summary.pipelineTotal?.toLocaleString() || '0'}`} subtitle={`${opportunities.length} active`} color="yellow" />
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <Tab active={view === 'overview'} onClick={() => setView('overview')} icon={ChartBarIcon} label="Overview" />
          <Tab active={view === 'grants'} onClick={() => setView('grants')} icon={BuildingOfficeIcon} label="Grants" badge={grants.length} />
          <Tab active={view === 'donors'} onClick={() => setView('donors')} icon={HeartIcon} label="Donors" badge={donorProfiles.length} />
          <Tab active={view === 'corporate'} onClick={() => setView('corporate')} icon={BanknotesIcon} label="Corporate" badge={corporateSponsors.length} />
          <Tab active={view === 'events'} onClick={() => setView('events')} icon={GiftIcon} label="Events" badge={events.length} />
        </nav>
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickCard icon={BuildingOfficeIcon} title="Grants" count={grants.length} desc="Foundations & institutions" onClick={() => setView('grants')} />
          <QuickCard icon={HeartIcon} title="Individual Donors" count={donorProfiles.length} desc="Major & annual gifts" onClick={() => setView('donors')} />
          <QuickCard icon={BanknotesIcon} title="Corporate Sponsors" count={corporateSponsors.length} desc="Business partners" onClick={() => setView('corporate')} />
          <QuickCard icon={GiftIcon} title="Events" count={events.length} desc="Campaigns & fundraisers" onClick={() => setView('events')} />
        </div>
      )}

      {/* GRANTS VIEW */}
      {view === 'grants' && (
        <div className="space-y-4">
          {GRANT_STAGES.map(stage => {
            const stageGrants = grants.filter(g => g.stage === stage.id);
            const total = stageGrants.reduce((sum, g) => sum + (Number(g.askAmount) || 0), 0);
            return (
              <div key={stage.id} className="bg-white rounded-xl shadow border border-gray-200">
                <div className={`bg-${stage.color}-50 border-b border-${stage.color}-200 px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{stage.name}</h3>
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
                    {stageGrants.map(g => (
                      <div key={g.id} onClick={() => { setSelectedOpp(g); setShowDetailModal(true); }} className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer">
                        <div className="font-semibold text-sm mb-1">{g.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{g.funderName}</div>
                        <div className="text-base font-bold text-primary-600">${g.askAmount?.toLocaleString() || '0'}</div>
                        {g.proposalDueDate && <div className="text-xs text-gray-600 mt-2"><ClockIcon className="h-3 w-3 inline" /> {g.proposalDueDate}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DONORS VIEW */}
      {view === 'donors' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <HeartIcon className="h-5 w-5 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-900">Your Donor Community</h3>
            <p className="text-sm text-purple-800">Partners who believe in your mission 💙</p>
          </div>
          
          {donorProfiles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No donors yet. Click "Add Opportunity" and select Individual Gift!</p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Gifts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donorProfiles.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{d.name}</div>
                          {d.org && <div className="text-xs text-gray-500">{d.org}</div>}
                          {d.email && <a href={`mailto:${d.email}`} className="text-xs text-primary-600">{d.email}</a>}
                        </td>
                        <td className="px-6 py-4 text-base font-bold text-green-600">${d.total?.toLocaleString() || '0'}</td>
                        <td className="px-6 py-4 text-sm">{d.lastDate ? new Date(d.lastDate).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{d.gifts?.length || 0}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button onClick={() => { toast.success(`📝 Thank you letter for ${d.name}`); handleUpdate(d.gifts?.[0]?.id, { thankYouSent: true }); }} className="touch-target px-3 py-1.5 text-xs font-semibold border border-purple-200 text-purple-700 rounded-lg">
                            Thank You
                          </button>
                          <button onClick={() => { toast.success(`📄 Tax receipt for ${d.name}`); handleUpdate(d.gifts?.[0]?.id, { taxReceiptSent: true }); }} className="touch-target px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-lg">
                            Tax Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CORPORATE VIEW */}
      {view === 'corporate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corporateSponsors.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No corporate sponsors. Click "Add Opportunity" → Corporate Sponsorship!</p>
            </div>
          ) : corporateSponsors.map(s => (
            <div key={s.id} onClick={() => { setSelectedOpp(s); setShowDetailModal(true); }} className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer">
              <div className="font-semibold mb-1">{s.name}</div>
              <div className="text-xs text-gray-600 mb-3">{s.contactOrganization}</div>
              <div className="text-base font-bold text-primary-600">${s.askAmount?.toLocaleString() || '0'}</div>
            </div>
          ))}
        </div>
      )}

      {/* EVENTS VIEW */}
      {view === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <GiftIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No events. Click "Add Opportunity" → Event/Campaign!</p>
            </div>
          ) : events.map(e => (
            <div key={e.id} onClick={() => { setSelectedOpp(e); setShowDetailModal(true); }} className="bg-white border rounded-lg p-6 hover:shadow-md cursor-pointer">
              <div className="font-semibold mb-1">{e.name}</div>
              <div className="text-xs text-gray-600 mb-3">{e.purpose}</div>
              <div className="text-2xl font-bold text-primary-600">${e.askAmount?.toLocaleString() || '0'}</div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL - COMPREHENSIVE FORM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Add Fundraising Opportunity</h2>
              <button onClick={() => { setShowAddModal(false); setNewOpp(EMPTY_OPP); }} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select value={newOpp.pursuitType} onChange={(e) => setNewOpp(prev => ({ ...prev, pursuitType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
                {PURSUIT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Grant Fields */}
            {['foundation_grant', 'corporate_grant', 'government_grant'].includes(newOpp.pursuitType) && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Grant Name *</label>
                  <input type="text" value={newOpp.name} onChange={(e) => setNewOpp(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Knight STEM Grant" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Funder Name *</label>
                    <input type="text" value={newOpp.funderName} onChange={(e) => setNewOpp(prev => ({ ...prev, funderName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Program Officer</label>
                    <input type="text" value={newOpp.programOfficer} onChange={(e) => setNewOpp(prev => ({ ...prev, programOfficer: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">LOI Due</label>
                    <input type="date" value={newOpp.loiDueDate} onChange={(e) => setNewOpp(prev => ({ ...prev, loiDueDate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Proposal Due</label>
                    <input type="date" value={newOpp.proposalDueDate} onChange={(e) => setNewOpp(prev => ({ ...prev, proposalDueDate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Eligibility Notes</label>
                  <textarea value={newOpp.eligibilityNotes} onChange={(e) => setNewOpp(prev => ({ ...prev, eligibilityNotes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                </div>
              </>
            )}

            {/* Donor/Corporate Fields */}
            {!['foundation_grant', 'corporate_grant', 'government_grant'].includes(newOpp.pursuitType) && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Donor/Contact Name *</label>
                  <input type="text" value={newOpp.contactName} onChange={(e) => setNewOpp(prev => ({ ...prev, contactName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="John Smith" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization</label>
                    <input type="text" value={newOpp.contactOrganization} onChange={(e) => setNewOpp(prev => ({ ...prev, contactOrganization: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={newOpp.contactEmail} onChange={(e) => setNewOpp(prev => ({ ...prev, contactEmail: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={newOpp.contactPhone} onChange={(e) => setNewOpp(prev => ({ ...prev, contactPhone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </>
            )}

            {/* Shared Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ask Amount</label>
                <input type="number" value={newOpp.askAmount} onChange={(e) => setNewOpp(prev => ({ ...prev, askAmount: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Award Type</label>
                <select value={newOpp.awardType} onChange={(e) => setNewOpp(prev => ({ ...prev, awardType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
                  <option value="restricted">Restricted</option>
                  <option value="unrestricted">Unrestricted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purpose / Use of Funds</label>
              <textarea value={newOpp.purpose} onChange={(e) => setNewOpp(prev => ({ ...prev, purpose: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Playground, scholarships, operating..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea value={newOpp.notes} onChange={(e) => setNewOpp(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button onClick={() => { setShowAddModal(false); setNewOpp(EMPTY_OPP); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add to Pipeline</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL - COMPREHENSIVE */}
      {showDetailModal && selectedOpp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedOpp.name}</h2>
                <div className="text-sm text-primary-100">{selectedOpp.funderName || selectedOpp.contactName}</div>
              </div>
              <button onClick={() => { setShowDetailModal(false); setSelectedOpp(null); }} className="p-2 hover:bg-primary-500 rounded"><XMarkIcon className="h-6 w-6" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stage */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold mb-1">Stage: {GRANT_STAGES.find(s => s.id === selectedOpp.stage)?.name || DONOR_STAGES.find(s => s.id === selectedOpp.stage)?.name}</div>
              </div>

              {/* Grant Details */}
              {['foundation_grant', 'corporate_grant', 'government_grant'].includes(selectedOpp.pursuitType) && (
                <div className="space-y-4">
                  <h3 className="font-bold">Grant Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Funder" value={selectedOpp.funderName} />
                    <Field label="Program Officer" value={selectedOpp.programOfficer} />
                    <Field label="LOI Due" value={selectedOpp.loiDueDate} />
                    <Field label="Proposal Due" value={selectedOpp.proposalDueDate} />
                  </div>
                  {selectedOpp.eligibilityNotes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Eligibility</div>
                      <div className="text-sm bg-gray-50 p-3 rounded">{selectedOpp.eligibilityNotes}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Donor Contact */}
              {!['foundation_grant', 'corporate_grant', 'government_grant'].includes(selectedOpp.pursuitType) && (
                <div className="space-y-4">
                  <h3 className="font-bold">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={selectedOpp.contactName} />
                    <Field label="Organization" value={selectedOpp.contactOrganization} />
                    <Field label="Email" value={selectedOpp.contactEmail} />
                    <Field label="Phone" value={selectedOpp.contactPhone} />
                  </div>
                </div>
              )}

              {/* Financial */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Ask Amount" value={`$${selectedOpp.askAmount?.toLocaleString() || '0'}`} />
                <Field label="Received" value={selectedOpp.amountReceived ? `$${selectedOpp.amountReceived.toLocaleString()}` : '—'} />
                <Field label="Type" value={selectedOpp.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'} />
              </div>

              {selectedOpp.purpose && (
                <div>
                  <div className="text-sm font-medium mb-1">Purpose</div>
                  <div className="text-sm">{selectedOpp.purpose}</div>
                </div>
              )}

              {selectedOpp.notes && (
                <div>
                  <div className="text-sm font-medium mb-1">Notes</div>
                  <div className="text-sm bg-yellow-50 p-3 rounded">{selectedOpp.notes}</div>
                </div>
              )}

              {/* Thank You & Tax */}
              {(selectedOpp.stage === 'committed' || selectedOpp.stage === 'stewarded') && ['individual_major', 'individual_annual', 'corporate_sponsor'].includes(selectedOpp.pursuitType) && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Donor Stewardship</h3>
                  <div className="flex gap-3 mb-3">
                    <button onClick={() => { toast.success(`📝 Thank you letter for ${selectedOpp.contactName}`); handleUpdate(selectedOpp.id, { thankYouSent: true }); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      Thank You Letter
                    </button>
                    <button onClick={() => { toast.success(`📄 Tax receipt for ${selectedOpp.contactName}`); handleUpdate(selectedOpp.id, { taxReceiptSent: true }); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Tax Receipt
                    </button>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedOpp.thankYouSent} readOnly className="rounded" />
                      <span>Thank you sent</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedOpp.taxReceiptSent} readOnly className="rounded" />
                      <span>Tax receipt sent</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Stage Movement */}
              <div>
                <h3 className="font-semibold mb-3">Move to Stage</h3>
                <div className="flex flex-wrap gap-2">
                  {(['foundation_grant', 'corporate_grant', 'government_grant'].includes(selectedOpp.pursuitType) ? GRANT_STAGES : DONOR_STAGES).map(s => (
                    <button
                      key={s.id}
                      onClick={() => { handleStageChange(selectedOpp, s.id); setShowDetailModal(false); }}
                      disabled={s.id === selectedOpp.stage}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${s.id === selectedOpp.stage ? 'bg-gray-200 text-gray-500' : `bg-${s.color}-100 text-${s.color}-700`}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <button onClick={() => { setShowDetailModal(false); setSelectedOpp(null); }} className="px-4 py-2 border rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Tab = ({ active, onClick, icon: Icon, label, badge }) => (
  <button onClick={onClick} className={`touch-target py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>
    <Icon className="h-4 w-4" />
    {label}
    {badge > 0 && <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">{badge}</span>}
  </button>
);

const MetricCard = ({ icon: Icon, label, value, subtitle, color }) => {
  const colors = { green: 'bg-green-50 border-green-200', blue: 'bg-blue-50 border-blue-200', yellow: 'bg-yellow-50 border-yellow-200' };
  return (
    <div className={`rounded-2xl border-2 p-6 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  );
};

const QuickCard = ({ icon: Icon, title, count, desc, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-xl shadow border p-6 hover:shadow-lg cursor-pointer transition">
    <Icon className="h-8 w-8 text-primary-600 mb-4" />
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="text-3xl font-bold my-2">{count}</div>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-medium">{value || '—'}</div>
  </div>
);

export default FundraisingCRM;
