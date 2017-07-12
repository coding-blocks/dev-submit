/**
 * Created by abhishekyadav on 09/07/17.
 */

const LocalStrategy = require('passport-local').Strategy;
const db=require('../../../db');
const models=require('../../../db').models;

module.exports=new LocalStrategy(
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
                db.actions.validatePassword.validateLocalPassword(data.dataValues, password, done, function (user, isValid, callback) {
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
    })