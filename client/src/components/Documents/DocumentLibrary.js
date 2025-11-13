import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TagIcon,
  ArchiveBoxIcon,
  ShareIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Document Library - Complete Document Management System
 * 
 * Professional document organization for schools:
 * - Category-based structure
 * - Tag system for cross-referencing
 * - Expiration tracking
 * - Version control
 * - Smart packaging for grants/loans
 * - Easy search and filter
 * 
 * Categories:
 * 1. Legal & Governance
 * 2. Facility & Property
 * 3. Insurance & Risk
 * 4. Vendor Contracts
 * 5. Employment & Staff
 * 6. Student & Family
 * 7. Compliance & Safety
 * 8. Financial & Tax
 */

const DOCUMENT_CATEGORIES = [
  {
    id: 'legal',
    name: 'Legal & Governance',
    icon: '⚖️',
    color: 'indigo',
    description: 'Corporate docs, bylaws, contracts',
    commonDocs: ['Articles of Incorporation', 'Bylaws', 'Board Minutes', 'Operating Agreement', 'EIN Letter']
  },
  {
    id: 'facility',
    name: 'Facility & Property',
    icon: '🏢',
    color: 'orange',
    description: 'Lease, inspections, permits',
    commonDocs: ['Lease Agreement', 'Certificate of Occupancy', 'Fire Inspection', 'Health Permit', 'Zoning Approval']
  },
  {
    id: 'insurance',
    name: 'Insurance & Risk',
    icon: '🛡️',
    color: 'blue',
    description: 'All insurance policies',
    commonDocs: ['General Liability', 'Professional Liability', 'Property Insurance', 'Workers Comp', 'Umbrella Policy', 'Cyber Insurance']
  },
  {
    id: 'vendors',
    name: 'Vendor Contracts',
    icon: '🤝',
    color: 'green',
    description: 'Service agreements',
    commonDocs: ['Janitorial Contract', 'HVAC Maintenance', 'IT Services', 'Curriculum Provider', 'Food Service']
  },
  {
    id: 'employment',
    name: 'Employment & Staff',
    icon: '👥',
    color: 'purple',
    description: 'Staff contracts, handbooks',
    commonDocs: ['Employee Contracts', 'Staff Handbook', 'Offer Letters', 'Non-Compete Agreements', 'Background Checks']
  },
  {
    id: 'student',
    name: 'Student & Family',
    icon: '🎓',
    color: 'blue',
    description: 'Handbooks, policies',
    commonDocs: ['Family Handbook', 'Enrollment Agreement Template', 'Tuition Policy', 'Withdrawal Policy', 'Code of Conduct']
  },
  {
    id: 'compliance',
    name: 'Compliance & Safety',
    icon: '🚨',
    color: 'red',
    description: 'Emergency plans, inspections',
    commonDocs: ['Emergency Response Plan', 'Fire Drill Log', 'Incident Reports', 'Safety Procedures', 'Mandated Reporter Training']
  },
  {
    id: 'financial',
    name: 'Financial & Tax',
    icon: '💰',
    color: 'green',
    description: 'Financial statements, tax returns',
    commonDocs: ['Year-End Financials', 'Tax Returns', 'Audit Reports', 'Budget', 'Bank Statements']
  }
];

// Pre-defined document packages for common needs
const DOCUMENT_PACKAGES = [
  {
    id: 'bank-loan',
    name: 'Bank Loan Application',
    description: 'Everything lenders typically request',
    requiredDocs: [
      'Articles of Incorporation',
      'Bylaws',
      'EIN Letter',
      'Lease Agreement',
      'Certificate of Occupancy',
      'General Liability Insurance',
      'Year-End Financials (2 years)',
      'Tax Returns (2 years)',
      'Current P&L and Balance Sheet',
      'Bank Statements (3 months)'
    ]
  },
  {
    id: 'grant',
    name: 'Grant Application',
    description: 'Common grant requirements',
    requiredDocs: [
      'Articles of Incorporation',
      'Bylaws',
      'EIN Letter',
      '501(c)(3) Determination Letter',
      'Board Member List',
      'Year-End Financials',
      'Annual Budget',
      'Program Description',
      'Insurance Certificates'
    ]
  },
  {
    id: 'audit',
    name: 'Annual Audit Package',
    description: 'For independent auditors',
    requiredDocs: [
      'Chart of Accounts',
      'General Ledger',
      'Bank Reconciliations',
      'Payroll Records',
      'Vendor Invoices',
      'Board Meeting Minutes',
      'Prior Year Audit'
    ]
  },
  {
    id: 'licensing',
    name: 'Licensing/Accreditation',
    description: 'State licensing or accreditation',
    requiredDocs: [
      'Articles of Incorporation',
      'Certificate of Occupancy',
      'Fire Inspection Report',
      'Staff Background Checks',
      'Staff Handbook',
      'Family Handbook',
      'Emergency Response Plan',
      'Insurance Certificates',
      'Health Permit'
    ]
  }
];

