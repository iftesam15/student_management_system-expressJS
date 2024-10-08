const express = require('express');
const { getHeadDepartments, createHeadDepartments, getHeadDepartmentsById, updateHeadDepartments, deleteHeadDeparments } = require('../controllers/headDepartmentController');
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.get('/', getHeadDepartments);
router.post('/', authMiddleware, createHeadDepartments);
router.get('/:id', authMiddleware, getHeadDepartmentsById);
router.put('/:id', authMiddleware, updateHeadDepartments);
router.delete('/:id', authMiddleware, deleteHeadDeparments)
module.exports = router;