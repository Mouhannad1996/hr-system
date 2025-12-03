// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MYSECRET123';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expect: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verify error', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    // payload from jwt.sign({ id, email }, ...)
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
