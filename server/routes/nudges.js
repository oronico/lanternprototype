const express = require('express');
const router = express.Router();
const Nudge = require('../models/Nudge');
const School = require('../models/School');
const auth = require('../middleware/auth');

// @route   GET /api/nudges
// @desc    Get all nudges for a school
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const nudges = await Nudge.find({ 
      schoolId: school._id,
      dismissed: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ urgency: -1, scheduledFor: -1 });

    res.json({ nudges });
  } catch (error) {
    console.error('Error fetching nudges:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/nudges/:id/read
// @desc    Mark nudge as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const nudge = await Nudge.findOneAndUpdate(
      { _id: req.params.id, schoolId: school._id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!nudge) {
      return res.status(404).json({ error: 'Nudge not found' });
    }

    res.json({ nudge });
  } catch (error) {
    console.error('Error marking nudge as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/nudges/:id
// @desc    Dismiss a nudge
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const nudge = await Nudge.findOneAndUpdate(
      { _id: req.params.id, schoolId: school._id },
      { dismissed: true, dismissedAt: new Date() },
      { new: true }
    );

    if (!nudge) {
      return res.status(404).json({ error: 'Nudge not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error dismissing nudge:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/nudges/generate
// @desc    Generate daily nudges based on school data
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const generatedNudges = await generateNudgesForSchool(school);
    
    res.json({ 
      success: true, 
      count: generatedNudges.length,
      nudges: generatedNudges 
    });
  } catch (error) {
    console.error('Error generating nudges:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to generate nudges based on school data
async function generateNudgesForSchool(school) {
  const nudges = [];
  const now = new Date();

  // Daily check-in nudge
  if (school.settings.enableDailyNudges) {
    const existingCheckIn = await Nudge.findOne({
      schoolId: school._id,
      type: 'daily-check-in',
      createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) }
    });

    if (!existingCheckIn) {
      nudges.push(new Nudge({
        schoolId: school._id,
        type: 'daily-check-in',
        urgency: 'info',
        title: `Good ${getTimeOfDay()}! Ready to tackle today?`,
        message: "Let's review your financial priorities for the day.",
        actionItems: [
          { text: 'Review today\'s expected payments', actionType: 'link', actionUrl: '/payments' },
          { text: 'Check cash position', actionType: 'link', actionUrl: '/dashboard' }
        ]
      }));
    }
  }

  // Check enrollment gap
  if (school.currentEnrollment < school.targetEnrollment) {
    const gap = school.targetEnrollment - school.currentEnrollment;
    const urgency = gap > 5 ? 'warning' : 'reminder';
    
    nudges.push(new Nudge({
      schoolId: school._id,
      type: 'enrollment-opportunity',
      urgency,
      title: `${gap} students away from target enrollment`,
      message: `You're at ${school.currentEnrollment}/${school.targetEnrollment} students. Reaching your target would improve financial sustainability.`,
      actionItems: [
        { text: 'View enrollment playbook', actionType: 'link', actionUrl: '/playbooks/enrollment' },
        { text: 'Review pipeline', actionType: 'link', actionUrl: '/enrollment' }
      ],
      context: {
        currentValue: school.currentEnrollment,
        targetValue: school.targetEnrollment,
        trend: 'stable'
      }
    }));
  }

  // Save all generated nudges
  for (const nudge of nudges) {
    await nudge.save();
  }

  return nudges;
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

module.exports = router;

