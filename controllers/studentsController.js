const pool = require("../db/db");
require("dotenv").config();
const ApiResponse = require("../Response");

class Student {
  constructor(student_id, firstName, lastName, date_of_birth, email) {
    this.student_id = student_id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.date_of_birth = date_of_birth;
    this.email = email;
  }
}

// Get all students
const getStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");

    const students = result.rows.map((row) => {
      return new Student(
        row.student_id,
        row.first_name,
        row.last_name,
        new Date(row.date_of_birth).toLocaleDateString("en-US"),
        row.email
      );
    });
    res
      .status(200)
      .json(ApiResponse.success(students, "Students retrieved successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse.error(500, error.message));
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
      return res
        .status(404)
        .json(ApiResponse.fail(res.statusCode, "Student not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(result.rows[0], "Student retrieved successfully")
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(500, error.message));
  }
};

// Create a new student
const createStudent = async (req, res) => {
  const { first_name, last_name, date_of_birth, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (first_name, last_name, date_of_birth, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, date_of_birth, email]
    );
    res
      .status(201)
      .json(
        ApiResponse.success(result.rows[0], "Student created successfully")
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(null, error.message));
  }
};

// Update a student
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE students SET first_name = $1, last_name = $2, email = $3 WHERE student_id = $4 RETURNING first_name, last_name, email",
      [first_name, last_name, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json(ApiResponse.fail(null, "Student not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(result.rows[0], "Student updated successfully")
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(null, error.message));
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
      return res.status(404).json(ApiResponse.fail(404, "Student not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(result.rows[0], "Student deleted successfully")
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(500, error.message));
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
