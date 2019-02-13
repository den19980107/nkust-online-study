const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bring in User Model
let User = require('../model/user');

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
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);
    if (permission == "student") {
        req.checkBody('schoolname', '請輸入您的學校名稱').notEmpty();
        req.checkBody('department', '請輸入您的系別').notEmpty();
        req.checkBody('studentid', '請輸入您的學號').notEmpty();
    }

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
                        req.flash('success', 'You are now registered and can log in');
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
    res.render('userinfo');
});


//Logout 
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logout');
    res.redirect('/users/login');
});

//update user info
router.post('/updateUserinfo', function (req, res) {

    let query = {
        _id: req.user.id
    }
    User.update(query, {
        "userInfo": req.body.userinfo
    }, function (err) {
        if (err) {
            console.log(err);
        }
        req.flash('success', '更新成功');
        res.redirect('/users/userinfo');
    })
});

module.exports = router;