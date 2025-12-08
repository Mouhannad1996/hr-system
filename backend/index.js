// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');                       // <-- use our DB pool
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// ---------- Ensure tables exist on startup ----------
async function ensureTables() {
  const createUsersSql = `
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    console.log('Ensuring app_users table exists...');
    await pool.query(createUsersSql);
    console.log('✅ app_users table is ready.');
  } catch (err) {
    console.error('❌ Error ensuring app_users table:', err);
  }
}

// kick this off (no await; just fire & log errors)
ensureTables();
// -----------------------------------------------------

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', now: new Date() });
});

// START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HR backend running on port ${PORT}`);
});
