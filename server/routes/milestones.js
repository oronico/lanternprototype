const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const School = require('../models/School');
const Nudge = require('../models/Nudge');
const auth = require('../middleware/auth');

// @route   GET /api/milestones
// @desc    Get all milestones for a school
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const milestones = await Milestone.find({ schoolId: school._id })
      .sort({ achieved: 1, priority: -1 });

    res.json({ milestones });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/milestones
// @desc    Create a custom milestone
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const {
      title,
      description,
      targetValue,
      currentValue,
      category,
      priority
    } = req.body;

    const milestone = new Milestone({
      schoolId: school._id,
      type: 'custom',
      title,
      description,
      targetValue,
      currentValue: currentValue || 0,
      category: category || 'financial',
      priority: priority || 'medium',
      celebrationType: 'confetti'
    });

    await milestone.save();

    res.json({ milestone });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/milestones/:id
// @desc    Update milestone progress
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const { currentValue } = req.body;
    
    const milestone = await Milestone.findOne({
      _id: req.params.id,
      schoolId: school._id
    });

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    const wasAchieved = milestone.achieved;
    milestone.currentValue = currentValue;

    // Check if milestone is now achieved
    if (!wasAchieved && currentValue >= milestone.targetValue) {
      milestone.achieved = true;
      milestone.achievedAt = new Date();

      // Create celebration nudge
      const celebrationNudge = new Nudge({
        schoolId: school._id,
        type: 'milestone-progress',
        urgency: 'info',
        title: `🎉 Milestone Achieved: ${milestone.title}`,
        message: milestone.celebrationMessage || `Congratulations! You've achieved your goal of ${milestone.title}!`,
        actionItems: [
          { text: 'View all milestones', actionType: 'link', actionUrl: '/milestones' }
        ]
      });
      await celebrationNudge.save();
    }

    // Check if close to milestone (within 90%)
    if (!milestone.achieved && currentValue >= milestone.targetValue * 0.9) {
      const existingNudge = await Nudge.findOne({
        schoolId: school._id,
        type: 'milestone-progress',
        'context.relatedMetric': milestone._id.toString(),
        dismissed: false,
        createdAt: { $gte: new Date(Date.now() - 86400000) } // Last 24 hours
      });

      if (!existingNudge) {
        const progressNudge = new Nudge({
          schoolId: school._id,
          type: 'milestone-progress',
          urgency: 'info',
          title: `🎯 Almost there: ${milestone.title}`,
          message: `You're ${((currentValue / milestone.targetValue) * 100).toFixed(0)}% of the way to ${milestone.title}. Keep going!`,
          actionItems: [
            { text: 'View milestone', actionType: 'link', actionUrl: '/milestones' }
          ],
          context: {
            currentValue,
            targetValue: milestone.targetValue,
            trend: 'improving',
            relatedMetric: milestone._id.toString()
          }
        });
        await progressNudge.save();
      }
    }

    await milestone.save();

    res.json({ milestone, celebrated: !wasAchieved && milestone.achieved });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/milestones/:id
// @desc    Delete a custom milestone
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const school = await School.findOne({ userId: req.user.id });
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const milestone = await Milestone.findOneAndDelete({
      _id: req.params.id,
      schoolId: school._id,
      type: 'custom' // Only allow deleting custom milestones
    });

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found or cannot be deleted' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

