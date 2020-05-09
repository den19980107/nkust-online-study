const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios").default;
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database"); //在我們的config file裡面可以設定要用的database URL
const cors = require("cors");

// import models
const Videobehavior = require("./model/videobehavior");
const Video = require("./model/video");
let Article = require("./model/article");

const port = process.env.PORT || 3000;
//init app
const app = express();

mongoose.connect(config.database, {
    useNewUrlParser: true,
});
let db = mongoose.connection;

//check connection
db.once("open", function () {
    console.log("connect to mongodb");
});
//check for db errors
db.on("error", function (err) {
    console.log(err);
});

//socket.io
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
io.on("connection", function (socket) {
    console.log("socket connection");
    let isStart = false;
    let videobehavior = new Videobehavior();
    socket.on("videoAction", function (obj) {
        console.log(obj.type);
        if (obj.type == "open") {
            isStart = true;
            videobehavior.videoActions.push("0:0:0");
            var currentdate = new Date();
            var datetime =
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds();
            videobehavior.watchTime = datetime;
            videobehavior.watcherID = obj.watcherID;
            videobehavior.videoID = obj.videoID;
            Video.findById(
                {
                    _id: obj.videoID,
                },
                function (err, video) {
                    console.log(obj);

                    if (
                        video.vtime == "" ||
                        video.vtime == "0" ||
                        video.vtime == 0
                    ) {
                        let newVideo = {};
                        newVideo.videoName = video.videoName;
                        newVideo.videoURL = video.videoURL;
                        newVideo.belongUnit = video.belongUnit;
                        newVideo.vtime = obj.vtime;
                        let query = {
                            _id: video._id,
                        };
                        Video.update(query, newVideo, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                console.log("success");
                            }
                        });
                    }
                }
            );
        }
        if (isStart) {
            if (obj.type == "play") {
                videobehavior.videoActions.push(
                    "play:" + obj.time + ":" + obj.time
                );
            }
            if (obj.type == "pause") {
                videobehavior.videoActions.push(
                    "pause:" + obj.time + ":" + obj.time
                );
            }
            if (obj.type == "fastTurn") {
                videobehavior.videoActions.push(
                    "fastTurn:" + obj.beginTime + ":" + obj.endTime
                );
            }
            if (obj.type == "note") {
                videobehavior.videoActions.push(
                    "note:" + obj.time + ":" + obj.time
                );
            }
            if (obj.type == "close") {
                videobehavior.videoActions.push(
                    "close:" + obj.time + ":" + obj.time
                );
                videobehavior.videoActions.push(
                    "totalWatchTime:" + obj.totalTime + ":" + obj.totalTime
                );
                videobehavior.save(function (err) {
                    if (err) {
                        console.log("save videobehavior err:" + err);
                    }
                    console.log("save videobehavior success");
                    console.log(videobehavior);
                });
            }
        }
    });
    socket.on("script", function (script) {
        //從伺服端拿到script的資訊
        //內容有：
        //input: "some input"
        //language: "程式語言"
        //script: "程式碼""
        console.log(script);
        console.log("--------------------");
        sendScriptToApi(script.script, script.input, script.language, socket);
    });
});

// 使用自己架的 api https://nodejs-online-compiler.appspot.com/compile
// doc: https://github.com/den19980107/online-compiler
var sendScriptToApi = async function (script, input, language, socket) {
    var program = {
        stdin: input,
        script: script,
        language: language,
    };

    var answer = {
        error: "",
        statusCode: "",
        body: "",
    };

    let { data } = await axios.post("http://localhost:5000/api/compile", {
        userId: "5e9cf4bd45f4ee630bb67949",
        apiKey:
            "6b38a4b65efc030b856dc3c5803218f17d99f43f09e2c93168cca50b08b1966a3ff12469fc4cb4e5b4bb0c24df584c3a",
        language: program.language,
        script: program.script,
        stdin: program.stdin,
    });
    answer.error = data.errorType ? data.errorType : null;
    answer.statusCode = data.errorType ? "Compile Error" : null;
    answer.body = {
        output: data.stdout,
        memory: data.errorType ? null : data.memoryUsage,
        cpuTime: data.errorType ? null : data.cpuUsage,
    };
    socket.emit("answer", answer);
};
//-------------------編譯程式

//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//allow cros
app.use(cors());

// Body parse middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json({ limit: "50mb" }));

//Set public folder static
app.use(express.static(path.join(__dirname, "public")));

//Express Session Middleware
app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
    })
);

//Express Message Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

//Express Valudator Middleware
app.use(expressValidator());

//Passport Config
require("./config/passport")(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//設定一個user的全域變數 "*"代表所有route
app.get("*", function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Home Route
app.get("/", ensureAuthenticated, function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index");
        }
    });
});

//Bring in Route file
let articles = require("./routes/articles");
let users = require("./routes/users");
let Class = require("./routes/class");
let backend = require("./routes/backend");
let SDC = require("./routes/SDC");
let coding = require("./routes/coding");
let uploader = require("./routes/uploader");
let API = require("./routes/API");
let school = require("./routes/school");
let about = require("./routes/about");
let admin = require("./routes/admin");
app.use("/articles", articles);
app.use("/users", users);
app.use("/class", Class);
app.use("/backend", backend);
app.use("/SDC", SDC);
app.use("/coding", coding);
app.use("/uploader", uploader);
app.use("/api", API);
app.use("/school", school);
app.use("/about", about);
app.use("/admin", admin);

app.use(express.static("iCoding_admin"));

//start server
server.listen(port, function () {
    console.log("Server started on port" + port);
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("danger", "請先登入！");
        res.redirect("/users/login");
    }
}
