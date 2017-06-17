/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


//TODO add echo support

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
        });
    }
});

router.get('/:courseId', function (req, res) {
    let searchType = "byCourseId";
    let isActive = false;
    db.searchCourses(req.params.courseId, searchType, isActive, function (data) {
        res.send(data);
    });
});

router.put('/:courseId', function (req, res) {
    db.editCourse(req.params.courseId,req.body.name,req.body.teacher,req.body.endDate,(data)=>{
        res.send(data);
    });

});

//TODO cascade delete not working
router.delete('/:courseId',(req,res) => {
   db.deleteCourse(req.params.courseId , (data) =>{
       if(req.query.echo) res.send(data);
       else res.send("success");
   });
});

router.post('/new', function (req, res) {
    db.addCourse(req.body.name, req.body.teacher, req.body.startdate, req.body.enddate, function (data) {
        res.send(data);
    });
});

router.post('/:courseId/enroll', function (req, res) {
    let dataType = req.body.studentAttribute;
    let studentArray = JSON.parse(req.body.students);
    console.log(studentArray[0]);
    let courseId = req.params.courseId;
    let retval = [];

    for(var i=0;i<studentArray.length;i++){
        db.enrollStudentInCourse(dataType, studentArray[i], courseId, function (data) {
            retval.push(data);
            if(retval.length == studentArray.length)
                res.send(retval);
        });
    }
});


module.exports = router;