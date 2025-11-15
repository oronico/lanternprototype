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
  MagnifyingGlassIcon,
  LinkIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { fundraisingAPI } from '../../services/api';

/**
 * Comprehensive Fundraising CRM
 * 
 * DATABASE STRUCTURE:
 * 1. CONTACTS (persistent donor/funder records)
 *    - Foundation records
 *    - Individual donor records  
 *    - Corporation records
 * 
 * 2. OPPORTUNITIES (fundraising pursuits linked to contacts)
 *    - Grant applications
 *    - Donor solicitations
 *    - Corporate sponsorships
 *    - Events
 */

// Contact Types
const CONTACT_TYPES = [
  { value: 'foundation', label: 'Foundation', icon: BuildingOfficeIcon },
  { value: 'individual', label: 'Individual Donor', icon: HeartIcon },
  { value: 'corporation', label: 'Corporation', icon: BanknotesIcon }
];

// Opportunity Types
const OPPORTUNITY_TYPES = [
  { value: 'foundation_grant', label: 'Foundation Grant', contactType: 'foundation' },
  { value: 'corporate_grant', label: 'Corporate Grant', contactType: 'corporation' },
  { value: 'government_grant', label: 'Government Grant', contactType: 'foundation' },
  { value: 'major_gift', label: 'Major Gift ($5k+)', contactType: 'individual' },
  { value: 'annual_gift', label: 'Annual Fund Gift', contactType: 'individual' },
  { value: 'corporate_sponsor', label: 'Corporate Sponsorship', contactType: 'corporation' },
  { value: 'event_revenue', label: 'Event Revenue', contactType: 'individual' }
];

// Grant stages
const GRANT_STAGES = [
  { id: 'research', name: 'Research', desc: 'Eligibility check', color: 'gray' },
  { id: 'loi', name: 'LOI', desc: 'Letter of Intent', color: 'blue' },
  { id: 'invited', name: 'Invited', desc: 'Full proposal', color: 'indigo' },
  { id: 'drafting', name: 'Drafting', desc: 'Writing', color: 'purple' },
  { id: 'submitted', name: 'Submitted', desc: 'Pending', color: 'yellow' },
  { id: 'awarded', name: 'Awarded', desc: 'Won!', color: 'green' },
  { id: 'declined', name: 'Declined', desc: 'Lost', color: 'red' },
  { id: 'reporting', name: 'Reporting', desc: 'Compliance', color: 'teal' }
];

// Donor solicitation stages
const DONOR_STAGES = [
  { id: 'prospect', name: 'Prospect', desc: 'Research', color: 'gray' },
  { id: 'cultivate', name: 'Cultivate', desc: 'Relationship', color: 'blue' },
  { id: 'solicit', name: 'Solicit', desc: 'Ask made', color: 'purple' },
  { id: 'pending', name: 'Pending', desc: 'Awaiting', color: 'yellow' },
  { id: 'committed', name: 'Committed', desc: 'Won!', color: 'green' },
  { id: 'declined', name: 'Declined', desc: 'Lost', color: 'red' },
  { id: 'stewarded', name: 'Stewarded', desc: 'Ongoing', color: 'teal' }
];

const EMPTY_CONTACT = {
  // Core
  name: '',
  contactType: 'foundation',
  source: 'website',
  
  // Foundation fields
  foundationType: 'private',
  website: '',
  focusAreas: '',
  typicalRange: '',
  applicationProcess: '',
  
  // Individual fields
  firstName: '',
  lastName: '',
  title: '',
  employer: '',
  
  // Corporation fields
  companyName: '',
  industry: '',
  
  // Shared contact
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  
  // Notes
  summary: '',
  relationshipNotes: '',
  tags: []
};

const EMPTY_OPPORTUNITY = {
  name: '',
  opportunityType: 'foundation_grant',
  contactId: null,
  stage: 'research',
  awardType: 'restricted',
  
  askAmount: '',
  amountReceived: '',
  
  // Grant-specific
  loiDueDate: '',
  proposalDueDate: '',
  decisionDate: '',
  reportDueDate: '',
  
  // Donor-specific
  askDate: '',
  giftDate: '',
  
  purpose: '',
  restrictions: '',
  priority: 'medium',
  notes: '',
  
  thankYouSent: false,
  taxReceiptSent: false
};

