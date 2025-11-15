import { DEMO_STUDENTS } from '../data/centralizedMetrics';

export const buildDefaultAllocations = (transaction) => {
  if (!transaction) return [];
  const familyStudents = DEMO_STUDENTS.filter(student => student.familyName === transaction.family);

  const baseAllocations = familyStudents.length
    ? familyStudents.map(student => ({
        name: `${student.studentInfo.firstName} ${student.studentInfo.lastName}`,
        amount: parseFloat((transaction.amount / familyStudents.length).toFixed(2)),
        grade: student.studentInfo.gradeLevel
      }))
    : [{
        name: '',
        amount: transaction.amount,
        grade: ''
      }];

  return baseAllocations.map(alloc => ({
    ...alloc,
    amount: String(alloc.amount)
  }));
};

export const normalizeAllocations = (allocations = []) =>
  allocations.map(alloc => ({
    name: alloc.name?.trim() || '',
    amount: Number(alloc.amount || 0),
    grade: alloc.grade?.trim() || ''
  }));

export const computeActivitySummary = (items = []) => {
  const needsReviewCount = items.filter(txn => txn.status !== 'mapped').length;
  const needsSplitCount = items.filter(txn => txn.requiresSplit).length;
  const inboundAmount = items
    .filter(txn => txn.direction === 'inbound')
    .reduce((sum, txn) => sum + txn.amount, 0);

  return {
    needsReviewCount,
    needsSplitCount,
    inboundAmount
  };
};

export const computeChecklistProgress = (steps = []) => {
  if (!steps.length) return null;
  const completed = steps.filter(step => step.done).length;
  const total = steps.length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100)
  };
};

