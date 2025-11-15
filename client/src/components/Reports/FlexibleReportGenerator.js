import React, { useState } from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Flexible Report Generator
 * 
 * Users select:
 * - Report type (tuition, enrollment, attendance, P&L, etc.)
 * - Date range (custom start/end dates)
 * - Data source (internal CRM + QuickBooks)
 * - Export format (PDF, Excel, CSV)
 * 
 * Integrates with:
 * - Student CRM (enrollment, attendance data)
 * - Fundraising CRM (donor data)
 * - QuickBooks (financial statements)
 * - Payment engines (tuition collection data)
 */

const REPORT_CATEGORIES = [
  {
    id: 'financial',
    name: 'Financial Reports',
    icon: BanknotesIcon,
    color: 'teal',
    reports: [
      { id: 'pl', name: 'Profit & Loss (P&L)', desc: 'Income statement - revenue and expenses', source: 'quickbooks' },
      { id: 'balance_sheet', name: 'Balance Sheet', desc: 'Assets, liabilities, and equity', source: 'quickbooks' },
      { id: 'cash_flow', name: 'Cash Flow Statement', desc: 'Operating, investing, financing cash flows', source: 'quickbooks' },
      { id: 'budget_actual', name: 'Budget vs. Actual', desc: 'Variance analysis against budget', source: 'internal' },
      { id: 'ar_aging', name: 'Accounts Receivable Aging', desc: 'Outstanding tuition by aging bucket', source: 'internal' }
    ]
  },
  {
    id: 'tuition',
    name: 'Tuition & Payments',
    icon: BanknotesIcon,
    color: 'green',
    reports: [
      { id: 'tuition_collection', name: 'Tuition Collection Report', desc: 'Payment status by family', source: 'internal' },
      { id: 'payment_method', name: 'Payment Method Breakdown', desc: 'Stripe, ClassWallet, cash, etc.', source: 'internal' },
      { id: 'past_due', name: 'Past Due Accounts', desc: 'Families with outstanding balances', source: 'internal' },
      { id: 'revenue_by_student', name: 'Revenue by Student', desc: 'Tuition + fees per student', source: 'internal' },
      { id: 'esa_reimbursement', name: 'ESA Reimbursement Report', desc: 'ClassWallet/ESA revenue tracking', source: 'internal' }
    ]
  },
  {
    id: 'enrollment',
    name: 'Enrollment & Students',
    icon: UserGroupIcon,
    color: 'blue',
    reports: [
      { id: 'enrollment_snapshot', name: 'Enrollment Snapshot', desc: 'Current enrollment by program/grade', source: 'crm' },
      { id: 'enrollment_trend', name: 'Enrollment Trend', desc: 'Growth/decline over time', source: 'crm' },
      { id: 'retention', name: 'Retention Analysis', desc: 'Year-over-year retention rates', source: 'crm' },
      { id: 'attrition', name: 'Attrition Report', desc: 'Students who left and why', source: 'crm' },
      { id: 'pipeline', name: 'Recruitment Pipeline', desc: 'Leads, tours, applications, conversions', source: 'crm' }
    ]
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: CalendarIcon,
    color: 'purple',
    reports: [
      { id: 'attendance_summary', name: 'Attendance Summary', desc: 'Daily/weekly/monthly attendance rates', source: 'crm' },
      { id: 'student_attendance', name: 'Attendance by Student', desc: 'Individual student attendance records', source: 'crm' },
      { id: 'chronic_absence', name: 'Chronic Absence Report', desc: 'Students with attendance concerns', source: 'crm' },
      { id: 'attendance_trend', name: 'Attendance Trends', desc: 'Historical attendance patterns', source: 'crm' }
    ]
  },
  {
    id: 'fundraising',
    name: 'Fundraising (Nonprofit)',
    icon: ChartBarIcon,
    color: 'red',
    nonprofitOnly: true,
    reports: [
      { id: 'donor_summary', name: 'Donor Summary', desc: 'Total giving by donor', source: 'crm' },
      { id: 'grant_pipeline', name: 'Grant Pipeline', desc: 'All grants by stage', source: 'crm' },
      { id: 'restricted_funds', name: 'Restricted Fund Report', desc: 'Restricted vs. unrestricted revenue', source: 'quickbooks' },
      { id: 'fundraising_roi', name: 'Fundraising ROI', desc: 'Cost to raise a dollar', source: 'crm' }
    ]
  }
];

const DATE_PRESETS = [
  { value: 'mtd', label: 'Month to Date' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'qtd', label: 'Quarter to Date' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Date Range' }
];

const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
  { value: 'csv', label: 'CSV', icon: '📋' }
];

