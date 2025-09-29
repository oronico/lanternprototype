const express = require('express');
const router = express.Router();

// Payment Reconciliation Engine for Tranche Payments (Omella, ClassWallet, etc.)
const tranchePayments = [
  {
    id: 'tranche_001',
    provider: 'Omella',
    trancheDate: '2024-11-15',
    totalAmount: 8750.00,
    paymentMethod: 'ACH',
    status: 'received',
    reconciliationStatus: 'partially_mapped',
    
    // Individual family payments within the tranche
    familyPayments: [
      {
        familyId: 'family_johnson',
        familyName: 'Johnson Family',
        contractId: 'contract_001',
        studentNames: ['Emma Johnson', 'Liam Johnson'],
        paymentAmount: 1166.00,
        paymentPeriod: '2024-11-01',
        dueDate: '2024-11-01',
        paymentStatus: 'current',
        daysLate: 0,
        contractStatus: 'current',
        esaFunded: true,
        notes: 'ESA payment - fully covered'
      },
      {
        familyId: 'family_martinez',
        familyName: 'Martinez Family', 
        contractId: 'contract_002',
        studentNames: ['Sofia Martinez'],
        paymentAmount: 583.00,
        paymentPeriod: '2024-11-01',
        dueDate: '2024-11-05',
        paymentStatus: 'current',
        daysLate: 0,
        contractStatus: 'current',
        esaFunded: false,
        notes: 'Private pay family'
      },
      {
        familyId: 'family_thompson',
        familyName: 'Thompson Family',
        contractId: 'contract_004',
        studentNames: ['Alex Thompson', 'Maya Thompson', 'Jordan Thompson'],
        paymentAmount: 1458.00,
        paymentPeriod: '2024-11-01', 
        dueDate: '2024-11-01',
        paymentStatus: 'current',
        daysLate: 0,
        contractStatus: 'current',
        esaFunded: true,
        notes: 'Sibling discount applied'
      },
      {
        familyId: 'family_wilson',
        familyName: 'Wilson Family',
        contractId: 'contract_005',
        studentNames: ['Grace Wilson'],
        paymentAmount: 1749.00,
        paymentPeriod: '2024-11-01',
        dueDate: '2024-11-10',
        paymentStatus: 'current',
        daysLate: 0,
        contractStatus: 'current',
        esaFunded: false,
        notes: 'Quarterly payment plan'
      },
      {
        familyId: 'family_davis',
        familyName: 'Davis Family',
        contractId: 'contract_006',
        studentNames: ['Nathan Davis', 'Olivia Davis'],
        paymentAmount: 800.00,
        paymentPeriod: '2024-11-01',
        dueDate: '2024-11-01',
        paymentStatus: 'current',
        daysLate: 0,
        contractStatus: 'current',
        esaFunded: true,
        notes: 'Staff discount - 20% off'
      }
    ],
    
    // Accounting system mapping
    accountingMapping: {
      quickbooks: {
        depositAccount: 'Checking Account - Operating',
        revenueAccount: 'Tuition Revenue',
        customerMappings: [
          { familyId: 'family_johnson', qbCustomerId: 'QB_CUST_001', invoiceId: 'INV-2024-1101-001' },
          { familyId: 'family_martinez', qbCustomerId: 'QB_CUST_002', invoiceId: 'INV-2024-1105-002' },
          { familyId: 'family_thompson', qbCustomerId: 'QB_CUST_003', invoiceId: 'INV-2024-1101-003' },
          { familyId: 'family_wilson', qbCustomerId: 'QB_CUST_004', invoiceId: 'INV-2024-1110-004' },
          { familyId: 'family_davis', qbCustomerId: 'QB_CUST_005', invoiceId: 'INV-2024-1101-005' }
        ],
        journalEntryId: 'JE-2024-1115-001',
        syncStatus: 'pending'
      }
    }
  },
  
  // Example of problematic tranche (late payments)
  {
    id: 'tranche_002',
    provider: 'ClassWallet',
    trancheDate: '2024-10-31',
    totalAmount: 4665.00,
    paymentMethod: 'ESA_Transfer',
    status: 'received',
    reconciliationStatus: 'needs_attention',
    
    familyPayments: [
      {
        familyId: 'family_roberts',
        familyName: 'Roberts Family',
        contractId: 'contract_007',
        studentNames: ['Chloe Roberts', 'Dylan Roberts'],
        paymentAmount: 1166.00,
        paymentPeriod: '2024-10-01',
        dueDate: '2024-10-01',
        paymentStatus: 'late',
        daysLate: 45,
        contractStatus: 'at_risk',
        esaFunded: true,
        notes: 'ESA delay - family concerned about program'
      },
      {
        familyId: 'family_brown',
        familyName: 'Brown Family',
        contractId: 'contract_008',
        studentNames: ['Ethan Brown'],
        paymentAmount: 583.00,
        paymentPeriod: '2024-10-01',
        dueDate: '2024-10-05',
        paymentStatus: 'late',
        daysLate: 40,
        contractStatus: 'at_risk',
        esaFunded: true,
        notes: 'ESA processing delay'
      }
    ]
  }
];

