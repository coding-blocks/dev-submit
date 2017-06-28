/**
 * Created by abhishekyadav on 28/06/17.
 */
const models = require('../models');
const bcrypt = require('bcrypt');


//function to add user
function addUser(done) {
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

function addLocalUser(username, password, uid, done) {
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

module.exports={addLocalUser,addUser};