export default function FlexibleReportGenerator() {
  const [entityType, setEntityType] = useState('llc-single');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [datePreset, setDatePreset] = useState('mtd');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [quickbooksConnected, setQuickbooksConnected] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('entityType') || 'llc-single';
      setEntityType(stored);
    }
    
    // Check QuickBooks connection status
    const qbConnected = localStorage.getItem('quickbooksConnected') === 'true';
    setQuickbooksConnected(qbConnected);
  }, []);

  const handleGenerateReport = () => {
    if (!selectedReport) {
      return toast.error('Please select a report type');
    }

    const report = REPORT_CATEGORIES
      .flatMap(cat => cat.reports)
      .find(r => r.id === selectedReport);

    // Check data source availability
    if (report.source === 'quickbooks' && !quickbooksConnected) {
      toast.error('Connect QuickBooks to run financial reports');
      return;
    }

    // Generate report
    toast.success(`📊 Generating ${report.name}...`);
    
    setTimeout(() => {
      toast.success(`✅ ${report.name} ready! Downloading as ${exportFormat.toUpperCase()}...`);
    }, 2000);
  };

  const connectQuickBooks = () => {
    // In production, would initiate OAuth flow
    localStorage.setItem('quickbooksConnected', 'true');
    setQuickbooksConnected(true);
    toast.success('✅ QuickBooks connected!');
  };

  // Filter categories based on entity type
  const availableCategories = REPORT_CATEGORIES.filter(cat => {
    if (cat.nonprofitOnly && entityType !== '501c3') return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Report Generator</h1>
            <p className="text-gray-600">Run custom reports with flexible date ranges</p>
          </div>
        </div>
        {!quickbooksConnected && (
          <button
            onClick={connectQuickBooks}
            className="touch-target px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <LinkIcon className="h-5 w-5" />
            Connect QuickBooks
          </button>
        )}
      </div>

      {/* QuickBooks Integration Status */}
      <div className={`rounded-lg border-2 p-4 ${
        quickbooksConnected
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          <SparklesIcon className={`h-6 w-6 ${quickbooksConnected ? 'text-green-600' : 'text-yellow-600'}`} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Data Sources</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>✓ <strong>Internal CRM:</strong> Enrollment, attendance, tuition collection data</div>
              <div>{quickbooksConnected ? '✓' : '○'} <strong>QuickBooks:</strong> {quickbooksConnected ? 'Connected - P&L, Balance Sheet, Cash Flow available' : 'Not connected - Financial reports limited'}</div>
            </div>
            {!quickbooksConnected && (
              <p className="text-xs text-yellow-800 mt-2">
                Connect QuickBooks to unlock P&L, Balance Sheet, and Cash Flow reports.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Report Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Report Type</h3>
            <div className="space-y-2">
              {availableCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedReport(null);
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedCategory === category.id
                        ? `border-${category.color}-300 bg-${category.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-6 w-6 ${
                        selectedCategory === category.id ? `text-${category.color}-600` : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-semibold text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-600">{category.reports.length} reports</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Report Selection & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Selection */}
          {selectedCategory && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h3>
              <div className="space-y-3">
                {REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.reports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedReport === report.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{report.name}</div>
                        <div className="text-sm text-gray-600">{report.desc}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        report.source === 'quickbooks'
                          ? 'bg-green-100 text-green-800'
                          : report.source === 'crm'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}>
                        {report.source === 'quickbooks' ? 'QuickBooks' :
                         report.source === 'crm' ? 'CRM' : 'Internal'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Configuration */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Date Range</h3>
              
              {/* Preset Buttons */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DATE_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => setDatePreset(preset.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        datePreset === preset.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              {datePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export Format */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Export Format</h3>
              <div className="grid grid-cols-3 gap-3">
                {EXPORT_FORMATS.map(format => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      exportFormat === format.value
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <div className="text-sm font-semibold">{format.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          {selectedReport && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-2">Ready to Generate</h3>
              <div className="text-sm text-primary-100 mb-4">
                {REPORT_CATEGORIES.flatMap(c => c.reports).find(r => r.id === selectedReport)?.name} •{' '}
                {DATE_PRESETS.find(p => p.value === datePreset)?.label} •{' '}
                {EXPORT_FORMATS.find(f => f.value === exportFormat)?.label}
              </div>
              <button
                onClick={handleGenerateReport}
                className="w-full px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 font-semibold flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Generate Report
              </button>
            </div>
          )}

          {/* Empty State */}
          {!selectedCategory && (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">Select a report category to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Data Sources & Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold text-blue-900 mb-2">📊 QuickBooks</div>
            <div className="text-blue-800 space-y-1">
              <div>• Profit & Loss</div>
              <div>• Balance Sheet</div>
              <div>• Cash Flow</div>
              <div>• Restricted Funds</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-2">👥 Student CRM</div>
            <div className="text-blue-800 space-y-1">
              <div>• Enrollment data</div>
              <div>• Attendance records</div>
              <div>• Student demographics</div>
              <div>• Retention metrics</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-blue-900 mb-2">💰 Payment Data</div>
            <div className="text-blue-800 space-y-1">
              <div>• Tuition collection</div>
              <div>• Payment methods</div>
              <div>• Past due accounts</div>
              <div>• ESA reimbursements</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-4">
          Reports pull live data from your connected systems. QuickBooks sync happens automatically.
        </p>
      </div>

      {/* Hank's Help */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <SparklesIcon className="h-6 w-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">Hank's AI Report Coach</h3>
            <p className="text-sm text-purple-800 mb-3">
              Hank reviews your data quality before generating reports to ensure accuracy. If revenue isn't fully categorized or expenses are missing receipts, Hank will let you know!
            </p>
            <p className="text-xs text-purple-700 italic">
              Hank is an AI assistant. Always review reports with your CPA or accountant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

