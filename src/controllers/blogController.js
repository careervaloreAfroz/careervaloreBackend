const mongoose = require('mongoose');
const Blog = require('../models/blogModel');

const createBlog = async (req, res) => {
  try {
    const { title, bannerUrl, metaTitle, metaDescription, keywords, content, content1, content2, content3, author } = req.body;

    // Validate required fields
    if (!title || !bannerUrl || !metaTitle || !metaDescription || !content || !author) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Explicitly validate keywords
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'At least one keyword is required' });
    }

  
    // Validate content1, content2, content3 if provided
    const validateContentArray = (array, fieldName) => {
      if (array && !Array.isArray(array)) {
        return `Invalid ${fieldName}: must be an array`;
      }
      if (array) {
        for (const item of array) {
          if (!item.imageUrl || !item.description) {
            return `Invalid ${fieldName}: each item must have imageUrl and description`;
          }
        
        }
      }
      return null;
    };

    const content1Error = validateContentArray(content1, 'content1');
    const content2Error = validateContentArray(content2, 'content2');
    const content3Error = validateContentArray(content3, 'content3');

    if (content1Error || content2Error || content3Error) {
      return res.status(400).json({ error: content1Error || content2Error || content3Error });
    }

    // Create new blog post
    const newBlog = new Blog({
      title,
      bannerUrl,
      metaTitle,
      metaDescription,
      keywords,
      content,
      content1: content1 || [],
      content2: content2 || [],
      content3: content3 || [],
      author,
    });

    // Save to database
    await newBlog.save();

    res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog post:', error); // Log full error for debugging
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'NA' }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    const blog = await Blog.findOne({ _id: id, status: 'NA' });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found or has been deleted' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, bannerUrl, metaTitle, metaDescription, keywords, content, content1, content2, content3, author } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    // Validate required fields
    if (!title || !bannerUrl || !metaTitle || !metaDescription || !content || !author) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Validate keywords
    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'At least one keyword is required' });
    }

  

    // Validate content1, content2, content3 if provided
    const validateContentArray = (array, fieldName) => {
      if (array && !Array.isArray(array)) {
        return `Invalid ${fieldName}: must be an array`;
      }
      if (array) {
        for (const item of array) {
          if (!item.imageUrl || !item.description) {
            return `Invalid ${fieldName}: each item must have imageUrl and description`;
          }
        
        }
      }
      return null;
    };

    const content1Error = validateContentArray(content1, 'content1');
    const content2Error = validateContentArray(content2, 'content2');
    const content3Error = validateContentArray(content3, 'content3');

    if (content1Error || content2Error || content3Error) {
      return res.status(400).json({ error: content1Error || content2Error || content3Error });
    }

    // Fetch the original blog post
    const originalBlog = await Blog.findOne({ _id: id, status: 'NA' });
    if (!originalBlog) {
      return res.status(404).json({ error: 'Blog post not found or has been deleted' });
    }

    // Identify changed fields
    const changedFields = [];
    if (title !== originalBlog.title) changedFields.push('title');
    if (bannerUrl !== originalBlog.bannerUrl) changedFields.push('bannerUrl');
    if (metaTitle !== originalBlog.metaTitle) changedFields.push('metaTitle');
    if (metaDescription !== originalBlog.metaDescription) changedFields.push('metaDescription');
    if (JSON.stringify(keywords) !== JSON.stringify(originalBlog.keywords)) changedFields.push('keywords');
    if (content !== originalBlog.content) changedFields.push('content');
    if (JSON.stringify(content1 || []) !== JSON.stringify(originalBlog.content1 || [])) changedFields.push('content1');
    if (JSON.stringify(content2 || []) !== JSON.stringify(originalBlog.content2 || [])) changedFields.push('content2');
    if (JSON.stringify(content3 || []) !== JSON.stringify(originalBlog.content3 || [])) changedFields.push('content3');
    if (author !== originalBlog.author) changedFields.push('author');

    // Update the blog post
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id, status: 'NA' },
      {
        title,
        bannerUrl,
        metaTitle,
        metaDescription,
        keywords,
        content,
        content1: content1 || [],
        content2: content2 || [],
        content3: content3 || [],
        author,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found or has been deleted' });
    }

    res.status(200).json({
      message: 'Blog post updated successfully',
      changedFields: changedFields.length > 0 ? changedFields : ['none'],
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message).join(', ') });
    }
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    const deletedBlog = await Blog.findOneAndUpdate(
      { _id: id, status: 'NA' },
      { status: 'deleted', updatedAt: Date.now() },
      { new: true }
    );

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found or already deleted' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };