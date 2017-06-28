/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const router = express.Router();

router.use('/students', require('./students'));
router.use('/assignments', require('./assignments'));
router.use('/batches', require('./batches'));
router.use('/submissions', require('./submissions'));
router.use('/teachers', require('./teachers'));

module.exports = router;