export default function DocumentLibrary() {
  const [activeView, setActiveView] = useState('categories'); // categories, all, packages
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    analytics.trackPageView('document-library');
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    // Demo documents
    setDocuments([
      // Legal & Governance
      { id: 1, name: 'Articles of Incorporation', category: 'legal', uploaded: '2023-01-15', expires: null, tags: ['incorporation', 'required'], status: 'current', version: '1.0' },
      { id: 2, name: 'Corporate Bylaws', category: 'legal', uploaded: '2024-06-15', expires: null, tags: ['governance', 'board'], status: 'current', version: '2.0' },
      { id: 3, name: 'Board Meeting Minutes - Sep 2024', category: 'legal', uploaded: '2024-09-20', expires: null, tags: ['board', 'minutes'], status: 'current', version: '1.0' },
      { id: 4, name: 'EIN Assignment Letter', category: 'legal', uploaded: '2023-01-20', expires: null, tags: ['tax', 'required'], status: 'current', version: '1.0' },
      
      // Facility
      { id: 5, name: 'Lease Agreement', category: 'facility', uploaded: '2024-01-01', expires: '2026-12-31', tags: ['lease', 'required'], status: 'current', version: '1.0', daysUntilExpiry: 827 },
      { id: 6, name: 'Certificate of Occupancy', category: 'facility', uploaded: '2024-01-10', expires: null, tags: ['permit', 'required'], status: 'current', version: '1.0' },
      { id: 7, name: 'Fire Inspection Report', category: 'facility', uploaded: '2024-03-15', expires: '2025-03-15', tags: ['inspection', 'safety'], status: 'current', version: '1.0', daysUntilExpiry: 175 },
      { id: 8, name: 'Health Permit', category: 'facility', uploaded: '2024-01-20', expires: '2025-01-20', tags: ['permit', 'required'], status: 'expiring-soon', version: '1.0', daysUntilExpiry: 117 },
      
      // Insurance
      { id: 9, name: 'General Liability Insurance', category: 'insurance', uploaded: '2024-01-01', expires: '2024-12-31', tags: ['insurance', 'liability'], status: 'expiring-soon', version: '2024', daysUntilExpiry: 97 },
      { id: 10, name: 'Professional Liability (E&O)', category: 'insurance', uploaded: '2024-01-01', expires: '2024-12-31', tags: ['insurance', 'professional'], status: 'expiring-soon', version: '2024', daysUntilExpiry: 97 },
      { id: 11, name: 'Workers Compensation', category: 'insurance', uploaded: '2024-01-01', expires: '2024-12-31', tags: ['insurance', 'workers-comp'], status: 'expiring-soon', version: '2024', daysUntilExpiry: 97 },
      
      // Vendor Contracts
      { id: 12, name: 'Janitorial Services Contract', category: 'vendors', uploaded: '2024-01-15', expires: '2025-01-15', tags: ['vendor', 'services'], status: 'current', version: '1.0', daysUntilExpiry: 117 },
      { id: 13, name: 'HVAC Maintenance Agreement', category: 'vendors', uploaded: '2024-01-15', expires: '2025-01-15', tags: ['vendor', 'maintenance'], status: 'current', version: '1.0', daysUntilExpiry: 117 },
      
      // Employment
      { id: 14, name: 'Staff Handbook', category: 'employment', uploaded: '2024-08-01', expires: null, tags: ['handbook', 'policies'], status: 'current', version: '2024-25' },
      { id: 15, name: 'Background Check Policy', category: 'employment', uploaded: '2024-01-01', expires: null, tags: ['compliance', 'hiring'], status: 'current', version: '1.0' },
      
      // Student & Family
      { id: 16, name: 'Family Handbook', category: 'student', uploaded: '2024-08-01', expires: null, tags: ['handbook', 'policies'], status: 'current', version: '2024-25' },
      { id: 17, name: 'Enrollment Agreement Template', category: 'student', uploaded: '2024-08-01', expires: null, tags: ['enrollment', 'contract'], status: 'current', version: '2024-25' },
      { id: 18, name: 'Tuition Policy', category: 'student', uploaded: '2024-08-01', expires: null, tags: ['tuition', 'policy'], status: 'current', version: '2024-25' },
      
      // Compliance & Safety
      { id: 19, name: 'Emergency Response Plan', category: 'compliance', uploaded: '2024-01-01', expires: null, tags: ['safety', 'emergency'], status: 'current', version: '1.0' },
      { id: 20, name: 'Incident Report Forms', category: 'compliance', uploaded: '2024-01-01', expires: null, tags: ['safety', 'forms'], status: 'current', version: '1.0' },
      
      // Financial & Tax
      { id: 21, name: '2023 Year-End Financials', category: 'financial', uploaded: '2024-01-15', expires: null, tags: ['financials', 'year-end'], status: 'archived', version: '2023' },
      { id: 22, name: '2023 Tax Return (Form 990)', category: 'financial', uploaded: '2024-04-10', expires: null, tags: ['tax', '990'], status: 'archived', version: '2023' }
    ]);
  };

  const toggleDocSelection = (docId) => {
    setSelectedDocs(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectPackage = (packageId) => {
    const package_ = DOCUMENT_PACKAGES.find(p => p.id === packageId);
    toast.success(`Selected ${selectedDocs.length} documents for ${package_.name}`);
    // In production: would match documents to package requirements
  };

  const downloadSelected = () => {
    if (selectedDocs.length === 0) {
      toast.error('Please select at least one document');
      return;
    }
    
    toast.success(`Downloading ${selectedDocs.length} documents as ZIP file...`);
    analytics.trackFeatureUsage('documentLibrary', 'download_package', {
      count: selectedDocs.length
    });
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDocsByCategory = (categoryId) => {
    return documents.filter(d => d.category === categoryId);
  };

  const expiringCount = documents.filter(d => d.status === 'expiring-soon').length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
              <p className="text-gray-600">Organize all your school documents in one place</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {selectedDocs.length > 0 && (
              <button
                onClick={downloadSelected}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download ({selectedDocs.length})
              </button>
            )}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {expiringCount > 0 && (
        <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-orange-900 mb-1">
                {expiringCount} Documents Expiring Soon
              </div>
              <div className="text-sm text-orange-800">
                Review and renew insurance policies, permits, and contracts before they expire.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setActiveView('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveView('packages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'packages'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShareIcon className="h-4 w-4 inline mr-2" />
            Document Packages
          </button>
        </nav>
      </div>

      {/* Categories View */}
      {activeView === 'categories' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCUMENT_CATEGORIES.map(category => {
              const docsInCategory = getDocsByCategory(category.id);
              const expiring = docsInCategory.filter(d => d.status === 'expiring-soon').length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setActiveView('all');
                  }}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-primary-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {docsInCategory.length} documents
                    </span>
                    {expiring > 0 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                        {expiring} expiring
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All Documents View */}
      {activeView === 'all' && (
        <div>
          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocs(filteredDocs.map(d => d.id));
                        } else {
                          setSelectedDocs([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocs.map(doc => {
                  const category = DOCUMENT_CATEGORIES.find(c => c.id === doc.category);
                  
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleDocSelection(doc.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-xs text-gray-500">
                              {doc.tags.map(tag => `#${tag}`).join(' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-gray-900">{category?.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {doc.uploaded}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {doc.expires ? (
                          <div>
                            <div className={doc.daysUntilExpiry <= 120 ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                              {doc.expires}
                            </div>
                            {doc.daysUntilExpiry <= 120 && (
                              <div className="text-xs text-orange-500">
                                {doc.daysUntilExpiry} days
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'current' ? 'bg-green-100 text-green-800' :
                          doc.status === 'expiring-soon' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status === 'current' ? 'Current' :
                           doc.status === 'expiring-soon' ? 'Expiring Soon' :
                           'Archived'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-sm text-primary-600 hover:text-primary-800">
                            View
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDocs.length} of {documents.length} documents
            {selectedDocs.length > 0 && ` • ${selectedDocs.length} selected`}
          </div>
        </div>
      )}

      {/* Document Packages View */}
      {activeView === 'packages' && (
        <div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-1">Quick Document Packages</div>
            <div className="text-sm text-blue-700">
              Pre-configured document collections for common needs. Select a package to see what documents you need.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCUMENT_PACKAGES.map(package_ => {
              const hasAllDocs = package_.requiredDocs.every(reqDoc => 
                documents.some(doc => doc.name.includes(reqDoc.split('(')[0].trim()))
              );
              
              return (
                <div key={package_.id} className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{package_.name}</h3>
                      <p className="text-sm text-gray-600">{package_.description}</p>
                    </div>
                    {hasAllDocs ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Required Documents ({package_.requiredDocs.length}):
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {package_.requiredDocs.map((reqDoc, idx) => {
                        const hasDoc = documents.some(doc => doc.name.includes(reqDoc.split('(')[0].trim()));
                        
                        return (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            {hasDoc ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <ClockIcon className="h-4 w-4 text-orange-600" />
                            )}
                            <span className={hasDoc ? 'text-gray-700' : 'text-orange-700'}>
                              {reqDoc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => selectPackage(package_.id)}
                    className={`w-full py-2 rounded-lg font-medium ${
                      hasAllDocs
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {hasAllDocs ? 'Download Complete Package' : 'View Missing Documents'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

