const { Pool } = require('pg');
const ApiResponse = require('../Response');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const getCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res
      .status(200)
      .json(ApiResponse.success(result.rows, "Courses retrived successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCourses,
};
