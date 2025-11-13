import React from 'react';
import {
  SparklesIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

/**
 * Coaching Alerts - Positive Reframes
 * 
 * Replaces fear-based alerts with coaching-based encouragement
 * Noom-style positive psychology
 */

export const COACHING_ALERTS = {
  LOW_CASH: {
    title: "Cash Building Opportunity! 💪",
    message: (daysCash) => `You're at ${daysCash} days cash. Schools your size average 18 days. Quick win: Collect one late payment and you'll jump to ${daysCash + 3} days! You've got this!`,
    action: "View Collections",
    color: "blue",
    icon: SparklesIcon,
    tone: "encouraging"
  },
  
  BELOW_ENROLLMENT: {
    title: "Enrollment Momentum! 🚀",
    message: (current, target, growth) => `You've grown to ${current} students! That's ${growth}% growth! Keep this momentum and you'll hit your ${target} student goal. You're doing great!`,
    action: "View Recruitment",
    color: "purple",
    icon: ArrowTrendingUpIcon,
    tone: "motivating"
  },
  
  ATTENDANCE_FOLLOWUP: {
    title: "Quick Family Check-In ☕",
    message: (studentName, absences) => `${studentName} has been out ${absences} times recently. A warm call usually solves it! Most likely just sick or family trip. Your caring call shows you notice! 💚`,
    action: "Call Family",
    color: "orange",
    icon: PhoneIcon,
    tone: "caring"
  },
  
  PAYMENT_LATE: {
    title: "Friendly Payment Reminder 📞",
    message: (familyName) => `${familyName} family is usually great! They might have just forgotten. A warm call or text usually works. Suggested: "Hey! Just checking in on this month's payment..."`,
    action: "Send Reminder",
    color: "green",
    icon: HeartIcon,
    tone: "understanding"
  },
  
  MISSING_CONTRACT: {
    title: "Quick Document Send 📄",
    message: (familyName, docType) => `${familyName} just needs their ${docType}. One click and it's done! You're almost there - this is the last step to get them fully enrolled!`,
    action: "Send Document",
    color: "blue",
    icon: SparklesIcon,
    tone: "helpful"
  },
  
  FACILITY_HIGH: {
    title: "Facility Optimization Opportunity 🏢",
    message: (percent) => `Your facility costs are ${percent}% of revenue. Top schools keep it under 25%. Small wins: Negotiate utilities, shop insurance, or add 5 students to improve the ratio!`,
    action: "View Facility",
    color: "orange",
    icon: SparklesIcon,
    tone: "strategic"
  }
};

export function CoachingAlert({ type, data, onAction }) {
  const alert = COACHING_ALERTS[type];
  if (!alert) return null;

  const Icon = alert.icon;
  const message = typeof alert.message === 'function' 
    ? alert.message(...data) 
    : alert.message;

  return (
    <div className={`bg-${alert.color}-50 border-l-4 border-${alert.color}-500 rounded-r-lg p-5`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 text-${alert.color}-600 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="font-semibold text-gray-900 mb-1">{alert.title}</div>
          <div className="text-sm text-gray-700 mb-3">{message}</div>
          {onAction && (
            <button
              onClick={onAction}
              className={`px-4 py-2 bg-${alert.color}-600 text-white rounded-lg hover:bg-${alert.color}-700 text-sm font-medium`}
            >
              {alert.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

