/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const router = express.Router();

const Students = require('./students');
const Assignments = require('./assignments');
const Batches = require('./batches');
const Submissions = require('./submissions');
const Teachers = require('./teachers');
const Courses = require('./courses')

router.use('/students', Students);
router.use('/assignments', Assignments);
router.use('/batches', Batches);
router.use('/submissions', Submissions);
router.use('/teachers', Teachers);
router.use('/courses',Courses)

module.exports = router;
