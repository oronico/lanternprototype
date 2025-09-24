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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-purple-100">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Microschool Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Financial Operating System Demo
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">🎯 Demo Ready!</h4>
              <p className="text-xs text-green-800 mb-2">
                <strong>Email:</strong> admin@sunshine-microschool.com<br />
                <strong>Password:</strong> admin123
              </p>
              <p className="text-xs text-green-700">
                ✨ Complete demo with financial health monitoring, payment integrations, AI tools, and more!
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleLogin;
