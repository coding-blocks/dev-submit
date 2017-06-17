/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


router.post('/:id/enroll/:courseId',function (req, res) {
    let echo = req.query.echo;
    db.enrollStudentInCourse("id",req.params.id , req.params.courseId , (data)=>{
        if(echo){
            res.send(data);
        }
        else{
            res.send("success");
        }
    });
});

router.post('/new', function (req, res) {
        db.addStudent(req.body.name, req.body.roll , req.body.email , (data) => {
            let arr = [];
            arr.push(data.dataValues);
            res.send(arr);
        });
});

router.get('/:id', function (req, res) {
    db.searchStudent(req.params.id, (data) => {
        let arr = [];
        arr.push(data);
        res.send(arr);
    });
});

router.put('/:id',function (req, res) {
        db.editStudent(req.params.id, req.body.name, (data) => {
            res.send(data);
        } , req.body.email , req.query.echo);
});


router.delete('/:id',function (req, res) {
    db.deleteStudent(req.params.id , req.query.echo ,  (data) =>{
        res.send(data);
    });
});




router.get('/', function (req, res) {

    let roll = req.query.roll;
    let name = req.query.name;
    let type = "all";

    if(roll){
        type = "roll";
    }
    else if(name){
        type = "name";
    }

    if(type == "all")
        db.getStudents((data) => {
            res.send(data);
        });
    else if(type == "roll"){
        db.searchStudents(roll , type , (data)=>{
            res.send(data);
        });
    }
    else{
        db.searchStudents(name , type , (data)=>{
            res.send(data);
        });
    }
});


module.exports = router;


// db.addCourse("Elixir" , "Arnav Gupta" , new Date() , new Date() , () => {
//     res.send("Course Added Successfully");
// })

// db.enrollStudentInCourse(4153 , 1 , ()=>{res.send("success")});

// db.endCourse(1,()=>{res.
//
// send("success")});



//done
//integer autoincrement id
//roll to string
//post -> put for update
//for new send the new object without echo
//remove / enroll while creating the new object
// Students.hasMany(Submissions, {
// onDelete: 'cascade', hooks: true
// });
//echo true to  send updated object to be sent
// /?name=Varun&roll=


/*
/students
    /:id
    /new
    /?name=Varun&roll=
    /:id/enroll/:courseId



//TODO abhishek this is your stuff
/courses
    /:id
    /new
    /:id/enroll [POST] - body - Array<id> or Array<roll> or Array<email>
            {
                datatype: 'email'
                data: [
                        'asdsd@asd.com'
                        'asdasa@asdas.com'
                      ]
            }




//TODO I am making this
/submissions
    /?course=Pandora - [GET]  Array<submissions>
    /new [POST] studentId, courseId, link
    /:id [PUT] for changing status from submitted to accepted

 */