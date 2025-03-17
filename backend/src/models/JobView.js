// models/JobView.js
const mongoose = require('mongoose');

const jobViewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  visitorId: {
    type: String,
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('JobView', jobViewSchema);