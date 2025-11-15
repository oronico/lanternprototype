import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// AI-Suggested Categories (alphabetical)
const CATEGORIES = [
  { id: 'accreditation', name: 'Accreditation', all: true },
  { id: 'board', name: 'Board & Governance', nonprofit: true, corp: true },
  { id: 'contracts', name: 'Contracts (Vendor)', all: true },
  { id: 'debt', name: 'Debt', all: true },
  { id: 'facility', name: 'Facility Lease/Title', all: true },
  { id: 'grants', name: 'Grant Applications', nonprofit: true },
  { id: 'hr', name: 'Human Resources', all: true },
  { id: 'insurance', name: 'Insurance', all: true },
  { id: 'legal', name: 'Legal & Formation', all: true },
  { id: 'tax', name: 'Tax Filings', all: true }
];

// AI-Suggested Document Types per Category
const AI_SUGGESTIONS = {
  legal: ['Articles of Incorporation', 'Bylaws', 'Operating Agreement', 'EIN Letter', '501(c)(3) Determination Letter', 'Business License', 'State Registration'],
  board: ['Board Meeting Minutes', 'Board Resolutions', 'Conflict of Interest Policy', 'Board Roster'],
  facility: ['Lease Agreement', 'Title Deed', 'Fire Inspection', 'Certificate of Occupancy', 'Zoning Approval'],
  insurance: ['General Liability', 'Professional Liability (E&O)', 'Workers Compensation', 'Property Insurance', 'Directors & Officers (D&O)', 'Cyber Liability'],
  hr: ['W-2 Forms', '1099-NEC Forms', 'Background Checks', 'Employment Agreements', 'Staff Handbook', 'I-9 Forms'],
  grants: ['Grant Applications', 'Award Letters', 'Grant Reports', 'Budget Narratives'],
  contracts: ['Vendor Contracts', 'Service Agreements', 'Software Licenses', 'Janitorial Contract'],
  debt: ['Loan Documents', 'Promissory Notes', 'Credit Agreements', 'Payment Schedules'],
  accreditation: ['Accreditation Certificate', 'State Compliance Reports', 'FERPA Policy'],
  tax: ['Form 990', 'Form 1120-S', 'Form 1120', 'Form 1065', 'State Tax Returns', 'Payroll Tax Filings']
};

// Expiration warning thresholds
const EXPIRATION_WARNINGS = {
  lease: 180, // 6 months
  insurance: 90, // 90 days
  license: 90, // 90 days
  default: 60
};

