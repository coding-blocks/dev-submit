/**
 * Created by abhishekyadav on 26/06/17.
 */
var passport = require('passport');
var oneauthStrategy = require('passport-oneauth')
const localStrategy = require('./strategies/local/localStrategy');
const models = require('../db/models');
const db = require('../db');
const secrets = require('../../secrets.json')
const randtoken = require('rand-token')


passport.use(localStrategy);

passport.serializeUser(function (user, done) {
    return done(null, {
        id: user[0].dataValues.userId
    })

});

passport.deserializeUser(function (obj, done) {

    models.Users.findOne({
        where: {
            id: obj.id
        }
    }).then((user) => {
        return done(null, user);
    });

});


passport.use('oneauth', new oneauthStrategy({
        authorizationURL: 'https://account.codingblocks.com/oauth/authorize',
        tokenURL: 'https://account.codingblocks.com/oauth/token',
        clientID: secrets.clientID,
        clientSecret: secrets.clientSecret,
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
                    user: {
                        name: profile.name,
                        email: profile.email,
                        profileId: profile.id
                    }
                },
                include: [models.Users]
            }
        ).then(function (data) {
            done(null, data)
        })
    }
))


module.exports = passport