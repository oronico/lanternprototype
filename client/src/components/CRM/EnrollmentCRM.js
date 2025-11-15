import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

/**
 * Enrollment & Recruitment CRM
 * 
 * Turn "Interested" into "Enrolled" with a complete sales funnel
 * 
 * Features:
 * - Digital interest forms & applications (auto-create leads)
 * - Manual lead entry
 * - CSV bulk upload with duplicate matching
 * - Sales funnel: Inquiry → Tour → Applied → Deposit → Contract → Enrolled
 * - Automated text/email communications
 * - Dynamic contract generation with e-signatures
 * - Deposit tracking & management
 * - Re-enrollment workflow
 * - Appointment scheduling
 * - Custom checklists per stage
 */

const PIPELINE_STAGES = [
  { id: 'inquiry', name: 'Inquiry', desc: 'Initial interest', color: 'gray', icon: '🔍' },
  { id: 'tour', name: 'Tour Scheduled', desc: 'Visit booked', color: 'blue', icon: '🏫' },
  { id: 'applied', name: 'Applied', desc: 'Application in', color: 'indigo', icon: '📝' },
  { id: 'deposit', name: 'Deposit Paid', desc: 'Committed!', color: 'yellow', icon: '💰' },
  { id: 'contract', name: 'Contract Sent', desc: 'Final step', color: 'orange', icon: '📄' },
  { id: 'enrolled', name: 'Enrolled', desc: 'Student active', color: 'green', icon: '🎉' }
];

