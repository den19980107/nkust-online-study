const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const axios = require("axios");
//todo 做刪除單元
let ObjectID = require("mongodb").ObjectID;
//bring in Article models
let Article = require("../model/article");
//bring User model
let User = require("../model/user");
//bring Class model
let Class = require("../model/class");
//bring Unit model
let Unit = require("../model/unit");
//bring Chapter model
let Chapter = require("../model/chapter");
//bring Video model
let Video = require("../model/video");
//bring student take courese model
let StudebtTakeCourse = require("../model/StudentTakeCourse");
//bring note model
let Note = require("../model/note");
//login history model
let LoginHistory = require("../model/loginHistory");
//action type
let ActionType = require("../config/actionType");
//full line speed api
let API = require("../config/api");

//寄email的工具
const mailServerInstant = require("../service/mailServer");

// Register Form
router.get("/register", function (req, res) {
    res.render("register");
});
//寄email的工具
var nodemailer = require("nodemailer");

//Register Process
router.post("/register", function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const schoolname = req.body.schoolname;
    const department = req.body.department;
    const studentid = req.body.studentid;
    let permission;
    if (req.body.student) {
        permission = "student";
    } else if (req.body.teacher) {
        permission = "teacher";
    }
    //console.log(permission);
    if (permission == undefined) {
        //console.log("permission undefind");
    }
    req.checkBody("name", "名字不得為空").notEmpty();
    req.checkBody("email", "Email不得為空").notEmpty();
    req.checkBody("email", "Email格式錯誤").isEmail();
    req.checkBody("username", "帳號不得為空").notEmpty();
    req.checkBody("password", "密碼不得為空").notEmpty();
    req.checkBody("password2", "密碼不相符合").equals(req.body.password);
    User.find(
        {
            username: req.body.username,
        },
        function (err, users) {
            if (users.length != 0) {
                let errors = req.validationErrors();
                console.log(errors);
                if (errors) {
                    errors.push({
                        msg: "此帳號已有人使用",
                    });
                } else {
                    errors = [
                        {
                            msg: "此帳號已有人使用",
                        },
                    ];
                }
                if (permission == undefined) {
                    if (errors) {
                        errors.push({
                            msg: "請選擇身份",
                        });
                    } else {
                        errors = [
                            {
                                msg: "請選擇身份",
                            },
                        ];
                    }
                }

                //console.log(errors.length);
                res.render("register", {
                    user: false,
                    errors: errors,
                });
            } else {
                let errors = req.validationErrors();
                if (permission == undefined) {
                    if (errors) {
                        errors.push({
                            msg: "請選擇身份",
                        });
                    } else {
                        errors = [
                            {
                                msg: "請選擇身份",
                            },
                        ];
                    }
                }
                if (errors) {
                    res.render("register", {
                        user: false,
                        errors: errors,
                    });
                } else {
                    let newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password,
                        schoolname: schoolname,
                        department: department,
                        studentid: studentid,
                        permission: permission,
                        InActive: permission == "teacher" ? true : false,
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (
                            err,
                            hash
                        ) {
                            if (err) {
                                console.log(err);
                            }
                            newUser.password = hash;
                            newUser.save(function (err) {
                                if (err) {
                                    req.flash("errors", "註冊失敗！");
                                } else {
                                    if (newUser.InActive) {
                                        mailToAdmin(
                                            `<h3>使用者 ${
                                                newUser.name
                                            } 需要被審核！請您至後台審核</h3> \n<p>名稱:${
                                                newUser.name
                                            }</p> \n<p>電子郵件:${
                                                newUser.email
                                            }</p> \n <p>學校名稱:${
                                                newUser.schoolname
                                            }</p> \n <p>科系:${
                                                newUser.department
                                            }</p> \n <a href="${
                                                req.protocol +
                                                "://" +
                                                req.get("host")
                                            }/backend#/tool/active-teacher">點此進入平台審核</a>`
                                        );
                                    }
                                    req.flash(
                                        "success",
                                        "註冊成功！您現在已經註冊且可以使用此帳號密碼登入了！"
                                    );
                                    res.redirect("/users/login"); //
                                }
                            });
                        });
                    });

                    // newUser.save(function (err) {
                    //     if (err) {
                    //         console.log(err);
                    //         return;
                    //     } else {
                    //         req.flash('success', 'You are now registered and can log in');
                    //         res.redirect('/users/login'); //?
                    //     }
                    // });
                }
            }
        }
    );
});

//Login Form
router.get("/login", function (req, res) {
    //console.log("get login,url = "+req.originalUrl);
    if (req.url.split("/").length > 2) {
        let url = req.url.split("/")[2].replace("?r=", "");
        //console.log("haveNext url = "+url);

        res.render("login", {
            nextURL: url.replace(new RegExp("%2F", "g"), "/"),
        });
    } else {
        res.render("login", {
            nextURL: null,
        });
    }
});

