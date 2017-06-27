/**
 * Created by abhishekyadav on 26/06/17.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../utils/models');
const db = require('../utils/db');

passport.use(new LocalStrategy(
    function (username,password,done) {
        models.UserLocal.findOne({
            where: {
                username: username
            },
            include : [{
                model: models.Users,
                include : [{
                    model: models.Students
                },
                    {
                      model: models.Teachers
                    }]
            }]
        }).then(function (data) {
            if(!data){
                return done(null,false,{message: "Incorrect Username"});
            }
            else{
                console.log("hi")
                db.validateLocalPassword(data.dataValues,password,done,function (user,isValid,callback) {
                    if(isValid){
                        callback(null,user);
                    }
                    else{
                        callback(null,false,{message: 'Invalid Password'});
                    }
                });
            }
        }).catch(function (err) {
            if(err) return done(err);
        });
    }));

passport.serializeUser(function (user, done) {
    let isStudent = !!user.user.dataValues.student;
    done(null, {
        id: user.userId,
        isStudent: isStudent
    });
});

passport.deserializeUser(function (obj, done) {
    let table = obj.isStudent?models.Students:models.Teachers;
    table.findOne({
        where: {
            userId: obj.id
        }
    }).then((user) => {
        done(null, user);
    });
});


module.exports = passport;
