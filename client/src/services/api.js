import axios from 'axios';
import { mockData } from './mockData';
import {
  ENROLLMENT,
  FINANCIAL,
  ATTENDANCE,
  STAFF,
  FACILITY,
  OPERATIONS,
  DAILY_SNAPSHOT,
  DEMO_STUDENTS
} from '../data/centralizedMetrics';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// For demo purposes, use mock data when API is not available
const USE_MOCK_DATA = !process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for frontend-only demo
const mockUser = {
  id: 1,
  email: 'admin@sunshine-microschool.com',
  name: 'Sarah Johnson',
  role: 'director',
  schoolName: 'Sunshine Microschool',
  permissions: ['dashboard', 'payments', 'enrollment', 'calculator', 'health', 'lease']
};

const fundraisingStageWeights = {
  prospect: 0.15,
  nurture: 0.3,
  pursue: 0.45,
  apply: 0.65,
  closed_won: 1,
  closed_lost: 0
};

let mockFundraisingState = mockData.fundraising
  ? JSON.parse(JSON.stringify(mockData.fundraising))
  : { annualGoal: 0, opportunities: [], documents: [], bookkeepingSync: [] };

let mockFinancialsState = mockData.financials
  ? JSON.parse(JSON.stringify(mockData.financials))
  : { activity: [], statements: [], checklist: [] };

const computeMockFundraisingSummary = () => {
  const securedRestricted = mockFundraisingState.opportunities
    .filter(op => op.stage === 'closed_won' && op.awardType === 'restricted')
    .reduce((sum, op) => sum + (op.amountAwarded || 0), 0);

  const securedUnrestricted = mockFundraisingState.opportunities
    .filter(op => op.stage === 'closed_won' && op.awardType === 'unrestricted')
    .reduce((sum, op) => sum + (op.amountAwarded || 0), 0);

  const pipelineTotal = mockFundraisingState.opportunities
    .filter(op => !['closed_won', 'closed_lost'].includes(op.stage))
    .reduce((sum, op) => sum + (op.askAmount || 0), 0);

  const weightedForecast = mockFundraisingState.opportunities.reduce((sum, op) => {
    const weight = fundraisingStageWeights[op.stage] ?? 0;
    return sum + (op.askAmount || 0) * weight;
  }, 0);

  const wonCount = mockFundraisingState.opportunities.filter(op => op.stage === 'closed_won').length;
  const closedCount = mockFundraisingState.opportunities.filter(op => ['closed_won', 'closed_lost'].includes(op.stage)).length;

  return {
    annualGoal: mockFundraisingState.annualGoal,
    securedRestricted,
    securedUnrestricted,
    pipelineTotal,
    weightedForecast,
    winRate: closedCount ? Math.round((wonCount / closedCount) * 100) : 0
  };
};

const computeMockFinancialActivitySummary = () => {
  const inbound = mockFinancialsState.activity.filter(txn => txn.direction === 'inbound');
  const outbound = mockFinancialsState.activity.filter(txn => txn.direction === 'outbound');
  const needsReview = mockFinancialsState.activity.filter(txn => txn.status !== 'mapped');

  return {
    inboundCount: inbound.length,
    inboundAmount: inbound.reduce((sum, txn) => sum + txn.amount, 0),
    outboundCount: outbound.length,
    outboundAmount: outbound.reduce((sum, txn) => sum + txn.amount, 0),
    needsReviewCount: needsReview.length,
    needsSplitCount: mockFinancialsState.activity.filter(txn => txn.requiresSplit).length
  };
};

const computeMockChecklistProgress = () => {
  const total = mockFinancialsState.checklist.length || 1;
  const completed = mockFinancialsState.checklist.filter(step => step.done).length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100)
  };
};

// API services with fallback to mock data
export const authAPI = {
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      // Mock authentication for demo
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@sunshine-microschool.com' && password === 'admin123') {
            resolve({
              data: {
                success: true,
                token: 'mock_token_12345',
                user: mockUser
              }
            });
          } else {
            reject({
              response: {
                data: {
                  error: 'Invalid credentials. Use admin@sunshine-microschool.com / admin123'
                }
              }
            });
          }
        }, 500); // Simulate network delay
      });
    }
    return api.post('/auth/login', { email, password });
  },
  register: (userData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, token: 'mock_token_12345', user: mockUser } });
    }
    return api.post('/auth/register', userData);
  },
  getProfile: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { user: mockUser } });
    }
    return api.get('/auth/profile');
  },
  logout: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true } });
    }
    return api.post('/auth/logout');
  },
  forgotPassword: (email) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'Reset link sent' } });
    }
    return api.post('/auth/forgot-password', { email });
  },
};

