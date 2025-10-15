const express = require('express');
const router = express.Router();
const School = require('../models/School');
const auth = require('../middleware/auth');

// @route   POST /api/onboarding
// @desc    Complete school onboarding
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      operatingStage,
      schoolName,
      fiscalYearStart,
      fiscalYearEnd,
      currentEnrollment,
      targetEnrollment,
      accountingSystem,
      payrollSystem,
      bankingConnected,
      creditCardsConnected,
      hasPreviousYearData,
      hasLoans,
      loanDetails,
      hasProforma
    } = req.body;

    // Check if school profile already exists
    let school = await School.findOne({ userId: req.user.id });

    if (school) {
      return res.status(400).json({ error: 'School profile already exists' });
    }

    // Create new school profile
    school = new School({
      userId: req.user.id,
      name: schoolName,
      operatingStage,
      fiscalYearStart,
      fiscalYearEnd,
      currentEnrollment,
      targetEnrollment,
      connections: {
        accountingSystem,
        payrollSystem,
        bankingConnected,
        creditCardsConnected
      },
      loans: hasLoans ? loanDetails : [],
      onboardingComplete: true,
      onboardingCompletedAt: new Date()
    });

    await school.save();

    // Create initial milestones based on operating stage
    const Milestone = require('../models/Milestone');
    const initialMilestones = generateInitialMilestones(school);
    await Milestone.insertMany(initialMilestones);

    // Create welcome nudge
    const Nudge = require('../models/Nudge');
    const welcomeNudge = {
      schoolId: school._id,
      type: 'daily-check-in',
      urgency: 'info',
      title: 'Welcome to SchoolStack.ai! 🎉',
      message: 'Your financial command center is ready. Let\'s start by reviewing your current position and setting up your first goals.',
      actionItems: [
        { text: 'Take a tour', actionType: 'link', actionUrl: '/tour' },
        { text: 'View your dashboard', actionType: 'link', actionUrl: '/dashboard' }
      ]
    };
    await new Nudge(welcomeNudge).save();

    res.json({ 
      success: true, 
      school,
      message: 'Onboarding completed successfully!'
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Server error during onboarding' });
  }
});

// @route   GET /api/onboarding/status
// @desc    Check onboarding status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.json({ onboardingComplete: false });
    }

    res.json({ 
      onboardingComplete: school.onboardingComplete,
      school 
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to generate initial milestones
function generateInitialMilestones(school) {
  const milestones = [];
  
  // Universal milestones
  milestones.push(
    {
      schoolId: school._id,
      type: 'days-cash-milestone',
      category: 'financial',
      title: '30 Days Cash Reserve',
      description: 'Build a 30-day cash cushion for stability',
      targetValue: 30,
      currentValue: 0,
      priority: 'high',
      celebrationType: 'confetti'
    },
    {
      schoolId: school._id,
      type: 'collection-rate-improvement',
      category: 'efficiency',
      title: '95% Collection Rate',
      description: 'Achieve 95%+ on-time payment rate',
      targetValue: 95,
      currentValue: 0,
      priority: 'medium',
      celebrationType: 'star'
    }
  );

  // Stage-specific milestones
  if (school.operatingStage === 'year-0') {
    milestones.push(
      {
        schoolId: school._id,
        type: 'custom',
        category: 'growth',
        title: 'First 5 Students Enrolled',
        description: 'Sign up your first 5 families',
        targetValue: 5,
        currentValue: 0,
        priority: 'critical',
        celebrationType: 'fireworks'
      },
      {
        schoolId: school._id,
        type: 'custom',
        category: 'financial',
        title: 'Raise Initial Capital',
        description: 'Secure startup funding',
        targetValue: 1,
        currentValue: 0,
        priority: 'critical',
        celebrationType: 'trophy'
      }
    );
  } else {
    milestones.push(
      {
        schoolId: school._id,
        type: 'enrollment-target',
        category: 'operational',
        title: 'Target Enrollment',
        description: 'Reach optimal enrollment for sustainability',
        targetValue: school.targetEnrollment,
        currentValue: school.currentEnrollment,
        priority: 'critical',
        celebrationType: 'fireworks'
      },
      {
        schoolId: school._id,
        type: 'break-even',
        category: 'financial',
        title: 'Break-Even Operations',
        description: 'Cover all expenses from revenue',
        targetValue: 1,
        currentValue: 0,
        priority: 'high',
        celebrationType: 'trophy'
      }
    );
  }

  if (school.operatingStage === 'year-3-plus') {
    milestones.push(
      {
        schoolId: school._id,
        type: 'cash-reserve-goal',
        category: 'financial',
        title: '90 Days Cash Reserve',
        description: 'Build a 90-day cash cushion for resilience',
        targetValue: 90,
        currentValue: 0,
        priority: 'medium',
        celebrationType: 'trophy'
      }
    );
  }

  return milestones;
}

module.exports = router;

