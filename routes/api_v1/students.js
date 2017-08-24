/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../../db');
const utils = require('../../utils');


const router = express.Router();

//done
router.post('/new',utils.acl.ensureTeacher(), function (req, res) {
    db.actions.users.addUser(req.body.name, req.body.email, data => {
        db.actions.students.addStudent(
            req.body.roll,
            data.dataValues.id,
            data => {
                res.send(data.dataValues);
            }
        );
    });
});

//done
router.get('/',utils.acl.ensureTeacher(), function (req, res) {
    let roll = req.query.roll;
    let name = req.query.name;
    let email = req.query.email
    let type = 'all';

    if (roll) {
        type = 'roll';
    } else if (name) {
        type = 'name';
    }
    else if (email) {
        type = 'email'
    }

    if (type == 'all')
        db.actions.students.getStudents(data => {
            res.send(data);
        });
    else if (type == 'roll') {
        db.actions.students.searchStudents(roll, type, data => {
            res.send(data);
        });
    }
    else if (type == 'email') {
        db.actions.students.searchStudents(email, type, data => res.send(data))
    }
    else {
        db.actions.students.searchStudents(name, type, data => {
            res.send(data);
        });
    }
});

//done
router.get('/:id',utils.acl.ensureStudentId('id'), function (req, res) {
    db.actions.students.searchStudent(req.params.id, data => {
        res.send(data);
    });
});

router.delete('/:id',utils.acl.ensureOwnUser('id'), function (req, res) {
    db.actions.students.deleteStudent(req.params.id, req.query.echo, data => {
        res.send(data);
    });
});

//done
router.post('/:id/enroll/:batchId',utils.acl.ensureTeacher(), function (req, res) {
    let echo = req.query.echo;
    db.actions.students.enrollStudentInBatch('id', req.params.id, req.params.batchId, data => {
        if (echo) {
            res.send(data);
        } else {
            res.send('success');
        }
    });
});

module.exports = router;
