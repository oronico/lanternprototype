import React, { useState, useEffect } from 'react';
import {
  TrophyIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

/**
 * XP (Experience Points) System
 * 
 * Visible in header, tracks everything user does
 * Levels up over time, unlocks features
 * Motivates daily engagement
 */

const LEVELS = [
  { level: 1, name: 'Getting Started', xpRequired: 0, color: 'gray', icon: '🌱' },
  { level: 2, name: 'Building Momentum', xpRequired: 100, color: 'blue', icon: '🏗️' },
  { level: 3, name: 'Growing Strong', xpRequired: 300, color: 'green', icon: '💪' },
  { level: 4, name: 'Thriving', xpRequired: 600, color: 'purple', icon: '🌟' },
  { level: 5, name: 'Expert', xpRequired: 1000, color: 'yellow', icon: '🏆' },
  { level: 6, name: 'Master', xpRequired: 1500, color: 'orange', icon: '👑' },
  { level: 7, name: 'Legend', xpRequired: 2500, color: 'red', icon: '💎' }
];

const XP_ACTIONS = {
  'attendance': 10,
  'call_family': 5,
  'send_email': 3,
  'add_student': 50,
  'payment_collected': 15,
  'contract_signed': 25,
  'daily_login': 5,
  'perfect_attendance': 50,
  'review_cash': 5,
  'send_contract': 20
};

export default function XPSystem({ compact = false }) {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Load from localStorage
    const savedXP = parseInt(localStorage.getItem('userXP') || '850'); // Demo: already at level 4
    setXP(savedXP);
    
    // Calculate level
    const currentLevel = LEVELS.reduce((acc, lvl) => {
      return savedXP >= lvl.xpRequired ? lvl : acc;
    }, LEVELS[0]);
    
    setLevel(currentLevel.level);
  }, []);

  const currentLevelData = LEVELS.find(l => l.level === level);
  const nextLevelData = LEVELS.find(l => l.level === level + 1);
  
  const xpInCurrentLevel = currentLevelData ? xp - currentLevelData.xpRequired : xp;
  const xpNeededForNext = nextLevelData ? nextLevelData.xpRequired - currentLevelData.xpRequired : 1000;
  const progress = (xpInCurrentLevel / xpNeededForNext) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg">
        <div className="text-2xl">{currentLevelData?.icon}</div>
        <div>
          <div className="text-xs opacity-90">Level {level}</div>
          <div className="text-sm font-bold">{xp.toLocaleString()} XP</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{currentLevelData?.icon}</div>
          <div>
            <div className="text-sm text-gray-600">You're Level {level}</div>
            <div className="text-xl font-bold text-gray-900">{currentLevelData?.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600">{xp.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total XP</div>
        </div>
      </div>

      {nextLevelData && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress to Level {level + 1}</span>
              <span className="font-medium text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {(nextLevelData.xpRequired - xp).toLocaleString()} XP to {nextLevelData.icon} {nextLevelData.name}
          </div>
        </>
      )}

      {!nextLevelData && (
        <div className="text-center text-primary-600 font-semibold">
          🎉 MAX LEVEL! You're a SchoolStack Legend! 💎
        </div>
      )}
    </div>
  );
}

export { XP_ACTIONS };

