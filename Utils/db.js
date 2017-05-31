/**
 * Created by varun on 5/24/17.
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres", "postgres", "pass", {
    host: "localhost",
    dialect: 'postgres',

    pool: {
        min: 0,
        max: 5,
        idle: 1000
    },
});

//Table to store students
const Students = sequelize.define('student', {
    name: Sequelize.STRING,
    roll: {type: Sequelize.BIGINT, unique: true, primaryKey: true},
});

//table to store assignments
const Assignments = sequelize.define('assignment', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, unique: true},
    description: Sequelize.STRING
});

//table to store courses
const Courses = sequelize.define('course', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, unique: true},
    teacher: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    isActive: Sequelize.BOOLEAN
});


//many to many for student to assignment
const Submissions = sequelize.define('submission', {
    status: Sequelize.BOOLEAN,
    URL: Sequelize.STRING
});
Submissions.belongsTo(Students);
Students.hasMany(Submissions);
Submissions.belongsTo(Assignments);
Assignments.hasMany(Submissions);

//many to many for course to assignments
const CourseAssignments = sequelize.define('course_assignment', {});
CourseAssignments.belongsTo(Courses);
Courses.hasMany(CourseAssignments);
CourseAssignments.belongsTo(Assignments);
Assignments.hasMany(CourseAssignments);


//many to many for Students to courses
const StudentCourse = sequelize.define('student_course', {});
StudentCourse.belongsTo(Courses);
Courses.hasMany(StudentCourse);
StudentCourse.belongsTo(Students);
Students.hasMany(StudentCourse);

sequelize.sync();


//function to add student
function addStudent(name, roll, done, Course) {
    Students.create({
        roll: roll,
        name: name
    }).then(function () {
        if (Course) enrollStudentInCourse(roll, Course, done);
        else done();
    }).catch(function (err) {
        if (err) throw err;
    })
}

//function to get students list
function getStudents(done) {
    Students.findAll().then(function (data) {
        console.log(data[0].dataValues);
        done(data);
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to get get students with a particular parameter
function searchStudents(searchParameter, done) {
    if (searchParameter.charAt(0) < '0' || searchParameter.charAt(0) > '9') {

        Students.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        Students.findAll({where: {roll: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }
}

//function to add a new assignment
function addAssignment(name, desc, done) {
    Assignments.create({
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

    Assignments.findAll().then(function (data) {
        done(data);
    }).then(function (err) {
        if (err) throw err;
    });

}

//function to get particular assignment
function searchAssignment(searchParameter, done) {
    if (searchParameter.charAt(0) < '0' || searchParameter.charAt(0) > '9') {

        Assignments.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        Assignments.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }

}

//function to add course
function addCourse(name, teacher, startDate, endDate, done) {
    Courses.create({
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

        Courses.findAll({where: {isActive: true}}).then(function (data) {
            done(data);
        }).then(function (err) {
            if (err) throw err;
        });
    }
    else {

        Courses.findAll().then(function (data) {
            done(data);
        }).then(function (err) {
            if (err) throw err;
        });
    }

}

//function to get a particular course
function searchCourse(searchParameter, done) {

    if (searchParameter.charAt(0) < '0' || searchParameter.charAt(0) > '9') {

        Courses.findAll({where: {name: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });

    }
    else {
        Courses.findAll({where: {id: searchParameter}}).then(function (data) {
            done(data);

        }).catch(function (err) {
            if (err) throw err;
        });
    }

}
function endCourse(courseID, done) {
    Courses.findOne({
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
function addSubmission(roll, id, URL, done) {
    Submissions.create({
        studentRoll: roll,
        assignmentId: id,
        status: false,
        URL: URL
    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });
}

//function to accept a submission overloaded for submission id and without it
function acceptSubmission(id, done, roll, URL) {
    if (!roll) {
        Submissions.findOne({where : {id : id}}).then(function (row) {
            row.update({
                status : true
            }).then(function () {
                done();
            }).catch(function (err) {
                if(err) throw err;
            });
        }).catch(function (err) {
            if(err) throw err;
        })

    }
    else {
        Submissions.findOne(
            {
                where: {
                    studentRoll: roll,
                    assignmentId: id,
                    URL : URL
                }
            }).then(function (row) {
            row.update({
                status: true
            }).then(function () {
                done();
            }).catch(function (err) {
                if(err) throw err;
            });
        }).catch(function (err) {
            if(err) throw err;
        });
    }


}

//function to handle a new enrollment
function enrollStudentInCourse(roll, Course, done) {

    StudentCourse.create({
        studentRoll: roll,
        courseId: Course

    }).then(function () {
        done();
    }).catch(function (err) {
        if (err) throw err;
    });


}

//function to add an assignment to a course
function addAssignmentToCourse(assnID , courseID , done) {

    CourseAssignments.create({
        courseId : courseID,
        assignmentId : assnID,
    }).then(function () {
        done();
    }).catch(function (err) {
        if(err) throw err;
    });

}


module.exports = {
    addStudent,
    getStudents,
    searchStudents,
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
    acceptSubmission
}

