/**
 * Created by abhishekyadav on 28/06/17.
 */
const teachers = require('./teachers');
const batches = require('./batches');
const assignments = require('./assignments');
const students = require('./students');
const submissions = require('./submissions');
const users = require('./users');
const validatePassword = require('./validatepassword');

module.exports = {
    users,
    validatePassword,
    teachers,
    submissions,
    students,
    batches,
    assignments,
}