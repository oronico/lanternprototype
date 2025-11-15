import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  BanknotesIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

/**
 * Reports Hub
 * 
 * Consolidated reporting with Hank's CPA-grade review:
 * - Monthly Financial Reports
 * - Quarterly Board Reports
 * - Year-End Financials
 * - Tax Filings
 * - Hank's Pre-Close Audit
 */

export default function ReportsHub() {
  const [activeTab, setActiveTab] = useState('monthly'); // monthly, quarterly, yearend, tax

  // Mock data for Hank's review
  const hankReview = {
    monthlyReview: {
      status: 'ready', // ready, needs_work, critical
      revenueComplete: true,
      expensesCategorized: 95,
      receiptsAttached: 88,
      reconciled: true,
      restrictedUnrestrictedSplit: true,
      issues: [
        { severity: 'warning', item: '2 expenses missing receipts', fix: 'Attach receipts in Bookkeeping tab' }
      ]
    },
    quarterlyReview: {
      status: 'ready',
      boardPackageReady: true,
      financialStatementsAccurate: true,
      metricsCalculated: true
    },
    yearEndReview: {
      status: 'needs_work',
      form990Ready: false,
      auditTrailComplete: 90,
      depreciationSchedule: false
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Financial Reports</h1>
            <p className="text-gray-600">Professional reporting with Hank's AI-powered book review</p>
          </div>
        </div>
      </div>

      {/* Hank's Pre-Close Review */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-teal-600 rounded-xl">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Hank's AI Finance Coach</h2>
            <p className="text-sm text-gray-700 mb-4">
              Before running reports, Hank (our AI assistant) helps ensure your books are organized and ready for your accountant or CPA review.
            </p>
            <p className="text-xs text-gray-600 italic mb-4">
              Note: Hank is an AI tool, not a licensed CPA. Always consult with a qualified accountant for final review and tax preparation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReviewItem
                label="Revenue Complete"
                status={hankReview.monthlyReview.revenueComplete ? 'pass' : 'fail'}
                detail="All tuition mapped to students"
              />
              <ReviewItem
                label="Expenses Categorized"
                status={hankReview.monthlyReview.expensesCategorized >= 90 ? 'pass' : 'warning'}
                detail={`${hankReview.monthlyReview.expensesCategorized}% complete`}
              />
              <ReviewItem
                label="Receipts Attached"
                status={hankReview.monthlyReview.receiptsAttached >= 85 ? 'pass' : 'warning'}
                detail={`${hankReview.monthlyReview.receiptsAttached}% documented`}
              />
            </div>
            {hankReview.monthlyReview.issues.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-semibold text-yellow-900 mb-2">Before you run reports:</div>
                {hankReview.monthlyReview.issues.map((issue, idx) => (
                  <div key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{issue.item}</span> → {issue.fix}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <ReportTab active={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} label="Monthly Reports" />
          <ReportTab active={activeTab === 'quarterly'} onClick={() => setActiveTab('quarterly')} label="Quarterly Reports" />
          <ReportTab active={activeTab === 'yearend'} onClick={() => setActiveTab('yearend')} label="Year-End Reports" />
          <ReportTab active={activeTab === 'tax'} onClick={() => setActiveTab('tax')} label="Tax Filings" />
        </nav>
      </div>

      {/* Monthly Reports */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Financial Reports</h3>
            <p className="text-sm text-gray-600 mb-6">
              Hank ensures all transactions are categorized, reconciled, and ready for board review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="Profit & Loss (P&L)"
                description="Income statement - revenue, expenses, net income"
                period="September 2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Balance Sheet"
                description="Assets, liabilities, equity snapshot"
                period="As of Sep 30, 2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Cash Flow Statement"
                description="Operating, investing, financing cash flows"
                period="September 2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Budget vs. Actual"
                description="Variance analysis against approved budget"
                period="YTD through Sep 2024"
                status="ready"
                cpaApproved
              />
            </div>
          </div>
        </div>
      )}

      {/* Quarterly Reports */}
      {activeTab === 'quarterly' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Quarterly Board Package</h3>
            <p className="text-sm text-gray-600 mb-6">
              Complete board reporting package with financial statements, metrics, and narrative.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="Board Financial Package"
                description="P&L, Balance Sheet, Cash Flow, Metrics Dashboard"
                period="Q3 2024 (Jul-Sep)"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Enrollment & Attendance Report"
                description="Student counts, retention, attendance trends"
                period="Q3 2024"
                status="ready"
              />
              <ReportCard
                title="Restricted Fund Report"
                description="Grant spending vs. restrictions (501c3 only)"
                period="Q3 2024"
                status="ready"
                nonprofit
              />
              <ReportCard
                title="Key Metrics Dashboard"
                description="Days cash, enrollment, staffing ratios, facility burden"
                period="Q3 2024"
                status="ready"
              />
            </div>
          </div>
        </div>
      )}

      {/* Year-End Reports */}
      {activeTab === 'yearend' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Year-End Financial Reports</h3>
            <p className="text-sm text-gray-600 mb-6">
              Annual financial statements, audit preparation, and compliance reporting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="Annual P&L"
                description="Full fiscal year income statement"
                period="FY 2023-2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Annual Balance Sheet"
                description="Year-end financial position"
                period="As of Jun 30, 2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Statement of Cash Flows"
                description="Annual cash activity by category"
                period="FY 2023-2024"
                status="ready"
                cpaApproved
              />
              <ReportCard
                title="Audit Preparation Package"
                description="Trial balance, reconciliations, supporting docs"
                period="FY 2023-2024"
                status="needs_work"
                badge="Pro"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tax Filings */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Filings & Compliance</h3>
            <p className="text-sm text-gray-600 mb-6">
              Federal and state tax returns with Hank's pre-filing review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="Form 990 (Nonprofit)"
                description="Annual IRS filing for 501(c)(3) organizations"
                period="2023 Tax Year"
                status="needs_work"
                nonprofit
                deadline="May 15, 2024"
              />
              <ReportCard
                title="1120 / 1120S (For-Profit)"
                description="Corporate income tax return"
                period="2023 Tax Year"
                status="ready"
                deadline="Mar 15, 2024"
              />
              <ReportCard
                title="State Income Tax"
                description="State-level tax filing"
                period="2023 Tax Year"
                status="ready"
              />
              <ReportCard
                title="Sales Tax Returns"
                description="Monthly/quarterly sales tax filings"
                period="Q3 2024"
                status="ready"
              />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3">Hank's Tax Prep Checklist</h3>
            <div className="space-y-2 text-sm">
              <ChecklistItem complete label="All revenue categorized by source (tuition, grants, etc.)" />
              <ChecklistItem complete label="Expenses allocated to GL codes" />
              <ChecklistItem complete label="Restricted vs. unrestricted tracked (nonprofit)" />
              <ChecklistItem complete={false} label="Depreciation schedule updated" />
              <ChecklistItem complete label="Payroll reports reconciled" />
              <ChecklistItem complete={false} label="Form 1099s issued to contractors" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ReportTab = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`touch-target py-3 px-1 border-b-2 font-medium text-sm ${
      active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'
    }`}
  >
    {label}
  </button>
);

const ReviewItem = ({ label, status, detail }) => {
  const statusConfig = {
    pass: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    warning: { icon: ExclamationTriangleIcon, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    fail: { icon: ExclamationTriangleIcon, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  };
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <StatusIcon className={`h-5 w-5 ${config.color}`} />
        <span className="font-semibold text-gray-900 text-sm">{label}</span>
      </div>
      <div className="text-xs text-gray-600">{detail}</div>
    </div>
  );
};

const ReportCard = ({ title, description, period, status, cpaApproved, nonprofit, deadline, badge }) => (
  <div className={`bg-white rounded-lg border-2 p-6 hover:shadow-md transition cursor-pointer ${
    status === 'ready' ? 'border-green-200' : 'border-yellow-200'
  }`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {badge && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">{badge}</span>}
          {nonprofit && <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">Nonprofit</span>}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {cpaApproved && (
        <ShieldCheckIcon className="h-6 w-6 text-green-600" title="Reviewed by Hank (AI assistant)" />
      )}
    </div>

    <div className="flex items-center justify-between mb-4">
      <div className="text-xs text-gray-600">{period}</div>
      {deadline && (
        <div className="text-xs text-red-600 font-semibold flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          Due: {deadline}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status === 'ready' ? '✓ Ready to Export' : '⚠ Needs Work'}
      </span>
      <button className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold flex items-center gap-2">
        <ArrowDownTrayIcon className="h-4 w-4" />
        Export PDF
      </button>
    </div>
  </div>
);

const ChecklistItem = ({ complete, label }) => (
  <div className="flex items-start gap-2">
    <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${complete ? 'text-green-600' : 'text-gray-300'}`} />
    <span className={complete ? 'text-gray-700' : 'text-gray-500'}>{label}</span>
  </div>
);

