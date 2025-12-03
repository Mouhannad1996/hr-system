const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const userExists = await pool.query("SELECT * FROM app_users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert new user
    const newUser = await pool.query(
      "INSERT INTO app_users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    res.json({ message: "User registered", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await pool.query("SELECT * FROM app_users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
  { id: user.rows[0].id, email: user.rows[0].email },
  process.env.JWT_SECRET,      // ← uses value from .env
  { expiresIn: "1h" }
);


    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
