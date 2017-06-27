/**
 * Created by varun on 6/3/17.
 */

const express = require('express');
const db = require('../Utils/db');
const config = require('../config')
const bb = require('bitballoon')
const randomstring = require('randomstring')

const router = express.Router();
const client = bb.createClient({
    client_id: config.client_id,
    client_secret: config.client_secret,
    access_token: config.bbtoken
});

client.authorizeFromCredentials(function (err, access_token) {
    if (err) return console.log(err);
});

router.post('/new', function (req, res) {

    if(req.body.URL){
        db.addSubmission(req.body.studentId, req.body.assignmentId, req.body.URL, (data) => {
            res.send(data);
        });
    }
    else {
        client.createSite({}, function (err, site) {
            let id = site.id;
            let randString = randomstring.generate();
            req.files.zip.mv('files/' + randString + '.zip', function (err) {
                if (err) return res.status(500).send(err);
                client.site(id, function (err, site) {
                    if (err) return console.log("Error finding site %o", err);
                    site.createDeploy({zip: 'files/' + randString + '.zip'}, function (err, deploy) {
                        if (err) return console.log("Error updating site %o", err);
                        deploy.waitForReady(function (err, deploy) {
                            if (err) return console.log("Error updating site %o", err);
                            console.log("Site deployed");
                            db.addSubmission(req.body.studentId, req.body.assignmentId, site.url, (data) => {
                                res.send(data);
                            });
                        });
                    });
                });
            });
        });
    }
});

router.get('/', function (req, res) {

    var options = {};
    if (req.query.course) {
        db.searchByCourse(req.query.course, req.query.onlyAccepted, (data) => {
            res.send(data);
        });
    }
    else {
        let accepted = req.query.onlyAccepted;

        if (accepted) options.status = JSON.parse(accepted);

        if (req.query.student && req.query.assignment) {
            options.studentId = req.query.student;
            options.assignmentId = req.query.assignment;
        }
        else if (req.query.student) {

            options.studentId = req.query.student;
        }
        else if (req.query.assignment) {
            options.assignmentId = req.query.assignment;
        }

        db.searchSubmissions(options, (data) => {
            res.send(data);
        })
    }


});

//tested
router.get('/:param', function (req, res) {
    var options = {};
    options.id = req.params.param;
    db.searchSubmissions(options, (data) => {
        res.send(data);
    });
});

router.put('/:param', function (req, res) {
    db.acceptSubmissionbyId(req.params.param, req.query.echo, (data) => {
        res.send(data);
    });
});


module.exports = router;
