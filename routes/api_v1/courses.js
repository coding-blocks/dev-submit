/**
 * Created by tech4GT on 6/28/17.
 */
const router = require('express').Router();
const db = require('../../db');
const utils = require('../../utils');


router.post('/new',utils.acl.ensureAdmin(), function (req, res) {
    db.actions.courses.addCourse(req.body.name,JSON.parse(req.body.assignments),data=>res.send(data));
});

router.get('/', function (req, res) {
    req.query.name = req.query.name?req.query.name:false;
    db.actions.courses.getCourses(req.query.name,data=>res.send(data));
});

router.get('/:courseId',utils.acl.ensureTeacher(), function (req, res) {
    db.actions.courses.getCourse(req.params.courseId,data=>res.send(data));
});
router.put('/:courseId',utils.acl.ensureAdmin, function (req, res) {
    db.actions.courses.editCourse(req.params.courseId,req.body.name,data=>res.send(data));
});

router.delete(':courseId',utils.acl.ensureAdmin(), function (req, res) {
//TODO with hooks and cascade
});

router.get('/:id/assignments',utils.acl.ensureTeacher(),function (req, res) {
    db.actions.courses.getCourseAssignments(req.params.id,data=>res.send(data));
})

router.post('/:courseId/addAssignment/:assignmentId',utils.acl.ensureTeacher(), function (req, res) {
    db.actions.courses.addAssignmenttoCourse(req.params.courseId,req.params.assignmentId,data=>res.send(data));
});


module.exports = router;