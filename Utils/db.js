/**
 * Created by varun on 5/24/17.
 */
const Sequelize = require('sequelize');
const models = require('./models');

//function


//function to add a teacher

function addTeacher(teacher, done) {

    models.Teachers.create({
        name: teacher.name,
        email: teacher.email
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    })


}
//function to add student
function addStudent(name, roll, email, done, Batch) {
    models.Students.create({
        roll: roll,
        name: name,
        email: email
    }).then(function (data) {
        if (Batch) enrollStudentInBatch(roll, Batch, done);
        else done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get students list
function getStudents(done) {
    models.Students.findAll().then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get get student with a particular roll
function searchStudent(id, done) {

    models.Students.findOne({where: {id: id}}).then(function (data) {
        done(data);

    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to search multiple students for a query
function searchStudents(searchParameter, searchType, done) {

    if (searchType == "name") {

        models.Students.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else if (searchType == "id") {
        models.Students.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else if (searchType == "roll") {
        models.Students.findAll({where: {roll: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Students.findAll({where: {email: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to edit a student
function editStudent(id, name, done, emailId, echo) {
    if (emailId) {
        searchStudent(id, function (data) {
            data.update({
                name: name,
                email: emailId
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
    else {
        searchStudent(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to delete a student
function deleteStudent(studentId, echo, done) {
    models.Submissions.destroy({
        where: {
            studentId: studentId
        }
    }).then(function () {

        models.StudentBatch.destroy({
            where: {
                studentId: studentId
            }
        }).then(function () {
            if (echo) {
                models.Students.findOne({where: {id: studentId}}).then(function (responseData) {

                    models.Students.destroy({
                        where: {
                            id: studentId
                        }
                    }).then(function () {
                        done(responseData);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                }).catch(function (err) {
                    if (err) throw  err;
                })

            }
            else {
                models.Students.destroy({
                    where: {
                        id: studentId
                    }
                }).then(function () {
                    done("done.!");
                }).catch(function (err) {
                    if (err) throw err;
                });
            }
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to add a new assignment
function addAssignment(name, desc, batchId, done) {
    models.Assignments.create({
        name: name,
        description: desc
    }).then(function (data) {
        if (batchId) {
            done(data);
            addAssignmentToBatch(data.id, batchId, ()=> {
            });
        }
        else done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get all assignments
function getAssignments(options, done) {

    models.Assignments.findAll({
        where: options
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}


//function to search assignments based on a parameter
function searchAssignment(id, done) {

    models.Assignments.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to get all assignments in a batch
function findAssignmentsInBatch(batchId, done) {
    models.BatchAssignments.findAll({
        where: {
            batchId: batchId
        }
    }).then(function (data) {
        let arr = [];
        if (data.length == 0) return done(arr);
        for (let i = 0; i < data.length; i++) {
            models.Assignments.findOne({
                where: {
                    id: data[i].dataValues.assignmentId
                }
            }).then(function (assnData) {
                arr.push(assnData);
                if (arr.length == data.length) done(arr);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to edit an assignment
function editAssignment(id, name, desc, done) {
    if (desc) {
        searchAssignment(id, function (data) {
            data.update({
                name: name,
                description: desc
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    } else {
        searchAssignment(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to delete an assignment
function deleteAssignment(assignmentId, done) {
    models.Submissions.destroy({
        where: {
            assignmentId: assignmentId
        }
    }).then(function () {
        models.BatchAssignments.destroy({
            where: {
                assignmentId: assignmentId
            }
        }).then(function () {
            models.Assignments.findOne({
                where: {
                    id: assignmentId
                }
            }).then(function (resData) {
                models.Assignments.destroy({
                    where: {
                        id: assignmentId
                    }
                }).then(function () {
                    done(resData);
                }).catch(function (err) {
                    if (err) throw err;
                });

            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to add batch
function addBatch(name, teacher, startDate, endDate, done) {

    if (!endDate) {
        models.Batches.create({
            name: name,
            teacher: teacher,
            startDate: new Date(),
            endDate: new Date().setMonth(new Date().getMonth() + 3),
            isActive: true
        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Batches.create({
            name: name,
            teacher: teacher,
            startDate: startDate,
            endDate: endDate,
            isActive: true
        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }

}

//function to get all batches (overloaded for both active and passive)
function getBatches(options, done) {

    models.Batches.findAll({where: options}).then(function (data) {
        done(data);
    }).then(function (err) {
        if (err) throw err;
    });


}

//function to get a particular batch
function searchBatch(id, done) {

    models.Batches.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    })

}

//function to get batches
function searchBatches(searchParameter, searchType, onlyActive, done) {
    if (onlyActive) {
        if (searchType == "name") {

            models.Batches.findAll({where: {name: searchParameter, isActive: true}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });

        }
        else {
            models.Batches.findAll({where: {teacher: searchParameter, isActive: true}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }
    else {
        if (searchType == "name") {

            models.Batches.findAll({where: {name: searchParameter}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });

        }
        else {
            models.Batches.findAll({where: {teacher: searchParameter}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }
}

//function to end an active batch
function endBatch(batchID, done) {
    models.Batches.findOne({
        where: {
            id: batchID
        }
    }).then(function (row) {
        row.update({
            isActive: false
        }).then(function (data) {
            if (done) done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    })
}

//function to get all students of batch
function getAllStudentsInBatch(batchId, done) {
    models.StudentBatch.findAll({
        where: {
            batchId: batchId
        }
    }).then(function (data) {
        var arr = [];
        if (data.length == 0) {
            return done(arr);
        }

        for (let i = 0; i < data.length; i++) {
            searchStudent(data[i].dataValues.studentId, (studentData) => {
                arr.push(studentData);
                if (arr.length == data.length) done(arr);
            });
        }

    }).catch(function (err) {
        if (err) throw err;
    });
}


//TODO  Error: Can't set headers after they are sent.

//add a submission
function addSubmission(studentId, assnId, URL, done) {
    models.StudentBatch.findAll({
        where: {
            studentId: studentId
        }
    }).then(function (data) {
        if (data.length == 0) {
            return done("not a valid submission");
        }

        let flag = false;

        for (let i = 0; i < data.length; i++) {
            models.BatchAssignments.findOne({
                where: {
                    batchId: data[i].dataValues.batchId,
                    assignmentId: assnId
                }
            }).then(function (row) {
                if (row) {
                    flag = true;
                    models.Submissions.create({
                        studentId: studentId,
                        assignmentId: assnId,
                        status: false,
                        URL: URL
                    }).then(function (data) {
                        let arr = [];
                        arr.push(data);
                        done(arr);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                }
                else {
                    if (i == data.length - 1) {
                        return done("Not a valid submission");
                    }
                }

            }).catch(function (err) {
                if (err) throw err;
            });

            if (flag) break;

        }
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to accept a submission with submission id
function acceptSubmissionbyId(id, echo, done) {
    if (echo) {
        models.Submissions.findOne({where: {id: id}}).then(function (row) {
            row.update({
                status: true
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Submissions.findOne({where: {id: id}}).then(function (row) {
            row.update({
                status: true
            }).then(function () {
                done("Success");
            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }


}

//function to accept a submission without submission id
function acceptSubmissionWithoutId(studentId, assnId, URL, done) {

    models.Submissions.findOne(
        {
            where: {
                studentId: studentId,
                assignmentId: assnId,
                URL: URL
            }
        }).then(function (row) {
        row.update({
            status: true
        }).then(function () {
            done();
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to get all submissions
function getSubmissions(onlyAccepted, done) {
    if (onlyAccepted) {
        models.Submissions.findAll({where: {status: true}}).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Submissions.findAll().then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to search submissions
function searchSubmissions(options, done) {

    models.Submissions.findAll({where: options}).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to search submissions by batch
//TODO done being called more than once
function searchByBatch(batchId, onlyAccepted, done) {
    models.BatchAssignments.findAll({where: {batchId: batchId}}).then(function (data) {
        let arr = [];
        let i = 0;
        let flag = false;
        for (i = 0; i < data.length; i++) {
            let options = {};
            options.assignmentId = data[i].dataValues.assignmentId;
            searchSubmissions(options, (rows) => {
                for (let j = 0; j < rows.length; j++) {
                    arr.push(rows[j].dataValues);
                }
                if (i >= data.length - 1) done(arr);
            }, onlyAccepted);
        }
        if (data.length == 0) {
            done(arr);
        }
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to edit the details of a student
function editStudent(id, name, done, emailId, echo) {
    if (emailId) {
        searchStudent(id, function (data) {
            data.update({
                name: name,
                email: emailId
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
    else {
        searchStudent(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to edit a batch
function editBatch(id, name, teacher, endDate, done) {

    if (name) {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (data) {
                    data.update({
                        name: name,
                        teacher: teacher,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchBatch(id, function (data) {
                    data.update({
                        name: name,
                        teacher: teacher
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }
        }
        else {
            if (endDate) {
                searchBatch(id, function (data) {
                    data.update({
                        name: name,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchBatch(id, function (data) {
                    console.log(data);
                    data.update({
                        name: name
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }

        }
    }
    else {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (data) {
                    data.update({
                        teacher: teacher,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchBatch(id, function (data) {
                    data.update({
                        teacher: teacher
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }
        }
        else {
            if (endDate) {
                searchBatch(id, function (data) {
                    data.update({
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                res.send("bhai chahta kya hai?");
            }
        }
    }
}

//function to delete batch
//TODO cascade delete not working
function deleteBatch(id, done) {
    models.Batches.destroy({
        where: {
            id: id
        }
    }).then((data) => {
        done(data);
    }).catch(() => {
        if (err) throw err;
    });
}

//function to handle a new enrollment
function enrollStudentInBatch(studentParamType, studentParam, BatchId, done) {

    searchStudents(studentParam, studentParamType, (data) => {
        models.StudentBatch.create({
            studentId: data[0].dataValues.id,
            batchId: BatchId

        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    })

}

//function to add an assignment to a batch
function addAssignmentToBatch(assnID, batchID, done) {
    models.BatchAssignments.create({
        batchId: batchID,
        assignmentId: assnID,
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });

}


module.exports = {
    addStudent,
    getStudents,
    searchStudent,
    searchStudents,
    editStudent,
    editBatch,
    deleteStudent,
    addAssignment,
    getAssignments,
    searchAssignment,
    findAssignmentsInBatch,
    editAssignment,
    deleteAssignment,
    addBatch,
    getBatches,
    searchBatch,
    searchBatches,
    deleteBatch,
    addSubmission,
    searchSubmissions,
    searchByBatch,
    enrollStudentInBatch,
    addAssignmentToBatch,
    endBatch,
    getSubmissions,
    acceptSubmissionbyId,
    acceptSubmissionWithoutId,
    getAllStudentsInBatch,
    addTeacher
}

