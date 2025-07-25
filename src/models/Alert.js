const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  imageUrl: { 
    type: String,
    required: false 
  },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);