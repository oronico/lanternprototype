import React from 'react';
import { useFeature } from '../../shared/hooks/useFeature';
import { Link } from 'react-router-dom';

/**
 * Feature Gate Component
 * 
 * Wraps features and shows appropriate UI based on access:
 * - If enabled: Show the feature
 * - If disabled: Show upgrade prompt or coming soon message
 * 
 * @example
 * <FeatureGate feature="automatedBookkeeping">
 *   <AutomatedBookkeeping />
 * </FeatureGate>
 */
export default function FeatureGate({ 
  feature, 
  children, 
  fallback = null,
  showUpgradePrompt = true 
}) {
  const { enabled, tier, beta, description } = useFeature(feature);

  if (enabled) {
    return (
      <div className="relative">
        {beta && (
          <div className="mb-4 bg-primary-50 border border-primary-300 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                Beta
              </span>
              <p className="text-sm text-primary-800">
                This feature is in beta. We'd love your feedback!
              </p>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Custom fallback provided
  if (fallback) {
    return fallback;
  }

  // Show upgrade prompt
  if (showUpgradePrompt && tier && tier !== 'all') {
    return <UpgradePrompt feature={feature} tier={tier} description={description} />;
  }

  // Coming soon
  return <ComingSoon feature={feature} description={description} />;
}

/**
 * Upgrade Prompt Component
 */
function UpgradePrompt({ feature, tier, description }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upgrade to {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </h2>

        {description && (
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        )}

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary-900 font-medium mb-2">
            This feature is available on the {tier} plan
          </p>
          <p className="text-xs text-primary-700">
            {tier === 'professional' && 'Starting at $99/month'}
            {tier === 'enterprise' && 'Starting at $199/month'}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            to="/pricing"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            View Pricing
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Coming Soon Component
 */
function ComingSoon({ feature, description }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Coming Soon
        </h2>

        <p className="text-gray-600 mb-6">
          {description || 'This feature is currently in development.'}
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            Want early access? Join our beta program to test new features before they launch.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Join Beta Program
          </button>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple feature check component (no UI)
 */
export function FeatureCheck({ feature, children, fallback = null }) {
  const { enabled } = useFeature(feature);
  return enabled ? children : fallback;
}