export const dashboardAPI = {
  getSummary: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        data: {
          bankBalance: FINANCIAL.operatingCash, // Use operating cash for cash flow
          totalCash: FINANCIAL.totalCash,
          savingsCash: FINANCIAL.savingsCash,
          expectedToday: Math.round(FINANCIAL.monthlyRevenue / 30), // Daily revenue
          outstandingRevenue: FINANCIAL.outstandingReceivables,
          daysCashOnHand: FINANCIAL.daysCash,
          enrollment: ENROLLMENT.current,
          monthlyRevenue: FINANCIAL.monthlyRevenue,
          urgentCollections: [
            { id: 1, family: 'Jackson Family', amount: 400, daysLate: 5, type: 'Past due', note: 'Payment overdue' }
          ],
          weeklyForecast: [
            { day: 'Today', balance: FINANCIAL.cashBalance, change: '+$659 expected', status: 'healthy' },
            { day: 'Wed', balance: FINANCIAL.cashBalance + 659, change: 'No major transactions', status: 'healthy' },
            { day: 'Thu', balance: FINANCIAL.cashBalance + 659 - 850, change: '-$850 utilities', status: 'healthy' },
            { day: 'Fri', balance: FINANCIAL.cashBalance - 191, change: 'No major transactions', status: 'healthy' },
            { day: 'Mon', balance: FINANCIAL.cashBalance + 2000, change: '+$2,191 ClassWallet', status: 'healthy' }
          ]
        }
      });
    }
    return api.get('/dashboard/summary');
  },
  getAlerts: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: [] });
    }
    return api.get('/dashboard/alerts');
  },
  executeAction: (actionType, targetId, data) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'Action completed' } });
    }
    return api.post('/dashboard/action', { actionType, targetId, data });
  },
};

export const paymentsAPI = {
  getPayments: (params) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.payments });
    }
    return api.get('/payments', { params });
  },
  getStatistics: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { totalReceivable: 25000, totalPaid: 20000, collectionRate: 0.82 } });
    }
    return api.get('/payments/statistics');
  },
  executePaymentAction: (paymentId, actionType) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'Action completed' } });
    }
    return api.post(`/payments/${paymentId}/action`, { actionType });
  },
  getIntegrations: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.payments.integrations });
    }
    return api.get('/payments/integrations');
  },
  syncPayments: (provider) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: `${provider} synced` } });
    }
    return api.post('/payments/sync', { provider });
  },
};

export const calculatorAPI = {
  calculatePricing: (params) => api.post('/calculator/pricing', params),
  calculateTuitionEngine: (params) => api.post('/calculator/tuition-engine', params),
  getBenchmarks: () => api.get('/calculator/benchmarks'),
  calculateScenario: (baseScenario, changes) => 
    api.post('/calculator/scenario', { baseScenario, changes }),
};

