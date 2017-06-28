/**
 * Created by tech4GT on 6/27/17.
 */
const express = require('express');
const passport = require('../auth/passport');
const db = require('../utils/db');

const router = express.Router();

//signup
router.post('/signup',function (req, res) {
  if(req.body.role == "teacher"){
    db.addTeacher(req.user.name,req.user.email,req.user.user.id,function (data) {
      req.user.val = false;
      req.flash('success_msg', 'you have successfuly completed registration');
      res.redirect('/');
    })
  }
  else{
    //add as a student
  }
})


//register
router.get('/register', function(req, res) {
  res.render('register');
});
router.post('/register', (req, res) => {
  const User = {};
  User.name = req.body.Name;
  User.username = req.body.Username;
  User.email = req.body.Email;
  User.password = req.body.Password;
  User.password2 = req.body.Password2;
  User.roll = req.body.Roll;
  User.role = req.body.Role;

  //Validation
  req.checkBody('Name', 'name is required').notEmpty();
  req.checkBody('Email', 'email is required').notEmpty();
  req.checkBody('Email', 'not a valid email').isEmail();
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Password', 'Password is required').notEmpty();
  req
    .checkBody('Password2', 'passwords do not match')
    .equals(req.body.Password);
  if (User.role == 'Student') {
    req.checkBody('Roll', 'Roll Number is required').notEmpty();
  }

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    if (User.role == 'Student') {
      db.addUser(data => {
        db.addStudent(
          User.name,
          User.roll,
          User.email,
          data.dataValues.id,
          responseData => {
            db.addLocalUser(
              User.username,
              User.password,
              data.dataValues.id,
              () => {
                console.log(responseData.dataValues);
                req.flash(
                  'success_msg',
                  'You are registered as Student and can now log in'
                );
                res.redirect('/users/login');
              }
            );
          }
        );
      });
    } else if (User.role == 'Teacher') {
      db.addUser(data => {
        db.addTeacher(
          User.name,
          User.email,
          data.dataValues.id,
          responseData => {
            db.addLocalUser(
              User.username,
              User.password,
              data.dataValues.id,
              () => {
                console.log(responseData.dataValues);
                req.flash(
                  'success_msg',
                  'You are registered as Teacher and can now log in'
                );
                res.redirect('/users/login');
              }
            );
          }
        );
      });
    } else {
      res.send({ Invalid_Role: true });
    }
  }
});

//login
router.get('/login', function(req, res) {
  res.render('login');
});

//route for redirecting user to Provider's site
router.get('/login/cb',passport.authenticate('oauth-cb'));

//route for callback and retrieving token

router.get('/login/cb/callback',
  passport.authenticate('oauth-cb', {failureRedirect: '/api/v1/batches'}),function (req, res) {
    //success
    res.redirect('/')
  });

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/');
  }
);

//logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'you have successfuly logged out');
  res.redirect('/users/login');
});

module.exports = router;
