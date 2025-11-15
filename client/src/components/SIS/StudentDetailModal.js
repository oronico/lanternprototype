import React, { useState } from 'react';
import {
  XMarkIcon,
  AcademicCapIcon,
  HeartIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon,
  BanknotesIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

/**
 * Student Detail Modal - PowerSchool-inspired
 * 
 * Complete student profile showing:
 * - Demographics & contact info
 * - Family & emergency contacts
 * - Health & medical records
 * - Academic progress & notes
 * - Attendance & behavior
 * - Tuition & payment history
 * - Documents & compliance
 */

export default function StudentDetailModal({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, health, academic, attendance, tuition, documents

  if (!student) return null;

  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
  const primaryGuardian = student.guardians.find(g => g.isPrimary) || student.guardians[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <div className="text-sm text-primary-100 flex items-center gap-4 mt-1">
              <span>{student.studentInfo.grade} grade</span>
              <span>•</span>
              <span>{student.enrollment.leadTeacher}</span>
              <span>•</span>
              <span>{student.familyName} Family</span>
            </div>
          </div>
          <button onClick={onClose} className="touch-target p-2 hover:bg-primary-500 rounded-lg transition">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <nav className="-mb-px flex space-x-6 px-6 min-w-max">
            <DetailTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
            <DetailTab active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="Health & Medical" />
            <DetailTab active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} label="Academic" />
            <DetailTab active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} label="Attendance" />
            <DetailTab active={activeTab === 'tuition'} onClick={() => setActiveTab('tuition')} label="Tuition" />
            <DetailTab active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} label="Documents" />
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewTab student={student} primaryGuardian={primaryGuardian} />
          )}
          {activeTab === 'health' && (
            <HealthTab student={student} />
          )}
          {activeTab === 'academic' && (
            <AcademicTab student={student} />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab student={student} />
          )}
          {activeTab === 'tuition' && (
            <TuitionTab student={student} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab student={student} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="touch-target px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={() => alert('Edit student - coming soon!')}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Student
          </button>
        </div>
      </div>
    </div>
  );
}

const DetailTab = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
      active
        ? 'border-primary-500 text-primary-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

