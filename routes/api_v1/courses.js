/**
 * Created by tech4GT on 6/28/17.
 */
const router = require('express').Router();
const db = require('../../db')

router.post('/new', function (req, res) {
    db.addCourse(req.body.name,JSON.parse(req.body.assignments),data=>res.send(data));
});

router.get('/', function (req, res) {
    req.query.name = req.query.name?JSON.parse(req.query.name):false;
    db.getCourses(req.query.name,data=>res.send(data));
});

router.get('/:courseId', function (req, res) {
    db.getCourse(req.params.courseId,data=>res.send(data));
});
router.put('/:courseId', function (req, res) {
    db.editCourse(req.params.courseId,req.body.name,data=>res.send(data));
});

router.delete(':courseId', function (req, res) {
//TODO with hooks and cascade
});

router.get('/:id/assignments',function (req, res) {
    db.getCourseAssignments(req.params.id,data=>res.send(data));
})

router.post('/:courseId/addAssignment/:assignmentId', function (req, res) {
    db.addAssignmenttoCourse(req.params.courseId,req.params.assignmentId,data=>res.send(data));
});


module.exports = router;