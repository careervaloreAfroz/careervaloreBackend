// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pin: { type: Boolean, default: false },
  jobLink: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  description: [{ type: String }], 
  requirements: [String],
  type: { type: String, enum: ['fulltime', 'parttime', 'internship', 'contract', 'remote'], required: true },
  sector: { type: String, required: true },
  salary: { type: String },
  applicationDeadline: { type: Date },
  isActive: { type: Boolean, default: true },
  postedDate: { type: Date, default: Date.now },
  aboutCompany: { type: String },
  rolesAndResponsibilities: [String],
  selectionProcess: [String],
  totalViews: { type: Number, default: 0 }, // Only totalViews is stored here
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);