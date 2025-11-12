import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Clean Recruitment Pipeline - Stacked Row View
 * 
 * Easy to scan, easy to track
 * Shows all families in clean rows organized by stage
 * 
 * Pipeline: Lead → Interested → Application → Deposit → Contract → Enrolled
 */

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'gray' },
  { id: 'interested', name: 'Interested', color: 'blue' },
  { id: 'application', name: 'Application', color: 'purple' },
  { id: 'deposit', name: 'Deposit Paid', color: 'yellow' },
  { id: 'contract', name: 'Contract Sent', color: 'orange' },
  { id: 'enrolled', name: 'Enrolled', color: 'green' }
];

export default function CleanRecruitmentPipeline() {
  const [families, setFamilies] = useState([]);
  const [selectedStage, setSelectedStage] = useState('all');

  useEffect(() => {
    analytics.trackPageView('clean-recruitment-pipeline');
    loadFamilies();
  }, []);

  const loadFamilies = () => {
    setFamilies([
      {
        id: 1,
        familyName: 'Johnson',
        stage: 'lead',
        contactName: 'Sarah Johnson',
        phone: '555-0101',
        email: 'sarah.j@email.com',
        children: ['Emma (K)'],
        dateAdded: '2024-09-20',
        nextAction: 'Schedule tour',
        leadSource: 'Facebook Ad'
      },
      {
        id: 2,
        familyName: 'Martinez',
        stage: 'interested',
        contactName: 'Maria Martinez',
        phone: '555-0201',
        email: 'maria.m@email.com',
        children: ['Carlos (2nd)', 'Sofia (K)'],
        dateAdded: '2024-09-15',
        nextAction: 'Follow up on application',
        leadSource: 'Referral'
      },
      {
        id: 3,
        familyName: 'Chen',
        stage: 'application',
        contactName: 'Wei Chen',
        phone: '555-0301',
        email: 'wei.c@email.com',
        children: ['Alex (1st)'],
        dateAdded: '2024-09-10',
        nextAction: 'Send deposit invoice',
        leadSource: 'Website'
      },
      {
        id: 4,
        familyName: 'Williams',
        stage: 'deposit',
        contactName: 'Lisa Williams',
        phone: '555-0402',
        email: 'lisa.w@email.com',
        children: ['Noah (2nd)'],
        dateAdded: '2024-09-01',
        nextAction: 'Send enrollment contract',
        leadSource: 'School Tour'
      },
      {
        id: 5,
        familyName: 'Brown',
        stage: 'contract',
        contactName: 'Amanda Brown',
        phone: '555-0501',
        email: 'amanda.b@email.com',
        children: ['Olivia (K)', 'Ethan (Pre-K)'],
        dateAdded: '2024-08-28',
        nextAction: 'Follow up on contract signature',
        leadSource: 'Friend Referral'
      }
    ]);
  };

  const filteredFamilies = selectedStage === 'all' 
    ? families 
    : families.filter(f => f.stage === selectedStage);

  const getStageColor = (stageId) => {
    const colors = {
      lead: 'bg-gray-100 text-gray-800 border-gray-300',
      interested: 'bg-blue-100 text-blue-800 border-blue-300',
      application: 'bg-purple-100 text-purple-800 border-purple-300',
      deposit: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      contract: 'bg-orange-100 text-orange-800 border-orange-300',
      enrolled: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[stageId] || colors.lead;
  };

  const updateStage = (familyId, newStage) => {
    const family = families.find(f => f.id === familyId);
    const stageName = STAGES.find(s => s.id === newStage)?.name;
    
    setFamilies(prev => prev.map(f => 
      f.id === familyId ? { ...f, stage: newStage } : f
    ));
    
    toast.success(`${family.familyName} moved to ${stageName}!`);
    
    analytics.trackFeatureUsage('recruitmentPipeline', 'change_stage', {
      from: family.stage,
      to: newStage
    });
  };

  const getCountByStage = (stageId) => {
    return families.filter(f => f.stage === stageId).length;
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
              <p className="text-gray-600">{families.length} families in process</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Family
          </button>
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            selectedStage === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({families.length})
        </button>
        
        {STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedStage === stage.id
                ? getStageColor(stage.id).replace('bg-', 'bg-').replace('100', '600').replace('text-', 'text-white')
                : getStageColor(stage.id)
            }`}
          >
            {stage.name} ({getCountByStage(stage.id)})
          </button>
        ))}
      </div>

      {/* Family Rows - Clean & Scannable */}
      <div className="space-y-3">
        {filteredFamilies.map(family => {
          const stageName = STAGES.find(s => s.id === family.stage)?.name;
          const isLast = family.stage === 'enrolled';
          
          return (
            <div 
              key={family.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  {/* Left: Family Info */}
                  <div className="flex-1 grid grid-cols-4 gap-6">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{family.familyName} Family</div>
                      <div className="text-sm text-gray-600">{family.children.join(', ')}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Contact</div>
                      <div className="text-sm font-medium text-gray-900">{family.contactName}</div>
                      <div className="text-xs text-gray-600">{family.phone}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Stage</div>
                      <select
                        value={family.stage}
                        onChange={(e) => updateStage(family.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-2 focus:ring-2 focus:ring-primary-500 ${
                          family.stage === 'enrolled' ? 'bg-green-50 border-green-500 text-green-800' :
                          family.stage === 'contract' ? 'bg-orange-50 border-orange-500 text-orange-800' :
                          family.stage === 'deposit' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                          family.stage === 'application' ? 'bg-purple-50 border-purple-500 text-purple-800' :
                          family.stage === 'interested' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                          'bg-gray-50 border-gray-500 text-gray-800'
                        }`}
                      >
                        {STAGES.map(stage => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Next Action</div>
                      <div className="text-sm font-medium text-gray-900">{family.nextAction}</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 ml-6">
                    <button
                      onClick={() => window.location.href = `tel:${family.phone}`}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
                      title={`Call ${family.phone}`}
                    >
                      <PhoneIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </button>
                    
                    <button
                      onClick={() => window.location.href = `mailto:${family.email}`}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-colors"
                      title={`Email ${family.email}`}
                    >
                      <EnvelopeIcon className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                    </button>
                    
                    <button
                      onClick={() => {
                        toast.success(`Opening text to ${family.phone}...`);
                        // In production: window.location.href = `sms:${family.phone}`;
                      }}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors"
                      title="Send text"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600 hover:text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFamilies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No families in this stage</h3>
          <p className="text-gray-600">Families will appear here as they progress through your pipeline.</p>
        </div>
      )}
    </div>
  );
}

