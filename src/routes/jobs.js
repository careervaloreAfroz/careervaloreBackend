// const express = require('express');
// const router = express.Router();
// const Job = require('../models/Job');
// const JobView = require('../models/JobView');
// const auth = require('../middleware/auth');

// // Helper function to get visitor identifier
// const getVisitorId = (req) => {
//   const ip = req.ip || 'anonymous';
//   console.log('Detected Visitor IP:', ip); // Log for debugging
//   return ip;
// };

// // Create a new job
// router.post('/', auth, async (req, res) => {
//   try {
//     console.log('Received job data:', req.body);
//     const jobData = {
//       ...req.body,
//       description: req.body.description || [], // Join array into string with newlines
//       requirements: req.body.requirements || [],
//       rolesAndResponsibilities: req.body.rolesAndResponsibilities || [],
//       selectionProcess: req.body.selectionProcess || [],
//     };

//     const job = new Job(jobData);
//     await job.save();
//     console.log('Job saved:', job);
//     res.status(201).json({ message: 'Job created successfully', data: job });
//   } catch (error) {
//     console.error('Error creating job:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update a job
// router.put('/:id', auth, async (req, res) => {
//   try {
//     if (req.body.pin !== undefined && typeof req.body.pin !== 'boolean') {
//       return res.status(400).json({ message: 'Invalid value for pin' });
//     }

//     const jobData = {
//       ...req.body,
//       description: Array.isArray(req.body.description) ? req.body.description.join("\n") : req.body.description || "",
//       requirements: req.body.requirements || [],
//       rolesAndResponsibilities: req.body.rolesAndResponsibilities || [],
//       selectionProcess: req.body.selectionProcess || [],
//     };

//     const job = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true });
//     if (!job) return res.status(404).json({ message: 'Job not found' });

//     res.status(200).json({ success: true, data: job });
//   } catch (error) {
//     console.error('Error updating job:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });
// // Search jobs
// router.post('/search', async (req, res) => { // CHANGE: Renamed to /search to avoid conflict
//   try {
//     const { search } = req.body;
//     let query = { isActive: true };

//     if (search) {
//       query.title = { $regex: search, $options: 'i' };
//     }

//     const jobs = await Job.find(query).sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (error) {
//     console.error('Error searching jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all jobs
// router.get('/alljobs', async (req, res) => {
//   try {
//     const jobs = await Job.find({});
//     res.json(jobs);
//   } catch (error) {
//     console.error('Error fetching all jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


//     // with views
// // router.get('/alljobs', async (req, res) => {
// //   try {
// //     const jobs = await Job.find({});
// //     const jobsWithViews = await Promise.all(
// //       jobs.map(async (job) => {
// //         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
// //         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
// //       })
// //     );
// //     res.json(jobsWithViews);
// //   } catch (error) {
// //     console.error('Error fetching all jobs:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// // Delete a job
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const job = await Job.findByIdAndDelete(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Job not found' });
//     await JobView.deleteMany({ jobId: req.params.id }); // Clean up views
//     res.json({ message: 'Job deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting job:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get job by ID with unique view tracking
// router.get('/:id', async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Job not found' });

//     const visitorId = getVisitorId(req);

//     // Increment totalViews for every request
//     await Job.findByIdAndUpdate(req.params.id, { $inc: { totalViews: 1 } });

//     // Check and record unique view
//     const existingView = await JobView.findOne({ jobId: req.params.id, visitorId });
//     if (!existingView) {
//       await JobView.create({ jobId: req.params.id, visitorId });
//     }

//     // Calculate counts
//     const uniqueViews = await JobView.countDocuments({ jobId: req.params.id }); // Unique views from JobView
//     const totalViews = job.totalViews + 1; // Reflect the increment we just made

//     res.json({ ...job.toJSON(), uniqueViews, totalViews });
//   } catch (error) {
//     console.error('Error fetching job by ID:', error);
//     res.status(500).json({ message: `${error}` });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
// Job Listing Routes (Static routes first)
router.get('/alljobs', jobController.getAllJobs); // Moved before /:id
router.post('/search', jobController.searchJobs);

// Filtered Routes
router.get('/type/:type', jobController.getJobsByType);
router.get('/latest', jobController.getLatestJobs);
router.get('/mostviewed', jobController.getMostViewedJobs);
router.get('/filtered', jobController.getFilteredJobs); // New route for filtered jobs

// Job CRUD Routes (Dynamic routes last)
router.post('/', auth, jobController.createJob);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);
router.get('/:id', jobController.getJobById); // This should be last

module.exports = router;