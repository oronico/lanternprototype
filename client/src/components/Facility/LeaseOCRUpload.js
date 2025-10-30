import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import toast from 'react-hot-toast';

/**
 * OCR Lease Upload Component
 * 
 * Uploads lease documents (PDF, images) and extracts key information:
 * - Monthly rent, CAM, taxes, insurance
 * - Lease dates and term
 * - Escalation clauses
 * - Insurance requirements
 * - Personal guarantee details
 * - Critical deadlines
 * 
 * In production, integrate with:
 * - Tesseract.js for client-side OCR
 * - AWS Textract or Google Vision API for cloud OCR
 * - OpenAI for intelligent extraction
 */
export default function LeaseOCRUpload({ onComplete }) {
  const emit = useEventEmit();
  const [step, setStep] = useState('upload'); // upload, processing, review, complete
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [editing, setEditing] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(uploadedFile.type)) {
      toast.error('Please upload a PDF or image file');
      return;
    }

    // Validate file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(uploadedFile);
    analytics.trackFeatureUsage('leaseOCRUpload', 'file_uploaded', {
      fileType: uploadedFile.type,
      fileSize: uploadedFile.size
    });

    // Process the file
    processDocument(uploadedFile);
  };

  const processDocument = async (file) => {
    setStep('processing');
    toast('Processing your lease document...');

    // Simulate OCR processing
    // In production, this would call:
    // - Tesseract.js for local OCR
    // - AWS Textract API
    // - Google Cloud Vision API
    // - Azure Form Recognizer
    // - OpenAI Vision API for intelligent extraction

    setTimeout(() => {
      // Simulated extracted data
      const extracted = {
        // Basic Lease Terms
        propertyAddress: '123 Education Way, Sunshine, FL 33xxx',
        squareFootage: 1600,
        leaseType: 'Triple Net (NNN)',
        
        // Financial Terms
        monthlyRent: 3500,
        camCharges: 300,
        propertyTaxes: 400,
        buildingInsurance: 300,
        totalMonthlyRent: 4500,
        pricePerSqFt: 28.13,
        securityDeposit: 9000,
        
        // Dates
        leaseStartDate: '2024-01-01',
        leaseEndDate: '2026-12-31',
        leaseTerm: '36 months',
        renewalNoticeRequired: 180, // days
        renewalOptions: 'One 3-year option',
        
        // Escalation
        hasEscalation: true,
        escalationRate: 5.0,
        escalationFrequency: 'Annual',
        escalationCap: null,
        compounding: true,
        
        // Legal Terms
        hasPersonalGuarantee: true,
        personalGuaranteeAmount: 162000,
        personalGuaranteeCap: null,
        earlyTerminationAllowed: false,
        earlyTerminationPenalty: null,
        
        // Use Restrictions
        permittedUses: 'Educational services, tutoring, childcare',
        restrictedUses: 'Retail, food service, manufacturing',
        hoursOfOperation: '6:00 AM - 8:00 PM Monday-Saturday',
        parkingSpaces: 25,
        exclusiveUse: false,
        
        // Maintenance Responsibilities
        whoMaintainsCertain: {
          roof: 'Landlord',
          hvac: 'Tenant',
          plumbing: 'Tenant',
          electrical: 'Tenant',
          structural: 'Landlord',
          landscaping: 'Tenant',
          parking: 'Landlord'
        },
        
        // Insurance Requirements (Critical!)
        insuranceRequirements: {
          generalLiability: {
            required: true,
            perOccurrence: 2000000,
            aggregate: 4000000,
            landlordMustBeInsured: true,
            primaryAndNonContributory: true
          },
          professionalLiability: {
            required: true,
            minimumCoverage: 1000000,
            specific: 'Educational professional liability'
          },
          propertyInsurance: {
            required: true,
            coverage: 'Full replacement cost',
            deductible: 5000
          },
          workersCompensation: {
            required: true,
            stateMinimum: true,
            allEmployees: true
          },
          umbrellaPolicy: {
            required: true,
            minimumCoverage: 5000000
          },
          cyberLiability: {
            required: false,
            recommended: true
          },
          certificateDeliveryDays: 30,
          cancellationNotice: 30,
          waiverOfSubrogation: true
        },
        
        // Additional Provisions
        subleaseAllowed: false,
        assignmentAllowed: false,
        alterationsRequireApproval: true,
        signageRights: 'Approved signage on building',
        accessRights: '24/7 tenant access',
        utilities: 'Tenant pays all utilities',
        
        // Critical Deadlines Found
        criticalDeadlines: [
          { type: 'Rent Escalation', date: '2025-01-01', description: 'First 5% rent increase', daysFromNow: 98 },
          { type: 'Insurance Renewal', date: '2024-12-31', description: 'All policies must be renewed', daysFromNow: 97 },
          { type: 'Renewal Notice', date: '2026-06-30', description: 'Must notify landlord 6 months before end', daysFromNow: 614 },
          { type: 'Property Tax Reconciliation', date: '2025-03-01', description: 'Annual tax reconciliation due', daysFromNow: 157 }
        ],
        
        // Risk Factors Identified
        riskFactors: [
          {
            severity: 'critical',
            factor: 'Personal Guarantee',
            description: 'You are personally liable for $162,000 (full lease term)',
            recommendation: 'Negotiate to remove or cap at 6 months rent maximum'
          },
          {
            severity: 'high',
            factor: 'Above Market Rate',
            description: 'Rent of $28.13/sq ft exceeds market average of $20-22/sq ft',
            recommendation: 'Request rent reduction to market rates'
          },
          {
            severity: 'high',
            factor: 'High Escalation Rate',
            description: '5% annual increases vs market standard 3%',
            recommendation: 'Negotiate cap at 3% or CPI, whichever is lower'
          },
          {
            severity: 'medium',
            factor: 'No Early Termination',
            description: 'Locked into full 3-year term',
            recommendation: 'Add early termination clause with 6-month notice'
          }
        ],
        
        // Financial Projections
        projectedCosts: [
          { year: 1, monthlyRent: 4500, annualCost: 54000 },
          { year: 2, monthlyRent: 4725, annualCost: 56700 },
          { year: 3, monthlyRent: 4961, annualCost: 59535 }
        ],
        totalLeaseCommitment: 170235
      };

      setExtractedData(extracted);
      setConfidence(92); // Simulated confidence score
      setStep('review');
      
      analytics.trackFeatureUsage('leaseOCRUpload', 'extraction_complete', {
        confidence: 92,
        fieldsExtracted: Object.keys(extracted).length
      });
      
      toast.success('Lease analyzed successfully!');
    }, 3000); // Simulate processing time
  };

  const handleConfirm = () => {
    analytics.trackFeatureUsage('leaseOCRUpload', 'confirmed', {
      confidence: confidence,
      edited: editing
    });

    // Emit event for other features to react
    emit('lease.uploaded', {
      data: extractedData,
      confidence: confidence,
      timestamp: new Date()
    });

    setStep('complete');
    
    if (onComplete) {
      onComplete(extractedData);
    }
  };

  const handleEdit = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
    setEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Step */}
      {step === 'upload' && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-16 w-16 text-primary-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Lease Document</h2>
            <p className="text-gray-600 mb-8">
              Upload a PDF or image of your lease. We'll extract all the important details automatically.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-primary-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="lease-upload"
              />
              <label htmlFor="lease-upload" className="cursor-pointer">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  PDF, JPG, PNG up to 10MB
                </div>
              </label>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-purple-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="h-5 w-5 text-blue-500" />
                <span>Review Before Saving</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <ArrowPathIcon className="mx-auto h-16 w-16 text-primary-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Lease</h2>
            <p className="text-gray-600 mb-8">
              Our AI is extracting all the important details from your lease document...
            </p>

            <div className="max-w-md mx-auto">
              <div className="space-y-3 text-left text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Reading document...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Extracting lease terms...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Identifying insurance requirements...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Calculating financial impact...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Assessing risk factors...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && extractedData && (
        <div className="space-y-6">
          {/* Confidence Banner */}
          <div className={`rounded-lg p-4 ${
            confidence >= 90 ? 'bg-green-50 border border-green-200' :
            confidence >= 75 ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SparklesIcon className={`h-6 w-6 ${
                  confidence >= 90 ? 'text-green-600' :
                  confidence >= 75 ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
                <div>
                  <div className="font-semibold text-gray-900">
                    Extraction Complete - {confidence}% Confidence
                  </div>
                  <div className="text-sm text-gray-600">
                    Review the extracted information below and make any corrections needed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Data Review */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Extracted Lease Information</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                Edit All
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Property Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <div className="font-medium">{extractedData.propertyAddress}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Square Footage:</span>
                    <div className="font-medium">{extractedData.squareFootage} sq ft</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Lease Type:</span>
                    <div className="font-medium">{extractedData.leaseType}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Price per Sq Ft:</span>
                    <div className="font-medium">${extractedData.pricePerSqFt}</div>
                  </div>
                </div>
              </div>

              {/* Financial Terms */}
              <div className="pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Monthly Costs</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Base Rent:</span>
                    <div className="font-medium">${extractedData.monthlyRent}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">CAM Charges:</span>
                    <div className="font-medium">${extractedData.camCharges}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Property Taxes:</span>
                    <div className="font-medium">${extractedData.propertyTaxes}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Building Insurance:</span>
                    <div className="font-medium">${extractedData.buildingInsurance}</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t">
                    <span className="text-gray-600">Total Monthly Rent:</span>
                    <div className="font-bold text-lg">${extractedData.totalMonthlyRent}</div>
                  </div>
                </div>
              </div>

              {/* Lease Dates */}
              <div className="pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Lease Term</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <div className="font-medium">{extractedData.leaseStartDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <div className="font-medium">{extractedData.leaseEndDate}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Term Length:</span>
                    <div className="font-medium">{extractedData.leaseTerm}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Renewal Options:</span>
                    <div className="font-medium">{extractedData.renewalOptions}</div>
                  </div>
                </div>
              </div>

              {/* Escalation */}
              <div className="pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Rent Escalation</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Escalation Rate:</span>
                    <div className="font-medium text-red-600">{extractedData.escalationRate}% {extractedData.escalationFrequency}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Escalation Cap:</span>
                    <div className="font-medium">{extractedData.escalationCap || 'None'}</div>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Identified Risk Factors</h4>
                <div className="space-y-3">
                  {extractedData.riskFactors.map((risk, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      risk.severity === 'critical' ? 'bg-red-50 border-red-200' :
                      risk.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <ExclamationCircleIcon className={`h-5 w-5 mt-0.5 ${
                          risk.severity === 'critical' ? 'text-red-600' :
                          risk.severity === 'high' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{risk.factor}</div>
                          <div className="text-sm text-gray-700 mt-1">{risk.description}</div>
                          <div className="text-xs text-gray-600 mt-2">
                            <strong>Recommendation:</strong> {risk.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Projection */}
              <div className="pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">3-Year Financial Projection</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Year</th>
                        <th className="text-left py-2">Monthly Rent</th>
                        <th className="text-left py-2">Annual Cost</th>
                        <th className="text-left py-2">Increase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.projectedCosts.map((proj, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2">Year {proj.year}</td>
                          <td className="py-2 font-medium">${proj.monthlyRent.toLocaleString()}</td>
                          <td className="py-2 font-medium">${proj.annualCost.toLocaleString()}</td>
                          <td className="py-2 text-red-600">
                            {idx > 0 ? `+$${(proj.annualCost - extractedData.projectedCosts[idx-1].annualCost).toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td className="py-2" colSpan="2">Total Lease Commitment:</td>
                        <td className="py-2 text-lg" colSpan="2">${extractedData.totalLeaseCommitment.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Confirm & Save Lease Information
            </button>
            <button
              onClick={() => setStep('upload')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Upload Different Document
            </button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lease Information Saved!</h2>
            <p className="text-gray-600 mb-8">
              Your lease has been analyzed and all information has been saved to your facility profile.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/facility'}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                View Facility Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/lease'}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Analyze Lease Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

