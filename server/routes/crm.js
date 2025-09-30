const express = require('express');
const router = express.Router();

// Family/Student CRM - Connects Enrollment → Contracts → Payments → Students
const familyRecords = [
  {
    id: 'family_001',
    familyName: 'Johnson',
    primaryContact: {
      name: 'Michael Johnson',
      email: 'mjohnson@email.com',
      phone: '555-0101',
      preferredContact: 'email'
    },
    secondaryContact: {
      name: 'Sarah Johnson',
      email: 'sjohnson@email.com',
      phone: '555-0102'
    },
    
    // Students linked to this family
    students: [
      {
        id: 'student_001',
        firstName: 'Emma',
        lastName: 'Johnson',
        dateOfBirth: '2015-03-15',
        grade: '3rd',
        startDate: '2023-08-15',
        status: 'active',
        esaEligible: true,
        academicNotes: 'Advanced in math, needs support in reading',
        medicalNotes: 'No allergies',
        emergencyContact: '555-0199'
      },
      {
        id: 'student_002',
        firstName: 'Liam',
        lastName: 'Johnson',
        dateOfBirth: '2017-09-22',
        grade: '1st',
        startDate: '2023-08-15',
        status: 'active',
        esaEligible: true,
        academicNotes: 'On track, loves science',
        medicalNotes: 'Peanut allergy',
        emergencyContact: '555-0199'
      }
    ],
    
    // Linked contract
    contract: {
      contractId: 'contract_001',
      type: 'annual_enrollment',
      startDate: '2024-08-15',
      endDate: '2025-06-15',
      status: 'signed',
      signedDate: '2024-08-18',
      monthlyTuition: 1166,
      studentCount: 2,
      esaCoverage: 1334, // $667 per student
      familyContribution: 0, // Fully ESA covered
      siblingDiscount: true,
      discountAmount: 168 // $84 per student
    },
    
    // Payment history
    payments: {
      paymentMethod: 'ClassWallet',
      paymentSchedule: 'monthly',
      dueDay: 1,
      autoPayEnabled: true,
      paymentHistory: [
        { date: '2024-11-01', amount: 1166, status: 'paid', daysLate: 0, method: 'ClassWallet', trancheId: 'tranche_001' },
        { date: '2024-10-01', amount: 1166, status: 'paid', daysLate: 3, method: 'ClassWallet', trancheId: 'tranche_oct' },
        { date: '2024-09-01', amount: 1166, status: 'paid', daysLate: 0, method: 'ClassWallet', trancheId: 'tranche_sep' }
      ],
      totalPaid: 3498,
      totalDue: 11660, // 10-month contract
      paymentStatus: 'current',
      nextPaymentDue: '2024-12-01',
      averageDaysLate: 1
    },
    
    // Enrollment journey
    enrollmentPipeline: {
      inquiryDate: '2023-05-15',
      inquirySource: 'Word of Mouth',
      tourDate: '2023-05-20',
      applicationDate: '2023-06-01',
      acceptanceDate: '2023-06-10',
      enrollmentDate: '2023-08-15',
      reEnrollmentStatus: 'committed_2025',
      reEnrollmentDate: '2024-02-15'
    },
    
    // Family health & risk
    familyHealth: {
      overallStatus: 'excellent',
      paymentRisk: 'low',
      retentionRisk: 'low',
      satisfactionScore: 9.5, // Out of 10
      lastCheckIn: '2024-10-15',
      concernsRaised: [],
      strengths: ['Engaged parents', 'ESA funding stable', 'Students thriving']
    },
    
    // Communication log
    communications: [
      { date: '2024-10-15', type: 'check_in', subject: 'Monthly family check-in', outcome: 'Very satisfied, re-enrolling' },
      { date: '2024-09-01', type: 'email', subject: 'September tuition reminder', outcome: 'Paid on time' }
    ]
  },
  
  {
    id: 'family_007',
    familyName: 'Roberts',
    primaryContact: {
      name: 'David Roberts',
      email: 'droberts@email.com',
      phone: '555-0701',
      preferredContact: 'phone'
    },
    
    students: [
      {
        id: 'student_007',
        firstName: 'Chloe',
        lastName: 'Roberts',
        dateOfBirth: '2014-06-10',
        grade: '4th',
        startDate: '2022-08-15',
        status: 'active',
        esaEligible: true,
        academicNotes: 'Struggling with math - needs intervention',
        concernFlags: ['academic_performance']
      },
      {
        id: 'student_008',
        firstName: 'Dylan',
        lastName: 'Roberts',
        dateOfBirth: '2016-11-03',
        grade: '2nd',
        startDate: '2022-08-15',
        status: 'active',
        esaEligible: true,
        academicNotes: 'On track'
      }
    ],
    
    contract: {
      contractId: 'contract_007',
      type: 'annual_enrollment',
      startDate: '2024-08-15',
      endDate: '2025-06-15',
      status: 'signed',
      monthlyTuition: 1166,
      studentCount: 2
    },
    
    payments: {
      paymentMethod: 'ClassWallet',
      paymentSchedule: 'monthly',
      dueDay: 1,
      autoPayEnabled: false, // Red flag!
      paymentHistory: [
        { date: '2024-10-01', amount: 1166, status: 'late', daysLate: 45, method: 'ClassWallet' },
        { date: '2024-09-01', amount: 1166, status: 'late', daysLate: 25, method: 'ClassWallet' },
        { date: '2024-08-01', amount: 1166, status: 'late', daysLate: 15, method: 'ClassWallet' }
      ],
      paymentStatus: 'at_risk',
      nextPaymentDue: '2024-11-01',
      averageDaysLate: 28,
      totalOutstanding: 1166
    },
    
    familyHealth: {
      overallStatus: 'at_risk',
      paymentRisk: 'high',
      retentionRisk: 'high',
      satisfactionScore: 6.0,
      lastCheckIn: '2024-09-20',
      concernsRaised: ['ESA processing delays', 'Student academic struggles'],
      actionNeeded: 'Immediate family meeting + academic support plan'
    },
    
    communications: [
      { date: '2024-11-10', type: 'email', subject: '45-day late notice', outcome: 'No response' },
      { date: '2024-11-05', type: 'phone', subject: 'Payment check-in', outcome: 'ESA delay, family stressed' },
      { date: '2024-09-20', type: 'meeting', subject: 'Academic concerns', outcome: 'Discussed intervention plan' }
    ]
  }
];

