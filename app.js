const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database'); //在我們的config file裡面可以設定要用的database URL
const port = process.env.PORT || 3000;


mongoose.connect(config.database);
let db = mongoose.connection;


//check connection
db.once('open', function () {
    console.log("connect to mongodb");
});
//check for db errors
db.on('error', function (err) {
    console.log(err);
});

//init app
const app = express();

//bring in models
let Article = require('./model/article');
//Bring in User Model
let User = require('./model/user');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parse middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//Set public folder static
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Valudator Middleware
app.use(expressValidator());

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//設定一個user的全域變數 "*"代表所有route
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Home Route
app.get('/', ensureAuthenticated, function (req, res) {
    Article.find({}, function (err, articles) {

        if (err) {
            console.log(err);
        } else {
            res.render('index');
        }

    });
});

//Bring in Route file
let articles = require('./routes/articles');
let users = require('./routes/users');
let Class = require('./routes/class');
app.use('/articles', articles);
app.use('/users', users);
app.use('/class', Class);

//start server
app.listen(port, function () {
    console.log("Server started on port" + port);
})


//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}