/**
 * Created by varun on 6/3/17.
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize("tech4GT", "postgres", "", {
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

//table to store Batches
const Batches = sequelize.define('batch', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, unique: true},
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    isActive: Sequelize.BOOLEAN
});
Batches.belongsTo(Teachers);
Teachers.hasMany(Batches);



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
Assignments.hasMany(Submissions, {
    onDelete: 'cascade', hooks: true
});

//many to many for batch to assignments
const BatchAssignments = sequelize.define('batch_assignment', {});
BatchAssignments.belongsTo(Batches);
Batches.hasMany(BatchAssignments, {
    onDelete: 'cascade', hooks: true
});
BatchAssignments.belongsTo(Assignments);
Assignments.hasMany(BatchAssignments), {
    onDelete: 'cascade', hooks: true
};


//many to many for Students to Batches
const StudentBatch = sequelize.define('student_batch', {});
StudentBatch.belongsTo(Batches);
Batches.hasMany(StudentBatch, {
    onDelete: 'cascade', hooks: true
});
StudentBatch.belongsTo(Students);
Students.hasMany(StudentBatch, {
    onDelete: 'cascade', hooks: true
});


//Table to store password and username
const UserLocal = sequelize.define('userlocal', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, unique: true},
    password: Sequelize.STRING,
});

const Users = sequelize.define('user', {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
});


//one to one for students and userlocal
Students.belongsTo(Users);
Users.hasOne(Students);


//one to one for teachers and userlocal
Teachers.belongsTo(Users);
Users.hasOne(Teachers);

//one to one for userlocal and user
UserLocal.belongsTo(Users);
Users.hasOne(UserLocal);


sequelize.sync();


module.exports = {Students, Batches, Assignments, Submissions, BatchAssignments, StudentBatch, UserLocal, Teachers,Users};