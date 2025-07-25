require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/connection');
const adminRoutes = require('./src/routes/admin');
const jobRoutes = require('./src/routes/jobs');
const alertRoutes = require('./src/routes/alerts');
const messageRoutes = require('./src/routes/messages');
const blogRoutes = require('./src/routes/blog');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});