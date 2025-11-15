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
  FireIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DocumentLibrary() {
  const [schoolName, setSchoolName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', category: '', name: '', file: null, expirationDate: '' });
  const [uploadStreak, setUploadStreak] = useState(3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schoolSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        setSchoolName(settings.schoolName || 'Your School');
      }
      const storedDocs = localStorage.getItem('documents');
      if (storedDocs) setDocuments(JSON.parse(storedDocs));
    }
  }, []);

  const handleUpload = () => {
    if (!newDoc.type || !newDoc.category || !newDoc.name || !newDoc.file) {
      return toast.error('Please fill in all fields');
    }

    const doc = {
      id: Date.now().toString(),
      type: newDoc.type,
      category: newDoc.category,
      name: newDoc.name,
      fileName: newDoc.file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      expirationDate: newDoc.expirationDate || null
    };

    const updated = [...documents, doc];
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    
    setShowUpload(false);
    setNewDoc({ type: '', category: '', name: '', file: null, expirationDate: '' });
    toast.success(`✨ ${doc.name} added to your library!`);
  };

  const handleDelete = (id) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
    toast.success('Document removed');
  };

  const handleExportSelected = () => {
    if (selectedDocs.length === 0) {
      return toast.error('Select documents to export');
    }
    toast.success(`📦 Exporting ${selectedDocs.length} documents as ZIP...`);
  };

  const toggleSelect = (id) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedDocs.length === documents.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documents.map(d => d.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header with Warmth */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FolderIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{schoolName} Document Library</h1>
              <p className="text-sm text-gray-700 mt-1">
                Your single source of truth for all business documents. Keep everything organized, accessible, and lender-ready.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg">
              <FireIcon className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-xs text-gray-600">Update Streak</div>
                <div className="text-lg font-bold text-gray-900">{uploadStreak} days</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-xs text-gray-600">Uploaded</div>
                <div className="text-lg font-bold text-gray-900">{documents.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <button
                onClick={() => setSelectedDocs([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
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

      {/* Document Table - Clean & Tight */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === documents.length && documents.length > 0}
                    onChange={selectAll}
                    className="rounded"
                  />
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
                    <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-2">Your document library is ready to go!</p>
                    <p className="text-sm text-gray-500">Click "Upload Document" to start building your school's file cabinet.</p>
                  </td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">{doc.type}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{doc.category}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">{doc.uploadDate}</td>
                    <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                      {doc.expirationDate || '—'}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <EyeIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                          <ArrowDownTrayIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
                          <TrashIcon className="h-4 w-4 text-gray-400" />
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

      {/* Upload Modal - User Defines Everything */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Document to Library</h2>
                <p className="text-sm text-gray-600">Build your organized file cabinet 💙</p>
              </div>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Document Type *</label>
                <input
                  type="text"
                  value={newDoc.type}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Insurance, Contract, License"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <input
                  type="text"
                  value={newDoc.category}
                  onChange={(e) => setNewDoc(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Legal, Facility, Staff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Document Name *</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., General Liability Insurance 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload File *</label>
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
              <p className="text-xs text-gray-500 mt-1">For insurance, licenses, leases - we'll remind you before expiration</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-900">
                💡 <strong>Naming tip:</strong> Be specific - "General Liability Insurance 2024-2025 State Farm" is better than "Insurance.pdf"
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
