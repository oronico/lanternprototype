import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PACKAGES = [
  { id: 'loan', name: 'Lender Package', docs: ['EIN', 'Articles', 'Bylaws', 'Lease', 'Insurance', 'Tax Returns (2yr)', 'Financials (2yr)'] },
  { id: 'grant', name: 'Grant Package', docs: ['501c3 Letter', 'Articles', 'Bylaws', 'Form 990 (2yr)', 'Board Roster', 'Budget'] },
  { id: 'license', name: 'License Renewal', docs: ['Fire Inspection', 'Insurance', 'Background Checks', 'Staff Credentials'] }
];

const DOCS = [
  { cat: 'Legal', items: ['EIN Letter', 'Articles', 'Bylaws/Operating Agreement', '501c3 Determination'] },
  { cat: 'Insurance', items: ['General Liability', 'Prof Liability', 'Workers Comp', 'Property'] },
  { cat: 'Facility', items: ['Lease', 'Fire Inspection', 'Occupancy Permit'] },
  { cat: 'Student', items: ['Enrollment Contracts', 'Handbooks Signed', 'Emergency Forms'] },
  { cat: 'Staff', items: ['W-2s', '1099s', 'Background Checks'] },
  { cat: 'Tax', items: ['Form 990', 'Form 1120-S', 'Form 1120', 'Form 1065', 'State Returns'] }
];

export default function DocumentLibrary() {
  const [uploaded, setUploaded] = useState(['EIN Letter', 'Articles', 'Lease', 'General Liability']);
  const [showUpload, setShowUpload] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const total = DOCS.reduce((sum, cat) => sum + cat.items.length, 0);
  const complete = uploaded.length;
  const percent = Math.round((complete / total) * 100);

  const handleUpload = (docName) => {
    setUploaded(prev => [...prev, docName]);
    toast.success(`✅ ${docName} uploaded`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderIcon className="h-7 w-7 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-sm text-gray-600">{complete}/{total} uploaded ({percent}%)</p>
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

      {/* Packages - Horizontal Row */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {PACKAGES.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => { setSelectedPackage(pkg); setShowPackage(true); }}
            className="flex-shrink-0 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-400 transition"
          >
            <div className="flex items-center gap-2">
              <ArchiveBoxIcon className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-sm whitespace-nowrap">{pkg.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Document Table - One Line Per Doc */}
      <div className="bg-white rounded-lg shadow border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Document</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Uploaded</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Expires</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DOCS.map((category, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-4 py-1.5 text-xs font-bold text-gray-700 uppercase">
                      {category.cat}
                    </td>
                  </tr>
                  {category.items.map((doc, docIdx) => {
                    const isUploaded = uploaded.includes(doc);
                    return (
                      <tr key={docIdx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{doc}</td>
                        <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                          {isUploaded ? '09/15/2024' : '—'}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                          {isUploaded && (doc.includes('Insurance') || doc.includes('Lease')) ? '12/31/2024' : '—'}
                        </td>
                        <td className="px-4 py-2 text-center whitespace-nowrap">
                          {isUploaded ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 inline" />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {isUploaded ? (
                            <div className="inline-flex items-center gap-1">
                              <button className="p-1 hover:bg-gray-100 rounded"><EyeIcon className="h-4 w-4 text-gray-600" /></button>
                              <button className="p-1 hover:bg-gray-100 rounded"><ArrowDownTrayIcon className="h-4 w-4 text-gray-600" /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpload(doc)}
                              className="px-3 py-1 bg-primary-600 text-white rounded text-xs font-semibold hover:bg-primary-700"
                            >
                              Upload
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Modal */}
      {showPackage && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedPackage.name}</h2>
              <button onClick={() => setShowPackage(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {selectedPackage.docs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm py-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { toast.success('📦 Package downloaded'); setShowPackage(false); }}
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
            >
              Download Package as ZIP
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <input type="file" className="w-full px-4 py-3 border-2 border-dashed rounded-lg" />
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => { toast.success('Uploaded'); setShowUpload(false); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
