const express = require('express');
const { getHeadDepartments, createHeadDepartments, getHeadDepartmentsById, updateHeadDepartments } = require('../controllers/headDepartmentController');
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.get('/', getHeadDepartments);
router.post('/', authMiddleware, createHeadDepartments);
router.get('/:id', authMiddleware, getHeadDepartmentsById);
router.put('/:id', authMiddleware, updateHeadDepartments)
module.exports = router;