const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Pool } = require("pg");

// mail api's
const nodemailer = require("nodemailer");
const crypto = require("crypto")

const authMiddleware = require("../middlewares/auth-middleware");
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// mail api's
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [resetToken, resetTokenExpiry, email]
    );

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({ message: "Password reset email sent", link: resetLink, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()", [token]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2",
      [hashedPassword, token]
    );

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



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


// Reset password and forget password
// const forgetPassword = async (req, res) => {
//   try {
//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
//     if (!user.rows[0]) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Send email with reset password link
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }

// }


module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  getAllUsers,
  forgetPassword,
  resetPassword,
};
