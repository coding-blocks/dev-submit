/**
 * Created by abhishekyadav on 26/06/17.
 */
var passport = require('passport');
var oAuthStrategy = require('./strategies/oAuth/oAuthStrategy');
const localStrategy = require('./strategies/local/localStrategy');
const models = require('../db/models');
const db = require('../db');


passport.use(localStrategy);

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


passport.use('oauth-cb',oAuthStrategy );



module.exports = passport;
