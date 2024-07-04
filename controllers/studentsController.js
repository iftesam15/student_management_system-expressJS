const { Pool } = require("pg");
require("dotenv").config();



const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

class Student {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
// Get all students
const getStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    const students = result.rows.map(row => new Student(row.first_name, row.last_name));
    res.status(200).json({
      status: "success",
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  const { first_name, last_name, date_of_birth, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (first_name, last_name,date_of_birth, email) VALUES ($1, $2, $3,$4) RETURNING *",
      [first_name, last_name, date_of_birth, email]
    );
    res.status(201).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE students SET first_name = $1, last_name = $2,  email = $4 WHERE student_id = $5 RETURNING *",
      [first_name, last_name, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
