const express = require('express');
const { getEnrollmentDetails } = require('../controllers/enrollmentsController');
const router = express.Router();

router.get('/', getEnrollmentDetails);

module.exports = router;
