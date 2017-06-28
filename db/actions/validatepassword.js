/**
 * Created by abhishekyadav on 28/06/17.
 */
const bcrypt = require('bcrypt');


function validateLocalPassword(user, password, PassportDone, done) {
    bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) throw err;
        done(user, isMatch, PassportDone);
    });
}

module.exports={validateLocalPassword};