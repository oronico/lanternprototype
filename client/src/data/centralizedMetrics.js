/**
 * Centralized Metrics - Single Source of Truth
 * 
 * ALL components pull from this to ensure consistency across:
 * - Dashboard
 * - Command Center  
 * - Operational Metrics
 * - Cash Flow
 * - Reports
 * - SIS
 * - Staff Management
 * - Enterprise Dashboard
 * 
 * Based on 24 enrolled students across 3 programs
 */

import { DEMO_STUDENTS as STUDENTS_DATA, PROGRAMS as PROGRAMS_DATA, TEACHERS as TEACHERS_DATA, calculateEnrollmentMetrics } from './demoStudents';

// Re-export for components to use
export { STUDENTS_DATA as DEMO_STUDENTS, PROGRAMS_DATA as PROGRAMS, TEACHERS_DATA as TEACHERS };

// Calculate from actual student data
const enrollmentMetrics = calculateEnrollmentMetrics(STUDENTS_DATA);

// ENROLLMENT METRICS (Used everywhere)
export const ENROLLMENT = {
  current: 24, // Total enrolled students
  capacity: 48, // Total capacity (16+12+20)
  utilization: 50, // 24/48 = 50%
  waitlist: 8,
  target: 35, // Goal for this year
  goalProgress: 69, // 24/35 = 69%
  enrollmentToGoalPercent: 69, // Same as goalProgress, explicit metric
  
  byProgram: {
    'fullTime': { enrolled: 10, capacity: 16, utilization: 63 },
    'partTime': { enrolled: 8, capacity: 12, utilization: 67 },
    'afterSchool': { enrolled: 6, capacity: 20, utilization: 30 }
  },
  
  ytdGrowth: 12, // +12% this year
  monthlyGrowth: 2, // +2 students this month
  retentionRate: 92, // 92% of students returned this year
  attritionRate: 8 // 8% left
};

// ATTENDANCE METRICS (Calculated from students)
export const ATTENDANCE = {
  todayRate: 96, // Today's attendance (will update daily)
  ytdRate: 97, // Year-to-date average
  thisWeekRate: 96,
  lastWeekRate: 98,
  goal: 95,
  goalAchieved: true,
  
  totalAbsences: 32, // Sum of all student absences
  totalTardies: 19,
  perfectAttendance: 4, // Students with 100%
  belowGoal: 2, // Students <95%
  
  needsFollowUp: [
    { studentId: 'stu_019', name: 'Ethan Brown', absences: 4, phone: '555-0801' },
    { studentId: 'stu_023', name: 'Evelyn Jackson', absences: 6, phone: '555-1901' }
  ]
};

// FINANCIAL METRICS (Master numbers)
export const FINANCIAL = {
  // Accounting Method (Most schools use cash basis)
  accountingMethod: 'cash', // 'cash' or 'accrual'
  
  // Cash Position
  operatingCash: 14200, // Checking account (operating funds)
  savingsCash: 8500, // Savings account (reserve)
  totalCash: 22700, // Total = operating + savings
  daysCash: 22, // Days of operating expenses covered
  cashGoal: 30,
  cashReserveProgress: 73, // 22/30 = 73%
  
  // Monthly P&L (Cash Basis - revenue when received, expenses when paid)
  monthlyRevenue: 19774, // Sum of all student tuition RECEIVED
  monthlyExpenses: 17650, // Expenses PAID this month
  netIncome: 2124,
  profitMargin: 11, // 2124/19774 = 11%
  
  // Debt Service Coverage Ratio (DSCR)
  debtPayments: 1850, // Monthly debt service (if any)
  dscr: 1.15, // (Net Income + Debt Payments) / Debt Payments = (2124+1850)/1850 = 2.15 (simplified for demo)
  
  // Budget Variance
  budgetedRevenue: 20800,
  budgetVariance: -1026, // 19774 - 20800 = -1026 (under budget)
  budgetVariancePercent: -5 // -1026/20800 = -5%
  
  // Revenue Detail
  tuitionRevenue: 19774,
  otherRevenue: 0,
  
  // Expense Detail
  facilityExpenses: 5967, // Lease + utilities + insurance + vendors
  staffExpenses: 6667, // W-2 payroll (2 teachers)
  contractorExpenses: 500, // 1099 bookkeeper
  operatingExpenses: 4516, // Supplies, materials, etc.
  
  // Payment Status
  outstandingReceivables: 400, // 1 family past due
  collectionRate: 98, // 23/24 paying on time
  
  // Annual Projections
  annualRevenue: 237288, // 19774 × 12
  annualExpenses: 211800,
  annualProfit: 25488,
  
  // Health Score
  healthScore: 72, // Overall financial health (0-100)
  healthStatus: 'good' // excellent (85+), good (70-84), warning (55-69), critical (<55)
};

