import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Document Library - Comprehensive Document Management
 * 
 * Smart categorization for K-12 schools:
 * - Legal & Formation
 * - Compliance & Licensing
 * - Insurance & Risk
 * - Contracts & Agreements
 * - Policies & Procedures
 * - Financial Records
 * 
 * Features:
 * - Search across all documents
 * - Filter by category, type, status
 * - Expiration tracking
 * - Document packaging (for grants/loans)
 * - Quick sharing
 */

const DOCUMENT_CATEGORIES = [
  {
    id: 'legal',
    name: 'Legal & Formation',
    icon: '⚖️',
    color: 'indigo',
    types: [
      'Articles of Incorporation',
      'Bylaws',
      'Operating Agreement',
      'IRS Determination Letter (501c3)',
      'EIN Confirmation',
      'State Registration',
      'Trademark/DBA Registration'
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance & Licensing',
    icon: '✅',
    color: 'green',
    types: [
      'Educational License',
      'Childcare License',
      'Certificate of Occupancy',
      'Fire Inspection Certificate',
      'Health Inspection',
      'Background Check Results',
      'Staff Credentials',
      'Accreditation Documents'
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance & Risk',
    icon: '🛡️',
    color: 'blue',
    types: [
      'General Liability Policy',
      'Professional Liability',
      'Property Insurance',
      'Workers Compensation',
      'Cyber Liability',
      'Directors & Officers (D&O)',
      'Umbrella Policy',
      'Auto Insurance (if applicable)'
    ]
  },
  {
    id: 'contracts',
    name: 'Contracts & Agreements',
    icon: '📝',
    color: 'purple',
    types: [
      'Lease Agreement',
      'Vendor Contracts',
      'Staff Employment Contracts',
      'Tuition Contracts (Master)',
      'Family Enrollment Agreements',
      'Partnership Agreements',
      'Service Agreements'
    ]
  },
  {
    id: 'policies',
    name: 'Policies & Procedures',
    icon: '📋',
    color: 'orange',
    types: [
      'Family Handbook',
      'Staff Handbook',
      'Emergency Procedures',
      'Health & Safety Policy',
      'Tuition & Payment Policy',
      'Withdrawal Policy',
      'Discipline Policy',
      'Privacy Policy (FERPA)'
    ]
  },
  {
    id: 'financial',
    name: 'Financial Records',
    icon: '💰',
    color: 'yellow',
    types: [
      'Annual Financial Statements',
      'Audited Financials',
      'Form 990 (Nonprofit)',
      'Tax Returns',
      'Bank Statements',
      'Budget Documents',
      'Grant Applications',
      'Loan Documents'
    ]
  }
];

const DOCUMENT_PACKAGES = [
  {
    id: 'bank-loan',
    name: 'Bank Loan Application',
    description: 'Complete package for SBA or commercial loan',
    requiredDocs: [
      'Articles of Incorporation',
      'Bylaws or Operating Agreement',
      'EIN Confirmation',
      'Last 2 years tax returns',
      'Last 2 years financial statements',
      'Current P&L and Balance Sheet',
      'Personal financial statements (owners)',
      'Business plan',
      'Lease agreement',
      'Insurance certificates'
    ]
  },
  {
    id: 'grant',
    name: 'Grant Application',
    description: 'Standard nonprofit grant package',
    requiredDocs: [
      'IRS Determination Letter (501c3)',
      'Articles of Incorporation',
      'Bylaws',
      'Board roster',
      'Form 990 (last 2 years)',
      'Audited financials (if required)',
      'Current budget',
      'Program descriptions',
      'Staff credentials'
    ]
  },
  {
    id: 'licensing',
    name: 'Licensing Renewal',
    description: 'Annual licensing package',
    requiredDocs: [
      'Educational/Childcare License',
      'Certificate of Occupancy',
      'Fire Inspection',
      'Health Inspection',
      'Insurance certificates (all current)',
      'Staff background checks',
      'Staff credentials',
      'Emergency procedures'
    ]
  },
  {
    id: 'audit',
    name: 'Annual Audit',
    description: 'CPA audit documentation',
    requiredDocs: [
      'Chart of accounts',
      'General ledger',
      'Bank statements (all accounts)',
      'Reconciliations',
      'Payroll records',
      'Board meeting minutes',
      'Contracts and agreements',
      'Insurance policies'
    ]
  }
];

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    analytics.trackPageView('document-library');
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    // Demo documents
    setDocuments([
      // Legal & Formation
      { id: 1, name: 'Articles of Incorporation', category: 'legal', type: 'Articles of Incorporation', uploaded: '2023-01-15', expires: null, status: 'current', fileSize: '245 KB' },
      { id: 2, name: 'Corporate Bylaws v2.0', category: 'legal', type: 'Bylaws', uploaded: '2024-06-15', expires: null, status: 'current', fileSize: '180 KB' },
      { id: 3, name: 'IRS 501(c)(3) Determination', category: 'legal', type: 'IRS Determination Letter (501c3)', uploaded: '2023-03-20', expires: null, status: 'current', fileSize: '95 KB' },
      { id: 4, name: 'EIN Confirmation Letter', category: 'legal', type: 'EIN Confirmation', uploaded: '2023-01-10', expires: null, status: 'current', fileSize: '45 KB' },
      
      // Compliance & Licensing
      { id: 5, name: 'Educational License 2024-25', category: 'compliance', type: 'Educational License', uploaded: '2024-07-01', expires: '2025-06-30', status: 'current', fileSize: '120 KB' },
      { id: 6, name: 'Certificate of Occupancy', category: 'compliance', type: 'Certificate of Occupancy', uploaded: '2023-08-15', expires: null, status: 'current', fileSize: '200 KB' },
      { id: 7, name: 'Fire Inspection 2024', category: 'compliance', type: 'Fire Inspection Certificate', uploaded: '2024-08-01', expires: '2025-08-01', status: 'current', fileSize: '150 KB' },
      
      // Insurance & Risk
      { id: 8, name: 'General Liability Policy', category: 'insurance', type: 'General Liability Policy', uploaded: '2024-01-01', expires: '2024-12-31', status: 'expiring-soon', fileSize: '340 KB', daysUntilExpiry: 97 },
      { id: 9, name: 'Professional Liability', category: 'insurance', type: 'Professional Liability', uploaded: '2024-01-01', expires: '2024-12-31', status: 'expiring-soon', fileSize: '280 KB', daysUntilExpiry: 97 },
      { id: 10, name: 'Workers Compensation', category: 'insurance', type: 'Workers Compensation', uploaded: '2024-01-01', expires: '2024-12-31', status: 'expiring-soon', fileSize: '220 KB', daysUntilExpiry: 97 },
      
      // Contracts & Agreements
      { id: 11, name: 'Lease Agreement', category: 'contracts', type: 'Lease Agreement', uploaded: '2024-01-01', expires: '2026-12-31', status: 'current', fileSize: '890 KB' },
      { id: 12, name: 'Tuition Contract Template 2024-25', category: 'contracts', type: 'Tuition Contracts (Master)', uploaded: '2024-06-15', expires: null, status: 'current', fileSize: '145 KB' },
      { id: 13, name: 'Janitorial Service Contract', category: 'contracts', type: 'Vendor Contracts', uploaded: '2024-01-15', expires: '2025-01-15', status: 'current', fileSize: '95 KB' },
      
      // Policies & Procedures
      { id: 14, name: 'Family Handbook 2024-25', category: 'policies', type: 'Family Handbook', uploaded: '2024-07-01', expires: null, status: 'current', fileSize: '520 KB' },
      { id: 15, name: 'Emergency Procedures', category: 'policies', type: 'Emergency Procedures', uploaded: '2024-08-01', expires: null, status: 'current', fileSize: '180 KB' },
      
      // Financial Records
      { id: 16, name: 'Form 990 - 2023', category: 'financial', type: 'Form 990 (Nonprofit)', uploaded: '2024-05-10', expires: null, status: 'current', fileSize: '420 KB' },
      { id: 17, name: 'Audited Financials 2023', category: 'financial', type: 'Audited Financials', uploaded: '2024-04-15', expires: null, status: 'current', fileSize: '680 KB' }
    ]);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleDocument = (docId) => {
    setSelectedDocs(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const createPackage = (packageId) => {
    setSelectedPackage(DOCUMENT_PACKAGES.find(p => p.id === packageId));
    setShowPackageModal(true);
  };

  const downloadPackage = () => {
    analytics.trackFeatureUsage('documentLibrary', 'download_package', {
      packageType: selectedPackage.id,
      docCount: selectedDocs.length
    });
    
    toast.success(`Downloading ${selectedPackage.name} package...`);
    // In production: Create ZIP with selected documents
  };

  const expiringDocs = documents.filter(d => d.status === 'expiring-soon');
  const currentCategory = DOCUMENT_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 w-full">
            <FolderIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
              <p className="text-gray-600">Organize and manage all your school documents</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowPackageModal(true)}
              className="touch-target w-full sm:w-auto px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2"
            >
              <ArchiveBoxIcon className="h-5 w-5" />
              Create Package ({selectedDocs.length})
            </button>
            <button
              onClick={() => document.getElementById('document-upload')?.click()}
              className="touch-target w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      <input id="document-upload" type="file" className="hidden" />

      {/* Expiring Documents Alert */}
      {expiringDocs.length > 0 && (
        <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-orange-900 mb-1">
                {expiringDocs.length} Document{expiringDocs.length !== 1 ? 's' : ''} Expiring Soon
              </div>
              <div className="text-sm text-orange-800">
                {expiringDocs.map(d => d.name).join(', ')} - Renew before {expiringDocs[0]?.expires}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Package Buttons */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOCUMENT_PACKAGES.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => createPackage(pkg.id)}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow border-2 border-gray-200 hover:border-primary-500 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-gray-900">{pkg.name}</div>
              <ShareIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600 mb-3">{pkg.description}</div>
            <div className="text-xs text-primary-600 font-medium">
              {pkg.requiredDocs.length} documents →
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="touch-target w-full lg:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          {DOCUMENT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {DOCUMENT_CATEGORIES
          .filter(cat => selectedCategory === 'all' || cat.id === selectedCategory)
          .map(category => {
            const categoryDocs = filteredDocuments.filter(d => d.category === category.id);
            
            if (categoryDocs.length === 0) return null;
            
            return (
              <div key={category.id} className="bg-white rounded-lg shadow">
                {/* Category Header */}
                <div className={`bg-${category.color}-50 border-b border-${category.color}-100 px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="text-sm text-gray-600">{categoryDocs.length} documents</div>
                    </div>
                  </div>
                </div>

                {/* Documents Table */}
                <div className="table-scroll">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-6 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocs(prev => [...new Set([...prev, ...categoryDocs.map(d => d.id)])]);
                              } else {
                                setSelectedDocs(prev => prev.filter(id => !categoryDocs.find(d => d.id === id)));
                              }
                            }}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {categoryDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedDocs.includes(doc.id)}
                              onChange={() => toggleDocument(doc.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{doc.name}</div>
                                <div className="text-xs text-gray-500">{doc.fileSize}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doc.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{doc.uploaded}</td>
                          <td className="px-6 py-4">
                            {doc.expires ? (
                              <div>
                                <div className="text-sm text-gray-900">{doc.expires}</div>
                                {doc.daysUntilExpiry && doc.daysUntilExpiry < 120 && (
                                  <div className="text-xs text-orange-600">{doc.daysUntilExpiry} days</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'current' ? 'bg-green-100 text-green-800' :
                              doc.status === 'expiring-soon' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {doc.status === 'current' ? 'Current' :
                               doc.status === 'expiring-soon' ? 'Expiring Soon' :
                               'Expired'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button className="touch-target px-3 py-2 text-sm text-primary-600 hover:text-primary-800">
                                View
                              </button>
                              <button className="touch-target px-3 py-2 text-sm text-gray-600 hover:text-gray-800">
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>

      {/* Package Creation Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Document Package</h2>
              <button onClick={() => setShowPackageModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Package Type:
                </label>
                <div className="space-y-2">
                  {DOCUMENT_PACKAGES.map(pkg => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedPackage?.id === pkg.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{pkg.name}</div>
                      <div className="text-sm text-gray-600">{pkg.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPackage && (
                <div className="mb-6">
                  <div className="font-medium text-gray-900 mb-3">
                    Required Documents ({selectedPackage.requiredDocs.length}):
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedPackage.requiredDocs.map((doc, idx) => (
                        <li key={idx}>✓ {doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPackageModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadPackage}
                  disabled={!selectedPackage}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Create & Download Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
