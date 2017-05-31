/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();

//my router

router.post('/new/:courseId',function (req, res) {
    if(req.params.courseId){

        db.addStudent(req.body.name,req.body.roll,() => {
            res.send("Student " + req.body.name + " successfully added");
        } , req.params.courseId);
    }
    else{
        db.addStudent(req.body.name,req.body.roll,() => {
            res.send("Student " + req.body.name + " successfully added");
        });
    }


});

router.get('/:param',function (req, res) {
    db.searchStudents(req.params.param,(data) => {
       res.send(JSON.stringify(data));
    });
});

router.get('/',function (req, res) {
    db.getStudents((data) => {
        res.send(JSON.stringify(data));
    });
});




module.exports = router;


// db.addCourse("Elixir" , "Arnav Gupta" , new Date() , new Date() , () => {
//     res.send("Course Added Successfully");
// })

// db.enrollStudentInCourse(4153 , 1 , ()=>{res.send("success")});

// db.endCourse(1,()=>{res.send("success")});