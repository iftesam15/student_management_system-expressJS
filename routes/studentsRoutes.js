const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentsController');
const authMiddleware = require("../middlewares/auth-middleware"); // Import your middleware

const router = express.Router();

// Protect routes by applying the authMiddleware
router.get('/', authMiddleware, getStudents);
router.get('/:id', authMiddleware, getStudentById);
router.post('/', authMiddleware, createStudent);
router.put('/:id', authMiddleware, updateStudent);
router.delete('/:id', authMiddleware, deleteStudent);

module.exports = router;