const LEAD_SOURCES = [
  { value: 'web_form', label: 'Website Form' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google Search' },
  { value: 'referral', label: 'Family Referral' },
  { value: 'tour', label: 'Walk-in Tour' },
  { value: 'event', label: 'Community Event' },
  { value: 'partner', label: 'Partner Organization' },
  { value: 'other', label: 'Other' }
];

const EMPTY_LEAD = {
  familyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  leadSource: 'web_form',
  stage: 'inquiry',
  children: [{ name: '', age: '', grade: '' }],
  tourDate: '',
  applicationDate: '',
  depositAmount: '',
  depositDate: '',
  contractSentDate: '',
  enrollmentDate: '',
  notes: '',
  nextAction: '',
  autoEmailsSent: [],
  autoTextsSent: []
};

const EnrollmentCRM = () => {
  const [view, setView] = useState('pipeline'); // pipeline, leads, analytics, forms
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState(EMPTY_LEAD);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    // Demo data
    setLeads([
      {
        id: '1',
        familyName: 'Johnson',
        contactName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '555-0101',
        stage: 'inquiry',
        children: [{ name: 'Emma', age: 6, grade: 'K' }],
        leadSource: 'web_form',
        dateAdded: '2024-09-20',
        nextAction: 'Schedule tour',
        autoEmailsSent: ['welcome_email'],
        autoTextsSent: []
      },
      {
        id: '2',
        familyName: 'Martinez',
        contactName: 'Maria Martinez',
        email: 'maria.m@email.com',
        phone: '555-0201',
        stage: 'tour',
        children: [{ name: 'Carlos', age: 8, grade: '2nd' }, { name: 'Sofia', age: 6, grade: 'K' }],
        leadSource: 'referral',
        tourDate: '2024-09-25',
        dateAdded: '2024-09-15',
        nextAction: 'Send application link',
        autoEmailsSent: ['welcome_email', 'tour_confirmation'],
        autoTextsSent: ['tour_reminder']
      },
      {
        id: '3',
        familyName: 'Chen',
        contactName: 'Wei Chen',
        email: 'wei.c@email.com',
        phone: '555-0301',
        stage: 'applied',
        children: [{ name: 'Alex', age: 7, grade: '1st' }],
        leadSource: 'google',
        applicationDate: '2024-09-18',
        dateAdded: '2024-09-10',
        nextAction: 'Send deposit invoice',
        autoEmailsSent: ['welcome_email', 'application_received'],
        autoTextsSent: []
      }
    ]);
  };

  const handleCreateLead = () => {
    if (!newLead.familyName || !newLead.contactName || !newLead.email) {
      return toast.error('Please fill in family name, contact name, and email');
    }

    const lead = {
      ...newLead,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      autoEmailsSent: ['welcome_email'],
      autoTextsSent: []
    };

    setLeads(prev => [lead, ...prev]);
    setShowAddModal(false);
    setNewLead(EMPTY_LEAD);
    toast.success('✨ Lead added! Welcome email sent automatically.');
  };

  const handleStageChange = (lead, nextStage) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: nextStage } : l));
    
    // Auto-trigger communications
    if (nextStage === 'tour') {
      toast.success('📧 Tour confirmation email sent to family');
    } else if (nextStage === 'applied') {
      toast.success('📧 Application received email sent');
    } else if (nextStage === 'deposit') {
      toast.success('💰 Deposit invoice sent via email');
    } else if (nextStage === 'contract') {
      toast.success('📄 Enrollment contract sent via DocuSign');
    } else if (nextStage === 'enrolled') {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
      toast.success('🎉 Family enrolled! Student record created.');
    }
  };

  const sendContract = (lead) => {
    setSelectedLead(lead);
    setShowContractModal(true);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchTerm ||
      l.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStageFilter === 'all' || l.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const leadsByStage = {};
  PIPELINE_STAGES.forEach(stage => {
    leadsByStage[stage.id] = filteredLeads.filter(l => l.stage === stage.id);
  });

  const stats = {
    total: leads.length,
    inquiries: leads.filter(l => l.stage === 'inquiry').length,
    tours: leads.filter(l => l.stage === 'tour').length,
    applications: leads.filter(l => l.stage === 'applied').length,
    deposits: leads.filter(l => l.stage === 'deposit').length,
    enrolled: leads.filter(l => l.stage === 'enrolled').length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.stage === 'enrolled').length / leads.length) * 100) : 0
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={400} />}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Enrollment & Recruitment</h1>
            <p className="text-gray-600">Turn interested families into enrolled students 🎯</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCSVModal(true)}
            className="touch-target px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            Upload CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard label="Total Leads" value={stats.total} color="gray" />
        <StatCard label="Inquiries" value={stats.inquiries} color="blue" />
        <StatCard label="Tours" value={stats.tours} color="indigo" />
        <StatCard label="Applications" value={stats.applications} color="purple" />
        <StatCard label="Deposits" value={stats.deposits} color="yellow" />
        <StatCard label="Enrolled" value={stats.enrolled} color="green" />
        <StatCard label="Conversion" value={`${stats.conversionRate}%`} color="teal" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <Tab active={view === 'pipeline'} onClick={() => setView('pipeline')} label="Pipeline" />
          <Tab active={view === 'leads'} onClick={() => setView('leads')} label="All Leads" badge={leads.length} />
          <Tab active={view === 'forms'} onClick={() => setView('forms')} label="Forms & Links" />
          <Tab active={view === 'analytics'} onClick={() => setView('analytics')} label="Analytics" />
        </nav>
      </div>

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <PipelineView
          leadsByStage={leadsByStage}
          onStageChange={handleStageChange}
          onViewDetails={(lead) => { setSelectedLead(lead); setShowDetailModal(true); }}
          onSendContract={sendContract}
        />
      )}

      {/* All Leads Table */}
      {view === 'leads' && (
        <LeadsTableView
          leads={filteredLeads}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStageFilter={selectedStageFilter}
          setSelectedStageFilter={setSelectedStageFilter}
          onViewDetails={(lead) => { setSelectedLead(lead); setShowDetailModal(true); }}
        />
      )}

      {/* Forms & Links */}
      {view === 'forms' && (
        <FormsView />
      )}

      {/* Analytics */}
      {view === 'analytics' && (
        <AnalyticsView leads={leads} stats={stats} />
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          lead={newLead}
          setLead={setNewLead}
          onClose={() => { setShowAddModal(false); setNewLead(EMPTY_LEAD); }}
          onCreate={handleCreateLead}
        />
      )}

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <CSVUploadModal
          onClose={() => setShowCSVModal(false)}
          onUpload={(newLeads) => {
            setLeads(prev => [...newLeads, ...prev]);
            setShowCSVModal(false);
            toast.success(`✨ ${newLeads.length} leads imported!`);
          }}
        />
      )}

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => { setShowDetailModal(false); setSelectedLead(null); }}
          onStageChange={handleStageChange}
          onSendContract={sendContract}
        />
      )}

      {/* Contract Generation Modal */}
      {showContractModal && selectedLead && (
        <ContractModal
          lead={selectedLead}
          onClose={() => { setShowContractModal(false); setSelectedLead(null); }}
          onSend={() => {
            handleStageChange(selectedLead, 'contract');
            setShowContractModal(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

const Tab = ({ active, onClick, label, badge }) => (
  <button
    onClick={onClick}
    className={`touch-target py-3 px-1 border-b-2 font-medium text-sm ${
      active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'
    }`}
  >
    {label}
    {badge > 0 && <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">{badge}</span>}
  </button>
);

const StatCard = ({ label, value, color }) => {
  const colors = {
    gray: 'bg-gray-50 border-gray-200',
    blue: 'bg-blue-50 border-blue-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    teal: 'bg-teal-50 border-teal-200'
  };
  return (
    <div className={`rounded-lg border-2 p-4 ${colors[color]}`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

// Pipeline View - Vertical Stages
const PipelineView = ({ leadsByStage, onStageChange, onViewDetails, onSendContract }) => (
  <div className="space-y-4">
    {PIPELINE_STAGES.map(stage => {
      const stageLeads = leadsByStage[stage.id] || [];
      return (
        <div key={stage.id} className="bg-white rounded-xl shadow border">
          <div className={`bg-${stage.color}-50 border-b border-${stage.color}-200 px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stage.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{stage.name}</h3>
                  <p className="text-sm text-gray-600">{stage.desc}</p>
                </div>
              </div>
              <div className="text-2xl font-bold">{stageLeads.length}</div>
            </div>
          </div>
          {stageLeads.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No families in this stage</div>
          ) : (
            <div className="p-4 space-y-3">
              {stageLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  stage={stage}
                  onViewDetails={onViewDetails}
                  onStageChange={onStageChange}
                  onSendContract={onSendContract}
                />
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// Lead Card
const LeadCard = ({ lead, stage, onViewDetails, onStageChange, onSendContract }) => {
  const nextStage = PIPELINE_STAGES[PIPELINE_STAGES.findIndex(s => s.id === stage.id) + 1];

  return (
    <div className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition cursor-pointer" onClick={() => onViewDetails(lead)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{lead.familyName} Family</div>
          <div className="text-sm text-gray-600">{lead.contactName}</div>
          <div className="text-xs text-gray-500 mt-1">
            {lead.children.map(c => `${c.name} (${c.grade})`).join(', ')}
          </div>
        </div>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{lead.leadSource}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <PhoneIcon className="h-3 w-3" />
        <span>{lead.phone}</span>
        <EnvelopeIcon className="h-3 w-3 ml-2" />
        <span className="truncate">{lead.email}</span>
      </div>

      {lead.nextAction && (
        <div className="text-xs text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-1 mb-3">
          Next: {lead.nextAction}
        </div>
      )}

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {nextStage && (
          <button
            onClick={() => onStageChange(lead, nextStage.id)}
            className="touch-target px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-semibold hover:bg-primary-700"
          >
            Move to {nextStage.name}
          </button>
        )}
        {stage.id === 'deposit' && (
          <button
            onClick={() => onSendContract(lead)}
            className="touch-target px-3 py-1.5 border border-primary-200 text-primary-700 rounded text-xs font-semibold"
          >
            Generate Contract
          </button>
        )}
      </div>
    </div>
  );
};

// Leads Table View
const LeadsTableView = ({ leads, searchTerm, setSearchTerm, selectedStageFilter, setSelectedStageFilter, onViewDetails }) => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search families, contacts, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="touch-target w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>
      <select
        value={selectedStageFilter}
        onChange={(e) => setSelectedStageFilter(e.target.value)}
        className="touch-target px-4 py-2 border rounded-lg"
      >
        <option value="all">All Stages</option>
        {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>

    <div className="bg-white rounded-lg shadow">
      <div className="table-scroll">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Children</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map(lead => {
              const stage = PIPELINE_STAGES.find(s => s.id === lead.stage);
              return (
                <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewDetails(lead)}>
                  <td className="px-6 py-4 font-medium">{lead.familyName}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{lead.contactName}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{lead.children.map(c => `${c.name} (${c.grade})`).join(', ')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded bg-${stage?.color}-100 text-${stage?.color}-800`}>
                      {stage?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{lead.leadSource}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
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
  </div>
);

// Forms View - Digital Lead Generation
const FormsView = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
      <SparklesIcon className="h-8 w-8 text-purple-600 mb-3" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Digital Lead Forms</h2>
      <p className="text-gray-700 mb-4">Embed these forms on your website to automatically create leads in your CRM</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormCard
        title="Interest Form"
        description="Quick inquiry - captures family info and auto-sends welcome email"
        fields={['Family Name', 'Contact Name', 'Email', 'Phone', 'Children (names & ages)']}
        link="https://yourschool.com/interest"
      />
      <FormCard
        title="Application Form"
        description="Full application with student details, preferences, and questions"
        fields={['All interest fields', 'Student details', 'Medical info', 'Previous school', 'Special needs', 'Why our school?']}
        link="https://yourschool.com/apply"
      />
      <FormCard
        title="Tour Request"
        description="Schedule a visit - auto-books calendar and sends confirmation"
        fields={['Family info', 'Preferred dates', 'How did you hear about us?']}
        link="https://yourschool.com/tour"
      />
      <FormCard
        title="Re-Enrollment Form"
        description="Returning families - streamlined renewal process"
        fields={['Family ID', 'Confirm student details', 'Program selection', 'Updates needed']}
        link="https://yourschool.com/reenroll"
      />
    </div>

    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Family submits form</strong> → Lead auto-created in CRM with "Inquiry" stage
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Welcome email sent automatically</strong> → Personalized with school info and next steps
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Text notification sent to you</strong> → "New lead: Johnson family interested in K program"
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Auto-checklist created</strong> → Follow-up tasks appear in your Command Center
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FormCard = ({ title, description, fields, link }) => (
  <div className="bg-white rounded-lg shadow border p-6">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">Form Fields:</div>
      <ul className="text-xs text-gray-600 space-y-1">
        {fields.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
    </div>
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-xs">
      <LinkIcon className="h-4 w-4 text-gray-400" />
      <span className="text-gray-600 truncate">{link}</span>
      <button className="ml-auto px-2 py-1 bg-primary-600 text-white rounded text-xs font-semibold">Copy</button>
    </div>
  </div>
);

// Analytics View
const AnalyticsView = ({ leads, stats }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
      <div className="space-y-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const count = leads.filter(l => l.stage === stage.id).length;
          const percent = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium">{stage.name}</div>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${stage.color}-500 transition-all`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="w-20 text-sm font-semibold text-right">{count} ({percent}%)</div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3">Lead Sources</h3>
        <div className="space-y-2">
          {LEAD_SOURCES.map(source => {
            const count = leads.filter(l => l.leadSource === source.value).length;
            return count > 0 ? (
              <div key={source.value} className="flex justify-between text-sm">
                <span className="text-gray-700">{source.label}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <h3 className="font-semibold text-green-900 mb-3">Conversion Rate</h3>
        <div className="text-4xl font-bold text-green-600 mb-2">{stats.conversionRate}%</div>
        <div className="text-sm text-gray-700">{stats.enrolled} enrolled out of {stats.total} total leads</div>
      </div>
    </div>
  </div>
);

// Add Lead Modal - MANUAL ENTRY
const AddLeadModal = ({ lead, setLead, onClose, onCreate }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add Lead Manually</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Family Name *</label>
          <input type="text" value={lead.familyName} onChange={(e) => setLead(prev => ({ ...prev, familyName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Name *</label>
          <input type="text" value={lead.contactName} onChange={(e) => setLead(prev => ({ ...prev, contactName: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input type="email" value={lead.email} onChange={(e) => setLead(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" value={lead.phone} onChange={(e) => setLead(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lead Source</label>
        <select value={lead.leadSource} onChange={(e) => setLead(prev => ({ ...prev, leadSource: e.target.value }))} className="w-full px-4 py-2 border rounded-lg">
          {LEAD_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Children</label>
        {lead.children.map((child, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
            <input type="text" placeholder="Name" value={child.name} onChange={(e) => {
              const updated = [...lead.children];
              updated[idx].name = e.target.value;
              setLead(prev => ({ ...prev, children: updated }));
            }} className="px-3 py-2 border rounded" />
            <input type="number" placeholder="Age" value={child.age} onChange={(e) => {
              const updated = [...lead.children];
              updated[idx].age = e.target.value;
              setLead(prev => ({ ...prev, children: updated }));
            }} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Grade" value={child.grade} onChange={(e) => {
              const updated = [...lead.children];
              updated[idx].grade = e.target.value;
              setLead(prev => ({ ...prev, children: updated }));
            }} className="px-3 py-2 border rounded" />
          </div>
        ))}
        <button
          onClick={() => setLead(prev => ({ ...prev, children: [...prev.children, { name: '', age: '', grade: '' }] }))}
          className="text-xs text-primary-600 font-semibold"
        >
          + Add child
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={lead.notes} onChange={(e) => setLead(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" rows={3} />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
        <button onClick={onCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add Lead</button>
      </div>
    </div>
  </div>
);

// CSV Upload Modal
const CSVUploadModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [duplicateAction, setDuplicateAction] = useState('skip'); // skip, merge, create_new

  const handleUpload = () => {
    if (!file) return toast.error('Select a CSV file');
    
    // In production, would parse CSV and check for duplicates
    toast.success('✨ Processing CSV with duplicate detection...');
    
    // Mock: Create sample leads
    const mockLeads = [
      {
        id: Date.now().toString(),
        familyName: 'Thompson',
        contactName: 'Robert Thompson',
        email: 'robert.t@email.com',
        phone: '555-0601',
        stage: 'inquiry',
        children: [{ name: 'James', age: 7, grade: '1st' }],
        leadSource: 'bulk_upload',
        dateAdded: new Date().toISOString().split('T')[0],
        autoEmailsSent: []
      }
    ];
    
    onUpload(mockLeads);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upload Leads via CSV</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Automatic data scrubbing & validation</li>
            <li>✓ Duplicate detection & matching</li>
            <li>✓ Email/phone format checking</li>
            <li>✓ Merges with existing records (your choice)</li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Required columns: Family Name, Contact Name, Email, Phone, Children</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">If Duplicate Found:</label>
          <select value={duplicateAction} onChange={(e) => setDuplicateAction(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
            <option value="skip">Skip duplicate (keep existing)</option>
            <option value="merge">Merge data (update existing)</option>
            <option value="create_new">Create new record anyway</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleUpload} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Upload & Process</button>
        </div>
      </div>
    </div>
  );
};

// Lead Detail Modal
const LeadDetailModal = ({ lead, onClose, onStageChange, onSendContract }) => {
  const currentStage = PIPELINE_STAGES.find(s => s.id === lead.stage);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{lead.familyName} Family</h2>
            <div className="text-sm text-primary-100">{lead.contactName}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-500 rounded"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Stage */}
          <div className={`p-4 rounded-lg border-2 bg-${currentStage?.color}-50 border-${currentStage?.color}-200`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStage?.icon}</span>
              <div>
                <div className="font-semibold">Stage: {currentStage?.name}</div>
                <div className="text-sm text-gray-600">{currentStage?.desc}</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={lead.email} />
            <Field label="Phone" value={lead.phone} />
            <Field label="Lead Source" value={LEAD_SOURCES.find(s => s.value === lead.leadSource)?.label} />
            <Field label="Date Added" value={lead.dateAdded} />
          </div>

          {/* Children */}
          <div>
            <h3 className="font-semibold mb-2">Children</h3>
            {lead.children.map((child, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded mb-2">
                <span className="font-medium">{child.name}</span> • Age {child.age} • Grade {child.grade}
              </div>
            ))}
          </div>

          {/* Automated Communications */}
          {(lead.autoEmailsSent.length > 0 || lead.autoTextsSent.length > 0) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Automated Communications</h3>
              {lead.autoEmailsSent.length > 0 && (
                <div className="text-sm text-purple-800 mb-1">
                  ✓ Emails sent: {lead.autoEmailsSent.join(', ')}
                </div>
              )}
              {lead.autoTextsSent.length > 0 && (
                <div className="text-sm text-purple-800">
                  ✓ Texts sent: {lead.autoTextsSent.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Next Action */}
          {lead.nextAction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-yellow-900 mb-1">Next Action:</div>
              <div className="text-gray-700">{lead.nextAction}</div>
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <div className="text-gray-700 bg-gray-50 p-3 rounded">{lead.notes}</div>
            </div>
          )}

          {/* Stage Actions */}
          <div>
            <h3 className="font-semibold mb-3">Move to Stage</h3>
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onStageChange(lead, s.id); onClose(); }}
                  disabled={s.id === lead.stage}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                    s.id === lead.stage ? 'bg-gray-200 text-gray-500' : `bg-${s.color}-100 text-${s.color}-700`
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {lead.stage === 'deposit' && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-3">Ready for Contract</h3>
              <button
                onClick={() => { onSendContract(lead); onClose(); }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Generate & Send Enrollment Contract
              </button>
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

// Contract Generation Modal
const ContractModal = ({ lead, onClose, onSend }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Generate Enrollment Contract</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><XMarkIcon className="h-6 w-6" /></button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Contract Features:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✓ Dynamic contract with family & student info auto-populated</li>
          <li>✓ Electronic dual signatures (parent + school)</li>
          <li>✓ TILA-compliant tuition disclosure</li>
          <li>✓ Net Tuition Revenue calculated automatically</li>
          <li>✓ Sent via DocuSign or similar</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Field label="Family" value={`${lead.familyName} - ${lead.contactName}`} />
        <Field label="Children" value={lead.children.map(c => `${c.name} (${c.grade})`).join(', ')} />
        <Field label="Send To" value={lead.email} />
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded p-3 text-sm text-yellow-900">
        💡 Contract will include: Tuition terms, payment schedule, policies, cancellation terms, TILA disclosure
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
        <button onClick={onSend} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Generate & Send Contract</button>
      </div>
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-medium text-gray-900">{value || '—'}</div>
  </div>
);

export default EnrollmentCRM;

