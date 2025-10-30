/**
 * Simple Event Bus for decoupling features
 * 
 * Allows features to communicate without direct dependencies.
 * Each feature can emit events and listen to events from other features.
 * 
 * @example
 * // In Payments feature
 * eventBus.emit('payment.received', {
 *   familyId: 'fam_123',
 *   amount: 1200,
 *   method: 'stripe'
 * });
 * 
 * // In Dashboard feature
 * eventBus.on('payment.received', (payment) => {
 *   updateCashBalance(payment.amount);
 *   refreshDashboard();
 * });
 */

class EventBus {
  constructor() {
    this.events = {};
    this.debug = process.env.NODE_ENV === 'development';
  }
  
  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event is emitted
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(callback);
    
    if (this.debug) {
      console.log(`[EventBus] Subscribed to "${eventName}"`);
    }
    
    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }
  
  /**
   * Subscribe to an event, but only fire once
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event is emitted
   */
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    
    return this.on(eventName, onceCallback);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - The callback to remove
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    
    if (this.debug) {
      console.log(`[EventBus] Unsubscribed from "${eventName}"`);
    }
  }
  
  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {*} data - Data to pass to subscribers
   */
  emit(eventName, data) {
    if (this.debug) {
      console.log(`[EventBus] Emitting "${eventName}"`, data);
    }
    
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in "${eventName}" handler:`, error);
      }
    });
  }
  
  /**
   * Remove all event listeners
   */
  clear() {
    this.events = {};
    if (this.debug) {
      console.log('[EventBus] Cleared all events');
    }
  }
  
  /**
   * Get list of all registered events
   */
  getEvents() {
    return Object.keys(this.events);
  }
  
  /**
   * Get number of listeners for an event
   */
  getListenerCount(eventName) {
    return this.events[eventName]?.length || 0;
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Standard event names (prevents typos)
export const EVENTS = {
  // Payment events
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_OVERDUE: 'payment.overdue',
  
  // Enrollment events
  STUDENT_ENROLLED: 'enrollment.student_enrolled',
  STUDENT_WITHDRAWN: 'enrollment.student_withdrawn',
  CONTRACT_SIGNED: 'enrollment.contract_signed',
  
  // Financial events
  CASH_LOW: 'financial.cash_low',
  CASH_CRITICAL: 'financial.cash_critical',
  GOAL_REACHED: 'financial.goal_reached',
  
  // Milestone events
  MILESTONE_COMPLETED: 'milestone.completed',
  MILESTONE_CREATED: 'milestone.created',
  
  // Nudge events
  NUDGE_DISMISSED: 'nudge.dismissed',
  NUDGE_ACTIONED: 'nudge.actioned',
  
  // User events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_UPDATED: 'user.updated',
  
  // Settings events
  SETTINGS_UPDATED: 'settings.updated',
  FEATURE_TOGGLED: 'feature.toggled',
};

export default eventBus;

