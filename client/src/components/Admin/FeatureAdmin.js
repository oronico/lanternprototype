import React, { useState, useEffect } from 'react';
import { 
  FEATURES, 
  featureConfig, 
  setFeatureOverride, 
  getFeatureOverride,
  clearFeatureOverrides 
} from '../../shared/featureFlags';

/**
 * Admin panel for managing feature flags (Development only)
 * 
 * Allows developers and testers to:
 * - See all available features
 * - Toggle features on/off locally
 * - View feature metadata (tier, rollout %, etc.)
 * - Clear all overrides
 */
export default function FeatureAdmin() {
  const [overrides, setOverrides] = useState({});
  const [filter, setFilter] = useState('all'); // all, enabled, disabled, beta

  useEffect(() => {
    // Load current overrides
    const currentOverrides = {};
    Object.keys(FEATURES).forEach(key => {
      const override = getFeatureOverride(FEATURES[key]);
      if (override !== null) {
        currentOverrides[FEATURES[key]] = override;
      }
    });
    setOverrides(currentOverrides);
  }, []);

  const handleToggle = (featureName) => {
    const currentValue = overrides[featureName] !== undefined 
      ? overrides[featureName] 
      : featureConfig[featureName]?.enabled;
    
    const newValue = !currentValue;
    setFeatureOverride(featureName, newValue);
    
    setOverrides(prev => ({
      ...prev,
      [featureName]: newValue
    }));
  };

  const handleClearAll = () => {
    clearFeatureOverrides();
    setOverrides({});
  };

  const getFeatureStatus = (featureName) => {
    const override = overrides[featureName];
    const config = featureConfig[featureName];
    
    if (override !== undefined) {
      return { enabled: override, overridden: true };
    }
    
    return { enabled: config?.enabled || false, overridden: false };
  };

  const filteredFeatures = Object.entries(FEATURES).filter(([key, featureName]) => {
    const config = featureConfig[featureName];
    const status = getFeatureStatus(featureName);
    
    if (filter === 'enabled') return status.enabled;
    if (filter === 'disabled') return !status.enabled;
    if (filter === 'beta') return config?.beta;
    return true;
  });

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feature Flags Admin</h1>
              <p className="text-sm text-gray-600 mt-1">
                Development only - Toggle features locally for testing
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Overrides
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {['all', 'enabled', 'disabled', 'beta'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeatures.map(([key, featureName]) => {
            const config = featureConfig[featureName];
            const status = getFeatureStatus(featureName);

            return (
              <div
                key={featureName}
                className={`bg-white rounded-lg shadow-sm p-5 border-2 ${
                  status.overridden 
                    ? 'border-yellow-400' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {featureName}
                      </h3>
                      {status.overridden && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          Overridden
                        </span>
                      )}
                      {config?.beta && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                          Beta
                        </span>
                      )}
                      {config?.badge && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {config.badge}
                        </span>
                      )}
                    </div>
                    
                    {config?.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {config.description}
                      </p>
                    )}
                    
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        Tier: <strong>{config?.tier || 'all'}</strong>
                      </span>
                      <span>
                        Rollout: <strong>{config?.rollout || 0}%</strong>
                      </span>
                      {config?.requiresFlag && (
                        <span>
                          Requires: <strong>{config.requiresFlag}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(featureName)}
                    className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      status.enabled
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        status.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-primary-300 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Toggle features on/off to test different states</li>
            <li>• Overrides are stored in localStorage and persist across reloads</li>
            <li>• Yellow border indicates a feature has been overridden</li>
            <li>• Click "Clear All Overrides" to reset to default config</li>
            <li>• This panel is only available in development mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

