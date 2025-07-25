const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');
const auth = require('../middleware/auth');

// POST /api/blogs - Create a new blog post
router.post('/', auth, createBlog);

// GET /api/blogs - Get all blog posts
router.get('/', getBlogs);

// GET /api/blogs/:id - Get a specific blog post by ID
router.get('/:id', getBlogById);

// PUT /api/blogs/:id - Update a specific blog post by ID
router.put('/:id', auth, updateBlog);

// DELETE /api/blogs/:id - Soft delete a specific blog post by ID
router.delete('/:id', auth, deleteBlog);

module.exports = router;