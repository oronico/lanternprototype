# 🚀 Modular Architecture - Implementation Examples

This document shows practical examples of how to use the modular architecture patterns in your SchoolStack.ai platform.

---

## 📋 Table of Contents

1. [Using Feature Flags](#using-feature-flags)
2. [Event Bus Communication](#event-bus-communication)
3. [Analytics Tracking](#analytics-tracking)
4. [Feature Gate Components](#feature-gate-components)
5. [Complete Feature Example](#complete-feature-example)

---

## 1. Using Feature Flags

### Basic Feature Check

```javascript
import { useFeature } from '../shared/hooks/useFeature';

function OperationalMetrics() {
  const { enabled, beta, tier } = useFeature('operationalMetrics');
  
  if (!enabled) {
    return <UpgradePrompt tier={tier} />;
  }
  
  return (
    <div>
      {beta && <BetaBadge />}
      <MetricsDashboard />
    </div>
  );
}
```

### Checking Multiple Features

```javascript
import { useFeatures } from '../shared/hooks/useFeature';

function Dashboard() {
  const features = useFeatures([
    'cashReality',
    'budgetVsCash',
    'operationalMetrics'
  ]);
  
  return (
    <div className="dashboard">
      {features.cashReality && <CashRealityCard />}
      {features.budgetVsCash && <BudgetVsCashCard />}
      {features.operationalMetrics && <MetricsCard />}
    </div>
  );
}
```

### Programmatic Feature Check

```javascript
import { isFeatureEnabled } from '../shared/featureFlags';

async function handleAction() {
  const user = getCurrentUser();
  
  if (isFeatureEnabled('automatedBookkeeping', user)) {
    await runAutomatedCategorization();
  } else {
    await runManualCategorization();
  }
}
```

### Development: Override Features

In development mode, you can override features in the browser console:

```javascript
// Enable a disabled feature
localStorage.setItem('ff_aiFinancialAdvisor', 'true');

// Disable an enabled feature
localStorage.setItem('ff_operationalMetrics', 'false');

// Clear all overrides
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('ff_')) {
    localStorage.removeItem(key);
  }
});
```

---

## 2. Event Bus Communication

### Emitting Events

```javascript
import { eventBus, EVENTS } from '../shared/eventBus';

// In PaymentTracking component
function handlePaymentReceived(payment) {
  // Save payment to database
  await savePayment(payment);
  
  // Emit event for other features to react
  eventBus.emit(EVENTS.PAYMENT_RECEIVED, {
    familyId: payment.familyId,
    amount: payment.amount,
    method: payment.method,
    timestamp: new Date(),
  });
}
```

### Listening to Events (Hook)

```javascript
import { useEventBus } from '../shared/hooks/useEventBus';

function Dashboard() {
  const [cashBalance, setCashBalance] = useState(14200);
  
  // Listen for payment events
  useEventBus(EVENTS.PAYMENT_RECEIVED, (payment) => {
    console.log('Payment received:', payment);
    setCashBalance(prev => prev + payment.amount);
    showCelebration();
  });
  
  return <div>Cash: ${cashBalance}</div>;
}
```

### Listening to Events (Manual)

```javascript
import { eventBus, EVENTS } from '../shared/eventBus';

function FinancialHealth() {
  useEffect(() => {
    // Subscribe to multiple events
    const unsubscribe1 = eventBus.on(EVENTS.PAYMENT_RECEIVED, handlePayment);
    const unsubscribe2 = eventBus.on(EVENTS.CASH_LOW, handleLowCash);
    const unsubscribe3 = eventBus.on(EVENTS.GOAL_REACHED, handleGoalReached);
    
    // Cleanup on unmount
    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);
  
  return <HealthScorecard />;
}
```

### One-Time Event Listener

```javascript
import { eventBus, EVENTS } from '../shared/eventBus';

function OnboardingWizard() {
  useEffect(() => {
    // Listen once, then auto-unsubscribe
    eventBus.once(EVENTS.MILESTONE_COMPLETED, (milestone) => {
      if (milestone.id === 'first_payment') {
        showCelebration();
        moveToNextStep();
      }
    });
  }, []);
}
```

### Custom Events

```javascript
// Define your own events
const CUSTOM_EVENTS = {
  REPORT_GENERATED: 'reports.generated',
  EXPORT_COMPLETED: 'export.completed',
  SYNC_FAILED: 'sync.failed',
};

// Emit
eventBus.emit(CUSTOM_EVENTS.REPORT_GENERATED, {
  reportType: 'bank-ready',
  format: 'pdf',
  filename: 'financial-report.pdf',
});

// Listen
useEventBus(CUSTOM_EVENTS.REPORT_GENERATED, (report) => {
  toast.success(`Report ready: ${report.filename}`);
});
```

---

## 3. Analytics Tracking

### Track Feature Usage

```javascript
import { analytics } from '../shared/analytics';

function AutomatedBookkeeping() {
  const handleCategorize = (transaction) => {
    // Categorize the transaction
    const result = categorizeTransaction(transaction);
    
    // Track the action
    analytics.trackFeatureUsage('automatedBookkeeping', 'categorize', {
      confidence: result.confidence,
      category: result.category,
      manual: false,
      amount: transaction.amount,
    });
  };
  
  return <TransactionList onCategorize={handleCategorize} />;
}
```

### Track Page Views

```javascript
import { analytics } from '../shared/analytics';

function OperationalMetrics() {
  useEffect(() => {
    // Track page view
    analytics.trackPageView('operational-metrics', {
      section: 'operations',
      hasData: true,
    });
  }, []);
  
  return <MetricsDashboard />;
}
```

### Track Performance

```javascript
import { analytics } from '../shared/analytics';

function Dashboard() {
  useEffect(() => {
    const startTime = performance.now();
    
    loadDashboardData().then(() => {
      const loadTime = performance.now() - startTime;
      
      // Track how long it took to load
      analytics.trackFeaturePerformance('dashboard', loadTime);
      
      if (loadTime > 3000) {
        console.warn('Dashboard loaded slowly:', loadTime);
      }
    });
  }, []);
}
```

### Track Errors

```javascript
import { analytics } from '../shared/analytics';

function PaymentForm() {
  const handleSubmit = async (data) => {
    try {
      await submitPayment(data);
    } catch (error) {
      // Track error with context
      analytics.trackError(error, {
        feature: 'payment-form',
        action: 'submit',
        paymentMethod: data.method,
        amount: data.amount,
      });
      
      toast.error('Payment failed. Please try again.');
    }
  };
}
```

### Track A/B Tests

```javascript
import { analytics } from '../shared/analytics';

function OnboardingFlow() {
  const variant = useABTest('new-onboarding-flow');
  
  useEffect(() => {
    // Track which variant user saw
    analytics.trackExperiment('new-onboarding-flow', variant);
  }, [variant]);
  
  const handleComplete = () => {
    // Track conversion
    analytics.trackExperiment('new-onboarding-flow', variant, true);
  };
  
  return variant === 'control' ? <OldOnboarding /> : <NewOnboarding />;
}
```

### Using Analytics Hook

```javascript
import { useAnalytics } from '../shared/analytics';

function BankReadyReports() {
  const { trackFeature, trackPage, track } = useAnalytics();
  
  useEffect(() => {
    trackPage('bank-ready-reports');
  }, []);
  
  const handleGenerateReport = (reportType) => {
    trackFeature('bankReadyReports', 'generate', {
      reportType: reportType,
      format: 'pdf',
    });
    
    generateReport(reportType);
  };
  
  const handleDownload = (filename) => {
    track('report_downloaded', {
      filename: filename,
      feature: 'bankReadyReports',
    });
  };
}
```

---

## 4. Feature Gate Components

### Basic Feature Gate

```javascript
import FeatureGate from '../components/Shared/FeatureGate';
import AutomatedBookkeeping from '../components/Bookkeeping/AutomatedBookkeeping';

function BookkeepingPage() {
  return (
    <FeatureGate feature="automatedBookkeeping">
      <AutomatedBookkeeping />
    </FeatureGate>
  );
}
```

### Feature Gate with Custom Fallback

```javascript
import FeatureGate from '../components/Shared/FeatureGate';

function AdvancedDashboard() {
  return (
    <FeatureGate 
      feature="operationalMetrics"
      fallback={<BasicDashboard />}
    >
      <AdvancedDashboard />
    </FeatureGate>
  );
}
```

### Feature Gate Without Upgrade Prompt

```javascript
function OptionalFeature() {
  return (
    <FeatureGate 
      feature="aiAssistant"
      showUpgradePrompt={false}
      fallback={<div>AI Assistant coming soon!</div>}
    >
      <AIAssistant />
    </FeatureGate>
  );
}
```

### Feature Check (No UI)

```javascript
import { FeatureCheck } from '../components/Shared/FeatureGate';

function Sidebar() {
  return (
    <nav>
      <MenuItem to="/dashboard">Dashboard</MenuItem>
      <MenuItem to="/payments">Payments</MenuItem>
      
      <FeatureCheck feature="automatedBookkeeping">
        <MenuItem to="/bookkeeping" badge="Pro">
          Bookkeeping
        </MenuItem>
      </FeatureCheck>
      
      <FeatureCheck feature="operationalMetrics">
        <MenuItem to="/operations/metrics" badge="Beta">
          Metrics
        </MenuItem>
      </FeatureCheck>
    </nav>
  );
}
```

---

## 5. Complete Feature Example

Here's a complete example showing all patterns together:

### New Feature: AI Financial Advisor

**Step 1: Add to Feature Flags**

```javascript
// client/src/shared/featureFlags.js
export const FEATURES = {
  // ... existing features
  AI_FINANCIAL_ADVISOR: 'aiFinancialAdvisor',
};

export const featureConfig = {
  // ... existing config
  [FEATURES.AI_FINANCIAL_ADVISOR]: {
    enabled: true,
    rollout: 25, // Start with 25% of users
    tier: 'professional',
    beta: true,
    description: 'Get AI-powered financial recommendations',
  },
};
```

**Step 2: Create Feature Component**

```javascript
// client/src/components/AI/AIFinancialAdvisor.js
import React, { useEffect, useState } from 'react';
import { analytics } from '../../shared/analytics';
import { useEventBus, useEventEmit } from '../../shared/hooks/useEventBus';
import { EVENTS } from '../../shared/eventBus';

export default function AIFinancialAdvisor() {
  const [recommendations, setRecommendations] = useState([]);
  const emit = useEventEmit();
  
  // Track page view
  useEffect(() => {
    const startTime = performance.now();
    
    analytics.trackPageView('ai-financial-advisor', { beta: true });
    
    loadRecommendations().then(data => {
      setRecommendations(data);
      
      const loadTime = performance.now() - startTime;
      analytics.trackFeaturePerformance('ai-financial-advisor', loadTime);
    });
  }, []);
  
  // Listen to financial events
  useEventBus(EVENTS.PAYMENT_RECEIVED, (payment) => {
    console.log('Payment received, updating recommendations...');
    refreshRecommendations();
  });
  
  useEventBus(EVENTS.CASH_LOW, (data) => {
    // Add urgent recommendation
    addUrgentRecommendation('cash-management', data);
  });
  
  const handleApplyRecommendation = (recommendation) => {
    // Track action
    analytics.trackFeatureUsage('aiFinancialAdvisor', 'apply_recommendation', {
      type: recommendation.type,
      impact: recommendation.estimatedImpact,
    });
    
    // Apply the recommendation
    applyRecommendation(recommendation);
    
    // Emit event for other features
    emit('recommendation.applied', recommendation);
    
    toast.success('Recommendation applied!');
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
            Beta
          </span>
          <p className="text-sm text-purple-800">
            AI Financial Advisor is in beta. Share your feedback to help us improve!
          </p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold">AI Financial Advisor</h2>
      
      <div className="grid gap-4">
        {recommendations.map(rec => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onApply={() => handleApplyRecommendation(rec)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Add Route with Feature Gate**

```javascript
// client/src/App.js
import FeatureGate from './components/Shared/FeatureGate';
import AIFinancialAdvisor from './components/AI/AIFinancialAdvisor';

function AppContent() {
  return (
    <Routes>
      {/* ... existing routes */}
      
      <Route 
        path="/ai-advisor" 
        element={
          <FeatureGate feature="aiFinancialAdvisor">
            <AIFinancialAdvisor />
          </FeatureGate>
        } 
      />
    </Routes>
  );
}
```

**Step 4: Add to Sidebar (Conditional)**

```javascript
// client/src/components/Layout/Sidebar.js
import { FeatureCheck } from '../Shared/FeatureGate';

function Sidebar() {
  return (
    <nav>
      {/* ... existing items */}
      
      <FeatureCheck feature="aiFinancialAdvisor">
        <SidebarLink 
          to="/ai-advisor" 
          icon={SparklesIcon}
          badge="Beta"
        >
          AI Advisor
        </SidebarLink>
      </FeatureCheck>
    </nav>
  );
}
```

**Step 5: Gradual Rollout**

```javascript
// After 1 week of testing with 25% of users, increase rollout
// client/src/shared/featureFlags.js
[FEATURES.AI_FINANCIAL_ADVISOR]: {
  enabled: true,
  rollout: 50, // Increased to 50%
  tier: 'professional',
  beta: true,
},

// After 2 weeks, increase again
rollout: 75,

// After 3 weeks, full rollout
rollout: 100,
beta: false, // Remove beta badge
```

---

## 🎯 Best Practices

### 1. Always Use Feature Flags for New Features

```javascript
// ❌ Bad: Directly add new feature
<Route path="/new-feature" element={<NewFeature />} />

// ✅ Good: Wrap in feature gate
<Route path="/new-feature" element={
  <FeatureGate feature="newFeature">
    <NewFeature />
  </FeatureGate>
} />
```

### 2. Track Everything

```javascript
// Track when feature loads
useEffect(() => {
  analytics.trackPageView('feature-name');
}, []);

// Track when user interacts
const handleAction = () => {
  analytics.trackFeatureUsage('feature-name', 'action-name', { metadata });
  doAction();
};

// Track errors
try {
  await riskyOperation();
} catch (error) {
  analytics.trackError(error, { feature: 'feature-name' });
}
```

### 3. Use Events for Cross-Feature Communication

```javascript
// ❌ Bad: Direct import and call
import { updateDashboard } from '../Dashboard';
updateDashboard(payment);

// ✅ Good: Emit event
eventBus.emit(EVENTS.PAYMENT_RECEIVED, payment);
// Dashboard listens and updates itself
```

### 4. Show Beta Badges

```javascript
const { enabled, beta } = useFeature('myFeature');

return (
  <div>
    {beta && (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
        Beta
      </span>
    )}
    <MyFeature />
  </div>
);
```

---

## 🔧 Development Tools

### Feature Admin Panel

Access at `/admin/features` (development only):

```javascript
// Add route in App.js
import FeatureAdmin from './components/Admin/FeatureAdmin';

<Route path="/admin/features" element={<FeatureAdmin />} />
```

### Console Commands

```javascript
// View all features and their status
Object.entries(featureConfig).forEach(([name, config]) => {
  console.log(`${name}: ${config.enabled ? '✅' : '❌'}`);
});

// View analytics queue
analytics.getQueue();

// View event bus listeners
eventBus.getEvents();
```

---

## 📊 Measuring Success

### Key Metrics to Track

1. **Feature Adoption**: % of users who try a new feature within 7 days
2. **Feature Engagement**: Average uses per user per week
3. **Feature Performance**: Load time, error rate
4. **User Satisfaction**: Feedback scores, NPS by feature

### Example Analytics Dashboard

```javascript
// Get feature usage stats
const featureStats = {
  users: {
    total: 100,
    withAccess: 75,
    activated: 50,
    active: 35,
  },
  adoption: {
    within7days: '50%',
    within30days: '70%',
  },
  engagement: {
    avgUsesPerWeek: 4.2,
    avgTimeSpent: '12 minutes',
  },
  performance: {
    avgLoadTime: '1.2s',
    errorRate: '0.5%',
  },
};
```

---

This concludes the implementation examples! Start with feature flags, add analytics, and gradually adopt the event bus pattern as your features grow.

