const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Pool } = require("pg");
const authMiddleware = require("../middlewares/auth-middleware");
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// User Registration
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.rows[0].user_id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user.rows[0].user_id,
        username: user.rows[0].username,
        email: user.rows[0].email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserInfo = async (req, res) => {
  await res.status(200).json({
    user: req.user,
    token: req.token,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const usersWithoutPassword = users.rows.map(({ password, ...rest }) => rest);
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const getUserInfoByEmail = async (req, res) => {
//   try {
//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [
//       req.user.userId,
//     ]);
//     if (!user.rows[0]) {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  getAllUsers
};
