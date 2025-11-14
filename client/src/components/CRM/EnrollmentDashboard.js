import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  HeartIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Enrollment Dashboard - For Currently Enrolled Students
 * 
 * Tracks:
 * - Total enrollment count
 * - Daily attendance %
 * - Attrition %
 * - Retention %
 * - Student details (tuition, teacher, program, health info)
 * - Family relationship nurturing ideas
 */

export default function EnrollmentDashboard() {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    analytics.trackPageView('enrollment-dashboard');
    loadEnrolledStudents();
  }, []);

  const loadEnrolledStudents = () => {
    // Demo enrolled students data
    const students = [
      {
        id: 1,
        studentName: 'Emma Johnson',
        familyName: 'Johnson',
        dob: '2018-03-15',
        age: 6,
        grade: 'K',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        
        // Tuition & Payment
        baseTuition: 1200,
        discounts: [
          { type: 'Sibling', amount: 0, percentage: 0 }
        ],
        finalTuition: 1200,
        paymentStatus: 'current',
        paymentMethod: 'Auto-pay',
        
        // Family Info
        guardians: [
          { name: 'Sarah Johnson', relation: 'Mother', phone: '555-0101', email: 'sarah@email.com', preferredContact: true },
          { name: 'Mike Johnson', relation: 'Father', phone: '555-0102', email: 'mike@email.com', preferredContact: false }
        ],
        address: '123 Main St, Sunshine, FL 33xxx',
        
        // Special Needs & Health
        freeReducedLunch: false,
        specialNeeds: false,
        allergies: ['Peanuts', 'Tree nuts'],
        accommodations: [],
        modifications: [],
        medications: [],
        
        // Favorites & Notes
        favorites: 'Loves art and outdoor play. Favorite color is purple. Loves unicorns.',
        parentNotes: 'Mom works from home, very engaged. Dad travels for work.',
        teacherNotes: 'Doing great with reading. Needs encouragement in math.',
        
        // Attendance
        attendanceRate: 98,
        absences: 2,
        tardies: 1,
        lastAbsence: '2024-09-10',
        
        // Enrollment History
        enrolledDate: '2024-08-15',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'Sunshine Preschool'
      },
      {
        id: 2,
        studentName: 'Carlos Martinez',
        familyName: 'Martinez',
        dob: '2016-08-22',
        age: 8,
        grade: '2nd',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        
        baseTuition: 1200,
        discounts: [
          { type: 'Sibling', amount: 180, percentage: 15 }
        ],
        finalTuition: 1020,
        paymentStatus: 'current',
        paymentMethod: 'ESA',
        
        guardians: [
          { name: 'Maria Martinez', relation: 'Mother', phone: '555-0201', email: 'maria@email.com', preferredContact: true }
        ],
        address: '456 Oak Ave, Sunshine, FL 33xxx',
        
        freeReducedLunch: true,
        specialNeeds: false,
        allergies: [],
        accommodations: [],
        modifications: [],
        medications: [],
        
        favorites: 'Soccer enthusiast. Loves math games. Favorite food is pizza.',
        parentNotes: 'Single mom, very supportive. Speaks Spanish at home.',
        teacherNotes: 'Excelling in math. Great leader in group activities.',
        
        attendanceRate: 100,
        absences: 0,
        tardies: 0,
        lastAbsence: null,
        
        enrolledDate: '2024-08-10',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'Public Elementary'
      },
      {
        id: 3,
        studentName: 'Sofia Martinez',
        familyName: 'Martinez',
        dob: '2019-01-10',
        age: 5,
        grade: 'K',
        program: '3-Day Part-Time',
        teacher: 'Mr. David',
        
        baseTuition: 750,
        discounts: [
          { type: 'Sibling', amount: 112.50, percentage: 15 }
        ],
        finalTuition: 637.50,
        paymentStatus: 'current',
        paymentMethod: 'ESA',
        
        guardians: [
          { name: 'Maria Martinez', relation: 'Mother', phone: '555-0201', email: 'maria@email.com', preferredContact: true }
        ],
        address: '456 Oak Ave, Sunshine, FL 33xxx',
        
        freeReducedLunch: true,
        specialNeeds: false,
        allergies: ['Dairy'],
        accommodations: [],
        modifications: [],
        medications: [],
        
        favorites: 'Loves painting and music. Favorite animal is butterfly.',
        parentNotes: 'Younger sibling of Carlos. Very creative.',
        teacherNotes: 'Shy at first but warming up. Excellent creativity.',
        
        attendanceRate: 97,
        absences: 1,
        tardies: 2,
        lastAbsence: '2024-09-18',
        
        enrolledDate: '2024-08-10',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'None'
      },
      {
        id: 4,
        studentName: 'Noah Williams',
        familyName: 'Williams',
        dob: '2016-12-12',
        age: 7,
        grade: '2nd',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        
        baseTuition: 1200,
        discounts: [],
        finalTuition: 1200,
        paymentStatus: 'current',
        paymentMethod: 'Auto-pay',
        
        guardians: [
          { name: 'James Williams', relation: 'Father', phone: '555-0401', email: 'james@email.com', preferredContact: false },
          { name: 'Lisa Williams', relation: 'Mother', phone: '555-0402', email: 'lisa@email.com', preferredContact: true }
        ],
        address: '321 Pine Rd, Sunshine, FL 33xxx',
        
        freeReducedLunch: false,
        specialNeeds: true,
        allergies: [],
        accommodations: ['Extra time on tests', 'Preferential seating'],
        modifications: [],
        medications: [],
        
        favorites: 'Loves science experiments. Interested in dinosaurs and space.',
        parentNotes: 'Both parents very involved. Interested in gifted programs.',
        teacherNotes: 'Very bright, needs extra challenges. Works well independently.',
        
        attendanceRate: 99,
        absences: 1,
        tardies: 0,
        lastAbsence: '2024-09-05',
        
        enrolledDate: '2024-08-05',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'Highland Elementary'
      },
      {
        id: 5,
        studentName: 'Olivia Brown',
        familyName: 'Brown',
        dob: '2018-07-18',
        age: 6,
        grade: 'K',
        program: '5-Day Full-Time',
        teacher: 'Mr. David',
        
        baseTuition: 1200,
        discounts: [
          { type: 'Sibling', amount: 180, percentage: 15 },
          { type: 'Staff', amount: 510, percentage: 50 }
        ],
        finalTuition: 510,
        paymentStatus: 'current',
        paymentMethod: 'Staff Discount',
        
        guardians: [
          { name: 'Amanda Brown', relation: 'Mother', phone: '555-0501', email: 'amanda@email.com', preferredContact: true }
        ],
        address: '654 Maple Dr, Sunshine, FL 33xxx',
        
        freeReducedLunch: false,
        specialNeeds: false,
        allergies: [],
        accommodations: [],
        modifications: [],
        medications: [],
        
        favorites: 'Loves reading and animals. Wants to be a veterinarian.',
        parentNotes: 'Mom is teacher here. Very active in school community.',
        teacherNotes: 'Advanced reader. Very helpful with other students.',
        
        attendanceRate: 100,
        absences: 0,
        tardies: 0,
        lastAbsence: null,
        
        enrolledDate: '2024-08-01',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'Homeschool'
      },
      {
        id: 6,
        studentName: 'Ethan Brown',
        familyName: 'Brown',
        dob: '2020-03-25',
        age: 4,
        grade: 'Pre-K',
        program: '3-Day Part-Time',
        teacher: 'Mr. David',
        
        baseTuition: 750,
        discounts: [
          { type: 'Sibling', amount: 112.50, percentage: 15 },
          { type: 'Staff', amount: 318.75, percentage: 50 }
        ],
        finalTuition: 318.75,
        paymentStatus: 'current',
        paymentMethod: 'Staff Discount',
        
        guardians: [
          { name: 'Amanda Brown', relation: 'Mother', phone: '555-0501', email: 'amanda@email.com', preferredContact: true }
        ],
        address: '654 Maple Dr, Sunshine, FL 33xxx',
        
        freeReducedLunch: false,
        specialNeeds: false,
        allergies: ['Eggs'],
        accommodations: [],
        modifications: [],
        medications: [],
        
        favorites: 'Loves building with blocks. Favorite color is blue.',
        parentNotes: 'Younger sibling. Mom is on staff.',
        teacherNotes: 'Very energetic. Developing social skills well.',
        
        attendanceRate: 96,
        absences: 2,
        tardies: 3,
        lastAbsence: '2024-09-16',
        
        enrolledDate: '2024-08-01',
        startDate: '2024-08-19',
        yearsEnrolled: 1,
        previousSchool: 'None'
      }
    ];

    setEnrolledStudents(students);
  };

  // Calculate metrics
  const totalEnrollment = enrolledStudents.length;
  const averageAttendance = totalEnrollment > 0
    ? Math.round(enrolledStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / totalEnrollment)
    : 0;
  
  // Attrition % (students who left this year)
  const startOfYearCount = 30; // Would come from database
  const currentCount = totalEnrollment;
  const studentsLeft = startOfYearCount - currentCount;
  const attritionRate = Math.round((studentsLeft / startOfYearCount) * 100);
  
  // Retention % (students who stayed from last year)
  const lastYearCount = 25; // Would come from database
  const returningStudents = enrolledStudents.filter(s => s.yearsEnrolled > 1).length;
  const retentionRate = lastYearCount > 0 
    ? Math.round((returningStudents / lastYearCount) * 100)
    : 0;

  const filteredStudents = enrolledStudents.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.familyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    const matchesTeacher = selectedTeacher === 'all' || student.teacher === selectedTeacher;
    
    return matchesSearch && matchesProgram && matchesTeacher;
  });

  const relationshipIdeas = [
    { 
      title: 'Monthly Coffee Chat',
      description: 'Invite 3-4 families for informal morning coffee. Rotate monthly.',
      icon: HeartIcon,
      color: 'pink'
    },
    { 
      title: 'Birthday Recognition',
      description: 'Send personal video messages for student birthdays from their teacher.',
      icon: SparklesIcon,
      color: 'purple'
    },
    { 
      title: 'Progress Celebrations',
      description: 'Weekly postcards home highlighting one specific achievement.',
      icon: CheckCircleIcon,
      color: 'green'
    },
    { 
      title: 'Parent Skill Shares',
      description: 'Invite parents to share their professional skills or hobbies with class.',
      icon: LightBulbIcon,
      color: 'yellow'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enrollment Dashboard</h1>
              <p className="text-gray-600">Currently enrolled students and families</p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.href = '/crm/recruitment'}
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
          >
            View Recruitment Pipeline
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Enrollment</span>
            <UserGroupIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalEnrollment}</div>
          <div className="text-xs text-gray-500 mt-1">students enrolled</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Daily Attendance</span>
            <CalendarIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{averageAttendance}%</div>
          <div className="text-xs text-gray-500 mt-1">average this year</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Attrition Rate</span>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600">{attritionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">{studentsLeft} students left</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Retention Rate</span>
            <HeartIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">{retentionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">returned this year</div>
        </div>
      </div>

      {/* Relationship Nurturing Ideas */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HeartIcon className="h-6 w-6 text-pink-500" />
          Family Relationship Ideas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relationshipIdeas.map((idea, idx) => {
            const Icon = idea.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 text-${idea.color}-500`} />
                  <h4 className="font-semibold text-gray-900 text-sm">{idea.title}</h4>
                </div>
                <p className="text-xs text-gray-600">{idea.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or family name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Programs</option>
            <option value="5-Day Full-Time">5-Day Full-Time</option>
            <option value="3-Day Part-Time">3-Day Part-Time</option>
          </select>

          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="touch-target w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Teachers</option>
            <option value="Ms. Sarah">Ms. Sarah</option>
            <option value="Mr. David">Mr. David</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow">
        <div className="table-scroll">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program / Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                      <div className="text-sm text-gray-500">{student.familyName} Family • {student.grade} grade</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.program}</div>
                  <div className="text-sm text-gray-500">{student.teacher}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${student.finalTuition}</div>
                  {student.discounts.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {student.discounts.map(d => d.type).join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    student.attendanceRate >= 95 ? 'text-green-600' :
                    student.attendanceRate >= 90 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {student.attendanceRate}%
                  </div>
                  <div className="text-xs text-gray-500">{student.absences} absences</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.paymentStatus === 'current' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.paymentStatus === 'current' ? 'Current' : 'Past Due'}
                  </span>
                  {student.specialNeeds && (
                    <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      IEP
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowStudentDetail(true);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow mt-4">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

