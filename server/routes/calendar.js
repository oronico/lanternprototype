const express = require('express');
const router = express.Router();

// Calendar & Contract Date Tracking System
const criticalDates = {
  leaseAgreements: [
    {
      id: 'lease_001',
      propertyAddress: '123 Education Way',
      leaseStartDate: '2024-01-01',
      leaseEndDate: '2026-12-31',
      monthlyRent: 4500,
      escalationDate: '2025-01-01',
      negotiationStartDate: '2026-06-30', // 6 months before expiration
      daysUntilNegotiation: 227,
      daysUntilExpiration: 407,
      status: 'active',
      alerts: [
        { type: 'info', message: 'Start lease negotiation in 227 days (June 30, 2026)', priority: 3 },
        { type: 'warning', message: 'First rent escalation in 47 days (+5%)', priority: 2 }
      ]
    }
  ],
  
  familyContracts: [
    {
      id: 'contract_001',
      familyName: 'Johnson Family',
      contractType: 'annual_enrollment',
      contractStartDate: '2024-08-15',
      contractEndDate: '2025-06-15',
      monthlyTuition: 1166,
      studentNames: ['Emma Johnson', 'Liam Johnson'],
      reEnrollmentDeadline: '2025-03-01',
      daysUntilReEnrollment: 107,
      daysUntilExpiration: 212,
      status: 'active',
      paymentStatus: 'current',
      alerts: [
        { type: 'info', message: 'Re-enrollment outreach begins in 107 days', priority: 3 }
      ]
    },
    {
      id: 'contract_007',
      familyName: 'Roberts Family',
      contractType: 'annual_enrollment',
      contractStartDate: '2024-08-15',
      contractEndDate: '2025-06-15',
      monthlyTuition: 1166,
      studentNames: ['Chloe Roberts', 'Dylan Roberts'],
      reEnrollmentDeadline: '2025-03-01',
      daysUntilReEnrollment: 107,
      daysUntilExpiration: 212,
      status: 'at_risk',
      paymentStatus: 'late',
      alerts: [
        { type: 'critical', message: '45 days late on payment - retention risk', priority: 1 },
        { type: 'warning', message: 'May not re-enroll - intervention needed', priority: 2 }
      ]
    }
  ],
  
  staffContracts: [
    {
      id: 'staff_001',
      staffName: 'Ms. Sarah Teacher',
      role: 'Lead Educator',
      contractStartDate: '2024-08-01',
      contractEndDate: '2025-07-31',
      annualSalary: 48000,
      renewalDeadline: '2025-04-01', // Offer renewal 3 months before end
      daysUntilRenewal: 137,
      daysUntilExpiration: 258,
      status: 'active',
      performanceStatus: 'excellent',
      retentionRisk: 'low',
      alerts: [
        { type: 'info', message: 'Prepare renewal offer in 137 days', priority: 3 }
      ]
    },
    {
      id: 'staff_002',
      staffName: 'Mr. John Assistant',
      role: 'Teaching Assistant',
      contractStartDate: '2024-08-01',
      contractEndDate: '2025-07-31',
      annualSalary: 36000,
      renewalDeadline: '2025-04-01',
      daysUntilRenewal: 137,
      daysUntilExpiration: 258,
      status: 'active',
      performanceStatus: 'good',
      retentionRisk: 'medium',
      alerts: [
        { type: 'warning', message: 'Has mentioned interest in other positions - retention conversation needed', priority: 2 }
      ]
    }
  ],
  
  insurancePolicies: [
    {
      id: 'insurance_001',
      policyType: 'General Liability',
      provider: 'Acme Insurance Co.',
      policyNumber: 'GL-123456',
      policyStartDate: '2024-01-01',
      policyEndDate: '2024-12-31',
      annualPremium: 3600,
      renewalDeadline: '2024-11-15', // 45 days before expiration
      daysUntilRenewal: -15, // Overdue!
      daysUntilExpiration: 30,
      status: 'renewal_overdue',
      alerts: [
        { type: 'critical', message: 'Renewal overdue - shop for quotes immediately!', priority: 1 }
      ]
    }
  ],
  
  complianceDates: [
    {
      id: 'compliance_001',
      complianceType: 'State License Renewal',
      description: 'Florida Private School License',
      dueDate: '2025-06-30',
      reminderDate: '2025-05-01', // 60 days before
      daysUntilReminder: 158,
      daysUntilDue: 218,
      status: 'pending',
      requirements: ['Updated enrollment count', 'Staff background checks', 'Facility inspection', 'Financial audit'],
      alerts: []
    }
  ]
};

