import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArchiveBoxIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Document structure with subcategories
const DOCUMENT_STRUCTURE = {
  'Accreditation': {
    items: ['Accreditation Certificate', 'State Compliance Reports', 'FERPA Policy'],
    all: true
  },
  'Board & Governance': {
    items: ['Board Meeting Minutes', 'Board Resolutions', 'Conflict of Interest Policy', 'Board Roster'],
    nonprofit: true,
    corp: true
  },
  'Contracts (Vendor)': {
    items: ['Vendor Contracts', 'Service Agreements', 'Software Licenses'],
    all: true
  },
  'Debt': {
    items: ['Loan Documents', 'Promissory Notes', 'Credit Agreements', 'Payment Schedules'],
    all: true
  },
  'Facility': {
    items: ['Lease', 'Floorplan', 'Survey', 'Certificate of Occupancy', 'Fire Inspection'],
    all: true
  },
  'Grant Applications': {
    items: ['Grant Applications', 'Award Letters', 'Grant Reports', 'Budget Narratives'],
    nonprofit: true
  },
  'Human Resources': {
    items: ['W-2 Forms', '1099-NEC Forms', 'Background Checks', 'Employment Agreements', 'I-9 Forms', 'Staff Handbook'],
    all: true
  },
  'Insurance': {
    items: ['General Liability', 'Professional Liability', 'Workers Compensation', 'Property Insurance', 'D&O Insurance'],
    all: true
  },
  'Legal & Formation': {
    items: [
      'I-9 Forms',
      'Articles of Incorporation',
      'Bylaws (C Corp & 501c3)',
      'Operating Agreement (LLC)',
      'Partnership Agreement (Multi-member)',
      '1023 Application (501c3)',
      '1023 Receipt from IRS',
      'EIN Letter',
      'Business License (Local)',
      'Business Registration (State)'
    ],
    all: true
  },
  'Tax Filings': {
    items: ['Form 990 (Nonprofit)', 'Form 1120-S (S Corp)', 'Form 1120 (C Corp)', 'Form 1065 (Partnership)', 'State Tax Returns'],
    all: true
  },
  'Tuition Contracts': {
    items: ['Enrollment Contracts (Families)', 'Master Tuition Contract Template', 'Handbook Signed Copies'],
    all: true
  }
};

const NAMING_TIPS = {
  'Lease': 'Lease_[Address]_[StartDate]_to_[EndDate].pdf',
  'General Liability': 'GL_Insurance_[Year]_[Carrier].pdf',
  'Tuition': 'Enrollment_Contract_[FamilyName]_[Year].pdf',
  'W-2': 'W2_[EmployeeName]_[Year].pdf',
  '1099': '1099_[ContractorName]_[Year].pdf'
};

