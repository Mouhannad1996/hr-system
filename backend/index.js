// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');         // ✅ correct

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// ------- MIDDLEWARE -------
app.use(cors());
app.use(express.json());

// ------- ROUTES -------
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', now: new Date() });
});

// ------- START SERVER -------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HR backend running on port ${PORT}`);
});
