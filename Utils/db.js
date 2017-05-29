/**
 * Created by varun on 5/24/17.
 */
const Sequelize = require('sequelize');

const sequelize = new Sequelize("blocks","blocks","blocks", {
    host : "localhost",
    dialect : 'postgres',

    pool : {
        min : 0,
        max : 5,
        idle : 1000
    },
});

//Table to store students
const Students = sequelize.define('student',{
    name : Seqelize.STRING,
    roll : {type : Sequelize.BIGINT,unique : true,primaryKey : true},
});

//table to store assignments
const Assignments = sequelize.define('assignment',{
    id : {type : Sequelize.INTEGER , primaryKey:true , autoIncrement : true},
    name :{type: Sequelize.STRING,unique:true},
    description : Sequelize.STRING
});

//table to store courses
const Courses = sequelize.define('course',{
    id : {type : Sequelize.INTEGER , primaryKey : true , autoIncrement:true},
    name : {type : Sequelize.STRING , unique : true},
    teacher : Sequelize.STRING,
    startDate : Sequelize.DATE,
    endDate : Sequelize.DATE,
    isActive : Sequelize.BOOLEAN
});


//many to many for student to assignment
const Submissions = sequelize.define('submission',{
    status : Sequelize.BOOLEAN,
});
Submissions.belongsTo(Students);
Students.hasMany(Submissions);
Submissions.belongsTo(Assignments);
Assignments.hasMany(Submissions);

//many to many for course to assignments
const CourseAssignments = sequelize.define('course_assignment',{});
CourseAssignments.belongsTo(Courses);
Courses.hasMany(CourseAssignments);
CourseAssignments.belongsTo(Assignments);
Assignments.hasMany(CourseAssignments);


//many to many for Students to courses
const StudentCourse = sequelize.define('student_course',{});
StudentCourse.belongsTo(Courses);
Courses.hasMany(StudentCourse);
StudentCourse.belongsTo(Students);
Students.hasMany(StudentCourse);

sequelize.sync();


//function to add student
function addStudent(name,roll,done,Course){
    Students.create({
        roll : roll,
        name : name
    }).then(function () {
        if(Course) enrollStudentInCourse(roll,Course);
        done();
    }).catch(function (err) {
        if(err) throw err;
    })
}

//function to get students list
function getStudents(done)  {
    Students.findAndCountAll().then(function (data) {
        done(data.rows)
    })

}

//function to get get students with a particular parameter
function searchStudent(){

}

//function to add a new assignment
function addAssignment(){

}

//function to get all assignments
function getAssignments(){

}

//function to get particular assignment
function searchAssignments(){

}

//function to add course
function addCourse(name,teacher,startDate,endDate){
    Courses.create({
        name : name,
        teacher : teacher,
        startDate : startDate,
        endDate : endDate,
        isActive: true

    })

}

//function to get all courses (overloaded for both active and passive)
function getCourses(){

}

//function to get a particular course
function searchCourse() {

}
function endCourse(courseID) {
    Courses.update({
        where : {
            id : courseID
        }
    }).then(function (data) {


    }).catch(function (err) {
        if(err) throw err;
    })
}

//add a submission
function addSubmission() {

}

//function to handle a new enrollment
function enrollStudentInCourse(roll,Course) {

}

//function to add an assignment to a course
function addAssignmentToCourse() {

}


module.exports = {
    addStudent,getStudents,searchStudent,addAssignment,getAssignments,searchAssignments,
    addCourse,getCourses,searchCourse,addSubmission,enrollStudentInCourse,addAssignmentToCourse
}

