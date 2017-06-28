/**
 * Created by apoorvaa_gupta on 28/6/17.
 */
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const models = require('../../utils/models');
const db = require('../../utils/db');
const axios = require('axios')


module.exports = new OAuth2Strategy({
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
);