/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const router = express.Router();

const Students = require('./Students');
const Assignments = require('./Assignments');
const Batches = require('./Batches');
const Submissions = require('./Submissions');
const Signup=require('./signup');

router.use('/students',Students);
router.use('/assignments',Assignments);
router.use('/batches',Batches);
router.use('/submissions',Submissions)
router.use('/signup',Signup)

module.exports = router;