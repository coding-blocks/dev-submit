/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../Utils/db');

const router = express.Router();


//tested
router.post('/new', function (req, res) {
    db.addStudent(req.body.name, req.body.roll , req.body.email , (data) => {
        let arr = [];
        arr.push(data.dataValues);
        res.send(arr);
    });
});

//tested
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



//tested
router.get('/:id', function (req, res) {
    db.searchStudent(req.params.id, (data) => {
        res.send(data);
    });
});



//tested
router.put('/:id',function (req, res) {
    db.editStudent(req.params.id, req.body.name, (data) => {
        res.send(data);
    } , req.body.email , req.query.echo);
});


//tested
router.delete('/:id',function (req, res) {
    db.deleteStudent(req.params.id , req.query.echo ,  (data) =>{
        res.send(data);
    });
});


//tested
router.post('/:id/enroll/:batchId',function (req, res) {
    let echo = req.query.echo;
    db.enrollStudentInBatch("id",req.params.id , req.params.batchId , (data)=>{
        if(echo){
            res.send(data);
        }
        else{
            res.send("success");
        }
    });
});







module.exports = router;


// db.addBatch("Elixir" , "Arnav Gupta" , new Date() , new Date() , () => {
//     res.send("Batch Added Successfully");
// })

// db.enrollStudentInBatch(4153 , 1 , ()=>{res.send("success")});

// db.endBatch(1,()=>{res.
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
    /:id/enroll/:batchId



//TODO abhishek this is your stuff
/batches
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
    /?batch=Pandora - [GET]  Array<submissions>
    /new [POST] studentId, batchId, link
    /:id [PUT] for changing status from submitted to accepted

 */