import React, { useState } from 'react';
import {
  XMarkIcon,
  UserPlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { PROGRAMS, TEACHERS } from '../../data/centralizedMetrics';
import { analytics } from '../../shared/analytics';
import toast from 'react-hot-toast';

/**
 * Add Student Modal - Working Form
 * 
 * Captures all essential student information:
 * - Student info (name, DOB, grade)
 * - Family info
 * - Guardian contact info
 * - Program assignment
 * - Teacher assignment
 * - Tuition and discounts
 */

export default function AddStudentModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    // Student Info
    firstName: '',
    lastName: '',
    preferredName: '',
    dob: '',
    grade: '',
    gender: '',
    
    // Family Info
    familyName: '',
    
    // Primary Guardian
    guardianFirstName: '',
    guardianLastName: '',
    guardianRelation: 'Mother',
    guardianPhone: '',
    guardianEmail: '',
    
    // Enrollment
    programId: '',
    
    // Tuition
    baseTuition: 1200,
    discountType: 'none',
    discountAmount: 0,
    
    // Health
    allergies: '',
    specialNeeds: false,
    freeReducedLunch: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set family name from last name if not set
    if (field === 'lastName' && !formData.familyName) {
      setFormData(prev => ({ ...prev, familyName: value }));
    }
    
    // Auto-set base tuition when program selected
    if (field === 'programId') {
      const program = PROGRAMS.find(p => p.id === value);
      if (program) {
        setFormData(prev => ({ ...prev, baseTuition: program.baseTuition }));
      }
    }
  };

  const calculateFinalTuition = () => {
    if (formData.discountType === 'none') return formData.baseTuition;
    
    if (formData.discountType === 'percent') {
      return formData.baseTuition - (formData.baseTuition * (formData.discountAmount / 100));
    }
    
    return formData.baseTuition - formData.discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.grade) {
      toast.error('Please fill in all required student information');
      return;
    }
    
    if (!formData.guardianFirstName || !formData.guardianPhone || !formData.guardianEmail) {
      toast.error('Please fill in guardian contact information');
      return;
    }
    
    if (!formData.programId) {
      toast.error('Please select a program');
      return;
    }
    
    // Get program and teacher info
    const selectedProgram = PROGRAMS.find(p => p.id === formData.programId);
    
    // Create student object
    const newStudent = {
      _id: `stu_${Date.now()}`,
      studentInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferredName: formData.preferredName || formData.firstName,
        dob: formData.dob,
        age: new Date().getFullYear() - new Date(formData.dob).getFullYear(),
        gender: formData.gender,
        grade: formData.grade
      },
      familyId: `fam_${Date.now()}`,
      familyName: formData.familyName,
      guardians: [
        {
          id: `g_${Date.now()}`,
          firstName: formData.guardianFirstName,
          lastName: formData.guardianLastName,
          relation: formData.guardianRelation,
          phone: formData.guardianPhone,
          email: formData.guardianEmail,
          isPrimary: true,
          emergencyContact: true,
          pickupAuthorized: true
        }
      ],
      siblings: [],
      enrollment: {
        programId: formData.programId,
        programName: selectedProgram.name,
        leadTeacherId: selectedProgram.teacherId,
        leadTeacher: selectedProgram.leadTeacher,
        enrolledDate: new Date().toISOString().split('T')[0],
        firstDayAttended: new Date().toISOString().split('T')[0],
        expectedDays: selectedProgram.schedule,
        status: 'active'
      },
      tuition: {
        baseTuition: formData.baseTuition,
        discounts: formData.discountType !== 'none' ? [{
          type: formData.discountType,
          amount: formData.discountAmount
        }] : [],
        finalTuition: calculateFinalTuition(),
        paymentMethod: 'Not Set',
        paymentStatus: 'current'
      },
      documents: {
        handbookSigned: false,
        enrollmentContractSigned: false,
        missingDocuments: ['Handbook', 'Enrollment Contract']
      },
      health: {
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        specialNeeds: formData.specialNeeds,
        freeReducedLunch: formData.freeReducedLunch,
        accommodations: [],
        medications: []
      },
      attendance: {
        ytdRate: 100,
        ytdAbsent: 0,
        ytdTardy: 0,
        currentStreak: 0
      }
    };
    
    analytics.trackFeatureUsage('enrolledStudentsSIS', 'add_student', {
      program: selectedProgram.name,
      grade: formData.grade
    });
    
    onAdd(newStudent);
    toast.success(`${formData.firstName} ${formData.lastName} added successfully!`);
    onClose();
  };

  if (!isOpen) return null;

  const finalTuition = calculateFinalTuition();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlusIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Emma"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Johnson"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select grade...</option>
                  <option value="Pre-K">Pre-K</option>
                  <option value="K">Kindergarten</option>
                  <option value="1st">1st Grade</option>
                  <option value="2nd">2nd Grade</option>
                  <option value="3rd">3rd Grade</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Primary Guardian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianFirstName}
                  onChange={(e) => handleChange('guardianFirstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianLastName}
                  onChange={(e) => handleChange('guardianLastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.guardianPhone}
                  onChange={(e) => handleChange('guardianPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="555-1234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.guardianEmail}
                  onChange={(e) => handleChange('guardianEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="parent@email.com"
                />
              </div>
            </div>
          </div>

          {/* Program & Teacher */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Program Assignment</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Program *
              </label>
              <select
                required
                value={formData.programId}
                onChange={(e) => handleChange('programId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose program...</option>
                {PROGRAMS.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name} - {program.leadTeacher} - ${program.baseTuition}/mo
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tuition & Discounts */}
          {formData.programId && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Tuition</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Tuition
                  </label>
                  <div className="text-2xl font-bold text-gray-900">
                    ${formData.baseTuition}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleChange('discountType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="none">No Discount</option>
                    <option value="Sibling">Sibling Discount</option>
                    <option value="Staff">Staff Discount</option>
                    <option value="Need-Based">Need-Based Discount</option>
                  </select>
                </div>
              </div>
              
              {formData.discountType !== 'none' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={formData.discountAmount}
                        onChange={(e) => handleChange('discountAmount', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="180"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Final Tuition:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${finalTuition.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Health Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Health Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Peanuts, Dairy, etc."
                />
              </div>
              
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specialNeeds}
                    onChange={(e) => handleChange('specialNeeds', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Special Needs / IEP</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.freeReducedLunch}
                    onChange={(e) => handleChange('freeReducedLunch', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Free/Reduced Lunch</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

