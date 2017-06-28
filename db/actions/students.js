/**
 * Created by abhishekyadav on 28/06/17.
 */
const db = require('../../db');
const bcrypt = require('bcrypt');



//function to add student
function addStudent(name, roll, email, UserID, done, Batch) {
    db.models.Students
        .create({
            roll: roll,
            name: name,
            email: email,
            userId: UserID
        })
        .then(function (data) {
            if (Batch) db.actions.batches.enrollStudentInBatch(roll, Batch, done);
            else done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get students list
function getStudents(done) {
    db.models.Students
        .findAll()
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get student with a particular roll
function searchStudent(id, done) {
    db.models.Students
        .findOne({where: {id: id}})
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to search multiple students for a query
function searchStudents(searchParameter, searchType, done) {
    if (searchType == 'name') {
        db.models.Students
            .findAll({where: {name: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else if (searchType == 'id') {
        db.models.Students
            .findAll({where: {id: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else if (searchType == 'roll') {
        db.models.Students
            .findAll({where: {roll: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        db.models.Students
            .findAll({where: {email: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}


//function to edit a student
function editStudent(id, name, done, emailId, echo) {
    if (emailId) {
        db.actions.students.searchStudent(id, function (data) {
            data
                .update({
                    name: name,
                    email: emailId
                })
                .then(function (data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        });
    } else {
        db.actions.students.searchStudent(id, function (data) {
            data
                .update({
                    name: name
                })
                .then(function (data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        });
    }
}


//function to delete a student
function deleteStudent(studentId, echo, done) {
    db.models.Submissions
        .destroy({
            where: {
                studentId: studentId
            }
        })
        .then(function () {
            db.models.StudentBatch
                .destroy({
                    where: {
                        studentId: studentId
                    }
                })
                .then(function () {
                    if (echo) {
                        db.models.Students
                            .findOne({where: {id: studentId}})
                            .then(function (responseData) {
                                db.models.Students
                                    .destroy({
                                        where: {
                                            id: studentId
                                        }
                                    })
                                    .then(function () {
                                        done(responseData);
                                    })
                                    .catch(function (err) {
                                        if (err) throw err;
                                    });
                            })
                            .catch(function (err) {
                                if (err) throw err;
                            });
                    } else {
                        db.models.Students
                            .destroy({
                                where: {
                                    id: studentId
                                }
                            })
                            .then(function () {
                                done('done.!');
                            })
                            .catch(function (err) {
                                if (err) throw err;
                            });
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

module.exports = {
    addStudent,
    getStudents,
    searchStudents,
    searchStudent,
    editStudent,
    deleteStudent
}
