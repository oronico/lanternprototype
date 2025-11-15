import React, { useState } from 'react';
import {
  XMarkIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  Cog6ToothIcon,
  PencilIcon,
  HeartIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  FireIcon,
  CheckCircleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

/**
 * Microschool Student Snapshot
 * 
 * Simple, practical student view for small schools:
 * - Basic demographics
 * - Attendance tracking
 * - Progress notes (not formal grades)
 * - Parent contacts
 * - Health & allergies
 * - Behavior notes
 * - Documents & compliance
 * - Payment status
 */

export default function StudentSnapshot({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('snapshot'); // snapshot, attendance, progress, health, contacts, documents

  if (!student) return null;

  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
  const primaryGuardian = student.guardians.find(g => g.isPrimary) || student.guardians[0];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="touch-target p-2 hover:bg-primary-500 rounded-lg">
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <div className="text-sm text-primary-100">
              {student.studentInfo.grade} • {student.enrollment.programName} • {student.enrollment.leadTeacher}
            </div>
          </div>
        </div>
        <button className="touch-target px-4 py-2 bg-primary-500 hover:bg-primary-400 rounded-lg text-sm font-medium flex items-center gap-2">
          <PencilIcon className="h-4 w-4" />
          Edit Student
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-300 px-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <Tab active={activeTab === 'snapshot'} onClick={() => setActiveTab('snapshot')} label="Snapshot" />
          <Tab active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Attendance" />
          <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} label="Progress & Learning" />
          <Tab active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="Health & Safety" />
          <Tab active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} label="Family Contacts" />
          <Tab active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} label="Documents" />
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'snapshot' && <SnapshotView student={student} primaryGuardian={primaryGuardian} />}
        {activeTab === 'attendance' && <AttendanceView student={student} />}
        {activeTab === 'progress' && <ProgressView student={student} />}
        {activeTab === 'health' && <HealthView student={student} />}
        {activeTab === 'contacts' && <ContactsView student={student} />}
        {activeTab === 'documents' && <DocumentsView student={student} />}
      </div>
    </div>
  );
}

