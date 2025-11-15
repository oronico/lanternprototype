/**
 * Feature Flag System
 * 
 * Controls which features are enabled and for whom.
 * This allows gradual rollouts, A/B testing, and easy feature toggles.
 */

export const FEATURES = {
  // Core features (always on)
  DASHBOARD: 'dashboard',
  PAYMENTS: 'payments',
  HEALTH: 'health',
  ENROLLMENT: 'enrollment',
  CRM: 'crm',
  CALCULATOR: 'calculator',
  
  // Advanced features (can be toggled)
  CASH_REALITY: 'cashReality',
  BUDGET_VS_CASH: 'budgetVsCash',
  NUDGES: 'nudges',
  MILESTONES: 'milestones',
  
  // Premium features
  AUTOMATED_BOOKKEEPING: 'automatedBookkeeping',
  BANK_READY_REPORTS: 'bankReadyReports',
  DOCUMENT_REPOSITORY: 'documentRepository',
  CHIEF_OF_STAFF: 'chiefOfStaff',
  
  // New features (gradual rollout)
  OPERATIONAL_METRICS: 'operationalMetrics',
  PROGRAM_MANAGEMENT: 'programManagement',
  AI_ASSISTANT: 'aiAssistant',
  
  // Facility Management
  FACILITY_MANAGEMENT: 'facilityManagement',
  LEASE_OCR_UPLOAD: 'leaseOCRUpload',
  
  // CRM & Recruitment
  RECRUITMENT_PIPELINE: 'recruitmentPipeline',
  ENROLLMENT_DASHBOARD: 'enrollmentDashboard',
  
  // Payment Systems
  PAYMENT_ENGINES: 'paymentEngines',
  TRANCHE_DEPOSITS: 'trancheDeposits',
  QUICKBOOKS_SYNC: 'quickbooksSync',
  
  // Staff & HR
  STAFF_MANAGEMENT: 'staffManagement',
  GUSTO_INTEGRATION: 'gustoIntegration',
  
  // Tax & Compliance
  TAX_FILING_MANAGER: 'taxFilingManager',
  
  // Enhanced Onboarding
  ENHANCED_ONBOARDING: 'enhancedOnboarding',
  
  // Attendance & Gamification
  DAILY_ATTENDANCE: 'dailyAttendance',
  GAMIFIED_NUDGES: 'gamifiedNudges',
  CLASSROOM_ASSIGNMENT: 'classroomAssignment',
  
  // Enterprise Features
  MULTI_SCHOOL_DASHBOARD: 'multiSchoolDashboard',
  
  // Experimental features (beta only)
  AI_FINANCIAL_ADVISOR: 'aiFinancialAdvisor',
  PREDICTIVE_ANALYTICS: 'predictiveAnalytics',
  MULTI_SCHOOL: 'multiSchool',
};

