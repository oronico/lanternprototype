import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  CreditCardIcon,
  CalculatorIcon,
  HeartIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  SparklesIcon,
  DocumentTextIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  BellIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  DocumentCheckIcon,
  FolderIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const navigation = [
  // Core Operations (Most Used)
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Chief of Staff Hub', href: '/back-office', icon: SparklesIcon, badge: 'New' },
  { name: 'Daily Guidance', href: '/nudges', icon: BellIcon, badge: 'New' },
  { name: 'Automated Bookkeeping', href: '/bookkeeping', icon: ArrowPathIcon, badge: 'Pro' },
  { name: 'Cash Reality', href: '/cash-reality', icon: BanknotesIcon, badge: 'New' },
  { name: 'Budget vs. Cash', href: '/budget-vs-cash', icon: ArrowTrendingUpIcon, badge: 'New' },
  { name: 'Your Milestones', href: '/milestones', icon: TrophyIcon, badge: 'New' },
  { name: 'Financial Health', href: '/health', icon: HeartIcon },
  { name: 'Family & Student CRM', href: '/crm', icon: UserGroupIcon },
  { name: 'Payments & Revenue', href: '/payments', icon: CreditCardIcon },
  { name: 'Enrollment Pipeline', href: '/enrollment', icon: UserGroupIcon },
  
  // Bookkeeping & Reports
  { name: 'Bank-Ready Reports', href: '/reports/bank-ready', icon: DocumentCheckIcon, badge: 'Pro' },
  { name: 'Document Repository', href: '/documents/repository', icon: FolderIcon, badge: 'Pro' },
  { name: 'Operational Metrics', href: '/operations/metrics', icon: ChartBarIcon, badge: 'New' },
  { name: 'Program Management', href: '/programs', icon: AcademicCapIcon, badge: 'New' },
  
  // Planning & Analysis
  { name: 'Pricing Calculator', href: '/calculator', icon: CalculatorIcon },
  { name: 'Facility & Lease', href: '/lease', icon: BuildingOfficeIcon },
  { name: 'Bank Accounts', href: '/accounts', icon: BanknotesIcon },
  
  // Business Tools
  { name: 'AI Document Helper', href: '/ai-assistant', icon: SparklesIcon },
  { name: 'Contracts & Signatures', href: '/documents', icon: DocumentTextIcon },
  
  // Configuration
  { name: 'School Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Subscription Options', href: '/pricing', icon: CreditCardIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200 shadow-soft">
      <SidebarContent location={location} />
    </div>
  );
};

const SidebarContent = ({ location }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="flex items-center space-x-3">
          {/* Logo SVG */}
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center shadow-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M3 17v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3zm0-3h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-4h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 3c-1.1 0-2 .9-2 2v8h18V5c0-1.1-.9-2-2-2H5z"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight">SchoolStack.ai</div>
            <div className="text-xs text-primary-100 font-medium">Education Business Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 px-3 space-y-0.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-primary-500'
                    }`}
                  />
                  <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* School Info */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-soft">
                <span className="text-sm font-bold text-white">SM</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sunshine Microschool</p>
              <p className="text-xs text-gray-600">28 students • Since 2022</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
