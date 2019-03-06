const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//todo 做刪除單元
let ObjectID = require('mongodb').ObjectID;
//bring in Article models
let Article = require('../model/article');
//bring User model
let User = require('../model/user');
//bring Class model
let Class = require('../model/class');
//bring Unit model
let Unit = require('../model/unit');
//bring Chapter model
let Chapter = require('../model/chapter');
//bring Video model
let Video = require('../model/video');
//bring student take courese model
let StudebtTakeCourse = require('../model/StudentTakeCourse');
// Register Form
router.get('/register', function (req, res) {
    res.render('register');
});

//Register Process
router.post('/register', function (req, res) {
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
    req.checkBody('name', '名字不得為空').notEmpty();
    req.checkBody('email', 'Email不得為空').notEmpty();
    req.checkBody('email', 'Email格式錯誤').isEmail();
    req.checkBody('username', '帳號不得為空').notEmpty();
    req.checkBody('password', '密碼不得為空').notEmpty();
    req.checkBody('password2', '密碼不相符合').equals(req.body.password);
    // if (permission == "student") {
    //     req.checkBody('schoolname', '請輸入您的學校名稱').notEmpty();
    //     req.checkBody('department', '請輸入您的系別').notEmpty();
    //     req.checkBody('studentid', '請輸入您的學號').notEmpty();
    // }

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            user: false,
            errors: errors
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
            permission: permission
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', '您現在已經註冊且可以使用此帳號密碼登入了！');
                        res.redirect('/users/login'); //?
                    }
                });
            });
        })


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
});


//Login Form
router.get('/login', function (req, res) {
    res.render('login');
});

//Login process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//User info 
router.get('/userinfo', function (req, res) {
    res.render('userinfo', {
        authenticate: true
    });
});


//Logout 
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', '您已登出！');
    res.redirect('/users/login');
});

//update user info
router.post('/updateUserinfo', function (req, res) {
    console.log(req.body);

    let query = {
        _id: req.user.id
    }
    if (req.user.permission == "student") {
        User.update(query, {
            "userInfo": req.body.userinfo,
            "name": req.body.name,
            "email": req.body.email,
            "schoolname": req.body.schoolname,
            "department": req.body.department,
            "studentid": req.body.studentid
        }, function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', '更新成功');
            res.redirect('/users/userinfo');
        })
    }
    if (req.user.permission == "teacher") {
        User.update(query, {
            "userInfo": req.body.userinfo,
            "name": req.body.name,
            "email": req.body.email
        }, function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', '更新成功');
            res.redirect('/users/userinfo');
        })
    }

});

//顯示我選的課
router.get('/myclass', function (req, res) {
    if (req.user.permission == "student") {
        StudebtTakeCourse.find({
            studentID: req.user._id
        }, function (err, classes) {
            if (err) {
                console.log(err);
            }
            console.log(classes);
            let findClassInfoQuery = [];
            for (let i = 0; i < classes.length; i++) {
                findClassInfoQuery.push(ObjectID(classes[i].classID));
            }
            Class.find({
                _id: findClassInfoQuery
            }, function (err, classesInfo) {
                if (err) {
                    console.log(err);
                }
                res.render("myclass", {
                    title: "修課清單",
                    classes: classesInfo
                })
            })

        })
    }
    if (req.user.permission == "teacher") {
        Class.find({
            teacher: req.user._id
        }, function (err, classes) {
            if (err) {
                console.log(err);
            }
            res.render("myclass", {
                title: "開課清單",
                classes: classes
            })
        })
    }
});
module.exports = router;