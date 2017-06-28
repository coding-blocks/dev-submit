/**
 * Created by abhishekyadav on 28/06/17.
 */


const models = require('./models');


//TODO  Error: Can't set headers after they are sent.

//add a submission
function addSubmission(studentId, assnId, URL, done) {
    models.StudentBatch
        .findAll({
            where: {
                studentId: studentId
            }
        })
        .then(function (data) {
            if (data.length == 0) {
                return done('not a valid submission');
            }

            let flag = false;

            for (let i = 0; i < data.length; i++) {
                models.BatchAssignments
                    .findOne({
                        where: {
                            batchId: data[i].dataValues.batchId,
                            assignmentId: assnId
                        }
                    })
                    .then(function (row) {
                        if (row) {
                            flag = true;
                            models.Submissions
                                .create({
                                    studentId: studentId,
                                    assignmentId: assnId,
                                    status: false,
                                    URL: URL
                                })
                                .then(function (data) {
                                    let arr = [];
                                    arr.push(data);
                                    done(arr);
                                })
                                .catch(function (err) {
                                    if (err) throw err;
                                });
                        } else {
                            if (i == data.length - 1) {
                                return done('Not a valid submission');
                            }
                        }
                    })
                    .catch(function (err) {
                        if (err) throw err;
                    });

                if (flag) break;
            }
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to accept a submission with submission id
function acceptSubmissionbyId(id, echo, done) {
    if (echo) {
        models.Submissions
            .findOne({where: {id: id}})
            .then(function (row) {
                row
                    .update({
                        status: true
                    })
                    .then(function (data) {
                        done(data);
                    })
                    .catch(function (err) {
                        if (err) throw err;
                    });
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Submissions
            .findOne({where: {id: id}})
            .then(function (row) {
                row
                    .update({
                        status: true
                    })
                    .then(function () {
                        done('Success');
                    })
                    .catch(function (err) {
                        if (err) throw err;
                    });
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}

//function to accept a submission without submission id
function acceptSubmissionWithoutId(studentId, assnId, URL, done) {
    models.Submissions
        .findOne({
            where: {
                studentId: studentId,
                assignmentId: assnId,
                URL: URL
            }
        })
        .then(function (row) {
            row
                .update({
                    status: true
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to get all submissions
function getSubmissions(onlyAccepted, done) {
    if (onlyAccepted) {
        models.Submissions
            .findAll({where: {status: true}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Submissions
            .findAll()
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}

//function to search submissions
function searchSubmissions(options, done) {
    models.Submissions
        .findAll({where: options})
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to search submissions by batch
//TODO done being called more than once
function searchByBatch(batchId, onlyAccepted, done) {
    models.BatchAssignments
        .findAll({where: {batchId: batchId}})
        .then(function (data) {
            let arr = [];
            let i = 0;
            let flag = false;
            for (i = 0; i < data.length; i++) {
                let options = {};
                options.assignmentId = data[i].dataValues.assignmentId;
                searchSubmissions(
                    options,
                    rows => {
                        for (let j = 0; j < rows.length; j++) {
                            arr.push(rows[j].dataValues);
                        }
                        if (i >= data.length - 1) done(arr);
                    },
                    onlyAccepted
                );
            }
            if (data.length == 0) {
                done(arr);
            }
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

module.exports = {

    addSubmission,
    acceptSubmissionbyId,
    acceptSubmissionWithoutId,
    getSubmissions,
    searchSubmissions,
    searchByBatch
}