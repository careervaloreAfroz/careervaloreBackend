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
    required: true // This will store the IP address
  },
  location: {
    city: { type: String, required: false },
    region: { type: String, required: false },
    country: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false }
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('JobView', jobViewSchema);