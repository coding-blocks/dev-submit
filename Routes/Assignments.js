/**
 * Created by varun on 5/24/17.
 */

const express = require('express');
const db = require('../Utils/db');

const router = express.Router();

router.post('/:id/addToCourse/:courseId',function (req, res) {
    db.addAssignmentToCourse(req.params.id , req.params.courseId , (data)=>{
        res.send("Assignment added");
    });
});

router.post('/new', function (req, res) {
    db.addAssignment(req.body.name, req.body.desc, req.body.courseId, (data) => {
        let arr = [];
        arr.push(data.dataValues);
        res.send(arr);
    });
});

router.delete('/:id',function (req, res) {
    db.deleteAssignment(req.params.id, (data) =>{
        res.send(data);
    });
});

router.put('/:id',function (req, res) {
    db.editAssignment(req.params.id, req.body.name, req.body.desc,
        (data) => {
            res.send(data);
        });
});

router.get('/:id', function (req, res) {
    db.searchAssignment(req.params.id, (data) => {
        res.send(arr);
    });
});

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
        db.searchAssignment( name, (data)=>{
            res.send(data);
        });
    }
    else{
        db.findAssignmentsInCourse( courseId, (data)=>{
            res.send(data);
        });
    }
});

module.exports = express.Router();