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
                if (assignments.length == 0) return done(null, resData);
                assignments.forEach(function (assnId) {
                    addAssignmenttoCourse(resData.id, assnId, () => {
                        if (assnId == assignments[assignments.length - 1]) done(null, resData);
                    });
                });
            })
            .catch(function (err) {
                done(err);
            });
    },
    addAssignmenttoCourse: function addAssignmenttoCourse(courseId, assnId, done) {
        models.CourseAssignments
            .create({
                courseId: courseId,
                assignmentId: assnId
            })
            .then(function (data) {
                done(null, data);
            })
            .catch(function (err) {
                done(err);
            });
    },
    getCourses: function (name, done) {
        if (name) models.Courses.findOne({
            where: {
                name: name
            }
        }).then(data => {
            done(null, data)
        }).catch(err=> {
            done(err);
        });


        else models.Courses.findAll().then(data => {
            done(null, data)
        }).catch(err=> {
            done(err);

        });
    },
    getCourse: function (id, done) {
        models.Courses.findOne({
            where: {
                id: id
            }
        }).then(data => {
            done(null, data)
        }).catch(err => {
            done(err);
        })
    },
    editCourse: function editCourse(id, name, done) {
        models.Courses.update({
            name: name
        }, {
            where: {
                id: id
            }
        }).then(data => {
            if (data[0] == 0) {
                done(null, null)
            }
            else {
                models.Courses.findOne({
                    where: {
                        id: id
                    }
                }).then(resData => {
                    done(null, resData)
                }).catch((err)=> {
                    done(err)
                });
            }
        })
            .catch(err => {
                done(err);
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
        }).then(data => done(null, data))
            .catch(err => {
                done(err);
            });
    }
}



