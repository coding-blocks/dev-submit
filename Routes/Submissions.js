/**
 * Created by varun on 6/3/17.
 */

const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


router.post('/new', function (req, res) {
    db.addSubmission(req.body.studentId, req.body.assignmentId, req.body.URL, (data) => {
        res.send(data);
    });
});

router.get('/', function (req, res) {

    var options = {};
    if (req.query.course) {
        db.searchByCourse(req.query.course, req.query.onlyAccepted, (data) => {
            res.send(data);
        });
    }
    else {
        let accepted = req.query.onlyAccepted;

        if (accepted) options.status = JSON.parse(accepted);

        if (req.query.student && req.query.assignment) {
            options.studentId = req.query.student;
            options.assignmentId = req.query.assignment;
        }
        else if (req.query.student) {

            options.studentId = req.query.student;
        }
        else if (req.query.assignment) {
            options.assignmentId = req.query.assignment;
        }

        db.searchSubmissions(options, (data)=> {
            res.send(data);
        })
    }


});

router.get('/:param', function (req, res) {
    var options = {};
    options.id = id;
    db.searchSubmissions(options, (data) => {
        res.send(data);
    });
});

router.put('/:param', function (req, res) {
    db.acceptSubmissionbyId(req.params.param, req.query.echo, (data) => {
        res.send(data);
    });
});


module.exports = router;