export const featureConfig = {
  [FEATURES.DASHBOARD]: {
    enabled: true,
    rollout: 100,
    tier: 'all', // all, starter, professional, enterprise
  },
  
  [FEATURES.PAYMENTS]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
  },
  
  [FEATURES.HEALTH]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
  },
  
  [FEATURES.ENROLLMENT]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
  },
  
  [FEATURES.CRM]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
  },
  
  [FEATURES.CALCULATOR]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
  },
  
  [FEATURES.CASH_REALITY]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    beta: false,
  },
  
  [FEATURES.BUDGET_VS_CASH]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    beta: false,
  },
  
  [FEATURES.NUDGES]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    beta: false,
  },
  
  [FEATURES.MILESTONES]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    beta: false,
  },
  
  [FEATURES.AUTOMATED_BOOKKEEPING]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    badge: 'Pro',
  },
  
  [FEATURES.BANK_READY_REPORTS]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    badge: 'Pro',
  },
  
  [FEATURES.DOCUMENT_REPOSITORY]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
  },
  
  [FEATURES.CHIEF_OF_STAFF]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
  },
  
  [FEATURES.OPERATIONAL_METRICS]: {
    enabled: true,
    rollout: 100, // Start at 25% for new feature, increase based on feedback
    tier: 'professional',
    beta: false,
    description: 'Track contract coverage, payment rates, and utilization',
  },
  
  [FEATURES.PROGRAM_MANAGEMENT]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    beta: false,
  },
  
  [FEATURES.AI_ASSISTANT]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
  },
  
  [FEATURES.FACILITY_MANAGEMENT]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Comprehensive facility cost tracking: lease, utilities, insurance, vendors',
  },
  
  [FEATURES.LEASE_OCR_UPLOAD]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    beta: false,
    description: 'Upload lease documents and extract all important details with OCR',
  },
  
  [FEATURES.RECRUITMENT_PIPELINE]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Sales-style pipeline for recruiting families from lead to enrollment',
  },
  
  [FEATURES.ENROLLMENT_DASHBOARD]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Comprehensive dashboard for currently enrolled students with attendance tracking',
  },
  
  [FEATURES.PAYMENT_ENGINES]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'ClassWallet, Stripe, and Omella payment integrations',
  },
  
  [FEATURES.TRANCHE_DEPOSITS]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Weekly batch deposit reconciliation and student allocation',
  },
  
  [FEATURES.QUICKBOOKS_SYNC]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Automatic sync to QuickBooks for payment reconciliation',
  },
  
  [FEATURES.STAFF_MANAGEMENT]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Manage W-2 employees and 1099 contractors',
  },
  
  [FEATURES.GUSTO_INTEGRATION]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Gusto payroll integration for automated payroll processing',
  },
  
  [FEATURES.TAX_FILING_MANAGER]: {
    enabled: true,
    rollout: 100,
    tier: 'professional',
    description: 'Entity-type aware tax filing tracker (LLC, S Corp, C Corp, 501c3)',
  },
  
  [FEATURES.ENHANCED_ONBOARDING]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Enhanced onboarding with entity type, EIN, and bank account requirements',
  },
  
  [FEATURES.DAILY_ATTENDANCE]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Daily attendance capture by program with streak tracking and nudges',
  },
  
  [FEATURES.GAMIFIED_NUDGES]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Habit-building streaks, progress bars, and positive nudges',
  },
  
  [FEATURES.CLASSROOM_ASSIGNMENT]: {
    enabled: true,
    rollout: 100,
    tier: 'all',
    description: 'Assign students to programs and teachers with schedule management',
  },
  
  [FEATURES.MULTI_SCHOOL_DASHBOARD]: {
    enabled: true,
    rollout: 100,
    tier: 'enterprise',
    description: 'Aggregated dashboard for multi-school networks',
  },
  
  // Experimental features
  [FEATURES.AI_FINANCIAL_ADVISOR]: {
    enabled: false, // Not ready yet
    rollout: 0,
    tier: 'enterprise',
    beta: true,
    requiresFlag: 'earlyAccess',
    description: 'AI-powered financial recommendations and forecasting',
  },
  
  [FEATURES.PREDICTIVE_ANALYTICS]: {
    enabled: false,
    rollout: 0,
    tier: 'enterprise',
    beta: true,
    requiresFlag: 'earlyAccess',
  },
  
  [FEATURES.MULTI_SCHOOL]: {
    enabled: false,
    rollout: 0,
    tier: 'enterprise',
    requiresFlag: 'multiSchoolAccess',
  },
};

/**
 * Simple hash function for consistent user bucketing
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Check if a feature is enabled for a specific user
 */
export function isFeatureEnabled(featureName, user = null) {
  const feature = featureConfig[featureName];
  
  if (!feature) {
    console.warn(`Feature "${featureName}" not found in config`);
    return false;
  }
  
  // Feature must be enabled
  if (!feature.enabled) {
    return false;
  }
  
  // If user is provided, check more conditions
  if (user) {
    // Check tier requirements
    if (feature.tier && feature.tier !== 'all') {
      if (!user.subscription || user.subscription.tier !== feature.tier) {
        // Check if enterprise users can access professional features
        if (!(feature.tier === 'professional' && user.subscription?.tier === 'enterprise')) {
          return false;
        }
      }
    }
    
    // Check if requires special flag
    if (feature.requiresFlag) {
      if (!user.flags || !user.flags[feature.requiresFlag]) {
        return false;
      }
    }
    
    // Check rollout percentage (consistent bucketing per user)
    if (feature.rollout < 100) {
      const userHash = hashCode(user.id || user.email) % 100;
      return userHash < feature.rollout;
    }
  }
  
  return true;
}

/**
 * Get feature metadata
 */
export function getFeatureMetadata(featureName) {
  return featureConfig[featureName] || null;
}

/**
 * Get all enabled features for a user
 */
export function getEnabledFeatures(user = null) {
  return Object.keys(featureConfig).filter(featureName => 
    isFeatureEnabled(featureName, user)
  );
}

/**
 * Check if user has access to a tier
 */
export function hasAccessToTier(tier, user) {
  if (!user || !user.subscription) {
    return tier === 'all' || tier === 'starter';
  }
  
  const userTier = user.subscription.tier;
  
  if (tier === 'all') return true;
  if (tier === 'starter') return true;
  if (tier === 'professional') {
    return userTier === 'professional' || userTier === 'enterprise';
  }
  if (tier === 'enterprise') {
    return userTier === 'enterprise';
  }
  
  return false;
}

/**
 * Override feature flags (for testing/admin)
 * Store in localStorage with prefix 'ff_'
 */
export function setFeatureOverride(featureName, enabled) {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem(`ff_${featureName}`, enabled.toString());
  }
}

/**
 * Check for feature override
 */
export function getFeatureOverride(featureName) {
  if (process.env.NODE_ENV === 'development') {
    const override = localStorage.getItem(`ff_${featureName}`);
    if (override !== null) {
      return override === 'true';
    }
  }
  return null;
}

/**
 * Clear all feature overrides
 */
export function clearFeatureOverrides() {
  if (process.env.NODE_ENV === 'development') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ff_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

