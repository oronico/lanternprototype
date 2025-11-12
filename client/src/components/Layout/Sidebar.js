import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  BellIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  UsersIcon,
  DocumentTextIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

/**
 * Clean, hierarchical navigation structure
 * Reduced from 20+ items to 6 main categories
 */

const navigationGroups = [
  {
    id: 'home',
    name: 'Home',
    icon: HomeIcon,
    href: '/dashboard',
    color: 'primary'
  },
  {
    id: 'today',
    name: 'Today',
    icon: BellIcon,
    href: '/back-office',
    badge: '3',
    color: 'purple',
    subItems: [
      { name: 'Command Center', href: '/back-office' },
      { name: 'Daily Attendance', href: '/attendance/daily', badge: 'New' },
      { name: 'Gamified Nudges', href: '/nudges/gamified', badge: 'New' },
      { name: 'Daily Guidance', href: '/nudges' },
      { name: 'Your Milestones', href: '/milestones' }
    ]
  },
  {
    id: 'money',
    name: 'Money',
    icon: BanknotesIcon,
    href: '/cash-reality',
    color: 'green',
    subItems: [
      { name: 'Cash Flow', href: '/cash-reality' },
      { name: 'Budget vs. Cash', href: '/budget-vs-cash' },
      { name: 'Payments', href: '/payments' },
      { name: 'Payment Engines', href: '/payments/engines', badge: 'New' },
      { name: 'Payment Reconciliation', href: '/payments/reconciliation', badge: 'Pro' },
      { name: 'Bookkeeping', href: '/bookkeeping', badge: 'Pro' },
      { name: 'Bank Accounts', href: '/accounts' }
    ]
  },
  {
    id: 'students',
    name: 'Students',
    icon: UserGroupIcon,
    href: '/crm/enrolled',
    color: 'blue',
    subItems: [
      { name: 'Enrolled Students', href: '/crm/enrolled', badge: 'New' },
      { name: 'Recruitment Pipeline', href: '/crm/recruitment', badge: 'New' },
      { name: 'Programs', href: '/programs' },
      { name: 'Classroom Assignments', href: '/programs/assignments', badge: 'New' },
      { name: 'Family CRM (Old)', href: '/crm' },
      { name: 'Contracts', href: '/documents' }
    ]
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: ChartBarIcon,
    href: '/operations/metrics',
    color: 'indigo',
    subItems: [
      { name: 'Key Metrics', href: '/operations/metrics' },
      { name: 'Financial Health', href: '/health' },
      { name: 'Bank Reports', href: '/reports/bank-ready', badge: 'Pro' },
      { name: 'Document Repository', href: '/documents/repository', badge: 'Pro' }
    ]
  },
  {
    id: 'facility',
    name: 'Facility',
    icon: BuildingOfficeIcon,
    href: '/facility',
    color: 'orange',
    subItems: [
      { name: 'Facility Management', href: '/facility', badge: 'Pro' },
      { name: 'Upload Lease (OCR)', href: '/lease/upload', badge: 'New' },
      { name: 'Lease Analyzer', href: '/lease' }
    ]
  },
  {
    id: 'people',
    name: 'People & HR',
    icon: UsersIcon,
    href: '/staff',
    color: 'indigo',
    subItems: [
      { name: 'Staff Management', href: '/staff', badge: 'New' },
      { name: 'Payroll (Gusto)', href: '/staff', badge: 'Pro' },
      { name: 'Tax Filings', href: '/tax', badge: 'New' }
    ]
  },
  {
    id: 'tools',
    name: 'AI Tools',
    icon: SparklesIcon,
    href: '/calculator',
    color: 'purple',
    subItems: [
      { name: 'Pricing Calculator', href: '/calculator' },
      { name: 'AI Assistant', href: '/ai-assistant' }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Cog6ToothIcon,
    href: '/settings',
    color: 'gray',
    subItems: [
      { name: 'School Settings', href: '/settings' },
      { name: 'Pricing & Plan', href: '/pricing' }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: BuildingOffice2Icon,
    href: '/enterprise/network',
    color: 'purple',
    badge: 'Enterprise',
    subItems: [
      { name: 'Network Dashboard', href: '/enterprise/network', badge: 'Enterprise' }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(['home', 'today', 'money', 'students', 'reports', 'facility', 'people', 'tools', 'enterprise']);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isGroupActive = (group) => {
    if (location.pathname === group.href) return true;
    return group.subItems?.some(item => location.pathname === item.href);
  };

  const isItemActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200 shadow-soft">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center shadow-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M3 17v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3zm0-3h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-4h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 3c-1.1 0-2 .9-2 2v8h18V5c0-1.1-.9-2-2-2H5z"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight">SchoolStack.ai</div>
            <div className="text-xs text-primary-100 font-medium">Back Office OS</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 px-3 space-y-1">
          {navigationGroups.map((group) => {
            const isActive = isGroupActive(group);
            const isExpanded = expandedGroups.includes(group.id);
            const hasSubItems = group.subItems && group.subItems.length > 0;
            const Icon = group.icon;
            
            return (
              <div key={group.id}>
                {/* Main Item */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                      }`} />
                      <span>{group.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {group.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                          {group.badge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                ) : (
                  <Link
                    to={group.href}
                    className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-soft'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                      }`} />
                      <span>{group.name}</span>
                    </div>
                    {group.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                        {group.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <div className="mt-1 ml-8 space-y-0.5">
                    {group.subItems.map((subItem) => {
                      const isSubActive = isItemActive(subItem.href);
                      
                      return (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isSubActive
                              ? 'bg-primary-100 text-primary-800 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subItem.name}</span>
                            {subItem.badge && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* School Info */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-gray-200 bg-gray-50">
          <Link to="/settings" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-soft">
                <span className="text-sm font-bold text-white">SM</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sunshine Microschool</p>
              <p className="text-xs text-gray-600">28 students • Since 2022</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
