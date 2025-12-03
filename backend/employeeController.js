// controllers/employeeController.js
const pool = require('../db');

// GET /employees - list all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, phone, position, department, hire_date, status FROM employees ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
