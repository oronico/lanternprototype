const express = require('express');
const router = express.Router();

// Document Management & E-Signature System
const documentLibrary = {
  contracts: [
    {
      id: 'contract_001',
      familyId: 'family_johnson',
      documentType: 'tuition_agreement',
      title: 'Johnson Family - Tuition Agreement 2024-25',
      status: 'signed',
      createdDate: '2024-08-15',
      sentDate: '2024-08-16', 
      signedDate: '2024-08-18',
      version: '1.0',
      tuitionAmount: 1166,
      paymentSchedule: 'monthly',
      signers: [
        { name: 'Michael Johnson', email: 'mjohnson@email.com', status: 'signed', signedDate: '2024-08-18' },
        { name: 'Sarah Johnson', email: 'sjohnson@email.com', status: 'signed', signedDate: '2024-08-18' }
      ],
      linkedPayments: {
        setupDate: '2024-08-20',
        paymentMethod: 'ClassWallet ESA',
        status: 'active',
        lastPayment: '2024-11-01'
      }
    },
    {
      id: 'contract_002', 
      familyId: 'family_martinez',
      documentType: 'enrollment_agreement',
      title: 'Martinez Family - Enrollment Agreement',
      status: 'pending_signature',
      createdDate: '2024-11-10',
      sentDate: '2024-11-10',
      remindersSent: 1,
      version: '1.0',
      tuitionAmount: 583,
      paymentSchedule: 'monthly',
      signers: [
        { name: 'Carlos Martinez', email: 'carlos.martinez@email.com', status: 'pending', sentDate: '2024-11-10' },
        { name: 'Maria Martinez', email: 'maria.martinez@email.com', status: 'pending', sentDate: '2024-11-10' }
      ]
    },
    {
      id: 'contract_003',
      familyId: 'family_chen',
      documentType: 'tuition_contract',
      title: 'Chen Family - Tuition Contract & Payment Terms',
      status: 'ready_to_send',
      createdDate: '2024-11-12',
      tuitionAmount: 583,
      paymentSchedule: 'monthly',
      esaEligible: true,
      familyContribution: 0, // Fully covered by ESA
      signers: [
        { name: 'David Chen', email: 'dchen@email.com', status: 'not_sent' },
        { name: 'Lisa Chen', email: 'lchen@email.com', status: 'not_sent' }
      ]
    }
  ],
  
  templates: {
    tuition_agreement: {
      name: 'Tuition Agreement',
      description: 'Standard tuition and payment terms contract',
      category: 'contracts',
      requiredFields: ['tuitionAmount', 'paymentSchedule', 'startDate', 'endDate', 'withdrawalPolicy'],
      customizable: true,
      eSignatureEnabled: true
    },
    enrollment_agreement: {
      name: 'Enrollment Agreement', 
      description: 'Complete enrollment contract with policies',
      category: 'contracts',
      requiredFields: ['studentInfo', 'tuitionAmount', 'academicYear', 'emergencyContacts', 'medicalInfo'],
      customizable: true,
      eSignatureEnabled: true
    },
    payment_plan_agreement: {
      name: 'Payment Plan Agreement',
      description: 'Custom payment plan for struggling families',
      category: 'contracts',
      requiredFields: ['totalAmount', 'paymentSchedule', 'lateFeesPolicy', 'defaultConsequences'],
      customizable: true,
      eSignatureEnabled: true
    }
  }
};

