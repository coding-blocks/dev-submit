/**
 * Created by varun on 5/24/17.
 */
const Sequelize = require('sequelize');
const models = require('./models');


//function to add student
function addStudent(name, roll , email , done, Course) {
    models.Students.create({
        roll: roll,
        name: name,
        email : email
    }).then(function (data) {
        if (Course) enrollStudentInCourse(roll, Course, done);
        else done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get students list
function getStudents(done) {
    models.Students.findAll().then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get get student with a particular roll
function searchStudent(id, done) {

    models.Students.findOne({where: {id: id}}).then(function (data) {
        done(data);

    }).catch(function (err) {
        if (err) throw err;
    });
}

function searchStudents(searchParameter , searchType ,  done) {

    if (searchType == "name") {

        models.Students.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        models.Students.findAll({where: {roll: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to edit a student
function editStudent(id, name, done ,emailId , echo) {
if(emailId){
    searchStudent(id, function (data) {
        data.update({
            name: name,
            email : emailId
        }).then(function (data) {
            if(echo){
                done(data);
            }
            else{
                done("Success");
            }
        }).catch(function (err) {
            if (err) throw err;
        });
    });
}
else{
    searchStudent(id, function (data) {
        data.update({
            name: name
        }).then(function (data) {
            if(echo){
                done(data);
            }
            else{
                done("Success");
            }
        }).catch(function (err) {
            if (err) throw err;
        });
    });
}
}

//function to delete a student
function deleteStudent(studentId, echo ,  done) {
        models.Submissions.destroy({
            where: {
                studentId: studentId
            }
        }).then(function () {

            models.StudentCourse.destroy({
                where: {
                    studentId: studentId
                }
            }).then(function () {
                if(echo){
                    models.Students.findOne({where : {id : studentId}}).then(function (responseData) {

                        models.Students.destroy({
                            where: {
                                id: studentId
                            }
                        }).then(function () {
                            done(responseData);
                        }).catch(function (err) {
                            if (err) throw err;
                        });
                    }).catch(function (err) {
                        if(err) throw  err;
                    })

                }
                else{
                    models.Students.destroy({
                        where: {
                            id: studentId
                        }
                    }).then(function () {
                        done("done.!");
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });

}


//function to add a new assignment
function addAssignment(name, desc, done) {
    models.Assignments.create({
        name: name,
        desc: desc
    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get all assignments
function getAssignments() {

    models.Assignments.findAll().then(function (data) {
        done(data);
    }).then(function (err) {
        if (err) throw err;
    });

}

//function to get particular assignment
function searchAssignment(searchParameter, done) {
    if (searchParameter.charAt(0) < '0' || searchParameter.charAt(0) > '9') {

        models.Assignments.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        models.Assignments.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }

}

//function to add course
function addCourse(name, teacher, startDate, endDate, done) {
    models.Courses.create({
        name: name,
        teacher: teacher,
        startDate: startDate,
        endDate: endDate,
        isActive: true
    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to get all courses (overloaded for both active and passive)
function getCourses(onlyActive, done) {
    if (onlyActive) {

        models.Courses.findAll({where: {isActive: true}}).then(function (data) {
            done(data);
        }).then(function (err) {
            if (err) throw err;
        });
    }
    else {

        models.Courses.findAll().then(function (data) {
            done(data);
        }).then(function (err) {
            if (err) throw err;
        });
    }

}

//function to get a particular course
function searchCourse(searchParameter, searchType , onlyActive , done) {
if(onlyActive){
    if (searchType == "name") {

        models.Courses.findAll({where: {name: searchParameter,isActive : true}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        models.Courses.findAll({where: {id: searchParameter , isActive : true}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
}
else{
    if (searchType == "name") {

        models.Courses.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        models.Courses.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
    }
}
function endCourse(courseID, done) {
    models.Courses.findOne({
        where: {
            id: courseID
        }
    }).then(function (row) {
        row.update({
            isActive: false
        }).then(function () {
            if (done) done();
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    })
}

//add a submission
function addSubmission(studentId, assnId, URL, done) {
    models.StudentCourse.findAll({
        where: {
            studentId: studentId
        }
    }).then(function (data) {
        if (data.length == 0) {
            done("not a valid submission");
            return;
        }

        for (let i = 0; i < data.length; i++) {
            models.CourseAssignments.findOne({
                where: {
                    courseId: data[i].dataValues.courseId,
                    assignmentId: assnId
                }
            }).then(function (row) {
                if (!row) {
                    done("Not a valid submission")
                    return;
                }
                models.Submissions.create({
                    studentId: studentId,
                    assignmentId: assnId,
                    status: false,
                    URL: URL
                }).then(function () {
                    done("succesfully submitted");
                    return;
                }).catch(function (err) {
                    if (err) throw err;
                });
            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to accept a submission overloaded for submission id and without it
function acceptSubmissionbyId(id, done) {
    models.Submissions.findOne({where: {id: id}}).then(function (row) {
        row.update({
            status: true
        }).then(function () {
            done();
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });
}
function acceptSubmissionWithoutId(studentId, assnId, URL, done) {

    models.Submissions.findOne(
        {
            where: {
                studentId: studentId,
                assignmentId: assnId,
                URL: URL
            }
        }).then(function (row) {
        row.update({
            status: true
        }).then(function () {
            done();
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to handle a new enrollment
function enrollStudentInCourse(id, Course, done) {

    models.StudentCourse.create({
        studentId: id,
        courseId: Course

    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });


}

//function to add an assignment to a course
function addAssignmentToCourse(assnID, courseID, done) {

    models.CourseAssignments.create({
        courseId: courseID,
        assignmentId: assnID,
    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });

}


module.exports = {
    addStudent,
    getStudents,
    searchStudent,
    searchStudents,
    editStudent,
    deleteStudent,
    addAssignment,
    getAssignments,
    searchAssignment,
    addCourse,
    getCourses,
    searchCourse,
    addSubmission,
    enrollStudentInCourse,
    addAssignmentToCourse,
    endCourse,
    acceptSubmissionbyId,
    acceptSubmissionWithoutId
}

