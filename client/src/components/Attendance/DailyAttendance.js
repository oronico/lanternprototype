import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  FireIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { analytics } from '../../shared/analytics';
import { useEventEmit } from '../../shared/hooks/useEventBus';
import { DEMO_STUDENTS, PROGRAMS } from '../../data/centralizedMetrics';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

/**
 * Daily Attendance Capture
 * 
 * Features:
 * - Organized by program and teacher
 * - Quick present/absent/tardy marking
 * - Attendance streaks (gamification)
 * - Auto-nudges for absences/tardies
 * - Progress toward 95% goal
 * - Celebration for perfect attendance
 */

export default function DailyAttendance() {
  const emit = useEventEmit();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [attendanceData, setAttendanceData] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [todayStats, setTodayStats] = useState(null);

  useEffect(() => {
    analytics.trackPageView('daily-attendance');
    loadAttendanceData();
  }, [selectedDate]);

  const loadAttendanceData = () => {
    // Use centralized student data
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const studentsForAttendance = DEMO_STUDENTS.map(student => ({
      id: student._id,
      name: `${student.studentInfo.firstName} ${student.studentInfo.lastName}`,
      family: student.familyName,
      program: student.enrollment.programName,
      teacher: student.enrollment.leadTeacher,
      expectedToday: student.enrollment.expectedDays.includes(today),
      status: null,
      currentStreak: student.attendance.currentStreak,
      ytdAttendance: student.attendance.ytdRate,
      absences: student.attendance.ytdAbsent,
      tardies: student.attendance.ytdTardy,
      lastAbsence: student.attendance.lastAbsence,
      parentPhone: student.guardians[0]?.phone,
      needsNudge: student.attendance.ytdAbsent >= 2
    }));

    const initial = {};
    studentsForAttendance.forEach(s => {
      initial[s.id] = s.status;
    });
    
    setAttendanceData(initial);
    calculateStats(studentsForAttendance, initial);
  };

  const calculateStats = (students, data) => {
    const expected = students.filter(s => s.expectedToday).length;
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
  };

  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => {
      const updated = { ...prev, [studentId]: status };
      
      // Recalculate stats with updated data
      const students = getFilteredStudents();
      calculateStats(students, updated);
      
      return updated;
    });

    analytics.trackFeatureUsage('dailyAttendance', 'mark_attendance', {
      status: status,
      date: selectedDate
    });

    // Check if this completes attendance for the day
    const students = getFilteredStudents();
    const newData = { ...attendanceData, [studentId]: status };
    const marked = Object.values(newData).filter(v => v !== null).length;
    
    if (marked === students.filter(s => s.expectedToday).length) {
      // All attendance marked!
      const allPresent = Object.values(newData).every(v => v === 'present');
      
      if (allPresent) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
        toast.success('🎉 Perfect attendance today!');
        
        emit('attendance.perfect_day', {
          date: selectedDate,
          studentCount: students.length
        });
      } else {
        toast.success('✅ Attendance complete for today!');
      }
      
      emit('attendance.completed', {
        date: selectedDate,
        stats: todayStats
      });
    }

    // Check for absence nudge
    if (status === 'absent') {
      const student = students.find(s => s.id === studentId);
      if (student) {
        emit('attendance.absence', {
          student: student,
          date: selectedDate,
          absenceCount: student.absences + 1
        });
      }
    }
  };

  const getFilteredStudents = () => {
    // Use centralized student data
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const allStudents = DEMO_STUDENTS.map(student => ({
      id: student._id,
      name: `${student.studentInfo.firstName} ${student.studentInfo.lastName}`,
      family: student.familyName,
      program: student.enrollment.programName,
      teacher: student.enrollment.leadTeacher,
      expectedToday: student.enrollment.expectedDays.includes(today),
      currentStreak: student.attendance.currentStreak,
      ytdAttendance: student.attendance.ytdRate,
      absences: student.attendance.ytdAbsent,
      tardies: student.attendance.ytdTardy,
      needsNudge: student.attendance.ytdAbsent >= 2
    }));
    
    return selectedProgram === 'all'
      ? allStudents
      : allStudents.filter(s => s.program === selectedProgram);
  };
      {
        id: 1,
        name: 'Emma Johnson',
        family: 'Johnson',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        expectedToday: true,
        currentStreak: 45,
        ytdAttendance: 98,
        absences: 2,
        tardies: 1,
        needsNudge: false
      },
      {
        id: 2,
        name: 'Noah Williams',
        family: 'Williams',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        expectedToday: true,
        currentStreak: 52,
        ytdAttendance: 99,
        absences: 1,
        tardies: 0,
        needsNudge: false
      },
      {
        id: 3,
        name: 'Carlos Martinez',
        family: 'Martinez',
        program: '5-Day Full-Time',
        teacher: 'Ms. Sarah',
        expectedToday: true,
        currentStreak: 60,
        ytdAttendance: 100,
        absences: 0,
        tardies: 0,
        needsNudge: false
      },
      {
        id: 4,
        name: 'Sofia Martinez',
        family: 'Martinez',
        program: '3-Day Part-Time',
        teacher: 'Mr. David',
        expectedToday: true,
        currentStreak: 28,
        ytdAttendance: 97,
        absences: 1,
        tardies: 2,
        needsNudge: false
      },
      {
        id: 5,
        name: 'Olivia Brown',
        family: 'Brown',
        program: '3-Day Part-Time',
        teacher: 'Mr. David',
        expectedToday: true,
        currentStreak: 60,
        ytdAttendance: 100,
        absences: 0,
        tardies: 0,
        needsNudge: false
      },
      {
        id: 6,
        name: 'Ethan Brown',
        family: 'Brown',
        program: 'After-School',
        teacher: 'Mr. David',
        expectedToday: true,
        currentStreak: 25,
        ytdAttendance: 96,
        absences: 2,
        tardies: 3,
        needsNudge: true,
        nudgeReason: '2 absences in last 2 weeks'
      }
    ];

    return selectedProgram === 'all'
      ? allStudents
      : allStudents.filter(s => s.program === selectedProgram);
  };

  const students = getFilteredStudents();
  const programs = [...new Set(students.map(s => s.program))];

  // Group students by program
  const studentsByProgram = students.reduce((acc, student) => {
    if (!acc[student.program]) {
      acc[student.program] = [];
    }
    acc[student.program].push(student);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {showCelebration && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
              <p className="text-gray-600">Mark attendance by program and teacher</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Today's Stats - Gamified! */}
      {todayStats && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Expected Today</div>
            <div className="text-3xl font-bold text-gray-900">{todayStats.expected}</div>
            <div className="text-xs text-gray-500 mt-1">students</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Present</div>
            <div className="text-3xl font-bold text-green-600">{todayStats.present}</div>
            <div className="text-xs text-gray-500 mt-1">here today</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Attendance Rate</div>
            <div className={`text-3xl font-bold ${
              todayStats.rate >= 95 ? 'text-green-600' :
              todayStats.rate >= 90 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {todayStats.rate}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {todayStats.rate >= 95 ? '🎉 Excellent!' : 
               todayStats.rate >= 90 ? '👍 Good' : 
               '⚠️ Below target'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="text-3xl font-bold text-primary-600">
              {todayStats.marked}/{todayStats.expected}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(todayStats.marked / todayStats.expected) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Streak</div>
            <div className="text-3xl font-bold text-orange-600 flex items-center gap-2">
              <FireIcon className="h-8 w-8" />
              15
            </div>
            <div className="text-xs text-gray-500 mt-1">days taking attendance!</div>
          </div>
        </div>
      )}

      {/* Program Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedProgram('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedProgram === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Programs
        </button>
        {programs.map(program => (
          <button
            key={program}
            onClick={() => setSelectedProgram(program)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedProgram === program
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {program}
          </button>
        ))}
      </div>

      {/* Attendance by Program */}
      <div className="space-y-6">
        {Object.entries(studentsByProgram).map(([programName, programStudents]) => {
          const teacher = programStudents[0]?.teacher;
          const programPresent = programStudents.filter(s => attendanceData[s.id] === 'present').length;
          const programExpected = programStudents.filter(s => s.expectedToday).length;
          const programRate = programExpected > 0 ? Math.round((programPresent / programExpected) * 100) : 0;
          
          return (
            <div key={programName} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Program Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{programName}</h3>
                    <div className="text-sm text-primary-100">{teacher} • {programStudents.length} students</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{programRate}%</div>
                    <div className="text-xs text-primary-100">{programPresent}/{programExpected} present</div>
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="divide-y divide-gray-200">
                {programStudents.map(student => {
                  const status = attendanceData[student.id];
                  
                  return (
                    <div key={student.id} className={`px-6 py-4 flex items-center justify-between ${
                      student.needsNudge ? 'bg-orange-50' : ''
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">
                              {student.family} Family
                              {student.currentStreak >= 30 && (
                                <span className="ml-2 text-orange-600">
                                  🔥 {student.currentStreak} day streak!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {student.needsNudge && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-orange-700">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>{student.nudgeReason} - Call parent?</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Attendance Stats */}
                        <div className="text-right text-sm mr-4">
                          <div className={`font-medium ${
                            student.ytdAttendance >= 95 ? 'text-green-600' :
                            student.ytdAttendance >= 90 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {student.ytdAttendance}% YTD
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.absences}A / {student.tardies}T
                          </div>
                        </div>

                        {/* Quick Mark Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAttendance(student.id, 'present')}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              status === 'present'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                            title="Present"
                          >
                            <CheckCircleIcon className={`h-6 w-6 ${
                              status === 'present' ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </button>

                          <button
                            onClick={() => markAttendance(student.id, 'tardy')}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              status === 'tardy'
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-300 hover:border-yellow-400'
                            }`}
                            title="Tardy"
                          >
                            <ClockIcon className={`h-6 w-6 ${
                              status === 'tardy' ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                          </button>

                          <button
                            onClick={() => markAttendance(student.id, 'absent')}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              status === 'absent'
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 hover:border-red-400'
                            }`}
                            title="Absent"
                          >
                            <XCircleIcon className={`h-6 w-6 ${
                              status === 'absent' ? 'text-red-600' : 'text-gray-400'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions for Attendance Nudges */}
      {students.filter(s => s.needsNudge).length > 0 && (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6" />
            Attendance Follow-ups Needed
          </h3>
          
          <div className="space-y-3">
            {students.filter(s => s.needsNudge).map(student => (
              <div key={student.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{student.name} ({student.family})</div>
                  <div className="text-sm text-gray-600">{student.nudgeReason}</div>
                </div>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                  Call {student.parentPhone}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gamification: Progress Toward Goal */}
      {todayStats && todayStats.rate < 95 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6" />
            Progress Toward 95% Attendance Goal
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-700">Current: {todayStats.rate}%</span>
                <span className="text-blue-700">Goal: 95%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${(todayStats.rate / 95) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {95 - todayStats.rate > 0 ? `${95 - todayStats.rate}%` : '🎯'}
            </div>
          </div>
          <div className="text-sm text-blue-700 mt-3">
            {95 - todayStats.rate > 0 
              ? `Just ${95 - todayStats.rate}% away from your goal!`
              : 'Goal achieved! 🎉'}
          </div>
        </div>
      )}
    </div>
  );
}

