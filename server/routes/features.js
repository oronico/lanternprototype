/**
 * Feature Flags API Routes
 * 
 * Provides endpoints for:
 * - Getting feature flags for current user
 * - Admin: Updating feature flags
 * - Admin: Getting feature analytics
 */

const express = require('express');
const router = express.Router();
const { 
  featureConfig, 
  getEnabledFeatures, 
  getFeatureMetadata 
} = require('../shared/featureFlags');

/**
 * GET /api/features
 * Get all features available to the current user
 */
router.get('/', (req, res) => {
  try {
    const user = req.user || null; // From auth middleware
    
    const enabledFeatures = getEnabledFeatures(user);
    const featuresWithMetadata = {};
    
    enabledFeatures.forEach(featureName => {
      featuresWithMetadata[featureName] = getFeatureMetadata(featureName);
    });
    
    res.json({
      success: true,
      features: featuresWithMetadata,
      userTier: user?.subscription?.tier || 'starter',
    });
  } catch (error) {
    console.error('Error getting features:', error);
    res.status(500).json({
      error: 'Failed to get features',
      message: error.message,
    });
  }
});

/**
 * GET /api/features/:featureName
 * Get metadata for a specific feature
 */
router.get('/:featureName', (req, res) => {
  try {
    const { featureName } = req.params;
    const metadata = getFeatureMetadata(featureName);
    
    if (!metadata) {
      return res.status(404).json({
        error: 'Feature not found',
        feature: featureName,
      });
    }
    
    res.json({
      success: true,
      feature: featureName,
      metadata: metadata,
    });
  } catch (error) {
    console.error('Error getting feature:', error);
    res.status(500).json({
      error: 'Failed to get feature',
      message: error.message,
    });
  }
});

/**
 * GET /api/features/check/:featureName
 * Check if current user has access to a feature
 */
router.get('/check/:featureName', (req, res) => {
  try {
    const { featureName } = req.params;
    const user = req.user || null;
    
    const { isFeatureEnabled } = require('../shared/featureFlags');
    const enabled = isFeatureEnabled(featureName, user);
    const metadata = getFeatureMetadata(featureName);
    
    res.json({
      success: true,
      feature: featureName,
      enabled: enabled,
      metadata: metadata,
      userTier: user?.subscription?.tier || 'starter',
    });
  } catch (error) {
    console.error('Error checking feature:', error);
    res.status(500).json({
      error: 'Failed to check feature',
      message: error.message,
    });
  }
});

/**
 * POST /api/features/track
 * Track feature usage (analytics)
 */
router.post('/track', (req, res) => {
  try {
    const { feature, action, metadata } = req.body;
    const user = req.user || null;
    
    // In production, send to analytics service
    // For now, just log
    console.log('[Feature Analytics]', {
      feature,
      action,
      userId: user?.id,
      schoolId: user?.schoolId,
      metadata,
      timestamp: new Date().toISOString(),
    });
    
    res.json({
      success: true,
      message: 'Feature usage tracked',
    });
  } catch (error) {
    console.error('Error tracking feature:', error);
    res.status(500).json({
      error: 'Failed to track feature',
      message: error.message,
    });
  }
});

/**
 * POST /api/features/feedback
 * Submit feedback on a feature
 */
router.post('/feedback', (req, res) => {
  try {
    const { feature, rating, comment, context } = req.body;
    const user = req.user || null;
    
    const feedback = {
      feature,
      rating,
      comment,
      context,
      userId: user?.id,
      schoolId: user?.schoolId,
      userTier: user?.subscription?.tier,
      timestamp: new Date().toISOString(),
    };
    
    // In production, save to database
    console.log('[Feature Feedback]', feedback);
    
    res.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      error: 'Failed to submit feedback',
      message: error.message,
    });
  }
});

/**
 * Admin Routes (require admin role)
 */

/**
 * GET /api/features/admin/all
 * Get all features (including disabled ones)
 */
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    res.json({
      success: true,
      features: featureConfig,
    });
  } catch (error) {
    console.error('Error getting all features:', error);
    res.status(500).json({
      error: 'Failed to get all features',
      message: error.message,
    });
  }
});

/**
 * PUT /api/features/admin/:featureName
 * Update feature configuration
 */
router.put('/admin/:featureName', requireAdmin, (req, res) => {
  try {
    const { featureName } = req.params;
    const { enabled, rollout, tier, beta } = req.body;
    
    if (!featureConfig[featureName]) {
      return res.status(404).json({
        error: 'Feature not found',
        feature: featureName,
      });
    }
    
    // Update configuration
    if (enabled !== undefined) featureConfig[featureName].enabled = enabled;
    if (rollout !== undefined) featureConfig[featureName].rollout = rollout;
    if (tier !== undefined) featureConfig[featureName].tier = tier;
    if (beta !== undefined) featureConfig[featureName].beta = beta;
    
    // In production, persist to database
    console.log('[Feature Config Updated]', featureName, featureConfig[featureName]);
    
    res.json({
      success: true,
      feature: featureName,
      config: featureConfig[featureName],
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({
      error: 'Failed to update feature',
      message: error.message,
    });
  }
});

/**
 * Middleware to require admin role
 */
function requireAdmin(req, res, next) {
  const user = req.user;
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
      message: 'You do not have permission to access this resource',
    });
  }
  
  next();
}

module.exports = router;

