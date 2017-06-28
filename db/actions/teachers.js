/**
 * Created by abhishekyadav on 28/06/17.
 */

const models = require('../models');
const bcrypt = require('bcrypt');

//function to add a teacher
function addTeacher(name, email, userId, done) {
    models.Teachers
        .create({
            name: name,
            email: email,
            userId: userId
        })
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get teachers list
function getTeachers(done) {
    models.Teachers
        .findAll()
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to get teacher with a particular email
function searchTeacher(id, done) {
    models.Teachers
        .findOne({where: {id: id}})
        .then(function (data) {
            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}


//function to search multiple students for a query
function searchTeachers(searchParameter, searchType, done) {
    if (searchType == 'name') {
        models.Teachers
            .findAll({where: {name: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Teachers
            .findAll({where: {email: searchParameter}})
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
}


//function to edit a Teacher
function editTeacher(id, name, done, emailId, echo) {
    if (emailId) {
        searchTeacher(id, function (data) {
            data
                .update({
                    name: name,
                    email: emailId
                })
                .then(function (data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        });
    } else {
        searchTeacher(id, function (data) {
            data
                .update({
                    name: name
                })
                .then(function (data) {
                    if (echo) {
                        done(data);
                    } else {
                        done('Success');
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                });
        });
    }
}


//TODO add hook to destroy teacher batches if required
//function to delete a teacher
function deleteTeacher(teacherId, echo, done) {
    models.Teachers
        .findOne({
            where: {
                id: teacherId
            }
        })
        .then(function (resData) {
            models.Teachers
                .destroy({
                    where: {
                        id: teacherId
                    }
                })
                .then(function (data) {
                    if (echo) done(resData);
                    else done({success: true});
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
    addTeacher,
    getTeachers,
    searchTeacher,
    searchTeachers,
    editTeacher
}