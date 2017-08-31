/**
 * Created by tech4GT on 6/28/17.
 */
const router = require('express').Router();
const db = require('../../db');
const utils = require('../../utils');


router.post('/new', utils.acl.ensureAdmin(), function (req, res) {
    db.actions.courses.addCourse(req.body.name, req.body.assignments, (err,course)=> {
        if (err) {
            console.log("ERROR" + err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: "Could not add the course(Internal Server Error)."
                }
            })
        }
        else {
            if (course) {
                res.status(201).send({success: true, data: course.get()});
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: "There are no courses."
                    }
                })
            }
        }
    });
});

router.get('/', function (req, res) {
    req.query.name = req.query.name ? req.query.name : false;
    db.actions.courses.getCourses(req.query.name, (err, courses)=> {

        if (err) {
            console.log("ERROR" + err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: "Could not get all the courses(Internal Server Error)."
                }
            })
        }
        else {
            if (courses.length !== 0) {
                res.status(200).send({success: true, data: courses.map((course) => course.get())});
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: "There are no courses."
                    }
                })
            }
        }
    })
});

router.get('/:courseId', utils.acl.ensureTeacher(), function (req, res) {
    db.actions.courses.getCourse(req.params.courseId, (err, course)=> {
        if (err) {
            console.log(err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: `Could not get the course with id ${req.params.courseId} (Internal Server Error).`
                }
            })
        }
        else {
            if (course) {
                res.status(200).send({success: true, data: course.get()});
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: `No Course found for the id ${req.params.courseId}.`
                    }
                })
            }
        }
    });
});


router.put('/:courseId', utils.acl.ensureAdmin(), function (req, res) {
    db.actions.courses.editCourse(req.params.courseId, req.body.name, (err,course)=>{
        if (err) {
            console.log(err);
            res.status(500).send({
                success: false
                , code: "500"
                , error: {
                    message: `Could not update the course with id ${req.params.courseId} (Internal Server Error).`
                }
            })
        }
        else {
            if (course) {
                res.status(201).send({success: true, data: course.get()});
            } else {
                res.status(404).send({
                    success: false
                    , code: "404"
                    , error: {
                        message: `Could not find the course with course id  ${req.params.courseId} .`
                    }
                })
            }
        }
    });
});

router.delete(':courseId', utils.acl.ensureAdmin(), function (req, res) {
//TODO with hooks and cascade

});

router.get('/:id/assignments', utils.acl.ensureTeacher(), function (req, res) {
    db.actions.courses.getCourseAssignments(req.params.id, data=>res.send(data));
})

router.post('/:courseId/addAssignment/:assignmentId', utils.acl.ensureTeacher(), function (req, res) {
    db.actions.courses.addAssignmenttoCourse(req.params.courseId, req.params.assignmentId, data=>res.send(data));
});


module.exports = router;