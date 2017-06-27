const express = require('express')
const bp = require('body-parser')
const api_v1 = require('./Routes/api_v1')
const exphbs = require('express-hbs')
const session = require('express-session')
const flash = require('connect-flash')
const cp = require('cookie-parser')
const path = require('path');
const passport = require('passport')
const validator = require('express-validator')
const fileupload = require('express-fileupload');


const app = express();


app.use(bp.json());
app.use(bp.urlencoded({extended : true}));
app.use(cp());
app.use(fileupload());


app.engine('hbs', exphbs.express4({
    layoutsDir: path.join(__dirname,'views/layout'),
    defaultLayout: path.join(__dirname,'views/layout/default.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave : true

}));


app.use(passport.initialize());
app.use(passport.session());

app.use(validator({

    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';

        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/api/v1',api_v1);
app.use('/',express.static(__dirname + '/public_html'),require('./Routes/index'))
app.use('/users',require('./Routes/Users'))


app.listen(4000,() => {
     console.log("we are up and running on port 4000")
});