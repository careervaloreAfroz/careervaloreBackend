// const Job = require('../models/Job');
// const JobView = require('../models/JobView');

// // Helper function to get visitor identifier
// const getVisitorId = (req) => {
//   const ip = req.ip || 'anonymous';
//   console.log('Detected Visitor IP:', ip);
//   return ip;
// };

// // Create a new job
// exports.createJob = async (req, res) => {
//   try {
//     const jobData = {
//       ...req.body,
//       description: req.body.description || [],
//       requirements: req.body.requirements || [],
//       rolesAndResponsibilities: req.body.rolesAndResponsibilities || [],
//       selectionProcess: req.body.selectionProcess || [],
//     };

//     const job = new Job(jobData);
//     await job.save();
//     res.status(200).json({ message: 'Job created successfully', data: job });
//   } catch (error) {
//     console.error('Error creating job:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update a job
// exports.updateJob = async (req, res) => {
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
// };

// // Delete a job
// exports.deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findByIdAndDelete(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Job not found' });
//     await JobView.deleteMany({ jobId: req.params.id });
//     res.json({ message: 'Job deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting job:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // // Get job by ID with view tracking
// // exports.getJobById = async (req, res) => {
// //   try {
// //     const job = await Job.findById(req.params.id);
// //     if (!job) return res.status(404).json({ message: 'Job not found' });

// //     const visitorId = getVisitorId(req);
// //     await Job.findByIdAndUpdate(req.params.id, { $inc: { totalViews: 1 } });

// //     const existingView = await JobView.findOne({ jobId: req.params.id, visitorId });
// //     if (!existingView) {
// //       await JobView.create({ jobId: req.params.id, visitorId });
// //     }

// //     const uniqueViews = await JobView.countDocuments({ jobId: req.params.id });
// //     const totalViews = job.totalViews + 1;

// //     res.json({ ...job.toJSON(), uniqueViews, totalViews });
// //   } catch (error) {
// //     console.error('Error fetching job by ID:', error);
// //     res.status(500).json({ message: `${error}` });
// //   }
// // };


// // Get job by ID with view tracking
// exports.getJobById = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: 'Job not found' });

//     // Inline visitor ID and location logic
//     const ip = req.ip || 'anonymous'; // Fallback to 'anonymous' if IP not found
//     console.log('Detected Visitor IP:', ip);

//     let visitorId = ip;
//     let location = {};

//     // Skip geolocation for localhost IPs
//     if (ip !== '::1' && ip !== '127.0.0.1') {
//       try {
//         // Fetch geolocation data from ip-api.com
//         const response = await axios.get(`http://ip-api.com/json/${ip}`);
//         const { city, region, country, lat, lon } = response.data;

//         location = {
//           city,
//           region,
//           country,
//           latitude: lat,
//           longitude: lon
//         };
//       } catch (error) {
//         console.error('Error fetching geolocation:', error.message);
//         location = {}; // Fallback to empty location on error
//       }
//     }

//     // Update total views
//     await Job.findByIdAndUpdate(req.params.id, { $inc: { totalViews: 1 } });

//     // Check for existing view and create new one if not found
//     const existingView = await JobView.findOne({ jobId: req.params.id, visitorId });
//     if (!existingView) {
//       await JobView.create({
//         jobId: req.params.id,
//         visitorId,
//         location // Store location data
//       });
//     }

//     const uniqueViews = await JobView.countDocuments({ jobId: req.params.id });
//     const totalViews = job.totalViews + 1;

//     res.json({ ...job.toJSON(), uniqueViews, totalViews });
//   } catch (error) {
//     console.error('Error fetching job by ID:', error);
//     res.status(500).json({ message: `${error}` });
//   }
// };


// // Search jobs
// exports.searchJobs = async (req, res) => {
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
// };

// // Get all jobs
// exports.getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({});
//     const jobsWithViews = await Promise.all(
//       jobs.map(async (job) => {
//         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
//         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
//       })
//     );
//     res.json(jobsWithViews);
//   } catch (error) {
//     console.error('Error fetching all jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Filter jobs by type
// exports.getJobsByType = async (req, res) => {
//   try {
//     const { type } = req.params;
//     const validTypes = ['fulltime', 'parttime', 'internship', 'contract', 'remote'];
//     if (!validTypes.includes(type)) {
//       return res.status(400).json({ message: 'Invalid job type' });
//     }

//     const jobs = await Job.find({ type, isActive: true }).sort({ createdAt: -1 });
//     const jobsWithViews = await Promise.all(
//       jobs.map(async (job) => {
//         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
//         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
//       })
//     );
//     res.json(jobsWithViews);
//   } catch (error) {
//     console.error('Error fetching jobs by type:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get latest jobs
// // ... (other imports and functions remain the same)

// // Get latest jobs with optional limit
// exports.getLatestJobs = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 if no limit provided
//     if (isNaN(limit) || limit < 1) {
//       return res.status(400).json({ message: 'Limit must be a positive number' });
//     }

//     const jobs = await Job.find({ isActive: true })
//       .sort({ createdAt: -1 }) // Sort by creation date, newest first
//       .limit(limit); // Apply the limit

//     const jobsWithViews = await Promise.all(
//       jobs.map(async (job) => {
//         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
//         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
//       })
//     );

//     res.json(jobsWithViews);
//   } catch (error) {
//     console.error('Error fetching latest jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// // Get most viewed jobs
// exports.getMostViewedJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ isActive: true })
//       .sort({ totalViews: -1 })
//       .limit(10); // Limit to 10 most viewed
//     const jobsWithViews = await Promise.all(
//       jobs.map(async (job) => {
//         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
//         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
//       })
//     );
//     res.json(jobsWithViews);
//   } catch (error) {
//     console.error('Error fetching most viewed jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// // Filter jobs dynamically
// exports.getFilteredJobs = async (req, res) => {
//   try {
//     const { type, sector, location, pinned, limit } = req.query;

//     // Build the query object
//     let query = { isActive: true };

//     if (type && ['fulltime', 'parttime', 'internship', 'contract', 'remote'].includes(type)) {
//       query.type = type;
//     }
//     if (sector) {
//       query.sector = sector;
//     }
//     if (location) {
//       query.location = location;
//     }
//     if (pinned === 'true') {
//       query.pin = true;
//     }

//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 }) // Newest first
//       .limit(parseInt(limit) || 10); // Default to 10 if no limit provided

//     const jobsWithViews = await Promise.all(
//       jobs.map(async (job) => {
//         const uniqueViews = await JobView.countDocuments({ jobId: job._id });
//         return { ...job.toJSON(), uniqueViews, totalViews: job.totalViews };
//       })
//     );

//     res.json(jobsWithViews);
//   } catch (error) {
//     console.error('Error fetching filtered jobs:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };