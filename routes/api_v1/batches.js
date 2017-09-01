/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../../db');
const utils = require('../../utils');

const router = express.Router();

//TODO add echo support


router.post('/new', utils.acl.ensureTeacher(), function (req, res) {
    db.actions.batches.addBatch(
        req.body.code,
        req.body.teacherId,
        req.body.startDate,
        req.body.endDate,
        (err, batch)=> {
            if (err) {
                console.log(err);
                res.status(500).send({
                    success: false
                    , code: "500"
                    , error: {
                        message: "Could not add the batch(Internal Server Error)."
                    }
                })
            }
            else {
                if (batch) {
                    res.status(201).send({success: true, data: batch.get()});
                } else {
                    res.status(400).send({
                        success: false
                        , code: "400"
                        , error: {
                            message: "Could not add the batch(Incorrect Details)."
                        }
                    })
                }
            }


        })
});

router.get('/', utils.acl.ensureAdmin(), (req, res) => {
    let onlyActive = req.query.active;
    var options = {};
    if (onlyActive) options.isActive = JSON.parse(onlyActive);
    let code = req.query.code;
    let teacher = req.query.teacher;

    if (code) {
        options.code = code;
    } else if (teacher) {
        options.teacher = teacher;
    }
    db.actions.batches.getBatches(options, (err, batches) => {

        if (err) {
            console.log("ERROR" + err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: "Could not get all the batches(Internal Server Error)."
                }
            })
        }
        else {
            if (batches.length !== 0) {
                res.status(200).send({success: true, data: batches.map((batch) => batch.get())});
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: "There are no batches."
                    }
                })
            }
        }
    });
});


router.get('/:batchId', utils.acl.ensureBatchOfStudent('batchId'), function (req, res) {
    let options = {};
    options.id = req.params.batchId;
    db.actions.batches.getBatches(options, function (err, batch) {
        if (err) {
            console.log(err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: `Could not get the batch with id ${req.params.batchId} (Internal Server Error).`
                }
            })
        }
        else {
            if (batch) {
                if (batch.length == 0) {
                    res.status(404).send({
                        success: false
                        , code: "404"
                        , error: {
                            message: `No Batch found for the id ${req.params.batchId}.`
                        }
                    })
                }
                else {
                    res.status(200).send({success: true, data: batch[0].get()});
                }
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: `No Batch found for the id ${req.params.batchId}.`
                    }
                })
            }
        }
    });
});


router.get('/:batchId/students', utils.acl.ensureBatchOfStudent('batchId'), (req, res) => {
    db.actions.students.getAllStudentsInBatch(req.params.batchId, data => {
        console.log('done');
        res.send(data);
    });
});


router.put('/:batchId', utils.acl.ensureAdmin(), function (req, res) {
    db.actions.batches.editBatch(
        req.params.batchId,
        req.body.code,
        req.body.teacherId,
        req.body.endDate,
        (err, batch) => {
            if (err) {

                res.status(500).send({
                    success: false
                    , code: "500"
                    , error: {
                        message: `Could not update the batch with id ${req.params.batchId} (Internal Server Error).`
                    }
                })
            }
            else {
                if (batch) {
                    res.status(201).send({success: true, data: batch.get()});
                } else {
                    res.status(400).send({
                        success: false
                        , code: "400"
                        , error: {
                            message: `Could not update the batch with batch id(Incorrect details)  ${req.params.batchId} .`
                        }
                    })
                }
            }
        }
    );
});


router.put('/:batchId/end', utils.acl.ensureAdmin(), (req, res) => {
    db.actions.batches.endBatch(req.params.batchId, data => {
        res.send(data);
    });
});

//TODO cascade delete not working
router.delete('/:batchId', utils.acl.ensureAdmin(), (req, res) => {
    db.actions.batches.deleteBatch(req.params.batchId, (err, batchDeleted) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: `Could not delete the batch with id ${req.params.batchId} (Internal Server Error).`
                }
            })

        } else {
            if (batchDeleted !== 0) {
                res.status(200).send({success: true})
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: `Could not delete the batch with id ${req.params.batchId} (Batch not found).`
                    }
                })
            }
        }
    });
});

// TODO Error check
//Todo if batch not available, handle error
router.post('/:batchId/enroll', utils.acl.ensureBatchOfTeacher('batchId'), function (req, res) {
    let dataType = req.body.studentAttribute;
    let studentArray = JSON.parse(req.body.students);
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
