import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PaymentTracking from './components/Payments/PaymentTracking';
import PricingCalculator from './components/Calculator/PricingCalculator';
import FlexibleTuitionEngine from './components/Calculator/FlexibleTuitionEngine';
import FinancialHealth from './components/Health/FinancialHealth';
import EnrollmentPipeline from './components/Enrollment/EnrollmentPipeline';
import LeaseAnalyzer from './components/Lease/LeaseAnalyzer';
import LeaseDataEntry from './components/Lease/LeaseDataEntry';
import AIAssistant from './components/AI/AIAssistant';
import PricingPlans from './components/Pricing/PricingPlans';
import DocumentManager from './components/Documents/DocumentManager';
import FinancialAccounts from './components/Accounts/FinancialAccounts';
import FinancialControlsGuide from './components/Accounts/FinancialControlsGuide';
import SchoolSettings from './components/Settings/SchoolSettings';
import FamilyCRM from './components/CRM/FamilyCRM';
import SimpleLogin from './components/Auth/SimpleLogin';
import SchoolOnboarding from './components/Onboarding/SchoolOnboarding';
import CashRealityDashboard from './components/Dashboard/CashRealityDashboard';
import NudgeCenter from './components/Nudges/NudgeCenter';
import MilestoneTracker from './components/Milestones/MilestoneTracker';
import BudgetVsCash from './components/Dashboard/BudgetVsCash';
import AutomatedBookkeeping from './components/Bookkeeping/AutomatedBookkeeping';
import BankReadyReports from './components/Reports/BankReadyReports';
import DocumentRepository from './components/Documents/DocumentRepository';
import ChiefOfStaffDashboard from './components/BackOffice/ChiefOfStaffDashboard';
import OperationalMetrics from './components/Operations/OperationalMetrics';
import ProgramManagement from './components/Programs/ProgramManagement';

// Services
import { initializeApp } from './services/api';

function AppContent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [needsOnboarding, setNeedsOnboarding] = React.useState(false);

  useEffect(() => {
    initializeApp();
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Check onboarding status
        // In production, make API call to check onboarding
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (!onboardingComplete) {
          setNeedsOnboarding(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Check if user needs onboarding
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      setNeedsOnboarding(true);
    }
  };

  const handleOnboardingComplete = (onboardingData) => {
    localStorage.setItem('onboardingComplete', 'true');
    setNeedsOnboarding(false);
    toast.success('Welcome to SchoolStack.ai! 🎉');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    setUser(null);
    setNeedsOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-medium mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M3 17v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3zm0-3h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-4h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 3c-1.1 0-2 .9-2 2v8h18V5c0-1.1-.9-2-2-2H5z"/>
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading SchoolStack.ai...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SimpleLogin onLogin={handleLogin} />;
  }

  // Show onboarding flow if needed
  if (needsOnboarding) {
    return <SchoolOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header user={user} onLogout={handleLogout} />
          
          <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-primary-50/20">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/back-office" element={<ChiefOfStaffDashboard />} />
              <Route path="/cash-reality" element={<CashRealityDashboard />} />
              <Route path="/budget-vs-cash" element={<BudgetVsCash />} />
              <Route path="/nudges" element={<NudgeCenter />} />
              <Route path="/milestones" element={<MilestoneTracker />} />
              <Route path="/bookkeeping" element={<AutomatedBookkeeping />} />
              <Route path="/reports/bank-ready" element={<BankReadyReports />} />
              <Route path="/documents/repository" element={<DocumentRepository />} />
              <Route path="/operations/metrics" element={<OperationalMetrics />} />
              <Route path="/programs" element={<ProgramManagement />} />
              <Route path="/payments" element={<PaymentTracking />} />
              <Route path="/calculator" element={<FlexibleTuitionEngine />} />
              <Route path="/health" element={<FinancialHealth />} />
              <Route path="/enrollment" element={<EnrollmentPipeline />} />
              <Route path="/lease" element={<LeaseAnalyzer />} />
              <Route path="/lease-entry" element={<LeaseDataEntry onAnalyze={(data) => console.log('Analyzing:', data)} />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/pricing" element={<PricingPlans />} />
              <Route path="/documents" element={<DocumentManager />} />
              <Route path="/accounts" element={<FinancialAccounts />} />
              <Route path="/financial-controls-guide" element={<FinancialControlsGuide />} />
              <Route path="/settings" element={<SchoolSettings />} />
              <Route path="/crm" element={<FamilyCRM />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0A5F6F',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 16px 0 rgba(10, 95, 111, 0.16)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
