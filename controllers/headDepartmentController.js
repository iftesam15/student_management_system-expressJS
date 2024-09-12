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

const getHeadDepartments = async (req, res) => {
    try {
        const result = await pool.query(`SELECT hd.head_department_id, hd.department_name,i.instructor_id,i.first_name || ' ' || i.last_name AS instructor_name FROM instructors i JOIN head_departments hd ON i.instructor_id = hd.head_instructor_id; `);
        res
            .status(200).json(ApiResponse.success(result.rows, "Head Departments retrived successfully"));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getHeadDepartmentsById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT hd.head_department_id, hd.department_name,i.instructor_id,i.first_name,i.last_name 
             FROM instructors i JOIN head_departments hd ON i.instructor_id = hd.head_instructor_id WHERE hd.head_department_id = $1;`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json(ApiResponse.fail(404, "Head department not found"));
        }
        res.status(200).json(ApiResponse.success(result.rows[0], "Head department retrieved successfully"));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const createHeadDepartments = async (req, res) => {
    const { department_name, head_instructor_id } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO head_departments ( department_name, head_instructor_id) VALUES ($1, $2) RETURNING *", [department_name, head_instructor_id]
        );
        res
            .status(201)
            .json(
                ApiResponse.success(result.rows[0], "Head department created successfully")
            );
    } catch (error) {
        res.status(500).json(ApiResponse.error(null, error.message));
    }
}
const updateHeadDepartments = async (req, res) => {
    const { id } = req.params;
    const { department_name, head_instructor_id } = req.body;
    try {
        const result = await pool.query(
            "UPDATE head_departments SET department_name = $1, head_instructor_id = $2 WHERE head_department_id = $3 RETURNING *", [department_name, head_instructor_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json(ApiResponse.fail(404, "Head department not found"));
        }
        res.status(200).json(ApiResponse.success(result.rows[0], "Head department updated successfully"));
    } catch (error) {
        res.status(500).json(ApiResponse.error(null, error.message));
    }
}
module.exports = {
    getHeadDepartments,
    createHeadDepartments,
    getHeadDepartmentsById,
    updateHeadDepartments
}