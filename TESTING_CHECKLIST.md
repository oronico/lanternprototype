# 🧪 SchoolStack.ai - Testing Checklist

## Pre-Demo Testing (Do This First!)

### **1. Initial Setup Test** ⏱️ 5 minutes

**Clear your browser data**:
```javascript
// In browser console (F12):
localStorage.clear();
sessionStorage.clear();
// Then hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**Expected Result**:
- ✓ Redirects to login page
- ✓ Login with test account
- ✓ Redirects to onboarding flow

---

### **2. Onboarding Flow Test** ⏱️ 10 minutes

**Step-by-step checklist**:

#### Step 1: Operating Stage Selection
- [ ] Three cards display (Year 0, Year 1-2, Year 3+)
- [ ] Clicking a card highlights it (blue border)
- [ ] Checkmark appears on selected card
- [ ] "Continue" button is enabled
- [ ] Test selection: Choose "Years 1-2 - Building"

#### Step 2: School Basics
- [ ] School name field works
- [ ] Fiscal year date pickers work
- [ ] Current/Target enrollment number fields work
- [ ] **NEW: Accounting Method selection displays**
- [ ] Cash Accounting is selected by default
- [ ] Can toggle to Accrual Accounting
- [ ] Blue info box explains the difference
- [ ] "Continue" button validates required fields
- [ ] Test: Fill in all fields, leave accounting as "Cash"

#### Step 3: Connect Systems
- [ ] Accounting system buttons (QuickBooks, Xero, Wave, None)
- [ ] Payroll system buttons (Gusto, ADP, QuickBooks, Other, None)
- [ ] Bank account connection button
- [ ] Credit card connection button
- [ ] Checkmarks appear when selected
- [ ] Test: Select QuickBooks + Gusto + connect bank

#### Step 4: Historical Data Upload (if Year 1-2 or 3+)
- [ ] P&L upload area displays
- [ ] Cash Flow upload area displays
- [ ] File selection works
- [ ] Success message after upload
- [ ] "Skip" button works
- [ ] Test: Upload a sample PDF

#### Step 5: Loans & Debt
- [ ] "Yes, I have loans" / "No loans" toggles
- [ ] Loan details form appears if "Yes"
- [ ] All fields work (type, balance, payment, rate)
- [ ] "Add Another Loan" button works
- [ ] Test: Add 1 loan ($24,500, $1,850/mo)

#### Step 6: Current Year Proforma
- [ ] Proforma upload area displays
- [ ] Enrollment CSV upload area displays
- [ ] Success info box displays
- [ ] "Complete Setup 🎉" button appears
- [ ] Test: Click complete

**Expected Result**:
- ✓ Success toast: "Welcome to SchoolStack.ai! 🎉"
- ✓ Redirects to main dashboard
- ✓ localStorage now has `onboardingComplete: true`

---

### **3. Dashboard & Navigation Test** ⏱️ 5 minutes

#### Sidebar Navigation
- [ ] All menu items display
- [ ] "New" badges show on new features
- [ ] "Pro" badges show on premium features
- [ ] Active page highlights in blue
- [ ] All icons display correctly
- [ ] School info shows at bottom

#### Test Each New Route:
- [ ] `/dashboard` - Main dashboard loads
- [ ] `/back-office` - **Chief of Staff Hub** loads
- [ ] `/nudges` - Daily Guidance displays nudges
- [ ] `/bookkeeping` - Automated Bookkeeping shows connections
- [ ] `/cash-reality` - Cash dashboard with 30/60/90 toggle
- [ ] `/budget-vs-cash` - Budget comparison tool
- [ ] `/milestones` - Milestone tracker displays
- [ ] `/operations/metrics` - **Operational metrics KPIs**
- [ ] `/programs` - **Program management cards**
- [ ] `/payments/reconciliation` - **Payment reconciliation table**
- [ ] `/reports/bank-ready` - All 5 report templates
- [ ] `/documents/repository` - Document categories
- [ ] `/pricing` - Updated pricing ($49/$99/$199)

---

### **4. Operational Metrics Test** ⏱️ 3 minutes

**Navigate to**: `/operations/metrics`

- [ ] Three KPI cards display:
  - Contract Coverage: 85.7%
  - On-Time Payment: 82.1%
  - Enrollment vs. Capacity: 54.8%
- [ ] "Poor (<70%)" displays correctly (no error!)
- [ ] Trend arrows show (up/down)
- [ ] Utilization by Program section shows 4 programs
- [ ] Color-coded utilization bars display
- [ ] Financial Impact Analysis shows 4 metrics
- [ ] Recommendations section shows 3 action items
- [ ] Timeframe selector works

---

### **5. Payment Reconciliation Test** ⏱️ 5 minutes

**Navigate to**: `/payments/reconciliation`

- [ ] Payment table displays with 5 mock payments
- [ ] Filter buttons work (All, Needs Review, Allocated, Unreconciled)
- [ ] Status badges show correct colors
- [ ] Source badges (Stripe, Omella, ClassWallet) display
- [ ] Student allocation details show
- [ ] Confidence percentages display
- [ ] Sync status indicators (QB Synced, Bank Reconciled)
- [ ] "Review & Allocate" button on needs-review items
- [ ] Click "Review & Allocate" opens modal
- [ ] Modal shows payment details
- [ ] AI suggested allocation displays
- [ ] "Approve & Sync to QuickBooks" button works
- [ ] Success toast appears
- [ ] Payment moves to "Complete" status

**Test Specific Scenarios**:
- [ ] Single-child payment (Johnson Family) - Shows 1 student
- [ ] Multi-child payment (Martinez Family) - Shows 2 students with split
- [ ] Prepayment (Chen Family) - Shows "3 months" notation
- [ ] Partial payment (Williams Family) - Shows "needs review"
- [ ] Batch transfer - Shows "Multiple Families (Batch)"

---

### **6. Program Management Test** ⏱️ 3 minutes

**Navigate to**: `/programs`

- [ ] 4 program cards display
- [ ] Utilization bars show correct percentages
- [ ] Color coding works (green >90%, blue >75%, yellow >50%, red <50%)
- [ ] Sliding scale tiers display for programs that have them
- [ ] Discount rules show (sibling, staff)
- [ ] Enrollment numbers display (current/available/waitlist)
- [ ] Schedule info shows (days per week)
- [ ] "View Enrollments" and "Edit Program" buttons present
- [ ] Summary stats at bottom show totals

---

### **7. Pricing Page Test** ⏱️ 3 minutes

**Navigate to**: `/pricing`

- [ ] Three pricing cards ($49, $99, $199)
- [ ] "Most Popular" badge on Professional plan
- [ ] ROI savings calculations display
- [ ] Feature lists organized by category
- [ ] "Best For" descriptions clear
- [ ] Trust factors show (Bank-approved, SBA, etc.)
- [ ] "How It Works" section with 4 steps
- [ ] FAQ section displays
- [ ] Student count slider updates ROI

---

### **8. Mobile Responsiveness Test** ⏱️ 5 minutes

**Test on mobile device or Chrome DevTools**:
- [ ] Onboarding flow works on mobile
- [ ] Sidebar collapses or adapts
- [ ] All new dashboards are readable
- [ ] Tables scroll horizontally on mobile
- [ ] Buttons are touch-friendly (min 44×44px)
- [ ] Modals work on small screens
- [ ] Pricing cards stack vertically

---

### **9. Confetti Test** ⏱️ 1 minute 🎊

**Navigate to**: `/milestones`

- [ ] Milestone cards display with progress bars
- [ ] Find milestone with "Celebrate (Demo)" button
- [ ] Click the button
- [ ] **Confetti animation triggers!**
- [ ] Modal appears with trophy icon
- [ ] Celebration message displays
- [ ] "Awesome! 🚀" button works
- [ ] Confetti stops after 5 seconds

**This is your "wow" moment for demos!**

---

### **10. Integration Points Test** ⏱️ 2 minutes

**Verify these are ready for API connections**:

- [ ] `/bookkeeping` - Shows placeholder for Plaid connection
- [ ] QuickBooks sync status area (currently "not connected")
- [ ] Payment reconciliation (ready for webhook data)
- [ ] Transaction categorization (ready for AI)

---

## 🐛 Common Issues to Check

### **If something doesn't load**:
1. Check browser console (F12) for errors
2. Verify all imports are correct
3. Check network tab for failed API calls
4. Hard refresh (Cmd+Shift+R)

### **If styles look broken**:
1. Check that Tailwind CSS is working
2. Verify all className strings are valid
3. Check for any custom CSS conflicts

### **If navigation doesn't work**:
1. Check React Router is working
2. Verify all route paths match sidebar links
3. Check for typos in URLs

---

## ✅ Testing Sign-Off

Once you've completed all tests above, you're ready to demo!

**Sign-off checklist**:
- [ ] All routes load without errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Confetti works (critical for demos! 🎊)
- [ ] All three pricing tiers display
- [ ] Payment reconciliation functional
- [ ] Operational metrics display correctly

**Estimated Total Testing Time**: 35-40 minutes

---

## 🚨 Quick Fixes (If Needed)

**If you find any issues**, create a list and I'll fix them immediately before your demo!

**Ready to test?** Start at the top and work your way down! ✓

