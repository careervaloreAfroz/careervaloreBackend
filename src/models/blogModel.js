const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
   bannerUrl: {
    type: String,
    required: [true, 'Banner URL is required']
  },
  metaTitle: {
    type: String,
    required: [true, 'Meta title is required'],
    trim: true,
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required'],
    trim: true,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
 keywords: {
    type: [String],
    required: [true, 'At least one keyword is required'],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'At least one keyword is required'
    }
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  content1: [contentSchema],
  content2: [contentSchema],
  content3: [contentSchema],
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['NA', 'deleted'],
    default: 'NA'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', blogSchema);