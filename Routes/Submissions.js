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

router.get('/:param', function (req, res) {
    db.searchSubmissions(req.params.param, "id", (data) => {
        res.send(data);
    });
});
router.put('/:param', function (req, res) {
    db.acceptSubmissionbyId(req.params.param, req.query.echo, (data) => {
        res.send(data);
    });
});

router.get('/', function (req, res) {
    if (req.query.course) {
        db.searchByCourse(req.query.course, req.query.onlyAccepted, (data) => {
            res.send(data);
        });
    }
    else {
        let type = "all";
        let searchParamter = req.params.param;
        let helperParameter;
        if (req.query.student && req.query.assignment) {
            type = "studentAssignment";
            searchParamter = req.query.student;
            helperParameter = req.query.assignment;
        }
        else if (req.query.student) {
            type = "student";
            searchParamter = req.query.student;
        }
        else if (req.query.assignment) {
            type = "assignment";
            searchParamter = req.query.assignment;
        }

        if (type == "all") {
            db.getSubmissions(req.query.onlyAccepted, (data) => {
                res.send(data);
            });
        }
        else {
            db.searchSubmissions(searchParamter, type, (data) => {
                res.send(data);
            }, req.query.onlyAccepted, helperParameter);
        }
    }


});

module.exports = router;
