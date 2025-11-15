import React, { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  TagIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DocumentRepository = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const categories = [
    {
      id: 'legal',
      name: 'Legal & Contracts',
      icon: DocumentCheckIcon,
      color: 'blue',
      count: 12,
      description: 'Leases, contracts, agreements'
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      icon: CurrencyDollarIcon,
      color: 'green',
      count: 24,
      description: 'Statements, invoices, tax records'
    },
    {
      id: 'compliance',
      name: 'Licenses & Compliance',
      icon: ShieldCheckIcon,
      color: 'purple',
      count: 8,
      description: 'State licenses, certifications, permits'
    },
    {
      id: 'accreditation',
      name: 'Accreditation',
      icon: AcademicCapIcon,
      color: 'amber',
      count: 4,
      description: 'Accreditation documents & renewals'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: ShieldCheckIcon,
      color: 'red',
      count: 6,
      description: 'Liability, property, workers comp'
    },
    {
      id: 'facilities',
      name: 'Facilities',
      icon: BuildingOfficeIcon,
      color: 'indigo',
      count: 9,
      description: 'Lease, utilities, maintenance'
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    // Mock documents
    const mockDocs = [
      {
        id: 1,
        name: 'Commercial Lease Agreement',
        category: 'legal',
        subcategory: 'Lease',
        uploadDate: new Date('2023-08-01'),
        expiryDate: new Date('2025-07-31'),
        fileSize: '2.4 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['lease', 'facility', 'critical'],
        requiredFor: ['SBA Loan', 'Insurance', 'Grant Applications'],
        reminderDays: 90,
        notes: 'Original 2-year lease with 5-year option'
      },
      {
        id: 2,
        name: 'General Liability Insurance Policy',
        category: 'insurance',
        subcategory: 'Liability',
        uploadDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-14'),
        fileSize: '1.8 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['insurance', 'liability', 'critical'],
        requiredFor: ['Loan Applications', 'State Compliance'],
        reminderDays: 45,
        notes: '$2M coverage, renewal quote received'
      },
      {
        id: 3,
        name: 'State Operating License',
        category: 'compliance',
        subcategory: 'License',
        uploadDate: new Date('2023-09-01'),
        expiryDate: new Date('2025-08-31'),
        fileSize: '0.5 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['license', 'state', 'critical'],
        requiredFor: ['Operations', 'Grant Applications'],
        reminderDays: 60,
        notes: 'State Department of Education approval'
      },
      {
        id: 4,
        name: 'Director Background Check',
        category: 'compliance',
        subcategory: 'Background Check',
        uploadDate: new Date('2024-06-01'),
        expiryDate: new Date('2027-05-31'),
        fileSize: '0.3 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['background', 'compliance'],
        requiredFor: ['State Compliance', 'Insurance'],
        reminderDays: 180,
        notes: 'Required for all directors every 3 years'
      },
      {
        id: 5,
        name: 'Fire Safety Certificate',
        category: 'compliance',
        subcategory: 'Safety',
        uploadDate: new Date('2024-03-15'),
        expiryDate: new Date('2025-03-14'),
        fileSize: '0.8 MB',
        fileType: 'PDF',
        status: 'expiring-soon',
        tags: ['fire-safety', 'compliance'],
        requiredFor: ['Operations', 'Insurance'],
        reminderDays: 30,
        notes: 'Annual inspection required'
      },
      {
        id: 6,
        name: 'Workers Compensation Insurance',
        category: 'insurance',
        subcategory: 'Workers Comp',
        uploadDate: new Date('2024-01-01'),
        expiryDate: new Date('2024-12-31'),
        fileSize: '1.2 MB',
        fileType: 'PDF',
        status: 'expiring-soon',
        tags: ['insurance', 'workers-comp', 'critical'],
        requiredFor: ['Payroll', 'State Compliance'],
        reminderDays: 30,
        notes: 'Expires end of year - renewal needed'
      },
      {
        id: 7,
        name: 'Accreditation Self-Study Report',
        category: 'accreditation',
        subcategory: 'Self-Study',
        uploadDate: new Date('2023-11-01'),
        expiryDate: null,
        fileSize: '5.6 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['accreditation', 'cognia'],
        requiredFor: ['Grant Applications'],
        reminderDays: null,
        notes: 'Submitted for Cognia accreditation'
      },
      {
        id: 8,
        name: 'Last Year Tax Return (Form 990)',
        category: 'financial',
        subcategory: 'Tax',
        uploadDate: new Date('2024-04-15'),
        expiryDate: null,
        fileSize: '3.2 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['tax', '990', 'financial'],
        requiredFor: ['Grant Applications', 'Loan Applications'],
        reminderDays: null,
        notes: 'Filed with IRS extension'
      },
      {
        id: 9,
        name: 'Charter School Application',
        category: 'legal',
        subcategory: 'Charter',
        uploadDate: new Date('2023-06-01'),
        expiryDate: new Date('2028-05-31'),
        fileSize: '8.4 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['charter', 'application', 'foundational'],
        requiredFor: ['State Reporting'],
        reminderDays: 365,
        notes: '5-year charter granted'
      },
      {
        id: 10,
        name: 'Property Lease Addendum',
        category: 'facilities',
        subcategory: 'Lease',
        uploadDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-07-31'),
        fileSize: '0.9 MB',
        fileType: 'PDF',
        status: 'active',
        tags: ['lease', 'addendum'],
        requiredFor: ['Lease Package'],
        reminderDays: 90,
        notes: 'Parking space addition'
      }
    ];
    
    setDocuments(mockDocs);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'red', label: 'Expired' };
    if (daysUntilExpiry <= 30) return { status: 'expiring-soon', color: 'red', label: 'Expires in ' + daysUntilExpiry + ' days' };
    if (daysUntilExpiry <= 90) return { status: 'warning', color: 'yellow', label: 'Expires in ' + daysUntilExpiry + ' days' };
    return { status: 'active', color: 'green', label: 'Active' };
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-primary-100 text-primary-700',
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
      indigo: 'bg-primary-100 text-primary-700'
    };
    return colors[color] || colors.blue;
  };

  const expiringDocs = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiry = getExpiryStatus(doc.expiryDate);
    return expiry && (expiry.status === 'expiring-soon' || expiry.status === 'expired');
  });

  const generateLoanPackage = () => {
    toast.success('Generating loan document package...');
    // In production, would collect all docs tagged with 'Loan Applications'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Repository</h1>
          <p className="text-gray-600 mt-1">Organize all your critical business documents</p>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Alerts for Expiring Documents */}
      {expiringDocs.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-2">
                {expiringDocs.length} Document{expiringDocs.length > 1 ? 's' : ''} Expiring Soon
              </h3>
              <div className="space-y-2">
                {expiringDocs.slice(0, 3).map(doc => {
                  const expiry = getExpiryStatus(doc.expiryDate);
                  return (
                    <div key={doc.id} className="text-sm text-red-800">
                      • <strong>{doc.name}</strong> - {expiry.label}
                    </div>
                  );
                })}
              </div>
              {expiringDocs.length > 3 && (
                <div className="text-sm text-red-700 mt-2">
                  + {expiringDocs.length - 3} more expiring
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={generateLoanPackage}
          className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl border-2 border-primary-300 hover:shadow-md transition-all text-left"
        >
          <DocumentCheckIcon className="h-8 w-8 text-blue-600 mb-2" />
          <div className="font-bold text-gray-900">Generate Loan Package</div>
          <div className="text-sm text-gray-600">Collect all docs for loan application</div>
        </button>

        <button
          onClick={() => toast.success('Generating grant package...')}
          className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl border-2 border-primary-300 hover:shadow-md transition-all text-left"
        >
          <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-2" />
          <div className="font-bold text-gray-900">Generate Grant Package</div>
          <div className="text-sm text-gray-600">Prepare docs for grant submission</div>
        </button>

        <button
          onClick={() => toast.success('Checking compliance status...')}
          className="p-4 bg-gradient-to-br from-success-100 to-success-200 rounded-xl border-2 border-success-300 hover:shadow-md transition-all text-left"
        >
          <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
          <div className="font-bold text-gray-900">Compliance Check</div>
          <div className="text-sm text-gray-600">Review all compliance docs</div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Documents ({documents.length})
        </button>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name} ({category.count})</span>
            </button>
          );
        })}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="table-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Document Name</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Upload Date</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Expiry</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Required For</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.map((doc) => {
                const expiryStatus = getExpiryStatus(doc.expiryDate);
                const category = categories.find(c => c.id === doc.category);
                
                return (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.fileType} • {doc.fileSize}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category?.color)}`}>
                        {category?.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {doc.uploadDate.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      {doc.expiryDate ? (
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className={`h-4 w-4 text-${expiryStatus.color}-500`} />
                          <span className="text-sm text-gray-700">
                            {doc.expiryDate.toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No expiry</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.requiredFor.slice(0, 2).map((req, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {req}
                          </span>
                        ))}
                        {doc.requiredFor.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{doc.requiredFor.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {expiryStatus ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          expiryStatus.status === 'expired' ? 'bg-red-100 text-red-700' :
                          expiryStatus.status === 'expiring-soon' ? 'bg-red-100 text-red-700' :
                          expiryStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {expiryStatus.label}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-primary-600 hover:text-primary-700 mr-3">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl p-6 border-2 border-primary-300">
        <h3 className="font-bold text-gray-900 mb-3">📁 Document Repository Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>✓ Automatic Expiry Tracking:</strong> Get reminded 90, 60, and 30 days before documents expire
          </div>
          <div>
            <strong>✓ One-Click Package Generation:</strong> Create loan/grant packages in seconds
          </div>
          <div>
            <strong>✓ Compliance Dashboard:</strong> See all licensing and certification status at a glance
          </div>
          <div>
            <strong>✓ Secure Storage:</strong> Bank-level encryption for sensitive documents
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRepository;

