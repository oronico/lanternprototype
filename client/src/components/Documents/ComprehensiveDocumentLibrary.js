import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  SparklesIcon,
  FireIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Comprehensive Document Library
 * 
 * Single page for ALL school documents with:
 * - Smart naming conventions (auto-suggested)
 * - Checklist-driven (ensures nothing missed)
 * - Entity-aware (shows what you need based on LLC/Nonprofit/Corp)
 * - Coaching nudges (Hank guides you)
 * - Gamification (completion streaks, progress bars)
 * - Auto-categorization
 * - Expiration tracking (insurance, lease, etc.)
 */

const DOCUMENT_CATEGORIES = {
  // Legal & Formation
  formation: {
    name: 'Legal Formation',
    color: 'blue',
    icon: '⚖️',
    required: true,
    items: [
      { id: 'articles', name: 'Articles of Incorporation/Organization', entityTypes: ['all'], expires: false, namingFormat: 'Articles_[EntityName]_[Year].pdf' },
      { id: 'bylaws', name: 'Bylaws (Nonprofit) or Operating Agreement (LLC)', entityTypes: ['501c3', 'llc-partnership'], expires: false, namingFormat: 'Bylaws_[EntityName]_[Date].pdf' },
      { id: 'ein_letter', name: 'EIN Confirmation Letter from IRS', entityTypes: ['all'], expires: false, namingFormat: 'EIN_Letter_[EIN].pdf' },
      { id: '501c3_determination', name: '501(c)(3) Determination Letter', entityTypes: ['501c3'], expires: false, namingFormat: '501c3_Determination_[EntityName].pdf' },
      { id: 'business_license', name: 'Business Operating License', entityTypes: ['all'], expires: true, namingFormat: 'Business_License_[City]_[Year].pdf' },
      { id: 'state_registration', name: 'State Business Registration', entityTypes: ['all'], expires: true, namingFormat: 'State_Registration_[State]_[Year].pdf' }
    ]
  },

  // Governance (Nonprofits & Corps)
  governance: {
    name: 'Governance & Board',
    color: 'purple',
    icon: '🏛️',
    required: true,
    entityTypes: ['501c3', 'ccorp'],
    items: [
      { id: 'board_resolutions', name: 'Board Resolutions', entityTypes: ['501c3', 'ccorp'], expires: false, namingFormat: 'Board_Resolution_[Topic]_[Date].pdf', multiple: true },
      { id: 'meeting_minutes', name: 'Board Meeting Minutes', entityTypes: ['501c3', 'ccorp'], expires: false, namingFormat: 'Board_Minutes_[Date].pdf', multiple: true },
      { id: 'conflict_policy', name: 'Conflict of Interest Policy', entityTypes: ['501c3'], expires: false, namingFormat: 'Conflict_Policy_[Year].pdf' },
      { id: 'board_roster', name: 'Current Board Roster', entityTypes: ['501c3', 'ccorp'], expires: false, namingFormat: 'Board_Roster_[Year].pdf' }
    ]
  },

  // Facility
  facility: {
    name: 'Facility & Property',
    color: 'orange',
    icon: '🏢',
    required: true,
    items: [
      { id: 'lease', name: 'Lease Agreement', entityTypes: ['all'], expires: true, namingFormat: 'Lease_[Address]_[StartDate]_to_[EndDate].pdf' },
      { id: 'fire_inspection', name: 'Fire Inspection Certificate', entityTypes: ['all'], expires: true, namingFormat: 'Fire_Inspection_[Date].pdf' },
      { id: 'occupancy_permit', name: 'Certificate of Occupancy', entityTypes: ['all'], expires: false, namingFormat: 'Occupancy_Permit_[Address].pdf' },
      { id: 'zoning_approval', name: 'Zoning Approval (if required)', entityTypes: ['all'], expires: false, namingFormat: 'Zoning_Approval_[Address]_[Date].pdf' }
    ]
  },

  // Insurance
  insurance: {
    name: 'Insurance',
    color: 'red',
    icon: '🛡️',
    required: true,
    items: [
      { id: 'general_liability', name: 'General Liability Insurance', entityTypes: ['all'], expires: true, urgent: true, namingFormat: 'GL_Insurance_[Year]_[Carrier].pdf' },
      { id: 'professional_liability', name: 'Professional Liability (E&O)', entityTypes: ['all'], expires: true, urgent: true, namingFormat: 'Professional_Liability_[Year]_[Carrier].pdf' },
      { id: 'workers_comp', name: 'Workers Compensation Insurance', entityTypes: ['all'], expires: true, urgent: true, namingFormat: 'Workers_Comp_[Year]_[Carrier].pdf' },
      { id: 'property_insurance', name: 'Property Insurance', entityTypes: ['all'], expires: true, namingFormat: 'Property_Insurance_[Year]_[Carrier].pdf' },
      { id: 'directors_officers', name: 'Directors & Officers Insurance (D&O)', entityTypes: ['501c3', 'ccorp'], expires: true, namingFormat: 'DO_Insurance_[Year]_[Carrier].pdf' }
    ]
  },

  // Student Contracts
  students: {
    name: 'Student Enrollment',
    color: 'green',
    icon: '📝',
    required: true,
    items: [
      { id: 'enrollment_contracts', name: 'Signed Enrollment Contracts', entityTypes: ['all'], expires: false, namingFormat: 'Enrollment_Contract_[FamilyName]_[Year].pdf', multiple: true },
      { id: 'handbook', name: 'Family Handbook (Signed)', entityTypes: ['all'], expires: false, namingFormat: 'Handbook_Signed_[FamilyName]_[Year].pdf', multiple: true },
      { id: 'emergency_forms', name: 'Emergency Contact Forms', entityTypes: ['all'], expires: false, namingFormat: 'Emergency_[StudentName]_[Year].pdf', multiple: true },
      { id: 'medical_forms', name: 'Medical Release Forms', entityTypes: ['all'], expires: false, namingFormat: 'Medical_Release_[StudentName]_[Year].pdf', multiple: true },
      { id: 'master_handbook', name: 'Master Family Handbook (Unsigned)', entityTypes: ['all'], expires: false, namingFormat: 'Master_Handbook_[Year]_v[Version].pdf' }
    ]
  },

  // Staff & Payroll
  staff: {
    name: 'Staff & Payroll',
    color: 'indigo',
    icon: '👥',
    required: true,
    items: [
      { id: 'w2_forms', name: 'W-2 Forms (Full-Time Employees)', entityTypes: ['all'], expires: false, namingFormat: 'W2_[EmployeeName]_[Year].pdf', multiple: true },
      { id: '1099_forms', name: '1099-NEC Forms (Contractors)', entityTypes: ['all'], expires: false, namingFormat: '1099_[ContractorName]_[Year].pdf', multiple: true },
      { id: 'background_checks', name: 'Background Checks', entityTypes: ['all'], expires: true, namingFormat: 'Background_Check_[StaffName]_[Date].pdf', multiple: true },
      { id: 'employment_agreements', name: 'Employment Agreements', entityTypes: ['all'], expires: false, namingFormat: 'Employment_Agreement_[StaffName]_[Date].pdf', multiple: true },
      { id: 'staff_handbook', name: 'Staff Handbook', entityTypes: ['all'], expires: false, namingFormat: 'Staff_Handbook_[Year]_v[Version].pdf' }
    ]
  },

  // Tax & Financial
  tax: {
    name: 'Tax Returns & Filings',
    color: 'teal',
    icon: '📊',
    required: true,
    items: [
      { id: 'form_990', name: 'Form 990 (Nonprofit)', entityTypes: ['501c3'], expires: false, namingFormat: 'Form_990_[Year]_[EntityName].pdf', multiple: true },
      { id: 'form_1120s', name: 'Form 1120-S (S Corp)', entityTypes: ['scorp'], expires: false, namingFormat: 'Form_1120S_[Year]_[EntityName].pdf', multiple: true },
      { id: 'form_1120', name: 'Form 1120 (C Corp)', entityTypes: ['ccorp'], expires: false, namingFormat: 'Form_1120_[Year]_[EntityName].pdf', multiple: true },
      { id: 'form_1065', name: 'Form 1065 (Partnership)', entityTypes: ['llc-partnership'], expires: false, namingFormat: 'Form_1065_[Year]_[EntityName].pdf', multiple: true },
      { id: 'state_tax', name: 'State Tax Returns', entityTypes: ['all'], expires: false, namingFormat: 'State_Tax_Return_[State]_[Year].pdf', multiple: true }
    ]
  },

  // Accreditation & Compliance
  compliance: {
    name: 'Accreditation & Compliance',
    color: 'yellow',
    icon: '✓',
    required: false,
    items: [
      { id: 'accreditation', name: 'Accreditation Certificate', entityTypes: ['all'], expires: true, namingFormat: 'Accreditation_[Organization]_[Year].pdf' },
      { id: 'state_reporting', name: 'State Compliance Reports', entityTypes: ['all'], expires: false, namingFormat: 'State_Report_[Type]_[Year].pdf', multiple: true },
      { id: 'ferpa_policy', name: 'FERPA Compliance Policy', entityTypes: ['all'], expires: false, namingFormat: 'FERPA_Policy_[Year].pdf' }
    ]
  }
};