// STAFF METRICS (Payroll data)
export const STAFF = {
  total: 4,
  w2Employees: 2,
  contractors1099: 2,
  
  monthlyPayroll: 6667, // W-2 gross payroll
  monthlyContractors: 500,
  totalLaborCost: 7167,
  
  ytdPayroll: 66670,
  ytdTaxes: 14400,
  
  staffingRatio: 0.36, // Labor cost / revenue = 36%
  staffingGoal: 0.45,
  onTrack: true,
  
  turnover: 0, // 0% turnover this year
  openPositions: 0
};

// FACILITY METRICS (All facility costs)
export const FACILITY = {
  monthlyLease: 4500, // Base + CAM + taxes + insurance
  monthlyUtilities: 850,
  monthlyInsurance: 1225,
  monthlyVendors: 1275, // Janitorial, HVAC, etc.
  monthlyMaintenance: 200,
  
  totalMonthlyCost: 8050,
  annualCost: 96600,
  
  facilityBurden: 0.41, // 8050 / 19774 = 41% of revenue (Rent to Revenue %)
  rentToRevenue: 0.23, // 4500 / 19774 = 23% (just rent portion)
  facilityGoal: 0.20,
  needsImprovement: true,
  
  costPerStudent: 335, // 8050 / 24
  costPerSqFt: 28.13,
  marketRate: 22,
  aboveMarket: true,
  
  // Facility Occupancy
  squareFootage: 1600,
  optimalSqFtPerStudent: 50, // Industry standard
  currentSqFtPerStudent: 67, // 1600 / 24 = 67
  facilityOccupancy: 48, // 24 students / (1600/50 optimal) = 48% of optimal capacity
  facilityCapacityUtilization: 50 // Same as enrollment utilization
};

// OPERATIONAL METRICS
export const OPERATIONS = {
  contractCoverage: 88, // 21/24 have all contracts (88%)
  contractGoal: 95,
  missingContracts: 3,
  
  onTimePayment: 96, // 23/24 paying on time
  paymentGoal: 95,
  pastDue: 1,
  
  utilizationOverall: 50, // 24/48 capacity
  utilizationGoal: 85,
  availableSpots: 24,
  
  programs: {
    total: 3,
    underutilized: 1 // After-school at 30%
  }
};

// PROGRAM METRICS (Matches student data)
export const PROGRAM_METRICS = {
  'prog_001': {
    name: '5-Day Full-Time',
    enrolled: 10,
    capacity: 16,
    utilization: 63,
    monthlyRevenue: 11820, // Sum of 10 students' tuition
    teacher: 'Ms. Sarah Thompson',
    avgAttendance: 98
  },
  'prog_002': {
    name: '3-Day Part-Time',
    enrolled: 8,
    capacity: 12,
    utilization: 67,
    monthlyRevenue: 5554, // Sum of 8 students' tuition
    teacher: 'Mr. David Kim',
    avgAttendance: 97
  },
  'prog_003': {
    name: 'After-School Program',
    enrolled: 6,
    capacity: 20,
    utilization: 30,
    monthlyRevenue: 2400, // Sum of 6 students' tuition
    teacher: 'Mr. David Kim',
    avgAttendance: 94
  }
};

// PAYMENT ENGINE METRICS
export const PAYMENT_ENGINES = {
  classwallet: {
    monthlyVolume: 7908, // Martinez (2) + Taylor (2) families
    transactionCount: 4,
    percentOfRevenue: 40
  },
  stripe: {
    monthlyVolume: 11466, // Remaining families
    transactionCount: 19,
    percentOfRevenue: 58
  },
  manual: {
    monthlyVolume: 400, // Jackson family (past due)
    transactionCount: 1,
    percentOfRevenue: 2
  }
};

