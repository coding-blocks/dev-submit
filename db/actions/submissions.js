/**
 * Created by abhishekyadav on 28/06/17.
 */


const models = require('../models');


//TODO  Error: Can't set headers after they are sent.

//add a submission
function addSubmission(studentId, BatchAssnId, URL, done) {
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

            models.BatchAssignments.findOne({
                where: {
                    id: BatchAssnId
                }
            }).then(function (BatchAssignmentData) {
                if (!BatchAssignmentData) return done("Not Valid BatchAssignmentId")

                let flag = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].dataValues.batchId == BatchAssignmentData.batchId) {
                        flag = true;
                        models.Submissions
                            .upsert({
                                studentId: studentId,
                                batchAssignmentId: BatchAssnId,
                                status: false,
                                URL: URL
                            })
                            .then(function (data) {
                                done(data);
                            })
                            .catch(function (err) {
                                if (err) throw err;
                            });
                    }
                    if(flag) break;
                }
            }).catch(function (err) {
                if(err) throw err;
            });
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
                row.update({
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
function acceptSubmissionWithoutId(studentId, BatchAssnId, URL, done) {
    models.Submissions
        .findOne({
            where: {
                studentId: studentId,
                batchAssignmentId: BatchAssnId,
                URL: URL
            }
        })
        .then(function (row) {
            row.update({
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
            .findAll({})

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
//TODO this function
//function to search submissions by batch
function searchByBatch(batchId,onlyAccepted,done) {
    if(!onlyAccepted) onlyAccepted = null;
    models.Submissions.findAll({
        where : {
          status : onlyAccepted
        },
        include: [
            {
                model: models.BatchAssignments,
                where : {
                    batchId : batchId
                }
            }
        ]
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if(err) throw err;
    })
}

module.exports = {

    addSubmission,
    acceptSubmissionbyId,
    acceptSubmissionWithoutId,
    getSubmissions,
    searchSubmissions,
    searchByBatch
}