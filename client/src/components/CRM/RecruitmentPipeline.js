import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

/**
 * Recruitment Pipeline - Sales-style funnel for family recruitment
 * 
 * Pipeline Stages:
 * 1. Lead - Initial contact
 * 2. Interested - Engaged and learning more
 * 3. Application Submitted - Formal application received
 * 4. Deposit Paid - Committed with deposit
 * 5. Contract Sent - Enrollment agreement sent
 * 6. Enrolled - Fully enrolled (contract signed)
 */

const PIPELINE_STAGES = [
  { id: 'lead', name: 'Lead', color: 'gray', description: 'Initial contact' },
  { id: 'interested', name: 'Interested', color: 'blue', description: 'Engaged families' },
  { id: 'application', name: 'Application', color: 'purple', description: 'Application submitted' },
  { id: 'deposit', name: 'Deposit Paid', color: 'yellow', description: 'Deposit received' },
  { id: 'contract', name: 'Contract Sent', color: 'orange', description: 'Agreement sent' },
  { id: 'enrolled', name: 'Enrolled', color: 'green', description: 'Fully enrolled!' }
];

const COMMUNICATION_PREFERENCES = [
  { value: 'text', label: 'Text Message', icon: ChatBubbleLeftRightIcon },
  { value: 'email', label: 'Email', icon: EnvelopeIcon },
  { value: 'phone', label: 'Phone Call', icon: PhoneIcon },
  { value: 'any', label: 'Any Method', icon: UserGroupIcon }
];

