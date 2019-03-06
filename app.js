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


//bring video behavior model
let Videobehavior = require('./model/videobehavior');
//bring Video model
let Video = require('./model/video');

//socket.io
server = require('http').createServer(app)
io = require('socket.io').listen(server)
io.on('connection', function (socket) {
    console.log('socket connection');
    let isStart = false;
    let videobehavior = new Videobehavior();
    socket.on('videoAction', function (obj) {
        if (obj.type == "open") {
            isStart = true;
            videobehavior.videoActions.push("0:0:0");
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/" +
                (currentdate.getMonth() + 1) + "/" +
                currentdate.getFullYear() + " @ " +
                currentdate.getHours() + ":" +
                currentdate.getMinutes() + ":" +
                currentdate.getSeconds();
            videobehavior.watchTime = datetime;
            videobehavior.watcherID = obj.watcherID;
            videobehavior.videoID = obj.videoID;
            Video.findById({
                _id: obj.videoID
            }, function (err, video) {
                console.log(obj);

                if (video.vtime == '' || video.vtime == '0' || video.vtime == 0) {
                    let newVideo = {};
                    newVideo.videoName = video.videoName;
                    newVideo.videoURL = video.videoURL;
                    newVideo.belongUnit = video.belongUnit;
                    newVideo.vtime = obj.vtime;
                    let query = {
                        _id: video._id
                    }
                    Video.update(query, newVideo, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log("success");
                        }

                    });
                }
            })

        }
        if (isStart) {
            if (obj.type == "play") {
                videobehavior.videoActions.push("play:" + obj.time + ":" + obj.time);
            }
            if (obj.type == "pause") {
                videobehavior.videoActions.push("pause:" + obj.time + ":" + obj.time);
            }
            if (obj.type == "fastTurn") {
                videobehavior.videoActions.push("fastTurn:" + obj.beginTime + ":" + obj.endTime);
            }

            if (obj.type == "close") {
                videobehavior.videoActions.push("0:0:0");
                videobehavior.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(videobehavior);
                });
            }
        }

    })
})

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
let backend = require('./routes/backend');
let SDC = require('./routes/SDC');
let coding = require('./routes/coding');
let uploader = require('./routes/uploader');
app.use('/articles', articles);
app.use('/users', users);
app.use('/class', Class);
app.use('/backend', backend);
app.use('/SDC', SDC);
app.use('/coding', coding);
app.use('/uploader', uploader);
//start server
server.listen(port, function () {
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