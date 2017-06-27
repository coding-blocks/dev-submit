/**
 * Created by abhishekyadav on 26/06/17.
 */
const route = require('express').Router();
const passport = require('../auth/passport');
const db = require('../utils/db');
const models = require('../utils/models');
const config = require('../Utils/config');

route.get('/', (req, res) => {
    res.render("signup-options", {});
});


route.get('/student', (req, res)=> {
    res.render("signup", {isTeacher: false});
})

route.get('/teacher', (req, res)=> {
    res.render("signup", {isTeacher: true});
})

route.post('/', (req, res) => {
    const User = {};
    User.name = req.body.name;
    User.email = req.body.email;

    User.password = req.body.password;
    User.password2 = req.body.password2;


    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'not a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'passwords do not match').equals(req.body.password);

    if (req.body.secret) {
        User.secret = req.body.secret;
        req.checkBody('secret', 'secret is not correct').equals(config.secretAdmin);
    }

    var errors = req.validationErrors();

    if (errors) {
        res.render('signup', {
            errors: errors
        });
    }
    else {
        if (req.body.secret) {

            models.UserLocal.create({
                password: User.password,

                teacher: {
                    name: User.name,
                    email: User.email

                },

                include: [models.Teachers]
            }).then(function (teacher) {
                if (teacher) {
                    console.log("student is : " + teacher)

                    res.status(200).send({success: 'true'});
                } else {
                    res.status(404).send({success: 'false'})
                }
            }).catch(function (err) {
                console.log(err);
                res.status(500).send({success: 'error'});
            })

        }
        else {
            models.UserLocal.create({
                    password: User.password,

                    student: {
                        name: User.name,
                        email: User.email,
                        roll: req.body.roll
                    }

                },
                {
                    include: [models.Students]

                }).then(function (student) {
                if (student) {
                    console.log("student is : " + student.student)
                    res.status(200).send({success: 'true'});
                } else {
                    res.status(404).send({success: 'false'})
                }
            }).catch(function (err) {
                console.log(err);
                res.status(500).send({success: 'error'});
            })


        }
    }


});

module.exports = route;