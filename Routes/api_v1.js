/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const router = express.Router();

const Students = require('./Students');
const Assignments = require('./Assignments');
const Courses = require('./Courses');

router.use('/students',Students);
router.use('/assignments',Assignments);
router.use('/courses',Courses);

module.exports = router;