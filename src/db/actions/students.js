/**
 * Created by abhishekyadav on 28/06/17.
 */
const models = require('../models');
const bcrypt = require('bcrypt');


//function to add student
function addStudent(roll, UserID, done, Batch) {
    models.Students
        .create({
            roll: roll,
            userId: UserID
        })
        .then(function (data) {
            if (Batch) enrollStudentInBatch(roll, Batch, done);
            else done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get students list
function getStudents(done) {
    models.Students
        .findAll({
            include: [models.Users]
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get student with a particular roll
function searchStudent(id, done) {
    models.Students
        .findOne({
            where: {id: id},
            include: [models.Users]
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//
// models.Teachers.findAll({
//         where: {
//             '$user.name$': req.body.name
//         },
//     },
//     {
//         include: [models.Users]
//     }
// )


//function to search multiple students for a query
function searchStudents(searchParameter, searchType, done) {
    if (searchType == 'name') {
        models.Students
            .findAll(
                {
                    include: [{
                        model: models.Users,
                        where: {
                            name: searchParameter
                        }
                    }]
                })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else if (searchType == 'id') {
        models.Students
            .findAll({where: {id: searchParameter}, include: [models.Users]})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else if (searchType == 'roll') {
        models.Students
            .findAll({where: {roll: searchParameter}, include: [models.Users]})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Students
            .findAll({
                include: [{
                    model: models.Users,
                    where: {
                        email: searchParameter
                    }
                }]
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}

//function to delete a student
function deleteStudent(studentId, echo, done) {
    //TODO to be discussed if we delete the user along with it or just reset the role
    models.Submissions
        .destroy({
            where: {
                studentId: studentId
            }
        })
        .then(function () {
            models.StudentBatch
                .destroy({
                    where: {
                        studentId: studentId
                    }
                })
                .then(function () {
                    if (echo) {
                        models.Students
                            .findOne({where: {id: studentId}})
                            .then(function (responseData) {
                                models.Students
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
                        models.Students
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
//function to handle a new enrollment
function enrollStudentInBatch(studentParamType, studentParam, BatchId, done) {
    searchStudents(studentParam, studentParamType, data => {
        models.StudentBatch
            .create({
                studentId: data[0].dataValues.id,
                batchId: BatchId
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    });
}


//function to get all students of batch
function getAllStudentsInBatch(batchId, done) {

    models.StudentBatch
        .findAll({
            where: {
                batchId: batchId
            }
        })
        .then(function (data) {
            var arr = [];
            if (data.length == 0) {
                return done(arr);
            }

            for (let i = 0; i < data.length; i++) {
                searchStudent(data[i].dataValues.studentId, studentData => {
                    arr.push(studentData);
                    if (arr.length == data.length) done(arr);
                });
            }
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
    deleteStudent,
    enrollStudentInBatch,
    getAllStudentsInBatch
}
