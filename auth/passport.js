/**
 * Created by abhishekyadav on 26/06/17.
 */
var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const models = require('../utils/models');
const db = require('../utils/db');
var http = require('http');
var randtoken = require('rand-token');


var options = {
    uri:'https://account.codingblocks.com/api/users/me',
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
    }));


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
                defaults:{
                    accesstoken:accessToken,
                    clientoken: randtoken.generate(16),
                    user:{}
                },
                include:[models.Users]
            }
        ).then(function (user) {
            done(null,user);
        }).catch(function (err) {
            done(null,false);
        })

    }
));

passport.serializeUser(function (user, done) {
    let isStudent = !!user.user.dataValues.student;
    done(null, {
        id: user.userId,
        isStudent: isStudent
    });
});

passport.deserializeUser(function (obj, done) {
    let table = obj.isStudent ? models.Students : models.Teachers;
    table.findOne({
        where: {
            userId: obj.id
        }
    }).then((user) => {
        done(null, user);
    });
});


module.exports = passport;
