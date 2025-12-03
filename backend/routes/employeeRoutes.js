// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🔐 our new middleware
const authenticateToken = require('../middleware/auth');

// Apply auth to all /employees routes
router.use(authenticateToken);

// GET /employees - list all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, position, department, hire_date, status, created_at FROM employees ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /employees - create new employee
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      position,
      department,
      hire_date,
      status,
    } = req.body;

    const insertQuery = `
      INSERT INTO employees (first_name, last_name, email, position, department, hire_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      first_name,
      last_name,
      email,
      position,
      department,
      hire_date,
      status,
    ]);

    res.status(201).json({
      message: 'Employee created',
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating employee', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
