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
  console.log(req.params);

  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT i.first_name, i.last_name
       FROM instructors i
       INNER JOIN course_instructors ci ON i.instructor_id = ci.instructor_id
       WHERE ci.course_id = $1`,
      [id]
    );
    console.log(result.rows);


    const instructors = result.rows;
    console.log(instructors);
    // This is already an array

    res
      .status(200)
      .json(ApiResponse.success(instructors, "Instructors for this course retrieved successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getCourses,
  getCourseNames,
  getInstructorByCourse
};
