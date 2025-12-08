// backend/db.js
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // needed on Render
    : false,                        // no SSL for local dev
});

module.exports = pool;
