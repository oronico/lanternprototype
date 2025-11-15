import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  SparklesIcon,
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BeakerIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: 'Sunshine Microschool',
    state: 'Florida',
    gradeRange: 'K-8',
    studentCount: 28,
    operatingYears: 2
  });
  const [customization, setCustomization] = useState({});
  const [activeTab, setActiveTab] = useState('generate');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewType, setReviewType] = useState('legal');
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await aiAPI.getTemplates();
      setTemplates(response.data.templates);
    } catch (error) {
      toast.error('Failed to load document templates');
    }
  };

  const generateDocument = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a document template');
      return;
    }

    setGenerating(true);
    try {
      const response = await aiAPI.generateDocument(
        selectedTemplate,
        schoolInfo,
        customization,
        ''
      );
      
      setGeneratedDocument(response.data);
      toast.success('Document generated successfully!');
    } catch (error) {
      toast.error('Failed to generate document');
    } finally {
      setGenerating(false);
    }
  };

  const reviewDocument = async () => {
    if (!reviewContent.trim()) {
      toast.error('Please provide document content to review');
      return;
    }

    setReviewing(true);
    try {
      const response = await aiAPI.reviewDocument(
        reviewContent,
        reviewType,
        []
      );
      
      setReviewResult(response.data);
      toast.success('Document review completed!');
    } catch (error) {
      toast.error('Failed to review document');
    } finally {
      setReviewing(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      governance: DocumentCheckIcon,
      operations: BuildingOfficeIcon,
      legal: ShieldCheckIcon,
      marketing: SparklesIcon,
      financial: DocumentTextIcon,
      facility: BuildingOfficeIcon,
      compliance: ShieldCheckIcon,
      hr: UserGroupIcon,
      safety: ExclamationTriangleIcon
    };
    return icons[category] || DocumentTextIcon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      governance: 'text-primary-600 bg-primary-100',
      operations: 'text-blue-600 bg-blue-100', 
      legal: 'text-red-600 bg-red-100',
      marketing: 'text-green-600 bg-green-100',
      financial: 'text-yellow-600 bg-yellow-100',
      facility: 'text-primary-600 bg-primary-100',
      compliance: 'text-orange-600 bg-orange-100'
    };
    return colors[category] || 'text-gray-600 bg-gray-100';
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[complexity] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'text-green-700 bg-green-100 border-success-300',
      medium: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      high: 'text-red-700 bg-red-100 border-red-200'
    };
    return colors[severity] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Generate and review essential documents for your microschool</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-purple-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generate Documents
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'review'
                  ? 'border-purple-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Review Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Generate Documents Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Business Document Generator</h3>
              <p className="text-sm text-gray-600 mb-6">Choose from 20+ professional document templates organized by business function</p>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['governance', 'operations', 'legal', 'marketing', 'financial', 'facility', 'compliance'].map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)} border-opacity-50`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Group templates by category */}
              {Object.entries(
                Object.entries(templates).reduce((acc, [key, template]) => {
                  if (!acc[template.category]) acc[template.category] = [];
                  acc[template.category].push([key, template]);
                  return acc;
                }, {})
              ).map(([category, categoryTemplates]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    {React.createElement(getCategoryIcon(category), { className: 'h-4 w-4 mr-2' })}
                    {category.charAt(0).toUpperCase() + category.slice(1)} Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryTemplates.map(([key, template]) => {
                      const IconComponent = getCategoryIcon(template.category);
                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedTemplate(key)}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === key
                              ? 'border-purple-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900">{template.name}</h5>
                              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                                  {template.complexity}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {template.estimatedTime}
                                </span>
                              </div>
                              {template.tags && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="inline-block bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* School Information */}
            <div className="bg-white rounded-lg shadow card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={schoolInfo.schoolName}
                    onChange={(e) => setSchoolInfo({...schoolInfo, schoolName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={schoolInfo.state}
                    onChange={(e) => setSchoolInfo({...schoolInfo, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Range</label>
                  <input
                    type="text"
                    value={schoolInfo.gradeRange}
                    onChange={(e) => setSchoolInfo({...schoolInfo, gradeRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Count</label>
                  <input
                    type="number"
                    value={schoolInfo.studentCount}
                    onChange={(e) => setSchoolInfo({...schoolInfo, studentCount: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Template-specific Customization */}
            {selectedTemplate && templates[selectedTemplate] && (
              <div className="bg-white rounded-lg shadow card-shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Customization for {templates[selectedTemplate].name}
                </h3>
                <div className="space-y-4">
                  {templates[selectedTemplate].requirements?.map((req, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{req}</label>
                      <input
                        type="text"
                        onChange={(e) => setCustomization({...customization, [req]: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Enter ${req.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateDocument}
                disabled={!selectedTemplate || generating}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <BeakerIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-3 h-5 w-5" />
                    Generate Document
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Document Preview */}
          <div className="space-y-6">
            {generatedDocument ? (
              <div className="bg-white rounded-lg shadow card-shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generated Document</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Complete
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Word Count:</span> {generatedDocument.metadata?.wordCount}
                    </div>
                    <div>
                      <span className="font-medium">Read Time:</span> {generatedDocument.metadata?.estimatedReadTime}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedDocument.content}
                    </pre>
                  </div>
                </div>

                {generatedDocument.recommendations && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {generatedDocument.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRightIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                    Download PDF
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700">
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow card-shadow p-6">
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No Document Generated</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Select a template and provide school information to generate a document.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Documents Tab */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Type</label>
                <select
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="legal">Legal Review</option>
                  <option value="policy">Policy Review</option>
                  <option value="financial">Financial Review</option>
                  <option value="safety">Safety Review</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Content
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Paste your document content here for AI review..."
                />
              </div>

              <button
                onClick={reviewDocument}
                disabled={!reviewContent.trim() || reviewing}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewing ? (
                  <>
                    <BeakerIcon className="animate-spin -ml-1 mr-3 h-4 w-4" />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <DocumentCheckIcon className="-ml-1 mr-3 h-4 w-4" />
                    Review Document
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Review Results */}
          <div className="space-y-6">
            {reviewResult ? (
              <>
                <div className="bg-white rounded-lg shadow card-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Review Results</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {reviewResult.review.overallScore}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/100</span>
                    </div>
                  </div>

                  {reviewResult.review.issues && reviewResult.review.issues.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {reviewResult.review.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                          >
                            <div className="flex items-start">
                              <ExclamationTriangleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{issue.section}</div>
                                <div className="text-sm mt-1">{issue.description}</div>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reviewResult.review.suggestions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Suggestions</h4>
                      <ul className="space-y-2">
                        {reviewResult.review.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {reviewResult.nextActions && (
                  <div className="bg-white rounded-lg shadow card-shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Actions</h3>
                    <ol className="space-y-2">
                      {reviewResult.nextActions.map((action, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                            {index + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow card-shadow p-6">
                <div className="text-center py-12">
                  <DocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No Review Results</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Submit a document for AI-powered review and analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
