import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const SimpleLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@sunshine-microschool.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple authentication check
      if (email === 'admin@sunshine-microschool.com' && password === 'admin123') {
        const mockUser = {
          id: 1,
          email: 'admin@sunshine-microschool.com',
          name: 'Sarah Johnson',
          role: 'director',
          schoolName: 'Sunshine Microschool',
          permissions: ['dashboard', 'payments', 'enrollment', 'calculator', 'health', 'lease']
        };
        
        // Store in localStorage
        localStorage.setItem('token', 'demo_token_12345');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Call parent function
        onLogin(mockUser);
        
      } else {
        setError('Invalid credentials. Use the demo credentials below.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-strong p-8 space-y-6">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M3 17v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3zm0-3h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-4h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 3c-1.1 0-2 .9-2 2v8h18V5c0-1.1-.9-2-2-2H5z"/>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
              SchoolStack.ai
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-600">
              Complete Tech Stack for Education Business
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="you@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 text-center">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft hover:shadow-medium"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in to your account'
                )}
              </button>
            </div>

            {/* Demo credentials */}
            <div className="mt-5">
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 rounded-xl p-4 shadow-soft">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-accent-900 mb-1">🎯 Demo Ready!</h4>
                    <div className="text-xs space-y-1 text-accent-800 font-medium">
                      <p><span className="font-bold">Email:</span> admin@sunshine-microschool.com</p>
                      <p><span className="font-bold">Password:</span> admin123</p>
                    </div>
                    <p className="text-xs text-accent-700 mt-2 leading-relaxed">
                      ✨ Full demo with financial health monitoring, payment tracking, AI tools, and more!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Trusted by education businesses nationwide
        </p>
      </div>
    </div>
  );
};

export default SimpleLogin;
