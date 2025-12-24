/// NOTE: Gathers user interaction of website functions to database for analytics purposes.
/// Data are saved in MongoDB
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Analytics = require('../models/analyticsModel');

// User routing
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const user = new User({ name: req.body.name, email: req.body.email });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes to Statboard
router.post('/track', async (req, res) => {
  try {
    const newEvent = new Analytics({ type: req.body.type, detail: req.body.detail });
    await newEvent.save();
    res.status(200).send('Tracked');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const feedbackData = JSON.stringify({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    const feedback = new Analytics({
      type: 'feedback',
      detail: feedbackData
    });
    
    await feedback.save();
    res.status(200).send('Feedback Received');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Full stats report
router.get('/stats', async (req, res) => {
  try {
    // Count Unique Users
    const uniqueEmails = (await User.distinct('email')).length;
    const uniqueNames = (await User.distinct('name')).length;
    
    // Count Analytics Events
    const visitCount = await Analytics.countDocuments({ type: 'visit' });
    const clickCount = await Analytics.countDocuments({ type: 'click' });
    const feedbackCount = await Analytics.countDocuments({ type: 'feedback' });

    res.json({
      online: true, 
      totalUsers: uniqueEmails, 
      uniqueNames: uniqueNames, 
      totalVisits: visitCount,
      totalClicks: clickCount,
      totalFeedbacks: feedbackCount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feedback list For StatBoard)=
router.get('/feedback', async (req, res) => { //feedback'
    try {
        // raw analytics data
        const rawFeedbacks = await Analytics.find({ type: 'feedback' }).sort({ _id: -1 });

        // "Unpack" the JSON string inside the fields
        const cleanFeedbacks = rawFeedbacks.map(item => {
            try {
                return JSON.parse(item.detail); // Turns string into Object {name, email, message}
            } catch (e) {
                return null; // Skips if data is corrupted or interrupted
            }
        }).filter(item => item !== null);

        res.json(cleanFeedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;