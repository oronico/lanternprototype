# 📋 Enrollment to Contract to Payment Workflow

## **How Students Get Connected to Contracts - Step by Step**

### **Step 1: Family Inquiry**
```
New family contacts school
↓
Enter in CRM:
- Family name
- Parent names & contact info
- Student names, ages, grades
- Inquiry source (Facebook, referral, etc.)
- ESA eligible? (yes/no)
```

### **Step 2: Tour & Application**
```
Family tours school
↓
Update CRM:
- Tour date & outcome
- Application submitted
- Acceptance decision
```

### **Step 3: Generate Enrollment Contract** 🔗
```
AI Contract Generator pulls from CRM:
- Family name: Johnson Family
- Student names: Emma (3rd), Liam (1st) ← FROM CRM
- Monthly tuition: $1,166 for 2 students
- ESA info: Both ESA eligible, $667 each
- Payment terms: Monthly, 1st of month
- Academic year: Aug 2024 - June 2025

RESULT: Contract with students embedded
```

### **Step 4: E-Signature**
```
Send contract to parents
↓
Michael Johnson signs (primary)
Sarah Johnson signs (secondary)
↓
Contract Status: SIGNED
Contract ID: contract_001
Students: Emma & Liam now officially enrolled
```

### **Step 5: Payment Setup (The Connection!)**
```
After contract signed:
↓
Link payment method:
- ClassWallet account for ESA payment
- OR Stripe for credit card
- OR Bank account for ACH

Platform creates connection:
Contract_001 ← Linked to → Johnson Family
    ↓
Contains: Emma & Liam
    ↓
Payment: $1,166/month via ClassWallet
    ↓
Tranche Reconciliation: When Omella sends $8,750
    Split into: Johnson $1,166 for Emma & Liam
```

### **Step 6: Ongoing Management**
```
Every month:
1. Contract says: Johnson owes $1,166 for Emma & Liam
2. Payment comes in via ClassWallet tranche
3. Platform maps: $1,166 → Contract_001 → Emma & Liam
4. QuickBooks entry: 
   Revenue - ClassWallet: $1,166
   Customer: Johnson Family
   Students: Emma Johnson, Liam Johnson
```

---

## **The Data Model Connection**

### **Family Record (CRM)**
```javascript
{
  familyId: "family_001",
  familyName: "Johnson",
  students: [
    { studentId: "student_001", name: "Emma Johnson", grade: "3rd" },
    { studentId: "student_002", name: "Liam Johnson", grade: "1st" }
  ],
  
  // THIS IS THE CONNECTION ↓
  contractId: "contract_001",  // Links to contract
  
  paymentMethod: "ClassWallet",
  paymentSchedule: "monthly"
}
```

### **Contract Record**
```javascript
{
  contractId: "contract_001",
  
  // THIS IS THE CONNECTION ↓
  familyId: "family_001",  // Links back to family
  
  studentIds: ["student_001", "student_002"],  // Links to specific students
  
  monthlyTuition: 1166,
  startDate: "2024-08-15",
  endDate: "2025-06-15",
  status: "signed"
}
```

### **Payment Transaction**
```javascript
{
  transactionId: "pay_001",
  amount: 1166,
  date: "2024-11-01",
  
  // THIS IS THE CONNECTION ↓
  contractId: "contract_001",  // Links to contract
  familyId: "family_001",      // Links to family
  studentIds: ["student_001", "student_002"],  // Knows which students
  
  method: "ClassWallet",
  trancheId: "tranche_001",  // If from bulk payment
  status: "paid"
}
```

---

## **Real-World User Flow in Platform**

### **Scenario: Enroll Chen Family**

**1. User clicks "Add New Family" in CRM**
- Enter: Chen Family, David & Lisa Chen
- Add student: Michael Chen, 5th grade, ESA eligible
- Save

**2. User clicks "Generate Contract" for Chen Family**
- Platform auto-fills:
  - Family name: Chen Family
  - Student: Michael Chen, 5th grade
  - Tuition: $667/month (1 student)
  - ESA: $667 (fully covered)
- User reviews and clicks "Generate"

**3. User clicks "Send for Signature"**
- Email sent to David & Lisa Chen
- Contract includes Michael's name throughout
- Parents sign electronically

**4. User clicks "Link Payment" (after signatures)**
- Select payment method: ClassWallet (ESA)
- Platform creates link:
  ```
  Chen Family → Contract_003 → Michael Chen → $667/month ClassWallet
  ```

**5. Automatic Ongoing:**
- When ClassWallet tranche arrives with $8,750
- Platform sees Chen Family payment: $667
- Automatically applies to Contract_003
- Updates: Michael Chen tuition current
- QuickBooks entry: Revenue $667, Customer: Chen Family

---

## **Why This Connection Matters**

### **Without Proper Connection:**
❌ Payment comes in - who is it for?
❌ Student leaves - is their family paid up?
❌ Contract expires - which students renew?
❌ Manual work to figure out who owes what

### **With SchoolStack.ai Connection:**
✅ Payment arrives → instantly know which students
✅ Student struggling → see payment history + satisfaction score
✅ Contract expiring → automated re-enrollment for all students
✅ Zero manual work - everything connected

---

## **The Missing Piece We Need to Build:**

### **Contract Generation Flow**
**Current:** Contract generator exists but not connected to CRM
**Need:** 
1. "Generate Contract" button in Family CRM
2. Auto-populate student names from family record
3. After signing, update family record with contractId
4. Link payment method to contract

**This workflow component will make the connection crystal clear!**

Would you like me to build the enrollment workflow component that visually shows users how to connect students → contracts → payments?
