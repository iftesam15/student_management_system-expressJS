const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded',decoded);
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      decoded.userId,
    ]);
 
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    req.token =token;
    req.user = {
      id: user.rows[0].user_id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
