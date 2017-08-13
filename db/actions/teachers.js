/**
 * Created by abhishekyadav on 28/06/17.
 */

const models = require('../models');
const bcrypt = require('bcrypt');


//function to add a teacher
function addTeacher(userId, done) {
    models.Teachers
        .create({
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
        .findAll({include: [models.Users]})
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
        .findOne({
            where: {id: id},
            include: [{
                model: models.Users,
            }]
        })
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
            .findAll({
                include: [{
                    model: models.Users,
                    where: {
                        name: searchParameter
                    }
                }]
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    } else {
        models.Teachers
            .findAll({
                include: [{
                    model: models.Users,
                    where: {
                        email: searchParameter
                    }
                }]
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
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
    deleteTeacher
}