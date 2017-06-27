/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


//TODO add echo support

//tested
router.post('/new', function (req, res) {
    db.addBatch(req.body.name, req.body.teacher, req.body.startdate, req.body.enddate, function (data) {
        res.send(data)
    });
});


//tested
router.get('/', (req, res) => {
    let onlyActive = req.query.active;
    var options = {};
    if (onlyActive) options.isActive = JSON.parse(onlyActive);
    let name = req.query.name;
    let teacher = req.query.teacher;


    if (name) {
        options.name = name;
    }
    else if (teacher) {
        options.teacher = teacher
    }

    db.getBatches(options, (data) => {
        res.send(data);
    });

});


//tested
router.get('/:batchId', function (req, res) {
    let options = {};
    options.id = req.params.batchId;
    db.getBatches(options, function (data) {
        res.send(data);
    });
});


//tested
router.get('/:batchId/students', (req, res) => {
    db.getAllStudentsInBatch(req.params.batchId, (data) => {
        console.log("done");
        res.send(data);
    });
});

//tested
router.put('/:batchId', function (req, res) {

    db.editBatch(req.params.batchId, req.body.name, req.body.teacher, req.body.endDate, (data) => {
        res.send(data);
    });
});

//tested
router.put('/:batchId/end', (req, res) => {
    db.endBatch(req.params.batchId, (data) => {
        res.send(data);
    });
});


//TODO cascade delete not working
router.delete('/:batchId', (req, res) => {
    db.deleteBatch(req.params.batchId, (data) => {
        if (req.query.echo) res.send(data);
        else res.send("success");
    });
});


// TODO Error check
router.post('/:batchId/enroll', function (req, res) {
    let dataType = req.body.studentAttribute;
    let studentArray = req.body.students;
    // if (studentArray) studentArray = JSON.parse(studentArray);
    let batchId = req.params.batchId;
    let retval = [];

    for (var i = 0; i < studentArray.length; i++) {
        db.enrollStudentInBatch(dataType, studentArray[i], batchId, function (data) {
            retval.push(data);
            if (retval.length == studentArray.length)
                res.send(retval);
        });
    }
});


module.exports = router;