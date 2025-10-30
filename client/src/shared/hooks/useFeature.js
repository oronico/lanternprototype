import { useMemo } from 'react';
import { isFeatureEnabled, getFeatureMetadata, getFeatureOverride } from '../featureFlags';

/**
 * Hook to check if a feature is enabled for the current user
 * 
 * @param {string} featureName - The feature to check
 * @returns {Object} - { enabled, metadata }
 * 
 * @example
 * function MyComponent() {
 *   const { enabled, beta, tier } = useFeature('automatedBookkeeping');
 *   
 *   if (!enabled) {
 *     return <UpgradePrompt feature="automatedBookkeeping" />;
 *   }
 *   
 *   return <div>
 *     {beta && <Badge>Beta</Badge>}
 *     <AutomatedBookkeeping />
 *   </div>;
 * }
 */
export function useFeature(featureName) {
  // Get current user from localStorage
  // In production, this would come from auth context
  const user = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }, []);
  
  const enabled = useMemo(() => {
    // Check for development override first
    const override = getFeatureOverride(featureName);
    if (override !== null) {
      return override;
    }
    
    return isFeatureEnabled(featureName, user);
  }, [featureName, user]);
  
  const metadata = useMemo(() => {
    return getFeatureMetadata(featureName);
  }, [featureName]);
  
  return {
    enabled,
    ...metadata,
  };
}

/**
 * Hook to check multiple features at once
 * 
 * @param {string[]} featureNames - Array of features to check
 * @returns {Object} - Map of feature names to enabled status
 * 
 * @example
 * const features = useFeatures(['bookkeeping', 'reports', 'metrics']);
 * 
 * return <div>
 *   {features.bookkeeping && <Bookkeeping />}
 *   {features.reports && <Reports />}
 *   {features.metrics && <Metrics />}
 * </div>;
 */
export function useFeatures(featureNames) {
  const user = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }, []);
  
  return useMemo(() => {
    const result = {};
    featureNames.forEach(name => {
      const override = getFeatureOverride(name);
      result[name] = override !== null ? override : isFeatureEnabled(name, user);
    });
    return result;
  }, [featureNames, user]);
}

