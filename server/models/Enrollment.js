const mongoose = require('mongoose');

/**
 * Enrollment Model
 * Tracks individual student enrollments in programs
 * Handles contract status and payment tracking
 */

const enrollmentSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  
  // Enrollment Dates
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  startDate: Date,
  endDate: Date,
  withdrawalDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'withdrawn', 'graduated', 'waitlist', 'declined'],
    default: 'pending'
  },
  
  // Contract Status
  contractStatus: {
    type: String,
    enum: ['not-sent', 'sent', 'viewed', 'signed', 'expired', 'declined'],
    default: 'not-sent'
  },
  contractSentDate: Date,
  contractSignedDate: Date,
  contractExpiryDate: Date,
  contractDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  
  // Pricing & Discounts
  baseTuition: {
    type: Number,
    required: true
  },
  
  discountsApplied: [{
    type: {
      type: String,
      enum: ['sibling', 'staff', 'scholarship', 'early-bird', 'referral', 'custom']
    },
    name: String,
    amount: Number,
    percentage: Number
  }],
  
  totalDiscount: {
    type: Number,
    default: 0
  },
  
  monthlyTuition: {
    type: Number,
    required: true
  },
  
  annualTuition: Number,
  
  // Sliding Scale Info
  slidingScaleTier: String,
  familyIncome: Number, // Encrypted in production
  
  // Payment Schedule
  paymentFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'annual', 'per-class'],
    default: 'monthly'
  },
  
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'ach', 'check', 'cash', 'esa-voucher', 'other']
  },
  
  autoPayEnabled: {
    type: Boolean,
    default: false
  },
  
  // Payment Tracking
  totalPaid: {
    type: Number,
    default: 0
  },
  
  totalOwed: {
    type: Number,
    default: 0
  },
  
  paymentStatus: {
    type: String,
    enum: ['current', 'late', 'delinquent', 'paid-in-full'],
    default: 'current'
  },
  
  lastPaymentDate: Date,
  nextPaymentDue: Date,
  
  // Payment Behavior Metrics
  onTimePayments: {
    type: Number,
    default: 0
  },
  
  latePayments: {
    type: Number,
    default: 0
  },
  
  missedPayments: {
    type: Number,
    default: 0
  },
  
  averageDaysLate: {
    type: Number,
    default: 0
  },
  
  // Schedule (for part-time programs)
  attendanceDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  
  attendanceSchedule: [{
    dayOfWeek: String,
    startTime: String,
    endTime: String
  }],
  
  // Notes & Tags
  notes: String,
  tags: [String],
  
  // Internal tracking
  referralSource: String,
  priority: {
    type: String,
    enum: ['standard', 'priority', 'urgent'],
    default: 'standard'
  }
}, {
  timestamps: true
});

// Virtual: Payment Behavior Score (0-100)
enrollmentSchema.virtual('paymentScore').get(function() {
  const totalPayments = this.onTimePayments + this.latePayments + this.missedPayments;
  if (totalPayments === 0) return 100; // New enrollment, assume good
  
  const onTimeRate = (this.onTimePayments / totalPayments) * 100;
  const lateDeduction = (this.latePayments / totalPayments) * 20; // -20 pts per late
  const missedDeduction = (this.missedPayments / totalPayments) * 50; // -50 pts per missed
  
  return Math.max(0, Math.min(100, onTimeRate - lateDeduction - missedDeduction));
});

// Virtual: Contract Coverage Status
enrollmentSchema.virtual('hasSignedContract').get(function() {
  return this.contractStatus === 'signed';
});

// Virtual: Days Since Last Payment
enrollmentSchema.virtual('daysSinceLastPayment').get(function() {
  if (!this.lastPaymentDate) return null;
  const diff = Date.now() - this.lastPaymentDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Virtual: Is Payment Overdue
enrollmentSchema.virtual('isPaymentOverdue').get(function() {
  if (!this.nextPaymentDue) return false;
  return new Date() > this.nextPaymentDue;
});

// Method: Record payment
enrollmentSchema.methods.recordPayment = function(amount, date = new Date()) {
  this.totalPaid += amount;
  this.lastPaymentDate = date;
  
  // Determine if payment was on time
  if (this.nextPaymentDue) {
    const daysDiff = Math.floor((date - this.nextPaymentDue) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 0) {
      this.onTimePayments += 1;
    } else {
      this.latePayments += 1;
      // Update average days late
      const totalLate = (this.averageDaysLate * (this.latePayments - 1)) + daysDiff;
      this.averageDaysLate = totalLate / this.latePayments;
    }
  } else {
    this.onTimePayments += 1;
  }
  
  // Calculate next payment due
  if (this.paymentFrequency === 'monthly') {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    this.nextPaymentDue = next;
  }
  
  // Update payment status
  this.totalOwed = Math.max(0, this.totalOwed - amount);
  
  if (this.totalOwed === 0) {
    this.paymentStatus = 'paid-in-full';
  } else if (this.isPaymentOverdue) {
    const daysOverdue = Math.floor((Date.now() - this.nextPaymentDue) / (1000 * 60 * 60 * 24));
    this.paymentStatus = daysOverdue > 30 ? 'delinquent' : 'late';
  } else {
    this.paymentStatus = 'current';
  }
  
  return this.save();
};

// Method: Update contract status
enrollmentSchema.methods.updateContractStatus = function(status, date = new Date()) {
  this.contractStatus = status;
  
  if (status === 'sent') {
    this.contractSentDate = date;
  } else if (status === 'signed') {
    this.contractSignedDate = date;
  }
  
  return this.save();
};

// Indexes for performance
enrollmentSchema.index({ schoolId: 1, status: 1 });
enrollmentSchema.index({ schoolId: 1, programId: 1, status: 1 });
enrollmentSchema.index({ schoolId: 1, familyId: 1 });
enrollmentSchema.index({ schoolId: 1, contractStatus: 1 });
enrollmentSchema.index({ schoolId: 1, paymentStatus: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

