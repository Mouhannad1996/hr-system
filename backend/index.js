// index.js (backend)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// -------- MIDDLEWARE --------
app.use(cors());
app.use(express.json());

// -------- STATIC FRONTEND --------
// Adjust this path if your folder name is different (Frontend vs frontend)
const publicPath = path.join(__dirname, '..', 'Frontend');

// serve all static files (CSS, JS, images, html)
app.use(express.static(publicPath));

// when someone visits "/", send index.html from Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// (Optional) if you want /employees to open employees.html in the browser:
app.get('/employees-page', (req, res) => {
  res.sendFile(path.join(publicPath, 'employees.html'));
});

// -------- API ROUTES --------
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', now: new Date() });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HR backend running on port ${PORT}`);
});
