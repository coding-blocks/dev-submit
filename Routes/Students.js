/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();



//TODO accept assignment path

router.post('/:param/submitAssignment',function (req, res) {
    db.addSubmission(req.params.param , req.query.assnId , req.body.url,function (data) {
        res.send(data);
    });
});

router.post('/new', function (req, res) {
        db.addStudent(req.body.name, req.body.roll, () => {
            res.send("Student " + req.body.name + " successfully added");
        });
});


router.post('/new/:courseId', function (req, res) {
        db.addStudent(req.body.name, req.body.roll, () => {
            res.send("Student " + req.body.name + " successfully added");
        }, req.params.courseId);
});



router.get('/:param', function (req, res) {
    db.searchStudents(req.params.param, (data) => {
        res.send(JSON.stringify(data));
    });
});

router.post('/:param',function (req, res) {
    if(req.params.param.charAt(0) < '0' || req.params.param.charAt(0) > '9'){
        res.send("pleasse use roll to edit student");
        return;
    }


    db.editStudent(req.params.param , req.body.name , () => {
        res.send("successfully updated")
    });
});


router.delete('/:param',function (req, res) {
    db.deleteStudent(req.params.param , (data) =>{
        res.send(data);
    });
});




router.get('/', function (req, res) {
    db.getStudents((data) => {
        res.send(JSON.stringify(data));
    });
    // db.acceptSubmissionWithoutId(3131,1,"https://facebook.com",()=>{res.send("success")});
});


module.exports = router;


// db.addCourse("Elixir" , "Arnav Gupta" , new Date() , new Date() , () => {
//     res.send("Course Added Successfully");
// })

// db.enrollStudentInCourse(4153 , 1 , ()=>{res.send("success")});

// db.endCourse(1,()=>{res.send("success")});