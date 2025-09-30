import React, { useState } from 'react';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const LeaseDataEntry = ({ onAnalyze }) => {
  const [leaseData, setLeaseData] = useState({
    // Basic Lease Information
    propertyAddress: '',
    squareFootage: '',
    leaseType: 'nnn', // nnn, gross, modified_gross
    
    // Financial Terms
    baseRent: '',
    camCharges: '',
    propertyTaxes: '',
    buildingInsurance: '',
    
    // Dates
    leaseStartDate: '',
    leaseEndDate: '',
    renewalOptionYears: '',
    noticeRequiredDays: 180, // Default 6 months
    
    // Escalation
    hasEscalation: true,
    escalationRate: '',
    escalationFrequency: 'annual',
    escalationCap: '',
    
    // Legal Terms
    hasPersonalGuarantee: false,
    personalGuaranteeAmount: '',
    earlyTerminationAllowed: false,
    earlyTerminationPenalty: '',
    securityDeposit: '',
    
    // Use Restrictions
    buildingType: 'educational',
    permittedUses: [],
    restrictedUses: [],
    hoursOfOperation: '',
    parkingSpaces: '',
    
    // Insurance Requirements (Critical!)
    insuranceRequirements: {
      generalLiability: { required: true, minimumCoverage: 2000000, aggregateLimit: 4000000, estimatedCost: '' },
      professionalLiability: { required: true, minimumCoverage: 1000000, estimatedCost: '' },
      propertyInsurance: { required: true, coverage: 'replacement_cost', estimatedCost: '' },
      workersComp: { required: true, stateRequired: true, estimatedCost: '' },
      umbrellaPolicy: { required: false, minimumCoverage: 5000000, estimatedCost: '' },
      cyberLiability: { required: false, minimumCoverage: 1000000, estimatedCost: '' },
      landlordAdditionalInsured: true,
      certificateDeliveryDays: 30
    },
    
    // Financial Estimates
    monthlyUtilities: '',
    monthlyMaintenance: '',
    annualRepairs: '',
    
    // School Context
    currentStudentCount: '',
    monthlyRevenue: '',
    esaAmount: ''
  });

  const [activeSection, setActiveSection] = useState('basic');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, subfield] = field.split('.');
      if (subfield) {
        setLeaseData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subfield]: value
            }
          }
        }));
      } else {
        setLeaseData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setLeaseData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const calculateTotalRent = () => {
    const base = parseFloat(leaseData.baseRent) || 0;
    const cam = parseFloat(leaseData.camCharges) || 0;
    const tax = parseFloat(leaseData.propertyTaxes) || 0;
    const insurance = parseFloat(leaseData.buildingInsurance) || 0;
    return base + cam + tax + insurance;
  };

  const calculateTotalInsurance = () => {
    const gl = parseFloat(leaseData.insuranceRequirements.generalLiability.estimatedCost) || 0;
    const pl = parseFloat(leaseData.insuranceRequirements.professionalLiability.estimatedCost) || 0;
    const prop = parseFloat(leaseData.insuranceRequirements.propertyInsurance.estimatedCost) || 0;
    const wc = parseFloat(leaseData.insuranceRequirements.workersComp.estimatedCost) || 0;
    const umbrella = parseFloat(leaseData.insuranceRequirements.umbrellaPolicy.estimatedCost) || 0;
    const cyber = parseFloat(leaseData.insuranceRequirements.cyberLiability.estimatedCost) || 0;
    return gl + pl + prop + wc + umbrella + cyber;
  };

  const calculateNegotiationDate = () => {
    if (!leaseData.leaseEndDate) return null;
    const endDate = new Date(leaseData.leaseEndDate);
    const noticeDays = parseInt(leaseData.noticeRequiredDays) || 180;
    const negotiationDate = new Date(endDate);
    negotiationDate.setDate(negotiationDate.getDate() - noticeDays);
    return negotiationDate.toISOString().split('T')[0];
  };

  const handleAnalyze = () => {
    const analysisData = {
      ...leaseData,
      totalMonthlyRent: calculateTotalRent(),
      totalAnnualInsurance: calculateTotalInsurance() * 12,
      totalMonthlyInsurance: calculateTotalInsurance(),
      negotiationStartDate: calculateNegotiationDate(),
      pricePerSqFt: leaseData.squareFootage ? (calculateTotalRent() / parseFloat(leaseData.squareFootage)).toFixed(2) : 0
    };
    
    onAnalyze(analysisData);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <PencilIcon className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enter Your Lease Information</h1>
            <p className="text-gray-600">Provide your lease details for comprehensive analysis and tracking</p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        {['basic', 'financial', 'dates', 'insurance', 'estimates'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`pb-2 px-4 font-medium text-sm ${
              activeSection === section
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Information */}
      {activeSection === 'basic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              Property Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Address</label>
                <input
                  type="text"
                  value={leaseData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123 Education Way, City, State ZIP"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
                <input
                  type="number"
                  value={leaseData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease Type</label>
                <select
                  value={leaseData.leaseType}
                  onChange={(e) => handleInputChange('leaseType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="nnn">Triple Net (NNN)</option>
                  <option value="gross">Gross Lease</option>
                  <option value="modified_gross">Modified Gross</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
                <select
                  value={leaseData.buildingType}
                  onChange={(e) => handleInputChange('buildingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="educational">Educational/Office</option>
                  <option value="retail">Retail Space</option>
                  <option value="church">Church/Religious</option>
                  <option value="community_center">Community Center</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
                <input
                  type="number"
                  value={leaseData.parkingSpaces}
                  onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Terms */}
      {activeSection === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Monthly Costs
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Rent (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.baseRent}
                    onChange={(e) => handleInputChange('baseRent', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="3500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CAM Charges (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.camCharges}
                    onChange={(e) => handleInputChange('camCharges', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Taxes (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.propertyTaxes}
                    onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Insurance (Monthly)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.buildingInsurance}
                    onChange={(e) => handleInputChange('buildingInsurance', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="9000"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={leaseData.hasPersonalGuarantee}
                    onChange={(e) => handleInputChange('hasPersonalGuarantee', e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Personal Guarantee Required</span>
                </label>
              </div>
            </div>
            
            {/* Total Calculation */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-orange-900">Total Monthly Rent:</span>
                <span className="text-2xl font-bold text-orange-600">${calculateTotalRent().toLocaleString()}</span>
              </div>
              {leaseData.squareFootage && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-orange-700">Price per Square Foot:</span>
                  <span className="font-medium text-orange-800">
                    ${(calculateTotalRent() / parseFloat(leaseData.squareFootage)).toFixed(2)}/sq ft
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Escalation Terms */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent Escalation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Escalation %</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={leaseData.escalationRate}
                    onChange={(e) => handleInputChange('escalationRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="5.0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Cap %</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={leaseData.escalationCap}
                    onChange={(e) => handleInputChange('escalationCap', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="3.0"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Leave blank if no cap</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={leaseData.escalationFrequency}
                  onChange={(e) => handleInputChange('escalationFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="annual">Annual</option>
                  <option value="biennial">Every 2 Years</option>
                  <option value="none">No Escalation</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Dates */}
      {activeSection === 'dates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Lease Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease Start Date</label>
                <input
                  type="date"
                  value={leaseData.leaseStartDate}
                  onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease End Date</label>
                <input
                  type="date"
                  value={leaseData.leaseEndDate}
                  onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Notice Required (Days)</label>
                <input
                  type="number"
                  value={leaseData.noticeRequiredDays}
                  onChange={(e) => handleInputChange('noticeRequiredDays', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="180"
                />
                <div className="text-xs text-gray-500 mt-1">Default: 180 days (6 months)</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Options</label>
                <input
                  type="text"
                  value={leaseData.renewalOptionYears}
                  onChange={(e) => handleInputChange('renewalOptionYears', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="One 3-year option"
                />
              </div>
            </div>
            
            {calculateNegotiationDate() && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">📅 Start Lease Negotiation</div>
                    <div className="text-sm text-blue-800">
                      {new Date(calculateNegotiationDate()).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add to Calendar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insurance Requirements */}
      {activeSection === 'insurance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Required Insurance Coverage
            </h3>
            
            <div className="space-y-4">
              {/* General Liability */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">General Liability Insurance</h4>
                    <div className="text-sm text-gray-600">Required by lease</div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Required</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Per Occurrence</label>
                    <input
                      type="text"
                      value={`$${leaseData.insuranceRequirements.generalLiability.minimumCoverage.toLocaleString()}`}
                      disabled
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Aggregate Limit</label>
                    <input
                      type="text"
                      value={`$${leaseData.insuranceRequirements.generalLiability.aggregateLimit.toLocaleString()}`}
                      disabled
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Your Monthly Cost</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={leaseData.insuranceRequirements.generalLiability.estimatedCost}
                        onChange={(e) => handleInputChange('insuranceRequirements.generalLiability.estimatedCost', e.target.value)}
                        className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Liability */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Professional Liability (E&O)</h4>
                    <div className="text-sm text-gray-600">Educational malpractice coverage</div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Required</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Coverage Amount</label>
                    <input
                      type="text"
                      value={`$${leaseData.insuranceRequirements.professionalLiability.minimumCoverage.toLocaleString()}`}
                      disabled
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Your Monthly Cost</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={leaseData.insuranceRequirements.professionalLiability.estimatedCost}
                        onChange={(e) => handleInputChange('insuranceRequirements.professionalLiability.estimatedCost', e.target.value)}
                        className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                        placeholder="200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Workers Comp */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Workers Compensation</h4>
                    <div className="text-sm text-gray-600">State-required coverage for all staff</div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Required</span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Your Monthly Cost (estimated)</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={leaseData.insuranceRequirements.workersComp.estimatedCost}
                      onChange={(e) => handleInputChange('insuranceRequirements.workersComp.estimatedCost', e.target.value)}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="350"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Typically 3-5% of annual payroll</div>
                </div>
              </div>

              {/* Property Insurance */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Property Insurance</h4>
                    <div className="text-sm text-gray-600">Equipment, supplies, contents</div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Required</span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Your Monthly Cost</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={leaseData.insuranceRequirements.propertyInsurance.estimatedCost}
                      onChange={(e) => handleInputChange('insuranceRequirements.propertyInsurance.estimatedCost', e.target.value)}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 text-sm"
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>

              {/* Optional but Recommended */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Cyber Liability (Recommended)</h4>
                    <div className="text-sm text-gray-600">Student data protection</div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Optional</span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Your Monthly Cost</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={leaseData.insuranceRequirements.cyberLiability.estimatedCost}
                      onChange={(e) => handleInputChange('insuranceRequirements.cyberLiability.estimatedCost', e.target.value)}
                      className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="125"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Insurance Cost */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-900">Total Monthly Insurance:</span>
                <span className="text-2xl font-bold text-red-600">${calculateTotalInsurance().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-red-700">Annual Insurance Cost:</span>
                <span className="font-medium text-red-800">${(calculateTotalInsurance() * 12).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Estimates */}
      {activeSection === 'estimates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Operating Estimates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Utilities (Electric, Water, Internet)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.monthlyUtilities}
                    onChange={(e) => handleInputChange('monthlyUtilities', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Maintenance & Janitorial</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.monthlyMaintenance}
                    onChange={(e) => handleInputChange('monthlyMaintenance', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Repairs Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.annualRepairs}
                    onChange={(e) => handleInputChange('annualRepairs', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="2400"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">HVAC, plumbing, unexpected repairs</div>
              </div>
            </div>
          </div>
          
          {/* School Context for Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your School Context</h3>
            <div className="text-sm text-gray-600 mb-4">This helps us calculate if your lease is sustainable</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Students</label>
                <input
                  type="number"
                  value={leaseData.currentStudentCount}
                  onChange={(e) => handleInputChange('currentStudentCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="28"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.monthlyRevenue}
                    onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="16324"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ESA/Voucher Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={leaseData.esaAmount}
                    onChange={(e) => handleInputChange('esaAmount', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="667"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center bg-white rounded-lg shadow p-6">
        <div>
          <div className="text-sm text-gray-600">Complete all sections for comprehensive analysis</div>
          <div className="text-xs text-gray-500 mt-1">
            Sections completed: {[
              leaseData.propertyAddress && leaseData.squareFootage,
              leaseData.baseRent && leaseData.camCharges,
              leaseData.leaseStartDate && leaseData.leaseEndDate,
              leaseData.insuranceRequirements.generalLiability.estimatedCost,
              leaseData.currentStudentCount && leaseData.monthlyRevenue
            ].filter(Boolean).length} / 5
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Save as Draft
          </button>
          <button
            onClick={handleAnalyze}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Analyze My Lease
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaseDataEntry;