const Tab = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`touch-target py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
      active ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-600 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

// Snapshot View - Dashboard
const SnapshotView = ({ student, primaryGuardian }) => {
  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Student Card */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-3xl font-bold shadow">
              {student.studentInfo.firstName[0]}{student.studentInfo.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{fullName}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <div>📚 {student.studentInfo.grade} grade</div>
                <div>🎂 Age {student.studentInfo.age}</div>
                <div>👨‍🏫 {student.enrollment.leadTeacher}</div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <QuickStat label="Attendance" value={`${student.attendance.ytdRate}%`} color="green" />
            <QuickStat label="Days Streak" value={student.attendance.currentStreak} color="orange" />
          </div>
        </div>

        {/* Primary Contact */}
        <div className="bg-blue-50 rounded-lg shadow border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserGroupIcon className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Primary Contact</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-medium text-gray-900">{primaryGuardian.firstName} {primaryGuardian.lastName}</div>
            <div className="text-gray-600">{primaryGuardian.relation}</div>
            <div className="flex items-center gap-2 text-gray-700">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              <a href={`tel:${primaryGuardian.phone}`} className="hover:text-primary-600">{primaryGuardian.phone}</a>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${primaryGuardian.email}`} className="hover:text-primary-600 text-xs">{primaryGuardian.email}</a>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Prefers: {primaryGuardian.communicationPreference}
            </div>
          </div>
        </div>

        {/* Health Alerts */}
        {(student.health.allergies.length > 0 || student.health.iep || student.health.section504) && (
          <div className="bg-red-50 rounded-lg shadow border-2 border-red-300 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Health Alerts</h3>
            </div>
            {student.health.allergies.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-bold text-red-900 mb-1">ALLERGIES:</div>
                {student.health.allergies.map((a, i) => (
                  <div key={i} className="px-2 py-1 bg-red-100 border border-red-300 rounded text-red-900 font-semibold text-sm mb-1">
                    {a}
                  </div>
                ))}
                {student.health.emergencyMedicalInfo && (
                  <div className="mt-2 text-xs text-red-800">{student.health.emergencyMedicalInfo}</div>
                )}
              </div>
            )}
            {student.health.iep && (
              <div className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-blue-900 text-sm font-medium mb-1">
                IEP on file
              </div>
            )}
            {student.health.section504 && (
              <div className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-blue-900 text-sm font-medium">
                504 Plan active
              </div>
            )}
          </div>
        )}

        {/* Payment Status */}
        <div className={`rounded-lg shadow border-2 p-4 ${
          student.tuition.paymentStatus === 'current'
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <BanknotesIcon className={`h-5 w-5 ${
              student.tuition.paymentStatus === 'current' ? 'text-green-600' : 'text-red-600'
            }`} />
            <h3 className="font-semibold text-gray-900">Tuition Status</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Tuition</span>
              <span className="font-bold">${student.tuition.finalTuition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{student.tuition.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`font-bold ${
                student.tuition.paymentStatus === 'current' ? 'text-green-600' : 'text-red-600'
              }`}>
                {student.tuition.paymentStatus === 'current' ? 'Current' : 'Past Due'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Payment</span>
              <span className="font-medium">{student.tuition.lastPayment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Attendance Widget */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary-600" />
            Attendance Summary
          </h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <AttendanceStat label="Present" value={student.attendance.ytdPresent} color="green" />
            <AttendanceStat label="Absent" value={student.attendance.ytdAbsent} color="red" />
            <AttendanceStat label="Tardy" value={student.attendance.ytdTardy} color="yellow" />
            <AttendanceStat label="YTD Rate" value={`${student.attendance.ytdRate}%`} color="blue" />
          </div>
          {student.attendance.currentStreak > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <FireIcon className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">
                🔥 {student.attendance.currentStreak} day attendance streak!
              </span>
            </div>
          )}
          {student.attendance.lastAbsence && (
            <div className="mt-3 text-sm text-gray-600">
              Last absence: {student.attendance.lastAbsence}
            </div>
          )}
        </div>

        {/* Progress & Learning */}
        <div className="bg-primary-50 rounded-lg shadow border border-primary-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AcademicCapIcon className="h-5 w-5 text-primary-600" />
            Learning Progress
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <ProgressMetric label="Reading Level" value={student.academic.readingLevel} />
            <ProgressMetric label="Math Level" value={student.academic.mathLevel} />
          </div>
          
          {/* Strengths */}
          {student.academic.strengths.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Strengths</div>
              <div className="flex flex-wrap gap-2">
                {student.academic.strengths.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Growth Areas */}
          {student.academic.areasForGrowth.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Focus Areas</div>
              <div className="space-y-1">
                {student.academic.areasForGrowth.map((a, i) => (
                  <div key={i} className="text-sm text-gray-700">• {a}</div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Notes */}
          {student.personal?.teacherNotes && (
            <div className="mt-4 p-3 bg-white border border-primary-200 rounded">
              <div className="text-xs font-semibold text-primary-900 mb-1">Teacher Notes</div>
              <div className="text-sm text-gray-700">{student.personal.teacherNotes}</div>
            </div>
          )}
        </div>

        {/* Personal & Social */}
        {student.personal && (
          <div className="bg-yellow-50 rounded-lg shadow border border-yellow-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-yellow-600" />
              Personal & Social
            </h3>
            <div className="space-y-3 text-sm">
              {student.personal.favorites && (
                <div>
                  <span className="font-medium text-gray-700">Favorites:</span>
                  <div className="text-gray-700 mt-1">{student.personal.favorites}</div>
                </div>
              )}
              {student.personal.bestFriends && student.personal.bestFriends.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Best Friends:</span>
                  <div className="text-gray-700 mt-1">{student.personal.bestFriends.join(', ')}</div>
                </div>
              )}
              {student.personal.comfortItems && (
                <div>
                  <span className="font-medium text-gray-700">Comfort Items:</span>
                  <div className="text-gray-700 mt-1">{student.personal.comfortItems}</div>
                </div>
              )}
              {student.academic.learningStyle && (
                <div>
                  <span className="font-medium text-gray-700">Learning Style:</span>
                  <div className="text-gray-700 mt-1">{student.academic.learningStyle}</div>
                </div>
              )}
              {student.academic.behaviorNotes && (
                <div>
                  <span className="font-medium text-gray-700">Behavior Notes:</span>
                  <div className="text-gray-700 mt-1">{student.academic.behaviorNotes}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Compliance */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            Documents & Compliance
          </h3>
          <div className="space-y-2">
            <DocumentStatus label="Enrollment Contract" complete={student.documents.enrollmentContractSigned} date={student.documents.enrollmentContractSignedDate} />
            <DocumentStatus label="Family Handbook" complete={student.documents.handbookSigned} date={student.documents.handbookSignedDate} />
            <DocumentStatus label="Emergency Contact Form" complete={student.documents.emergencyContactFormComplete} />
            <DocumentStatus label="Medical Release" complete={student.documents.medicalReleaseForm} />
            <DocumentStatus label="Photo Release" complete={student.documents.photoReleaseForm} />
          </div>
          {student.documents.missingDocuments.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="text-sm font-semibold text-red-900 mb-2">Missing Documents:</div>
              <ul className="text-sm text-red-800 space-y-1">
                {student.documents.missingDocuments.map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Attendance Full View
const AttendanceView = ({ student }) => (
  <div className="bg-white rounded-lg shadow border p-6 max-w-4xl">
    <h2 className="text-xl font-bold mb-6">Attendance Record</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <AttendanceMetric label="YTD Rate" value={`${student.attendance.ytdRate}%`} color="blue" />
      <AttendanceMetric label="Present" value={student.attendance.ytdPresent} color="green" />
      <AttendanceMetric label="Absent" value={student.attendance.ytdAbsent} color="red" />
      <AttendanceMetric label="Tardy" value={student.attendance.ytdTardy} color="yellow" />
    </div>

    {student.attendance.currentStreak > 0 && (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6 mb-6">
        <div className="flex items-center gap-3">
          <FireIcon className="h-8 w-8 text-orange-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Current Streak</h3>
            <div className="text-3xl font-bold text-orange-600">{student.attendance.currentStreak} days</div>
            <div className="text-sm text-gray-600 mt-1">Longest: {student.attendance.longestStreak} days</div>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-6">
      <Field label="Last Absence" value={student.attendance.lastAbsence || 'None this year'} />
      <Field label="Attendance Goal" value={`${student.attendance.attendanceGoal}%`} />
      <Field label="On Track" value={student.attendance.onTrack ? 'Yes ✓' : 'Needs improvement'} />
      <Field label="Expected Days" value={student.enrollment.expectedDays.join(', ')} />
    </div>
  </div>
);

// Progress & Learning View
const ProgressView = ({ student }) => (
  <div className="bg-white rounded-lg shadow border p-6 max-w-4xl space-y-6">
    <h2 className="text-xl font-bold">Learning Progress & Development</h2>
    
    {/* Academic Levels */}
    <div className="grid grid-cols-2 gap-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Reading Level</h3>
        <div className="text-2xl font-bold text-blue-600">{student.academic.readingLevel}</div>
      </div>
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">Math Level</h3>
        <div className="text-2xl font-bold text-green-600">{student.academic.mathLevel}</div>
      </div>
    </div>

    {/* Strengths */}
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Strengths & Interests</h3>
      <div className="flex flex-wrap gap-2">
        {student.academic.strengths.map((s, i) => (
          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
            ✓ {s}
          </span>
        ))}
      </div>
    </div>

    {/* Growth Areas */}
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Areas for Growth</h3>
      <div className="space-y-2">
        {student.academic.areasForGrowth.map((a, i) => (
          <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded text-gray-700">
            • {a}
          </div>
        ))}
      </div>
    </div>

    {/* Learning Style & Behavior */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Learning Style</h3>
        <div className="text-gray-700">{student.academic.learningStyle}</div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Behavior Notes</h3>
        <div className="text-gray-700">{student.academic.behaviorNotes}</div>
      </div>
    </div>

    {/* Teacher Notes */}
    {student.personal?.teacherNotes && (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Teacher Observations</h3>
        <div className="text-gray-700">{student.personal.teacherNotes}</div>
      </div>
    )}

    {/* Parent Notes */}
    {student.personal?.parentNotes && (
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">Parent Preferences & Notes</h3>
        <div className="text-gray-700">{student.personal.parentNotes}</div>
      </div>
    )}
  </div>
);

// Health & Safety View
const HealthView = ({ student }) => (
  <div className="bg-white rounded-lg shadow border p-6 max-w-4xl space-y-6">
    <h2 className="text-xl font-bold">Health & Safety Information</h2>

    {/* Critical Allergies */}
    {student.health.allergies.length > 0 && (
      <div className="bg-red-50 rounded-lg border-2 border-red-300 p-6">
        <div className="flex items-center gap-2 mb-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-bold text-red-900">CRITICAL ALLERGIES</h3>
        </div>
        <div className="space-y-2">
          {student.health.allergies.map((allergy, i) => (
            <div key={i} className="px-3 py-2 bg-red-100 border border-red-400 rounded text-red-900 font-bold">
              {allergy}
            </div>
          ))}
        </div>
        {student.health.emergencyMedicalInfo && (
          <div className="mt-4 p-3 bg-white rounded border border-red-200">
            <div className="text-sm font-semibold text-red-900 mb-1">Emergency Protocol:</div>
            <div className="text-sm text-gray-700">{student.health.emergencyMedicalInfo}</div>
          </div>
        )}
      </div>
    )}

    {/* Special Needs Flags */}
    <div className="grid grid-cols-3 gap-4">
      <FlagCard label="IEP" active={student.health.iep} />
      <FlagCard label="504 Plan" active={student.health.section504} />
      <FlagCard label="Free/Reduced Lunch" active={student.health.freeReducedLunch} />
    </div>

    {/* Dietary & Medical */}
    {(student.health.dietaryRestrictions.length > 0 || student.health.medications.length > 0) && (
      <div className="space-y-4">
        {student.health.dietaryRestrictions.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Dietary Restrictions</h3>
            <div className="flex flex-wrap gap-2">
              {student.health.dietaryRestrictions.map((d, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-900 text-sm rounded">{d}</span>
              ))}
            </div>
          </div>
        )}
        {student.health.medications.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Medications</h3>
            <div className="space-y-2">
              {student.health.medications.map((m, i) => (
                <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">{m}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

// Family Contacts View
const ContactsView = ({ student }) => (
  <div className="bg-white rounded-lg shadow border p-6 max-w-4xl">
    <h2 className="text-xl font-bold mb-6">Family Contacts</h2>
    {student.guardians.map((guardian, idx) => (
      <div key={idx} className="mb-6 pb-6 border-b last:border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
            guardian.relation === 'Mother' ? 'bg-pink-500' : guardian.relation === 'Father' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {guardian.firstName[0]}{guardian.lastName[0]}
          </div>
          <div>
            <div className="font-bold text-lg">{guardian.firstName} {guardian.lastName}</div>
            <div className="text-sm text-gray-600">{guardian.relation}</div>
          </div>
          {guardian.isPrimary && (
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">PRIMARY</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" value={guardian.email} />
          <Field label="Phone" value={guardian.phone} />
          <Field label="Address" value={guardian.address} />
          <Field label="Prefers" value={guardian.communicationPreference} />
        </div>
        <div className="mt-3 flex gap-2">
          {guardian.emergencyContact && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Emergency Contact</span>}
          {guardian.pickupAuthorized && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Pickup Authorized</span>}
        </div>
      </div>
    ))}
  </div>
);

// Documents View
const DocumentsView = ({ student }) => (
  <div className="bg-white rounded-lg shadow border p-6 max-w-4xl">
    <h2 className="text-xl font-bold mb-6">Required Documents</h2>
    <div className="space-y-3">
      <DocumentRow label="Enrollment Contract" complete={student.documents.enrollmentContractSigned} date={student.documents.enrollmentContractSignedDate} version={student.documents.enrollmentContractVersion} />
      <DocumentRow label="Family Handbook" complete={student.documents.handbookSigned} date={student.documents.handbookSignedDate} version={student.documents.handbookVersion} />
      <DocumentRow label="Emergency Contact Form" complete={student.documents.emergencyContactFormComplete} />
      <DocumentRow label="Medical Release" complete={student.documents.medicalReleaseForm} />
      <DocumentRow label="Photo Release" complete={student.documents.photoReleaseForm} />
      <DocumentRow label="Pickup Authorization" complete={student.documents.pickupAuthorizationForm} />
    </div>

    {student.documents.missingDocuments.length === 0 ? (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded flex items-center gap-2">
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-green-900">All required documents on file ✓</span>
      </div>
    ) : (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
        <div className="flex items-center gap-2 mb-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-900">Missing {student.documents.missingDocuments.length} document{student.documents.missingDocuments.length > 1 ? 's' : ''}</span>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">
          Send Reminder to Family
        </button>
      </div>
    )}
  </div>
);

// Helper Components
const QuickStat = ({ label, value, color }) => {
  const colors = {
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700'
  };
  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <div className="text-xs mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

const AttendanceStat = ({ label, value, color }) => {
  const colors = {
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600'
  };
  return (
    <div className={`p-4 rounded-lg border-2 text-center ${colors[color]}`}>
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

const AttendanceMetric = ({ label, value, color }) => {
  const colors = {
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    blue: 'bg-blue-50 text-blue-700'
  };
  return (
    <div className={`p-6 rounded-lg ${colors[color]}`}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

const ProgressMetric = ({ label, value }) => (
  <div className="p-3 bg-white rounded border border-primary-200">
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className="text-lg font-bold text-primary-600">{value}</div>
  </div>
);

const DocumentStatus = ({ label, complete, date }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
    <div>
      <div className="font-medium text-sm">{label}</div>
      {date && <div className="text-xs text-gray-500">Signed: {date}</div>}
    </div>
    {complete ? (
      <CheckCircleIcon className="h-6 w-6 text-green-600" />
    ) : (
      <XMarkIcon className="h-6 w-6 text-red-600" />
    )}
  </div>
);

const DocumentRow = ({ label, complete, date, version }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
    <div>
      <div className="font-medium">{label}</div>
      {date && <div className="text-xs text-gray-500">Signed: {date}</div>}
      {version && <div className="text-xs text-gray-500">Version: {version}</div>}
    </div>
    {complete ? (
      <CheckCircleIcon className="h-6 w-6 text-green-600" />
    ) : (
      <XMarkIcon className="h-6 w-6 text-red-600" />
    )}
  </div>
);

const FlagCard = ({ label, active }) => (
  <div className={`p-4 rounded-lg border-2 ${
    active ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="flex items-center gap-2 mb-1">
      <ShieldCheckIcon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className="font-semibold text-sm">{label}</span>
    </div>
    <div className="text-xs text-gray-600">{active ? 'Active' : 'No'}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-medium text-gray-900">{value || '—'}</div>
  </div>
);
