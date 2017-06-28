/**
 * Created by apoorvaa_gupta on 28/6/17.
 */
const models = require('./../models');
const bcrypt = require('bcrypt');
//function to add user
function add(done) {
    models.Users
        .create({})
        .then(function(data) {
            console.log(data);
            done(data);
        })
        .catch(function(err) {
            if (err) throw err;
        });
}

function addLocal(username, password, uid, done) {
    bcrypt.hash(password, 10, function(err, hash) {
        password = hash;
        models.UserLocal
            .create({
                username: username,
                password: password,
                userId: uid
            })
            .then(function(data) {
                done(data);
            })
            .catch(function(err) {
                if (err) throw err;
            });
    });
}

function validateLocal(user, password, PassportDone, done) {
    bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) throw err;
        done(user, isMatch, PassportDone);
    });
}

module.exports = {
    add,
    addLocal,
    validateLocal
}