// GET /api/documents/contracts
router.get('/contracts', (req, res) => {
  try {
    const { status, familyId, documentType } = req.query;
    
    let filteredContracts = documentLibrary.contracts;
    
    if (status) {
      filteredContracts = filteredContracts.filter(contract => contract.status === status);
    }
    
    if (familyId) {
      filteredContracts = filteredContracts.filter(contract => contract.familyId === familyId);
    }
    
    if (documentType) {
      filteredContracts = filteredContracts.filter(contract => contract.documentType === documentType);
    }
    
    // Add summary statistics
    const summary = {
      total: documentLibrary.contracts.length,
      signed: documentLibrary.contracts.filter(c => c.status === 'signed').length,
      pending: documentLibrary.contracts.filter(c => c.status === 'pending_signature').length,
      ready: documentLibrary.contracts.filter(c => c.status === 'ready_to_send').length,
      totalTuitionValue: documentLibrary.contracts
        .filter(c => c.status === 'signed')
        .reduce((sum, c) => sum + c.tuitionAmount, 0)
    };
    
    res.json({
      contracts: filteredContracts,
      summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// POST /api/documents/generate-contract
router.post('/generate-contract', (req, res) => {
  try {
    const {
      familyId,
      documentType,
      familyInfo,
      tuitionInfo,
      customTerms,
      esaDetails
    } = req.body;
    
    // Generate contract using AI + family-specific data
    const generatedContract = {
      id: `contract_${Date.now()}`,
      familyId,
      documentType,
      title: `${familyInfo.familyName} - ${documentLibrary.templates[documentType].name}`,
      status: 'draft',
      createdDate: new Date().toISOString(),
      version: '1.0',
      content: generateContractContent(documentType, familyInfo, tuitionInfo, customTerms, esaDetails),
      tuitionAmount: tuitionInfo.monthlyAmount,
      paymentSchedule: tuitionInfo.schedule,
      esaEligible: esaDetails?.eligible || false,
      familyContribution: esaDetails?.familyContribution || tuitionInfo.monthlyAmount,
      signers: familyInfo.signers.map(signer => ({
        ...signer,
        status: 'not_sent'
      })),
      metadata: {
        generatedBy: 'AI Assistant',
        customizations: Object.keys(customTerms || {}).length,
        esaOptimized: esaDetails?.eligible || false
      }
    };
    
    res.json({
      success: true,
      contract: generatedContract,
      nextSteps: [
        'Review contract for accuracy',
        'Customize any specific terms',
        'Send for electronic signature',
        'Track signing progress'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate contract' });
  }
});

// POST /api/documents/send-for-signature
router.post('/send-for-signature', (req, res) => {
  try {
    const { contractId, signers, message, dueDate } = req.body;
    
    // Mock e-signature service integration (DocuSign, HelloSign, etc.)
    const signatureRequest = {
      contractId,
      status: 'sent',
      sentDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      signers: signers.map(signer => ({
        ...signer,
        status: 'pending',
        sentDate: new Date().toISOString(),
        signatureUrl: `https://demo-signature.com/sign/${contractId}/${signer.email}`,
        reminderSchedule: ['3 days', '1 day', 'day of due date']
      })),
      trackingEnabled: true,
      reminderSettings: {
        enabled: true,
        frequency: 'every_3_days',
        customMessage: message
      }
    };
    
    res.json({
      success: true,
      signatureRequest,
      trackingUrl: `https://platform.com/contracts/${contractId}/tracking`,
      estimatedCompletionTime: '2-5 business days',
      integrationUsed: 'DocuSign'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send for signature' });
  }
});

// GET /api/documents/signature-status/:contractId
router.get('/signature-status/:contractId', (req, res) => {
  try {
    const { contractId } = req.params;
    
    // Mock signature tracking
    const contract = documentLibrary.contracts.find(c => c.id === contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    const signatureStatus = {
      contractId,
      overallStatus: contract.status,
      progress: {
        totalSigners: contract.signers.length,
        signed: contract.signers.filter(s => s.status === 'signed').length,
        pending: contract.signers.filter(s => s.status === 'pending').length,
        percentComplete: Math.round((contract.signers.filter(s => s.status === 'signed').length / contract.signers.length) * 100)
      },
      signers: contract.signers,
      timeline: [
        { date: contract.createdDate, event: 'Contract generated', status: 'completed' },
        { date: contract.sentDate, event: 'Sent for signature', status: contract.sentDate ? 'completed' : 'pending' },
        { date: contract.signedDate, event: 'Fully executed', status: contract.signedDate ? 'completed' : 'pending' }
      ],
      nextActions: getNextActions(contract),
      integrationStatus: {
        paymentSetup: contract.linkedPayments ? 'completed' : 'pending',
        studentRecords: contract.status === 'signed' ? 'synced' : 'pending',
        financialSystem: contract.status === 'signed' ? 'active' : 'pending'
      }
    };
    
    res.json(signatureStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signature status' });
  }
});

// POST /api/documents/payment-integration
router.post('/payment-integration', (req, res) => {
  try {
    const { contractId, paymentDetails } = req.body;
    
    // Link signed contract to payment processing
    const integration = {
      contractId,
      paymentMethod: paymentDetails.method,
      amount: paymentDetails.amount,
      schedule: paymentDetails.schedule,
      startDate: paymentDetails.startDate,
      integrationStatus: 'active',
      autoPayEnabled: paymentDetails.autoPayEnabled || false,
      linkedSystems: {
        stripe: paymentDetails.method === 'credit_card',
        omella: paymentDetails.method === 'omella',
        classwallet: paymentDetails.method === 'esa'
      },
      setupDate: new Date().toISOString()
    };
    
    res.json({
      success: true,
      integration,
      message: 'Payment processing linked to signed contract',
      nextPaymentDate: paymentDetails.startDate,
      automationEnabled: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to integrate payment processing' });
  }
});

function generateContractContent(documentType, familyInfo, tuitionInfo, customTerms, esaDetails) {
  // AI-generated contract content based on type and parameters
  let baseContent = '';
  
  switch (documentType) {
    case 'tuition_agreement':
      baseContent = `TUITION AGREEMENT
${familyInfo.familyName}

This agreement establishes the tuition and payment terms for the ${tuitionInfo.academicYear} academic year.

TUITION STRUCTURE:
Monthly Tuition: $${tuitionInfo.monthlyAmount}
${esaDetails?.eligible ? `ESA Coverage: $${esaDetails.esaAmount}` : ''}
${esaDetails?.familyContribution > 0 ? `Family Contribution: $${esaDetails.familyContribution}` : ''}

PAYMENT TERMS:
Payment Schedule: ${tuitionInfo.schedule}
Due Date: ${tuitionInfo.dueDate} of each month
Late Fee: $${tuitionInfo.lateFee || 25} after ${tuitionInfo.gracePeriod || 5} days
Payment Methods: ${tuitionInfo.acceptedMethods.join(', ')}

ACADEMIC YEAR:
Start Date: ${tuitionInfo.startDate}
End Date: ${tuitionInfo.endDate}
Withdrawal Policy: ${tuitionInfo.withdrawalPolicy}

${customTerms ? 'CUSTOM TERMS:\n' + customTerms : ''}

By signing below, both parties agree to these terms and conditions.`;
      break;
      
    case 'enrollment_agreement':
      baseContent = `ENROLLMENT AGREEMENT
${familyInfo.familyName}

This comprehensive enrollment agreement covers academic, financial, and operational terms.

STUDENT INFORMATION:
${familyInfo.students.map(student => `${student.name} (Grade ${student.grade})`).join('\n')}

EDUCATIONAL PROGRAM:
Academic Year: ${tuitionInfo.academicYear}
Program Type: ${familyInfo.programType || 'Full-time Microschool'}
Special Needs: ${familyInfo.specialNeeds || 'None specified'}

FINANCIAL TERMS:
Total Monthly Tuition: $${tuitionInfo.monthlyAmount}
${esaDetails?.eligible ? `ESA/Voucher Applied: $${esaDetails.esaAmount}` : ''}
Registration Fee: $${tuitionInfo.registrationFee || 150}

POLICIES & PROCEDURES:
- Family Handbook acknowledgment required
- Emergency contact information required
- Medical information and consent forms
- Photo/video release permissions

WITHDRAWAL POLICY:
${tuitionInfo.withdrawalPolicy || '30-day written notice required'}

This agreement becomes effective upon signature by all parties.`;
      break;
  }
  
  return baseContent;
}

function getNextActions(contract) {
  switch (contract.status) {
    case 'draft':
      return ['Review contract content', 'Send for signature'];
    case 'ready_to_send':
      return ['Send to family for signature', 'Set up payment tracking'];
    case 'pending_signature':
      return ['Send reminder to unsigned parties', 'Follow up via phone'];
    case 'signed':
      return ['Set up payment processing', 'Add to student information system'];
    default:
      return [];
  }
}

module.exports = router;