export const healthAPI = {
  getScorecard: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        data: {
          overallScore: FINANCIAL.healthScore,
          overallStatus: FINANCIAL.healthStatus,
          lastUpdated: new Date().toISOString(),
          criticalMetrics: [],
          warningMetrics: [
            { key: 'daysCashOnHand', name: 'Days Cash on Hand', value: FINANCIAL.daysCash, displayValue: `${FINANCIAL.daysCash} days`, benchmark: 30, target: 60, goldStar: 90, status: 'improving', trend: 'stable', recommendation: `At ${FINANCIAL.daysCash} days - working toward 30-day minimum (on track)` },
            { key: 'facilityBurden', name: 'Facility Burden', value: FACILITY.facilityBurden, displayValue: `${Math.round(FACILITY.facilityBurden * 100)}%`, benchmark: 0.20, target: 0.15, status: 'working_on_it', trend: 'stable', recommendation: 'Above 20% target - explore cost reduction opportunities' },
            { key: 'staffingRatio', name: 'Staffing Cost Ratio', value: STAFF.staffingRatio, displayValue: `${Math.round(STAFF.staffingRatio * 100)}%`, benchmark: 0.50, target: 0.45, status: 'good', trend: 'stable', recommendation: 'Healthy staffing ratio - room to grow' },
            { key: 'attendanceRate', name: 'Attendance Rate', value: ATTENDANCE.ytdRate / 100, displayValue: `${ATTENDANCE.ytdRate}%`, benchmark: 0.95, target: 0.98, status: 'excellent', trend: 'stable', recommendation: 'Excellent attendance! Keep families engaged.' },
            { key: 'collectionRate', name: 'Collection Rate', value: OPERATIONS.onTimePayment / 100, displayValue: `${OPERATIONS.onTimePayment}%`, benchmark: 0.95, target: 0.98, status: 'excellent', trend: 'stable', recommendation: 'Great payment discipline!' },
            { key: 'enrollmentUtilization', name: 'Enrollment Utilization', value: ENROLLMENT.utilization / 100, displayValue: `${ENROLLMENT.utilization}%`, benchmark: 0.75, target: 0.85, status: 'warning', trend: 'improving', recommendation: `At ${ENROLLMENT.utilization}% capacity - ${ENROLLMENT.capacity - ENROLLMENT.current} spots available` }
          ],
          goodMetrics: [
            { key: 'studentRetention', name: 'Student Retention', value: ENROLLMENT.retentionRate / 100, displayValue: `${ENROLLMENT.retentionRate}%`, benchmark: 0.85, target: 0.95, status: 'excellent', trend: 'stable', recommendation: `${ENROLLMENT.retentionRate}% of students returned this year - excellent!` },
            { key: 'enrollmentToGoal', name: 'Enrollment to Goal', value: ENROLLMENT.goalProgress / 100, displayValue: `${ENROLLMENT.goalProgress}%`, benchmark: 0.75, target: 0.90, status: 'good', trend: 'improving', recommendation: `At ${ENROLLMENT.current}/${ENROLLMENT.target} students - ${ENROLLMENT.target - ENROLLMENT.current} more to reach goal` },
            { key: 'profitMargin', name: 'Profit Margin', value: FINANCIAL.profitMargin / 100, displayValue: `${FINANCIAL.profitMargin}%`, benchmark: 0.10, target: 0.15, status: 'good', trend: 'stable', recommendation: 'Healthy profit margin' }
          ],
          excellentMetrics: [
            { key: 'attendance', name: 'Attendance Rate', value: ATTENDANCE.ytdRate / 100, displayValue: `${ATTENDANCE.ytdRate}%`, benchmark: 0.95, target: 0.98, status: 'excellent', trend: 'stable', recommendation: `${ATTENDANCE.ytdRate}% attendance - exceeding 95% goal!` }
          ],
          insights: [
            { type: 'opportunity', title: 'Build Cash Reserve to 30 Days', message: `At ${FINANCIAL.daysCash} days - need ${FINANCIAL.cashGoal - FINANCIAL.daysCash} more days to reach minimum`, action: `Save $${Math.round((FINANCIAL.cashGoal - FINANCIAL.daysCash) * (FINANCIAL.monthlyExpenses / 30))} to reach 30-day target` },
            { type: 'opportunity', title: 'Increase Enrollment', message: `At ${ENROLLMENT.utilization}% capacity - ${ENROLLMENT.capacity - ENROLLMENT.current} spots available`, action: `Enroll ${ENROLLMENT.target - ENROLLMENT.current} more students to reach goal` },
            { type: 'positive', title: 'Excellent Attendance!', message: `${ATTENDANCE.ytdRate}% attendance rate exceeds 95% goal`, action: 'Excellent! Maintain this performance' }
          ],
          urgentActions: [
            { priority: 'medium', metric: 'Days Cash on Hand', currentValue: `${FINANCIAL.daysCash} days`, targetValue: '30 days minimum', action: `Build cash reserves - working toward goal`, timeframe: '30-60 days' },
            { priority: 'medium', metric: 'Facility Burden', currentValue: `${Math.round(FACILITY.facilityBurden * 100)}%`, targetValue: '20%', action: 'Optimize facility costs or increase enrollment', timeframe: '60-90 days' }
          ]
        }
      });
    }
    return api.get('/health/scorecard');
  },
  getMetrics: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { overallScore: 53, metrics: {}, insights: [] } });
    }
    return api.get('/health/metrics');
  },
  getLoanReadiness: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { score: 42, status: 'not_ready' } });
    }
    return api.get('/health/loan-readiness');
  },
  getTrends: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: {} });
    }
    return api.get('/health/trends');
  },
  generateActionPlan: (priority) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { actionPlan: [], estimatedImpact: {} } });
    }
    return api.post('/health/action-plan', { priority });
  },
};

