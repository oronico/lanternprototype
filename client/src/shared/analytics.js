/**
 * Analytics wrapper for tracking user behavior and feature usage
 * 
 * This provides a simple interface for tracking events across the app.
 * In production, this would integrate with Mixpanel, Amplitude, Segment, etc.
 * 
 * For now, it logs to console in development and can be easily swapped
 * with real analytics providers.
 */

class Analytics {
  constructor() {
    this.enabled = true;
    this.debug = process.env.NODE_ENV === 'development';
    this.queue = [];
  }
  
  /**
   * Initialize analytics with user info
   */
  identify(userId, traits = {}) {
    if (!this.enabled) return;
    
    const event = {
      type: 'identify',
      userId,
      traits,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log('[Analytics] Identified user:', userId, traits);
    }
  }
  
  /**
   * Track a feature usage event
   */
  trackFeatureUsage(featureName, action, metadata = {}) {
    if (!this.enabled) return;
    
    const user = this._getCurrentUser();
    
    const event = {
      type: 'feature_usage',
      feature: featureName,
      action: action,
      userId: user?.id,
      schoolId: user?.schoolId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log(`[Analytics] Feature: ${featureName}.${action}`, metadata);
    }
  }
  
  /**
   * Track page view
   */
  trackPageView(pageName, properties = {}) {
    if (!this.enabled) return;
    
    const event = {
      type: 'page_view',
      page: pageName,
      properties,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log('[Analytics] Page view:', pageName);
    }
  }
  
  /**
   * Track generic event
   */
  track(eventName, properties = {}) {
    if (!this.enabled) return;
    
    const user = this._getCurrentUser();
    
    const event = {
      type: 'track',
      event: eventName,
      userId: user?.id,
      schoolId: user?.schoolId,
      properties,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log(`[Analytics] Event: ${eventName}`, properties);
    }
  }
  
  /**
   * Track feature load time
   */
  trackFeaturePerformance(featureName, loadTime) {
    if (!this.enabled) return;
    
    const event = {
      type: 'performance',
      feature: featureName,
      loadTime: loadTime,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log(`[Analytics] Performance: ${featureName} loaded in ${loadTime}ms`);
    }
  }
  
  /**
   * Track error
   */
  trackError(error, context = {}) {
    const event = {
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    console.error('[Analytics] Error tracked:', error, context);
  }
  
  /**
   * Track A/B test variant
   */
  trackExperiment(experimentName, variant, converted = false) {
    if (!this.enabled) return;
    
    const event = {
      type: 'experiment',
      experiment: experimentName,
      variant: variant,
      converted: converted,
      timestamp: new Date().toISOString(),
    };
    
    this._send(event);
    
    if (this.debug) {
      console.log(`[Analytics] Experiment: ${experimentName} = ${variant}`, 
        converted ? '(converted)' : '');
    }
  }
  
  /**
   * Get current user from storage
   * @private
   */
  _getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Send event to analytics service
   * @private
   */
  _send(event) {
    // In development, just log
    if (this.debug) {
      this.queue.push(event);
      return;
    }
    
    // In production, send to analytics service
    // Examples:
    
    // Mixpanel
    // mixpanel.track(event.type, event);
    
    // Amplitude
    // amplitude.getInstance().logEvent(event.type, event);
    
    // Segment
    // analytics.track(event.type, event);
    
    // Google Analytics 4
    // gtag('event', event.type, event);
    
    // Custom API
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
  }
  
  /**
   * Get queued events (for debugging)
   */
  getQueue() {
    return this.queue;
  }
  
  /**
   * Clear queue
   */
  clearQueue() {
    this.queue = [];
  }
  
  /**
   * Enable/disable analytics
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (this.debug) {
      console.log(`[Analytics] ${enabled ? 'Enabled' : 'Disabled'}`);
    }
  }
}

// Create singleton instance
export const analytics = new Analytics();

/**
 * React hook for tracking feature usage
 */
export function useAnalytics() {
  return {
    trackFeature: analytics.trackFeatureUsage.bind(analytics),
    trackPage: analytics.trackPageView.bind(analytics),
    track: analytics.track.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
}

export default analytics;

