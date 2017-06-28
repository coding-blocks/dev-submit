/**
 * Created by apoorvaa_gupta on 28/6/17.
 */
const LocalStrategy = require('passport-local').Strategy;
const models = require('../../utils/models');
const db = require('../../utils/db');



module.exports = new LocalStrategy(
    function (username, password, done) {
        models.UserLocal.findOne({
            where: {
                username: username
            },
            include: [{
                model: models.Users,
                include: [{
                    model: models.Students
                },
                    {
                        model: models.Teachers
                    }]
            }]
        }).then(function (data) {
            if (!data) {
                return done(null, false, {message: "Incorrect Username"});
            }
            else {
                console.log("hi")
                db.validateLocalPassword(data.dataValues, password, done, function (user, isValid, callback) {
                    if (isValid) {
                        callback(null, user);
                    }
                    else {
                        callback(null, false, {message: 'Invalid Password'});
                    }
                });
            }
        }).catch(function (err) {
            if (err) return done(err);
        });
    });