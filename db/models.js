/**
 * Created by varun on 6/3/17.
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize('user', 'db', 'password', {
    dialect: 'postgres',
    port: 5432,

    pool: {
        min: 0,
        max: 5,
        idle: 1000
    }
});

//Table to store students
const Students = sequelize.define('student', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: Sequelize.STRING,
    roll: {type: Sequelize.STRING, unique: true},
    email: {type: Sequelize.STRING, isEmail: true}
});

//Table to store teachers

const Teachers = sequelize.define('teacher', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: Sequelize.STRING,
    email: {type: Sequelize.STRING, isEmail: true}
});

//table to store assignments
const Assignments = sequelize.define('assignment', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, unique: true},
    description: Sequelize.STRING
});

//table to store courses
const Courses = sequelize.define('courses', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, unique: true}
});

//table to store course-assignments
const CourseAssignments = sequelize.define('course_assignments', {});


//many to many for batch to assignments
const BatchAssignments = sequelize.define('batch_assignment', {
    id : {type: Sequelize.INTEGER,primaryKey: true,autoIncrement: true}
});


//many to many for Students to Batches
const StudentBatch = sequelize.define('student_batch', {});

//table to store Batches
const Batches = sequelize.define('batch', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    code: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    isActive: Sequelize.BOOLEAN
});


//many to many for student to assignment
const Submissions = sequelize.define('submission', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    status: Sequelize.BOOLEAN,
    url: Sequelize.STRING,
    studentId: {type: Sequelize.INTEGER,unique: '1'},
    batchAssignmentId: {type: Sequelize.INTEGER,unique: '1'}
});

//Table to store password and username
const UserLocal = sequelize.define('userlocal', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, unique: true},
    password: Sequelize.STRING
});

const Users = sequelize.define('user', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
});

//table to store access tokens
const AuthToken = sequelize.define('authtoken', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    accesstoken: {type: Sequelize.STRING, unique: true},
    clientoken: {type: Sequelize.STRING, unique: true}
});

Submissions.belongsTo(Students);
Students.hasMany(Submissions, {
    onDelete: 'cascade',
    hooks: true
});
Submissions.belongsTo(BatchAssignments);
BatchAssignments.hasMany(Submissions, {
    onDelete: 'cascade',
    hooks: true
});

Batches.belongsToMany(Assignments,{through : BatchAssignments});
Assignments.belongsToMany(Batches,{through: BatchAssignments});

Students.belongsToMany(Batches,{through: StudentBatch});
Batches.belongsToMany(Students,{through: StudentBatch});

Courses.belongsToMany(Assignments, {through: CourseAssignments});
Assignments.belongsToMany(Courses, {through: CourseAssignments});

Batches.belongsTo(Teachers);
Teachers.hasMany(Batches);

Batches.belongsTo(Courses);
Courses.hasMany(Batches);


//one to one for authtoken and Users
AuthToken.belongsTo(Users);
Users.hasOne(AuthToken);

//one to one for students and users
Students.belongsTo(Users);
Users.hasOne(Students);

//one to one for teachers and users
Teachers.belongsTo(Users);
Users.hasOne(Teachers);

//one to one for userlocal and user
UserLocal.belongsTo(Users);
Users.hasOne(UserLocal);

sequelize.sync({force: true});

module.exports = {
    Students,
    Batches,
    Assignments,
    Submissions,
    BatchAssignments,
    StudentBatch,
    Courses,
    CourseAssignments,
    UserLocal,
    Teachers,
    Users,
    AuthToken
};
