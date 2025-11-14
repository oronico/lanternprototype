import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ArrowUpIcon,
  SparklesIcon,
  AcademicCapIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { leaseAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LeaseAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaseText, setLeaseText] = useState('');
  const [dataEntryMode, setDataEntryMode] = useState(false);

  useEffect(() => {
    // Load demo analysis on component mount
    loadDemoAnalysis();
  }, []);

  const loadDemoAnalysis = async () => {
    try {
      const response = await leaseAPI.getAnalysis();
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load lease analysis');
    }
  };

  const analyzeLeaseDocument = async () => {
    if (!leaseText.trim()) {
      toast.error('Please provide lease content to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await leaseAPI.analyzeLease({
        leaseText,
        schoolInfo: {
          studentCount: 28,
          monthlyRevenue: 16324,
          esaAmount: 583
        }
      });
      setAnalysis(response.data.analysis);
      toast.success('Lease analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze lease');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Lease Analyzer</h1>
            <p className="text-gray-600">Comprehensive lease analysis with insurance requirements, deadlines, CAMs, and escalation tracking</p>
          </div>
        </div>
      </div>

      {/* Input Mode Selection */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">How do you want to enter your lease information?</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.href = '/lease/upload'}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
            >
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              Upload Lease (OCR)
            </button>
            <button
              onClick={() => setDataEntryMode(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                dataEntryMode
                  ? 'bg-orange-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PencilIcon className="h-4 w-4 inline mr-2" />
              Enter Manually
            </button>
            <button
              onClick={() => setDataEntryMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                !dataEntryMode
                  ? 'bg-orange-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SparklesIcon className="h-4 w-4 inline mr-2" />
              AI Analyze Text
            </button>
          </div>
        </div>
        
        {!dataEntryMode && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Lease Agreement
              </label>
              <textarea
                value={leaseText}
                onChange={(e) => setLeaseText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Paste your lease agreement text here for AI analysis of terms, deadlines, insurance requirements, CAMs, escalations, and more..."
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={analyzeLeaseDocument}
                disabled={!leaseText.trim() || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <SparklesIcon className="animate-spin -ml-1 mr-3 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="-ml-1 mr-3 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </button>
              
              <button
                onClick={loadDemoAnalysis}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                View Demo Analysis
              </button>
            </div>
          </div>
        )}
        
        {dataEntryMode && (
          <div className="text-center py-8">
            <PencilIcon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Manual Data Entry Mode</h4>
            <p className="text-sm text-gray-600 mb-4">
              Enter your lease terms, insurance requirements, and estimates for detailed analysis
            </p>
            <button 
              onClick={() => window.location.href = '/lease-entry'}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Start Entering Lease Details
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lease Overview
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insurance'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Insurance Requirements
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deadlines'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Critical Deadlines
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'financials'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Financial Impact
          </button>
        </nav>
      </div>

      {/* Lease Overview Tab */}
      {activeTab === 'overview' && analysis && (
        <div className="space-y-6">
          {/* Risk Score Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overall Lease Risk Assessment</h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-red-600">85</div>
                <div className="text-sm text-gray-600">
                  <div>/100</div>
                  <div className="text-red-600 font-medium">High Risk</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-red-700">Critical Issues</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-orange-700">High Risk Factors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-yellow-700">Medium Risk Items</div>
              </div>
            </div>
          </div>

          {/* Key Lease Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Basic Lease Terms
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Rent:</span>
                  <span className="font-medium">$3,500/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CAM Charges:</span>
                  <span className="font-medium">$300/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Taxes:</span>
                  <span className="font-medium">$400/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-medium">$300/month</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Total Monthly:</span>
                  <span className="font-bold text-gray-900">$4,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Sq Ft:</span>
                  <span className="font-medium text-red-600">$28.13 (Above Market)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Financial Impact
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">% of Revenue:</span>
                  <span className="font-medium text-red-600">28% (Target: ≤20%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per Student:</span>
                  <span className="font-medium">$161/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Commitment:</span>
                  <span className="font-medium">$54,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3-Year Total:</span>
                  <span className="font-medium text-red-600">$170,235</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personal Guarantee:</span>
                  <span className="font-medium text-red-600">$162,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">⚠️ Key Risk Factors</h4>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                <div className="font-medium text-red-900">Personal Guarantee - Critical Risk</div>
                <div className="text-sm text-red-800">You're personally liable for $162,000. Your home and personal assets are at risk if the school fails.</div>
                <div className="text-sm text-red-700 mt-1">
                  <strong>Recommendation:</strong> Negotiate removal or cap at 6 months rent maximum
                </div>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r-lg">
                <div className="font-medium text-orange-900">Above Market Rate - High Risk</div>
                <div className="text-sm text-orange-800">Paying $28.13/sq ft vs market average $20-22/sq ft = $800-1,000/month overpayment.</div>
                <div className="text-sm text-orange-700 mt-1">
                  <strong>Recommendation:</strong> Request rent reduction to $3,200-3,500 based on market data
                </div>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                <div className="font-medium text-yellow-900">High Escalation Rate - Medium Risk</div>
                <div className="text-sm text-yellow-800">5% annual increases vs market standard 3% adds $5,535 over lease term.</div>
                <div className="text-sm text-yellow-700 mt-1">
                  <strong>Recommendation:</strong> Negotiate cap at 3% or CPI, whichever is lower
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Requirements Tab */}
      {activeTab === 'insurance' && (
        <div className="space-y-6">
          {/* Insurance Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                Insurance Requirements Analysis
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">$1,467</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">9%</div>
                <div className="text-sm text-red-700">of Revenue</div>
                <div className="text-xs text-gray-500">Target: 3-5%</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">8</div>
                <div className="text-sm text-blue-700">Policy Types</div>
                <div className="text-xs text-gray-500">Required & recommended</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">$52</div>
                <div className="text-sm text-green-700">per Student</div>
                <div className="text-xs text-gray-500">Monthly insurance cost</div>
              </div>
            </div>
          </div>

          {/* Required Insurance Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Policies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-red-600">🚨 Required by Lease</h4>
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">General Liability</div>
                    <div className="text-sm font-bold text-red-600">$300/month</div>
                  </div>
                  <div className="text-sm text-gray-600">$2M per occurrence, $4M aggregate</div>
                  <div className="text-xs text-red-600 mt-1">Landlord must be additional insured</div>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Professional Liability</div>
                    <div className="text-sm font-bold text-red-600">$200/month</div>
                  </div>
                  <div className="text-sm text-gray-600">$1M educational malpractice</div>
                  <div className="text-xs text-red-600 mt-1">Must cover tutoring/educational services</div>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Property Insurance</div>
                    <div className="text-sm font-bold text-red-600">$150/month</div>
                  </div>
                  <div className="text-sm text-gray-600">Full replacement cost</div>
                  <div className="text-xs text-red-600 mt-1">Covers equipment & supplies</div>
                </div>
                
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Workers Compensation</div>
                    <div className="text-sm font-bold text-red-600">$350/month</div>
                  </div>
                  <div className="text-sm text-gray-600">State-required coverage</div>
                  <div className="text-xs text-red-600 mt-1">All employees including part-time</div>
                </div>
              </div>
            </div>

            {/* Recommended Policies */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold text-gray-900 mb-4 text-blue-600">💡 Recommended Coverage</h4>
              <div className="space-y-4">
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Cyber Liability</div>
                    <div className="text-sm font-bold text-blue-600">$125/month</div>
                  </div>
                  <div className="text-sm text-gray-600">$1M data breach protection</div>
                  <div className="text-xs text-blue-600 mt-1">Student data & privacy protection</div>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Business Interruption</div>
                    <div className="text-sm font-bold text-blue-600">$175/month</div>
                  </div>
                  <div className="text-sm text-gray-600">12 months operating expenses</div>
                  <div className="text-xs text-blue-600 mt-1">COVID/closure protection</div>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Directors & Officers</div>
                    <div className="text-sm font-bold text-blue-600">$67/month</div>
                  </div>
                  <div className="text-sm text-gray-600">$1M board protection</div>
                  <div className="text-xs text-blue-600 mt-1">Nonprofit board member coverage</div>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">Umbrella Policy</div>
                    <div className="text-sm font-bold text-blue-600">$100/month</div>
                  </div>
                  <div className="text-sm text-gray-600">$5M additional protection</div>
                  <div className="text-xs text-blue-600 mt-1">Covers above primary limits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Impact Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">📊 Insurance Cost Impact</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">$52</div>
                <div className="text-sm text-gray-600">Per Student/Month</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">$17,600</div>
                <div className="text-sm text-gray-600">Annual Premium</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">9.0%</div>
                <div className="text-sm text-gray-600">% of Revenue</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">$89</div>
                <div className="text-sm text-gray-600">Tuition Impact</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Deadlines Tab */}
      {activeTab === 'deadlines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Critical Lease Deadlines
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Insurance Renewal</div>
                    <div className="text-sm text-red-700">December 31, 2024</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">97 days</div>
                  <div className="text-xs text-red-500">Action needed soon</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ArrowUpIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">First Rent Escalation</div>
                    <div className="text-sm text-orange-700">January 1, 2025 (+5%)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-600">98 days</div>
                  <div className="text-xs text-orange-500">Rent increases to $3,675</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-900">Property Tax Assessment</div>
                    <div className="text-sm text-yellow-700">March 1, 2025</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-yellow-600">157 days</div>
                  <div className="text-xs text-yellow-500">May impact CAM charges</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Renewal Notice Required</div>
                    <div className="text-sm text-blue-700">June 30, 2026</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">614 days</div>
                  <div className="text-xs text-blue-500">6 months before lease end</div>
                </div>
              </div>
            </div>
          </div>

          {/* Escalation Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">📈 Rent Escalation Schedule</h4>
            <div className="table-scroll">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Year</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Base Rent</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Total Monthly</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Annual Cost</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Increase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-4 text-sm">Year 1 (2024)</td>
                    <td className="py-2 px-4 text-sm font-medium">$3,500</td>
                    <td className="py-2 px-4 text-sm font-medium">$4,500</td>
                    <td className="py-2 px-4 text-sm">$54,000</td>
                    <td className="py-2 px-4 text-sm text-gray-500">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">Year 2 (2025)</td>
                    <td className="py-2 px-4 text-sm font-medium">$3,675</td>
                    <td className="py-2 px-4 text-sm font-medium">$4,725</td>
                    <td className="py-2 px-4 text-sm">$56,700</td>
                    <td className="py-2 px-4 text-sm text-orange-600">+$2,700</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">Year 3 (2026)</td>
                    <td className="py-2 px-4 text-sm font-medium">$3,859</td>
                    <td className="py-2 px-4 text-sm font-medium">$4,961</td>
                    <td className="py-2 px-4 text-sm">$59,535</td>
                    <td className="py-2 px-4 text-sm text-red-600">+$5,535</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-medium text-red-900 mb-1">⚠️ Escalation Impact</div>
              <div className="text-sm text-red-800">
                Total lease commitment: <strong>$170,235</strong> over 3 years. 
                5% annual escalations are 2% above market standard - negotiate down to 3% maximum.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Impact Tab */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Total Cost Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Total Facility Cost Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Monthly Facility Costs</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Rent:</span>
                    <span className="font-medium">$3,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CAM Charges:</span>
                    <span className="font-medium">$300</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Property Taxes:</span>
                    <span className="font-medium">$400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Building Insurance:</span>
                    <span className="font-medium">$300</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Lease Total:</span>
                    <span className="font-bold">$4,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Insurance:</span>
                    <span className="font-medium text-red-600">$1,467</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold text-lg">Total Facility Cost:</span>
                    <span className="font-bold text-lg text-red-600">$5,967</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Tuition Requirements</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Facility Cost per Student:</span>
                    <span className="font-medium">$213/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>% of Current Revenue:</span>
                    <span className="font-medium text-red-600">37%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target % (Healthy):</span>
                    <span className="font-medium text-green-600">≤20%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Required Tuition Increase:</span>
                    <span className="font-bold text-red-600">+$167</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To Achieve 20% Target:</span>
                    <span className="font-bold">$750 tuition</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Or Reduce Rent to:</span>
                    <span className="font-bold text-green-600">$3,265</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ESA Compatibility */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              ESA/Voucher Compatibility Analysis
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">$583</div>
                <div className="text-sm text-blue-700">ESA Amount</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">$750</div>
                <div className="text-sm text-red-700">Required Tuition</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">$167</div>
                <div className="text-sm text-yellow-700">Family Contribution</div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900 mb-2">💡 ESA Strategy Recommendation</div>
              <div className="text-sm text-blue-800">
                Position tuition as <strong>"ESA + $167 family investment"</strong> rather than $750 out-of-pocket. 
                This makes microschool education accessible to ESA families while covering your actual costs including insurance.
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold text-gray-900 mb-4">🎯 Immediate Action Items</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-900">Negotiate Personal Guarantee Removal</div>
                  <div className="text-sm text-red-700">$162,000 personal liability exposure - negotiate cap or removal</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <CurrencyDollarIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-900">Request Rent Reduction</div>
                  <div className="text-sm text-orange-700">Market rate is $20-22/sq ft - you're paying $28.13/sq ft</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <ShieldCheckIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">Review Insurance Requirements</div>
                  <div className="text-sm text-yellow-700">Verify educational professional liability coverage and shop for better rates</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Plan for Insurance Renewal</div>
                  <div className="text-sm text-blue-700">97 days until renewal - start shopping now for better rates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseAnalyzer;
