/**
 * Created by abhishekyadav on 26/06/17.
 */
var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const models = require('../db/models');
const db = require('../db');
var http = require('http');
var randtoken = require('rand-token');
const axios = require('axios')


var options = {
    uri: 'https://account.codingblocks.com/api/users/me',
    method: 'GET'
};


passport.use(new LocalStrategy(
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
    }));

passport.serializeUser(function (user, done) {
    if (!user.val) {
        let isStudent = !!user.user.dataValues.student;
        return done(null, {
            id: user.userId,
            isStudent: isStudent
        });
    }
    else {
        return done(null, user)
    }

});

passport.deserializeUser(function (obj, done) {
    if (obj.val) {
        return done(null, obj)
    }
    else {
        let table = obj.isStudent ? models.Students : models.Teachers;
        table.findOne({
            where: {
                userId: obj.id
            }
        }).then((user) => {
            return done(null, user);
        });
    }

});


passport.use('oauth-cb', new OAuth2Strategy({
        authorizationURL: 'https://account.codingblocks.com/oauth/authorize',
        tokenURL: 'https://account.codingblocks.com/oauth/token',
        clientID: '4096593676',
        clientSecret: '1WHWF8RW1DCk7aF1kAAVPAF1LKdDsGrTl9SyKOt4S8bfBpK9XnBttA0SegE8ptfY',
        callbackURL: 'http://localhost:4000/users/login/cb/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        models.AuthToken.findOrCreate(
            {
                where: {
                    accesstoken: accessToken
                },
                defaults: {
                    accesstoken: accessToken,
                    clientoken: randtoken.generate(16),
                    user: {}
                },
                include: [models.Users]
            }
        ).then(function (user) {
            axios.get('https://account.codingblocks.com/api/users/me', {
                headers: {
                    'Authorization': 'Bearer ' + user[0].dataValues.accesstoken
                }
            }).then(function (response) {
                user[0].dataValues.name = response.data.firstname + ' ' + response.data.lastname
                user[0].dataValues.email = response.data.email
                models.Students.findOne({
                    where : {
                        userId : user[0].dataValues.user.id
                    }
                }).then(function (data) {
                    if(!data){
                        models.Teachers.findOne({
                            where : {
                                userId : user[0].dataValues.user.id
                            }
                        }).then(function (data) {
                            if(!data){
                                console.log('jcscljshcihaslca')
                                user[0].dataValues.val = true;
                            }
                            else{
                                user[0].dataValues.val = false;
                                user[0].dataValues.user.dataValues.student = false;
                            }
                            done(null, user[0].dataValues);
                        })
                    }
                    else{
                        user[0].dataValues.val = false;
                        user[0].dataValues.user.dataValues.student=true
                        done(null, user[0].dataValues);
                    }

                });
            }).catch(function (err) {
                if (err) throw err
            })
        }).catch(function (err) {
            done(null, false);
        })
    }
));



module.exports = passport;
