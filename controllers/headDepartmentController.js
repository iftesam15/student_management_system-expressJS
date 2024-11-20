const pool = require("../db/db");
const ApiResponse = require("../Response");
require("dotenv").config();

const getHeadDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT hd.head_department_id, hd.department_name,i.instructor_id,i.first_name || ' ' || i.last_name AS instructor_name FROM instructors i JOIN head_departments hd ON i.instructor_id = hd.head_instructor_id; `
    );
    res
      .status(200)
      .json(
        ApiResponse.success(
          result.rows,
          "Head Departments retrived successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getHeadDepartmentsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT hd.head_department_id, hd.department_name,i.instructor_id,i.first_name,i.last_name 
             FROM instructors i JOIN head_departments hd ON i.instructor_id = hd.head_instructor_id WHERE hd.head_department_id = $1;`,
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json(ApiResponse.fail(404, "Head department not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(
          result.rows[0],
          "Head department retrieved successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createHeadDepartments = async (req, res) => {
  const { department_name, head_instructor_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO head_departments ( department_name, head_instructor_id) VALUES ($1, $2) RETURNING *",
      [department_name, head_instructor_id]
    );
    res
      .status(201)
      .json(
        ApiResponse.success(
          result.rows[0],
          "Head department created successfully"
        )
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(null, error.message));
  }
};
const updateHeadDepartments = async (req, res) => {
  const { id } = req.params;
  const { department_name, head_instructor_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE head_departments SET department_name = $1, head_instructor_id = $2 WHERE head_department_id = $3 RETURNING *",
      [department_name, head_instructor_id, id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json(ApiResponse.fail(404, "Head department not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(
          result.rows[0],
          "Head department updated successfully"
        )
      );
  } catch (error) {
    res.status(500).json(ApiResponse.error(null, error.message));
  }
};
const deleteHeadDeparments = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Missing head department ID",
    });
  }
  const query = `
    DELETE FROM head_departments WHERE head_department_id = $1
    RETURNING *`;
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json(ApiResponse.fail(404, "Head department not found"));
    }
    res
      .status(200)
      .json(
        ApiResponse.success(
          result.rows[0],
          "Head department deleted successfully"
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
module.exports = {
  getHeadDepartments,
  createHeadDepartments,
  getHeadDepartmentsById,
  updateHeadDepartments,
  deleteHeadDeparments,
};
