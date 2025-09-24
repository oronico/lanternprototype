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
      { id: 1, name: 'Peterson Family', stage: 'tour_scheduled', children: 2, monthlyValue: 1166, nextStep: 'Tour prep needed', inquiryDate: '2024-11-10', status: 'tour_tomorrow' },
      { id: 2, name: 'Anderson Family', stage: 'application_pending', children: 1, monthlyValue: 750, nextStep: 'Follow up - 3 days', inquiryDate: '2024-11-08', status: 'application_pending' }
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
      bylaws: { name: 'Corporate Bylaws', description: 'Nonprofit incorporation documents', category: 'legal', complexity: 'high', estimatedTime: '15-20 minutes' },
      handbook: { name: 'Family Handbook', description: 'Complete policy guide', category: 'operations', complexity: 'medium', estimatedTime: '10-15 minutes' }
    }
  },
  lease: {
    analysis: {
      currentLease: { propertyAddress: '123 Education Way', baseRent: 3500, totalMonthlyRent: 4500 },
      riskAnalysis: { overallRisk: 'high', riskFactors: [] }
    }
  }
};