// GET /api/crm/families
router.get('/families', (req, res) => {
  try {
    const { status, paymentRisk, retentionRisk } = req.query;
    
    let filtered = familyRecords;
    
    if (status) {
      filtered = filtered.filter(f => f.familyHealth.overallStatus === status);
    }
    
    if (paymentRisk) {
      filtered = filtered.filter(f => f.familyHealth.paymentRisk === paymentRisk);
    }
    
    if (retentionRisk) {
      filtered = filtered.filter(f => f.familyHealth.retentionRisk === retentionRisk);
    }
    
    const summary = {
      totalFamilies: familyRecords.length,
      totalStudents: familyRecords.reduce((sum, f) => sum + f.students.length, 0),
      excellentHealth: familyRecords.filter(f => f.familyHealth.overallStatus === 'excellent').length,
      atRisk: familyRecords.filter(f => f.familyHealth.overallStatus === 'at_risk').length,
      paymentIssues: familyRecords.filter(f => f.familyHealth.paymentRisk === 'high').length,
      retentionConcerns: familyRecords.filter(f => f.familyHealth.retentionRisk === 'high').length,
      esaFamilies: familyRecords.filter(f => f.students.some(s => s.esaEligible)).length,
      averageSatisfaction: (familyRecords.reduce((sum, f) => sum + (f.familyHealth.satisfactionScore || 0), 0) / familyRecords.length).toFixed(1)
    };
    
    res.json({
      families: filtered,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family records' });
  }
});

// GET /api/crm/family/:id
router.get('/family/:id', (req, res) => {
  try {
    const { id } = req.params;
    const family = familyRecords.find(f => f.id === id);
    
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }
    
    // Enrich with calculated fields
    const enrichedFamily = {
      ...family,
      calculated: {
        lifetimeValue: calculateLifetimeValue(family),
        monthsEnrolled: calculateMonthsEnrolled(family),
        paymentReliability: calculatePaymentReliability(family),
        retentionProbability: calculateRetentionProbability(family),
        studentProgressSummary: summarizeStudentProgress(family.students)
      },
      nextActions: generateNextActions(family)
    };
    
    res.json(enrichedFamily);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family details' });
  }
});

// POST /api/crm/family
router.post('/family', (req, res) => {
  try {
    const { 
      familyName, 
      primaryContact, 
      students, 
      inquirySource,
      esaEligible 
    } = req.body;
    
    const newFamily = {
      id: `family_${Date.now()}`,
      familyName,
      primaryContact,
      students: students.map((student, index) => ({
        id: `student_${Date.now()}_${index}`,
        ...student,
        status: 'prospect',
        startDate: null
      })),
      enrollmentPipeline: {
        inquiryDate: new Date().toISOString(),
        inquirySource,
        stage: 'inquiry'
      },
      familyHealth: {
        overallStatus: 'new',
        paymentRisk: 'unknown',
        retentionRisk: 'unknown'
      },
      communications: []
    };
    
    res.json({
      success: true,
      family: newFamily,
      nextSteps: [
        'Schedule tour within 48 hours',
        'Send welcome email with school info',
        'Prepare tour materials',
        'Follow up after tour'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family record' });
  }
});

// Helper Functions
function calculateLifetimeValue(family) {
  const monthsEnrolled = calculateMonthsEnrolled(family);
  const avgMonthlyTuition = family.contract?.monthlyTuition || 0;
  const projectedMonths = 36; // Average 3-year enrollment
  
  return {
    toDate: monthsEnrolled * avgMonthlyTuition,
    projected: projectedMonths * avgMonthlyTuition,
    retentionAdjusted: projectedMonths * avgMonthlyTuition * (family.familyHealth.retentionRisk === 'low' ? 0.95 : 0.70)
  };
}

function calculateMonthsEnrolled(family) {
  if (!family.students[0]?.startDate) return 0;
  const start = new Date(family.students[0].startDate);
  const now = new Date();
  return Math.round((now - start) / (1000 * 60 * 60 * 24 * 30));
}

function calculatePaymentReliability(family) {
  const history = family.payments?.paymentHistory || [];
  if (history.length === 0) return 'unknown';
  
  const avgDaysLate = history.reduce((sum, p) => sum + (p.daysLate || 0), 0) / history.length;
  
  if (avgDaysLate === 0) return 'excellent';
  if (avgDaysLate < 5) return 'good';
  if (avgDaysLate < 15) return 'fair';
  return 'poor';
}

function calculateRetentionProbability(family) {
  let score = 85; // Base retention rate
  
  // Payment factors
  if (family.familyHealth.paymentRisk === 'high') score -= 30;
  else if (family.familyHealth.paymentRisk === 'medium') score -= 15;
  
  // Satisfaction factors
  if (family.familyHealth.satisfactionScore) {
    score += (family.familyHealth.satisfactionScore - 7) * 3;
  }
  
  // ESA families have higher retention
  if (family.students.some(s => s.esaEligible)) score += 5;
  
  // Academic concerns
  if (family.students.some(s => s.concernFlags?.includes('academic_performance'))) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function summarizeStudentProgress(students) {
  return students.map(student => ({
    name: `${student.firstName} ${student.lastName}`,
    grade: student.grade,
    status: student.status,
    concerns: student.concernFlags || [],
    strengths: student.academicNotes
  }));
}

function generateNextActions(family) {
  const actions = [];
  
  // Payment-based actions
  if (family.familyHealth.paymentRisk === 'high') {
    actions.push({
      priority: 'urgent',
      action: 'Schedule family meeting to address payment delays',
      category: 'financial',
      dueDate: 'immediate'
    });
  }
  
  // Academic-based actions
  if (family.students.some(s => s.concernFlags?.includes('academic_performance'))) {
    actions.push({
      priority: 'high',
      action: 'Implement academic intervention plan',
      category: 'academic',
      dueDate: 'this_week'
    });
  }
  
  // Re-enrollment actions
  const enrollmentMonths = calculateMonthsEnrolled(family);
  if (enrollmentMonths > 6 && enrollmentMonths < 9) {
    actions.push({
      priority: 'medium',
      action: 'Begin re-enrollment conversation',
      category: 'retention',
      dueDate: 'next_30_days'
    });
  }
  
  return actions;
}

module.exports = router;
