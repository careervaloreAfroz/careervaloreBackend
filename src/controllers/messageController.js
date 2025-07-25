const Message = require('../models/messageModel');
const mongoose = require('mongoose');

const createMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Create new message
    const newMessage = new Message({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    // Save to database
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ status: 'NA' }).sort({ createdAt: -1 });
    res.status(200).json( messages );
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await Message.findOne({ _id: id, status: 'NA' });
    if (!message) {
      return res.status(404).json({ error: 'Message not found or has been deleted' });
    }

    res.status(200).json( message );
  } catch (error) {
    console.error('Error fetching message:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Fetch the original message
    const originalMessage = await Message.findOne({ _id: id, status: 'NA' });
    if (!originalMessage) {
      return res.status(404).json({ error: 'Message not found or has been deleted' });
    }

    // Identify changed fields
    const changedFields = [];
    if (firstName !== originalMessage.firstName) changedFields.push('firstName');
    if (lastName !== originalMessage.lastName) changedFields.push('lastName');
    if (email !== originalMessage.email) changedFields.push('email');
    if (phone !== originalMessage.phone) changedFields.push('phone');
    if (subject !== originalMessage.subject) changedFields.push('subject');
    if (message !== originalMessage.message) changedFields.push('message');

    // Update the message
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: id, status: 'NA' },
      { firstName, lastName, email, phone, subject, message, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found or has been deleted' });
    }

    res.status(200).json({
      message: 'Message updated successfully',
      changedFields: changedFields.length > 0 ? changedFields : ['none'],
    });
  } catch (error) {
    console.error('Error updating message:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const deletedMessage = await Message.findOneAndUpdate(
      { _id: id, status: 'NA' },
      { status: 'deleted', updatedAt: Date.now() },
      { new: true }
    );

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found or already deleted' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

module.exports = { createMessage, getMessages, getMessageById, updateMessage, deleteMessage };