export default function DocumentLibrary() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [entityType, setEntityType] = useState('llc-single');
  const [documents, setDocuments] = useState([]);
  const [archivedDocs, setArchivedDocs] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [newDoc, setNewDoc] = useState({
    category: '',
    type: '',
    name: '',
    file: null,
    expirationDate: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
      setSchoolName(settings.schoolName || 'Your School');
      setEntityType(localStorage.getItem('entityType') || 'llc-single');
      
      const storedDocs = localStorage.getItem('documents');
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      } else {
        // Prototype docs to show structure
        const prototypeDocs = [
          {
            id: '1',
            category: 'Legal & Formation',
            type: 'Articles of Incorporation',
            name: 'Articles of Incorporation - Sunshine Microschool',
            uploadDate: '2024-08-15',
            expirationDate: null
          },
          {
            id: '2',
            category: 'Insurance',
            type: 'General Liability',
            name: 'General Liability Insurance 2024-2025 State Farm',
            uploadDate: '2024-09-01',
            expirationDate: '2025-08-31'
          },
          {
            id: '3',
            category: 'Facility',
            type: 'Lease',
            name: 'Lease Agreement 123 Main St 2024-2027',
            uploadDate: '2024-08-01',
            expirationDate: '2027-07-31'
          },
          {
            id: '4',
            category: 'Tuition Contracts',
            type: 'Enrollment Contracts (Families)',
            name: 'Master Enrollment Contract 2024-2025',
            uploadDate: '2024-07-15',
            expirationDate: null
          },
          {
            id: '5',
            category: 'Facility',
            type: 'Fire Inspection',
            name: 'Fire Inspection Certificate 2024',
            uploadDate: '2024-08-10',
            expirationDate: '2025-08-10'
          }
        ];
        setDocuments(prototypeDocs);
      }
      
      const archived = JSON.parse(localStorage.getItem('archivedDocuments') || '[]');
      setArchivedDocs(archived);
    }
  }, []);

  const handleUpload = () => {
    if (!newDoc.category || !newDoc.type || !newDoc.name || !newDoc.file) {
      return toast.error('Fill in all required fields');
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
    toast.success(`✨ ${doc.name} added!`);
  };

  const handleArchive = (id) => {
    const doc = documents.find(d => d.id === id);
    const archived = { ...doc, archivedDate: new Date().toISOString().split('T')[0] };
    
    setDocuments(prev => prev.filter(d => d.id !== id));
    setArchivedDocs(prev => [...prev, archived]);
    
    localStorage.setItem('documents', JSON.stringify(documents.filter(d => d.id !== id)));
    localStorage.setItem('archivedDocuments', JSON.stringify([...archivedDocs, archived]));
    
    toast.success('Document archived');
  };

  const handleExport = () => {
    if (selectedDocs.length === 0) return toast.error('Select documents');
    toast.success(`📦 Exporting ${selectedDocs.length} documents...`);
  };

  const toggleSelect = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getMustHaves = () => {
    const mustHave = ['Articles of Incorporation', 'General Liability', 'Enrollment Contracts'];
    return mustHave.filter(name => 
      !documents.some(d => d.type.includes(name.split(' ')[0]))
    );
  };

  const getExpiring = () => {
    return documents.filter(doc => {
      if (!doc.expirationDate) return false;
      const days = Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      let threshold = 60;
      if (doc.type.toLowerCase().includes('lease')) threshold = 180;
      if (doc.type.toLowerCase().includes('insurance') || doc.type.toLowerCase().includes('license')) threshold = 90;
      
      return days <= threshold && days >= 0;
    }).map(doc => ({
      ...doc,
      daysUntil: Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
  };

  const mustHaves = getMustHaves();
  const expiring = getExpiring();

  const visibleCategories = Object.entries(DOCUMENT_STRUCTURE).filter(([name, config]) => {
    if (config.all) return true;
    if (config.nonprofit && entityType === '501c3') return true;
    if (config.corp && (entityType === 'scorp' || entityType === 'ccorp')) return true;
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold">{schoolName} Document Library</h1>
              <p className="text-sm text-gray-700 mt-1">
                Your single source of truth for all business documents. Keep everything organized, accessible, and lender-ready. 💙
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            Upload
          </button>
        </div>
      </div>

      {/* Must-Haves Alert */}
      {mustHaves.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">📋 Priority Documents Missing</h3>
              <p className="text-sm text-yellow-800 mb-2">These are critical - upload them first:</p>
              <ul className="text-sm text-yellow-900 space-y-1">
                {mustHaves.map((doc, idx) => <li key={idx}>• {doc}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Warnings */}
      {expiring.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-3">⚠️ Renewals Needed</h3>
              {expiring.map(doc => {
                const isLease = doc.type.toLowerCase().includes('lease');
                const isInsurance = doc.type.toLowerCase().includes('insurance');
                return (
                  <div key={doc.id} className="bg-white rounded p-3 mb-2 border border-red-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {isLease && '🏢 Start lease negotiations'}
                          {isInsurance && '🛡️ Call your broker'}
                          {!isLease && !isInsurance && '📋 Renew soon'}
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
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedDocs.length > 0 && (
            <>
              <span className="text-sm font-medium">{selectedDocs.length} selected</span>
              <button onClick={handleExport} className="px-3 py-1.5 bg-teal-600 text-white rounded text-sm font-semibold">
                <ArchiveBoxIcon className="h-4 w-4 inline mr-1" />
                Export ZIP
              </button>
              <button onClick={() => setSelectedDocs([])} className="text-sm text-gray-600">Clear</button>
            </>
          )}
        </div>
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showArchive ? 'Hide' : 'Show'} Archived ({archivedDocs.length})
        </button>
      </div>

      {/* Documents by Category with Subcategories */}
      <div className="space-y-4">
        {visibleCategories.map(([categoryName, config]) => {
          const categoryDocs = documents.filter(d => d.category === categoryName);
          
          return (
            <div key={categoryName} className="bg-white rounded-lg shadow border">
              {/* Category Header */}
              <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{categoryName}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {config.items.slice(0, 5).join(', ')}{config.items.length > 5 && '...'}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Documents in Category */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2"><input type="checkbox" className="rounded" /></th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap">Document Name</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap">Uploaded</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap">Expires</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categoryDocs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                          No documents yet. Common types: {config.items.slice(0, 3).join(', ')}
                        </td>
                      </tr>
                    ) : (
                      categoryDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => toggleSelect(doc.id)} className="rounded" />
                          </td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{doc.type}</td>
                          <td className="px-4 py-2 text-sm font-medium whitespace-nowrap">{doc.name}</td>
                          <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">{doc.uploadDate}</td>
                          <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">{doc.expirationDate || '—'}</td>
                          <td className="px-4 py-2 text-right whitespace-nowrap">
                            <div className="inline-flex gap-1">
                              <button className="p-1 hover:bg-gray-100 rounded"><EyeIcon className="h-4 w-4 text-gray-600" /></button>
                              <button className="p-1 hover:bg-gray-100 rounded"><ArrowDownTrayIcon className="h-4 w-4 text-gray-600" /></button>
                              <button onClick={() => handleArchive(doc.id)} className="p-1 hover:bg-gray-100 rounded" title="Archive">
                                <ArchiveBoxIcon className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archived Documents */}
      {showArchive && archivedDocs.length > 0 && (
        <div className="bg-gray-50 rounded-lg border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Archived Documents</h3>
          <div className="space-y-2">
            {archivedDocs.map(doc => (
              <div key={doc.id} className="text-sm text-gray-600 flex justify-between">
                <span>{doc.name}</span>
                <span className="text-xs">Archived {doc.archivedDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select category...</option>
                {visibleCategories.map(([name]) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            {newDoc.category && (
              <div>
                <label className="block text-sm font-medium mb-1">Type (select from category or type your own) *</label>
                <input
                  type="text"
                  value={newDoc.type}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  list="type-options"
                  placeholder="Start typing..."
                />
                <datalist id="type-options">
                  {DOCUMENT_STRUCTURE[newDoc.category]?.items.map((item, idx) => (
                    <option key={idx} value={item} />
                  ))}
                </datalist>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Document Name *</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., General Liability 2024-2025 State Farm"
              />
              {NAMING_TIPS[newDoc.type] && (
                <p className="text-xs text-purple-700 mt-1">
                  💡 Suggested format: <span className="font-mono">{NAMING_TIPS[newDoc.type]}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">File *</label>
              <input
                type="file"
                onChange={(e) => setNewDoc(prev => ({ ...prev, file: e.target.files[0] }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expiration Date (if applicable)</label>
              <input
                type="date"
                value={newDoc.expirationDate}
                onChange={(e) => setNewDoc(prev => ({ ...prev, expirationDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leases: 6-month warning • Insurance/Licenses: 90-day warning
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleUpload} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
