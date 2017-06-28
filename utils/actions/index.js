/**
 * Created by apoorvaa_gupta on 28/6/17.
 */

const student = require('./student');
const teacher = require('./teacher');
const user = require('./user');
const batch = require('./batch');
const assignment = require('./assignment');
const submission = require('./submission');

module.exports = {
    student,
    teacher,
    user,
    batch,
    assignment,
    submission
}