import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Simple Document Library
 * Clean, scannable, easy to use
 */

const DOCUMENT_CHECKLIST = {
  'Legal & Formation': [
    { id: 'ein', name: 'EIN Letter from IRS', all: true },
    { id: 'articles', name: 'Articles of Incorporation/Organization', all: true },
    { id: 'bylaws', name: 'Bylaws or Operating Agreement', nonprofit: true, llc: true },
    { id: '501c3', name: '501(c)(3) Determination Letter', nonprofit: true },
    { id: 'business_license', name: 'Business Operating License', all: true, expires: true, days: 90 }
  ],
  'Insurance': [
    { id: 'gl', name: 'General Liability Insurance', all: true, expires: true, days: 90 },
    { id: 'prof_liability', name: 'Professional Liability (E&O)', all: true, expires: true, days: 90 },
    { id: 'workers_comp', name: 'Workers Compensation', all: true, expires: true, days: 90 },
    { id: 'property', name: 'Property Insurance', all: true, expires: true, days: 90 }
  ],
  'Facility': [
    { id: 'lease', name: 'Lease Agreement', all: true, expires: true, days: 180 },
    { id: 'fire', name: 'Fire Inspection Certificate', all: true, expires: true, days: 90 }
  ],
  'Student Files': [
    { id: 'enrollment_contracts', name: 'Enrollment Contracts (all families)', all: true },
    { id: 'handbooks', name: 'Signed Family Handbooks', all: true },
    { id: 'emergency', name: 'Emergency Contact Forms', all: true }
  ],
  'Staff & Payroll': [
    { id: 'w2s', name: 'W-2 Forms (employees)', all: true },
    { id: '1099s', name: '1099-NEC Forms (contractors >$600)', all: true },
    { id: 'background', name: 'Background Checks', all: true }
  ],
  'Board & Governance': [
    { id: 'board_minutes', name: 'Board Meeting Minutes', nonprofit: true, corp: true },
    { id: 'resolutions', name: 'Board Resolutions', nonprofit: true, corp: true }
  ],
  'Tax Returns': [
    { id: '990', name: 'Form 990', nonprofit: true },
    { id: '1120s', name: 'Form 1120-S', scorp: true },
    { id: '1120', name: 'Form 1120', ccorp: true },
    { id: '1065', name: 'Form 1065', partnership: true }
  ]
};

export default function ComprehensiveDocumentLibrary() {
  const [entityType, setEntityType] = useState('llc-single');
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEntityType(localStorage.getItem('entityType') || 'llc-single');
      const stored = localStorage.getItem('documents');
      if (stored) setDocuments(JSON.parse(stored));
    }
  }, []);

  const shouldShow = (item) => {
    if (item.all) return true;
    if (item.nonprofit && entityType === '501c3') return true;
    if (item.scorp && entityType === 'scorp') return true;
    if (item.ccorp && entityType === 'ccorp') return true;
    if (item.partnership && entityType === 'llc-partnership') return true;
    if (item.llc && (entityType.includes('llc') || entityType === 'scorp' || entityType === 'ccorp')) return true;
    if (item.corp && (entityType === 'scorp' || entityType === 'ccorp')) return true;
    return false;
  };

  const isUploaded = (id) => documents.some(d => d.docId === id);

  const getTotalRequired = () => {
    return Object.values(DOCUMENT_CHECKLIST)
      .flatMap(items => items)
      .filter(item => shouldShow(item)).length;
  };

  const getTotalUploaded = () => {
    return Object.values(DOCUMENT_CHECKLIST)
      .flatMap(items => items)
      .filter(item => shouldShow(item) && isUploaded(item.id)).length;
  };

  const handleUpload = (file, docId, category) => {
    const newDoc = {
      id: Date.now().toString(),
      docId,
      category,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      size: file.size
    };
    
    const updated = [...documents, newDoc];
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    toast.success(`✅ ${file.name} uploaded!`);
    setShowUpload(false);
  };

  const percent = getTotalRequired() > 0 
    ? Math.round((getTotalUploaded() / getTotalRequired()) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-gray-600">Keep your school's files organized and current</p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          Upload
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-primary-100">Document Completion</div>
            <div className="text-4xl font-bold">{percent}%</div>
          </div>
          <div className="text-right text-sm text-primary-100">
            {getTotalUploaded()} of {getTotalRequired()} required
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Checklist by Category */}
      {Object.entries(DOCUMENT_CHECKLIST).map(([category, items]) => {
        const visibleItems = items.filter(shouldShow);
        if (visibleItems.length === 0) return null;

        const uploadedCount = visibleItems.filter(item => isUploaded(item.id)).length;
        const isComplete = uploadedCount === visibleItems.length;

        return (
          <div key={category} className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{category}</h3>
                <div className="text-sm text-gray-600">{uploadedCount}/{visibleItems.length} complete</div>
              </div>
              {isComplete && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {visibleItems.map(item => {
                    const uploaded = isUploaded(item.id);
                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.expires && (
                            <div className="text-xs text-gray-500 mt-1">
                              Renews: {item.days === 180 ? '6 months' : item.days === 90 ? '90 days' : '60 days'} warning
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {uploaded ? (
                            <div className="flex items-center justify-end gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">Uploaded</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setUploadCategory(item.id);
                                setShowUpload(true);
                              }}
                              className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-semibold hover:bg-primary-700"
                            >
                              Upload
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Upload Modal - Simple */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleUpload(e.target.files[0], uploadCategory, uploadCategory);
                }
              }}
              className="w-full px-4 py-3 border-2 border-dashed rounded-lg hover:border-primary-400"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
