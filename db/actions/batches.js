/**
 * Created by abhishekyadav on 28/06/17.
 */

const models = require('./models');

//function to add batch
function addBatch(name, teacherId, startDate, endDate, done) {
    if (!endDate) {
        models.Batches
            .create({
                name: name,
                teacherId: teacherId,
                startDate: new Date(),
                endDate: new Date().setMonth(new Date().getMonth() + 3),
                isActive: true
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Batches
            .create({
                name: name,
                teacher: teacher,
                startDate: startDate,
                endDate: endDate,
                isActive: true
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}

//function to get all batches (overloaded for both active and passive)
function getBatches(options, done) {
    models.Batches
        .findAll({where: options})
        .then(function (data) {
            done(data);
        })
        .then(function (err) {
            if (err) throw err;
        });
}

//function to get a particular batch
function searchBatch(id, done) {
    models.Batches
        .findOne({
            where: {
                id: id
            }
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to get batches
function searchBatches(searchParameter, searchType, onlyActive, done) {
    if (onlyActive) {
        if (searchType == 'name') {
            models.Batches
                .findAll({where: {name: searchParameter, isActive: true}})
                .then(function (data) {
                    done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        } else {
            models.Batches
                .findAll({where: {teacher: searchParameter, isActive: true}})
                .then(function (data) {
                    done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        }
    } else {
        if (searchType == 'name') {
            models.Batches
                .findAll({where: {name: searchParameter}})
                .then(function (data) {
                    done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        } else {
            models.Batches
                .findAll({where: {teacher: searchParameter}})
                .then(function (data) {
                    done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        }
    }
}

//function to end an active batch
function endBatch(batchID, done) {
    models.Batches
        .findOne({
            where: {
                id: batchID
            }
        })
        .then(function (row) {
            row
                .update({
                    isActive: false
                })
                .then(function (data) {
                    if (done) done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to edit a batch
function editBatch(id, name, teacher, endDate, done) {
    if (name) {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (data) {
                    data
                        .update({
                            name: name,
                            teacher: teacher,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            } else {
                searchBatch(id, function (data) {
                    data
                        .update({
                            name: name,
                            teacher: teacher
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            }
        } else {
            if (endDate) {
                searchBatch(id, function (data) {
                    data
                        .update({
                            name: name,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            } else {
                searchBatch(id, function (data) {
                    console.log(data);
                    data
                        .update({
                            name: name
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            }
        }
    } else {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (data) {
                    data
                        .update({
                            teacher: teacher,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            } else {
                searchBatch(id, function (data) {
                    data
                        .update({
                            teacher: teacher
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            }
        } else {
            if (endDate) {
                searchBatch(id, function (data) {
                    data
                        .update({
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(data);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                });
            } else {
                res.send('bhai chahta kya hai?');
            }
        }
    }
}

//function to delete batch
//TODO cascade delete not working
function deleteBatch(id, done) {
    models.Batches
        .destroy({
            where: {
                id: id
            }
        })
        .then(data => {
            done(data);
        })
        .catch(() => {
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

//function to add an assignment to a batch
function addAssignmentToBatch(assnID, batchID, done) {
    models.BatchAssignments
        .create({
            batchId: batchID,
            assignmentId: assnID
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
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
    getAllStudentsInBatch,
    addBatch,
    getBatches,
    searchBatches,
    searchBatch,
    endBatch,
    editBatch,
    deleteBatch,
    addAssignmentToBatch,
    enrollStudentInBatch,

}