const mongoose = require('mongoose');

/**
 * Program Model
 * Supports multiple enrollment types: 3-day, 5-day, full-time, online, etc.
 * Handles capacity management and utilization tracking
 */

const scheduleSlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: String, // e.g. "8:00 AM"
  endTime: String,   // e.g. "3:00 PM"
  capacity: Number   // Capacity for this specific slot
});

const pricingTierSchema = new mongoose.Schema({
  name: String, // e.g. "Income Tier 1: $0-50K"
  description: String,
  pricePerMonth: Number,
  pricePerDay: Number, // For drop-in programs
  pricePerHour: Number, // For hourly programs
  incomeMin: Number,
  incomeMax: Number,
  isDefault: { type: Boolean, default: false }
});

const discountRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sibling', 'staff', 'early-bird', 'referral', 'scholarship', 'custom'],
    required: true
  },
  name: String, // e.g. "Second Child Discount"
  discountType: {
    type: String,
    enum: ['percentage', 'fixed-amount'],
    default: 'percentage'
  },
  discountValue: Number, // 10 (for 10%) or 100 (for $100 off)
  
  // Conditional logic
  appliesTo: {
    type: String,
    enum: ['all-siblings', 'second-child', 'third-plus', 'specific-child', 'all-staff'],
    default: 'all-siblings'
  },
  
  // Stacking rules
  canStackWithOther: { type: Boolean, default: true },
  maxDiscountPercent: Number, // e.g. 50% max even if multiple discounts
  
  // Activation
  isActive: { type: Boolean, default: true },
  validFrom: Date,
  validTo: Date
});

const programSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Program Basics
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'drop-in', 'online', 'hybrid', 'after-school', 'summer', 'custom'],
    required: true
  },
  description: String,
  ageMin: Number,
  ageMax: Number,
  
  // Schedule Configuration
  scheduleType: {
    type: String,
    enum: ['days-per-week', 'specific-days', 'flexible', 'sessions'],
    default: 'days-per-week'
  },
  daysPerWeek: Number, // For "3-day program", "5-day program", etc.
  specificSchedule: [scheduleSlotSchema], // For programs with specific day/time slots
  
  // Capacity Management
  totalCapacity: {
    type: Number,
    required: true
  },
  currentEnrollment: {
    type: Number,
    default: 0
  },
  waitlistCount: {
    type: Number,
    default: 0
  },
  
  // Per-Day Capacity (for programs with varying daily attendance)
  dailyCapacity: [{
    dayOfWeek: String,
    capacity: Number,
    currentEnrollment: Number
  }],
  
  // Pricing
  basePriceMonthly: Number,
  basePriceAnnual: Number,
  hasSlidingScale: {
    type: Boolean,
    default: false
  },
  slidingScaleTiers: [pricingTierSchema],
  
  // Discounts
  discountRules: [discountRuleSchema],
  
  // Financial Tracking
  projectedMonthlyRevenue: Number,
  actualMonthlyRevenue: Number,
  averageTuitionPerStudent: Number,
  
  // Enrollment Settings
  enrollmentOpen: {
    type: Boolean,
    default: true
  },
  enrollmentStartDate: Date,
  enrollmentEndDate: Date,
  maxWaitlist: Number,
  
  // Academic Calendar
  startDate: Date,
  endDate: Date,
  sessionLength: Number, // in weeks
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual: Utilization Rate
programSchema.virtual('utilizationRate').get(function() {
  if (!this.totalCapacity || this.totalCapacity === 0) return 0;
  return (this.currentEnrollment / this.totalCapacity) * 100;
});

// Virtual: Available Spots
programSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.totalCapacity - this.currentEnrollment);
});

// Virtual: Is Full
programSchema.virtual('isFull').get(function() {
  return this.currentEnrollment >= this.totalCapacity;
});

// Method: Calculate tuition for a family
programSchema.methods.calculateTuition = function(familyIncome, studentCount, hasStaffDiscount = false) {
  let tuition = this.basePriceMonthly;
  
  // Apply sliding scale if applicable
  if (this.hasSlidingScale && familyIncome) {
    const tier = this.slidingScaleTiers.find(t => 
      familyIncome >= (t.incomeMin || 0) && 
      familyIncome <= (t.incomeMax || Infinity)
    );
    if (tier) {
      tuition = tier.pricePerMonth;
    }
  }
  
  let totalDiscount = 0;
  let discounts = [];
  
  // Apply staff discount
  if (hasStaffDiscount) {
    const staffDiscount = this.discountRules.find(r => r.type === 'staff' && r.isActive);
    if (staffDiscount) {
      const discount = staffDiscount.discountType === 'percentage' 
        ? tuition * (staffDiscount.discountValue / 100)
        : staffDiscount.discountValue;
      totalDiscount += discount;
      discounts.push({ type: 'staff', amount: discount });
    }
  }
  
  // Apply sibling discounts
  if (studentCount > 1) {
    const siblingDiscount = this.discountRules.find(r => r.type === 'sibling' && r.isActive);
    if (siblingDiscount) {
      // Apply to 2nd child onwards
      for (let i = 2; i <= studentCount; i++) {
        const discount = siblingDiscount.discountType === 'percentage'
          ? tuition * (siblingDiscount.discountValue / 100)
          : siblingDiscount.discountValue;
        totalDiscount += discount;
        discounts.push({ type: 'sibling', child: i, amount: discount });
      }
    }
  }
  
  // Apply max discount cap if set
  const maxDiscountRule = this.discountRules.find(r => r.maxDiscountPercent);
  if (maxDiscountRule) {
    const maxDiscount = tuition * (maxDiscountRule.maxDiscountPercent / 100);
    totalDiscount = Math.min(totalDiscount, maxDiscount);
  }
  
  return {
    baseTuition: tuition,
    totalDiscount,
    finalTuition: Math.max(0, tuition - totalDiscount),
    discountsApplied: discounts
  };
};

// Method: Update enrollment count
programSchema.methods.updateEnrollment = async function() {
  const Enrollment = mongoose.model('Enrollment');
  const activeCount = await Enrollment.countDocuments({
    programId: this._id,
    status: 'active'
  });
  
  this.currentEnrollment = activeCount;
  
  // Calculate actual revenue
  const enrollments = await Enrollment.find({ programId: this._id, status: 'active' })
    .populate('studentId');
  
  this.actualMonthlyRevenue = enrollments.reduce((sum, e) => sum + (e.monthlyTuition || 0), 0);
  this.averageTuitionPerStudent = activeCount > 0 ? this.actualMonthlyRevenue / activeCount : 0;
  
  return this.save();
};

// Indexes for performance
programSchema.index({ schoolId: 1, isActive: 1 });
programSchema.index({ schoolId: 1, type: 1 });
programSchema.index({ schoolId: 1, enrollmentOpen: 1 });

module.exports = mongoose.model('Program', programSchema);

