/**
 * Created by varun on 5/24/17.
 */

const express = require('express');
const db = require('../Utils/db');
const router = express.Router();

//TODO add echo support

//5
router.post('/:id/addToCourse/:courseId',function (req, res) {
    db.addAssignmentToCourse(req.params.id , req.params.courseId , (data)=>{
        res.send(data);
    });
});

//0
router.post('/new', function (req, res) {
    console.log(req.body.desc)
    db.addAssignment(req.body.name, req.body.desc, req.body.courseId, (data) => {
        let arr = [];
        arr.push(data.dataValues);
        res.send(arr);
    });
});

//2
router.get('/:id', function (req, res) {
    let arr = [];
    db.searchAssignment(req.params.id, (data) => {
        arr.push(data);
        res.send(arr);
    });
});

//3
router.put('/:id',function (req, res) {
    console.log(req.body);
    db.editAssignment(req.params.id, req.body.name, req.body.desc,
        (data) => {
        let arr = []
            arr.push(data);
            res.send(arr);
        });
});

//4
router.delete('/:id',function (req, res) {
    db.deleteAssignment(req.params.id, (data) =>{
        res.send(data);
    });
});

//1
router.get('/', function (req, res) {

    let type = "all";
    let name = req.query.name;
    let courseId = req.query.courseId;

    if(name){
        type = "name";
    }
    else if(courseId){
        type = "courseId";
    }

    if(type == "all")
        db.getAssignments((data) => {
            res.send(data);
        });
    else if(type == "name"){
        db.searchAssignments("name", name, (data)=>{
            res.send(data);
        });
    }
    else{
        db.findAssignmentsInCourse(courseId, (data)=>{
            res.send(data);
        });
    }
});

module.exports = router;