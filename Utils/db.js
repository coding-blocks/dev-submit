/**
 * Created by varun on 5/24/17.
 */
const Sequelize = require('sequelize');
const models = require('./models');


//function to add student
function addStudent(name, roll, email, done, Course) {
    models.Students.create({
        roll: roll,
        name: name,
        email: email
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

//function to search multiple students for a query
function searchStudents(searchParameter, searchType, done) {

    if (searchType == "name") {

        models.Students.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else if (searchType == "id") {
        models.Students.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else if (searchType == "roll") {
        models.Students.findAll({where: {roll: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Students.findAll({where: {email: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to edit a student
function editStudent(id, name, done, emailId, echo) {
    if (emailId) {
        searchStudent(id, function (data) {
            data.update({
                name: name,
                email: emailId
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
    else {
        searchStudent(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to delete a student
function deleteStudent(studentId, echo, done) {
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
            if (echo) {
                models.Students.findOne({where: {id: studentId}}).then(function (responseData) {

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
                    if (err) throw  err;
                })

            }
            else {
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
function addAssignment(name, desc, courseId, done) {
    models.Assignments.create({
        name: name,
        description: desc
    }).then(function (data) {
        if (courseId){
            done(data);
            addAssignmentToCourse(data.id, courseId, ()=>{
            });
        }
        else done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get all assignments
function getAssignments(done) {

    models.Assignments.findAll().then(function (data) {
        done(data);
    }).then(function (err) {
        if (err) throw err;
    });

}

//function to get particular assignment
function searchAssignments(searchType,searchParameter, done) {
    if (searchType == "name") {
        models.Assignments.findAll({
            where: {
                name: searchParameter
            }
        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        //Add any other search type here if required
    }

}

//function to search assignments based on a parameter
function searchAssignment(id,done){

    models.Assignments.findOne({
        where : {
            id : id
        }
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if(err) throw err;
    });

}

//function to get all assignments in a course
function findAssignmentsInCourse(courseId, done) {
    models.CourseAssignments.findAll({
        where: {
            courseId: courseId
        }
    }).then(function (data) {
        let arr = [];
        if(data.length == 0) return done(arr);
        for(let i=0;i<data.length;i++){
            models.Assignments.findOne({
                where : {
                    id : data[i].dataValues.assignmentId
                }
            }).then(function (assnData) {
               arr.push(assnData);
               if(arr.length == data.length) done(arr);
            }).catch(function (err) {
                if(err) throw err;
            });
        }
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to edit an assignment
function editAssignment(id, name, desc, done) {
    if (desc) {
        searchAssignment(id, function (data) {
            data.update({
                name: name,
                description: desc
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    } else {
        searchAssignment(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to delete an assignment
function deleteAssignment(assignmentId, done) {
    models.Submissions.destroy({
        where: {
            assignmentId: assignmentId
        }
    }).then(function () {
        models.CourseAssignments.destroy({
            where: {
                assignmentId: assignmentId
            }
        }).then(function () {
            models.Assignments.findOne({
                where : {
                 id : assignmentId
                }
            }).then(function (resData) {
                models.Assignments.destroy({
                    where: {
                        id: assignmentId
                    }
                }).then(function () {
                    done(resData);
                }).catch(function (err) {
                    if (err) throw err;
                });

            }).catch(function (err) {
                if(err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    });

}

//function to add course
function addCourse(name, teacher, startDate, endDate, done) {

    if (!endDate) {
        models.Courses.create({
            name: name,
            teacher: teacher,
            startDate: new Date(),
            endDate: new Date().setMonth(new Date().getMonth() + 3),
            isActive: true
        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Courses.create({
            name: name,
            teacher: teacher,
            startDate: startDate,
            endDate: endDate,
            isActive: true
        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }

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
function searchCourse(id, done) {

    models.Courses.findOne({
        where: {
            id: id
        }
    }).then(function (data) {
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    })

}

//function to get courses
function searchCourses(searchParameter, searchType, onlyActive, done) {
    if (onlyActive) {
        if (searchType == "name") {

            models.Courses.findAll({where: {name: searchParameter, isActive: true}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });

        }
        else {
            models.Courses.findAll({where: {teacher: searchParameter, isActive: true}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }
    else {
        if (searchType == "name") {

            models.Courses.findAll({where: {name: searchParameter}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });

        }
        else {
            models.Courses.findAll({where: {teacher: searchParameter}}).then(function (data) {
                done(data);

            }).catch(function (err) {
                if (err) throw err;
            });
        }
    }
}

//function to end an active course
function endCourse(courseID, done) {
    models.Courses.findOne({
        where: {
            id: courseID
        }
    }).then(function (row) {
        row.update({
            isActive: false
        }).then(function (data) {
            if(done) done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }).catch(function (err) {
        if (err) throw err;
    })
}

//function to get all students of course
function getAllStudentsInCourse(courseId, done) {
    models.StudentCourse.findAll({
        where : {
            courseId : courseId
        }
    }).then(function (data) {
        var arr = [];
        if(data.length == 0){
            return done(arr);
        }

        for(let i =0;i<data.length;i++){
            searchStudent(data[i].dataValues.studentId , (studentData) =>{
                arr.push(studentData);
                if(arr.length == data.length) done(arr);
            });
        }

    }).catch(function (err) {
        if(err) throw err;
    });
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
                }).then(function (data) {
                    done(data);
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

//function to accept a submission with submission id
function acceptSubmissionbyId(id, echo, done) {
    if (echo) {
        models.Submissions.findOne({where: {id: id}}).then(function (row) {
            row.update({
                status: true
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Submissions.findOne({where: {id: id}}).then(function (row) {
            row.update({
                status: true
            }).then(function () {
                done("Success");
            }).catch(function (err) {
                if (err) throw err;
            });
        }).catch(function (err) {
            if (err) throw err;
        });
    }


}

//function to accept a submission without submission id
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

//function to get all submissions
function getSubmissions(onlyAccepted, done) {
    if (onlyAccepted) {
        models.Submissions.findAll({where: {status: true}}).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
    else {
        models.Submissions.findAll().then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to search submissions
function searchSubmissions(searchParamter, searchType, done, onlyAccepted, helperParameter) {
    if (onlyAccepted) {
        if (searchType == "id") {
            models.Submissions.findAll({where: {id: searchParamter, status: true}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else if (searchType == "studentAssignment") {
            models.Submissions.findAll({
                where: {
                    studentId: searchParamter,
                    assignmentId: helperParameter,
                    status: true
                }
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else if (searchType == "student") {
            models.Submissions.findAll({where: {studentId: searchParamter, status: true}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else {
            models.Submissions.findAll({where: {assignmentId: searchParamter, status: true}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }

    }
    else {
        if (searchType == "id") {
            models.Submissions.findAll({where: {id: searchParamter}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else if (searchType == "studentAssignment") {
            models.Submissions.findAll({
                where: {
                    studentId: searchParamter,
                    assignmentId: helperParameter
                }
            }).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else if (searchType == "student") {
            models.Submissions.findAll({where: {studentId: searchParamter}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }
        else {
            models.Submissions.findAll({where: {assignmentId: searchParamter}}).then(function (data) {
                done(data);
            }).catch(function (err) {
                if (err) throw err;
            });
        }

    }
}

//function to search submissions by course
function searchByCourse(courseId, onlyAccepted, done) {
    models.CourseAssignments.findAll({where: {courseId: courseId}}).then(function (data) {
        let arr = [];
        let i = 0;
        for (i = 0; i < data.length; i++) {
            searchSubmissions(data[i].dataValues.assignmentId, "assignment", (rows) => {
                for (let j = 0; j < rows.length; j++) {
                    arr.push(rows[j].dataValues);
                }
                console.log(arr);
                if (i >= data.length - 1) done(arr);
            }, onlyAccepted);
        }
        if (data.length == 0) {
            done(arr);
        }
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to edit the details of a student
function editStudent(id, name, done, emailId, echo) {
    if (emailId) {
        searchStudent(id, function (data) {
            data.update({
                name: name,
                email: emailId
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
    else {
        searchStudent(id, function (data) {
            data.update({
                name: name
            }).then(function (data) {
                if (echo) {
                    done(data);
                }
                else {
                    done("Success");
                }
            }).catch(function (err) {
                if (err) throw err;
            });
        });
    }
}

//function to edit a course
function editCourse(id, name, teacher, endDate, done) {

    if (name) {
        if (teacher) {
            if (endDate) {
                searchCourse(id, function (data) {
                    data.update({
                        name: name,
                        teacher: teacher,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchCourse(id, function (data) {
                    data.update({
                        name: name,
                        teacher: teacher
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }
        }
        else {
            if (endDate) {
                searchCourse(id, function (data) {
                    data.update({
                        name: name,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchCourse(id, function (data) {
                    console.log(data);
                    data.update({
                        name: name
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }

        }
    }
    else {
        if (teacher) {
            if (endDate) {
                searchCourse(id, function (data) {
                    data.update({
                        teacher: teacher,
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                searchCourse(id, function (data) {
                    data.update({
                        teacher: teacher
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });

            }
        }
        else {
            if (endDate) {
                searchCourse(id, function (data) {
                    data.update({
                        endDate: endDate
                    }).then(function (data) {
                        done(data);
                    }).catch(function (err) {
                        if (err) throw err;
                    });
                });
            }
            else {
                res.send("bhai chahta kya hai?");
            }
        }
    }
}

//function to delete course
//TODO cascade delete not working
function deleteCourse(id, done) {
    models.Courses.destroy({
        where : {
            id : id
        }
    }).then((data) => {
        done(data);
    }).catch(() => {
        if(err) throw err;
    });
}

//function to handle a new enrollment
function enrollStudentInCourse(studentParamType, studentParam, CourseId, done) {

    searchStudents(studentParam, studentParamType, (data) => {
        models.StudentCourse.create({
            studentId: data[0].dataValues.id,
            courseId: CourseId

        }).then(function (data) {
            done(data);
        }).catch(function (err) {
            if (err) throw err;
        });
    })

}

//function to add an assignment to a course
function addAssignmentToCourse(assnID, courseID, done) {
    models.CourseAssignments.create({
        courseId: courseID,
        assignmentId: assnID,
    }).then(function (data) {
        done(data);
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
    editCourse,
    deleteStudent,
    addAssignment,
    getAssignments,
    searchAssignment,
    searchAssignments,
    findAssignmentsInCourse,
    editAssignment,
    deleteAssignment,
    addCourse,
    getCourses,
    searchCourse,
    searchCourses,
    deleteCourse,
    addSubmission,
    searchSubmissions,
    searchByCourse,
    enrollStudentInCourse,
    addAssignmentToCourse,
    endCourse,
    getSubmissions,
    acceptSubmissionbyId,
    acceptSubmissionWithoutId,
    getAllStudentsInCourse
}

