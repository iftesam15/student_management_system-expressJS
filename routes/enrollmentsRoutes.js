const express = require('express');
const { getEnrollmentsForCourse } = require('../controllers/enrollmentsController');
const router = express.Router();

router.get('/:courseName', getEnrollmentsForCourse);

module.exports = router;
