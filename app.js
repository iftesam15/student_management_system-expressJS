const express = require('express');
const cors = require('cors');
const coursesRoutes = require('./routes/coursesRoutes');
const enrollmentsRoutes = require('./routes/enrollmentsRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use('/courses', coursesRoutes);
app.use('/enrollments', enrollmentsRoutes);
app.use('/students', studentsRoutes);
app.use('/instructors', instructorRoutes);
app.use('/users', userRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
