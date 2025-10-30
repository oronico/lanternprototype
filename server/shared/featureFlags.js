/**
 * Backend Feature Flag Configuration
 * 
 * This mirrors the frontend feature flags but controls server-side features.
 * Sync this with client/src/shared/featureFlags.js
 */

const FEATURES = {
  // Core features
  DASHBOARD: 'dashboard',
  PAYMENTS: 'payments',
  HEALTH: 'health',
  ENROLLMENT: 'enrollment',
  CRM: 'crm',
  CALCULATOR: 'calculator',
  
  // Advanced features
  CASH_REALITY: 'cashReality',
  BUDGET_VS_CASH: 'budgetVsCash',
  NUDGES: 'nudges',
  MILESTONES: 'milestones',
  
  // Premium features
  AUTOMATED_BOOKKEEPING: 'automatedBookkeeping',
  BANK_READY_REPORTS: 'bankReadyReports',
  DOCUMENT_REPOSITORY: 'documentRepository',
  CHIEF_OF_STAFF: 'chiefOfStaff',
  
  // New features
  OPERATIONAL_METRICS: 'operationalMetrics',
  PROGRAM_MANAGEMENT: 'programManagement',
  AI_ASSISTANT: 'aiAssistant',
  
  // Experimental features
  AI_FINANCIAL_ADVISOR: 'aiFinancialAdvisor',
  PREDICTIVE_ANALYTICS: 'predictiveAnalytics',
  MULTI_SCHOOL: 'multiSchool',
};

const featureConfig = {
  [FEATURES.DASHBOARD]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.PAYMENTS]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.HEALTH]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.ENROLLMENT]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.CRM]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.CALCULATOR]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.CASH_REALITY]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.BUDGET_VS_CASH]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.NUDGES]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.MILESTONES]: {
    enabled: true,
    tier: 'all',
  },
  
  [FEATURES.AUTOMATED_BOOKKEEPING]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.BANK_READY_REPORTS]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.DOCUMENT_REPOSITORY]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.CHIEF_OF_STAFF]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.OPERATIONAL_METRICS]: {
    enabled: true,
    tier: 'professional',
    beta: true,
  },
  
  [FEATURES.PROGRAM_MANAGEMENT]: {
    enabled: true,
    tier: 'professional',
  },
  
  [FEATURES.AI_ASSISTANT]: {
    enabled: true,
    tier: 'professional',
  },
  
  // Experimental features
  [FEATURES.AI_FINANCIAL_ADVISOR]: {
    enabled: false,
    tier: 'enterprise',
    beta: true,
    requiresFlag: 'earlyAccess',
  },
  
  [FEATURES.PREDICTIVE_ANALYTICS]: {
    enabled: false,
    tier: 'enterprise',
    beta: true,
  },
  
  [FEATURES.MULTI_SCHOOL]: {
    enabled: false,
    tier: 'enterprise',
    requiresFlag: 'multiSchoolAccess',
  },
};

/**
 * Check if a feature is enabled for a user
 */
function isFeatureEnabled(featureName, user = null) {
  const feature = featureConfig[featureName];
  
  if (!feature) {
    console.warn(`Feature "${featureName}" not found in config`);
    return false;
  }
  
  if (!feature.enabled) {
    return false;
  }
  
  if (user) {
    // Check tier requirements
    if (feature.tier && feature.tier !== 'all') {
      const userTier = user.subscription?.tier || 'starter';
      
      if (feature.tier === 'professional') {
        if (userTier !== 'professional' && userTier !== 'enterprise') {
          return false;
        }
      } else if (feature.tier === 'enterprise') {
        if (userTier !== 'enterprise') {
          return false;
        }
      }
    }
    
    // Check special flags
    if (feature.requiresFlag) {
      if (!user.flags || !user.flags[feature.requiresFlag]) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get feature metadata
 */
function getFeatureMetadata(featureName) {
  return featureConfig[featureName] || null;
}

/**
 * Get all enabled features for a user
 */
function getEnabledFeatures(user = null) {
  return Object.keys(featureConfig).filter(featureName => 
    isFeatureEnabled(featureName, user)
  );
}

/**
 * Middleware to check feature access
 */
function requireFeature(featureName) {
  return (req, res, next) => {
    const user = req.user; // Assumes auth middleware sets req.user
    
    if (!isFeatureEnabled(featureName, user)) {
      return res.status(403).json({
        error: 'Feature not available',
        feature: featureName,
        message: 'This feature is not available on your current plan',
        upgrade: {
          required: featureConfig[featureName]?.tier || 'unknown',
        },
      });
    }
    
    next();
  };
}

module.exports = {
  FEATURES,
  featureConfig,
  isFeatureEnabled,
  getFeatureMetadata,
  getEnabledFeatures,
  requireFeature,
};

