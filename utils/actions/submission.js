/**
 * Created by apoorvaa_gupta on 28/6/17.
 */

const models = require('./../models');
//add a submission
function add(studentId, assnId, URL, done) {
    models.StudentBatch
        .findAll({
            where: {
                studentId: studentId
            }
        })
        .then(function(data) {
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
                    .then(function(row) {
                        if (row) {
                            flag = true;
                            models.Submissions
                                .create({
                                    studentId: studentId,
                                    assignmentId: assnId,
                                    status: false,
                                    URL: URL
                                })
                                .then(function(data) {
                                    let arr = [];
                                    arr.push(data);
                                    done(arr);
                                })
                                .catch(function(err) {
                                    if (err) throw err;
                                });
                        } else {
                            if (i == data.length - 1) {
                                return done('Not a valid submission');
                            }
                        }
                    })
                    .catch(function(err) {
                        if (err) throw err;
                    });

                if (flag) break;
            }
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

//function to accept a submission with submission id
function acceptById(id, echo, done) {
    if (echo) {
        models.Submissions
            .findOne({ where: { id: id } })
            .then(function(row) {
                row
                    .update({
                        status: true
                    })
                    .then(function(data) {
                        done(data);
                    })
                    .catch(function(err) {
                        if (err) throw err;
                    });
            })
            .catch(function(err) {
                if (err) throw err;
            });
    } else {
        models.Submissions
            .findOne({ where: { id: id } })
            .then(function(row) {
                row
                    .update({
                        status: true
                    })
                    .then(function() {
                        done('Success');
                    })
                    .catch(function(err) {
                        if (err) throw err;
                    });
            })
            .catch(function(err) {
                if (err) throw err;
            });
    }
}

//function to accept a submission without submission id
function acceptWithoutId(studentId, assnId, URL, done) {
    models.Submissions
        .findOne({
            where: {
                studentId: studentId,
                assignmentId: assnId,
                URL: URL
            }
        })
        .then(function(row) {
            row
                .update({
                    status: true
                })
                .then(function() {
                    done();
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

//function to get all submissions
function getAll(onlyAccepted, done) {
    if (onlyAccepted) {
        models.Submissions
            .findAll({ where: { status: true } })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    } else {
        models.Submissions
            .findAll()
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    }
}

//function to search submissions
function searchAll(options, done) {
    models.Submissions
        .findAll({ where: options })
        .then(function(data) {
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

module.exports = {
    add,
    acceptById,
    acceptWithoutId,
    getAll,
    searchAll
}