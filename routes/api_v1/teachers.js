/**
 * Created by tech4GT on 6/27/17.
 */
const express = require('express');
const db = require('../../db');
const utils = require('../../utils');


const router = express.Router();

//done
router.post('/new',utils.acl.ensureAdmin, function (req, res) {
    db.actions.users.addUser(req.body.name, req.body.email, data => {
        db.actions.teachers.addTeacher(data.dataValues.id, data => {
            res.send(data.dataValues);
        });
    });
});

//done
router.get('/',utils.acl.ensureTeacher, function (req, res) {
    let type = req.query.name ? 'name' : req.query.email ? 'email' : 'all';
    let param = req.query.name
        ? req.query.name
        : req.query.email ? req.query.email : '';

    if (type == 'all')
        db.actions.teachers.getTeachers(data => {
            res.send(data);
        });
    else {
        db.actions.teachers.searchTeachers(param, type, data => {
            res.send(data);
        });
    }
});

//done
router.get('/:id',utils.acl.ensureTeacherId('id'), function (req, res) {
    db.actions.teachers.searchTeacher(req.params.id, data => {
        res.send(data);
    });
});

router.delete('/:id',utils.acl.ensureAdmin, function (req, res) {
    db.actions.teachers.deleteTeacher(req.params.id, req.query.echo, data => {
        res.send(data);
    });
});

module.exports = router;