export default function ComprehensiveDocumentLibrary() {
  const [entityType, setEntityType] = useState('llc-single');
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [completionStreak, setCompletionStreak] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('entityType') || 'llc-single';
      setEntityType(stored);
      loadDocuments();
      calculateCompletionStreak();
    }
  }, []);

  const loadDocuments = () => {
    // Load from localStorage or API
    const stored = localStorage.getItem('documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
  };

  const calculateCompletionStreak = () => {
    // Calculate how many days in a row user has uploaded/updated docs
    setCompletionStreak(7); // Demo
  };

  const getRequiredDocuments = () => {
    const required = [];
    Object.entries(DOCUMENT_CATEGORIES).forEach(([catKey, category]) => {
      // Filter by entity type
      if (category.entityTypes && !category.entityTypes.includes(entityType)) return;
      
      category.items.forEach(item => {
        if (item.entityTypes.includes('all') || item.entityTypes.includes(entityType)) {
          required.push({
            ...item,
            category: catKey,
            categoryName: category.name,
            uploaded: documents.some(d => d.templateId === item.id)
          });
        }
      });
    });
    return required;
  };

  const getMissingDocuments = () => {
    return getRequiredDocuments().filter(doc => !doc.uploaded);
  };

  const getExpiringDocuments = () => {
    return documents.filter(doc => {
      if (!doc.expirationDate) return false;
      const daysUntil = Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 60 && daysUntil >= 0;
    });
  };

  const handleUpload = (template) => {
    setUploadingFor(template);
    setShowUploadModal(true);
  };

  const handleFileUpload = (file, metadata) => {
    // In production, would upload to cloud storage (Google Drive, S3, etc.)
    const newDoc = {
      id: Date.now().toString(),
      templateId: uploadingFor.id,
      fileName: file.name,
      suggestedName: generateFileName(uploadingFor, metadata),
      category: uploadingFor.category,
      uploadedDate: new Date().toISOString(),
      expirationDate: uploadingFor.expires ? metadata.expirationDate : null,
      ...metadata
    };

    setDocuments(prev => [...prev, newDoc]);
    localStorage.setItem('documents', JSON.stringify([...documents, newDoc]));
    
    setShowUploadModal(false);
    setUploadingFor(null);
    
    toast.success(`✅ ${uploadingFor.name} uploaded!`);
    
    // Check if this completes a category
    checkCategoryCompletion(uploadingFor.category);
  };

  const generateFileName = (template, metadata) => {
    let name = template.namingFormat;
    name = name.replace('[EntityName]', metadata.entityName || 'School');
    name = name.replace('[Year]', metadata.year || new Date().getFullYear());
    name = name.replace('[Date]', metadata.date || new Date().toISOString().split('T')[0]);
    name = name.replace('[FamilyName]', metadata.familyName || 'Family');
    name = name.replace('[StudentName]', metadata.studentName || 'Student');
    name = name.replace('[EmployeeName]', metadata.employeeName || 'Employee');
    name = name.replace('[ContractorName]', metadata.contractorName || 'Contractor');
    name = name.replace('[Version]', metadata.version || '1');
    return name;
  };

  const checkCategoryCompletion = (categoryKey) => {
    const category = DOCUMENT_CATEGORIES[categoryKey];
    const categoryDocs = category.items.filter(item => 
      item.entityTypes.includes('all') || item.entityTypes.includes(entityType)
    );
    const uploaded = categoryDocs.filter(item => 
      documents.some(d => d.templateId === item.id)
    );
    
    if (uploaded.length === categoryDocs.length) {
      toast.success(`🎉 ${category.name} complete! You're crushing it!`, { duration: 4000 });
    }
  };

  const requiredDocs = getRequiredDocuments();
  const missingDocs = getMissingDocuments();
  const expiringDocs = getExpiringDocuments();
  const completionPercent = requiredDocs.length > 0 
    ? Math.round((requiredDocs.filter(d => d.uploaded).length / requiredDocs.length) * 100)
    : 0;

  // Filter categories by entity type
  const availableCategories = Object.entries(DOCUMENT_CATEGORIES).filter(([key, cat]) => {
    if (cat.entityTypes && !cat.entityTypes.includes(entityType) && !cat.entityTypes.includes('all')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <FolderIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold">Document Library</h1>
            <p className="text-gray-600">Everything that documents your school's health & operations</p>
          </div>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      {/* Gamification & Coaching */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion Progress */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-primary-100 mb-2">Document Completion</div>
          <div className="text-4xl font-bold mb-3">{completionPercent}%</div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
          <div className="text-xs text-primary-100">
            {requiredDocs.filter(d => d.uploaded).length} of {requiredDocs.length} required docs
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-white/80 mb-2">Update Streak</div>
          <div className="flex items-center gap-2">
            <FireIcon className="h-8 w-8" />
            <div className="text-4xl font-bold">{completionStreak}</div>
          </div>
          <div className="text-xs text-white/80 mt-2">days keeping docs current 🔥</div>
        </div>

        {/* Missing Count */}
        <div className={`rounded-2xl p-6 shadow-lg ${
          missingDocs.length === 0
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
        }`}>
          <div className="text-sm text-white/80 mb-2">Missing Documents</div>
          <div className="text-4xl font-bold mb-2">{missingDocs.length}</div>
          <div className="text-xs text-white/80">
            {missingDocs.length === 0 ? 'All caught up! 🎉' : 'Upload to complete'}
          </div>
        </div>
      </div>

      {/* Hank's Coaching Nudge */}
      {missingDocs.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <SparklesIcon className="h-8 w-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hank's Document Coach</h3>
              <p className="text-sm text-purple-900 mb-3">
                💙 You're {missingDocs.length} document{missingDocs.length > 1 ? 's' : ''} away from a complete, lender-ready file! Here's what matters most:
              </p>
              <div className="space-y-2">
                {missingDocs.slice(0, 5).map(doc => (
                  <div key={doc.id} className="flex items-start justify-between p-3 bg-white rounded-lg border border-purple-100">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Suggested name: <span className="font-mono text-purple-700">{doc.namingFormat}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpload(doc)}
                      className="touch-target px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-semibold whitespace-nowrap ml-3"
                    >
                      Upload
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Documents Alert */}
      {expiringDocs.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Documents Expiring Soon</h3>
              <div className="space-y-2">
                {expiringDocs.map(doc => {
                  const daysLeft = Math.ceil((new Date(doc.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={doc.id} className="text-sm text-red-800 flex items-center justify-between">
                      <span>{doc.fileName}</span>
                      <span className="font-semibold">{daysLeft} days left</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCategories.map(([key, category]) => {
          const categoryDocs = category.items.filter(item =>
            item.entityTypes.includes('all') || item.entityTypes.includes(entityType)
          );
          const uploaded = categoryDocs.filter(item =>
            documents.some(d => d.templateId === item.id)
          );
          const isComplete = uploaded.length === categoryDocs.length;

          return (
            <div key={key} className="bg-white rounded-xl shadow border border-gray-200">
              <div className={`bg-${category.color}-50 border-b border-${category.color}-200 px-6 py-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                      <div className="text-xs text-gray-600">{uploaded.length}/{categoryDocs.length} complete</div>
                    </div>
                  </div>
                  {isComplete && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                </div>
              </div>
              <div className="p-4 space-y-2">
                {categoryDocs.map(item => {
                  const isUploaded = documents.some(d => d.templateId === item.id);
                  return (
                    <div key={item.id} className={`p-3 rounded-lg border ${
                      isUploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {!isUploaded && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {item.namingFormat}
                            </div>
                          )}
                        </div>
                        {isUploaded ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <button
                            onClick={() => handleUpload(item)}
                            className="px-2 py-1 bg-primary-600 text-white rounded text-xs font-semibold hover:bg-primary-700 whitespace-nowrap"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          template={uploadingFor}
          entityType={entityType}
          onClose={() => { setShowUploadModal(false); setUploadingFor(null); }}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
}

// Upload Modal with Smart Naming
const UploadModal = ({ template, entityType, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    entityName: 'Sunshine Microschool',
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0],
    expirationDate: '',
    version: '1'
  });

  const suggestedName = template ? template.namingFormat
    .replace('[EntityName]', metadata.entityName)
    .replace('[Year]', metadata.year)
    .replace('[Date]', metadata.date)
    .replace('[Version]', metadata.version)
    : '';

  const handleSubmit = () => {
    if (!file) return toast.error('Please select a file');
    if (template?.expires && !metadata.expirationDate) {
      return toast.error('Please enter expiration date');
    }
    onUpload(file, metadata);
  };

  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upload: {template.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Select File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        {/* Smart Naming */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">📝 Suggested File Name</h3>
          <div className="font-mono text-sm text-purple-700 bg-white p-2 rounded border border-purple-100">
            {suggestedName}
          </div>
          <p className="text-xs text-purple-800 mt-2">
            Hank suggests this naming format for easy organization and lender/auditor readiness.
          </p>
        </div>

        {/* Metadata Fields */}
        {template.namingFormat.includes('[FamilyName]') && (
          <div>
            <label className="block text-sm font-medium mb-1">Family Name</label>
            <input
              type="text"
              value={metadata.familyName}
              onChange={(e) => setMetadata(prev => ({ ...prev, familyName: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {template.namingFormat.includes('[StudentName]') && (
          <div>
            <label className="block text-sm font-medium mb-1">Student Name</label>
            <input
              type="text"
              value={metadata.studentName}
              onChange={(e) => setMetadata(prev => ({ ...prev, studentName: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {template.namingFormat.includes('[EmployeeName]') && (
          <div>
            <label className="block text-sm font-medium mb-1">Employee Name</label>
            <input
              type="text"
              value={metadata.employeeName}
              onChange={(e) => setMetadata(prev => ({ ...prev, employeeName: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* Expiration Date (for insurance, licenses, etc.) */}
        {template.expires && (
          <div>
            <label className="block text-sm font-medium mb-1">Expiration Date *</label>
            <input
              type="date"
              value={metadata.expirationDate}
              onChange={(e) => setMetadata(prev => ({ ...prev, expirationDate: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-600 mt-1">We'll remind you 60 days before expiration</p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

