//學生對課程做的事情都來這個router
const express = require('express');
const router = express.Router();
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
//bring student comment chapter model
let studentCommentChapter = require('../model/studentCommentChapter');
//bring student comment video model
let studentCommentVideo = require('../model/studentCommentVideo');
//寄email的工具
var nodemailer = require('nodemailer');
router.get('/student/:sid/Take/class/:cid', function (req, res) {
    console.log(req.params.cid);
    let classID = req.params.cid;
    let studentID = req.params.sid;
    classID = classID.replace(':', '');
    console.log(classID);
    let stc = new StudebtTakeCourse();
    stc.studentID = studentID;
    stc.classID = classID;
    stc.pridectGrade = "null";
    stc.permission = "null";
    stc.save(function (err) {
        if (err) {
            console.log(err);
        }
        Class.findById({
            _id: classID
        }, function (err, classinfo) {
            if (err) {
                console.log(err);
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nkust.online.study@gmail.com',
                    pass: 'kkc060500'
                }
            });

            var mailOptions = {
                from: 'nkust.online.study@gmail.com',
                to: req.user.email,
                subject: 'nkust線上學習平台',
                text: '歡迎您加入[' + classinfo.className + ']課程!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            res.redirect('/class/' + classID);
        })
    })
});
router.get('/student/:sid/Quit/class/:cid', function (req, res) {
    console.log("quit");
    let wantQuitSTC;
    let classID = req.params.cid;
    let studentID = req.params.sid;
    classID = classID.replace(':', '');
    StudebtTakeCourse.find({
        studentID: req.params.sid
    }, function (err, studentsClasses) {
        for (let i = 0; i < studentsClasses.length; i++) {
            if (studentsClasses[i].classID == classID) {
                wantQuitSTC = studentsClasses[i];
                break;
            }
        }
        StudebtTakeCourse.remove({
            _id: wantQuitSTC._id
        }, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/class/' + classID)
        })
    })
});
//使用者對文章留言
router.get('/user/:uid/comment/chapter/:cid/body/:body', function (req, res) {
    let userID = req.params.uid;
    let chapterID = req.params.cid;
    let body = req.params.body;
    let scc = new studentCommentChapter();
    scc.userID = userID;
    scc.userName = req.user.username;
    scc.chapterID = chapterID;
    scc.body = body;
    let d = new Date();
    scc.commentTime = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    scc.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/class/showChapter/' + chapterID);
    })
});

//使用者對影片留言
router.get('/user/:uid/comment/video/:vid/body/:body', function (req, res) {
    let userID = req.params.uid;
    let videoID = req.params.vid;
    let body = req.params.body;
    let userName = req.user.username;
    let scv = new studentCommentVideo();
    scv.userID = userID;
    scv.videoID = videoID;
    scv.body = body;
    scv.userName = userName;
    let d = new Date();
    scv.commentTime = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    console.log("scv = " + scv);

    scv.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/class/showVideo/' + videoID);
    })

});

module.exports = router;