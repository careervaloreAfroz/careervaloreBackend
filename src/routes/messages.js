const express = require('express');
const router = express.Router();
const { createMessage, getMessages, getMessageById, updateMessage, deleteMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

// POST /api/messages - Create a new message
router.post('/',createMessage);

// GET /api/messages - Get all messages
router.get('/',auth,getMessages);

// GET /api/messages/:id - Get a specific message by ID
router.get('/:id',  auth,getMessageById);

// PUT /api/messages/:id - Update a specific message by ID
router.put('/:id',  auth,updateMessage);

// DELETE /api/messages/:id - Soft delete a specific message by ID
router.delete('/:id',  auth,deleteMessage);

module.exports = router;