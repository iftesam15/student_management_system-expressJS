const express = require('express');
const { getCourses, getCourseNames, getInstructorByCourse } = require('../controllers/coursesController');
const router = express.Router();

router.get('/', getCourses);
router.get('/names', getCourseNames)
router.get('/instructors/:id', getInstructorByCourse)
module.exports = router;
