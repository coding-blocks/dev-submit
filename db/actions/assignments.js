/**
 * Created by abhishekyadav on 28/06/17.
 */

const db = require('../../db');


//function to add a new assignment
function addAssignment(name, desc, batchId, done) {
    db.models.Assignments
        .create({
            name: name,
            description: desc
        })
        .then(function (data) {
            if (batchId) {
                done(data);
                db.actions.batches.addAssignmentToBatch(data.id, batchId, () => {
                });
            } else done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to get all assignments
function getAssignments(options, done) {
    db.models.Assignments
        .findAll({
            where: options
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to search assignments based on a parameter
function searchAssignment(id, done) {
    db.models.Assignments
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

//function to get all assignments in a batch
function findAssignmentsInBatch(batchId, done) {
    db.models.BatchAssignments
        .findAll({
            where: {
                batchId: batchId
            }
        })
        .then(function (data) {
            let arr = [];
            if (data.length == 0) return done(arr);
            for (let i = 0; i < data.length; i++) {
                db.models.Assignments
                    .findOne({
                        where: {
                            id: data[i].dataValues.assignmentId
                        }
                    })
                    .then(function (assnData) {
                        arr.push(assnData);
                        if (arr.length == data.length) done(arr);
                    })
                    .catch(function (err) {
                        if (err) throw err;
                    });
            }
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

//function to edit an assignment
function editAssignment(id, name, desc, done) {
    if (desc) {
        searchAssignment(id, function (data) {
            data
                .update({
                    name: name,
                    description: desc
                })
                .then(function (data) {
                    done(data);
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        });
    } else {
       searchAssignment(id, function (data) {
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

//function to delete an assignment
function deleteAssignment(assignmentId, done) {
    db.models.Submissions
        .destroy({
            where: {
                assignmentId: assignmentId
            }
        })
        .then(function () {
            db.models.BatchAssignments
                .destroy({
                    where: {
                        assignmentId: assignmentId
                    }
                })
                .then(function () {
                    db.models.Assignments
                        .findOne({
                            where: {
                                id: assignmentId
                            }
                        })
                        .then(function (resData) {
                            db.models.Assignments
                                .destroy({
                                    where: {
                                        id: assignmentId
                                    }
                                })
                                .then(function () {
                                    done(resData);
                                })
                                .catch(function (err) {
                                    if (err) throw err;
                                });
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
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
    addAssignment,
    getAssignments,
    findAssignmentsInBatch,
    editAssignment,
    deleteAssignment,
    searchAssignment
}