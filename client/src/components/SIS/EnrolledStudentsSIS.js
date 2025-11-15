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
  ShieldCheckIcon,
  ClockIcon,
  XCircleIcon,
  FireIcon,
  ChatBubbleLeftEllipsisIcon,
  PhoneIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { DEMO_STUDENTS, ENROLLMENT, ATTENDANCE } from '../../data/centralizedMetrics';
import ComprehensiveAddStudent from './ComprehensiveAddStudent';
import StudentDetailModal from './StudentDetailModal';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

/**
 * Comprehensive Student Information System (SIS)
 * 
 * Inspired by PowerSchool with microschool-specific features:
 * - Student directory with complete profiles
 * - Daily attendance (mobile-optimized for teachers)
 * - Automated parent notifications for absences
 * - Contract & document management
 * - Grades, transcripts, behavior tracking
 * - Health records, IEP/504 tracking
 * - Family & emergency contacts
 * - Classroom organization
 */

export default function EnrolledStudentsSIS() {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, students, attendance, classroom, contracts, grades
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  
  // Attendance states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [todayStats, setTodayStats] = useState(null);
  const [textNotifications, setTextNotifications] = useState([]);

  useEffect(() => {
    analytics.trackPageView('enrolled-students-sis');
    loadStudentData();
    loadAttendanceData();
  }, []);

  useEffect(() => {
    if (activeView === 'attendance') {
      loadAttendanceData();
    }
  }, [selectedDate, activeView]);

  const loadStudentData = () => {
    setStudents(DEMO_STUDENTS);
  };

  const loadAttendanceData = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const studentsForAttendance = DEMO_STUDENTS.filter(student => 
      student.enrollment.expectedDays.includes(today)
    );

    const initial = {};
    studentsForAttendance.forEach(s => {
      initial[s._id] = null; // null = not marked yet
    });
    
    setAttendanceData(initial);
    calculateAttendanceStats(studentsForAttendance, initial);
  };

  const calculateAttendanceStats = (studentsExpected, data) => {
    const expected = studentsExpected.length;
    const marked = Object.values(data).filter(v => v !== null).length;
    const present = Object.values(data).filter(v => v === 'present').length;
    const absent = Object.values(data).filter(v => v === 'absent').length;
    const tardy = Object.values(data).filter(v => v === 'tardy').length;
    
    const rate = expected > 0 ? Math.round((present / expected) * 100) : 0;
    
    setTodayStats({
      expected,
      marked,
      present,
      absent,
      tardy,
      rate,
      complete: marked === expected,
      perfectDay: absent === 0 && tardy === 0 && marked === expected
    });

    // Celebrate perfect attendance
    if (marked === expected && absent === 0 && tardy === 0 && expected > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const markAttendance = (studentId, status) => {
    const student = students.find(s => s._id === studentId);
    
    setAttendanceData(prev => {
      const updated = { ...prev, [studentId]: status };
      
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const studentsExpected = students.filter(s => s.enrollment.expectedDays.includes(today));
      calculateAttendanceStats(studentsExpected, updated);
      
      return updated;
    });

    // Send automated text if absent
    if (status === 'absent' && student) {
      sendAbsenceNotification(student);
    }

    // Success feedback
    if (status === 'present') {
      toast.success(`✓ ${student.studentInfo.firstName} marked present`);
    } else if (status === 'tardy') {
      toast(`⏰ ${student.studentInfo.firstName} marked tardy`, { icon: '⏰' });
    }

    analytics.trackFeatureUsage('attendance', `mark_${status}`);
  };

  const sendAbsenceNotification = (student) => {
    const parentPhone = student.guardians[0]?.phone;
    const parentName = student.guardians[0]?.firstName;
    const studentFirstName = student.studentInfo.firstName;
    
    if (!parentPhone) {
      toast.error('No parent phone number on file');
      return;
    }

    // Generate personalized message
    const message = `Hi ${parentName}, we miss seeing ${studentFirstName} today! We know life happens, and we're here to support you. If there's anything we can help with to get ${studentFirstName} back to school, please let us know. We value your family and want ${studentFirstName} to thrive! 💙`;

    // In production, this would call Twilio/SMS API
    const notification = {
      id: `notif_${Date.now()}`,
      studentId: student._id,
      studentName: `${studentFirstName} ${student.studentInfo.lastName}`,
      parentName,
      parentPhone,
      message,
      sentAt: new Date().toLocaleString(),
      status: 'sent'
    };

    setTextNotifications(prev => [notification, ...prev]);
    
    toast.success(
      <div>
        <div className="font-semibold">📱 Text sent to {parentName}</div>
        <div className="text-xs mt-1">{parentPhone}</div>
      </div>,
      { duration: 4000 }
    );

    analytics.trackFeatureUsage('attendance', 'absence_text_sent');
  };

  // Quick actions for mobile
  const markAllPresent = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const studentsExpected = students.filter(s => s.enrollment.expectedDays.includes(today));
    
    const allPresent = {};
    studentsExpected.forEach(s => {
      allPresent[s._id] = 'present';
    });
    
    setAttendanceData(allPresent);
    calculateAttendanceStats(studentsExpected, allPresent);
    toast.success('✓ All students marked present');
  };

  // Metrics calculations
  const totalEnrollment = students.length;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendance.ytdRate, 0) / students.length)
    : 0;
  const missingDocuments = students.filter(s => s.documents.missingDocuments.length > 0).length;
  const currentPayments = students.filter(s => s.tuition.paymentStatus === 'current').length;
  const specialNeeds = students.filter(s => s.health.specialNeeds || s.health.iep || s.health.section504).length;

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
    setShowStudentDetail(true);
  };

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    toast.success('Student added successfully!');
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

  // Get today's expected students for attendance
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysStudents = students.filter(s => s.enrollment.expectedDays.includes(today));

  // Group by program/teacher for attendance
  const attendanceByClassroom = todaysStudents.reduce((acc, student) => {
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
      {showCelebration && <Confetti recycle={false} numberOfPieces={300} />}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Information System</h1>
              <p className="text-gray-600">Complete student records, attendance, and tracking</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="touch-target px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 md:space-x-8 min-w-max">
          <TabButton
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
            icon={ChartBarIcon}
            label="Dashboard"
          />
          <TabButton
            active={activeView === 'students'}
            onClick={() => setActiveView('students')}
            icon={UserGroupIcon}
            label="All Students"
          />
          <TabButton
            active={activeView === 'attendance'}
            onClick={() => setActiveView('attendance')}
            icon={CalendarIcon}
            label="Attendance"
            badge={todayStats && !todayStats.complete ? `${todayStats.marked}/${todayStats.expected}` : null}
          />
          <TabButton
            active={activeView === 'classroom'}
            onClick={() => setActiveView('classroom')}
            icon={AcademicCapIcon}
            label="By Classroom"
          />
          <TabButton
            active={activeView === 'contracts'}
            onClick={() => setActiveView('contracts')}
            icon={DocumentCheckIcon}
            label="Contracts"
            badge={missingDocuments > 0 ? missingDocuments : null}
            badgeColor="red"
          />
          <TabButton
            active={activeView === 'grades'}
            onClick={() => setActiveView('grades')}
            icon={ChartBarIcon}
            label="Grades"
            badge="Pro"
            badgeColor="blue"
          />
        </nav>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <DashboardView
          totalEnrollment={totalEnrollment}
          avgAttendance={avgAttendance}
          currentPayments={currentPayments}
          missingDocuments={missingDocuments}
          specialNeeds={specialNeeds}
          programs={programs}
          teachers={teachers}
          students={students}
        />
      )}

      {/* Students Table View */}
      {activeView === 'students' && (
        <StudentsTableView
          students={filteredStudents}
          allStudents={students}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterProgram={filterProgram}
          setFilterProgram={setFilterProgram}
          filterTeacher={filterTeacher}
          setFilterTeacher={setFilterTeacher}
          programs={programs}
          teachers={teachers}
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSort={handleSort}
          viewStudentDetails={viewStudentDetails}
        />
      )}

      {/* Mobile-Optimized Attendance View */}
      {activeView === 'attendance' && (
        <AttendanceView
          attendanceByClassroom={attendanceByClassroom}
          attendanceData={attendanceData}
          markAttendance={markAttendance}
          todayStats={todayStats}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          markAllPresent={markAllPresent}
          textNotifications={textNotifications}
        />
      )}

      {/* Classroom View */}
      {activeView === 'classroom' && (
        <ClassroomView
          studentsByClassroom={studentsByClassroom}
          viewStudentDetails={viewStudentDetails}
        />
      )}

      {/* Contracts View */}
      {activeView === 'contracts' && (
        <ContractsView students={students} />
      )}

      {/* Grades View (PowerSchool-inspired) */}
      {activeView === 'grades' && (
        <GradesView students={students} />
      )}

      {/* Add Student Modal */}
      <ComprehensiveAddStudent
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddStudent}
      />

      {/* Student Detail Modal */}
      {showStudentDetail && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => {
            setShowStudentDetail(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label, badge, badgeColor = 'red' }) => (
  <button
    onClick={onClick}
    className={`touch-target py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
      active
        ? 'border-primary-500 text-primary-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
    {badge && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        badgeColor === 'red' ? 'bg-red-100 text-red-800' :
        badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

// Dashboard View Component
const DashboardView = ({ totalEnrollment, avgAttendance, currentPayments, missingDocuments, specialNeeds, programs, teachers, students }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={UserGroupIcon}
        label="Total Enrollment"
        value={totalEnrollment}
        subtitle="students"
        color="blue"
      />
      <MetricCard
        icon={CalendarIcon}
        label="Avg Attendance"
        value={`${avgAttendance}%`}
        subtitle="YTD average"
        color={avgAttendance >= 95 ? 'green' : 'yellow'}
      />
      <MetricCard
        icon={CheckCircleIcon}
        label="Payment Status"
        value={`${currentPayments}/${totalEnrollment}`}
        subtitle="current"
        color="green"
      />
      <MetricCard
        icon={DocumentCheckIcon}
        label="Documents"
        value={missingDocuments}
        subtitle="missing"
        color={missingDocuments === 0 ? 'green' : 'red'}
      />
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
          <div className="text-2xl font-bold text-gray-900">{specialNeeds}</div>
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
);

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500'
  };

  const valueColorClasses = {
    blue: 'text-gray-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
      </div>
      <div className={`text-3xl font-bold ${valueColorClasses[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
};

// Students Table View Component
const StudentsTableView = ({ students, allStudents, searchTerm, setSearchTerm, filterProgram, setFilterProgram, filterTeacher, setFilterTeacher, programs, teachers, sortBy, sortDirection, handleSort, viewStudentDetails }) => (
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
          className="touch-target w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <select
        value={filterProgram}
        onChange={(e) => setFilterProgram(e.target.value)}
        className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Programs</option>
        {programs.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      
      <select
        value={filterTeacher}
        onChange={(e) => setFilterTeacher(e.target.value)}
        className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Teachers</option>
        {teachers.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg shadow">
      <div className="table-scroll">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => handleSort('name')}
              className="touch-target px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Student {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('grade')}
              className="touch-target px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Grade {sortBy === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('teacher')}
              className="touch-target px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Teacher {sortBy === 'teacher' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Program
            </th>
            <th 
              onClick={() => handleSort('attendance')}
              className="touch-target px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Attendance {sortBy === 'attendance' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              onClick={() => handleSort('payment')}
              className="touch-target px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Payment {sortBy === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map(student => {
            const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
            
            return (
              <tr 
                key={student._id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => viewStudentDetails(student)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{fullName}</div>
                      <div className="text-sm text-gray-500">{student.familyName} Family</div>
                    </div>
                    {(student.health.specialNeeds || student.health.iep || student.health.section504) && (
                      <ShieldCheckIcon className="h-4 w-4 text-blue-500" title="Special Needs" />
                    )}
                    {student.health.allergies.length > 0 && (
                      <HeartIcon className="h-4 w-4 text-red-500" title="Allergies" />
                    )}
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
                  <button className="touch-target text-primary-600 hover:text-primary-900">
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      Showing {students.length} of {allStudents.length} students
    </div>
  </div>
);

// Mobile-Optimized Attendance View Component
const AttendanceView = ({ attendanceByClassroom, attendanceData, markAttendance, todayStats, selectedDate, setSelectedDate, markAllPresent, textNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="space-y-6">
      {/* Attendance Header with Stats */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DevicePhoneMobileIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Daily Attendance</h2>
            </div>
            <p className="text-sm text-gray-600">Mobile-optimized for quick check-ins • Auto-texts parents for absences</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="touch-target px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={markAllPresent}
              className="touch-target px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold whitespace-nowrap"
            >
              ✓ All Present
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="touch-target relative p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              title="View text notifications"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-600" />
              {textNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {textNotifications.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Today's Stats */}
        {todayStats && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600">Expected</div>
              <div className="text-2xl font-bold text-gray-900">{todayStats.expected}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600">Marked</div>
              <div className="text-2xl font-bold text-primary-600">{todayStats.marked}/{todayStats.expected}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600">Present</div>
              <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600">Absent</div>
              <div className="text-2xl font-bold text-red-600">{todayStats.absent}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600">Attendance</div>
              <div className={`text-2xl font-bold ${
                todayStats.rate >= 95 ? 'text-green-600' :
                todayStats.rate >= 90 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {todayStats.rate}%
              </div>
            </div>
          </div>
        )}

        {todayStats && todayStats.complete && todayStats.perfectDay && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
            <FireIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">🎉 Perfect attendance today!</span>
          </div>
        )}
      </div>

      {/* Text Notifications Panel */}
      {showNotifications && textNotifications.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📱 Absence Texts Sent Today</h3>
            <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {textNotifications.map(notif => (
              <div key={notif.id} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{notif.studentName}</div>
                    <div className="text-xs text-gray-600 mt-1">To: {notif.parentName} ({notif.parentPhone})</div>
                    <div className="text-xs text-gray-700 mt-2 italic">"{notif.message}"</div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{notif.sentAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance by Classroom - Mobile Optimized */}
      <div className="space-y-4">
        {Object.entries(attendanceByClassroom).map(([classroom, data]) => (
          <div key={classroom} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            {/* Classroom Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">{data.program}</h3>
                  <div className="text-xs text-primary-100">{data.teacher}</div>
                </div>
                <div className="text-xl font-bold">
                  {data.students.filter(s => attendanceData[s._id] === 'present').length}/{data.students.length}
                </div>
              </div>
            </div>

            {/* Student List - Quick Tap Interface */}
            <div className="divide-y divide-gray-100">
              {data.students.map(student => {
                const status = attendanceData[student._id];
                const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;

                return (
                  <div key={student._id} className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{fullName}</div>
                        <div className="text-xs text-gray-500">
                          {student.studentInfo.grade} • YTD: {student.attendance.ytdRate}%
                          {student.attendance.currentStreak > 0 && (
                            <span className="ml-2">
                              <FireIcon className="h-3 w-3 inline text-orange-500" />
                              {student.attendance.currentStreak} day streak
                            </span>
                          )}
                        </div>
                      </div>
                      {status && (
                        <div className="flex-shrink-0">
                          {status === 'present' && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                          {status === 'absent' && <XCircleIcon className="h-6 w-6 text-red-600" />}
                          {status === 'tardy' && <ClockIcon className="h-6 w-6 text-yellow-600" />}
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons - Large Touch Targets */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => markAttendance(student._id, 'present')}
                        className={`touch-target py-3 rounded-lg font-semibold text-sm transition-all ${
                          status === 'present'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        }`}
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => markAttendance(student._id, 'tardy')}
                        className={`touch-target py-3 rounded-lg font-semibold text-sm transition-all ${
                          status === 'tardy'
                            ? 'bg-yellow-600 text-white shadow-md'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        ⏰ Tardy
                      </button>
                      <button
                        onClick={() => markAttendance(student._id, 'absent')}
                        className={`touch-target py-3 rounded-lg font-semibold text-sm transition-all ${
                          status === 'absent'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(attendanceByClassroom).length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No students expected today.</p>
        </div>
      )}
    </div>
  );
};

// Classroom View Component
const ClassroomView = ({ studentsByClassroom, viewStudentDetails }) => (
  <div className="space-y-6">
    {Object.entries(studentsByClassroom).map(([classroom, data]) => (
      <div key={classroom} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{data.program}</h3>
              <div className="text-sm text-primary-100">{data.teacher}</div>
            </div>
            <div className="text-2xl font-bold">{data.students.length}</div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.students.map(student => {
            const fullName = `${student.studentInfo.firstName} ${student.studentInfo.lastName}`;
            
            return (
              <div 
                key={student._id}
                onClick={() => viewStudentDetails(student)}
                className="touch-target p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-medium text-gray-900">{fullName}</div>
                <div className="text-sm text-gray-600">{student.studentInfo.grade} grade</div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
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
                  {(student.health.iep || student.health.section504) && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                      IEP/504
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
);

// Contracts View Component
const ContractsView = ({ students }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="table-scroll">
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
                  <button className="touch-target px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700">
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
);

// Grades View Component (PowerSchool-inspired)
const GradesView = ({ students }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <AcademicCapIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Grades & Transcripts</h2>
          <p className="text-sm text-gray-600 mb-4">
            PowerSchool-style grading system with standards-based reporting, progress tracking, and parent portal access.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div>✓ <strong>Standards-Based Grading:</strong> Track mastery of specific learning standards</div>
            <div>✓ <strong>Progress Reports:</strong> Generate report cards and progress reports</div>
            <div>✓ <strong>Behavior Tracking:</strong> Document positive and concerning behaviors</div>
            <div>✓ <strong>Parent Portal:</strong> Real-time grade access for families</div>
            <div>✓ <strong>Transcripts:</strong> Generate official transcripts for transfers</div>
            <div>✓ <strong>State Reporting:</strong> Export data for state compliance</div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900 font-semibold">
              🚀 Pro Feature: Full grading system with parent portal, standards tracking, and state reporting.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Preview Table */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Grade View</h3>
      <div className="table-scroll">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reading</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Math</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Science</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Behavior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.slice(0, 5).map(student => (
              <tr key={student._id}>
                <td className="px-4 py-2 text-sm">{student.studentInfo.firstName} {student.studentInfo.lastName}</td>
                <td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Proficient</span></td>
                <td className="px-4 py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">Developing</span></td>
                <td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Proficient</span></td>
                <td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">Excellent</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