// Contract Status Tracking
const contractStatuses = [
  {
    contractId: 'contract_001',
    familyId: 'family_johnson',
    familyName: 'Johnson Family',
    studentCount: 2,
    monthlyTuition: 1166.00,
    contractStatus: 'current',
    paymentHistory: [
      { date: '2024-11-01', amount: 1166.00, status: 'paid', method: 'Omella', daysLate: 0 },
      { date: '2024-10-01', amount: 1166.00, status: 'paid', method: 'Omella', daysLate: 3 },
      { date: '2024-09-01', amount: 1166.00, status: 'paid', method: 'Omella', daysLate: 0 }
    ],
    nextPaymentDue: '2024-12-01',
    riskLevel: 'low',
    esaFunded: true
  },
  {
    contractId: 'contract_007',
    familyId: 'family_roberts', 
    familyName: 'Roberts Family',
    studentCount: 2,
    monthlyTuition: 1166.00,
    contractStatus: 'at_risk',
    paymentHistory: [
      { date: '2024-10-01', amount: 1166.00, status: 'late', method: 'ClassWallet', daysLate: 45 },
      { date: '2024-09-01', amount: 1166.00, status: 'late', method: 'ClassWallet', daysLate: 25 },
      { date: '2024-08-01', amount: 1166.00, status: 'late', method: 'ClassWallet', daysLate: 15 }
    ],
    nextPaymentDue: '2024-11-01',
    riskLevel: 'high',
    esaFunded: true,
    interventionNeeded: true,
    notes: 'Pattern of late payments - ESA processing issues'
  }
];

