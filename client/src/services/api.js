import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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

// API services
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getAlerts: () => api.get('/dashboard/alerts'),
  executeAction: (actionType, targetId, data) => 
    api.post('/dashboard/action', { actionType, targetId, data }),
};

export const paymentsAPI = {
  getPayments: (params) => api.get('/payments', { params }),
  getStatistics: () => api.get('/payments/statistics'),
  executePaymentAction: (paymentId, actionType) => 
    api.post(`/payments/${paymentId}/action`, { actionType }),
  getIntegrations: () => api.get('/payments/integrations'),
  syncPayments: (provider) => api.post('/payments/sync', { provider }),
};

export const calculatorAPI = {
  calculatePricing: (params) => api.post('/calculator/pricing', params),
  calculateTuitionEngine: (params) => api.post('/calculator/tuition-engine', params),
  getBenchmarks: () => api.get('/calculator/benchmarks'),
  calculateScenario: (baseScenario, changes) => 
    api.post('/calculator/scenario', { baseScenario, changes }),
};

export const healthAPI = {
  getScorecard: () => api.get('/health/scorecard'),
  getMetrics: () => api.get('/health/metrics'),
  getLoanReadiness: () => api.get('/health/loan-readiness'),
  getTrends: () => api.get('/health/trends'),
  generateActionPlan: (priority) => api.post('/health/action-plan', { priority }),
};

export const enrollmentAPI = {
  getPipeline: () => api.get('/enrollment/pipeline'),
  getFamilies: (params) => api.get('/enrollment/families', { params }),
  getAnalytics: () => api.get('/enrollment/analytics'),
  executeFamilyAction: (familyId, actionType, data) => 
    api.post(`/enrollment/families/${familyId}/action`, { actionType, data }),
  addFamily: (familyData) => api.post('/enrollment/families', familyData),
  getRecommendations: () => api.get('/enrollment/recommendations'),
};

export const leaseAPI = {
  getAnalysis: () => api.get('/lease/analysis'),
  getAlternatives: (params) => api.get('/lease/alternatives', { params }),
  getRecommendations: () => api.get('/lease/recommendations'),
  analyzeLease: (leaseData) => api.post('/lease/analyze', leaseData),
  getTemplate: (type) => api.get(`/lease/templates/${type}`),
  getMarketData: (params) => api.get('/lease/market-data', { params }),
};

export const aiAPI = {
  getTemplates: (category) => api.get('/ai/templates', { params: { category } }),
  generateDocument: (documentType, schoolInfo, customization, specificRequests) => 
    api.post('/ai/generate', { documentType, schoolInfo, customization, specificRequests }),
  reviewDocument: (documentContent, reviewType, specificConcerns) => 
    api.post('/ai/review', { documentContent, reviewType, specificConcerns }),
  getSuggestions: (schoolStage, currentChallenges) => 
    api.get('/ai/suggestions', { params: { schoolStage, currentChallenges } }),
};

// Initialize app
export const initializeApp = async () => {
  try {
    // Check API health
    await api.get('/health-check');
    console.log('✅ API connection established');
  } catch (error) {
    console.error('❌ Failed to connect to API:', error.message);
  }
};

export default api;
