import React, { useState } from 'react';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  SparklesIcon,
  DocumentCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BankReadyReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const reportTemplates = [
    {
      id: 'sba-loan-package',
      name: 'SBA Loan Application Package',
      description: 'Complete financial package for SBA 7(a) and 504 loans',
      icon: BuildingLibraryIcon,
      color: 'blue',
      includes: [
        'P&L Statement (last 3 years)',
        'Balance Sheet (current)',
        'Cash Flow Statement (last 3 years)',
        'Personal Financial Statement',
        'Business Debt Schedule',
        'Accounts Receivable Aging',
        'Account Payable Aging',
        'Cover Page with Business Summary'
      ],
      loanRange: '$50K - $5M',
      turnaround: 'Instant download'
    },
    {
      id: 'bank-line-of-credit',
      name: 'Line of Credit Application',
      description: 'Financial package for business line of credit',
      icon: DocumentCheckIcon,
      color: 'green',
      includes: [
        'P&L Statement (last 2 years + YTD)',
        'Balance Sheet (current)',
        'Cash Flow Forecast (12 months)',
        'Business Overview',
        'Use of Funds Statement',
        'AR/AP Summary'
      ],
      loanRange: '$10K - $250K',
      turnaround: 'Instant download'
    },
    {
      id: 'grant-application',
      name: 'Foundation Grant Package',
      description: 'Financial statements for foundation grants',
      icon: SparklesIcon,
      color: 'purple',
      includes: [
        'Statement of Activities (P&L)',
        'Statement of Financial Position (Balance Sheet)',
        'Statement of Cash Flows',
        'Program Budget vs. Actual',
        'Funding Sources Breakdown',
        'Narrative Financial Summary'
      ],
      loanRange: 'N/A',
      turnaround: 'Instant download'
    },
    {
      id: 'investor-package',
      name: 'Investor Due Diligence',
      description: 'Comprehensive financials for equity investors',
      icon: ChartBarIcon,
      color: 'indigo',
      includes: [
        'Historical Financials (3 years)',
        'Monthly P&L Trends',
        'Unit Economics Analysis',
        'Customer Acquisition Cost',
        'Lifetime Value Analysis',
        'Burn Rate & Runway',
        '3-Year Financial Projections',
        'Cap Table Overview'
      ],
      loanRange: '$100K+',
      turnaround: 'Instant download'
    },
    {
      id: 'board-package',
      name: 'Monthly Board Package',
      description: 'Executive summary for board meetings',
      icon: DocumentTextIcon,
      color: 'amber',
      includes: [
        'Executive Dashboard',
        'P&L vs. Budget',
        'Balance Sheet',
        'Cash Flow Forecast',
        'Key Metrics & KPIs',
        'Enrollment Trends',
        'Action Items & Risks'
      ],
      loanRange: 'N/A',
      turnaround: 'Instant download'
    }
  ];

  const generateReport = async (templateId) => {
    setSelectedTemplate(templateId);
    
    // Simulate report generation
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating bank-ready report...',
        success: () => {
          setSelectedTemplate(null);
          return 'Report ready! Downloading now...';
        },
        error: 'Failed to generate report'
      }
    );
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-primary-100 to-primary-200',
        border: 'border-primary-300',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'from-success-100 to-success-200',
        border: 'border-success-300',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'from-primary-100 to-primary-200',
        border: 'border-primary-300',
        icon: 'text-primary-600',
        button: 'bg-primary-600 hover:bg-primary-700'
      },
      indigo: {
        bg: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-200',
        icon: 'text-primary-600',
        button: 'bg-primary-600 hover:bg-primary-700'
      },
      amber: {
        bg: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        button: 'bg-amber-600 hover:bg-amber-700'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank-Ready Financial Reports</h1>
        <p className="text-lg text-gray-600">
          Professional financial packages ready to submit to banks, lenders, and investors
        </p>
      </div>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircleIcon className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Trusted by Banks & Lenders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">GAAP</div>
            <div className="text-sm opacity-90">Compliant accounting standards</div>
          </div>
          <div>
            <div className="text-3xl font-bold">CPA</div>
            <div className="text-sm opacity-90">Reviewed format & structure</div>
          </div>
          <div>
            <div className="text-3xl font-bold">SBA</div>
            <div className="text-sm opacity-90">Approved for government loans</div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Reporting Period</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'current-year', label: 'Current Year (YTD)' },
            { id: 'last-year', label: 'Last Fiscal Year' },
            { id: 'last-3-years', label: 'Last 3 Years' },
            { id: 'trailing-12', label: 'Trailing 12 Months' },
            { id: 'custom', label: 'Custom Date Range' }
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === period.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          const colors = getColorClasses(template.color);
          const isGenerating = selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              className={`bg-gradient-to-br ${colors.bg} rounded-xl border-2 ${colors.border} p-6 hover:shadow-lg transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-lg shadow-md">
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Loan Range</div>
                  <div className="font-semibold text-gray-900">{template.loanRange}</div>
                </div>
                <div>
                  <div className="text-gray-600">Turnaround</div>
                  <div className="font-semibold text-gray-900">{template.turnaround}</div>
                </div>
              </div>

              {/* Includes */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">Package Includes:</div>
                <ul className="space-y-1">
                  {template.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                onClick={() => generateReport(template.id)}
                disabled={isGenerating}
                className={`w-full py-3 px-4 ${colors.button} text-white rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Generate & Download</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Why Banks Trust Our Reports */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Why Banks & Lenders Trust Our Reports
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">GAAP Compliant</h4>
            <p className="text-sm text-gray-600">
              All reports follow Generally Accepted Accounting Principles, the standard required by banks and SBA.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Double-Entry Bookkeeping</h4>
            <p className="text-sm text-gray-600">
              Proper debits and credits, balance sheet reconciliation, and audit-ready ledgers.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BuildingLibraryIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Bank-Approved Format</h4>
            <p className="text-sm text-gray-600">
              Formatted exactly how banks expect to see financial statements, including all required disclosures.
            </p>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-8 border-2 border-primary-300">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Recent Success Stories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-bold text-gray-900">$250K SBA Loan</div>
                <div className="text-sm text-gray-600">Approved in 3 weeks</div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "Used the SBA Loan Package. Bank said our financials were the most organized they've seen from a small school."
            </p>
            <div className="text-xs text-gray-500 mt-2">- Brooklyn Learning Academy</div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-3xl">✅</div>
              <div>
                <div className="font-bold text-gray-900">$100K Grant Awarded</div>
                <div className="text-sm text-gray-600">Foundation grant</div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "The grant package had everything we needed. No back-and-forth, just instant submission."
            </p>
            <div className="text-xs text-gray-500 mt-2">- Sunshine Microschool</div>
          </div>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Need Something Custom?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Our Enterprise plan includes custom report building. Tell us what format your bank or investor needs, 
          and we'll create it for you.
        </p>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800">
          Contact Us for Custom Reports
        </button>
      </div>
    </div>
  );
};

export default BankReadyReports;

