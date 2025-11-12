import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { DEMO_STUDENTS, ENROLLMENT, ATTENDANCE } from '../../data/centralizedMetrics';
import ComprehensiveAddStudent from './ComprehensiveAddStudent';
import toast from 'react-hot-toast';

/**
 * Enrolled Students SIS (Student Information System)
 * 
 * Full-featured SIS that combines:
 * - Student directory (sortable table)
 * - Contract management (handbook + enrollment agreement)
 * - Classroom assignments (by teacher/program)
 * - Comprehensive student records
 * - Family grouping (siblings)
 * - Document tracking
 * 
 * Views:
 * - Dashboard (overview metrics)
 * - Students (sortable table)
 * - By Classroom (grouped by teacher)
 * - Contracts (document status)
 * - Add Student (comprehensive form)
 */

export default function EnrolledStudentsSIS() {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, students, classroom, contracts
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    analytics.trackPageView('enrolled-students-sis');
    loadStudentData();
  }, []);

  const loadStudentData = () => {
    // Load from centralized data source
    setStudents(DEMO_STUDENTS);
  };

  const loadStudentDataOLD = () => {
    // OLD DEMO DATA - Replaced with centralized data
    const demoStudents = [
      {
        _id: '1',
        
        // Basic Info
        studentInfo: {
          firstName: 'Emma',
          middleName: 'Grace',
          lastName: 'Johnson',
          preferredName: 'Emma',
          dob: '2018-03-15',
          age: 6,
          gender: 'Female',
          grade: 'K'
        },
        
        // Family Info
        familyId: 'fam_001',
        familyName: 'Johnson',
        guardians: [
          {
            id: 'g1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            relation: 'Mother',
            phone: '555-0101',
            email: 'sarah@email.com',
            address: '123 Main St, Sunshine, FL 33xxx',
            isPrimary: true,
            emergencyContact: true,
            pickupAuthorized: true,
            communicationPreference: 'text'
          },
          {
            id: 'g2',
            firstName: 'Mike',
            lastName: 'Johnson',
            relation: 'Father',
            phone: '555-0102',
            email: 'mike@email.com',
            address: '123 Main St, Sunshine, FL 33xxx',
            isPrimary: false,
            emergencyContact: true,
            pickupAuthorized: true,
            communicationPreference: 'email'
          }
        ],
        siblings: [], // No siblings
        
        // Enrollment Details
        enrollment: {
          programId: 'prog_001',
          programName: '5-Day Full-Time',
          leadTeacherId: 'teach_001',
          leadTeacher: 'Ms. Sarah Thompson',
          assistantTeacher: null,
          enrolledDate: '2024-08-15',
          firstDayAttended: '2024-08-19',
          expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          status: 'active', // active, withdrawn, graduated
          withdrawalDate: null,
          withdrawalReason: null
        },
        
        // Tuition & Payment
        tuition: {
          baseTuition: 1200,
          discounts: [],
          finalTuition: 1200,
          paymentMethod: 'Stripe Auto-pay',
          paymentStatus: 'current', // current, pastDue, delinquent
          lastPayment: '2024-09-25',
          nextPayment: '2024-10-01',
          ytdPaid: 10800
        },
        
        // Contracts & Documents
        documents: {
          handbookSigned: true,
          handbookSignedDate: '2024-08-15',
          handbookVersion: '2024-2025',
          
          enrollmentContractSigned: true,
          enrollmentContractSignedDate: '2024-08-15',
          enrollmentContractVersion: '2024-2025',
          
          emergencyContactFormComplete: true,
          medicalReleaseForm: true,
          photoReleaseForm: true,
          pickupAuthorizationForm: true,
          
          missingDocuments: []
        },
        
        // Health & Medical
        health: {
          allergies: ['Peanuts', 'Tree nuts'],
          dietaryRestrictions: [],
          diagnoses: [],
          medications: [],
          accommodations: [],
          modifications: [],
          iep: false,
          section504: false,
          specialNeeds: false,
          freeReducedLunch: false,
          emergencyMedicalInfo: 'EpiPen in office - severe nut allergy'
        },
        
        // Academic & Personal
        academic: {
          readingLevel: 'Grade K.5',
          mathLevel: 'Grade K.3',
          strengths: ['Art', 'Creative play', 'Social skills'],
          areasForGrowth: ['Math confidence', 'Following multi-step directions'],
          learningStyle: 'Visual learner',
          behaviorNotes: 'Very kind, sometimes shy with new activities'
        },
        
        // Personal Touch
        personal: {
          favorites: 'Loves art and outdoor play. Favorite color is purple. Loves unicorns.',
          interests: ['Drawing', 'Nature', 'Animals'],
          dislikes: ['Loud noises'],
          comfortItems: 'Stuffed bunny for rest time',
          bestFriends: ['Sofia Martinez'],
          parentNotes: 'Mom works from home, very engaged. Dad travels for work. Loves getting postcards home about her day.',
          teacherNotes: 'Doing great with reading. Needs encouragement in math. Thrives with one-on-one attention.'
        },
        
        // Attendance
        attendance: {
          ytdRate: 98,
          ytdPresent: 50,
          ytdAbsent: 1,
          ytdTardy: 1,
          lastAbsence: '2024-09-10',
          currentStreak: 45,
          longestStreak: 45,
          attendanceGoal: 95,
          onTrack: true
        },
        
        // System
        createdAt: '2024-08-15',
        updatedAt: '2024-09-25',
        createdBy: 'admin@school.com',
        lastModifiedBy: 'admin@school.com'
      },
      {
        _id: '2',
        
        studentInfo: {
          firstName: 'Carlos',
          middleName: 'Miguel',
          lastName: 'Martinez',
          preferredName: 'Carlos',
          dob: '2016-08-22',
          age: 8,
          gender: 'Male',
          grade: '2nd'
        },
        
        familyId: 'fam_002',
        familyName: 'Martinez',
        guardians: [
          {
            id: 'g3',
            firstName: 'Maria',
            lastName: 'Martinez',
            relation: 'Mother',
            phone: '555-0201',
            email: 'maria@email.com',
            address: '456 Oak Ave, Sunshine, FL 33xxx',
            isPrimary: true,
            emergencyContact: true,
            pickupAuthorized: true,
            communicationPreference: 'email'
          }
        ],
        siblings: ['3'], // Sofia Martinez
        
        enrollment: {
          programId: 'prog_001',
          programName: '5-Day Full-Time',
          leadTeacherId: 'teach_001',
          leadTeacher: 'Ms. Sarah Thompson',
          enrolledDate: '2024-08-10',
          firstDayAttended: '2024-08-19',
          expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          status: 'active'
        },
        
        tuition: {
          baseTuition: 1200,
          discounts: [
            { type: 'Sibling', amount: 180, percentage: 15 }
          ],
          finalTuition: 1020,
          paymentMethod: 'ClassWallet ESA',
          paymentStatus: 'current',
          lastPayment: '2024-09-20',
          nextPayment: '2024-10-01',
          ytdPaid: 9180
        },
        
        documents: {
          handbookSigned: true,
          handbookSignedDate: '2024-08-10',
          enrollmentContractSigned: true,
          enrollmentContractSignedDate: '2024-08-10',
          emergencyContactFormComplete: true,
          medicalReleaseForm: true,
          photoReleaseForm: true,
          pickupAuthorizationForm: true,
          missingDocuments: []
        },
        
        health: {
          allergies: [],
          dietaryRestrictions: [],
          diagnoses: [],
          medications: [],
          accommodations: [],
          modifications: [],
          iep: false,
          section504: false,
          specialNeeds: false,
          freeReducedLunch: true
        },
        
        academic: {
          readingLevel: 'Grade 2.8',
          mathLevel: 'Grade 3.2',
          strengths: ['Math', 'Science', 'Leadership'],
          areasForGrowth: ['Handwriting', 'Patience'],
          learningStyle: 'Kinesthetic learner',
          behaviorNotes: 'Natural leader, very helpful'
        },
        
        personal: {
          favorites: 'Soccer enthusiast. Loves math games. Favorite food is pizza.',
          interests: ['Soccer', 'Math', 'Science experiments'],
          dislikes: ['Writing'],
          bestFriends: ['Noah Williams'],
          parentNotes: 'Single mom, very supportive. Speaks Spanish at home. Loves getting progress updates.',
          teacherNotes: 'Excelling in math. Great leader in group activities. Needs handwriting practice.'
        },
        
        attendance: {
          ytdRate: 100,
          ytdPresent: 51,
          ytdAbsent: 0,
          ytdTardy: 0,
          lastAbsence: null,
          currentStreak: 60,
          longestStreak: 60,
          attendanceGoal: 95,
          onTrack: true
        },
        
        createdAt: '2024-08-10',
        updatedAt: '2024-09-25'
      }
      // More students would follow same structure
    ];

    setStudents(demoStudents);
  };

  // Metrics calculations
  const totalEnrollment = students.length;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendance.ytdRate, 0) / students.length)
    : 0;
  const missingDocuments = students.filter(s => s.documents.missingDocuments.length > 0).length;
  const currentPayments = students.filter(s => s.tuition.paymentStatus === 'current').length;

  // Sorting
  const sortedStudents = [...students].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'name':
        aVal = a.studentInfo.lastName;
        bVal = b.studentInfo.lastName;
        break;
      case 'grade':
        aVal = a.studentInfo.grade;
        bVal = b.studentInfo.grade;
        break;
      case 'teacher':
        aVal = a.enrollment.leadTeacher;
        bVal = b.enrollment.leadTeacher;
        break;
      case 'attendance':
        aVal = a.attendance.ytdRate;
        bVal = b.attendance.ytdRate;
        break;
      case 'payment':
        aVal = a.tuition.paymentStatus;
        bVal = b.tuition.paymentStatus;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Filtering
  const filteredStudents = sortedStudents.filter(student => {
    const matchesSearch = 
      student.studentInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.familyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = filterProgram === 'all' || student.enrollment.programName === filterProgram;
    const matchesTeacher = filterTeacher === 'all' || student.enrollment.leadTeacher === filterTeacher;
    
    return matchesSearch && matchesProgram && matchesTeacher;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    toast('Student details modal - coming soon!');
  };

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    toast.success('Student added! (In production, this would save to database)');
  };

  // Group by classroom
  const studentsByClassroom = students.reduce((acc, student) => {
    const key = `${student.enrollment.programName} - ${student.enrollment.leadTeacher}`;
    if (!acc[key]) {
      acc[key] = {
        program: student.enrollment.programName,
        teacher: student.enrollment.leadTeacher,
        students: []
      };
    }
    acc[key].students.push(student);
    return acc;
  }, {});

  const programs = [...new Set(students.map(s => s.enrollment.programName))];
  const teachers = [...new Set(students.map(s => s.enrollment.leadTeacher))];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enrolled Students</h1>
              <p className="text-gray-600">Complete student information system</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'dashboard'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'students'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserGroupIcon className="h-5 w-5 inline mr-2" />
            All Students
          </button>
          <button
            onClick={() => setActiveView('classroom')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'classroom'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <AcademicCapIcon className="h-5 w-5 inline mr-2" />
            By Classroom
          </button>
          <button
            onClick={() => setActiveView('contracts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'contracts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <DocumentCheckIcon className="h-5 w-5 inline mr-2" />
            Contracts {missingDocuments > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                {missingDocuments}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Enrollment</span>
                <UserGroupIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalEnrollment}</div>
              <div className="text-xs text-gray-500 mt-1">students</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Attendance</span>
                <CalendarIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className={`text-3xl font-bold ${avgAttendance >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                {avgAttendance}%
              </div>
              <div className="text-xs text-gray-500 mt-1">YTD average</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Payment Status</span>
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600">{currentPayments}/{totalEnrollment}</div>
              <div className="text-xs text-gray-500 mt-1">current</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Documents</span>
                <DocumentCheckIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className={`text-3xl font-bold ${missingDocuments === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {missingDocuments}
              </div>
              <div className="text-xs text-gray-500 mt-1">missing</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Programs</div>
                <div className="text-2xl font-bold text-gray-900">{programs.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Teachers</div>
                <div className="text-2xl font-bold text-gray-900">{teachers.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Special Needs</div>
                <div className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.health.specialNeeds || s.health.iep).length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Free/Reduced</div>
                <div className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.health.freeReducedLunch).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Table View */}
      {activeView === 'students' && (
        <div>
          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or family..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Programs</option>
              {programs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Teachers</option>
              {teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Sortable Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Student {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleSort('grade')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Grade {sortBy === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleSort('teacher')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Teacher {sortBy === 'teacher' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th 
                    onClick={() => handleSort('attendance')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Attendance {sortBy === 'attendance' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleSort('payment')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Payment {sortBy === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => {
                  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
                  
                  return (
                    <tr 
                      key={student._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => viewStudentDetails(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{fullName}</div>
                            <div className="text-sm text-gray-500">{student.familyName} Family</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentInfo.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.enrollment.leadTeacher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.enrollment.programName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          student.attendance.ytdRate >= 95 ? 'text-green-600' :
                          student.attendance.ytdRate >= 90 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {student.attendance.ytdRate}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.attendance.ytdAbsent}A / {student.attendance.ytdTardy}T
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.tuition.paymentStatus === 'current'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.tuition.paymentStatus === 'current' ? 'Current' : 'Past Due'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">${student.tuition.finalTuition}/mo</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      )}

      {/* Classroom View */}
      {activeView === 'classroom' && (
        <div className="space-y-6">
          {Object.entries(studentsByClassroom).map(([classroom, data]) => (
            <div key={classroom} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Classroom Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{data.program}</h3>
                    <div className="text-sm text-primary-100">{data.teacher}</div>
                  </div>
                  <div className="text-2xl font-bold">{data.students.length}</div>
                </div>
              </div>

              {/* Student Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.students.map(student => {
                  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
                  
                  return (
                    <div 
                      key={student._id}
                      onClick={() => viewStudentDetails(student)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="font-medium text-gray-900">{fullName}</div>
                      <div className="text-sm text-gray-600">{student.studentInfo.grade} grade</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs ${
                          student.attendance.ytdRate >= 95 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {student.attendance.ytdRate}% attendance
                        </span>
                        {student.health.allergies.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                            Allergies
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contracts View */}
      {activeView === 'contracts' && (
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handbook</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollment Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergency Forms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map(student => {
                  const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
                  const allComplete = student.documents.missingDocuments.length === 0;
                  
                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{fullName}</div>
                        <div className="text-sm text-gray-500">{student.familyName}</div>
                      </td>
                      <td className="px-6 py-4">
                        {student.documents.handbookSigned ? (
                          <div>
                            <CheckCircleIcon className="h-5 w-5 text-green-500 inline mr-1" />
                            <span className="text-sm text-gray-600">{student.documents.handbookSignedDate}</span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Missing</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.documents.enrollmentContractSigned ? (
                          <div>
                            <CheckCircleIcon className="h-5 w-5 text-green-500 inline mr-1" />
                            <span className="text-sm text-gray-600">{student.documents.enrollmentContractSignedDate}</span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Missing</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {student.documents.emergencyContactFormComplete && 
                           student.documents.medicalReleaseForm && 
                           student.documents.photoReleaseForm ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {allComplete ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Complete
                          </span>
                        ) : (
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            Send Reminder
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal - Comprehensive & Legally Sound */}
      <ComprehensiveAddStudent
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}

