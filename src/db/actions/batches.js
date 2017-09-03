/**
 * Created by abhishekyadav on 28/06/17.
 */

const models = require('../models');


//function to add batch
function addBatch(code, teacherId, startDate, endDate, done) {
    if (!endDate) {
        models.Batches
            .create({
                code: code,
                teacherId: teacherId,
                startDate: new Date(),
                endDate: new Date().setMonth(new Date().getMonth() + 3),
                isActive: true
            })
            .then(function (data) {
                done(null, data);
            })
            .catch(function (err) {
                if (err) {
                    done(err);
                }
            });
    } else {
        models.Batches
            .create({
                code: code,
                teacherId: teacherId,
                startDate: startDate,
                endDate: endDate,
                isActive: true
            })
            .then(function (data) {
                done(null, data);
            })
            .catch(function (err) {
                if (err) {
                    done(err);
                }
            });
    }
}

//function to get all batches (overloaded for both active and passive)
function getBatches(options, done) {
    models.Batches
        .findAll({where: options})
        .then(function (data) {
            done(null, data);
        })
        .catch(function (err) {
            if (err) done(err);
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
            done(null, data);
        })
        .catch(function (err) {
            if (err) done(err);
        });
}

//function to get batches
function searchBatches(searchParameter, searchType, onlyActive, done) {
    if (onlyActive) {
        if (searchType == 'code') {
            models.Batches
                .findAll({where: {code: searchParameter, isActive: true}})
                .then(function (data) {
                    done(null, data);
                })
                .catch(function (err) {
                    if (err) done(err);
                });
        } else {
            models.Batches
                .findAll({where: {teacher: searchParameter, isActive: true}})
                .then(function (data) {
                    done(null, data);
                })
                .catch(function (err) {
                    if (err) done(err);
                });
        }
    } else {
        if (searchType == 'code') {
            models.Batches
                .findAll({where: {code: searchParameter}})
                .then(function (data) {
                    done(null, data);
                })
                .catch(function (err) {
                    if (err) done(err);
                });
        } else {
            models.Batches
                .findAll({where: {teacher: searchParameter}})
                .then(function (data) {
                    done(null, data);
                })
                .catch(function (err) {
                    if (err) done(err);
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
                    if (done) done(null, data);
                })
                .catch(function (err) {
                    if (err) done(err);
                });
        })
        .catch(function (err) {
            if (err) done(err);
        });
}

//function to edit a batch
function editBatch(id, code, teacher, endDate, done) {
    if (code) {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data.update({
                            code: code,
                            teacherId: teacher,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(null,data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            } else {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data
                        .update({
                            code: code,
                            teacherId: teacher
                        })
                        .then(function (data) {
                            done(null, data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            }
        } else {
            if (endDate) {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (data) {
                        return done(null, null);
                    }
                    data
                        .update({
                            code: code,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(null, data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            } else {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data
                        .update({
                            code: code
                        })
                        .then(function (data) {
                            done(null, data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            }
        }
    } else {
        if (teacher) {
            if (endDate) {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data
                        .update({
                            teacherId: teacher,
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(null, data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            } else {
                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data
                        .update({
                            teacherId: teacher
                        })
                        .then(function (data) {
                            done(null, data);
                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            }
        } else {
            if (endDate) {

                searchBatch(id, function (err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        return done(null, null);
                    }
                    data.update({
                            endDate: endDate
                        })
                        .then(function (data) {
                            done(null,data);

                        })
                        .catch(function (err) {
                            if (err) done(err);
                        });
                });
            } else {
                done(null, null)
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
            done(null, data);
        })
        .catch((err) => {
            if (err) done(err);
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
            done(null, data);
        })
        .catch(function (err) {
            if (err) done(err);
        });
}


module.exports = {
    addBatch,
    getBatches,
    searchBatches,
    searchBatch,
    endBatch,
    editBatch,
    deleteBatch,
    addAssignmentToBatch,


}