export default function RecruitmentPipeline() {
  const emit = useEventEmit();
  const [families, setFamilies] = useState([]);
  const [selectedStage, setSelectedStage] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  useEffect(() => {
    analytics.trackPageView('recruitment-pipeline');
    loadDemoFamilies();
  }, []);

  const loadDemoFamilies = () => {
    const demoFamilies = [
      {
        id: 1,
        familyName: 'Johnson',
        stage: 'lead',
        dateAdded: '2024-09-20',
        lastContact: '2024-09-20',
        guardians: [
          { name: 'Sarah Johnson', phone: '555-0101', email: 'sarah@email.com', relation: 'Mother' },
          { name: 'Mike Johnson', phone: '555-0102', email: 'mike@email.com', relation: 'Father' }
        ],
        children: [
          { name: 'Emma Johnson', dob: '2018-03-15', gradeFor2025: 'K', currentSchool: 'Sunshine Preschool' }
        ],
        address: '123 Main St, Sunshine, FL 33xxx',
        communicationPreference: 'text',
        leadSource: 'Facebook Ad',
        notes: 'Very interested in nature-based learning. Mom works from home.',
        nextAction: 'Schedule tour',
        nextActionDate: '2024-09-25'
      },
      {
        id: 2,
        familyName: 'Martinez',
        stage: 'interested',
        dateAdded: '2024-09-15',
        lastContact: '2024-09-22',
        guardians: [
          { name: 'Maria Martinez', phone: '555-0201', email: 'maria@email.com', relation: 'Mother' }
        ],
        children: [
          { name: 'Carlos Martinez', dob: '2016-08-22', gradeFor2025: '2nd', currentSchool: 'Public Elementary' },
          { name: 'Sofia Martinez', dob: '2019-01-10', gradeFor2025: 'K', currentSchool: 'None' }
        ],
        address: '456 Oak Ave, Sunshine, FL 33xxx',
        communicationPreference: 'email',
        leadSource: 'Referral - Smith Family',
        notes: 'Single mom, looking for bilingual education. Two siblings.',
        nextAction: 'Follow up on application',
        nextActionDate: '2024-09-24'
      },
      {
        id: 3,
        familyName: 'Chen',
        stage: 'application',
        dateAdded: '2024-09-10',
        lastContact: '2024-09-21',
        guardians: [
          { name: 'Wei Chen', phone: '555-0301', email: 'wei@email.com', relation: 'Father' },
          { name: 'Lin Chen', phone: '555-0302', email: 'lin@email.com', relation: 'Mother' }
        ],
        children: [
          { name: 'Alex Chen', dob: '2017-05-30', gradeFor2025: '1st', currentSchool: 'Montessori Academy' }
        ],
        address: '789 Elm St, Sunshine, FL 33xxx',
        communicationPreference: 'email',
        leadSource: 'Website Inquiry',
        notes: 'Application submitted 9/20. Need to send deposit invoice.',
        nextAction: 'Send deposit invoice',
        nextActionDate: '2024-09-23'
      },
      {
        id: 4,
        familyName: 'Williams',
        stage: 'deposit',
        dateAdded: '2024-09-01',
        lastContact: '2024-09-22',
        guardians: [
          { name: 'James Williams', phone: '555-0401', email: 'james@email.com', relation: 'Father' },
          { name: 'Lisa Williams', phone: '555-0402', email: 'lisa@email.com', relation: 'Mother' }
        ],
        children: [
          { name: 'Noah Williams', dob: '2016-12-12', gradeFor2025: '2nd', currentSchool: 'Highland Elementary' }
        ],
        address: '321 Pine Rd, Sunshine, FL 33xxx',
        communicationPreference: 'text',
        leadSource: 'School Tour',
        notes: 'Deposit paid $500. Ready for contract. Wants to start mid-year if possible.',
        nextAction: 'Send enrollment contract',
        nextActionDate: '2024-09-23'
      },
      {
        id: 5,
        familyName: 'Brown',
        stage: 'contract',
        dateAdded: '2024-08-28',
        lastContact: '2024-09-21',
        guardians: [
          { name: 'Amanda Brown', phone: '555-0501', email: 'amanda@email.com', relation: 'Mother' }
        ],
        children: [
          { name: 'Olivia Brown', dob: '2018-07-18', gradeFor2025: 'K', currentSchool: 'Homeschool' },
          { name: 'Ethan Brown', dob: '2020-03-25', gradeFor2025: 'Pre-K', currentSchool: 'None' }
        ],
        address: '654 Maple Dr, Sunshine, FL 33xxx',
        communicationPreference: 'text',
        leadSource: 'Friend Referral',
        notes: 'Contract sent 9/18. Single mom, two siblings. Waiting for signature.',
        nextAction: 'Follow up on contract',
        nextActionDate: '2024-09-24'
      }
    ];

    setFamilies(demoFamilies);
  };

  const getStageCount = (stageId) => {
    return families.filter(f => f.stage === stageId).length;
  };

  const getTotalCount = () => {
    return families.length;
  };

  const getConversionRate = () => {
    const enrolled = families.filter(f => f.stage === 'enrolled').length;
    const total = families.length;
    return total > 0 ? Math.round((enrolled / total) * 100) : 0;
  };

  const filteredFamilies = selectedStage === 'all' 
    ? families 
    : families.filter(f => f.stage === selectedStage);

  const moveFamilyToStage = (familyId, newStage) => {
    setFamilies(prev => prev.map(f => 
      f.id === familyId ? { ...f, stage: newStage } : f
    ));

    analytics.trackFeatureUsage('recruitmentPipeline', 'move_stage', {
      toStage: newStage
    });

    toast.success(`Family moved to ${PIPELINE_STAGES.find(s => s.id === newStage).name}!`);

    // If moved to enrolled, emit event
    if (newStage === 'enrolled') {
      const family = families.find(f => f.id === familyId);
      emit('family.enrolled', family);
    }
  };

  const sendText = (family) => {
    setSelectedFamily(family);
    setShowTextModal(true);
    
    analytics.trackFeatureUsage('recruitmentPipeline', 'send_text', {
      stage: family.stage
    });
  };

  const sendBatchText = () => {
    const filteredCount = filteredFamilies.length;
    
    analytics.trackFeatureUsage('recruitmentPipeline', 'send_batch_text', {
      count: filteredCount,
      stage: selectedStage
    });

    toast.success(`Text sent to ${filteredCount} families!`);
  };

  const getStageColor = (stageId) => {
    const stage = PIPELINE_STAGES.find(s => s.id === stageId);
    return stage?.color || 'gray';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruitment Pipeline</h1>
              <p className="text-gray-600">Track families from first contact to enrollment</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={sendBatchText}
              className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center gap-2"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Text All ({filteredFamilies.length})
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Family
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Families</div>
          <div className="text-3xl font-bold text-gray-900">{getTotalCount()}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Active Leads</div>
          <div className="text-3xl font-bold text-blue-600">
            {getStageCount('lead') + getStageCount('interested')}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">In Process</div>
          <div className="text-3xl font-bold text-orange-600">
            {getStageCount('application') + getStageCount('deposit') + getStageCount('contract')}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Enrolled</div>
          <div className="text-3xl font-bold text-green-600">
            {getStageCount('enrolled')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getConversionRate()}% conversion
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-4">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStage === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({getTotalCount()})
          </button>
          
          {PIPELINE_STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStage === stage.id
                  ? `bg-${stage.color}-600 text-white`
                  : `bg-${stage.color}-100 text-${stage.color}-700 hover:bg-${stage.color}-200`
              }`}
              style={selectedStage === stage.id ? {
                backgroundColor: getComputedColor(stage.color, 600)
              } : {
                backgroundColor: getComputedColor(stage.color, 100),
                color: getComputedColor(stage.color, 700)
              }}
            >
              {stage.name} ({getStageCount(stage.id)})
            </button>
          ))}
        </div>
      </div>

      {/* Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.map(family => {
          const stage = PIPELINE_STAGES.find(s => s.id === family.stage);
          const primaryGuardian = family.guardians[0];
          
          return (
            <div key={family.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Stage Header */}
              <div 
                className={`px-4 py-2 rounded-t-lg text-white font-medium text-sm`}
                style={{ backgroundColor: getComputedColor(stage.color, 600) }}
              >
                {stage.name}
              </div>

              {/* Family Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {family.familyName} Family
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedFamily(family);
                      setShowDetailModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Children */}
                <div className="mb-3 space-y-1">
                  {family.children.map((child, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-gray-900">{child.name}</span>
                      <span className="text-gray-600"> • {child.gradeFor2025} grade</span>
                    </div>
                  ))}
                </div>

                {/* Primary Contact */}
                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{primaryGuardian.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{primaryGuardian.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="truncate">{primaryGuardian.email}</span>
                  </div>
                </div>

                {/* Next Action */}
                {family.nextAction && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <div className="font-medium text-yellow-900">Next: {family.nextAction}</div>
                    <div className="text-yellow-700 text-xs">{family.nextActionDate}</div>
                  </div>
                )}

                {/* Lead Source */}
                <div className="mb-3 text-xs text-gray-500">
                  Source: {family.leadSource}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => sendText(family)}
                    className="flex-1 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    Text
                  </button>
                  
                  {family.stage !== 'enrolled' && (
                    <button
                      onClick={() => {
                        const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === family.stage);
                        const nextStage = PIPELINE_STAGES[currentIndex + 1];
                        if (nextStage) {
                          moveFamilyToStage(family.id, nextStage.id);
                        }
                      }}
                      className="flex-1 py-2 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 flex items-center justify-center gap-1"
                    >
                      Move Forward
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  {family.stage === 'enrolled' && (
                    <button className="flex-1 py-2 bg-green-600 text-white rounded text-sm font-medium flex items-center justify-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Enrolled!
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFamilies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No families in this stage</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedStage === 'all' 
              ? 'Add your first family to get started!'
              : 'Families will appear here as they move through your pipeline.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Family
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get computed color values
function getComputedColor(color, shade) {
  const colors = {
    gray: { 100: '#f3f4f6', 600: '#4b5563', 700: '#374151' },
    blue: { 100: '#dbeafe', 600: '#2563eb', 700: '#1d4ed8' },
    purple: { 100: '#e9d5ff', 600: '#9333ea', 700: '#7e22ce' },
    yellow: { 100: '#fef3c7', 600: '#ca8a04', 700: '#a16207' },
    orange: { 100: '#ffedd5', 600: '#ea580c', 700: '#c2410c' },
    green: { 100: '#dcfce7', 600: '#16a34a', 700: '#15803d' }
  };
  
  return colors[color]?.[shade] || colors.gray[shade];
}

