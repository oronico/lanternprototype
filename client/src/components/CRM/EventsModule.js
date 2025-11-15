import React, { useState } from 'react';
import {
  GiftIcon,
  PlusIcon,
  CalendarIcon,
  UserGroupIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

/**
 * Events & Campaigns Module
 * Track fundraising events, galas, auctions, campaigns
 */

export const EventsModule = ({ events, onAddEvent }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events & Campaigns</h2>
          <p className="text-sm text-gray-600">Galas, auctions, annual campaigns</p>
        </div>
        <button
          onClick={onAddEvent}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <GiftIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No events yet. Plan your first fundraiser!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {event.eventDate}
                  </div>
                </div>
                <GiftIcon className="h-6 w-6 text-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600">Goal</div>
                  <div className="font-bold text-gray-900">${event.goal?.toLocaleString() || '0'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Raised</div>
                  <div className="font-bold text-green-600">${event.raised?.toLocaleString() || '0'}</div>
                </div>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${Math.min((event.raised / event.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsModule;

