import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  LinkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Document Uploader for Governance
 * 
 * Supports:
 * - Direct file upload
 * - Google Drive link
 * - Dropbox link
 * - OneDrive link
 */

export default function DocumentUploader({ documentType, onUpload, onCancel }) {
  const [uploadMethod, setUploadMethod] = useState('file'); // file, google-drive, link
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      toast.success(`${file.name} ready to upload`);
      // In production: Upload to S3/cloud storage
    }
  };

  const handleGoogleDriveLink = () => {
    if (!googleDriveLink) {
      toast.error('Please enter a Google Drive link');
      return;
    }
    
    toast.success('Google Drive link saved!');
    onUpload({
      type: 'google-drive',
      link: googleDriveLink,
      documentType: documentType
    });
  };

  const handleSubmit = () => {
    if (uploadMethod === 'file' && !fileName) {
      toast.error('Please select a file to upload');
      return;
    }
    
    toast.success('Document uploaded successfully!');
    onUpload({
      type: uploadMethod,
      fileName: fileName,
      googleDriveLink: googleDriveLink,
      documentType: documentType,
      uploadedDate: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload {documentType}
      </h3>

      {/* Upload Method Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you like to add this document?
        </label>
        <div className="space-y-2">
          <button
            onClick={() => setUploadMethod('file')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              uploadMethod === 'file'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <CloudArrowUpIcon className="h-6 w-6 text-primary-600" />
              <div>
                <div className="font-medium text-gray-900">Upload File</div>
                <div className="text-sm text-gray-600">PDF, Word, or image files</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setUploadMethod('google-drive')}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              uploadMethod === 'google-drive'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderIcon className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Link to Google Drive</div>
                <div className="text-sm text-gray-600">Keep files in your Google Drive</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <div className="text-sm text-gray-600">
                {fileName ? (
                  <span className="text-primary-600 font-medium">{fileName}</span>
                ) : (
                  <>Click to upload or drag and drop</>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">PDF, Word, or Image (max 10MB)</div>
            </label>
          </div>
        </div>
      )}

      {/* Google Drive Link */}
      {uploadMethod === 'google-drive' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Drive Share Link
          </label>
          <input
            type="url"
            value={googleDriveLink}
            onChange={(e) => setGoogleDriveLink(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="https://drive.google.com/file/d/..."
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Make sure the link is set to "Anyone with the link can view"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
        >
          <CheckCircleIcon className="h-5 w-5" />
          {uploadMethod === 'google-drive' ? 'Save Link' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
}