// Overview Tab
const OverviewTab = ({ student, primaryGuardian }) => (
  <div className="space-y-6">
    {/* Key Info Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoCard
        icon={CalendarIcon}
        label="Date of Birth"
        value={new Date(student.studentInfo.dob).toLocaleDateString()}
        subtitle={`Age ${student.studentInfo.age}`}
      />
      <InfoCard
        icon={AcademicCapIcon}
        label="Program"
        value={student.enrollment.programName}
        subtitle={student.enrollment.leadTeacher}
      />
      <InfoCard
        icon={UserGroupIcon}
        label="Gender"
        value={student.studentInfo.gender}
        subtitle={student.studentInfo.preferredName ? `Prefers: ${student.studentInfo.preferredName}` : ''}
      />
    </div>

    {/* Primary Guardian */}
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserGroupIcon className="h-5 w-5 text-primary-600" />
        Primary Guardian
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Name & Relation</div>
          <div className="font-medium text-gray-900">{primaryGuardian.firstName} {primaryGuardian.lastName}</div>
          <div className="text-sm text-gray-500">{primaryGuardian.relation}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Contact</div>
          <div className="flex items-center gap-2 text-sm text-gray-900 mb-1">
            <PhoneIcon className="h-4 w-4 text-gray-400" />
            <a href={`tel:${primaryGuardian.phone}`} className="hover:text-primary-600">{primaryGuardian.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
            <a href={`mailto:${primaryGuardian.email}`} className="hover:text-primary-600">{primaryGuardian.email}</a>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">Address</div>
        <div className="flex items-center gap-2 text-sm text-gray-900">
          <HomeIcon className="h-4 w-4 text-gray-400" />
          {primaryGuardian.address}
        </div>
      </div>
    </div>

    {/* All Guardians */}
    {student.guardians.length > 1 && (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Contacts</h3>
        <div className="space-y-4">
          {student.guardians.filter(g => !g.isPrimary).map(guardian => (
            <div key={guardian.id} className="flex items-start justify-between p-3 bg-white rounded border border-gray-100">
              <div>
                <div className="font-medium text-gray-900">{guardian.firstName} {guardian.lastName}</div>
                <div className="text-xs text-gray-500 mb-2">{guardian.relation}</div>
                <div className="text-xs text-gray-600 space-x-3">
                  <span>{guardian.phone}</span>
                  <span>•</span>
                  <span>{guardian.email}</span>
                </div>
              </div>
              <div className="flex gap-1 text-xs">
                {guardian.emergencyContact && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Emergency</span>}
                {guardian.pickupAuthorized && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Pickup</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Siblings */}
    {student.siblings && student.siblings.length > 0 && (
      <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
        <div className="flex items-center gap-2 text-sm text-blue-900">
          <UserGroupIcon className="h-4 w-4" />
          <span className="font-semibold">Siblings Enrolled:</span>
          <span>{student.siblings.length}</span>
        </div>
      </div>
    )}

    {/* Personal Notes */}
    {student.personal && (
      <div className="bg-yellow-50 rounded-lg border border-yellow-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Notes & Personal Info</h3>
        <div className="space-y-3 text-sm text-gray-700">
          {student.personal.favorites && (
            <div>
              <span className="font-semibold">Favorites:</span> {student.personal.favorites}
            </div>
          )}
          {student.personal.comfortItems && (
            <div>
              <span className="font-semibold">Comfort Items:</span> {student.personal.comfortItems}
            </div>
          )}
          {student.personal.bestFriends && student.personal.bestFriends.length > 0 && (
            <div>
              <span className="font-semibold">Best Friends:</span> {student.personal.bestFriends.join(', ')}
            </div>
          )}
          {student.personal.teacherNotes && (
            <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
              <div className="font-semibold text-yellow-900 mb-1">Teacher Notes:</div>
              <div className="text-gray-700">{student.personal.teacherNotes}</div>
            </div>
          )}
          {student.personal.parentNotes && (
            <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
              <div className="font-semibold text-yellow-900 mb-1">Parent Preferences:</div>
              <div className="text-gray-700">{student.personal.parentNotes}</div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

// Health Tab
const HealthTab = ({ student }) => (
  <div className="space-y-6">
    {/* Health Flags */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={`p-4 rounded-lg border-2 ${student.health.iep ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className={`h-5 w-5 ${student.health.iep ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">IEP</span>
        </div>
        <div className="text-sm text-gray-600">
          {student.health.iep ? 'Active IEP on file' : 'No IEP'}
        </div>
      </div>
      <div className={`p-4 rounded-lg border-2 ${student.health.section504 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className={`h-5 w-5 ${student.health.section504 ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">504 Plan</span>
        </div>
        <div className="text-sm text-gray-600">
          {student.health.section504 ? 'Active 504 plan' : 'No 504 plan'}
        </div>
      </div>
      <div className={`p-4 rounded-lg border-2 ${student.health.freeReducedLunch ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <HeartIcon className={`h-5 w-5 ${student.health.freeReducedLunch ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">Free/Reduced Lunch</span>
        </div>
        <div className="text-sm text-gray-600">
          {student.health.freeReducedLunch ? 'Eligible' : 'Not eligible'}
        </div>
      </div>
    </div>

    {/* Allergies */}
    {student.health.allergies && student.health.allergies.length > 0 && (
      <div className="bg-red-50 rounded-lg border-2 border-red-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-bold text-red-900">ALLERGIES - CRITICAL</h3>
        </div>
        <div className="space-y-2">
          {student.health.allergies.map((allergy, idx) => (
            <div key={idx} className="px-3 py-2 bg-red-100 border border-red-300 rounded text-red-900 font-semibold">
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

    {/* Dietary Restrictions */}
    {student.health.dietaryRestrictions && student.health.dietaryRestrictions.length > 0 && (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Restrictions</h3>
        <div className="flex flex-wrap gap-2">
          {student.health.dietaryRestrictions.map((restriction, idx) => (
            <span key={idx} className="px-3 py-1 bg-yellow-100 border border-yellow-300 rounded text-yellow-900 text-sm font-medium">
              {restriction}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Medications */}
    {student.health.medications && student.health.medications.length > 0 && (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Medications</h3>
        <div className="space-y-2">
          {student.health.medications.map((med, idx) => (
            <div key={idx} className="p-3 bg-white rounded border border-blue-100 text-sm text-gray-900">
              {med}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Diagnoses */}
    {student.health.diagnoses && student.health.diagnoses.length > 0 && (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Diagnoses</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {student.health.diagnoses.map((diagnosis, idx) => (
            <div key={idx}>{diagnosis}</div>
          ))}
        </div>
      </div>
    )}

    {/* Accommodations */}
    {student.health.accommodations && student.health.accommodations.length > 0 && (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Accommodations</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {student.health.accommodations.map((acc, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>{acc}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* No Health Concerns */}
    {student.health.allergies.length === 0 && 
     student.health.medications.length === 0 && 
     student.health.diagnoses.length === 0 && (
      <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-3" />
        <p className="text-green-900 font-medium">No health concerns or allergies on file</p>
      </div>
    )}
  </div>
);

// Academic Tab
const AcademicTab = ({ student }) => (
  <div className="space-y-6">
    {/* Academic Levels */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading Level</h3>
        <div className="text-2xl font-bold text-blue-600">{student.academic.readingLevel}</div>
      </div>
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Math Level</h3>
        <div className="text-2xl font-bold text-green-600">{student.academic.mathLevel}</div>
      </div>
    </div>

    {/* Strengths */}
    <div className="bg-green-50 rounded-lg border border-green-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Strengths</h3>
      <div className="flex flex-wrap gap-2">
        {student.academic.strengths.map((strength, idx) => (
          <span key={idx} className="px-3 py-1 bg-green-100 border border-green-300 rounded text-green-900 text-sm font-medium">
            ✓ {strength}
          </span>
        ))}
      </div>
    </div>

    {/* Areas for Growth */}
    <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas for Growth</h3>
      <div className="space-y-2">
        {student.academic.areasForGrowth.map((area, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-yellow-600">•</span>
            <span>{area}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Learning Style */}
    <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Style</h3>
      <div className="text-gray-700">{student.academic.learningStyle}</div>
    </div>

    {/* Behavior Notes */}
    {student.academic.behaviorNotes && (
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Behavior & Social-Emotional</h3>
        <div className="text-gray-700">{student.academic.behaviorNotes}</div>
      </div>
    )}
  </div>
);

// Attendance Tab
const AttendanceTab = ({ student }) => (
  <div className="space-y-6">
    {/* YTD Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">YTD Rate</div>
        <div className={`text-3xl font-bold ${
          student.attendance.ytdRate >= 95 ? 'text-green-600' :
          student.attendance.ytdRate >= 90 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {student.attendance.ytdRate}%
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Present</div>
        <div className="text-3xl font-bold text-green-600">{student.attendance.ytdPresent}</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Absent</div>
        <div className="text-3xl font-bold text-red-600">{student.attendance.ytdAbsent}</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Tardy</div>
        <div className="text-3xl font-bold text-yellow-600">{student.attendance.ytdTardy}</div>
      </div>
    </div>

    {/* Current Streak */}
    {student.attendance.currentStreak > 0 && (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
        <div className="flex items-center gap-3">
          <FireIcon className="h-8 w-8 text-orange-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Current Streak</h3>
            <div className="text-3xl font-bold text-orange-600">{student.attendance.currentStreak} days</div>
            <div className="text-sm text-gray-600">Longest streak: {student.attendance.longestStreak} days</div>
          </div>
        </div>
      </div>
    )}

    {/* Attendance Goal */}
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance Goal</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                student.attendance.ytdRate >= student.attendance.attendanceGoal 
                  ? 'bg-green-600' 
                  : 'bg-yellow-600'
              }`}
              style={{ width: `${Math.min((student.attendance.ytdRate / student.attendance.attendanceGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Goal: {student.attendance.attendanceGoal}%
        </div>
      </div>
      {student.attendance.onTrack ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircleIcon className="h-4 w-4" />
          <span className="font-medium">On track to meet attendance goal!</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <span className="font-medium">Needs improvement to reach goal</span>
        </div>
      )}
    </div>

    {/* Last Absence */}
    {student.attendance.lastAbsence && (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600">Last Absence</div>
        <div className="text-base font-medium text-gray-900">{student.attendance.lastAbsence}</div>
      </div>
    )}
  </div>
);

// Tuition Tab
const TuitionTab = ({ student }) => (
  <div className="space-y-6">
    {/* Payment Status */}
    <div className={`p-6 rounded-lg border-2 ${
      student.tuition.paymentStatus === 'current'
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Status</h3>
          <div className={`text-2xl font-bold ${
            student.tuition.paymentStatus === 'current' ? 'text-green-600' : 'text-red-600'
          }`}>
            {student.tuition.paymentStatus === 'current' ? 'Current' : 'Past Due'}
          </div>
        </div>
        <BanknotesIcon className={`h-12 w-12 ${
          student.tuition.paymentStatus === 'current' ? 'text-green-600' : 'text-red-600'
        }`} />
      </div>
    </div>

    {/* Tuition Details */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuition Breakdown</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Tuition</span>
          <span className="font-semibold text-gray-900">${student.tuition.baseTuition}/month</span>
        </div>
        {student.tuition.discounts && student.tuition.discounts.length > 0 && (
          <>
            {student.tuition.discounts.map((discount, idx) => (
              <div key={idx} className="flex justify-between text-green-600">
                <span>{discount.type} Discount ({discount.percentage}%)</span>
                <span>-${discount.amount}/month</span>
              </div>
            ))}
          </>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-semibold text-gray-900">Final Tuition</span>
          <span className="font-bold text-primary-600 text-lg">${student.tuition.finalTuition}/month</span>
        </div>
      </div>
    </div>

    {/* Payment Method */}
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
      <div className="text-gray-700">{student.tuition.paymentMethod}</div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 mb-1">Last Payment</div>
          <div className="font-medium text-gray-900">{student.tuition.lastPayment}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Next Payment</div>
          <div className="font-medium text-gray-900">{student.tuition.nextPayment}</div>
        </div>
      </div>
    </div>

    {/* YTD Paid */}
    <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Year-to-Date Paid</h3>
      <div className="text-3xl font-bold text-primary-600">${student.tuition.ytdPaid.toLocaleString()}</div>
    </div>
  </div>
);

// Documents Tab
const DocumentsTab = ({ student }) => (
  <div className="space-y-4">
    {/* Document Checklist */}
    <DocumentRow
      label="Family Handbook"
      signed={student.documents.handbookSigned}
      date={student.documents.handbookSignedDate}
      version={student.documents.handbookVersion}
    />
    <DocumentRow
      label="Enrollment Contract"
      signed={student.documents.enrollmentContractSigned}
      date={student.documents.enrollmentContractSignedDate}
      version={student.documents.enrollmentContractVersion}
    />
    <DocumentRow
      label="Emergency Contact Form"
      signed={student.documents.emergencyContactFormComplete}
    />
    <DocumentRow
      label="Medical Release Form"
      signed={student.documents.medicalReleaseForm}
    />
    <DocumentRow
      label="Photo Release Form"
      signed={student.documents.photoReleaseForm}
    />
    <DocumentRow
      label="Pickup Authorization"
      signed={student.documents.pickupAuthorizationForm}
    />

    {/* Status Summary */}
    {student.documents.missingDocuments && student.documents.missingDocuments.length > 0 ? (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900 mb-2">Missing Documents</div>
            <ul className="space-y-1 text-sm text-red-800">
              {student.documents.missingDocuments.map((doc, idx) => (
                <li key={idx}>• {doc}</li>
              ))}
            </ul>
            <button className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
              Send Reminder to Family
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-green-900">All required documents on file ✓</span>
      </div>
    )}
  </div>
);

const DocumentRow = ({ label, signed, date, version }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      {date && <div className="text-xs text-gray-500">Signed: {date}</div>}
      {version && <div className="text-xs text-gray-500">Version: {version}</div>}
    </div>
    <div>
      {signed ? (
        <CheckCircleIcon className="h-6 w-6 text-green-600" />
      ) : (
        <XMarkIcon className="h-6 w-6 text-red-600" />
      )}
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, label, value, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-5 w-5 text-primary-600" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <div className="font-semibold text-gray-900">{value}</div>
    {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

