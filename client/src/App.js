import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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

// Services
import { initializeApp } from './services/api';

function AppContent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    initializeApp();
    checkExistingAuth();
  }, []);

  const checkExistingAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <SimpleLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Header user={user} onLogout={handleLogout} />
          
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
            background: '#363636',
            color: '#fff',
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
