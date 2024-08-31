const express = require("express");
const {
  getEnrollmentDetails,
  createEnrollment,
} = require("../controllers/enrollmentsController");
const { getInstructorByCourse } = require("../controllers/coursesController");
const router = express.Router();

router.get("/", getEnrollmentDetails);
router.post("/", createEnrollment);
router.get("/intructors/:id", getInstructorByCourse)

module.exports = router;
