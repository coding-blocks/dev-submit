/**
 * Created by varun on 5/24/17.
 */
const express = require('express');
const db = require('../../db');

const router = express.Router();

//done
router.post('/new', function(req, res) {
  db.actions.users.addUser(data => {
    db.models.addStudent(
      req.body.name,
      req.body.roll,
      req.body.email,
      data.dataValues.id,
      data => {
        res.send(data.dataValues);
      }
    );
  });
});

//done
router.get('/', function(req, res) {
  let roll = req.query.roll;
  let name = req.query.name;
  let type = 'all';

  if (roll) {
    type = 'roll';
  } else if (name) {
    type = 'name';
  }a

  if (type == 'all')
    db.actions.students.getStudents(data => {
      res.send(data);
    });
  else if (type == 'roll') {
    db.actions.students.searchStudents(roll, type, data => {
      res.send(data);
    });
  } else {
    db.actions.students.searchStudents(name, type, data => {
      res.send(data);
    });
  }
});

//done
router.get('/:id', function(req, res) {
  db.actions.students.searchStudent(req.params.id, data => {
    res.send(data);
  });
});

//done
router.put('/:id', function(req, res) {
  db.actions.students.editStudent(
    req.params.id,
    req.body.name,
    data => {
      res.send(data);
    },
    req.body.email,
    req.query.echo
  );
});

//TODO add hooks to delete user with it
router.delete('/:id', function(req, res) {
  db.actions.students.deleteStudent(req.params.id, req.query.echo, data => {
    res.send(data);
  });
});

//done
router.post('/:id/enroll/:batchId', function(req, res) {
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
