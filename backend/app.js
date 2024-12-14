const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const logsRoutes = require('./routes/logsRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Ensures JSON body parsing
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Debugging Middleware (Log incoming requests for debugging purposes)
app.use((req, res, next) => {
  console.log('Request Body:', req.body); // Logs request body for debugging
  console.log('Request Path:', req.path); // Logs the path for tracking
  console.log('Request Method:', req.method); // Logs the HTTP method
  next(); // Move to the next middleware or route
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/logs',logsRoutes);
app.use('/api/role', roleRoutes);

// Error Handling Middleware (Catch and log errors globally)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error', details: err.message });
});

module.exports = app;
