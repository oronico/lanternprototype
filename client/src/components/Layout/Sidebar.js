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
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  // Core Operations (Most Used)
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Financial Health', href: '/health', icon: HeartIcon },
  { name: 'Family & Student CRM', href: '/crm', icon: UserGroupIcon },
  { name: 'Payments & Revenue', href: '/payments', icon: CreditCardIcon },
  { name: 'Enrollment Pipeline', href: '/enrollment', icon: UserGroupIcon },
  
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
    <div className="h-screen flex flex-col bg-white border-r border-gray-200">
      <SidebarContent location={location} />
    </div>
  );
};

const SidebarContent = ({ location }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📊</div>
          <div>
            <div className="text-lg font-semibold text-gray-900">SchoolStack.ai</div>
            <div className="text-xs text-gray-500">Complete Tech Stack for Education</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* School Info */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">SM</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Sunshine Microschool</p>
              <p className="text-xs text-gray-500">28 students • Established 2022</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
