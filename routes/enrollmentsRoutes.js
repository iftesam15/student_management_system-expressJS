const express = require('express');
const { getEnrollmentDetails } = require('../controllers/enrollmentsController');
const router = express.Router();

router.get('/details', getEnrollmentDetails);

module.exports = router;
