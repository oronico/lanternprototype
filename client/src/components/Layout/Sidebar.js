import React, { useState, useEffect } from 'react';
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
  BuildingOffice2Icon,
  ScaleIcon,
  FolderIcon,
  CurrencyDollarIcon
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
    href: '/command-center',
    badge: '3',
    color: 'purple'
  },
  {
    id: 'money',
    name: 'Financials',
    icon: BanknotesIcon,
    href: '/financials',
    color: 'teal',
    subItems: [
      {
        name: 'Cash & Collections',
        href: '/payments'
      },
      {
        name: 'Bookkeeping',
        href: '/bookkeeping',
        badge: 'Pro'
      },
      {
        name: 'Payroll & Staff Costs',
        href: '/payroll',
        badge: 'Pro'
      },
      {
        name: 'Financial Health',
        href: '/health'
      }
    ]
  },
  {
    id: 'students',
    name: 'Students',
    icon: UserGroupIcon,
    href: '/students',
    color: 'blue',
    subItems: [
      { name: 'Enrolled Students', href: '/students' },
      { name: 'Daily Attendance', href: '/attendance/daily' },
      { name: 'Recruitment Pipeline', href: '/crm/recruitment' }
    ]
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    icon: CurrencyDollarIcon,
    href: '/crm/fundraising',
    color: 'red',
    badge: '501c3 Only'
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: ChartBarIcon,
    href: '/tax',
    color: 'indigo',
    subItems: [
      { name: 'Tax Filings', href: '/tax' },
      { name: 'Year-End Financials', href: '/reports/year-end', badge: 'Pro' },
      { name: 'Bank Reports', href: '/reports/bank-ready', badge: 'Pro' }
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FolderIcon,
    href: '/documents',
    color: 'yellow',
    subItems: [
      { name: 'Document Library', href: '/documents' },
      { name: 'Upload Documents', href: '/documents?action=upload' }
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
      { name: 'Lease Analyzer', href: '/lease' },
      { name: 'Upload Lease (OCR)', href: '/lease/upload', badge: 'New' }
    ]
  },
  {
    id: 'people',
    name: 'People & HR',
    icon: UsersIcon,
    href: '/staff',
    color: 'indigo',
    subItems: [
      { name: 'Staff Directory', href: '/staff' }
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
      { name: 'AI Assistant', href: '/ai-assistant' },
      { name: 'Sandbox Command Center', href: '/sandbox/command-center', badge: 'Beta' }
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
      { name: 'Programs & Schedule', href: '/programs' },
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
  const [expandedGroups, setExpandedGroups] = useState(['home', 'today', 'money', 'students', 'fundraising', 'reports', 'documents', 'facility', 'people', 'tools', 'enterprise']);
  
  // Check entity type safely (inside component, not at module level)
  const [entityType, setEntityType] = useState('llc-single');
  const [needsGovernance, setNeedsGovernance] = useState(false);
  
  useEffect(() => {
    // Only access localStorage in browser, not during SSR
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('entityType') || 'llc-single';
      setEntityType(stored);
      setNeedsGovernance(stored === '501c3' || stored === 'ccorp');
    }
  }, []);

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
    // Handle both exact path match and query parameter routes
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      const hrefParams = new URLSearchParams(query);
      const currentParams = new URLSearchParams(location.search);
      
      // Check if path matches AND all href params are in current URL
      if (location.pathname !== path) return false;
      
      for (const [key, value] of hrefParams.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    }
    return location.pathname === href;
  };

  // Filter navigation groups based on entity type
  const filteredNavigationGroups = navigationGroups.filter(group => {
    // Show fundraising only for 501c3
    if (group.id === 'fundraising' && entityType !== '501c3') {
      return false;
    }
    return true;
  });

  // Build navigation with conditional governance
  const navigation = [
    ...filteredNavigationGroups.slice(0, 7), // Everything up to People & HR
    ...(needsGovernance ? [{
      id: 'governance',
      name: 'Governance',
      icon: ScaleIcon,
      href: '/governance',
      color: 'purple',
      badge: entityType === '501c3' ? 'Nonprofit' : 'Corp'
      // No subItems - page has its own tab navigation!
    }] : []),
    ...filteredNavigationGroups.slice(7) // Rest of navigation
  ];

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
          {navigation.map((group) => {
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
