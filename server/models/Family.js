const mongoose = require('mongoose');

/**
 * Family Model
 * Represents a family unit with one or more students
 * Tracks household income for sliding scale, staff status, etc.
 */

const familySchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Primary Contact
  primaryContactName: {
    type: String,
    required: true
  },
  primaryContactEmail: {
    type: String,
    required: true
  },
  primaryContactPhone: String,
  
  // Secondary Contact
  secondaryContactName: String,
  secondaryContactEmail: String,
  secondaryContactPhone: String,
  
  // Household Information
  householdIncome: Number, // Encrypted in production
  incomeVerified: {
    type: Boolean,
    default: false
  },
  incomeVerificationDate: Date,
  
  // Staff Status
  isStaffFamily: {
    type: Boolean,
    default: false
  },
  staffMember: {
    name: String,
    role: String,
    startDate: Date
  },
  
  // Students in this family
  studentCount: {
    type: Number,
    default: 0
  },
  
  // Financial Summary
  totalMonthlyTuition: {
    type: Number,
    default: 0
  },
  totalDiscounts: {
    type: Number,
    default: 0
  },
  
  // Payment Behavior
  paymentScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  
  onTimePaymentRate: {
    type: Number,
    default: 100
  },
  
  totalPaymentsMade: {
    type: Number,
    default: 0
  },
  
  totalOnTimePayments: {
    type: Number,
    default: 0
  },
  
  totalLatePayments: {
    type: Number,
    default: 0
  },
  
  currentBalance: {
    type: Number,
    default: 0
  },
  
  // Contract Status
  allContractsSigned: {
    type: Boolean,
    default: false
  },
  
  contractsSignedCount: {
    type: Number,
    default: 0
  },
  
  contractsPendingCount: {
    type: Number,
    default: 0
  },
  
  // Communication Preferences
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'text', 'app'],
    default: 'email'
  },
  
  timezone: String,
  language: {
    type: String,
    default: 'en'
  },
  
  // Tags & Categories
  tags: [String],
  category: {
    type: String,
    enum: ['active', 'prospect', 'alumni', 'waitlist', 'inactive'],
    default: 'active'
  },
  
  // Referral Info
  referralSource: String,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  
  // Important Dates
  firstContactDate: Date,
  enrollmentDate: Date,
  
  // Notes
  notes: String,
  internalNotes: String, // Only visible to staff
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual: Payment Reliability Rating
familySchema.virtual('paymentReliability').get(function() {
  if (this.onTimePaymentRate >= 95) return 'Excellent';
  if (this.onTimePaymentRate >= 85) return 'Good';
  if (this.onTimePaymentRate >= 70) return 'Fair';
  return 'Poor';
});

// Method: Calculate family payment metrics
familySchema.methods.calculatePaymentMetrics = async function() {
  const Enrollment = mongoose.model('Enrollment');
  
  const enrollments = await Enrollment.find({
    familyId: this._id,
    status: 'active'
  });
  
  // Aggregate payment data
  let totalOnTime = 0;
  let totalLate = 0;
  let totalMissed = 0;
  let totalTuition = 0;
  let totalDiscounts = 0;
  let currentBalance = 0;
  let contractsSigned = 0;
  let contractsPending = 0;
  
  enrollments.forEach(enrollment => {
    totalOnTime += enrollment.onTimePayments || 0;
    totalLate += enrollment.latePayments || 0;
    totalMissed += enrollment.missedPayments || 0;
    totalTuition += enrollment.monthlyTuition || 0;
    totalDiscounts += enrollment.totalDiscount || 0;
    currentBalance += enrollment.totalOwed || 0;
    
    if (enrollment.contractStatus === 'signed') {
      contractsSigned++;
    } else if (['not-sent', 'sent', 'viewed'].includes(enrollment.contractStatus)) {
      contractsPending++;
    }
  });
  
  const totalPayments = totalOnTime + totalLate + totalMissed;
  
  this.totalOnTimePayments = totalOnTime;
  this.totalLatePayments = totalLate;
  this.totalPaymentsMade = totalPayments;
  this.onTimePaymentRate = totalPayments > 0 ? (totalOnTime / totalPayments) * 100 : 100;
  this.paymentScore = this.calculatePaymentScore(totalOnTime, totalLate, totalMissed);
  this.totalMonthlyTuition = totalTuition;
  this.totalDiscounts = totalDiscounts;
  this.currentBalance = currentBalance;
  this.contractsSignedCount = contractsSigned;
  this.contractsPendingCount = contractsPending;
  this.allContractsSigned = contractsPending === 0 && contractsSigned > 0;
  this.studentCount = enrollments.length;
  
  return this.save();
};

// Helper: Calculate payment score
familySchema.methods.calculatePaymentScore = function(onTime, late, missed) {
  const total = onTime + late + missed;
  if (total === 0) return 100;
  
  const onTimeRate = (onTime / total) * 100;
  const lateDeduction = (late / total) * 20;
  const missedDeduction = (missed / total) * 50;
  
  return Math.max(0, Math.min(100, onTimeRate - lateDeduction - missedDeduction));
};

// Indexes
familySchema.index({ schoolId: 1, isActive: 1 });
familySchema.index({ schoolId: 1, category: 1 });
familySchema.index({ schoolId: 1, isStaffFamily: 1 });
familySchema.index({ primaryContactEmail: 1 });

module.exports = mongoose.model('Family', familySchema);

