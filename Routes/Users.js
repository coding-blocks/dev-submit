
/**
 *
 * Created by tech4GT on 6/25/17.
 */
const express = require('express');
const bp = require('body-parser');
const router = express.Router();
const models = require('../Utils/models')
const db = require('../Utils/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.use(bp.json());
router.use(bp.urlencoded({extended: true}));


router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register',(req,res)=>{
    const User = {};
    User.name = req.body.Name;
    User.username = req.body.Username;
    User.email = req.body.Email;
    User.password = req.body.Password;
    User.password2 = req.body.Password2;

    //Validation
    req.checkBody('Name','name is required').notEmpty();
    req.checkBody('Email','email is required').notEmpty();
    req.checkBody('Email','not a valid email').isEmail();
    req.checkBody('Username','Username is required').notEmpty();
    req.checkBody('Password','Password is required').notEmpty();
    req.checkBody('Password2','passwords do not match').equals(req.body.Password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors: errors
        });
    }
    else{
        db.createUser(User,(data)=>{
            console.log(data.dataValues);
            req.flash("success_msg","You are registered and can now log in");
            res.redirect('/users/login');
        });
    }

});


//login

router.get('/login',function (req, res) {
    res.render('login');
});

passport.use(new LocalStrategy(
    function (username,password,done) {
        models.User.findOne({
            where: {
                username: username
            }
        }).then(function (data) {
            if(!data){
                return done(null,false,{message: "Incorrect Username"});
            }
            else{
                db.validatePassword(data.dataValues,password,done,function (user,isValid,callback) {
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
    done(null,user.id);
});
passport.deserializeUser(function (id, done) {
    db.findUserById(id,done);
});




router.post('/login',passport.authenticate('local',{
    successRedirect : '/',
    failureRedirect: '/users/login',
    failureFlash : true
}),(req,res)=>{
    res.redirect('/');
});

router.get('/logout',function (req, res, next) {
    req.logout();

    req.flash('success_msg','you have successfuly logged out');

    res.redirect('/users/login');
});



module.exports = router;
