/**
 * Created by varun on 5/24/17.
 */
const express = require('express');

//Abhishek , your router

const express = require('express');
const db = require('../Utils/db');

const router = express.Router();

router.get('/', function (req, res) {

    let isActive = false;
    let searchType = "all";
    let searchParam;

    if (req.query.active) {
        isActive = true;
    }

    if (req.query.name) {
        searchType = "name";
        searchParam = req.query.name;
        db.searchCourse(searchParam, searchType, isActive, function (data) {
            res.send(data);
        })
    }
    //TODO check if ID is in "query"?

    else {
        db.getCourses(isActive, function (data) {
            res.send(data);
        })
    }


})

router.get('/:courseId', function (req, res) {
    let searchType = "byCourseId";
    let isActive = false;
    if (req.query.active) {
        isActive = true;
    }
    db.searchCourse(req.params.courseId, searchType, isActive, function (data) {
        res.send(data);
    })
})
router.put('/:courseId', function (req, res) {
    //TODO-add function in db.js

})
router.post('/new', function (req, res) {
    db.addCourse(req.query.name, req.query.teacher, req.query.startdate, req.query.enddate, function (data) {
        res.send(data);
    });
})

router.post('/:courseId/enroll', function (req, res) {
    let dataType = req.body.datatype;

    let studentArray = req.body.data;
    let courseId = req.params.courseId;

    studentArray.forEach(function (studentParam) {
        db.enrollStudentInCourse(dataType, studentParam, courseId, function () {
            res.send(success);
        })
    })

})


module.exports = express.Router();