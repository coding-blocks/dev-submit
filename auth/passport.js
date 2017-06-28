/**
 * Created by abhishekyadav on 26/06/17.
 */
var passport = require('passport');
const models = require('../utils/models');
const db = require('../utils/actions');
const randtoken = require('rand-token');


const localStrategy = require('./Strategies/localStrategy');
const oauthStrategy = require('./Strategies/oAuthStrategy');

var options = {
    uri: 'https://account.codingblocks.com/api/users/me',
    method: 'GET'
};

passport.use(localStrategy);

passport.use('oauth-cb',oauthStrategy);

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

module.exports = passport;
