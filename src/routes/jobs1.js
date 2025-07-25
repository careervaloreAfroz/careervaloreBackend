// controllers without trakeing views


const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    // Basic validation for new fields
    const jobData = {
      ...req.body,
      // Ensure arrays are properly formatted
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      rolesAndResponsibilities: Array.isArray(req.body.rolesAndResponsibilities) 
        ? req.body.rolesAndResponsibilities 
        : [],
      selectionProcess: Array.isArray(req.body.selectionProcess) 
        ? req.body.selectionProcess 
        : []
    };

    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update job endpoint with new fields
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate input
    if (req.body.pin !== undefined && typeof req.body.pin !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for pin' });
    }

    const jobData = {
      ...req.body,
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      rolesAndResponsibilities: Array.isArray(req.body.rolesAndResponsibilities) 
        ? req.body.rolesAndResponsibilities 
        : [],
      selectionProcess: Array.isArray(req.body.selectionProcess) 
        ? req.body.selectionProcess 
        : []
    };

    const job = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Rest of your existing routes remain unchanged
router.post('/', async (req, res) => {
  try {
    const { search } = req.body;
    let query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/alljobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;