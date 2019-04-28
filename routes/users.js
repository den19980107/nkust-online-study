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
//bring note model
let Note = require('../model/note');
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
    console.log(permission);
    if (permission == undefined) {
        console.log("permission undefind");

    }
    req.checkBody('name', '名字不得為空').notEmpty();
    req.checkBody('email', 'Email不得為空').notEmpty();
    req.checkBody('email', 'Email格式錯誤').isEmail();
    req.checkBody('username', '帳號不得為空').notEmpty();
    req.checkBody('password', '密碼不得為空').notEmpty();
    req.checkBody('password2', '密碼不相符合').equals(req.body.password);

    User.find({
        username: req.body.username
    }, function (err, users) {
        if (users.length != 0) {
            let errors = req.validationErrors();
            console.log(errors);
            if (errors) {
                errors.push({
                    msg: "此帳號已有人使用"
                });
            } else {
                errors = [{
                    msg: "此帳號已有人使用"
                }]
            }
            if (permission == undefined) {
                if (errors) {
                    errors.push({
                        msg: "請選擇身份"
                    });
                } else {
                    errors = [{
                        msg: "請選擇身份"
                    }]
                }
            }

            console.log(errors.length);
            res.render('register', {
                user: false,
                errors: errors
            });
        } else {
            let errors = req.validationErrors();
            if (permission == undefined) {
                if (errors) {
                    errors.push({
                        msg: "請選擇身份"
                    });
                } else {
                    errors = [{
                        msg: "請選擇身份"
                    }]
                }
            }
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
                                req.flash('success', '註冊成功！您現在已經註冊且可以使用此帳號密碼登入了！');
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
        }
    })


});


//Login Form
router.get('/login', function (req, res) {
    console.log("get login,url = "+req.originalUrl);
    if(req.url.split('/').length>2){
        let url = req.url.split('/')[2].replace("?r=","");
        console.log("haveNext url = "+url);
        
        res.render('login',{
            nextURL:url.replace(new RegExp('%2F', 'g'),'/')
        });
    }else{
        res.render('login',{
            nextURL:null
        });
    }
});


//Login process
router.post('/login', function (req, res, next) {
    console.log(req.body);
    req.checkBody('username', '帳號未填寫').notEmpty();
    req.checkBody('password', '密碼未填寫').notEmpty(); 
    let errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        res.render('login', {
            errors: errors,
            user: ''
        })
    } else {
        let successRedirectURL = "";
        if(req.body.nextURL != "null"){
            console.log(req.body.nextURL)
            successRedirectURL = req.body.nextURL
            console.log("successRedirectURL = ",successRedirectURL);
            
            passport.authenticate('local', {
                successRedirect: successRedirectURL,
                failureRedirect: '/users/login/?r='+successRedirectURL.replace(new RegExp('/', 'g'),'%2F'),
                failureFlash: true
            })(req, res, next);
        }else{
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: true
            })(req, res, next);
        }
    }
});

//User info 
router.get('/userinfo', ensureAuthenticated, function (req, res) {
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
router.post('/updateUserinfo', ensureAuthenticated, function (req, res) {
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
router.get('/myclass', ensureAuthenticated, function (req, res) {
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
                    title: "個人修課清單",
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
                title: "個人開課清單",
                classes: classes
            })
        })
    }
});

//顯示我的筆記
router.get('/mynote', ensureAuthenticated, function (req, res) {
    if(req.user.permission == "teacher"){
        res.render('index');
    }else{
        res.render('mynote');
    }
})
//新增筆記
router.post('/note/createNote', ensureAuthenticated, function (req, res) {
    console.log(req.body);
    let newNote = new Note();
    newNote.title = req.body.title;
    newNote.body = req.body.body;
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();
    newNote.postTime = datetime
    newNote.author = req.user;
    newNote.author_id = req.user._id;
    console.log(newNote);

    newNote.save(function (err) {
        if (err) {

        } else {
            Note.find({
                author_id: req.user._id
            }, function (err, notes) {
                console.log(notes);
                res.send(notes)
            })
        }
    })

});


//取得我的所有筆記
router.get('/note/getNote', ensureAuthenticated, function (req, res) {
    Note.find({
        author_id: req.user._id
    }, function (err, notes) {
        console.log(notes);
        res.send(notes)
    })
});

//取得我的一比筆記
router.get('/note/getSigleNote/:noteID', function (req, res) {
    console.log("asasddasasdad");
    Note.findById(req.params.noteID, function (err, note) {
        if (err) {
            console.log(err);

        }
        console.log(note);
        res.send(note)
    })
});

//存存編輯中筆記
router.post('/note/saveNote/:noteID', ensureAuthenticated, function (req, res) {
    console.log("---------------save body---------------");
    console.log(req.body);
    console.log("---------------save body---------------");
    Note.findById({
        _id: req.params.noteID
    }, function (err, note) {
        let updateNote = {
            title: req.body.title,
            body: req.body.body,
            postTime: note.postTime,
            author: note.author,
            author_id: note.author_id
        }
        Note.update({
            _id: req.params.noteID
        }, updateNote, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("saved");
            res.send('200')
        })
    })

});

//刪除筆記
router.delete('/note/deleteNote/:noteID', ensureAuthenticated, function (req, res) {
    Note.deleteOne({
        _id: req.params.noteID
    }, function (err) {
        if (err) {
            res.send(404);
        } else {
            Note.find({
                author_id: req.user._id
            }, function (err, notes) {
                if (err) {
                    console.log(err);
                }
                res.send(notes)
            })
        }
    })
})

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('danger', '請先登入');
      let nextURL =  req.originalUrl.replace(new RegExp('/', 'g'),'%2F');
      console.log("inuser ensure = "+nextURL);
      console.log("url = /users/login/?r="+nextURL);
      
      res.redirect('/users/login/?r='+nextURL);
    }
}
module.exports = router;