const FundraisingCRM = () => {
  const [entityType, setEntityType] = useState('llc-single');
  const [view, setView] = useState('overview'); // overview, contacts, opportunities, analytics
  const [contactView, setContactView] = useState('all'); // all, foundations, individuals, corporations
  const [annualGoal, setAnnualGoal] = useState(0);
  
  // Database objects
  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState({ annualGoal: 0, totalReceived: 0, restrictedReceived: 0, unrestrictedReceived: 0, pipelineTotal: 0, contactCount: 0 });
  
  // UI state
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [showOppDetail, setShowOppDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [newContact, setNewContact] = useState(EMPTY_CONTACT);
  const [newOpp, setNewOpp] = useState(EMPTY_OPPORTUNITY);
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
      setContacts(data.contacts || []);
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
      toast.error('Error');
    }
  };

  const handleCreateContact = async () => {
    if (!newContact.name && !newContact.companyName && !newContact.firstName) {
      return toast.error('Enter a name');
    }
    try {
      const { data } = await fundraisingAPI.createContact(newContact);
      setContacts(prev => [data.contact, ...prev]);
      setShowAddContactModal(false);
      setNewContact(EMPTY_CONTACT);
      toast.success('✨ Contact added!');
    } catch (e) {
      toast.error('Error');
    }
  };

  const handleCreateOpportunity = async () => {
    if (!newOpp.name || !newOpp.contactId) {
      return toast.error('Enter opportunity name and select a contact');
    }
    try {
      const { data } = await fundraisingAPI.createOpportunity(newOpp);
      setOpportunities(prev => [data.opportunity, ...prev]);
      setSummary(data.summary);
      setShowAddOppModal(false);
      setNewOpp(EMPTY_OPPORTUNITY);
      toast.success('✨ Opportunity added!');
    } catch (e) {
      toast.error('Error');
    }
  };

  const handleStageChange = async (opp, stage) => {
    try {
      const { data } = await fundraisingAPI.updateOpportunity(opp.id, { stage });
      setOpportunities(prev => prev.map(o => o.id === opp.id ? data.opportunity : o));
      if (stage === 'awarded' || stage === 'committed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
        toast.success(`🎉 ${opp.name} secured!`);
      }
    } catch (e) {
      toast.error('Error');
    }
  };

  const generateThankYou = (contact) => {
    toast.success(`📝 Thank you letter for ${contact.name || contact.companyName}`);
  };

  const generateTaxReceipt = (contact) => {
    toast.success(`📄 Tax receipt for ${contact.name || contact.companyName}`);
  };

  // Filter contacts
  const filteredContacts = useMemo(() => {
    if (contactView === 'all') return contacts;
    if (contactView === 'foundations') return contacts.filter(c => c.contactType === 'foundation');
    if (contactView === 'individuals') return contacts.filter(c => c.contactType === 'individual');
    if (contactView === 'corporations') return contacts.filter(c => c.contactType === 'corporation');
    return contacts;
  }, [contacts, contactView]);

  // Stats
  const foundations = contacts.filter(c => c.contactType === 'foundation');
  const individuals = contacts.filter(c => c.contactType === 'individual');
  const corporations = contacts.filter(c => c.contactType === 'corporation');

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
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeartIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Fundraising & Development</h1>
            <p className="text-gray-600">Donor relationships & grant pipeline 💙</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddContactModal(true)} className="touch-target px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5" />
            Add Contact
          </button>
          <button onClick={() => setShowAddOppModal(true)} className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <TrophyIcon className="h-5 w-5" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Gamification */}
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
          <div className="text-sm text-purple-900 font-medium">💪 Building relationships that last!</div>
        </div>
      </div>

      {/* Metrics */}
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
              placeholder="0"
            />
          </div>
          {goalDirty && <button onClick={handleSaveGoal} className="mt-2 px-3 py-1 bg-white/20 rounded text-xs">Save</button>}
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-primary-100">${summary.totalReceived?.toLocaleString() || '0'} ({annualGoal > 0 ? Math.round((summary.totalReceived / annualGoal) * 100) : 0}%)</div>
        </div>

        <MetricCard icon={TrophyIcon} label="Total Raised" value={`$${summary.totalReceived?.toLocaleString() || '0'}`} subtitle={`${contacts.length} contacts`} color="green" />
        <MetricCard icon={BanknotesIcon} label="Restricted" value={`$${summary.restrictedReceived?.toLocaleString() || '0'}`} subtitle="Specific use" color="blue" />
        <MetricCard icon={BanknotesIcon} label="Unrestricted" value={`$${summary.unrestrictedReceived?.toLocaleString() || '0'}`} subtitle="Operating" color="green" />
        <MetricCard icon={ClockIcon} label="Pipeline" value={`$${summary.pipelineTotal?.toLocaleString() || '0'}`} subtitle={`${opportunities.length} active`} color="yellow" />
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <Tab active={view === 'overview'} onClick={() => setView('overview')} icon={ChartBarIcon} label="Overview" />
          <Tab active={view === 'contacts'} onClick={() => setView('contacts')} icon={UserGroupIcon} label="Contacts" badge={contacts.length} />
          <Tab active={view === 'opportunities'} onClick={() => setView('opportunities')} icon={TrophyIcon} label="Opportunities" badge={opportunities.length} />
          <Tab active={view === 'analytics'} onClick={() => setView('analytics')} icon={ChartBarIcon} label="Analytics" />
        </nav>
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickCard icon={BuildingOfficeIcon} title="Foundations" count={foundations.length} desc="Foundation contacts & grants" onClick={() => { setView('contacts'); setContactView('foundations'); }} />
          <QuickCard icon={HeartIcon} title="Individual Donors" count={individuals.length} desc="Major & annual donors" onClick={() => { setView('contacts'); setContactView('individuals'); }} />
          <QuickCard icon={BanknotesIcon} title="Corporations" count={corporations.length} desc="Corporate sponsors" onClick={() => { setView('contacts'); setContactView('corporations'); }} />
        </div>
      )}

      {/* CONTACTS VIEW - Database of Donors/Funders */}
      {view === 'contacts' && (
        <div className="space-y-6">
          {/* Contact Type Filter */}
          <div className="flex gap-2">
            <button onClick={() => setContactView('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${contactView === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All ({contacts.length})</button>
            <button onClick={() => setContactView('foundations')} className={`px-4 py-2 rounded-lg text-sm font-medium ${contactView === 'foundations' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Foundations ({foundations.length})</button>
            <button onClick={() => setContactView('individuals')} className={`px-4 py-2 rounded-lg text-sm font-medium ${contactView === 'individuals' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Individuals ({individuals.length})</button>
            <button onClick={() => setContactView('corporations')} className={`px-4 py-2 rounded-lg text-sm font-medium ${contactView === 'corporations' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Corporations ({corporations.length})</button>
          </div>

          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No contacts yet. Build your fundraising database!</p>
              <button onClick={() => setShowAddContactModal(true)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add First Contact</button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="table-scroll">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunities</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Given</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredContacts.map(contact => {
                      const contactOpps = opportunities.filter(o => o.contactId === contact.id);
                      const totalGiven = contactOpps.reduce((sum, o) => sum + (Number(o.amountReceived) || 0), 0);
                      const displayName = contact.name || contact.companyName || `${contact.firstName} ${contact.lastName}`;

                      return (
                        <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedContact(contact); setShowContactDetail(true); }}>
                          <td className="px-6 py-4">
                            <div className="font-medium">{displayName}</div>
                            {contact.website && <div className="text-xs text-gray-500">{contact.website}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 capitalize">{contact.contactType}</span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {contact.email && <div className="text-gray-600">{contact.email}</div>}
                            {contact.phone && <div className="text-gray-500 text-xs">{contact.phone}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">{contactOpps.length}</td>
                          <td className="px-6 py-4 text-base font-bold text-green-600">${totalGiven.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <button onClick={(e) => { e.stopPropagation(); setNewOpp({ ...EMPTY_OPPORTUNITY, contactId: contact.id }); setShowAddOppModal(true); }} className="touch-target text-primary-600 hover:text-primary-800 text-sm font-medium">
                              + Add Opportunity
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
      )}

      {/* OPPORTUNITIES VIEW */}
      {view === 'opportunities' && (
        <OpportunitiesView opportunities={opportunities} contacts={contacts} onViewDetails={(opp) => { setSelectedOpp(opp); setShowOppDetail(true); }} />
      )}

      {/* ANALYTICS */}
      {view === 'analytics' && (
        <AnalyticsView opportunities={opportunities} contacts={contacts} summary={summary} annualGoal={annualGoal} />
      )}

      {/* ADD CONTACT MODAL */}
      {showAddContactModal && (
        <AddContactModal
          contact={newContact}
          setContact={setNewContact}
          onClose={() => { setShowAddContactModal(false); setNewContact(EMPTY_CONTACT); }}
          onCreate={handleCreateContact}
        />
      )}

      {/* ADD OPPORTUNITY MODAL */}
      {showAddOppModal && (
        <AddOpportunityModal
          opportunity={newOpp}
          setOpportunity={setNewOpp}
          contacts={contacts}
          onClose={() => { setShowAddOppModal(false); setNewOpp(EMPTY_OPPORTUNITY); }}
          onCreate={handleCreateOpportunity}
        />
      )}

      {/* CONTACT DETAIL MODAL */}
      {showContactDetail && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          opportunities={opportunities.filter(o => o.contactId === selectedContact.id)}
          onClose={() => { setShowContactDetail(false); setSelectedContact(null); }}
          onGenerateThankYou={generateThankYou}
          onGenerateTaxReceipt={generateTaxReceipt}
        />
      )}

      {/* OPPORTUNITY DETAIL MODAL */}
      {showOppDetail && selectedOpp && (
        <OpportunityDetailModal
          opportunity={selectedOpp}
          contact={contacts.find(c => c.id === selectedOpp.contactId)}
          onClose={() => { setShowOppDetail(false); setSelectedOpp(null); }}
          onStageChange={handleStageChange}
        />
      )}
    </div>
  );
};

// Add Contact Modal - COMPREHENSIVE
const AddContactModal = ({ contact, setContact, onClose, onCreate }) => {
  const isFoundation = contact.contactType === 'foundation';
  const isIndividual = contact.contactType === 'individual';
  const isCorporation = contact.contactType === 'corporation';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Add Contact to Database</h2>
            <p className="text-sm text-gray-600">Foundation, Individual, or Corporation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        {/* Contact Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Contact Type *</label>
          <select value={contact.contactType} onChange={(e) => setContact(prev => ({ ...prev, contactType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
            {CONTACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* FOUNDATION FIELDS */}
        {isFoundation && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Foundation Name *</label>
              <input type="text" value={contact.name} onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Knight Foundation" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input type="url" value={contact.website} onChange={(e) => setContact(prev => ({ ...prev, website: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={contact.foundationType} onChange={(e) => setContact(prev => ({ ...prev, foundationType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
                  <option value="private">Private Foundation</option>
                  <option value="family">Family Foundation</option>
                  <option value="community">Community Foundation</option>
                  <option value="corporate">Corporate Foundation</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Focus Areas</label>
              <input type="text" value={contact.focusAreas} onChange={(e) => setContact(prev => ({ ...prev, focusAreas: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Education, STEM, Youth Development" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Typical Grant Range</label>
              <input type="text" value={contact.typicalRange} onChange={(e) => setContact(prev => ({ ...prev, typicalRange: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="$10k - $50k" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Application Process</label>
              <textarea value={contact.applicationProcess} onChange={(e) => setContact(prev => ({ ...prev, applicationProcess: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} placeholder="LOI required, then full proposal by invitation..." />
            </div>
          </>
        )}

        {/* INDIVIDUAL FIELDS */}
        {isIndividual && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input type="text" value={contact.firstName} onChange={(e) => setContact(prev => ({ ...prev, firstName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input type="text" value={contact.lastName} onChange={(e) => setContact(prev => ({ ...prev, lastName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={contact.title} onChange={(e) => setContact(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="CEO, Dr., etc." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employer</label>
                <input type="text" value={contact.employer} onChange={(e) => setContact(prev => ({ ...prev, employer: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </>
        )}

        {/* CORPORATION FIELDS */}
        {isCorporation && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input type="text" value={contact.companyName} onChange={(e) => setContact(prev => ({ ...prev, companyName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input type="text" value={contact.industry} onChange={(e) => setContact(prev => ({ ...prev, industry: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="Technology, Healthcare, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input type="url" value={contact.website} onChange={(e) => setContact(prev => ({ ...prev, website: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </>
        )}

        {/* Shared Contact Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={contact.email} onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={contact.phone} onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mailing Address</label>
          <input type="text" value={contact.address} onChange={(e) => setContact(prev => ({ ...prev, address: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input type="text" value={contact.city} onChange={(e) => setContact(prev => ({ ...prev, city: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input type="text" value={contact.state} onChange={(e) => setContact(prev => ({ ...prev, state: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP</label>
            <input type="text" value={contact.zip} onChange={(e) => setContact(prev => ({ ...prev, zip: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary / Bio</label>
          <textarea value={contact.summary} onChange={(e) => setContact(prev => ({ ...prev, summary: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Background, interests, giving history..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Relationship Notes</label>
          <textarea value={contact.relationshipNotes} onChange={(e) => setContact(prev => ({ ...prev, relationshipNotes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} placeholder="How did we meet? Who knows them?" />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={onCreate} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Add Contact</button>
        </div>
      </div>
    </div>
  );
};

// Add Opportunity Modal - Links to Contact
const AddOpportunityModal = ({ opportunity, setOpportunity, contacts, onClose, onCreate }) => {
  const isGrant = ['foundation_grant', 'corporate_grant', 'government_grant'].includes(opportunity.opportunityType);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Fundraising Opportunity</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        {/* Link to Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">Link to Contact *</label>
          <select value={opportunity.contactId || ''} onChange={(e) => setOpportunity(prev => ({ ...prev, contactId: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select a contact...</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>
                {c.name || c.companyName || `${c.firstName} ${c.lastName}`} ({c.contactType})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Don't see them? Add the contact first, then create the opportunity.</p>
        </div>

        {/* Opportunity Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Opportunity Type *</label>
          <select value={opportunity.opportunityType} onChange={(e) => setOpportunity(prev => ({ ...prev, opportunityType: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
            {OPPORTUNITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Opportunity Name *</label>
          <input type="text" value={opportunity.name} onChange={(e) => setOpportunity(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" placeholder="2024 STEM Grant" />
        </div>

        {/* Grant-Specific Fields */}
        {isGrant && (
          <>
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
          </>
        )}

        {/* Donor-Specific Fields */}
        {!isGrant && (
          <div>
            <label className="block text-sm font-medium mb-1">Ask Date</label>
            <input type="date" value={opportunity.askDate} onChange={(e) => setOpportunity(prev => ({ ...prev, askDate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
          </div>
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
              <option value="restricted">Restricted</option>
              <option value="unrestricted">Unrestricted</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purpose / Use of Funds</label>
          <textarea value={opportunity.purpose} onChange={(e) => setOpportunity(prev => ({ ...prev, purpose: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={opportunity.notes} onChange={(e) => setOpportunity(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={2} />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add Opportunity</button>
        </div>
      </div>
    </div>
  );
};

// Contact Detail Modal
const ContactDetailModal = ({ contact, opportunities, onClose, onGenerateThankYou, onGenerateTaxReceipt }) => {
  const displayName = contact.name || contact.companyName || `${contact.firstName} ${contact.lastName}`;
  const totalGiven = opportunities.reduce((sum, o) => sum + (Number(o.amountReceived) || 0), 0);
  const wonOpps = opportunities.filter(o => o.stage === 'awarded' || o.stage === 'committed' || o.stage === 'stewarded');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <div className="text-sm text-teal-100 capitalize">{contact.contactType}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-teal-500 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            {contact.website && <Field label="Website" value={contact.website} />}
            {contact.email && <Field label="Email" value={contact.email} />}
            {contact.phone && <Field label="Phone" value={contact.phone} />}
            {contact.focusAreas && <Field label="Focus Areas" value={contact.focusAreas} />}
            {contact.typicalRange && <Field label="Typical Range" value={contact.typicalRange} />}
            {contact.employer && <Field label="Employer" value={contact.employer} />}
            {contact.industry && <Field label="Industry" value={contact.industry} />}
            {contact.address && <Field label="Address" value={`${contact.address}, ${contact.city}, ${contact.state} ${contact.zip}`} />}
          </div>

          {contact.summary && (
            <div>
              <div className="text-sm font-medium mb-1">Summary</div>
              <div className="text-sm bg-gray-50 p-3 rounded">{contact.summary}</div>
            </div>
          )}

          {/* Giving History */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Giving History</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">${totalGiven.toLocaleString()}</div>
            <div className="text-sm text-gray-700">{wonOpps.length} gift{wonOpps.length === 1 ? '' : 's'} • {opportunities.length} total opportunit{opportunities.length === 1 ? 'y' : 'ies'}</div>
          </div>

          {/* Opportunities List */}
          {opportunities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">All Opportunities</h3>
              <div className="space-y-2">
                {opportunities.map(opp => {
                  const stage = GRANT_STAGES.find(s => s.id === opp.stage) || DONOR_STAGES.find(s => s.id === opp.stage);
                  return (
                    <div key={opp.id} className="p-3 bg-gray-50 rounded border flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{opp.name}</div>
                        <div className="text-xs text-gray-600">
                          Ask: ${opp.askAmount?.toLocaleString() || '0'} • {stage?.name || opp.stage}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded bg-${stage?.color}-100 text-${stage?.color}-800`}>
                        {stage?.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stewardship Actions - For Individual/Corporate with Gifts */}
          {(contact.contactType === 'individual' || contact.contactType === 'corporation') && wonOpps.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">Donor Stewardship</h3>
              <div className="flex gap-3 mb-3">
                <button onClick={() => onGenerateThankYou(contact)} className="touch-target px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  Generate Thank You Letter
                </button>
                <button onClick={() => onGenerateTaxReceipt(contact)} className="touch-target px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  Generate Tax Receipt
                </button>
              </div>
              <div className="text-xs text-gray-600">
                💙 Keep your donors connected—gratitude strengthens relationships!
              </div>
            </div>
          )}

          {/* Bookkeeping Integration */}
          {wonOpps.length > 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-semibold text-teal-900 mb-2">📊 Bookkeeping Integration</h3>
              <p className="text-sm text-teal-800 mb-3">
                {wonOpps.length} gift{wonOpps.length === 1 ? '' : 's'} ready to sync to your books
              </p>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold">
                Sync to Bookkeeping
              </button>
              <p className="text-xs text-teal-700 mt-2">
                Hank (AI assistant) helps categorize as restricted/unrestricted revenue. Final accounting by your CPA.
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

// Opportunity Detail Modal
const OpportunityDetailModal = ({ opportunity, contact, onClose, onStageChange }) => {
  const isGrant = ['foundation_grant', 'corporate_grant', 'government_grant'].includes(opportunity.opportunityType);
  const stages = isGrant ? GRANT_STAGES : DONOR_STAGES;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{opportunity.name}</h2>
            <div className="text-sm text-primary-100">{contact?.name || contact?.companyName || 'Contact'}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-500 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ask Amount" value={`$${opportunity.askAmount?.toLocaleString() || '0'}`} />
            <Field label="Award Type" value={opportunity.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'} />
          </div>

          {opportunity.purpose && <div><div className="text-sm font-medium mb-1">Purpose</div><div className="text-sm">{opportunity.purpose}</div></div>}

          {/* Stage Movement */}
          <div>
            <h3 className="font-semibold mb-3">Move to Stage</h3>
            <div className="flex flex-wrap gap-2">
              {stages.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onStageChange(opportunity, s.id); onClose(); }}
                  disabled={s.id === opportunity.stage}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold ${s.id === opportunity.stage ? 'bg-gray-200 text-gray-500' : `bg-${s.color}-100 text-${s.color}-700`}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

// Opportunities View
const OpportunitiesView = ({ opportunities, contacts, onViewDetails }) => {
  const grants = opportunities.filter(o => ['foundation_grant', 'corporate_grant', 'government_grant'].includes(o.opportunityType));
  const donors = opportunities.filter(o => ['major_gift', 'annual_gift'].includes(o.opportunityType));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ask</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.map(opp => {
                const contact = contacts.find(c => c.id === opp.contactId);
                return (
                  <tr key={opp.id} onClick={() => onViewDetails(opp)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 font-medium">{opp.name}</td>
                    <td className="px-6 py-4 text-sm">{contact?.name || contact?.companyName || '—'}</td>
                    <td className="px-6 py-4 text-xs"><span className="px-2 py-1 bg-gray-100 rounded">{opp.opportunityType}</span></td>
                    <td className="px-6 py-4 font-bold text-primary-600">${opp.askAmount?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 text-sm">{opp.stage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics View
const AnalyticsView = ({ opportunities, contacts, summary, annualGoal }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
      <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${Math.min((summary.totalReceived / annualGoal) * 100, 100)}%` }} />
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span>${summary.totalReceived?.toLocaleString() || '0'}</span>
        <span>${annualGoal.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

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
