const express = require('express');
const { getCourses, getCourseNames } = require('../controllers/coursesController');
const router = express.Router();

router.get('/', getCourses);
router.get('/names', getCourseNames)
module.exports = router;
