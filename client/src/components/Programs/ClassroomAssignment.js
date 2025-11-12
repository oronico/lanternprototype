import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  PlusIcon,
  PencilIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Classroom Assignment System
 * 
 * Manages:
 * - Program definitions (5-day, 3-day, after-school, etc.)
 * - Teacher assignments to programs
 * - Student enrollment in programs
 * - Schedule (which days students attend)
 * 
 * This is the foundation for:
 * - Daily attendance (know who's expected each day)
 * - Teacher rosters
 * - Capacity planning
 * - Tuition calculation
 */

export default function ClassroomAssignment() {
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    analytics.trackPageView('classroom-assignment');
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    // Demo teachers
    setTeachers([
      { id: 1, name: 'Ms. Sarah Thompson', role: 'Lead Teacher', subjects: ['All Subjects'], active: true },
      { id: 2, name: 'Mr. David Kim', role: 'Assistant Teacher', subjects: ['All Subjects'], active: true },
      { id: 3, name: 'Ms. Emily Rodriguez', role: 'Specialist', subjects: ['Art', 'Music'], active: true }
    ]);

    // Demo programs with schedules
    setPrograms([
      {
        id: 1,
        name: '5-Day Full-Time',
        schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '8:00 AM - 3:00 PM',
        capacity: 16,
        enrolled: 14,
        leadTeacher: 'Ms. Sarah Thompson',
        leadTeacherId: 1,
        assistantTeacher: null,
        tuitionBase: 1200,
        ageRange: '5-10 years',
        grades: ['K', '1st', '2nd', '3rd']
      },
      {
        id: 2,
        name: '3-Day Part-Time',
        schedule: ['Monday', 'Wednesday', 'Friday'],
        hours: '8:00 AM - 12:00 PM',
        capacity: 12,
        enrolled: 8,
        leadTeacher: 'Mr. David Kim',
        leadTeacherId: 2,
        assistantTeacher: null,
        tuitionBase: 750,
        ageRange: '4-8 years',
        grades: ['Pre-K', 'K', '1st']
      },
      {
        id: 3,
        name: 'After-School Program',
        schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        hours: '3:00 PM - 6:00 PM',
        capacity: 20,
        enrolled: 6,
        leadTeacher: 'Mr. David Kim',
        leadTeacherId: 2,
        assistantTeacher: 'Ms. Emily Rodriguez',
        tuitionBase: 400,
        ageRange: '5-12 years',
        grades: ['K', '1st', '2nd', '3rd', '4th', '5th']
      }
    ]);

    // Demo student assignments
    setAssignments([
      {
        studentId: 1,
        studentName: 'Emma Johnson',
        familyName: 'Johnson',
        grade: 'K',
        programId: 1,
        programName: '5-Day Full-Time',
        leadTeacher: 'Ms. Sarah Thompson',
        startDate: '2024-08-19',
        tuition: 1200,
        expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      {
        studentId: 2,
        studentName: 'Noah Williams',
        familyName: 'Williams',
        grade: '2nd',
        programId: 1,
        programName: '5-Day Full-Time',
        leadTeacher: 'Ms. Sarah Thompson',
        startDate: '2024-08-19',
        tuition: 1200,
        expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      {
        studentId: 3,
        studentName: 'Carlos Martinez',
        familyName: 'Martinez',
        grade: '2nd',
        programId: 1,
        programName: '5-Day Full-Time',
        leadTeacher: 'Ms. Sarah Thompson',
        startDate: '2024-08-19',
        tuition: 1020,
        expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      {
        studentId: 4,
        studentName: 'Sofia Martinez',
        familyName: 'Martinez',
        grade: 'K',
        programId: 2,
        programName: '3-Day Part-Time',
        leadTeacher: 'Mr. David Kim',
        startDate: '2024-08-19',
        tuition: 637.50,
        expectedDays: ['Monday', 'Wednesday', 'Friday']
      },
      {
        studentId: 5,
        studentName: 'Olivia Brown',
        familyName: 'Brown',
        grade: 'K',
        programId: 2,
        programName: '3-Day Part-Time',
        leadTeacher: 'Mr. David Kim',
        startDate: '2024-08-19',
        tuition: 510,
        expectedDays: ['Monday', 'Wednesday', 'Friday']
      },
      {
        studentId: 6,
        studentName: 'Ethan Brown',
        familyName: 'Brown',
        grade: 'Pre-K',
        programId: 3,
        programName: 'After-School Program',
        leadTeacher: 'Mr. David Kim',
        startDate: '2024-08-19',
        tuition: 318.75,
        expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
      }
    ]);
  };

  const getStudentsInProgram = (programId) => {
    return assignments.filter(a => a.programId === programId);
  };

  const isStudentExpectedToday = (assignment, day = new Date().toLocaleDateString('en-US', { weekday: 'long' })) => {
    return assignment.expectedDays.includes(day);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Classroom Assignments</h1>
              <p className="text-gray-600">Assign students to programs and teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Overview */}
      <div className="space-y-6">
        {programs.map(program => {
          const studentsInProgram = getStudentsInProgram(program.id);
          const utilization = (studentsInProgram.length / program.capacity) * 100;
          
          return (
            <div key={program.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Program Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{program.name}</h3>
                    <div className="text-sm text-primary-100 mb-2">
                      {program.schedule.join(', ')} • {program.hours}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4" />
                        <span>Lead: {program.leadTeacher}</span>
                      </div>
                      {program.assistantTeacher && (
                        <div className="flex items-center gap-1">
                          <span>Assistant: {program.assistantTeacher}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-1">
                      {studentsInProgram.length}/{program.capacity}
                    </div>
                    <div className="text-sm text-primary-100">
                      {Math.round(utilization)}% capacity
                    </div>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-3">
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Age Range</div>
                    <div className="font-medium text-gray-900">{program.ageRange}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Grades</div>
                    <div className="font-medium text-gray-900">{program.grades.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Base Tuition</div>
                    <div className="font-medium text-gray-900">${program.tuitionBase}/mo</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Available Spots</div>
                    <div className="font-medium text-gray-900">{program.capacity - studentsInProgram.length}</div>
                  </div>
                </div>

                {/* Enrolled Students */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Enrolled Students ({studentsInProgram.length})
                  </h4>
                  
                  {studentsInProgram.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {studentsInProgram.map(student => (
                        <div key={student.studentId} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="font-medium text-gray-900">{student.studentName}</div>
                          <div className="text-sm text-gray-600">{student.familyName} • {student.grade} grade</div>
                          <div className="text-xs text-gray-500 mt-1">${student.tuition}/mo</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <UserGroupIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">No students enrolled yet</div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Assign Student
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" />
                    Edit Program
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    View Attendance
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

