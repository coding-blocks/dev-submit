/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../../db');
const utils = require('../../utils');

const router = express.Router();

//TODO add echo support

//tested
router.post('/new',utils.acl.ensureTeacher, function (req, res) {
    db.actions.batches.addBatch(
        req.body.name,
        req.body.teacherId,
        req.body.startdate,
        req.body.enddate,
        function (data) {
            res.send(data);
        }
    );
});

//tested
router.get('/',utils.acl.ensureAdmin, (req, res) => {
    let onlyActive = req.query.active;
    var options = {};
    if (onlyActive) options.isActive = JSON.parse(onlyActive);
    let name = req.query.name;
    let teacher = req.query.teacher;

    if (name) {
        options.name = name;
    } else if (teacher) {
        options.teacher = teacher;
    }
    db.actions.batches.getBatches(options, data => {
        res.send(data);
    });
});

//tested
router.get('/:batchId',utils.acl.ensureBatchOfStudent('batchId'), function (req, res) {
    let options = {};
    options.id = req.params.batchId;
    db.actions.batches.getBatches(options, function (data) {
        res.send(data);
    });
});

//tested
router.get('/:batchId/students',utils.acl.ensureBatchOfStudent('batchId'), (req, res) => {
    db.actions.students.getAllStudentsInBatch(req.params.batchId, data => {
        console.log('done');
        res.send(data);
    });
});

//tested

router.put('/:batchId',utils.acl.ensureAdmin, function (req, res) {
    db.actions.batches.editBatch(
        req.params.batchId,
        req.body.name,
        req.body.teacher,
        req.body.endDate,
        data => {
            res.send(data);
        }
    );
});

//tested
router.put('/:batchId/end',utils.acl.ensureAdmin, (req, res) => {
    db.actions.batches.endBatch(req.params.batchId, data => {
        res.send(data);
    });
});

//TODO cascade delete not working
router.delete('/:batchId',utils.acl.ensureAdmin, (req, res) => {
    db.actions.batches.deleteBatch(req.params.batchId, data => {
        if (req.query.echo) res.send(data);
        else res.send('success');
    });
});

// TODO Error check
//Todo if batch not available, handle error
router.post('/:batchId/enroll',utils.acl.ensureBatchOfTeacher('batchId'), function (req, res) {
    let dataType = req.body.studentAttribute;
    let studentArray = JSON.parse(req.body.students);
    // if (studentArray) studentArray = JSON.parse(studentArray);
    let batchId = req.params.batchId;
    let retval = [];

    for (var i = 0; i < studentArray.length; i++) {
        db.actions.students.enrollStudentInBatch(dataType, studentArray[i], batchId, function (data) {
            retval.push(data);
            if (retval.length == studentArray.length) res.send(retval);
        });
    }
});

module.exports = router;
