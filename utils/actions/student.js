/**
 * Created by apoorvaa_gupta on 28/6/17.
 */

const models = require('./../models');

//function to add student
function add(name, roll, email, UserID, done, Batch) {
    models.Students
        .create({
            roll: roll,
            name: name,
            email: email,
            userId: UserID
        })
        .then(function(data) {
            if (Batch) enrollStudentInBatch(roll, Batch, done);
            else done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}


//function to get students list
function getAll(done) {
    models.Students
        .findAll()
        .then(function(data) {
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}


//function to get student with a particular roll
function search(id, done) {
    models.Students
        .findOne({ where: { id: id } })
        .then(function(data) {
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}


//function to search multiple students for a query
function searchAll(searchParameter, searchType, done) {
    if (searchType == 'name') {
        models.Students
            .findAll({ where: { name: searchParameter } })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    } else if (searchType == 'id') {
        models.Students
            .findAll({ where: { id: searchParameter } })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    } else if (searchType == 'roll') {
        models.Students
            .findAll({ where: { roll: searchParameter } })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    } else {
        models.Students
            .findAll({ where: { email: searchParameter } })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    }
}


//function to edit a student
function edit(id, name, done, emailId, echo) {
    if (emailId) {
        searchStudent(id, function(data) {
            data
                .update({
                    name: name,
                    email: emailId
                })
                .then(function(data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        });
    } else {
        searchStudent(id, function(data) {
            data
                .update({
                    name: name
                })
                .then(function(data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        });
    }
}


//function to delete a student
function remove(studentId, echo, done) {
    models.Submissions
        .destroy({
            where: {
                studentId: studentId
            }
        })
        .then(function() {
            models.StudentBatch
                .destroy({
                    where: {
                        studentId: studentId
                    }
                })
                .then(function() {
                    if (echo) {
                        models.Students
                            .findOne({ where: { id: studentId } })
                            .then(function(responseData) {
                                models.Students
                                    .destroy({
                                        where: {
                                            id: studentId
                                        }
                                    })
                                    .then(function() {
                                        done(responseData);
                                    })
                                    .catch(function(err) {
                                        if (err) throw err;
                                    });
                            })
                            .catch(function(err) {
                                if (err) throw err;
                            });
                    } else {
                        models.Students
                            .destroy({
                                where: {
                                    id: studentId
                                }
                            })
                            .then(function() {
                                done('done.!');
                            })
                            .catch(function(err) {
                                if (err) throw err;
                            });
                    }
                })
                .catch(function(err) {
                    if (err) throw err;
                });
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

odule.exports = {
    add,
    getAll,
    search,
    searchAll,
    edit,
    remove
}