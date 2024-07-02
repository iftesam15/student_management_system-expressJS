const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const getEnrollmentsForCourse = async (req, res) => {
  const { courseName } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.first_name, s.last_name, c.course_name
       FROM students s
       JOIN enrollments e ON s.student_id = e.student_id
       JOIN courses c ON e.course_id = c.course_id
       WHERE c.course_name = $1`,
      [courseName]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEnrollmentsForCourse,
};