// GET /api/reconciliation/tranches
router.get('/tranches', (req, res) => {
  try {
    const { provider, status, dateRange } = req.query;
    
    let filteredTranches = tranchePayments;
    
    if (provider) {
      filteredTranches = filteredTranches.filter(t => t.provider === provider);
    }
    
    if (status) {
      filteredTranches = filteredTranches.filter(t => t.reconciliationStatus === status);
    }
    
    const summary = {
      totalTranches: filteredTranches.length,
      totalAmount: filteredTranches.reduce((sum, t) => sum + t.totalAmount, 0),
      needsAttention: filteredTranches.filter(t => t.reconciliationStatus === 'needs_attention').length,
      fullyMapped: filteredTranches.filter(t => t.reconciliationStatus === 'fully_mapped').length,
      pendingReconciliation: filteredTranches.filter(t => t.reconciliationStatus === 'partially_mapped').length
    };
    
    res.json({
      tranches: filteredTranches,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tranche payments' });
  }
});

// POST /api/reconciliation/map-tranche
router.post('/map-tranche', (req, res) => {
  try {
    const { trancheId, familyMappings, accountingSystem } = req.body;
    
    const tranche = tranchePayments.find(t => t.id === trancheId);
    if (!tranche) {
      return res.status(404).json({ error: 'Tranche not found' });
    }
    
    // Process family mappings and update accounting system
    const mappingResults = familyMappings.map(mapping => {
      const familyPayment = tranche.familyPayments.find(fp => fp.familyId === mapping.familyId);
      
      if (!familyPayment) {
        return { familyId: mapping.familyId, status: 'error', message: 'Family payment not found in tranche' };
      }
      
      // Create accounting entries
      const accountingEntry = createAccountingEntry(familyPayment, mapping, accountingSystem);
      
      return {
        familyId: mapping.familyId,
        status: 'mapped',
        accountingEntry,
        contractUpdated: updateContractStatus(familyPayment)
      };
    });
    
    // Update tranche reconciliation status
    tranche.reconciliationStatus = 'fully_mapped';
    tranche.accountingMapping[accountingSystem].syncStatus = 'completed';
    tranche.accountingMapping[accountingSystem].syncDate = new Date().toISOString();
    
    res.json({
      success: true,
      trancheId,
      mappingResults,
      accountingSync: {
        system: accountingSystem,
        status: 'completed',
        entriesCreated: mappingResults.length,
        totalAmount: tranche.totalAmount
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to map tranche payments' });
  }
});

// GET /api/reconciliation/contract-status
router.get('/contract-status', (req, res) => {
  try {
    const { familyId, riskLevel, contractStatus } = req.query;
    
    let filteredContracts = contractStatuses;
    
    if (familyId) {
      filteredContracts = filteredContracts.filter(c => c.familyId === familyId);
    }
    
    if (riskLevel) {
      filteredContracts = filteredContracts.filter(c => c.riskLevel === riskLevel);
    }
    
    if (contractStatus) {
      filteredContracts = filteredContracts.filter(c => c.contractStatus === contractStatus);
    }
    
    // Calculate contract health metrics
    const contractHealth = {
      totalContracts: contractStatuses.length,
      currentContracts: contractStatuses.filter(c => c.contractStatus === 'current').length,
      atRiskContracts: contractStatuses.filter(c => c.contractStatus === 'at_risk').length,
      averageDaysLate: calculateAverageDaysLate(contractStatuses),
      interventionNeeded: contractStatuses.filter(c => c.interventionNeeded).length,
      esaFundedPercent: Math.round((contractStatuses.filter(c => c.esaFunded).length / contractStatuses.length) * 100)
    };
    
    res.json({
      contracts: filteredContracts,
      contractHealth,
      riskAnalysis: generateRiskAnalysis(contractStatuses),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract status' });
  }
});

// GET /api/reconciliation/payment-mapping/:trancheId
router.get('/payment-mapping/:trancheId', (req, res) => {
  try {
    const { trancheId } = req.params;
    
    const tranche = tranchePayments.find(t => t.id === trancheId);
    if (!tranche) {
      return res.status(404).json({ error: 'Tranche not found' });
    }
    
    // Intelligent payment matching suggestions
    const mappingSuggestions = tranche.familyPayments.map(familyPayment => {
      const matchingContract = contractStatuses.find(c => c.familyId === familyPayment.familyId);
      
      return {
        familyPayment,
        suggestedMapping: {
          contractMatch: matchingContract,
          confidenceScore: calculateMatchConfidence(familyPayment, matchingContract),
          accountingMapping: generateAccountingMapping(familyPayment, matchingContract),
          paymentPeriodMatch: familyPayment.paymentPeriod === matchingContract?.nextPaymentDue,
          amountMatch: familyPayment.paymentAmount === matchingContract?.monthlyTuition
        },
        reconciliationIssues: identifyReconciliationIssues(familyPayment, matchingContract)
      };
    });
    
    res.json({
      tranche,
      mappingSuggestions,
      autoMappingPossible: mappingSuggestions.filter(m => m.suggestedMapping.confidenceScore > 0.9).length,
      manualReviewNeeded: mappingSuggestions.filter(m => m.suggestedMapping.confidenceScore < 0.9).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate payment mappings' });
  }
});

// POST /api/reconciliation/sync-to-accounting
router.post('/sync-to-accounting', (req, res) => {
  try {
    const { trancheId, accountingSystem, mappings } = req.body;
    
    const tranche = tranchePayments.find(t => t.id === trancheId);
    if (!tranche) {
      return res.status(404).json({ error: 'Tranche not found' });
    }
    
    // Generate accounting entries based on system type
    const accountingEntries = generateAccountingEntries(tranche, mappings, accountingSystem);
    
    // Update contract statuses
    const contractUpdates = mappings.map(mapping => {
      const contract = contractStatuses.find(c => c.familyId === mapping.familyId);
      if (contract) {
        updateContractPaymentStatus(contract, mapping);
        return {
          contractId: contract.contractId,
          familyName: contract.familyName,
          newStatus: contract.contractStatus,
          paymentCurrent: contract.contractStatus === 'current'
        };
      }
      return null;
    }).filter(Boolean);
    
    res.json({
      success: true,
      trancheId,
      accountingEntries,
      contractUpdates,
      syncSummary: {
        system: accountingSystem,
        entriesCreated: accountingEntries.length,
        contractsUpdated: contractUpdates.length,
        totalAmount: tranche.totalAmount,
        syncDate: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync to accounting system' });
  }
});

// Helper Functions
function createAccountingEntry(familyPayment, mapping, accountingSystem) {
  const baseEntry = {
    familyId: familyPayment.familyId,
    amount: familyPayment.paymentAmount,
    date: familyPayment.paymentPeriod,
    description: `Tuition payment - ${familyPayment.familyName} - ${familyPayment.paymentPeriod}`
  };
  
  switch (accountingSystem) {
    case 'quickbooks':
      return {
        ...baseEntry,
        customerId: mapping.qbCustomerId,
        accountId: 'tuition_revenue',
        classId: familyPayment.esaFunded ? 'esa_students' : 'private_pay',
        memo: `${familyPayment.studentNames.join(', ')} - ${familyPayment.notes}`
      };
      
    case 'xero':
      return {
        ...baseEntry,
        contactId: mapping.xeroContactId,
        accountCode: '4000', // Revenue account
        trackingCategory: familyPayment.esaFunded ? 'ESA' : 'Private',
        reference: familyPayment.contractId
      };
      
    default:
      return baseEntry;
  }
}

function updateContractStatus(familyPayment) {
  const contract = contractStatuses.find(c => c.familyId === familyPayment.familyId);
  if (!contract) return null;
  
  // Add payment to history
  contract.paymentHistory.unshift({
    date: familyPayment.paymentPeriod,
    amount: familyPayment.paymentAmount,
    status: 'paid',
    method: familyPayment.provider || 'Omella',
    daysLate: familyPayment.daysLate || 0
  });
  
  // Update contract status based on payment patterns
  const recentPayments = contract.paymentHistory.slice(0, 3);
  const averageDaysLate = recentPayments.reduce((sum, p) => sum + (p.daysLate || 0), 0) / recentPayments.length;
  
  if (averageDaysLate > 30) {
    contract.contractStatus = 'at_risk';
    contract.riskLevel = 'high';
    contract.interventionNeeded = true;
  } else if (averageDaysLate > 10) {
    contract.contractStatus = 'current';
    contract.riskLevel = 'medium';
  } else {
    contract.contractStatus = 'current';
    contract.riskLevel = 'low';
  }
  
  return contract;
}

function calculateMatchConfidence(familyPayment, contract) {
  if (!contract) return 0;
  
  let confidence = 0.5; // Base confidence
  
  // Amount match
  if (familyPayment.paymentAmount === contract.monthlyTuition) confidence += 0.3;
  
  // Family ID match
  if (familyPayment.familyId === contract.familyId) confidence += 0.4;
  
  // Student count consistency
  if (familyPayment.studentNames.length === contract.studentCount) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

function generateAccountingMapping(familyPayment, contract) {
  return {
    debitAccount: 'Operating Checking',
    creditAccount: 'Tuition Revenue',
    amount: familyPayment.paymentAmount,
    reference: `${familyPayment.familyName} - ${familyPayment.paymentPeriod}`,
    class: familyPayment.esaFunded ? 'ESA Students' : 'Private Pay',
    memo: `${familyPayment.studentNames.join(', ')} tuition`,
    customFields: {
      contractId: contract?.contractId,
      paymentMethod: familyPayment.provider || 'Omella',
      studentCount: familyPayment.studentNames.length
    }
  };
}

function identifyReconciliationIssues(familyPayment, contract) {
  const issues = [];
  
  if (!contract) {
    issues.push({ type: 'no_contract_match', severity: 'high', message: 'No matching contract found' });
  }
  
  if (contract && familyPayment.paymentAmount !== contract.monthlyTuition) {
    issues.push({ 
      type: 'amount_mismatch', 
      severity: 'medium', 
      message: `Payment amount ($${familyPayment.paymentAmount}) doesn't match contract ($${contract.monthlyTuition})` 
    });
  }
  
  if (familyPayment.daysLate > 30) {
    issues.push({ 
      type: 'late_payment', 
      severity: 'high', 
      message: `Payment is ${familyPayment.daysLate} days late - retention risk` 
    });
  }
  
  return issues;
}

function calculateAverageDaysLate(contracts) {
  const allPayments = contracts.flatMap(c => c.paymentHistory);
  const latePayments = allPayments.filter(p => p.daysLate > 0);
  
  if (latePayments.length === 0) return 0;
  
  return Math.round(latePayments.reduce((sum, p) => sum + p.daysLate, 0) / latePayments.length);
}

function generateRiskAnalysis(contracts) {
  const highRisk = contracts.filter(c => c.riskLevel === 'high');
  const mediumRisk = contracts.filter(c => c.riskLevel === 'medium');
  
  return {
    highRiskFamilies: highRisk.length,
    mediumRiskFamilies: mediumRisk.length,
    lowRiskFamilies: contracts.filter(c => c.riskLevel === 'low').length,
    interventionsNeeded: contracts.filter(c => c.interventionNeeded).length,
    predictedAttrition: Math.round((highRisk.length * 0.7 + mediumRisk.length * 0.3) / contracts.length * 100),
    revenueAtRisk: highRisk.reduce((sum, c) => sum + c.monthlyTuition, 0)
  };
}

function generateAccountingEntries(tranche, mappings, accountingSystem) {
  const entries = [];
  
  // Main deposit entry
  entries.push({
    type: 'deposit',
    account: accountingSystem === 'quickbooks' ? 'Checking Account' : 'Bank Account',
    amount: tranche.totalAmount,
    date: tranche.trancheDate,
    description: `${tranche.provider} bulk payment - ${tranche.trancheDate}`,
    reference: tranche.id
  });
  
  // Individual revenue entries for each family
  mappings.forEach(mapping => {
    const familyPayment = tranche.familyPayments.find(fp => fp.familyId === mapping.familyId);
    if (familyPayment) {
      entries.push({
        type: 'revenue',
        account: 'Tuition Revenue',
        amount: familyPayment.paymentAmount,
        date: familyPayment.paymentPeriod,
        description: `Tuition - ${familyPayment.familyName}`,
        class: familyPayment.esaFunded ? 'ESA Students' : 'Private Pay',
        customer: familyPayment.familyName,
        memo: familyPayment.studentNames.join(', ')
      });
    }
  });
  
  return entries;
}

function updateContractPaymentStatus(contract, mapping) {
  // Update payment status based on successful reconciliation
  contract.contractStatus = 'current';
  contract.riskLevel = 'low';
  contract.interventionNeeded = false;
  
  // Add payment record
  contract.paymentHistory.unshift({
    date: new Date().toISOString(),
    amount: mapping.amount,
    status: 'paid',
    method: mapping.provider || 'Bulk Payment',
    daysLate: 0,
    reconciledFrom: mapping.trancheId
  });
  
  return contract;
}

module.exports = router;
