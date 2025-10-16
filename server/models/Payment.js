const mongoose = require('mongoose');

/**
 * Payment Model
 * Handles payment attribution from multiple sources (Stripe, Omella, ClassWallet)
 * Maps batch transfers to individual student enrollments
 */

const paymentAllocationSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  forPeriod: {
    month: Number,
    year: Number
  },
  notes: String
});

const paymentSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  
  // Payment Source Information
  source: {
    type: String,
    enum: ['stripe', 'omella', 'classwallet', 'check', 'cash', 'ach', 'wire', 'other'],
    required: true
  },
  
  // External IDs for tracking
  externalTransactionId: String,  // Stripe payment intent ID, Omella transaction ID, etc.
  externalPayerId: String,        // Customer ID in external system
  batchId: String,                // For batch/tranche tracking
  batchTransferDate: Date,        // When batch was transferred to school's bank
  
  // Payment Details
  totalAmount: {
    type: Number,
    required: true
  },
  
  fees: {
    type: Number,
    default: 0
  },
  
  netAmount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Payment Dates
  paymentDate: {
    type: Date,
    required: true  // When family made payment
  },
  
  receivedDate: Date,  // When school received money (batch transfer date)
  
  processedDate: Date,  // When we processed/allocated the payment
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'ach', 'check', 'cash', 'esa-voucher', 'wire'],
    required: true
  },
  
  last4: String,  // Last 4 of card/account
  
  // Attribution to Students
  allocations: [paymentAllocationSchema],
  
  // Attribution Status
  attributionStatus: {
    type: String,
    enum: ['auto-matched', 'manual-matched', 'needs-review', 'unmatched', 'split-payment'],
    default: 'needs-review'
  },
  
  attributionConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  
  attributionMethod: {
    type: String,
    enum: ['exact-match', 'family-match', 'amount-match', 'manual', 'ai-suggested']
  },
  
  // Reconciliation
  reconciledToBank: {
    type: Boolean,
    default: false
  },
  reconciledDate: Date,
  
  syncedToQuickBooks: {
    type: Boolean,
    default: false
  },
  quickBooksTransactionId: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'allocated', 'reconciled', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Notes & Metadata
  notes: String,
  internalNotes: String,
  
  // Metadata from payment processor
  metadata: mongoose.Schema.Types.Mixed,
  
  // For manual review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // Refund tracking
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date,
  refundReason: String
}, {
  timestamps: true
});

// Method: Auto-attribute payment to enrollments
paymentSchema.methods.autoAttributePayment = async function() {
  const Family = mongoose.model('Family');
  const Enrollment = mongoose.model('Enrollment');
  
  try {
    // Get family's active enrollments
    const enrollments = await Enrollment.find({
      familyId: this.familyId,
      status: 'active',
      schoolId: this.schoolId
    }).populate('studentId');
    
    if (enrollments.length === 0) {
      this.attributionStatus = 'unmatched';
      this.attributionConfidence = 0;
      return this.save();
    }
    
    // Calculate total monthly tuition for this family
    const totalMonthlyTuition = enrollments.reduce((sum, e) => sum + e.monthlyTuition, 0);
    
    // Strategy 1: Exact match (payment equals total monthly tuition)
    if (Math.abs(this.netAmount - totalMonthlyTuition) < 1) {
      this.allocations = enrollments.map(enrollment => ({
        enrollmentId: enrollment._id,
        studentId: enrollment.studentId._id,
        amount: enrollment.monthlyTuition,
        forPeriod: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      }));
      
      this.attributionStatus = 'auto-matched';
      this.attributionMethod = 'exact-match';
      this.attributionConfidence = 0.99;
      
      // Update enrollment payment records
      for (const enrollment of enrollments) {
        await enrollment.recordPayment(enrollment.monthlyTuition, this.paymentDate);
      }
      
      return this.save();
    }
    
    // Strategy 2: Single student match
    if (enrollments.length === 1) {
      const enrollment = enrollments[0];
      
      this.allocations = [{
        enrollmentId: enrollment._id,
        studentId: enrollment.studentId._id,
        amount: this.netAmount,
        forPeriod: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      }];
      
      this.attributionStatus = 'auto-matched';
      this.attributionMethod = 'family-match';
      this.attributionConfidence = 0.95;
      
      await enrollment.recordPayment(this.netAmount, this.paymentDate);
      
      return this.save();
    }
    
    // Strategy 3: Partial payment or multiple months
    // Check if payment is a multiple of monthly tuition (e.g., 3 months prepaid)
    const monthsMultiple = Math.round(this.netAmount / totalMonthlyTuition);
    if (monthsMultiple > 1 && monthsMultiple <= 12 && 
        Math.abs(this.netAmount - (totalMonthlyTuition * monthsMultiple)) < 1) {
      
      // Allocate across multiple months
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      this.allocations = [];
      for (let month = 0; month < monthsMultiple; month++) {
        for (const enrollment of enrollments) {
          const periodMonth = ((currentMonth + month - 1) % 12) + 1;
          const periodYear = currentYear + Math.floor((currentMonth + month - 1) / 12);
          
          this.allocations.push({
            enrollmentId: enrollment._id,
            studentId: enrollment.studentId._id,
            amount: enrollment.monthlyTuition,
            forPeriod: {
              month: periodMonth,
              year: periodYear
            }
          });
        }
      }
      
      this.attributionStatus = 'auto-matched';
      this.attributionMethod = 'amount-match';
      this.attributionConfidence = 0.90;
      
      // Record first month payment for each enrollment
      for (const enrollment of enrollments) {
        await enrollment.recordPayment(enrollment.monthlyTuition, this.paymentDate);
      }
      
      return this.save();
    }
    
    // Strategy 4: Needs manual review
    this.attributionStatus = 'needs-review';
    this.attributionConfidence = 0.50;
    
    // Suggest allocation proportional to tuition
    this.allocations = enrollments.map(enrollment => {
      const proportion = enrollment.monthlyTuition / totalMonthlyTuition;
      return {
        enrollmentId: enrollment._id,
        studentId: enrollment.studentId._id,
        amount: this.netAmount * proportion,
        forPeriod: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        },
        notes: 'AI suggested allocation - needs review'
      };
    });
    
    return this.save();
    
  } catch (error) {
    console.error('Auto-attribution error:', error);
    this.attributionStatus = 'unmatched';
    return this.save();
  }
};

// Method: Manual allocation by staff
paymentSchema.methods.manuallyAllocate = async function(allocations, reviewedBy) {
  const Enrollment = mongoose.model('Enrollment');
  
  this.allocations = allocations;
  this.attributionStatus = 'manual-matched';
  this.attributionMethod = 'manual';
  this.attributionConfidence = 1.0;
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  
  // Update each enrollment
  for (const allocation of allocations) {
    const enrollment = await Enrollment.findById(allocation.enrollmentId);
    if (enrollment) {
      await enrollment.recordPayment(allocation.amount, this.paymentDate);
    }
  }
  
  this.status = 'allocated';
  return this.save();
};

// Indexes for efficient queries
paymentSchema.index({ schoolId: 1, status: 1 });
paymentSchema.index({ schoolId: 1, familyId: 1, paymentDate: -1 });
paymentSchema.index({ schoolId: 1, attributionStatus: 1 });
paymentSchema.index({ externalTransactionId: 1 });
paymentSchema.index({ batchId: 1 });
paymentSchema.index({ schoolId: 1, source: 1, receivedDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);

