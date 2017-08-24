/**
 * Created by abhishekyadav on 28/06/17.
 */
const models = require('../models');
const bcrypt = require('bcrypt');


//function to add user
function addUser(name, email, done) {
    models.Users
        .create({
            name: name,
            email: email
        })
        .then(function (data) {

            (function () {
                console.log(data.dataValues.id)
                if (data.dataValues.id == 1) {
                    models.Admins.create({
                        grant: true,
                        userId: data.dataValues.id
                    })
                }
            })();

            done(data);
        })
        .catch(function (err) {
            if (err) throw err;
        });
}

function addLocalUser(username, password, uid, done) {
    bcrypt.hash(password, 10, function (err, hash) {
        password = hash;
        models.UserLocal
            .create({
                username: username,
                password: password,
                userId: uid
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    });
}

function getUsers(done) {
    models.Users.findAll().then((data) => done(data))
}


function getUser(userId, done) {
    models.Users.findOne({
        where: {
            id: userId
        }
    }).then(function (data) {
        done(data)
    }).catch(function (err) {
        if (err) throw err
    })
}

function editUser(id, name, done, emailId, echo) {
    console.log(echo)
    if (emailId) {
        searchUser(id, function (data) {
            data.update({
                name: name,
                email: emailId
            })
                .then(function (data) {
                    if (echo) {
                        done(data);
                    } else {
                        done({"Success": true});
                    }
                })
                .catch(function (err) {
                    if (err) throw err;
                })
        })
    } else {
        searchUser(id, function (data) {
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


function searchUser(id, done) {
    models.Users.findOne({
        where: {
            id: id
        }
    }).then((data) => {
        done(data)
    }).catch((err) => {
        if (err) throw err;
    })
}

function searchUsers(searchParameter, searchType, done) {
    if (searchType == "name") {
        models.Users
            .findAll(
                {
                    where: {
                        name: searchParameter
                    }
                })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }
    else {
        models.Users
            .findAll(
                {
                    where: {
                        email: searchParameter
                    }
                })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    }


}

function deleteUser(id, done) {
    console.log("Now deleting User")
    models.Students.destroy({
        where: {
            userId: id
        }
    }).then(function () {
        models.Teachers.destroy({
            where: {
                userId: id
            }
        }).then(function () {
            models.Users.destroy({
                where: {
                    id: id
                }
            }).then(function (data) {
                done(data)
            }).catch(function (err) {
                if (err) throw err;
            })
        }).catch(function (err) {
            if (err) throw err
        }).catch(function (err) {
            if (err) throw err
        })
    })
}

module.exports = {getUsers, addLocalUser, addUser, getUser, searchUser, editUser, searchUsers, deleteUser};