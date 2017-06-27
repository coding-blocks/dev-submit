/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const router = express.Router();

const Students = require('./students');
const Assignments = require('./assignments');
const Batches = require('./batches');
const Submissions = require('./submissions');
const Signup=require('./signup');

router.use('/students',Students);
router.use('/assignments',Assignments);
router.use('/batches',Batches);
router.use('/submissions',Submissions)
router.use('/signup',Signup)

module.exports = router;