const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  type: {
    type: String,
    enum: [
      'cash-reserve-goal',
      'enrollment-target',
      'debt-free',
      'positive-cash-flow',
      'days-cash-milestone',
      'collection-rate-improvement',
      'retention-improvement',
      'first-profitable-month',
      'break-even',
      'custom'
    ],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  description: String,
  
  targetValue: Number,
  currentValue: Number,
  
  achieved: {
    type: Boolean,
    default: false
  },
  achievedAt: Date,
  
  celebrationType: {
    type: String,
    enum: ['confetti', 'trophy', 'star', 'fireworks'],
    default: 'confetti'
  },
  
  celebrationMessage: String,
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  category: {
    type: String,
    enum: ['financial', 'operational', 'growth', 'efficiency']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Milestone', milestoneSchema);

