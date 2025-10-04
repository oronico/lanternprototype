import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const Header = ({ user, onLogout }) => {

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-soft">
      
      <div className="flex-1 px-6 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <div className="flex items-center space-x-3 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
            <div className="animate-pulse-slow w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-green-700">
              All systems synced
            </span>
            <span className="text-xs text-green-600">• 2 min ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full"></span>
          </button>

          {/* Profile dropdown */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.schoolName}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-soft">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
