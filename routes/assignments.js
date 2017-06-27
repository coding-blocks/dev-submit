/**
 * Created by varun on 5/24/17.
 */

const express = require('express');
const db = require('../utils/db');
const router = express.Router();

//TODO add echo support


//tested
router.post('/new', function (req, res) {
    db.addAssignment(req.body.name, req.body.desc, req.body.batchId, (data) => {
        let arr = [];
        arr.push(data.dataValues);
        res.send(arr);
    });
});

//tested
router.get('/', function (req, res) {

    var options = {};

    let type = "all";
    let name = req.query.name;
    let batchId = req.query.batchId;

    if (name) {
        options.name = name;
    }
    else if (batchId) {
        options.id = id;
    }
    db.getAssignments(options, (data)=> {
        res.send(data);
    });


});

//tested
router.get('/:id', function (req, res) {

    db.searchAssignment(req.params.id, (data) => {
        res.send(data);
    });
});

//tested
router.put('/:id', function (req, res) {
    console.log(req.body);
    db.editAssignment(req.params.id, req.body.name, req.body.desc,
        (data) => {
            res.send(data);
        });
});

//tested
router.delete('/:id', function (req, res) {
    db.deleteAssignment(req.params.id, (data) => {
        res.send(data);
    });
});

//tested
router.post('/:id/addToBatch/:batchId', function (req, res) {
    db.addAssignmentToBatch(req.params.id, req.params.batchId, (data)=> {
        res.send(data);
    });
});


module.exports = router;