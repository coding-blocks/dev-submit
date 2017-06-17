/**
 * Created by varun on 6/3/17.
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize("cb", "root", "Cool@man6", {
    host: "localhost",
    dialect: 'mysql',

    pool: {
        min: 0,
        max: 5,
        idle: 1000
    },
});

//Table to store students
const Students = sequelize.define('student', {
    id : {type : Sequelize.INTEGER, primaryKey : true , autoIncrement : true},
    name: Sequelize.STRING,
    roll: {type: Sequelize.STRING, unique: true},
    email : {type : Sequelize.STRING , isEmail : true}
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
Students.hasMany(Submissions, {
    onDelete: 'cascade', hooks: true
});
Submissions.belongsTo(Assignments);
Assignments.hasMany(Submissions,{
    onDelete: 'cascade', hooks: true
});

//many to many for course to assignments
const CourseAssignments = sequelize.define('course_assignment', {});
CourseAssignments.belongsTo(Courses);
Courses.hasMany(CourseAssignments,{
    onDelete: 'cascade', hooks: true
});
CourseAssignments.belongsTo(Assignments);
Assignments.hasMany(CourseAssignments),{
    onDelete: 'cascade', hooks: true
};


//many to many for Students to courses
const StudentCourse = sequelize.define('student_course', {});
StudentCourse.belongsTo(Courses);
Courses.hasMany(StudentCourse,{
    onDelete: 'cascade', hooks: true
});
StudentCourse.belongsTo(Students);
Students.hasMany(StudentCourse,{
    onDelete: 'cascade', hooks: true
});

sequelize.sync();


module.exports = {Students, Courses, Assignments, Submissions, CourseAssignments, StudentCourse};