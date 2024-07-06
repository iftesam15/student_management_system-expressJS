const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get all enrollment details
const getEnrollmentDetails = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.enrollment_date,
        s.first_name AS student_first_name,
        s.last_name AS student_last_name,
        s.email AS student_email,
        c.course_name,
        i.first_name AS instructor_first_name,
        i.last_name AS instructor_last_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      JOIN course_instructors ci ON c.course_id = ci.course_id
      JOIN instructors i ON ci.instructor_id = i.instructor_id
    `;
    const result = await pool.query(query);
    res.status(200).json({
      status: 'success',
      data: result.rows,
      message: 'Enrollment details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getEnrollmentDetails,
};
