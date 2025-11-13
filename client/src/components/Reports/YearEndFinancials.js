import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { FINANCIAL } from '../../data/centralizedMetrics';
import toast from 'react-hot-toast';

/**
 * Year-End Financials Manager
 * 
 * Handles:
 * - Year-end financial statements (P&L, Balance Sheet)
 * - Audited financials (for nonprofits >$750k)
 * - Different fiscal years (January, July, December, custom)
 * - Document storage and retrieval
 * - Integration with Document Repository
 */

const FISCAL_YEAR_OPTIONS = [
  { value: '12-31', label: 'December 31 (Calendar Year)', common: 'Most common' },
  { value: '06-30', label: 'June 30 (School Year)', common: 'Many schools' },
  { value: '07-31', label: 'July 31', common: 'Some schools' },
  { value: '01-31', label: 'January 31', common: 'Less common' },
  { value: 'custom', label: 'Custom Date', common: null }
];

export default function YearEndFinancials() {
  const [fiscalYearEnd, setFiscalYearEnd] = useState('12-31');
  const [entityType, setEntityType] = useState('');
  const [financials, setFinancials] = useState([]);
  const [auditRequired, setAuditRequired] = useState(false);

  useEffect(() => {
    analytics.trackPageView('year-end-financials');
    
    // Load entity type and fiscal year
    const storedEntityType = localStorage.getItem('entityType') || 'llc-single';
    const storedFiscalYear = localStorage.getItem('fiscalYearEnd') || '12-31';
    
    setEntityType(storedEntityType);
    setFiscalYearEnd(storedFiscalYear);
    
    // Audit required for 501c3 with revenue >$750k
    if (storedEntityType === '501c3' && FINANCIAL.annualRevenue > 750000) {
      setAuditRequired(true);
    }
    
    loadFinancials();
  }, []);

  const loadFinancials = () => {
    setFinancials([
      {
        id: 1,
        fiscalYear: '2023',
        fiscalYearEnd: '2023-12-31',
        type: 'Year-End Financials',
        documents: [
          { name: 'Profit & Loss Statement', uploaded: true, date: '2024-01-15' },
          { name: 'Balance Sheet', uploaded: true, date: '2024-01-15' },
          { name: 'Cash Flow Statement', uploaded: true, date: '2024-01-15' },
          { name: 'Statement of Functional Expenses', uploaded: true, date: '2024-01-15' }
        ],
        audited: false,
        preparedBy: 'Internal/CPA',
        status: 'complete'
      },
      {
        id: 2,
        fiscalYear: '2024',
        fiscalYearEnd: '2024-12-31',
        type: 'Year-End Financials',
        documents: [
          { name: 'Profit & Loss Statement', uploaded: false },
          { name: 'Balance Sheet', uploaded: false },
          { name: 'Cash Flow Statement', uploaded: false }
        ],
        audited: false,
        preparedBy: 'In Progress',
        status: 'upcoming',
        daysUntilYearEnd: 77
      }
    ]);
  };

  const handleChangeFiscalYear = (newFiscalYear) => {
    setFiscalYearEnd(newFiscalYear);
    localStorage.setItem('fiscalYearEnd', newFiscalYear);
    toast.success('Fiscal year end updated!');
  };

  const nextFiscalYearEnd = () => {
    const [month, day] = fiscalYearEnd.split('-');
    const currentYear = new Date().getFullYear();
    const yearEndDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    if (yearEndDate < new Date()) {
      yearEndDate.setFullYear(currentYear + 1);
    }
    
    const daysUntil = Math.floor((yearEndDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return {
      date: yearEndDate.toLocaleDateString(),
      daysUntil: daysUntil
    };
  };

  const nextYear = nextFiscalYearEnd();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Year-End Financials</h1>
              <p className="text-gray-600">Annual financial statements and audit reports</p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <CloudArrowUpIcon className="h-5 w-5" />
            Upload Financials
          </button>
        </div>
      </div>

      {/* Fiscal Year Setting */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-3">Your Fiscal Year</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Fiscal Year Ends:
              </label>
              <select
                value={fiscalYearEnd}
                onChange={(e) => handleChangeFiscalYear(e.target.value)}
                className="w-full md:w-96 px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                {FISCAL_YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.common && `• ${option.common}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-blue-800">
              <strong>Next fiscal year end:</strong> {nextYear.date} ({nextYear.daysUntil} days away)
            </div>
          </div>
        </div>
      </div>

      {/* Audit Requirement (if applicable) */}
      {auditRequired && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-yellow-900 mb-1">
                Annual Audit Required
              </div>
              <div className="text-sm text-yellow-800">
                As a 501(c)(3) with annual revenue over $750,000, you're required to have an independent
                audit performed by a licensed CPA firm. Plan 2-3 months for the audit process.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year-End Financials by Year */}
      <div className="space-y-6">
        {financials.map(yearEnd => (
          <div
            key={yearEnd.id}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              yearEnd.status === 'complete' ? 'border-green-500' :
              yearEnd.status === 'upcoming' ? 'border-blue-500' :
              'border-orange-500'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Fiscal Year {yearEnd.fiscalYear}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  Year ended: {yearEnd.fiscalYearEnd}
                  {yearEnd.daysUntilYearEnd && ` (${yearEnd.daysUntilYearEnd} days until year-end)`}
                </div>
              </div>
              {yearEnd.status === 'complete' ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  Complete
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  In Progress
                </span>
              )}
            </div>

            {/* Documents Checklist */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Required Documents:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {yearEnd.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.uploaded ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ExclamationCircleIcon className="h-5 w-5 text-orange-600" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        {doc.uploaded && (
                          <div className="text-xs text-gray-500">Uploaded {doc.date}</div>
                        )}
                      </div>
                    </div>
                    {doc.uploaded ? (
                      <button className="text-sm text-primary-600 hover:text-primary-800">
                        View
                      </button>
                    ) : (
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                        Upload
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Status (if required) */}
            {auditRequired && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Independent Audit</div>
                    <div className="text-xs text-gray-500">Required for 501(c)(3) >$750k revenue</div>
                  </div>
                  {yearEnd.status === 'complete' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      Audit Complete
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                      Schedule Audit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              {yearEnd.status === 'complete' && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download Complete Package
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Send to Document Repository
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Info */}
      <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-3">Year-End Financial Requirements</h3>
        <div className="text-sm text-purple-800 space-y-2">
          <div><strong>All entities:</strong> Profit & Loss Statement, Balance Sheet</div>
          <div><strong>501(c)(3) nonprofits:</strong> Statement of Functional Expenses (required for Form 990)</div>
          <div><strong>Audits required if:</strong> 501(c)(3) with revenue >$750k OR receiving federal grants >$750k</div>
          <div><strong>Timeline:</strong> Allow 60-90 days after fiscal year-end for CPA to prepare</div>
          <div><strong>Storage:</strong> Keep for 7 years minimum (IRS requirement)</div>
        </div>
      </div>
    </div>
  );
}