export default function DocumentLibrary() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [entityType, setEntityType] = useState('llc-single');
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(true);
  const [newDoc, setNewDoc] = useState({
    category: '',
    type: '',
    name: '',
    file: null,
    expirationDate: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schoolSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        setSchoolName(settings.schoolName || 'Your School');
      }
      setEntityType(localStorage.getItem('entityType') || 'llc-single');
      
      const storedDocs = localStorage.getItem('documents');
      if (storedDocs) setDocuments(JSON.parse(storedDocs));
    }
  }, []);

  const getExpiringDocuments = () => {
    return documents.filter(doc => {
      if (!doc.expirationDate) return false;
      const daysUntil = Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      let threshold = EXPIRATION_WARNINGS.default;
      if (doc.type.toLowerCase().includes('lease')) threshold = EXPIRATION_WARNINGS.lease;
      else if (doc.type.toLowerCase().includes('insurance')) threshold = EXPIRATION_WARNINGS.insurance;
      else if (doc.type.toLowerCase().includes('license')) threshold = EXPIRATION_WARNINGS.license;
      
      return daysUntil <= threshold && daysUntil >= 0;
    }).map(doc => {
      const daysUntil = Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      return { ...doc, daysUntil };
    });
  };

  const handleUpload = () => {
    if (!newDoc.category || !newDoc.type || !newDoc.name || !newDoc.file) {
      return toast.error('Please fill in all required fields');
    }

    const doc = {
      id: Date.now().toString(),
      category: newDoc.category,
      type: newDoc.type,
      name: newDoc.name,
      fileName: newDoc.file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      expirationDate: newDoc.expirationDate || null
    };

    const updated = [...documents, doc];
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    
    setShowUpload(false);
    setNewDoc({ category: '', type: '', name: '', file: null, expirationDate: '' });
    toast.success(`✨ ${doc.name} added to your library!`);
  };

  const handleDelete = (id) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    toast.success('Document removed');
  };

  const handleExportSelected = () => {
    if (selectedDocs.length === 0) return toast.error('Select documents to export');
    toast.success(`📦 Exporting ${selectedDocs.length} documents as ZIP...`);
  };

  const toggleSelect = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedDocs(selectedDocs.length === documents.length ? [] : documents.map(d => d.id));
  };

  const expiringDocs = getExpiringDocuments();
  
  // Filter categories by entity type
  const visibleCategories = CATEGORIES.filter(cat => {
    if (cat.all) return true;
    if (cat.nonprofit && entityType === '501c3') return true;
    if (cat.corp && (entityType === 'scorp' || entityType === 'ccorp')) return true;
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{schoolName} Document Library</h1>
              <p className="text-sm text-gray-700 mt-1">
                Your single source of truth for all business documents. Keep everything organized, accessible, and lender-ready. 💙
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">{documents.length}</div>
            <div className="text-xs text-gray-600">documents stored</div>
          </div>
        </div>
      </div>

      {/* AI Helper - Suggestions */}
      {showAIHelper && documents.length < 5 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-8 w-8 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Document Coach</h3>
              <p className="text-sm text-gray-700 mb-4">
                Here's what most schools keep in their library. Upload what you have, and we'll help you stay organized:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="font-semibold text-sm text-gray-900 mb-2">Must-Haves (Get These First):</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• EIN Letter from IRS</li>
                    <li>• General Liability Insurance</li>
                    <li>• Lease Agreement</li>
                    <li>• Fire Inspection Certificate</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="font-semibold text-sm text-gray-900 mb-2">Build Over Time:</div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Articles of Incorporation</li>
                    <li>• Enrollment Contracts</li>
                    <li>• Staff Background Checks</li>
                    <li>• Tax Returns (annual)</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowAIHelper(false)}
                className="mt-4 text-xs text-purple-700 hover:text-purple-900 font-medium"
              >
                Dismiss this guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expiration Warnings */}
      {expiringDocs.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-3">⚠️ Action Needed - Documents Expiring</h3>
              <div className="space-y-2">
                {expiringDocs.map(doc => {
                  const isLease = doc.type.toLowerCase().includes('lease');
                  const isInsurance = doc.type.toLowerCase().includes('insurance');
                  
                  return (
                    <div key={doc.id} className="bg-white rounded-lg p-3 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{doc.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {isLease && '🏢 Lease expires in ' + doc.daysUntil + ' days - Start negotiating renewal now'}
                            {isInsurance && '🛡️ Insurance expires in ' + doc.daysUntil + ' days - Call your broker to renew'}
                            {!isLease && !isInsurance && '📋 Expires in ' + doc.daysUntil + ' days - Renew before deadline'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">{doc.daysUntil}</div>
                          <div className="text-xs text-gray-600">days</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedDocs.length > 0 && (
            <>
              <span className="text-sm text-gray-700 font-medium">{selectedDocs.length} selected</span>
              <button
                onClick={handleExportSelected}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold flex items-center gap-2"
              >
                <ArchiveBoxIcon className="h-4 w-4" />
                Export as ZIP
              </button>
              <button onClick={() => setSelectedDocs([])} className="text-sm text-gray-600 hover:text-gray-900">
                Clear
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input type="checkbox" checked={selectedDocs.length === documents.length && documents.length > 0} onChange={selectAll} className="rounded" />
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Category</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Document Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Date Uploaded</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Date Expires</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-2">Your document library is ready!</p>
                    <p className="text-sm text-gray-500 mb-4">Upload your first document to get started. The AI helper above will guide you.</p>
                    <button
                      onClick={() => setShowUpload(true)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Upload First Document
                    </button>
                  </td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => toggleSelect(doc.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{doc.type}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{doc.category}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">{doc.uploadDate}</td>
                    <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">{doc.expirationDate || '—'}</td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View"><EyeIcon className="h-4 w-4 text-gray-600" /></button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Download"><ArrowDownTrayIcon className="h-4 w-4 text-gray-600" /></button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1 hover:bg-gray-100 rounded" title="Delete"><TrashIcon className="h-4 w-4 text-gray-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal with AI Guidance */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Document to Library</h2>
                <p className="text-sm text-gray-600">Build your organized file cabinet 💙</p>
              </div>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Category Selection with AI Suggestions */}
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc(prev => ({ ...prev, category: e.target.value, type: '' }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select a category...</option>
                {visibleCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Type Selection with AI Suggestions */}
            {newDoc.category && (
              <div>
                <label className="block text-sm font-medium mb-1">Document Type *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newDoc.type}
                    onChange={(e) => setNewDoc(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Start typing or select from suggestions..."
                    list="type-suggestions"
                  />
                  <datalist id="type-suggestions">
                    {AI_SUGGESTIONS[CATEGORIES.find(c => c.name === newDoc.category)?.id]?.map((suggestion, idx) => (
                      <option key={idx} value={suggestion} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 AI suggestions based on category (or type your own)
                </p>
              </div>
            )}

            {/* Document Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Document Name *</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., General Liability Insurance 2024-2025 State Farm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific - include year, vendor, version
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Upload File *</label>
              <input
                type="file"
                onChange={(e) => setNewDoc(prev => ({ ...prev, file: e.target.files[0] }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Expiration Date (if applicable)</label>
              <input
                type="date"
                value={newDoc.expirationDate}
                onChange={(e) => setNewDoc(prev => ({ ...prev, expirationDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll remind you: Leases (6 months early), Insurance & Licenses (90 days early)
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleUpload} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Add to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