// GET /api/calendar/critical-dates
router.get('/critical-dates', (req, res) => {
  try {
    const { dateRange, urgentOnly } = req.query;
    
    // Compile all critical dates
    const allDates = [
      ...criticalDates.leaseAgreements.map(l => ({
        type: 'lease',
        category: 'facility',
        title: `Lease Negotiation - ${l.propertyAddress}`,
        date: l.negotiationStartDate,
        daysUntil: l.daysUntilNegotiation,
        priority: l.daysUntilNegotiation < 60 ? 'critical' : l.daysUntilNegotiation < 180 ? 'high' : 'medium',
        action: 'Begin lease renegotiation process',
        ...l
      })),
      ...criticalDates.familyContracts.map(c => ({
        type: 'family_contract',
        category: 'enrollment',
        title: `Re-enrollment - ${c.familyName}`,
        date: c.reEnrollmentDeadline,
        daysUntil: c.daysUntilReEnrollment,
        priority: c.status === 'at_risk' ? 'critical' : c.daysUntilReEnrollment < 30 ? 'high' : 'medium',
        action: 'Send re-enrollment communication',
        ...c
      })),
      ...criticalDates.staffContracts.map(s => ({
        type: 'staff_contract',
        category: 'human_resources',
        title: `Staff Renewal - ${s.staffName}`,
        date: s.renewalDeadline,
        daysUntil: s.daysUntilRenewal,
        priority: s.retentionRisk === 'high' ? 'critical' : s.retentionRisk === 'medium' ? 'high' : 'medium',
        action: 'Prepare and present renewal offer',
        ...s
      })),
      ...criticalDates.insurancePolicies.map(i => ({
        type: 'insurance',
        category: 'compliance',
        title: `Insurance Renewal - ${i.policyType}`,
        date: i.renewalDeadline,
        daysUntil: i.daysUntilRenewal,
        priority: i.daysUntilRenewal < 0 ? 'critical' : i.daysUntilRenewal < 30 ? 'high' : 'medium',
        action: 'Shop for quotes and renew policy',
        ...i
      }))
    ];
    
    // Sort by urgency
    const sortedDates = allDates.sort((a, b) => a.daysUntil - b.daysUntil);
    
    // Filter urgent only if requested
    const filteredDates = urgentOnly 
      ? sortedDates.filter(d => d.priority === 'critical' || d.priority === 'high')
      : sortedDates;
    
    const summary = {
      totalCriticalDates: allDates.length,
      overdueItems: allDates.filter(d => d.daysUntil < 0).length,
      next30Days: allDates.filter(d => d.daysUntil >= 0 && d.daysUntil <= 30).length,
      next90Days: allDates.filter(d => d.daysUntil > 30 && d.daysUntil <= 90).length,
      byCategory: {
        facility: allDates.filter(d => d.category === 'facility').length,
        enrollment: allDates.filter(d => d.category === 'enrollment').length,
        human_resources: allDates.filter(d => d.category === 'human_resources').length,
        compliance: allDates.filter(d => d.category === 'compliance').length
      }
    };
    
    res.json({
      criticalDates: filteredDates,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch critical dates' });
  }
});

// POST /api/calendar/google-sync
router.post('/google-sync', (req, res) => {
  try {
    const { calendarId, dateTypes } = req.body;
    
    // Mock Google Calendar integration
    const syncResult = {
      calendarId,
      eventsCreated: 0,
      eventsUpdated: 0,
      syncedDateTypes: dateTypes || ['lease', 'family_contract', 'staff_contract', 'insurance']
    };
    
    // Create calendar events for critical dates
    const allDates = [
      ...criticalDates.leaseAgreements,
      ...criticalDates.familyContracts,
      ...criticalDates.staffContracts,
      ...criticalDates.insurancePolicies
    ];
    
    const calendarEvents = allDates.map(date => ({
      summary: `SchoolStack Reminder: ${date.title || date.familyName || date.policyType}`,
      description: date.alerts?.[0]?.message || 'Critical date reminder',
      start: { date: date.negotiationStartDate || date.reEnrollmentDeadline || date.renewalDeadline },
      end: { date: date.negotiationStartDate || date.reEnrollmentDeadline || date.renewalDeadline },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 7 * 24 * 60 }, // 7 days before
          { method: 'popup', minutes: 24 * 60 } // 1 day before
        ]
      },
      colorId: getPriorityColor(date)
    }));
    
    syncResult.eventsCreated = calendarEvents.length;
    
    res.json({
      success: true,
      syncResult,
      calendarEvents: calendarEvents.slice(0, 5), // Preview first 5
      googleCalendarUrl: `https://calendar.google.com/calendar/u/0/r?cid=${calendarId}`,
      message: `${calendarEvents.length} critical dates synced to your Google Calendar`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync with Google Calendar' });
  }
});

// POST /api/calendar/add-custom-date
router.post('/add-custom-date', (req, res) => {
  try {
    const { title, date, category, description, reminderDays } = req.body;
    
    const customDate = {
      id: `custom_${Date.now()}`,
      type: 'custom',
      category,
      title,
      date,
      description,
      reminderDate: new Date(new Date(date).getTime() - (reminderDays * 24 * 60 * 60 * 1000)).toISOString(),
      daysUntil: Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)),
      status: 'active',
      createdBy: 'user',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      customDate,
      message: 'Custom date added to calendar tracking'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add custom date' });
  }
});

function getPriorityColor(date) {
  const daysUntil = date.daysUntilNegotiation || date.daysUntilReEnrollment || date.daysUntilRenewal || date.daysUntilExpiration || 999;
  
  if (daysUntil < 0) return '11'; // Red - overdue
  if (daysUntil < 30) return '11'; // Red - urgent
  if (daysUntil < 90) return '5'; // Orange - important
  return '7'; // Blue - scheduled
}

module.exports = router;
