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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Payment Tracking', href: '/payments', icon: CreditCardIcon },
  { name: 'Tuition Engine', href: '/calculator', icon: CalculatorIcon },
  { name: 'Financial Health', href: '/health', icon: HeartIcon },
  { name: 'Enrollment Pipeline', href: '/enrollment', icon: UserGroupIcon },
  { name: 'Lease Analyzer', href: '/lease', icon: BuildingOfficeIcon },
  { name: 'AI Assistant', href: '/ai-assistant', icon: SparklesIcon, highlight: true },
  { name: 'Documents & Contracts', href: '/documents', icon: DocumentTextIcon, highlight: true },
  { name: 'Plans & Pricing', href: '/pricing', icon: CreditCardIcon, highlight: true },
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
          <div className="text-2xl">🏮</div>
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
                    ? item.highlight
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                    : item.highlight
                    ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? item.highlight
                        ? 'text-purple-500'
                        : 'text-primary-500'
                      : item.highlight
                      ? 'text-purple-400 group-hover:text-purple-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
                {item.highlight && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    New
                  </span>
                )}
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
