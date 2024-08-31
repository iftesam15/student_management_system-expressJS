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
const getCourseNames = async (req, res) => {
  try {
    const result = await pool.query('SELECT course_id,course_name FROM courses');
    res
      .status(200)
      .json(ApiResponse.success(result.rows, "Course names retrived successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const getInstructorByCourse = async (req, res) => {
  const { course_id } = req.params;
  try {
    const result = await pool.query('SELECT instructor_id, instructor_name FROM instructors Join course_instructors on instructors.instructor_id=course_instructors.instructor_id WHERE course_id=$1', [course_id]);
    res
      .status(200)
      .json(ApiResponse.success(result.rows, "Instructors for this course retrived successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getCourses,
  getCourseNames,
  getInstructorByCourse
};
