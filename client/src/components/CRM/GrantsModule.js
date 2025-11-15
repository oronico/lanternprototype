import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Grant Management Module
 * Enterprise-grade grant pipeline tracking
 */

const GRANT_STAGES = [
  { id: 'research', name: 'Research', description: 'Identifying & eligibility', color: 'gray' },
  { id: 'loi', name: 'LOI', description: 'Letter of Intent phase', color: 'blue' },
  { id: 'invited', name: 'Invited', description: 'Full proposal invited', color: 'indigo' },
  { id: 'drafting', name: 'Drafting', description: 'Writing application', color: 'purple' },
  { id: 'submitted', name: 'Submitted', description: 'Under review', color: 'yellow' },
  { id: 'awarded', name: 'Awarded', description: 'Grant won!', color: 'green' },
  { id: 'declined', name: 'Declined', description: 'Not funded', color: 'red' },
  { id: 'reporting', name: 'Reporting', description: 'Compliance & reports', color: 'teal' }
];

export const GrantsModule = ({ grants, onAddGrant, onUpdateGrant, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');

  const filteredGrants = grants.filter(g => {
    const matchesSearch = !searchTerm || 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.funderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || g.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const grantsByStage = {};
  GRANT_STAGES.forEach(stage => {
    grantsByStage[stage.id] = filteredGrants.filter(g => g.stage === stage.id);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Grant Pipeline</h2>
          <p className="text-sm text-gray-600">Foundation, corporate, and government grants</p>
        </div>
        <button
          onClick={onAddGrant}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Grant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search grants or funders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="touch-target w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="touch-target px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Stages</option>
          {GRANT_STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Pipeline Stages - Vertical Layout */}
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
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{stageGrants.length}</div>
                    <div className="text-xs text-gray-600">${total.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {stageGrants.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No grants in this stage</div>
              ) : (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageGrants.map(grant => (
                    <GrantCard key={grant.id} grant={grant} onViewDetails={onViewDetails} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GrantCard = ({ grant, onViewDetails }) => {
  const daysUntilDeadline = grant.proposalDueDate ? 
    Math.ceil((new Date(grant.proposalDueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0;

  return (
    <div
      onClick={() => onViewDetails(grant)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition"
    >
      <div className="font-semibold text-gray-900 text-sm mb-1">{grant.name}</div>
      <div className="text-xs text-gray-600 mb-3">{grant.funderName}</div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-primary-600">${grant.askAmount?.toLocaleString() || '0'}</span>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
          grant.awardType === 'unrestricted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {grant.awardType === 'unrestricted' ? 'Unrestricted' : 'Restricted'}
        </span>
      </div>

      {grant.proposalDueDate && (
        <div className={`flex items-center gap-1 text-xs ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          <ClockIcon className="h-3 w-3" />
          {daysUntilDeadline >= 0 ? `${daysUntilDeadline} days` : 'Overdue'}
        </div>
      )}
    </div>
  );
};

export default GrantsModule;

