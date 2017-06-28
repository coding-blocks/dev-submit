/**
 * Created by apoorvaa_gupta on 28/6/17.
 */


const models = require('./../models');
//function to add a new assignment
function add(name, desc, batchId, done) {
    models.Assignments
        .create({
            name: name,
            description: desc
        })
        .then(function(data) {
            if (batchId) {
                done(data);
                addAssignmentToBatch(data.id, batchId, () => {});
            } else done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

//function to get all assignments
function getAll(options, done) {
    models.Assignments
        .findAll({
            where: options
        })
        .then(function(data) {
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

//function to search assignments based on a parameter
function search(id, done) {
    models.Assignments
        .findOne({
            where: {
                id: id
            }
        })
        .then(function(data) {
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

//function to edit an assignment
function edit(id, name, desc, done) {
    if (desc) {
        searchAssignment(id, function(data) {
            data
                .update({
                    name: name,
                    description: desc
                })
                .then(function(data) {
                    done(data);
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        });
    } else {
        searchAssignment(id, function(data) {
            data
                .update({
                    name: name
                })
                .then(function(data) {
                    done(data);
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        });
    }
}

//function to delete an assignment
function remove(assignmentId, done) {
    models.Submissions
        .destroy({
            where: {
                assignmentId: assignmentId
            }
        })
        .then(function() {
            models.BatchAssignments
                .destroy({
                    where: {
                        assignmentId: assignmentId
                    }
                })
                .then(function() {
                    models.Assignments
                        .findOne({
                            where: {
                                id: assignmentId
                            }
                        })
                        .then(function(resData) {
                            models.Assignments
                                .destroy({
                                    where: {
                                        id: assignmentId
                                    }
                                })
                                .then(function() {
                                    done(resData);
                                })
                                .catch(function(err) {
                                    if (err) throw err;
                                });
                        })
                        .catch(function(err) {
                            if (err) throw err;
                        });
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

module.exports = {
    add,
    getAll,
    search,
    edit,
    remove
}