//Login process
router.post("/login", function (req, res, next) {
    console.log(req.body);
    req.checkBody("username", "帳號未填寫").notEmpty();
    req.checkBody("password", "密碼未填寫").notEmpty();
    let errors = req.validationErrors();
    //console.log(errors);
    if (errors) {
        res.render("login", {
            errors: errors,
            user: "",
        });
    } else {
        let successRedirectURL = "";
        if (req.body.nextURL != "null") {
            //console.log(req.body.nextURL)
            successRedirectURL = req.body.nextURL;
            //console.log("successRedirectURL = ",successRedirectURL);

            passport.authenticate("local", {
                successRedirect: successRedirectURL,
                failureRedirect:
                    "/users/login/?r=" +
                    successRedirectURL.replace(new RegExp("/", "g"), "%2F"),
                failureFlash: true,
            })(req, res, next);
        } else {
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/users/login",
                failureFlash: true,
            })(req, res, next);
        }
    }
});

//User renewpassword
router.get("/renewpassword/:username", function (req, res) {
    if (req.params.username != 0) {
        res.render("confirmpassword", {});
    } else {
        res.render("renewpassword", {});
    }
});
//renewpassword status
router.get("/login/renewpassword/:status", function (req, res) {
    if (req.params.status == "0") {
        req.flash("danger", "您已經取消密碼更改！");
        res.redirect("/users/login");
    } else {
        req.flash("success", "完成身分認證，請至信箱收取信件！");
        res.redirect("/users/login");
    }
});

//User renewpassword Confirm
router.post("/renewconfirm/:username/:email", function (req, res) {
    // console.log(req.params.username);
    // console.log(req.params.email);
    // console.log(req.body.url);
    User.find(
        { username: req.params.username, email: req.params.email },
        function (err, users) {
            console.log(users);
            if (err) {
                res.send('{"error" : "要求失敗", "status" : 500}');
            } else {
                if (users.length == 0) {
                    res.send(false);
                } else {
                    res.send(true);
                    var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "nkust.online.study@gmail.com",
                            pass: `u3t"jnh4C\p&Q'gZ]I7Z,I[E)9Qk `,
                        },
                    });
                    //console.log(student.email);
                    let random = Math.random().toString(36);
                    let random1 = "";
                    let random2 = "";
                    for (let i = 2; i < 6; i++) {
                        random1 += random[i];
                    }
                    for (let j = 6; j < 10; j++) {
                        random2 += random[j];
                    }
                    var websiteDomain = req.body.url;
                    var mailOptions = {
                        from: "nkust.online.study@gmail.com",
                        to: req.params.email,
                        subject: "i-Coding學習平臺",
                        text:
                            `親愛的客戶您好:\n\n您是否要更改密碼呢?\n若要更改密碼請點選下面的連結，如不更改請忽略此信件。\n ${websiteDomain}/` +
                            random1 +
                            req.params.username +
                            random2,
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            //console.log('Email sent: ' + info.response);
                        }
                    });
                }
            }
        }
    );
});

//User confirmpassword
router.get("/confirmpassword/:password/:username", function (req, res) {
    const password = req.params.password;
    const username = req.params.username;
    const saltRounds = 10;
    // 加密
    bcrypt.hash(password, saltRounds).then(function (hash) {
        // Store hash in your password DB.
        console.log(hash);
        User.updateMany(
            { username: username },
            { $set: { password: hash } },
            { w: 1 },
            function (err, result) {
                if (err) throw err;
                req.flash(
                    "success",
                    "密碼更新成功！您現在已經可以使用新密碼登入了！"
                );
                res.redirect("/users/login");
            }
        );
    });
});

//User info
router.get("/userinfo", ensureAuthenticated, function (req, res) {
    res.render("userinfo", {
        authenticate: true,
    });
});

//Logout
router.get("/logout", function (req, res) {
    recordBehavior(req.user._id, ActionType.Logout, req.url);
    req.logout();
    req.flash("success", "您已登出！");
    res.redirect("/users/login");
});

//update user info
router.post("/updateUserinfo", ensureAuthenticated, function (req, res) {
    //console.log(req.body);

    let query = {
        _id: req.user.id,
    };
    if (req.user.permission == "student") {
        User.update(
            query,
            {
                userInfo: req.body.userinfo,
                name: req.body.name,
                email: req.body.email,
                schoolname: req.body.schoolname,
                department: req.body.department,
                studentid: req.body.studentid,
            },
            function (err) {
                if (err) {
                    console.log(err);
                }
                req.flash("success", "更新成功");
                res.redirect("/users/userinfo");
            }
        );
    }
    if (req.user.permission == "teacher") {
        User.update(
            query,
            {
                userInfo: req.body.userinfo,
                name: req.body.name,
                email: req.body.email,
            },
            function (err) {
                if (err) {
                    console.log(err);
                }
                req.flash("success", "更新成功");
                res.redirect("/users/userinfo");
            }
        );
    }
});

