import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  UserGroupIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import DocumentUploader from './DocumentUploader';
import toast from 'react-hot-toast';

/**
 * Board Management System
 * 
 * For 501(c)(3) Nonprofits and C Corporations
 * Legal requirements:
 * - Board of Directors
 * - Officers (President, Secretary, Treasurer)
 * - Regular meetings with minutes
 * - Bylaws
 * 
 * Features:
 * - Board member directory
 * - Officer tracking
 * - Meeting schedule and minutes
 * - Bylaws storage
 * - Compliance tracking
 */

const BOARD_POSITIONS = [
  'Board Chair/President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Board Member'
];

export default function BoardManagement() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('directory'); // directory, meetings, bylaws
  const [boardMembers, setBoardMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [entityType, setEntityType] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    analytics.trackPageView('board-management');
    
    // Get entity type
    const storedType = localStorage.getItem('entityType') || '501c3';
    setEntityType(storedType);
    
    loadDemoData();
  }, []);

  // Watch for URL changes and update active tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('directory'); // Default tab
    }
  }, [location.search]); // Re-run when URL query changes

  const loadDemoData = () => {
    // Demo board members
    setBoardMembers([
      {
        id: 1,
        firstName: 'Jennifer',
        lastName: 'Anderson',
        position: 'Board Chair/President',
        isOfficer: true,
        email: 'jennifer.a@email.com',
        phone: '555-2001',
        address: '789 Oak St, Sunshine, FL',
        dob: '1978-05-12',
        termStart: '2023-01-15',
        termExpires: '2026-01-15',
        termLength: '3 years',
        canVote: true,
        hasConflictOfInterest: false,
        background: 'Former teacher, 15 years education experience',
        status: 'active'
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Chen',
        position: 'Treasurer',
        isOfficer: true,
        email: 'michael.c@email.com',
        phone: '555-2002',
        address: '123 Pine Rd, Sunshine, FL',
        dob: '1982-08-22',
        termStart: '2023-01-15',
        termExpires: '2026-01-15',
        termLength: '3 years',
        canVote: true,
        hasConflictOfInterest: false,
        background: 'CPA, financial planning experience',
        status: 'active'
      },
      {
        id: 3,
        firstName: 'Sarah',
        lastName: 'Williams',
        position: 'Secretary',
        isOfficer: true,
        email: 'sarah.w@email.com',
        phone: '555-2003',
        address: '456 Elm Ave, Sunshine, FL',
        dob: '1985-03-18',
        termStart: '2023-01-15',
        termExpires: '2026-01-15',
        termLength: '3 years',
        canVote: true,
        hasConflictOfInterest: false,
        background: 'Attorney, nonprofit governance expert',
        status: 'active'
      },
      {
        id: 4,
        firstName: 'David',
        lastName: 'Martinez',
        position: 'Board Member',
        isOfficer: false,
        email: 'david.m@email.com',
        phone: '555-2004',
        address: '321 Maple Dr, Sunshine, FL',
        dob: '1975-11-30',
        termStart: '2024-01-15',
        termExpires: '2027-01-15',
        termLength: '3 years',
        canVote: true,
        hasConflictOfInterest: false,
        background: 'Parent, local business owner',
        status: 'active'
      },
      {
        id: 5,
        firstName: 'Lisa',
        lastName: 'Thompson',
        position: 'Board Member',
        isOfficer: false,
        email: 'lisa.t@email.com',
        phone: '555-2005',
        address: '654 Cedar Ln, Sunshine, FL',
        dob: '1980-07-25',
        termStart: '2024-01-15',
        termExpires: '2027-01-15',
        termLength: '3 years',
        canVote: true,
        hasConflictOfInterest: false,
        background: 'Community leader, fundraising experience',
        status: 'active'
      }
    ]);

    // Demo meetings
    setMeetings([
      {
        id: 1,
        date: '2024-09-15',
        type: 'Regular Board Meeting',
        time: '6:00 PM',
        location: 'School Library',
        agendaUploaded: true,
        minutesUploaded: true,
        quorumMet: true,
        attendees: [1, 2, 3, 4, 5], // All 5 members
        decisions: ['Approved 2024-25 budget', 'Voted on facility expansion'],
        nextMeeting: '2024-10-20'
      },
      {
        id: 2,
        date: '2024-06-15',
        type: 'Annual Meeting',
        time: '6:00 PM',
        location: 'School Library',
        agendaUploaded: true,
        minutesUploaded: true,
        quorumMet: true,
        attendees: [1, 2, 3, 4, 5],
        decisions: ['Elected officers for 2024-25', 'Approved annual report'],
        nextMeeting: null
      },
      {
        id: 3,
        date: '2024-10-20',
        type: 'Regular Board Meeting',
        time: '6:00 PM',
        location: 'School Library',
        agendaUploaded: false,
        minutesUploaded: false,
        quorumMet: null,
        attendees: [],
        decisions: [],
        nextMeeting: '2024-11-17',
        isUpcoming: true
      }
    ]);
  };

  const officers = boardMembers.filter(m => m.isOfficer);
  const regularMembers = boardMembers.filter(m => !m.isOfficer);
  const upcomingExpiring = boardMembers.filter(m => {
    const expiresDate = new Date(m.termExpires);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiresDate <= sixMonthsFromNow;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ScaleIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Board Governance</h1>
              <p className="text-gray-600">
                {entityType === '501c3' ? '501(c)(3) ' : 'C Corporation '}Board Management
              </p>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Board Member
          </button>
        </div>
      </div>

      {/* Compliance Alert */}
      {upcomingExpiring.length > 0 && (
        <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-orange-900 mb-1">
                Board Terms Expiring Soon
              </div>
              <div className="text-sm text-orange-800">
                {upcomingExpiring.length} board member{upcomingExpiring.length !== 1 ? 's' : ''} have terms expiring in the next 6 months.
                Plan for re-election or recruitment.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Board Members</div>
          <div className="text-3xl font-bold text-gray-900">{boardMembers.length}</div>
          <div className="text-xs text-gray-500 mt-1">{officers.length} officers</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Meetings This Year</div>
          <div className="text-3xl font-bold text-blue-600">
            {meetings.filter(m => !m.isUpcoming).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Quarterly schedule</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Next Meeting</div>
          <div className="text-lg font-bold text-primary-600">Oct 20</div>
          <div className="text-xs text-gray-500 mt-1">21 days away</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Compliance</div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <span className="text-lg font-bold text-green-600">Good</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">All requirements met</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'directory'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserGroupIcon className="h-5 w-5 inline mr-2" />
            Board Directory
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'meetings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon className="h-5 w-5 inline mr-2" />
            Meetings & Minutes
          </button>
          <button
            onClick={() => setActiveTab('bylaws')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bylaws'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 inline mr-2" />
            Bylaws & Policies
          </button>
        </nav>
      </div>

      {/* Board Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Officers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Officers</h3>
            <div className="bg-white rounded-lg shadow">
              <div className="table-scroll">
                <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {officers.map(member => {
                    const daysUntilExpiry = Math.floor((new Date(member.termExpires) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{member.background}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                            {member.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div>{member.email}</div>
                          <div className="text-gray-500">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div>{member.termStart} to {member.termExpires}</div>
                          <div className={`text-xs ${daysUntilExpiry < 180 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {daysUntilExpiry < 180 ? `Expires in ${daysUntilExpiry} days` : member.termLength}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Regular Board Members */}
          {regularMembers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Board Members</h3>
              <div className="bg-white rounded-lg shadow">
                <div className="table-scroll">
                  <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {regularMembers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{member.background}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div>{member.email}</div>
                          <div className="text-gray-500">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {member.termStart} to {member.termExpires}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Board Meetings</h3>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Schedule Meeting
            </button>
          </div>

          {meetings.map(meeting => (
            <div
              key={meeting.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                meeting.isUpcoming ? 'border-blue-500' : 'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{meeting.type}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {meeting.date} at {meeting.time} • {meeting.location}
                  </div>
                </div>
                {meeting.isUpcoming ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Upcoming
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Completed
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Attendance</div>
                  <div className="font-medium text-gray-900">
                    {meeting.attendees.length}/{boardMembers.length} members
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Quorum</div>
                  <div className={`font-medium ${meeting.quorumMet ? 'text-green-600' : 'text-gray-400'}`}>
                    {meeting.quorumMet === null ? 'TBD' : meeting.quorumMet ? 'Met ✓' : 'Not Met'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Agenda</div>
                  <div className={`font-medium ${meeting.agendaUploaded ? 'text-green-600' : 'text-orange-600'}`}>
                    {meeting.agendaUploaded ? 'Uploaded ✓' : 'Needed'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Minutes</div>
                  <div className={`font-medium ${meeting.minutesUploaded ? 'text-green-600' : 'text-orange-600'}`}>
                    {meeting.minutesUploaded ? 'Filed ✓' : 'Needed'}
                  </div>
                </div>
              </div>

              {meeting.decisions.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-gray-700 mb-2">Decisions:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meeting.decisions.map((decision, idx) => (
                      <li key={idx}>• {decision}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {!meeting.isUpcoming && (
                  <>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      View Agenda
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      View Minutes
                    </button>
                  </>
                )}
                {meeting.isUpcoming && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Upload Agenda
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bylaws Tab */}
      {activeTab === 'bylaws' && (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Corporate Bylaws</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowAIGenerator(true);
                    setUploadingDocType('Bylaws');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  ✨ Generate with AI
                </button>
                <button 
                  onClick={() => {
                    setShowUploader(true);
                    setUploadingDocType('Bylaws');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <CloudArrowUpIcon className="h-4 w-4" />
                  Upload
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between py-2 border-b">
                <span>Adopted Date:</span>
                <span className="font-medium text-gray-900">January 15, 2023</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Last Amended:</span>
                <span className="font-medium text-gray-900">June 15, 2024</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Version:</span>
                <span className="font-medium text-gray-900">2.0</span>
              </div>
            </div>
          </div>

          {/* Key Governance Policies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Governance Policies</h3>
            <div className="space-y-3">
              {[
                { name: 'Conflict of Interest Policy', status: 'current', updated: '2024-01-15' },
                { name: 'Whistleblower Policy', status: 'current', updated: '2024-01-15' },
                { name: 'Document Retention Policy', status: 'current', updated: '2024-01-15' },
                { name: 'Executive Compensation Policy', status: 'current', updated: '2024-01-15' }
              ].map((policy, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{policy.name}</div>
                    <div className="text-xs text-gray-500">Last updated: {policy.updated}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary-600 hover:text-primary-800">
                      View
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <DocumentUploader
              documentType={uploadingDocType}
              onUpload={(doc) => {
                toast.success(`${uploadingDocType} uploaded successfully!`);
                setShowUploader(false);
              }}
              onCancel={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}

      {/* AI Document Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-600 rounded-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Document Generator</h2>
                    <p className="text-gray-600">Generate {uploadingDocType} customized for your school</p>
                  </div>
                </div>
                <button onClick={() => setShowAIGenerator(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6 bg-primary-50 border border-primary-300 rounded-lg p-6">
                <h3 className="font-semibold text-primary-900 mb-3">How AI Generation Works:</h3>
                <ol className="text-sm text-primary-800 space-y-2">
                  <li>1. AI pulls your school info (name, entity type, state, board members)</li>
                  <li>2. Generates professional {uploadingDocType} following legal best practices</li>
                  <li>3. You review and customize (add school-specific policies)</li>
                  <li>4. Download as Word or PDF</li>
                  <li>5. Have attorney review (recommended)</li>
                </ol>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Legal Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Sunshine Microschool, Inc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State of Incorporation
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>Florida</option>
                    <option>California</option>
                    <option>Texas</option>
                    <option>New York</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Board Members
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIGenerator(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Generating ' + uploadingDocType + ' with AI... This takes 30 seconds.');
                    setTimeout(() => {
                      toast.success(uploadingDocType + ' generated! Ready to review and download.');
                      setShowAIGenerator(false);
                    }, 2000);
                  }}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  ✨ Generate {uploadingDocType} with AI
                </button>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-900">
                  <strong>⚖️ Legal Disclaimer:</strong> AI-generated documents should be reviewed by a licensed attorney before use. 
                  SchoolStack provides templates for convenience, not legal advice.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

