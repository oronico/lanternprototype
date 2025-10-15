const mongoose = require('mongoose');

const nudgeSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  type: {
    type: String,
    enum: [
      'daily-check-in',
      'cash-flow-warning',
      'cash-flow-critical',
      'enrollment-opportunity',
      'collection-reminder',
      'expense-alert',
      'milestone-progress',
      'scenario-recommendation',
      'seasonal-reminder',
      'custom'
    ],
    required: true
  },
  
  urgency: {
    type: String,
    enum: ['info', 'reminder', 'warning', 'urgent', 'critical'],
    default: 'info'
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  actionItems: [{
    text: String,
    actionType: String, // 'link', 'button', 'task'
    actionUrl: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  
  context: {
    currentValue: Number,
    targetValue: Number,
    trend: String, // 'improving', 'declining', 'stable'
    relatedMetric: String,
    additionalData: mongoose.Schema.Types.Mixed
  },
  
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  dismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: Date,
  
  expiresAt: Date,
  
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: String, // 'daily', 'weekly', 'monthly'
    lastSent: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
nudgeSchema.index({ schoolId: 1, delivered: 1, scheduledFor: 1 });
nudgeSchema.index({ schoolId: 1, read: 1 });

module.exports = mongoose.model('Nudge', nudgeSchema);

