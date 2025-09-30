// Mock data for frontend-only demo mode
export const mockData = {
  payments: {
    integrations: {
      summary: {
        totalIntegrations: 12,
        connectedIntegrations: 6,
        connectionRate: 50,
        totalMonthlyVolume: 33800,
        totalTransactions: 174,
        dataFreshness: 'Real-time'
      },
      integrationsByType: {
        payment_processor: [
          { name: 'Omella', status: 'connected', monthlyVolume: 8750, transactionCount: 15, features: ['ACH', 'Credit Cards', 'Payment Plans'] },
          { name: 'Stripe', status: 'connected', monthlyVolume: 3500, transactionCount: 6, features: ['Credit Cards', 'ACH', 'Subscriptions'] }
        ],
        accounting: [
          { name: 'QuickBooks Online', status: 'connected', transactionCount: 127, features: ['GL Sync', 'Reporting'] }
        ]
      }
    },
    payments: [
      { id: 1, family: 'Johnson Family', familyDetails: '2 children • ESA eligible', amount: 1166, source: { name: 'ClassWallet', icon: 'CW' }, dueDate: '2024-11-01', status: 'late', statusText: '15 days late', action: 'Chase' },
      { id: 2, family: 'Martinez Family', familyDetails: '1 child • Monthly plan', amount: 583, source: { name: 'Omella', icon: 'OM' }, dueDate: '2024-11-05', status: 'failed', statusText: 'Failed - Card Expired', action: 'Update Card' }
    ]
  },
  enrollment: {
    pipeline: { inquiries: 12, toursScheduled: 5, applications: 3, readyToEnroll: 2, currentFamilies: 28 },
    families: [
      // Tours Scheduled (5 families)
      { id: 1, name: 'Peterson Family', stage: 'tour_scheduled', children: 2, monthlyValue: 1166, nextStep: 'Tour prep needed', inquiryDate: '2024-11-10', status: 'tour_tomorrow', notes: 'Interested in STEM focus' },
      { id: 2, name: 'Anderson Family', stage: 'tour_scheduled', children: 1, monthlyValue: 667, nextStep: 'Tour this Saturday', inquiryDate: '2024-11-08', status: 'tour_scheduled', notes: 'ESA eligible' },
      { id: 3, name: 'Williams Family', stage: 'tour_scheduled', children: 1, monthlyValue: 667, nextStep: 'Tour next week', inquiryDate: '2024-11-09', status: 'tour_scheduled', notes: 'Homeschool transition' },
      { id: 4, name: 'Garcia Family', stage: 'tour_scheduled', children: 2, monthlyValue: 1166, nextStep: 'Tour scheduled', inquiryDate: '2024-11-11', status: 'tour_scheduled', notes: 'Sibling discount' },
      { id: 5, name: 'Taylor Family', stage: 'tour_scheduled', children: 1, monthlyValue: 667, nextStep: 'Tour confirmed', inquiryDate: '2024-11-12', status: 'tour_scheduled', notes: 'Private pay' },
      
      // Ready to Enroll (2 families)
      { id: 6, name: 'Chen Family', stage: 'ready_to_enroll', children: 1, monthlyValue: 667, nextStep: 'Send contract', inquiryDate: '2024-11-05', status: 'ready_to_enroll', notes: 'Application approved' },
      { id: 7, name: 'Davis Family', stage: 'ready_to_enroll', children: 2, monthlyValue: 1166, nextStep: 'Generate enrollment agreement', inquiryDate: '2024-11-03', status: 'ready_to_enroll', notes: 'ESA eligible, ready to sign' },
      
      // At Risk Families (2 families)
      { id: 8, name: 'Roberts Family', stage: 'current_risk', children: 2, monthlyValue: 1166, nextStep: 'Schedule meeting', inquiryDate: '2022-09-01', status: 'retention_risk', notes: '45 days late, 3 consecutive late payments' },
      { id: 9, name: 'Brown Family', stage: 'current_risk', children: 1, monthlyValue: 667, nextStep: 'Family check-in', inquiryDate: '2023-08-15', status: 'retention_risk', notes: 'Student struggling academically, parents concerned' }
    ],
    analytics: {
      monthlyTrends: [
        { month: 'July', inquiries: 8, enrolled: 2 },
        { month: 'August', inquiries: 10, enrolled: 3 },
        { month: 'September', inquiries: 15, enrolled: 4 },
        { month: 'October', inquiries: 12, enrolled: 2 },
        { month: 'November', inquiries: 12, enrolled: 1 }
      ],
      sourceAnalysis: {
        'Word of Mouth': { count: 8, conversionRate: 0.75 },
        'Facebook Ads': { count: 15, conversionRate: 0.40 },
        'Google Search': { count: 10, conversionRate: 0.60 }
      }
    }
  },
  ai: {
    templates: {
      // GOVERNANCE
      bylaws: { 
        name: 'Corporate Bylaws', 
        description: 'Comprehensive bylaws for nonprofit incorporation', 
        category: 'governance', 
        subcategory: 'incorporation',
        complexity: 'high', 
        estimatedTime: '15-20 minutes',
        tags: ['nonprofit', 'incorporation', 'board governance']
      },
      operating_agreement_llc: {
        name: 'Single Member LLC Operating Agreement',
        description: 'Operating agreement for single-member LLC microschools',
        category: 'governance',
        subcategory: 'incorporation', 
        complexity: 'high',
        estimatedTime: '12-18 minutes',
        tags: ['LLC', 'for-profit', 'business structure']
      },
      conflict_of_interest: {
        name: 'Conflict of Interest Policy',
        description: 'Board and staff conflict of interest policy',
        category: 'governance',
        subcategory: 'policies',
        complexity: 'medium',
        estimatedTime: '8-12 minutes',
        tags: ['ethics', 'governance', 'compliance']
      },
      
      // OPERATIONS  
      family_handbook: { 
        name: 'Family Handbook', 
        description: 'Complete family handbook with policies', 
        category: 'operations', 
        subcategory: 'family_relations',
        complexity: 'medium', 
        estimatedTime: '10-15 minutes',
        tags: ['family engagement', 'policies', 'procedures']
      },
      hiring_guide: {
        name: 'Teacher Hiring Guide',
        description: 'Complete hiring process and interview guide',
        category: 'operations',
        subcategory: 'human_resources',
        complexity: 'medium', 
        estimatedTime: '10-12 minutes',
        tags: ['recruitment', 'hiring', 'interviews']
      },
      
      // LEGAL
      enrollment_contract: {
        name: 'Enrollment Agreement',
        description: 'Legal enrollment contract for families',
        category: 'legal',
        subcategory: 'contracts',
        complexity: 'high',
        estimatedTime: '10-12 minutes', 
        tags: ['enrollment', 'contracts', 'legal protection']
      },
      tuition_contract: {
        name: 'Tuition Agreement & Payment Terms',
        description: 'Comprehensive tuition contract with payment terms',
        category: 'legal',
        subcategory: 'contracts',
        complexity: 'high',
        estimatedTime: '8-10 minutes',
        tags: ['tuition', 'payment terms', 'legal protection']
      },
      
      // MARKETING
      social_media_campaign: {
        name: 'Social Media Campaign Strategy', 
        description: 'Complete social media marketing campaign',
        category: 'marketing',
        subcategory: 'digital_marketing',
        complexity: 'medium',
        estimatedTime: '8-12 minutes',
        tags: ['social media', 'marketing', 'enrollment']
      },
      recruitment_playbook: {
        name: 'Student Recruitment Playbook',
        description: 'Complete guide for attracting families',
        category: 'marketing', 
        subcategory: 'enrollment_strategy',
        complexity: 'medium',
        estimatedTime: '12-18 minutes',
        tags: ['recruitment', 'enrollment', 'marketing funnel']
      },
      
      // FINANCIAL
      budget_template: {
        name: 'Annual Budget Template',
        description: 'Comprehensive budget planning template',
        category: 'financial',
        subcategory: 'planning',
        complexity: 'medium',
        estimatedTime: '10-12 minutes',
        tags: ['budget planning', 'financial management']
      },
      
      // COMPLIANCE
      ferpa_policy: {
        name: 'FERPA Compliance Policy',
        description: 'Student privacy and data protection policy',
        category: 'compliance',
        subcategory: 'data_privacy',
        complexity: 'medium',
        estimatedTime: '8-12 minutes',
        tags: ['FERPA', 'privacy', 'data protection']
      }
    }
  },
  lease: {
    analysis: {
      currentLease: { propertyAddress: '123 Education Way', baseRent: 3500, totalMonthlyRent: 4500 },
      riskAnalysis: { overallRisk: 'high', riskFactors: [] }
    }
  }
};
