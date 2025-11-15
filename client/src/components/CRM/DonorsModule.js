import React, { useState } from 'react';
import {
  HeartIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

/**
 * Individual & Corporate Donor Management
 * Enterprise-grade donor relationship tracking
 */

export const DonorsModule = ({ donors, onGenerateThankYou, onGenerateTaxReceipt, onAddDonor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonors = donors.filter(d => 
    !searchTerm || 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.organization && d.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Donors & Sponsors</h2>
          <p className="text-sm text-gray-600">Individual and corporate partners 💙</p>
        </div>
        <button
          onClick={onAddDonor}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Donor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search donors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="touch-target w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Donor Table */}
      {filteredDonors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Gifts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDonors.map((donor, idx) => (
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
                      ${donor.totalGiven?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donor.lastGiftDate ? new Date(donor.lastGiftDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {donor.gifts?.length || 0}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => onGenerateThankYou(donor)}
                        className="touch-target px-3 py-1.5 text-xs font-semibold border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50"
                      >
                        Thank You
                      </button>
                      <button
                        onClick={() => onGenerateTaxReceipt(donor)}
                        className="touch-target px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50"
                      >
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
  );
};

export default DonorsModule;

