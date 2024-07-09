const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get all enrollments with details
const getEnrollmentDetails = async (req, res) => {
  const query = `
    SELECT 
  CONCAT(students.first_name , ' ' ,students.last_name) AS student_full_name,
  enrollments.enrollment_id AS enrollment_id,
  courses.course_name,
  instructors.first_name AS instructor_first_name,
  instructors.last_name AS instructor_last_name,
  enrollments.enrollment_date
FROM
  enrollments
  JOIN students ON enrollments.student_id = students.student_id
  JOIN courses ON enrollments.course_id = courses.course_id
  JOIN instructors ON enrollments.instructor_id = instructors.instructor_id
ORDER BY enrollments.enrollment_date DESC;

  `;

  try {
    const result = await pool.query(query);
    const enrollements = result.rows.map((row) => {
      return {
        enrollment_id: row.enrollment_id,
        enrollment_date: row.enrollment_date,
        student_full_name: row.student_full_name,
        course_name: row.course_name,
        // instructor_full_name: row.instructor_full_name,
      };
    });
    res.status(200).json({
      status: "success",
      data: enrollements,
      message: "Enrollment details retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getEnrollmentDetails,
};
