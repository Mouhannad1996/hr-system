// controllers/employeeController.js
const pool = require('../db');

// GET /employees  -> list all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, position, department, hire_date, status, created_at FROM employees ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /employees  -> create a new employee
exports.createEmployee = async (req, res) => {
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

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'first_name, last_name and email are required' });
    }

    const insertQuery = `
      INSERT INTO employees (first_name, last_name, email, position, department, hire_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, first_name, last_name, email, position, department, hire_date, status, created_at
    `;

    const values = [
      first_name,
      last_name,
      email,
      position || null,
      department || null,
      hire_date || null,
      status || 'active',
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      message: 'Employee created',
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /employees/:id  -> delete employee by id
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