//顯示我選的課
router.get("/myclass", ensureAuthenticated, function (req, res) {
    recordBehavior(req.user._id, "viewMyClasses");

    if (req.user.permission == "student") {
        StudebtTakeCourse.find(
            {
                studentID: req.user._id,
            },
            function (err, classes) {
                if (err) {
                    console.log(err);
                }
                // console.log("class = ");
                // console.log(classes);
                let findClassInfoQuery = [];
                for (let i = 0; i < classes.length; i++) {
                    findClassInfoQuery.push(ObjectID(classes[i].classID));
                }
                Class.find(
                    {
                        _id: findClassInfoQuery,
                    },
                    function (err, classesInfo) {
                        if (err) {
                            console.log(err);
                        }

                        res.render("myclass", {
                            title: "個人修課清單",
                            classesInfo: classesInfo,
                            classes: classes,
                        });
                    }
                );
            }
        );
    }
    if (req.user.permission == "teacher") {
        Class.find(
            {
                teacher: req.user._id,
            },
            function (err, classes) {
                if (err) {
                    console.log(err);
                }
                res.render("myclass", {
                    title: "個人開課清單",
                    classesInfo: classes,
                });
            }
        );
    }
});

//顯示我的筆記
router.get("/mynote", ensureAuthenticated, function (req, res) {
    recordBehavior(req.user._id, "viewMyNotes");

    if (req.user.permission == "teacher") {
        res.render("index");
    } else {
        res.render("mynote");
    }
});
//新增筆記
router.post("/note/createNote", ensureAuthenticated, function (req, res) {
    recordBehavior(req.user._id, "createNote");

    //console.log(req.body);
    let newNote = new Note();
    newNote.title = req.body.title;
    newNote.body = req.body.body;
    var currentdate = new Date();
    var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
    newNote.postTime = datetime;
    newNote.author = req.user;
    newNote.author_id = req.user._id;
    //console.log(newNote);

    newNote.save(function (err) {
        if (err) {
        } else {
            Note.find(
                {
                    author_id: req.user._id,
                },
                function (err, notes) {
                    //console.log(notes);
                    res.send(notes);
                }
            );
        }
    });
});

//取得我的所有筆記
router.get("/note/getNote", ensureAuthenticated, function (req, res) {
    Note.find(
        {
            author_id: req.user._id,
        },
        function (err, notes) {
            // console.log(notes);
            res.send(notes);
        }
    );
});

//取得我的一比筆記
router.get("/note/getSigleNote/:noteID", function (req, res) {
    console.log("asasddasasdad");
    Note.findById(req.params.noteID, function (err, note) {
        if (err) {
            console.log(err);
        }
        //console.log(note);
        res.send(note);
    });
});

//存存編輯中筆記
router.post("/note/saveNote/:noteID", ensureAuthenticated, function (req, res) {
    //console.log("---------------save body---------------");
    //console.log(req.body);
    //console.log("---------------save body---------------");
    Note.findById(
        {
            _id: req.params.noteID,
        },
        function (err, note) {
            let updateNote = {
                title: req.body.title,
                body: req.body.body,
                postTime: note.postTime,
                author: note.author,
                author_id: note.author_id,
            };
            Note.update(
                {
                    _id: req.params.noteID,
                },
                updateNote,
                function (err) {
                    if (err) {
                        console.log(err);
                    }
                    //console.log("saved");
                    res.send("200");
                }
            );
        }
    );
});

//刪除筆記
router.delete("/note/deleteNote/:noteID", ensureAuthenticated, function (
    req,
    res
) {
    Note.deleteOne(
        {
            _id: req.params.noteID,
        },
        function (err) {
            if (err) {
                res.send(404);
            } else {
                Note.find(
                    {
                        author_id: req.user._id,
                    },
                    function (err, notes) {
                        if (err) {
                            console.log(err);
                        }
                        res.send(notes);
                    }
                );
            }
        }
    );
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("danger", "請先登入");
        let nextURL = req.originalUrl.replace(new RegExp("/", "g"), "%2F");
        //console.log("inuser ensure = "+nextURL);
        //console.log("url = /users/login/?r="+nextURL);

        res.redirect("/users/login/?r=" + nextURL);
    }
}
//紀錄行為
function recordBehavior(userId, action, detail) {
    let loginHistory = new LoginHistory();
    loginHistory.userId = userId;
    loginHistory.action = action;
    loginHistory.detail = detail;
    loginHistory.UTCDate = getUTCDate();
    loginHistory.date = getLocalDate();
    loginHistory.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
}

async function mailToAdmin(message) {
    let admins = await User.find({ permission: "admin" });
    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];

        mailServerInstant.sendMail(
            "nkust.online.study@gmail.com",
            admin.email,
            "i-Coding學習平臺",
            message
        );
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'nkust.online.study@gmail.com',
        //         pass: `u3t"jnh4C\p&Q'gZ]I7Z,I[E)9Qk `
        //     }
        // });
        // //console.log(student.email);
        // var mailOptions = {
        //     from: 'nkust.online.study@gmail.com',
        //     to: admin.email,
        //     subject: 'i-Coding學習平臺',
        //     html: message
        // };

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         //console.log('Email sent: ' + info.response);
        //     }
        // });
    }
}

function getLocalDate() {
    let localTime = new Date().toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
    });
    return localTime;
}
function getUTCDate() {
    return new Date();
}
module.exports = router;