export const enrollmentAPI = {
  getPipeline: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.enrollment });
    }
    return api.get('/enrollment/pipeline');
  },
  getFamilies: (params) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { families: mockData.enrollment.families } });
    }
    return api.get('/enrollment/families', { params });
  },
  getAnalytics: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.enrollment.analytics });
    }
    return api.get('/enrollment/analytics');
  },
  executeFamilyAction: (familyId, actionType, data) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'Action completed' } });
    }
    return api.post(`/enrollment/families/${familyId}/action`, { actionType, data });
  },
  addFamily: (familyData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, family: familyData } });
    }
    return api.post('/enrollment/families', familyData);
  },
  getRecommendations: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: [] });
    }
    return api.get('/enrollment/recommendations');
  },
};

export const leaseAPI = {
  getAnalysis: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.lease.analysis });
    }
    return api.get('/lease/analysis');
  },
  getAlternatives: (params) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { alternatives: [] } });
    }
    return api.get('/lease/alternatives', { params });
  },
  getRecommendations: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { recommendations: [] } });
    }
    return api.get('/lease/recommendations');
  },
  analyzeLease: (leaseData) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { analysis: mockData.lease.analysis } });
    }
    return api.post('/lease/analyze', leaseData);
  },
  getTemplate: (type) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { title: 'Template', content: 'Mock template content' } });
    }
    return api.get(`/lease/templates/${type}`);
  },
  getMarketData: (params) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: {} });
    }
    return api.get('/lease/market-data', { params });
  },
};

export const fundraisingAPI = {
  getOpportunities: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        data: {
          ...mockFundraisingState,
          summary: computeMockFundraisingSummary()
        }
      });
    }
    return api.get('/fundraising/opportunities');
  },
  createOpportunity: (payload) => {
    if (USE_MOCK_DATA) {
      const newOpportunity = {
        id: `opp_${Date.now()}`,
        ...payload,
        askAmount: Number(payload.askAmount) || 0,
        amountAwarded: payload.stage === 'closed_won'
          ? Number(payload.amountAwarded || payload.askAmount || 0)
          : 0,
        lastTouch: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockFundraisingState.opportunities = [newOpportunity, ...mockFundraisingState.opportunities];
      return Promise.resolve({
        data: {
          opportunity: newOpportunity,
          summary: computeMockFundraisingSummary()
        }
      });
    }
    return api.post('/fundraising/opportunities', payload);
  },
  updateOpportunity: (id, updates) => {
    if (USE_MOCK_DATA) {
      const idx = mockFundraisingState.opportunities.findIndex(op => op.id === id);
      if (idx === -1) {
        return Promise.reject(new Error('Opportunity not found'));
      }
      mockFundraisingState.opportunities[idx] = {
        ...mockFundraisingState.opportunities[idx],
        ...updates,
        askAmount: updates.askAmount !== undefined
          ? Number(updates.askAmount)
          : mockFundraisingState.opportunities[idx].askAmount,
        amountAwarded: updates.amountAwarded !== undefined
          ? Number(updates.amountAwarded)
          : mockFundraisingState.opportunities[idx].amountAwarded,
        updatedAt: new Date().toISOString()
      };
      return Promise.resolve({
        data: {
          opportunity: mockFundraisingState.opportunities[idx],
          summary: computeMockFundraisingSummary()
        }
      });
    }
    return api.put(`/fundraising/opportunities/${id}`, updates);
  },
  updateGoal: (goal) => {
    if (USE_MOCK_DATA) {
      mockFundraisingState.annualGoal = Number(goal) || mockFundraisingState.annualGoal;
      return Promise.resolve({
        data: {
          annualGoal: mockFundraisingState.annualGoal,
          summary: computeMockFundraisingSummary()
        }
      });
    }
    return api.put('/fundraising/goal', { goal });
  }
};

