const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// Get all alerts (public)
// No filtering by isActive or expiresAt since they’re not in the schema
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create alert (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body; // Expecting only imageUrl in the body
    const alert = new Alert({ imageUrl }); // Create new alert with imageUrl
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update alert (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body; // Expecting only imageUrl in the body
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { imageUrl },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete alert (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;