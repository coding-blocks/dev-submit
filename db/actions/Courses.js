/**
 * Created by tech4GT on 6/30/17.
 */

const models = require('../models')
module.exports = {

    addCourse: function (name, assignments, done) {
        models.Courses
            .create({
                name: name
            })
            .then(function (resData) {
                if (assignments.length == 0) return done(resData);
                assignments.forEach(function (assnId) {
                    addAssignmenttoCourse(resData.id, assnId, () => {
                        if (assnId == assignments[assignments.length - 1]) done(resData);
                    });
                });
            })
            .catch(function (err) {
                if (err) throw err;
            });
    },
    addAssignmenttoCourse: function addAssignmenttoCourse(courseId, assnId, done) {
        models.CourseAssignments
            .create({
                courseId: courseId,
                assignmentId: assnId
            })
            .then(function (data) {
                done(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    },
    getCourses: function (name, done) {
        if (name) models.Courses.findOne({
            where: {
                name: name
            }
        }).then(data => done(data));

        else models.Courses.findAll().then(data => done(data));
    },
    getCourse: function (id, done) {
        models.Courses.findOne({
            where: {
                id: id
            }
        }).then(data => done(data)).catch(err => {
            if (err) throw err;
        })
    },
    editCourse: function editCourse(id, name, done) {
        models.Courses.upsert({
            id: id,
            name: name
        }).then(data => {
            models.Courses.findOne({
                where: {
                    id: id
                }
            }).then(resData => done(resData));
        })
            .catch(err => {
                if (err) throw err
            });
    },

    getCourseAssignments: function (id, done) {
        models.Courses.find({
            where: {
                id: id
            },
            include: [{
                model: models.Assignments
            }]
        }).then(data => done(data))
            .catch(err => {
                if (err) throw err;
            });
    }
}