export const financialsAPI = {
  getActivityFeed: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        data: {
          activity: mockFinancialsState.activity,
          statements: mockFinancialsState.statements,
          summary: computeMockFinancialActivitySummary()
        }
      });
    }
    return api.get('/financials/activity');
  },
  splitTransaction: (activityId, allocations) => {
    if (USE_MOCK_DATA) {
      mockFinancialsState.activity = mockFinancialsState.activity.map(txn => {
        if (txn.id !== activityId) return txn;
        return {
          ...txn,
          requiresSplit: false,
          status: 'mapped',
          students: allocations.map(alloc => ({ name: alloc.name, amount: Number(alloc.amount) }))
        };
      });
      return Promise.resolve({ data: { success: true } });
    }
    return api.post(`/financials/activity/${activityId}/split`, { allocations });
  },
  markCategorized: (activityId) => {
    if (USE_MOCK_DATA) {
      mockFinancialsState.activity = mockFinancialsState.activity.map(txn =>
        txn.id === activityId ? { ...txn, status: 'mapped' } : txn
      );
      return Promise.resolve({ data: { success: true } });
    }
    return api.post(`/financials/activity/${activityId}/mark-categorized`);
  },
  markAsLEADeposit: (activityId) => {
    if (USE_MOCK_DATA) {
      mockFinancialsState.activity = mockFinancialsState.activity.map(txn =>
        txn.id === activityId
          ? { ...txn, requiresSplit: false, status: 'mapped', allocationType: 'lea' }
          : txn
      );
      return Promise.resolve({ data: { success: true } });
    }
    return api.post(`/financials/activity/${activityId}/mark-lea`);
  },
  getMonthCloseChecklist: () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        data: {
          checklist: mockFinancialsState.checklist,
          progress: computeMockChecklistProgress()
        }
      });
    }
    return api.get('/financials/month-close');
  },
  updateChecklistStep: (stepId, completed) => {
    if (USE_MOCK_DATA) {
      mockFinancialsState.checklist = mockFinancialsState.checklist.map(step =>
        step.id === stepId ? { ...step, done: completed } : step
      );
      return Promise.resolve({
        data: {
          success: true,
          checklist: mockFinancialsState.checklist,
          progress: computeMockChecklistProgress()
        }
      });
    }
    return api.post(`/financials/month-close/${stepId}`, { completed });
  },
  updateStatementLine: (statementId, lineId, updates) => {
    if (USE_MOCK_DATA) {
      mockFinancialsState.statements = (mockFinancialsState.statements || []).map(stmt => {
        if (stmt.id !== statementId) return stmt;
        return {
          ...stmt,
          lines: stmt.lines.map(line =>
            line.id === lineId ? { ...line, ...updates } : line
          )
        };
      });
      return Promise.resolve({
        data: {
          success: true,
          statements: mockFinancialsState.statements
        }
      });
    }
    return api.post(`/financials/statements/${statementId}/lines/${lineId}`, updates);
  }
};

export const aiAPI = {
  getTemplates: (category) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: mockData.ai });
    }
    return api.get('/ai/templates', { params: { category } });
  },
  generateDocument: (documentType, schoolInfo, customization, specificRequests) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ 
        data: { 
          success: true, 
          content: 'Generated document content would appear here...',
          metadata: { wordCount: 500, estimatedReadTime: '3 minutes' },
          recommendations: ['Review with legal counsel', 'Update annually']
        } 
      });
    }
    return api.post('/ai/generate', { documentType, schoolInfo, customization, specificRequests });
  },
  reviewDocument: (documentContent, reviewType, specificConcerns) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ 
        data: { 
          success: true, 
          review: { 
            overallScore: 85, 
            issues: [], 
            suggestions: ['Add force majeure clause', 'Review annually'] 
          },
          nextActions: ['Consult attorney', 'Update policies']
        } 
      });
    }
    return api.post('/ai/review', { documentContent, reviewType, specificConcerns });
  },
  getSuggestions: (schoolStage, currentChallenges) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { suggestions: [] } });
    }
    return api.get('/ai/suggestions', { params: { schoolStage, currentChallenges } });
  },
};

// Initialize app
export const initializeApp = async () => {
  try {
    if (USE_MOCK_DATA) {
      console.log('🎭 Running in demo mode with mock data');
      return;
    }
    // Check API health
    await api.get('/health-check');
    console.log('✅ API connection established');
  } catch (error) {
    console.error('❌ Failed to connect to API, using mock data:', error.message);
  }
};

export default api;
