import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { enrollmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EnrollmentPipeline = () => {
  const [pipeline, setPipeline] = useState(null);
  const [families, setFamilies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedStage, setSelectedStage] = useState('all');
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newFamily, setNewFamily] = useState({
    name: '',
    email: '',
    phone: '',
    children: 1,
    inquirySource: '',
    notes: '',
    esaEligible: false
  });

  useEffect(() => {
    loadEnrollmentData();
  }, []);

  const loadEnrollmentData = async () => {
    try {
      const [pipelineResponse, familiesResponse, analyticsResponse] = await Promise.all([
        enrollmentAPI.getPipeline(),
        enrollmentAPI.getFamilies(),
        enrollmentAPI.getAnalytics()
      ]);
      
      setPipeline(pipelineResponse.data);
      setFamilies(familiesResponse.data.families);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  };

  const handleFamilyAction = async (familyId, actionType, data = {}) => {
    try {
      await enrollmentAPI.executeFamilyAction(familyId, actionType, data);
      toast.success('Action completed successfully');
      loadEnrollmentData();
    } catch (error) {
      toast.error('Failed to execute action');
    }
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    try {
      await enrollmentAPI.addFamily(newFamily);
      toast.success('New family inquiry added successfully');
      setShowAddFamily(false);
      setNewFamily({
        name: '',
        email: '',
        phone: '',
        children: 1,
        inquirySource: '',
        notes: '',
        esaEligible: false
      });
      loadEnrollmentData();
    } catch (error) {
      toast.error('Failed to add family');
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      inquiry: 'bg-blue-100 text-blue-800',
      tour_scheduled: 'bg-primary-100 text-primary-800',
      application_pending: 'bg-yellow-100 text-yellow-800',
      ready_to_enroll: 'bg-green-100 text-green-800',
      current_risk: 'bg-red-100 text-red-800',
      new_inquiry: 'bg-primary-100 text-primary-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getStageIcon = (stage) => {
    const icons = {
      inquiry: UserPlusIcon,
      tour_scheduled: CalendarIcon,
      application_pending: DocumentTextIcon,
      ready_to_enroll: CheckCircleIcon,
      current_risk: ExclamationTriangleIcon,
      new_inquiry: ClockIcon
    };
    const Icon = icons[stage] || ClockIcon;
    return <Icon className="h-4 w-4" />;
  };

  const filteredFamilies = selectedStage === 'all' 
    ? families 
    : families.filter(family => family.stage === selectedStage);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enrollment Pipeline</h1>
              <p className="text-gray-600">Track families from inquiry to enrollment to retention</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddFamily(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Family Inquiry
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pipeline?.pipeline?.inquiries || 12}</div>
              <div className="text-sm text-gray-600">Inquiries</div>
            </div>
            <UserPlusIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
            +3 this week
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pipeline?.pipeline?.toursScheduled || 5}</div>
              <div className="text-sm text-gray-600">Tours Scheduled</div>
            </div>
            <CalendarIcon className="h-8 w-8 text-primary-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            42% conversion rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pipeline?.pipeline?.applications || 3}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-yellow-600">
            Follow up needed!
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pipeline?.pipeline?.readyToEnroll || 2}</div>
              <div className="text-sm text-gray-600">Ready to Enroll</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            $1,166/month value
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pipeline?.pipeline?.currentFamilies || 28}</div>
              <div className="text-sm text-gray-600">Current Families</div>
            </div>
            <UserGroupIcon className="h-8 w-8 text-gray-500" />
          </div>
          <div className="mt-2 text-sm text-red-600">
            <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
            2 at risk
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'border-indigo-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pipeline Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics & Insights
          </button>
        </nav>
      </div>

      {/* Pipeline Management Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Stage Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStage('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  selectedStage === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Families ({families.length})
              </button>
              
              {['inquiry', 'tour_scheduled', 'application_pending', 'ready_to_enroll', 'current_risk'].map(stage => {
                const count = families.filter(f => f.stage === stage).length;
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedStage === stage
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Family List */}
          <div className="bg-white rounded-lg shadow">
            <div className="table-scroll">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Family
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Children
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Step
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFamilies.map((family, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{family.name}</div>
                          <div className="text-sm text-gray-500">
                            Inquired: {new Date(family.inquiryDate).toLocaleDateString()}
                          </div>
                          {family.notes && (
                            <div className="text-xs text-gray-400 mt-1">{family.notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(family.stage)}`}>
                          {getStageIcon(family.stage)}
                          <span className="ml-1">{family.status.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {family.children}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${family.monthlyValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {family.nextStep}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {family.stage === 'inquiry' && (
                            <button
                              onClick={() => handleFamilyAction(family.id, 'schedule_tour')}
                              className="text-primary-600 hover:text-primary-900 font-medium"
                            >
                              Schedule Tour
                            </button>
                          )}
                          {family.stage === 'tour_scheduled' && (
                            <button
                              onClick={() => handleFamilyAction(family.id, 'send_tour_confirmation')}
                              className="text-primary-600 hover:text-primary-900 font-medium"
                            >
                              Send Confirmation
                            </button>
                          )}
                          {family.stage === 'application_pending' && (
                            <button
                              onClick={() => handleFamilyAction(family.id, 'send_followup')}
                              className="text-primary-600 hover:text-primary-900 font-medium"
                            >
                              Follow Up
                            </button>
                          )}
                          {family.stage === 'ready_to_enroll' && (
                            <button
                              onClick={() => handleFamilyAction(family.id, 'generate_contract')}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Generate Contract
                            </button>
                          )}
                          {family.stage === 'current_risk' && (
                            <button
                              onClick={() => handleFamilyAction(family.id, 'schedule_meeting')}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Schedule Meeting
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">42%</div>
                <div className="text-sm text-gray-600">Inquiry → Tour</div>
                <div className="text-xs text-gray-500">Market avg: 60%</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">60%</div>
                <div className="text-sm text-gray-600">Tour → Application</div>
                <div className="text-xs text-green-600">Good!</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">67%</div>
                <div className="text-sm text-gray-600">Application → Enrolled</div>
                <div className="text-xs text-gray-500">Market avg: 80%</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">78%</div>
                <div className="text-sm text-gray-600">Year 1 Retention</div>
                <div className="text-xs text-gray-500">Need 85%+</div>
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {analytics?.monthlyTrends?.map((month, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">{month.month}</div>
                  <div className="text-lg font-bold text-gray-900">{month.inquiries}</div>
                  <div className="text-xs text-gray-500">inquiries</div>
                  <div className="text-lg font-bold text-green-600">{month.enrolled}</div>
                  <div className="text-xs text-gray-500">enrolled</div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Sources</h3>
              <div className="space-y-3">
                {Object.entries(analytics?.sourceAnalysis || {}).map(([source, data]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{source}</div>
                      <div className="text-xs text-gray-500">{data.count} inquiries</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        data.conversionRate >= 0.7 ? 'text-green-600' :
                        data.conversionRate >= 0.5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(data.conversionRate * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Saturday Tours Convert 2x Better</div>
                  <div className="text-sm text-blue-700">Schedule more weekend tours</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">ESA Families: 90% Retention</div>
                  <div className="text-sm text-green-700">Target ESA-eligible families</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-900">Late Payers 3x Likely to Leave</div>
                  <div className="text-sm text-yellow-700">Monitor payment patterns closely</div>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <div className="font-medium text-primary-900">Sibling Families: 2.3x LTV</div>
                  <div className="text-sm text-primary-700">Prioritize multi-child families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Family Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Family Inquiry</h3>
              <form onSubmit={handleAddFamily} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Family Name</label>
                  <input
                    type="text"
                    required
                    value={newFamily.name}
                    onChange={(e) => setNewFamily({...newFamily, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={newFamily.email}
                    onChange={(e) => setNewFamily({...newFamily, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newFamily.phone}
                    onChange={(e) => setNewFamily({...newFamily, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFamily.children}
                    onChange={(e) => setNewFamily({...newFamily, children: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Inquiry Source</label>
                  <select
                    value={newFamily.inquirySource}
                    onChange={(e) => setNewFamily({...newFamily, inquirySource: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select source...</option>
                    <option value="Word of Mouth">Word of Mouth</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Search">Google Search</option>
                    <option value="School Events">School Events</option>
                    <option value="Referrals">Referrals</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newFamily.esaEligible}
                      onChange={(e) => setNewFamily({...newFamily, esaEligible: e.target.checked})}
                      className="rounded border-gray-300 text-primary-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">ESA Eligible</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows="3"
                    value={newFamily.notes}
                    onChange={(e) => setNewFamily({...newFamily, notes: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Add Family
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFamily(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPipeline;
