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
      
      e.enrollment_date,
     
      CONCAT(s.first_name, ' ', s.last_name) AS student_full_name,
      c.course_name,
      CONCAT(i.first_name,' ', i.last_name) AS instructor_full_name
     
    FROM 
      enrollments e
    JOIN 
      students s ON e.student_id = s.student_id
    JOIN 
      courses c ON e.course_id = c.course_id
    JOIN 
      course_instructors ci ON c.course_id = ci.course_id
    JOIN 
      instructors i ON ci.instructor_id = i.instructor_id
    ORDER BY 
      e.enrollment_date DESC;
  `;

  try {
    const result = await pool.query(query);
    const enrollements = result.rows.map((row)=>{
      return {
        enrollment_date: row.enrollment_date,
        student_full_name: row.student_full_name,
        course_name: row.course_name
        // instructor_full_name: row.instructor_full_name,
      }
    })
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
