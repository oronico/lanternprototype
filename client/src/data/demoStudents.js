/**
 * Demo Student Data - 20+ Students for Investor Demo
 * 
 * Shows realistic microschool with:
 * - 3 programs (Full-Time, 3-Day, After-School)
 * - 2 teachers
 * - Diverse scenarios (siblings, staff kids, ESA, special needs, etc.)
 * - Real-world challenges and successes
 */

export const DEMO_STUDENTS = [
  // 5-DAY FULL-TIME PROGRAM (10 students)
  {
    _id: 'stu_001',
    studentInfo: {
      firstName: 'Emma',
      lastName: 'Johnson',
      preferredName: 'Emma',
      dob: '2018-03-15',
      age: 6,
      gender: 'Female',
      grade: 'K'
    },
    familyId: 'fam_001',
    familyName: 'Johnson',
    guardians: [
      { firstName: 'Sarah', lastName: 'Johnson', relation: 'Mother', phone: '555-0101', email: 'sarah.j@email.com', isPrimary: true }
    ],
    siblings: [],
    enrollment: {
      programId: 'prog_001',
      programName: '5-Day Full-Time',
      leadTeacher: 'Ms. Sarah Thompson',
      enrolledDate: '2024-08-15',
      expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: ['Peanuts'], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 98, ytdAbsent: 1, ytdTardy: 1, currentStreak: 45 }
  },
  
  {
    _id: 'stu_002',
    studentInfo: { firstName: 'Noah', lastName: 'Williams', preferredName: 'Noah', dob: '2016-12-12', age: 7, gender: 'Male', grade: '2nd' },
    familyId: 'fam_002',
    familyName: 'Williams',
    guardians: [
      { firstName: 'James', lastName: 'Williams', relation: 'Father', phone: '555-0401', email: 'james.w@email.com', isPrimary: false },
      { firstName: 'Lisa', lastName: 'Williams', relation: 'Mother', phone: '555-0402', email: 'lisa.w@email.com', isPrimary: true }
    ],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-05', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: true, accommodations: ['Extra time on tests'], freeReducedLunch: false },
    attendance: { ytdRate: 99, ytdAbsent: 1, ytdTardy: 0, currentStreak: 52 }
  },
  
  {
    _id: 'stu_003',
    studentInfo: { firstName: 'Carlos', lastName: 'Martinez', preferredName: 'Carlos', dob: '2016-08-22', age: 8, gender: 'Male', grade: '2nd' },
    familyId: 'fam_003',
    familyName: 'Martinez',
    guardians: [{ firstName: 'Maria', lastName: 'Martinez', relation: 'Mother', phone: '555-0201', email: 'maria.m@email.com', isPrimary: true }],
    siblings: ['stu_011'],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-10', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [{ type: 'Sibling', amount: 180 }], finalTuition: 1020, paymentMethod: 'ClassWallet ESA', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: true },
    attendance: { ytdRate: 100, ytdAbsent: 0, ytdTardy: 0, currentStreak: 60 }
  },
  
  {
    _id: 'stu_004',
    studentInfo: { firstName: 'Mia', lastName: 'Chen', preferredName: 'Mia', dob: '2017-05-30', age: 7, gender: 'Female', grade: '1st' },
    familyId: 'fam_004',
    familyName: 'Chen',
    guardians: [
      { firstName: 'Wei', lastName: 'Chen', relation: 'Father', phone: '555-0301', email: 'wei.c@email.com', isPrimary: false },
      { firstName: 'Lin', lastName: 'Chen', relation: 'Mother', phone: '555-0302', email: 'lin.c@email.com', isPrimary: true }
    ],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-12', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: false, missingDocuments: ['Enrollment Contract'] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 97, ytdAbsent: 2, ytdTardy: 1, currentStreak: 12 }
  },
  
  {
    _id: 'stu_005',
    studentInfo: { firstName: 'Liam', lastName: 'Anderson', preferredName: 'Liam', dob: '2017-11-08', age: 6, gender: 'Male', grade: '1st' },
    familyId: 'fam_005',
    familyName: 'Anderson',
    guardians: [{ firstName: 'Jennifer', lastName: 'Anderson', relation: 'Mother', phone: '555-0501', email: 'jen.a@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: ['Dairy'], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 96, ytdAbsent: 2, ytdTardy: 2, currentStreak: 8 }
  },
  
  {
    _id: 'stu_006',
    studentInfo: { firstName: 'Ava', lastName: 'Taylor', preferredName: 'Ava', dob: '2018-02-14', age: 6, gender: 'Female', grade: 'K' },
    familyId: 'fam_006',
    familyName: 'Taylor',
    guardians: [
      { firstName: 'Michael', lastName: 'Taylor', relation: 'Father', phone: '555-0601', email: 'michael.t@email.com', isPrimary: true }
    ],
    siblings: ['stu_012'],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [{ type: 'Sibling', amount: 180 }], finalTuition: 1020, paymentMethod: 'ClassWallet ESA', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: true },
    attendance: { ytdRate: 99, ytdAbsent: 0, ytdTardy: 1, currentStreak: 40 }
  },
  
  {
    _id: 'stu_007',
    studentInfo: { firstName: 'Isabella', lastName: 'Garcia', preferredName: 'Bella', dob: '2017-07-22', age: 7, gender: 'Female', grade: '1st' },
    familyId: 'fam_007',
    familyName: 'Garcia',
    guardians: [{ firstName: 'Rosa', lastName: 'Garcia', relation: 'Mother', phone: '555-0701', email: 'rosa.g@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [{ type: 'Need-Based', amount: 300 }], finalTuition: 900, paymentMethod: 'ClassWallet ESA', paymentStatus: 'current' },
    documents: { handbookSigned: false, enrollmentContractSigned: true, missingDocuments: ['Handbook'] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: true },
    attendance: { ytdRate: 95, ytdAbsent: 3, ytdTardy: 0, currentStreak: 22 }
  },
  
  {
    _id: 'stu_008',
    studentInfo: { firstName: 'Lucas', lastName: 'Brown', preferredName: 'Luke', dob: '2016-09-30', age: 8, gender: 'Male', grade: '2nd' },
    familyId: 'fam_008',
    familyName: 'Brown',
    guardians: [{ firstName: 'Amanda', lastName: 'Brown', relation: 'Mother', phone: '555-0801', email: 'amanda.b@email.com', isPrimary: true }],
    siblings: ['stu_013', 'stu_019'],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-01', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [{ type: 'Staff', amount: 600 }], finalTuition: 600, paymentMethod: 'Staff Discount', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 100, ytdAbsent: 0, ytdTardy: 0, currentStreak: 60 }
  },
  
  {
    _id: 'stu_009',
    studentInfo: { firstName: 'Sophia', lastName: 'Lee', preferredName: 'Sophia', dob: '2018-01-18', age: 6, gender: 'Female', grade: 'K' },
    familyId: 'fam_009',
    familyName: 'Lee',
    guardians: [{ firstName: 'David', lastName: 'Lee', relation: 'Father', phone: '555-0901', email: 'david.l@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 97, ytdAbsent: 2, ytdTardy: 0, currentStreak: 25 }
  },
  
  {
    _id: 'stu_010',
    studentInfo: { firstName: 'Jackson', lastName: 'White', preferredName: 'Jack', dob: '2017-04-12', age: 7, gender: 'Male', grade: '1st' },
    familyId: 'fam_010',
    familyName: 'White',
    guardians: [{ firstName: 'Rebecca', lastName: 'White', relation: 'Mother', phone: '555-1001', email: 'rebecca.w@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '5-Day Full-Time', leadTeacher: 'Ms. Sarah Thompson', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    tuition: { baseTuition: 1200, discounts: [], finalTuition: 1200, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 98, ytdAbsent: 1, ytdTardy: 1, currentStreak: 35 }
  },
  
  // 3-DAY PART-TIME PROGRAM (8 students)
  {
    _id: 'stu_011',
    studentInfo: { firstName: 'Sofia', lastName: 'Martinez', preferredName: 'Sofia', dob: '2019-01-10', age: 5, gender: 'Female', grade: 'K' },
    familyId: 'fam_003',
    familyName: 'Martinez',
    guardians: [{ firstName: 'Maria', lastName: 'Martinez', relation: 'Mother', phone: '555-0201', email: 'maria.m@email.com', isPrimary: true }],
    siblings: ['stu_003'],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-10', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [{ type: 'Sibling', amount: 112.50 }], finalTuition: 637.50, paymentMethod: 'ClassWallet ESA', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: ['Dairy'], specialNeeds: false, freeReducedLunch: true },
    attendance: { ytdRate: 97, ytdAbsent: 1, ytdTardy: 2, currentStreak: 28 }
  },
  
  {
    _id: 'stu_012',
    studentInfo: { firstName: 'Oliver', lastName: 'Taylor', preferredName: 'Ollie', dob: '2019-06-03', age: 5, gender: 'Male', grade: 'K' },
    familyId: 'fam_006',
    familyName: 'Taylor',
    guardians: [{ firstName: 'Michael', lastName: 'Taylor', relation: 'Father', phone: '555-0601', email: 'michael.t@email.com', isPrimary: true }],
    siblings: ['stu_006'],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [{ type: 'Sibling', amount: 112.50 }], finalTuition: 637.50, paymentMethod: 'ClassWallet ESA', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: true },
    attendance: { ytdRate: 100, ytdAbsent: 0, ytdTardy: 0, currentStreak: 30 }
  },
  
  {
    _id: 'stu_013',
    studentInfo: { firstName: 'Olivia', lastName: 'Brown', preferredName: 'Olivia', dob: '2018-07-18', age: 6, gender: 'Female', grade: 'K' },
    familyId: 'fam_008',
    familyName: 'Brown',
    guardians: [{ firstName: 'Amanda', lastName: 'Brown', relation: 'Mother', phone: '555-0801', email: 'amanda.b@email.com', isPrimary: true }],
    siblings: ['stu_008', 'stu_019'],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-01', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [{ type: 'Sibling', amount: 112.50 }, { type: 'Staff', amount: 318.75 }], finalTuition: 318.75, paymentMethod: 'Staff Discount', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 100, ytdAbsent: 0, ytdTardy: 0, currentStreak: 60 }
  },
  
  {
    _id: 'stu_014',
    studentInfo: { firstName: 'Mason', lastName: 'Davis', preferredName: 'Mason', dob: '2018-10-05', age: 5, gender: 'Male', grade: 'K' },
    familyId: 'fam_011',
    familyName: 'Davis',
    guardians: [{ firstName: 'Emily', lastName: 'Davis', relation: 'Mother', phone: '555-1101', email: 'emily.d@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [], finalTuition: 750, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 98, ytdAbsent: 1, ytdTardy: 0, currentStreak: 18 }
  },
  
  {
    _id: 'stu_015',
    studentInfo: { firstName: 'Harper', lastName: 'Miller', preferredName: 'Harper', dob: '2019-03-28', age: 5, gender: 'Female', grade: 'Pre-K' },
    familyId: 'fam_012',
    familyName: 'Miller',
    guardians: [{ firstName: 'Sarah', lastName: 'Miller', relation: 'Mother', phone: '555-1201', email: 'sarah.m@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [], finalTuition: 750, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: ['Eggs'], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 94, ytdAbsent: 2, ytdTardy: 3, currentStreak: 5 }
  },
  
  {
    _id: 'stu_016',
    studentInfo: { firstName: 'Elijah', lastName: 'Wilson', preferredName: 'Eli', dob: '2018-12-15', age: 5, gender: 'Male', grade: 'K' },
    familyId: 'fam_013',
    familyName: 'Wilson',
    guardians: [{ firstName: 'Thomas', lastName: 'Wilson', relation: 'Father', phone: '555-1301', email: 'thomas.w@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [], finalTuition: 750, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 100, ytdAbsent: 0, ytdTardy: 0, currentStreak: 30 }
  },
  
  {
    _id: 'stu_017',
    studentInfo: { firstName: 'Charlotte', lastName: 'Moore', preferredName: 'Charlie', dob: '2019-05-20', age: 5, gender: 'Female', grade: 'Pre-K' },
    familyId: 'fam_014',
    familyName: 'Moore',
    guardians: [{ firstName: 'Jessica', lastName: 'Moore', relation: 'Mother', phone: '555-1401', email: 'jessica.m@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [], finalTuition: 750, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 97, ytdAbsent: 1, ytdTardy: 1, currentStreak: 20 }
  },
  
  {
    _id: 'stu_018',
    studentInfo: { firstName: 'Amelia', lastName: 'Thomas', preferredName: 'Amy', dob: '2019-02-08', age: 5, gender: 'Female', grade: 'Pre-K' },
    familyId: 'fam_015',
    familyName: 'Thomas',
    guardians: [{ firstName: 'Christopher', lastName: 'Thomas', relation: 'Father', phone: '555-1501', email: 'chris.t@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: '3-Day Part-Time', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Wednesday', 'Friday'] },
    tuition: { baseTuition: 750, discounts: [], finalTuition: 750, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 96, ytdAbsent: 2, ytdTardy: 0, currentStreak: 15 }
  },
  
  // AFTER-SCHOOL PROGRAM (6 students)
  {
    _id: 'stu_019',
    studentInfo: { firstName: 'Ethan', lastName: 'Brown', preferredName: 'Ethan', dob: '2020-03-25', age: 4, gender: 'Male', grade: 'Pre-K' },
    familyId: 'fam_008',
    familyName: 'Brown',
    guardians: [{ firstName: 'Amanda', lastName: 'Brown', relation: 'Mother', phone: '555-0801', email: 'amanda.b@email.com', isPrimary: true }],
    siblings: ['stu_008', 'stu_013'],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-01', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [{ type: 'Sibling', amount: 60 }, { type: 'Staff', amount: 170 }], finalTuition: 170, paymentMethod: 'Staff Discount', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: ['Eggs'], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 92, ytdAbsent: 4, ytdTardy: 3, currentStreak: 8 }
  },
  
  {
    _id: 'stu_020',
    studentInfo: { firstName: 'Benjamin', lastName: 'Harris', preferredName: 'Ben', dob: '2017-08-14', age: 7, gender: 'Male', grade: '1st' },
    familyId: 'fam_016',
    familyName: 'Harris',
    guardians: [{ firstName: 'Daniel', lastName: 'Harris', relation: 'Father', phone: '555-1601', email: 'daniel.h@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [], finalTuition: 400, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 95, ytdAbsent: 2, ytdTardy: 1, currentStreak: 18 }
  },
  
  {
    _id: 'stu_021',
    studentInfo: { firstName: 'Abigail', lastName: 'Martin', preferredName: 'Abby', dob: '2018-11-22', age: 5, gender: 'Female', grade: 'K' },
    familyId: 'fam_017',
    familyName: 'Martin',
    guardians: [{ firstName: 'Laura', lastName: 'Martin', relation: 'Mother', phone: '555-1701', email: 'laura.m@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [], finalTuition: 400, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 97, ytdAbsent: 1, ytdTardy: 1, currentStreak: 22 }
  },
  
  {
    _id: 'stu_022',
    studentInfo: { firstName: 'James', lastName: 'Thompson', preferredName: 'Jamie', dob: '2017-12-10', age: 6, gender: 'Male', grade: '1st' },
    familyId: 'fam_018',
    familyName: 'Thompson',
    guardians: [{ firstName: 'Robert', lastName: 'Thompson', relation: 'Father', phone: '555-1801', email: 'robert.t@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [], finalTuition: 400, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: false, enrollmentContractSigned: true, missingDocuments: ['Handbook'] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 93, ytdAbsent: 3, ytdTardy: 2, currentStreak: 10 }
  },
  
  {
    _id: 'stu_023',
    studentInfo: { firstName: 'Evelyn', lastName: 'Jackson', preferredName: 'Evie', dob: '2018-04-17', age: 6, gender: 'Female', grade: 'K' },
    familyId: 'fam_019',
    familyName: 'Jackson',
    guardians: [{ firstName: 'Michelle', lastName: 'Jackson', relation: 'Mother', phone: '555-1901', email: 'michelle.j@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [], finalTuition: 400, paymentMethod: 'Stripe', paymentStatus: 'pastDue' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 88, ytdAbsent: 6, ytdTardy: 2, currentStreak: 0 }
  },
  
  {
    _id: 'stu_024',
    studentInfo: { firstName: 'Alexander', lastName: 'Martinez', preferredName: 'Alex', dob: '2019-09-12', age: 5, gender: 'Male', grade: 'Pre-K' },
    familyId: 'fam_020',
    familyName: 'Martinez',
    guardians: [{ firstName: 'Carlos', lastName: 'Martinez Sr.', relation: 'Father', phone: '555-2001', email: 'carlos.m@email.com', isPrimary: true }],
    siblings: [],
    enrollment: { programName: 'After-School Program', leadTeacher: 'Mr. David Kim', enrolledDate: '2024-08-19', expectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
    tuition: { baseTuition: 400, discounts: [], finalTuition: 400, paymentMethod: 'Stripe', paymentStatus: 'current' },
    documents: { handbookSigned: true, enrollmentContractSigned: true, missingDocuments: [] },
    health: { allergies: [], specialNeeds: false, freeReducedLunch: false },
    attendance: { ytdRate: 96, ytdAbsent: 2, ytdTardy: 0, currentStreak: 20 }
  }
];

export const PROGRAMS = [
  {
    id: 'prog_001',
    name: '5-Day Full-Time',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hours: '8:00 AM - 3:00 PM',
    capacity: 16,
    baseTuition: 1200,
    leadTeacher: 'Ms. Sarah Thompson',
    teacherId: 'teach_001'
  },
  {
    id: 'prog_002',
    name: '3-Day Part-Time',
    schedule: ['Monday', 'Wednesday', 'Friday'],
    hours: '8:00 AM - 12:00 PM',
    capacity: 12,
    baseTuition: 750,
    leadTeacher: 'Mr. David Kim',
    teacherId: 'teach_002'
  },
  {
    id: 'prog_003',
    name: 'After-School Program',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    hours: '3:00 PM - 6:00 PM',
    capacity: 20,
    baseTuition: 400,
    leadTeacher: 'Mr. David Kim',
    teacherId: 'teach_002'
  }
];

export const TEACHERS = [
  {
    id: 'teach_001',
    name: 'Ms. Sarah Thompson',
    role: 'Lead Teacher',
    email: 'sarah.t@school.com',
    phone: '555-TEACH1',
    programs: ['5-Day Full-Time'],
    active: true
  },
  {
    id: 'teach_002',
    name: 'Mr. David Kim',
    role: 'Assistant Teacher',
    email: 'david.k@school.com',
    phone: '555-TEACH2',
    programs: ['3-Day Part-Time', 'After-School Program'],
    active: true
  }
];

// Calculate totals for dashboard
export const calculateEnrollmentMetrics = (students) => {
  const totalEnrollment = students.length;
  const byProgram = {
    'full-time': students.filter(s => s.enrollment.programName === '5-Day Full-Time').length,
    'part-time': students.filter(s => s.enrollment.programName === '3-Day Part-Time').length,
    'after-school': students.filter(s => s.enrollment.programName === 'After-School Program').length
  };
  
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendance.ytdRate, 0) / students.length
  );
  
  const missingContracts = students.filter(s => 
    !s.documents.handbookSigned || 
    !s.documents.enrollmentContractSigned ||
    s.documents.missingDocuments.length > 0
  ).length;
  
  const paymentCurrent = students.filter(s => s.tuition.paymentStatus === 'current').length;
  const paymentPastDue = students.filter(s => s.tuition.paymentStatus === 'pastDue').length;
  
  const totalMonthlyRevenue = students.reduce((sum, s) => sum + s.tuition.finalTuition, 0);
  
  return {
    totalEnrollment,
    byProgram,
    avgAttendance,
    missingContracts,
    paymentCurrent,
    paymentPastDue,
    totalMonthlyRevenue
  };
};

