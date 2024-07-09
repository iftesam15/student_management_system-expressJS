const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const getInstructorList = async (req, res) => {
  const query = `
    SELECT 
    *
    FROM instructors;
  `;
  try {
    const result = await pool.query(query);
    res.status(200).json({
      status: "success",
      data: result.rows,
      message: "Instructor details retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
const getInstructorById = async (req, res) => {
    const {id} =req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM instructors WHERE instructor_id = $1',
            [id]
        );
        res.status(200).json({
            status: "success",
            data: result.rows[0],
            message: "Instructor details retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
const createInstructor = async (req, res) => {
  const { first_name, last_name, email } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: first_name, last_name, and email",
    });
  }

  const query = `
    INSERT INTO instructors (first_name, last_name, email)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [first_name, last_name, email]);
    res.status(201).json({
      status: "success",
      data: result.rows[0],
      message: "Instructor created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to create instructor",
    });
  }
};

const updateInstructor = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Missing instructor ID",
    });
  }

  const query = `
    UPDATE instructors
    SET first_name = $1, last_name = $2, email = $3
    WHERE instructor_id = $4
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [first_name, last_name, email, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: result.rows[0],
      message: "Instructor updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to update instructor",
    });
  }
};
const deleteInstructor= async (req, res) => {
  const { id } = req.params;
  if(!id){
    return res.status(400).json({
      status: "error",
      message: "Missing instructor ID",
    });
  }
  const query = `
    DELETE FROM instructors
    WHERE instructor_id = $1
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Instructor not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: result.rows[0],
      message: "Instructor deleted successfully",
    });
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
module.exports ={
    getInstructorList,
    getInstructorById,
    updateInstructor,
    createInstructor,
    deleteInstructor
};