// STREAKS & GAMIFICATION
export const GAMIFICATION = {
  streaks: {
    dailyLogin: 15,
    attendanceTaken: 12,
    enrollmentProgress: 8,
    cashReserveBuilding: 22
  },
  
  goals: {
    enrollment: {
      current: 24,
      target: 35,
      progress: 69,
      achieved: false
    },
    attendance: {
      current: 97,
      target: 95,
      progress: 100,
      achieved: true
    },
    cashReserve: {
      current: 22,
      target: 30,
      progress: 73,
      achieved: false
    },
    financialHealth: {
      current: 72,
      target: 85,
      progress: 85,
      achieved: false
    }
  }
};

// ALERTS & NUDGES (Auto-generated from data)
export const generateNudges = () => {
  const nudges = [];
  
  // Missing contracts
  const missingDocs = STUDENTS_DATA.filter(s => s.documents.missingDocuments.length > 0);
  missingDocs.forEach(student => {
    nudges.push({
      type: 'contract',
      priority: 'high',
      title: `Missing ${student.documents.missingDocuments[0]} - ${student.studentInfo.firstName} ${student.studentInfo.lastName}`,
      family: student.familyName,
      action: 'Send Document',
      email: student.guardians[0].email
    });
  });
  
  // Attendance issues
  ATTENDANCE.needsFollowUp.forEach(student => {
    nudges.push({
      type: 'attendance',
      priority: 'high',
      title: `Call ${student.name}'s Family`,
      description: `${student.absences} absences - check in with family`,
      action: 'Call',
      phone: student.phone
    });
  });
  
  // Past due payments
  const pastDue = STUDENTS_DATA.filter(s => s.tuition.paymentStatus === 'pastDue');
  pastDue.forEach(student => {
    nudges.push({
      type: 'payment',
      priority: 'urgent',
      title: `Payment Past Due - ${student.familyName} Family`,
      amount: student.tuition.finalTuition,
      action: 'Send Reminder',
      email: student.guardians[0].email,
      phone: student.guardians[0].phone
    });
  });
  
  // Enrollment goal progress
  if (ENROLLMENT.goalProgress < 100) {
    nudges.push({
      type: 'enrollment',
      priority: 'medium',
      title: `${ENROLLMENT.target - ENROLLMENT.current} More Students for Full Enrollment!`,
      description: `You're ${ENROLLMENT.goalProgress}% there! 5 families in pipeline.`,
      action: 'View Recruitment'
    });
  }
  
  // Under-utilized programs
  Object.values(PROGRAM_METRICS).forEach(program => {
    if (program.utilization < 50) {
      nudges.push({
        type: 'enrollment',
        priority: 'medium',
        title: `${program.name} Only ${program.utilization}% Full`,
        description: `${program.capacity - program.enrolled} spots available`,
        action: 'Market Program'
      });
    }
  });
  
  // Cash reserve progress
  if (FINANCIAL.daysCash < FINANCIAL.cashGoal) {
    const daysNeeded = FINANCIAL.cashGoal - FINANCIAL.daysCash;
    nudges.push({
      type: 'financial',
      priority: 'medium',
      title: `Building Cash Reserve: ${FINANCIAL.cashReserveProgress}%`,
      description: `${daysNeeded} more days to reach 30-day goal`,
      action: 'View Cash Flow'
    });
  }
  
  return nudges;
};

// DAILY SNAPSHOT (For Command Center and Dashboard)
export const DAILY_SNAPSHOT = {
  date: new Date().toLocaleDateString(),
  enrollment: ENROLLMENT.current,
  attendanceToday: ATTENDANCE.todayRate,
  cashBalance: FINANCIAL.cashBalance,
  urgentItems: generateNudges().filter(n => n.priority === 'urgent').length,
  actionItems: generateNudges().length,
  monthlyRevenue: FINANCIAL.monthlyRevenue,
  daysCash: FINANCIAL.daysCash,
  healthScore: FINANCIAL.healthScore
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to format percentage
export const formatPercent = (decimal) => {
  return `${Math.round(decimal * 100)}%`;
};

