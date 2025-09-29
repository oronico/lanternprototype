import axios from 'axios';
import { mockData } from './mockData';

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
          bankBalance: 3247,
          expectedToday: 1749,
          outstandingRevenue: 4915,
          daysCashOnHand: 7,
          urgentCollections: [
            { id: 1, family: 'Johnson Family', amount: 1166, daysLate: 15, type: 'ESA payment', note: 'Usually reliable' },
            { id: 2, family: 'Martinez Family', amount: 583, daysLate: 10, type: 'Omella failed', note: 'Card expired' },
            { id: 3, family: 'Smith Family', amount: 750, daysLate: 30, type: 'Need payment plan', note: 'High risk' }
          ],
          weeklyForecast: [
            { day: 'Today (Tue)', balance: 3247, change: '+$1,749 expected', status: 'danger' },
            { day: 'Wed', balance: 4996, change: 'No transactions', status: 'warning' },
            { day: 'Thu', balance: 3496, change: '-$1,500 utilities', status: 'warning' },
            { day: 'Fri', balance: 1246, change: '-$2,250 insurance', status: 'danger' },
            { day: 'Mon', balance: -254, change: 'NEGATIVE!', status: 'critical' }
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
          overallScore: 53,
          overallStatus: 'critical',
          lastUpdated: new Date().toISOString(),
          criticalMetrics: [
            { key: 'daysCashOnHand', name: 'Days Cash on Hand', value: 5, displayValue: '5 days', benchmark: 30, target: 45, status: 'danger', trend: 'declining', recommendation: 'Critical: Collect outstanding payments immediately' },
            { key: 'facilityBurden', name: 'Facility Burden', value: 0.28, displayValue: '28%', benchmark: 0.20, target: 0.15, status: 'danger', trend: 'stable', recommendation: 'Facility costs too high - renegotiate lease' },
            { key: 'studentAttrition', name: 'Student Attrition Rate', value: 0.18, displayValue: '18%', benchmark: 0.10, target: 0.05, status: 'danger', trend: 'increasing', recommendation: 'Critical student retention issues - investigate causes and address immediately' },
            { key: 'debtServiceCoverage', name: 'Debt Service Coverage Ratio', value: 0.9, displayValue: '0.9x', benchmark: 1.25, target: 1.50, status: 'danger', trend: 'declining', recommendation: 'Below lending standards - improve cash flow' },
            { key: 'outstandingDebt', name: 'Outstanding Debt', value: 24500, displayValue: '$24,500', benchmark: 20000, target: 15000, status: 'danger', trend: 'stable', recommendation: 'High debt load - consider refinancing options' }
          ],
          warningMetrics: [
            { key: 'staffingRatio', name: 'Staffing Cost Ratio', value: 0.52, displayValue: '52%', benchmark: 0.50, target: 0.45, status: 'warning', trend: 'stable', recommendation: 'Monitor closely - don\'t add staff until 35+ students' },
            { key: 'studentRetention', name: 'Student Retention Rate', value: 0.82, displayValue: '82%', benchmark: 0.90, target: 0.95, status: 'warning', trend: 'declining', recommendation: 'Below benchmark - focus on family engagement' },
            { key: 'collectionRate', name: 'Collection Rate', value: 0.82, displayValue: '82%', benchmark: 0.95, target: 0.98, status: 'warning', trend: 'declining', recommendation: 'Set up auto-pay for all families' }
          ],
          goodMetrics: [
            { key: 'enrollmentToGoal', name: 'Enrollment to Goal', value: 0.80, displayValue: '80%', benchmark: 0.75, target: 1.00, status: 'good', trend: 'improving', recommendation: 'On track - need 7 more students' },
            { key: 'debtToRevenue', name: 'Debt to Revenue Ratio', value: 0.12, displayValue: '12%', benchmark: 0.15, target: 0.10, status: 'good', trend: 'stable', recommendation: 'Healthy debt level - monitor for growth' }
          ],
          excellentMetrics: [],
          insights: [
            { type: 'critical', title: 'Cash Crisis Imminent', message: 'Only 5 days of cash remaining', action: 'Collect outstanding payments immediately' },
            { type: 'warning', title: 'Facility Costs Too High', message: 'Rent consumes 28% of revenue', action: 'Renegotiate lease or find shared space' }
          ],
          urgentActions: [
            { priority: 'high', metric: 'Days Cash on Hand', currentValue: '5 days', targetValue: '45 days', action: 'Collect outstanding payments', timeframe: 'Immediate' },
            { priority: 'high', metric: 'Rent to Revenue Ratio', currentValue: '28%', targetValue: '15%', action: 'Reduce facility costs', timeframe: 'Immediate' }
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
