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
  },
  fundraising: {
    annualGoal: 150000,
    opportunities: [
      {
        id: 'opp_001',
        name: 'STEM Innovation Grant',
        organizationType: 'foundation',
        pursuitType: 'grant',
        awardType: 'restricted',
        stage: 'apply',
        askAmount: 75000,
        amountAwarded: 0,
        contact: { name: 'Sarah Patel', organization: 'Bright Futures Foundation', email: 'spatel@bff.org', phone: '555-4821' },
        nextStep: 'Submit financials + board roster',
        dueDate: '2024-11-30',
        lastTouch: '2024-10-05',
        notes: 'Requires audited financials for FY23',
        eventName: '',
        pursuitTheme: 'STEM Labs for Girls',
        createdAt: '2024-07-12',
        updatedAt: '2024-10-05'
      },
      {
        id: 'opp_002',
        name: 'Winter Giving Circle',
        organizationType: 'individual',
        pursuitType: 'request',
        awardType: 'unrestricted',
        stage: 'nurture',
        askAmount: 15000,
        amountAwarded: 0,
        contact: { name: 'Marcus Rivera', organization: 'Parent Giving Circle', email: 'marcus@givingcircle.io', phone: '555-2114' },
        nextStep: 'Invite to campus breakfast 10/25',
        dueDate: '2024-12-15',
        lastTouch: '2024-10-02',
        notes: 'Interested in literacy outcomes',
        eventName: '',
        pursuitTheme: 'Parent Annual Fund',
        createdAt: '2024-08-01',
        updatedAt: '2024-10-02'
      },
      {
        id: 'opp_003',
        name: 'Innovators Gala 2024',
        organizationType: 'corporation',
        pursuitType: 'event',
        awardType: 'restricted',
        stage: 'pursue',
        askAmount: 40000,
        amountAwarded: 0,
        contact: { name: 'Lena Wu', organization: 'TechNova', email: 'lena.wu@technova.com', phone: '555-9912' },
        nextStep: 'Confirm table sponsorship level',
        dueDate: '2024-10-25',
        lastTouch: '2024-10-06',
        notes: 'Will sponsor STEM showcase if naming rights available',
        eventName: 'Innovators Gala',
        pursuitTheme: 'Corporate STEM Showcase',
        createdAt: '2024-09-01',
        updatedAt: '2024-10-06'
      },
      {
        id: 'opp_004',
        name: 'Learning Recovery Fund',
        organizationType: 'foundation',
        pursuitType: 'grant',
        awardType: 'restricted',
        stage: 'closed_won',
        askAmount: 50000,
        amountAwarded: 50000,
        contact: { name: 'Dana Cole', organization: 'Rise Together Fund', email: 'dcole@risetogether.org', phone: '555-7710' },
        nextStep: 'Submit quarterly impact report 01/15',
        dueDate: '2024-09-01',
        lastTouch: '2024-09-05',
        notes: 'Supports intervention tutors. First installment received.',
        eventName: '',
        pursuitTheme: 'Academic Recovery',
        createdAt: '2024-04-15',
        updatedAt: '2024-09-05'
      },
      {
        id: 'opp_005',
        name: 'Community Impact Pitch',
        organizationType: 'corporation',
        pursuitType: 'request',
        awardType: 'unrestricted',
        stage: 'closed_lost',
        askAmount: 25000,
        amountAwarded: 0,
        contact: { name: 'Erin Blake', organization: 'MetroBank', email: 'erin.blake@metrobank.com', phone: '555-8844' },
        nextStep: 'Capture feedback for FY25 cycle',
        dueDate: '2024-08-15',
        lastTouch: '2024-08-20',
        notes: 'Great relationship, invited to apply next year.',
        eventName: '',
        pursuitTheme: 'Community Innovation Pitch',
        createdAt: '2024-03-22',
        updatedAt: '2024-08-20'
      }
    ],
    documents: [
      { id: 'doc_001', opportunityId: 'opp_004', name: 'Award Letter - Learning Recovery Fund', type: 'award_letter', status: 'stored', lastUpdated: '2024-09-05', url: 'https://schoolstack.ai/docs/learning-recovery-award.pdf', required: true },
      { id: 'doc_002', opportunityId: 'opp_001', name: '990-EZ FY23', type: 'irs_form', status: 'awaiting_upload', lastUpdated: '2024-10-01', url: '', required: true },
      { id: 'doc_003', opportunityId: 'opp_003', name: 'Sponsorship Agreement Draft', type: 'contract', status: 'in_review', lastUpdated: '2024-10-07', url: '', required: false }
    ],
    bookkeepingSync: [
      { id: 'sync_001', opportunityId: 'opp_004', description: 'Learning Recovery Fund installment', account: '4230 · Restricted Grants', amount: 50000, status: 'ready_to_sync', lastSynced: '2024-09-08' },
      { id: 'sync_002', opportunityId: 'opp_003', description: 'Innovators Gala pledges', account: '4250 · Events Revenue', amount: 40000, status: 'pending_amount', lastSynced: null }
    ]
  },
  financials: {
    activity: [
      {
        id: 'txn_001',
        date: '2024-09-27',
        description: 'ACH CLASSWALLET BATCH',
        amount: 2332,
        direction: 'inbound',
        account: 'Chase Operating',
        memo: 'ACH CLASSWALLET * 10331',
        family: 'Lopez',
        requiresSplit: true,
        status: 'needs_split',
        source: 'Plaid'
      },
      {
        id: 'txn_002',
        date: '2024-09-26',
        description: 'Stripe Auto-Pay',
        amount: 1200,
        direction: 'inbound',
        account: 'Chase Operating',
        memo: 'STRIPE*Emma Johnson',
        family: 'Johnson',
        requiresSplit: false,
        status: 'mapped',
        students: [
          { name: 'Emma Johnson', amount: 1200 }
        ],
        source: 'Plaid'
      },
      {
        id: 'txn_003',
        date: '2024-09-25',
        description: 'Staples Store 885',
        amount: 218,
        direction: 'outbound',
        account: 'AmEx Card',
        memo: 'Office supplies for classrooms',
        vendor: 'Staples',
        requiresSplit: false,
        status: 'needs_category',
        source: 'Statement',
        statementId: 'stmt_sep_card'
      },
      {
        id: 'txn_004',
        date: '2024-09-24',
        description: 'Gusto Payroll Debit',
        amount: 8421,
        direction: 'outbound',
        account: 'Chase Operating',
        memo: 'Payroll batch 09/24',
        requiresSplit: false,
        status: 'mapped',
        source: 'Plaid'
      }
    ],
    statements: [
      {
        id: 'stmt_sep_card',
        account: 'AmEx School Card',
        period: 'Sep 2024',
        file: 'amex-sep-2024.pdf',
        status: 'uploaded',
        type: 'credit_card',
        lines: [
          { id: 'line_card_1', date: '2024-09-22', description: 'Staples Store 885', amount: 218, category: 'Classroom Supplies', status: 'needs_review', receiptAttached: false },
          { id: 'line_card_2', date: '2024-09-20', description: 'Home Depot #442', amount: 146, category: 'Facilities', status: 'matched', receiptAttached: true },
          { id: 'line_card_3', date: '2024-09-18', description: 'Uber Trip', amount: 32, category: 'Travel', status: 'flagged', receiptAttached: false }
        ]
      },
      {
        id: 'stmt_sep_operating',
        account: 'Chase Operating',
        period: 'Sep 2024',
        file: 'chase-operating-sep-2024.pdf',
        status: 'processing',
        type: 'bank',
        lines: [
          { id: 'line_bank_1', date: '2024-09-27', description: 'ACH CLASSWALLET BATCH', amount: 2332, category: 'Tuition Deposits', status: 'needs_review', receiptAttached: false },
          { id: 'line_bank_2', date: '2024-09-24', description: 'Gusto Payroll Debit', amount: 8421, category: 'Payroll', status: 'matched', receiptAttached: false }
        ]
      }
    ],
    checklist: [
      { id: 'step_plaid_sync', title: 'Review Plaid feed', description: 'Categorize all transactions & split per student', done: false, type: 'sync' },
      { id: 'step_statements', title: 'Attach bank & card statements', description: 'Upload PDF statements or Plaid Assets reports', done: false, type: 'documents' },
      { id: 'step_tuition', title: 'Confirm tuition per student', description: 'Every deposit mapped to individual students + GL', done: false, type: 'tuition' },
      { id: 'step_expenses', title: 'Categorize expenses to GL accounts', description: 'Ensure uncategorized bucket is under 10%', done: false, type: 'bookkeeping' },
      { id: 'step_payroll', title: 'Verify payroll + benefits', description: 'Confirm gross payroll, taxes & reimbursements', done: false, type: 'payroll' },
      { id: 'step_reports', title: 'Generate bank-ready financials', description: 'Export cash flow, P&L, and balance sheet', done: false, type: 'reporting' }
    ]
  }
};
