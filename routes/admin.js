const express = require('express');
const router = express.Router();
let mailServerInstant = require('../service/mailServer')

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
//bring Videobehavior model
let Videobehavior = require('../model/videobehavior');
//bring student take courese model
let StudebtTakeCourse = require('../model/StudentTakeCourse');
//bring student comment chapter model
let studentCommentChapter = require('../model/studentCommentChapter');
//bring student comment video model
let studentCommentVideo = require('../model/studentCommentVideo');
//bring Test model
let Test = require('../model/test');
//bring Homework model
let Homework = require('../model/homework');
//bring student submit test model
let studntSubmitTest = require('../model/studentSubmitTest');
//bring student submit homework model
let studntSubmitHomework = require('../model/studentSubmitHomework');
//寄email的工具
var nodemailer = require('nodemailer');
//bring note model
let Note = require('../model/note')
//bring ClassEBook model
let classEBook = require('../model/classEBook')
//bring RFM model
let RFM = require('../model/RFM')
//bring studentWatchChapter modal
let studentWatchChapter = require('../model/studentWatchChapter');
//bring coding qution modal
let CodingQution = require("../model/codeQution");
//bring School model
let School = require('../model/school');
// bring LoginHistoty model
let LoginHistoty = require('../model/loginHistory');
let CodeTag = require("../model/codeTags");

// 拿到所有 user
router.get('/getUsers', function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}')
        } else {
            res.json(users);
        }
    })
})
// 刪除 user by id
router.post('/deleteUserByid', async function (req, res) {
    const { userId } = req.body
    let user = await User.findById(userId)
    if (user) {
        try {
            await Class.deleteMany({ teacher: userId })
            await User.findOneAndDelete({ _id: userId })
            res.json({ message: "刪除成功" })
        } catch (err) {
            console.log("delete error in deleteUserByid err = ", err)
            res.status(500).json({ message: "刪除失敗" })
        }
    } else {
        res.status(500).json({ message: "無此使用者" })
    }
})

//拿到所有課程
router.get('/getClasses', function (req, res) {
    Class.find({}, function (err, classes) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}')
        } else {
            res.json(classes);
        }
    })
})

// 拿到所有講義
router.get('/getChapters', async function (req, res) {
    try {
        let chapters = await Chapter.find({})
        let chaptersData = []
        for (let i = 0; i < chapters.length; i++) {
            const chpater = {
                _id: chapters[i]._id,
                chapterName: chapters[i].chapterName,
                body: chapters[i].body,
                belongUnit: chapters[i].belongUnit
            }
            const chaptersUnit = await Unit.findById(chpater.belongUnit);
            const chaptersClass = await Class.findById(chaptersUnit.belongClass)
            chpater['unit'] = chaptersUnit;
            chpater['class'] = chaptersClass
            chaptersData.push(chpater)
        }
        res.send(chaptersData)
    } catch (err) {
        console.log(err)
        res.send('{"error" : "要求失敗", "status" : 500}')
    }
})


// 拿到所有影片
router.get('/getVideos', async function (req, res) {
    try {
        let videos = await Video.find({})
        let videosData = []
        for (let i = 0; i < videos.length; i++) {
            const video = {
                _id: videos[i]._id,
                videoName: videos[i].videoName,
                videoURL: videos[i].videoURL,
                belongUnit: videos[i].belongUnit
            }
            const videoUnit = await Unit.findById(video.belongUnit);
            const videoClass = await Class.findById(videoUnit.belongClass)
            video['unit'] = videoUnit;
            video['class'] = videoClass
            videosData.push(video)
        }
        res.send(videosData)
    } catch (err) {
        console.log(err)
        res.send('{"error" : "要求失敗", "status" : 500}')
    }
})

// 拿到所有測驗
router.get('/getTests', async function (req, res) {
    try {
        let tests = await Test.find({})
        let testsData = []
        for (let i = 0; i < tests.length; i++) {
            const test = {
                _id: tests[i]._id,
                testName: tests[i].testName,
                testQutions: tests[i].testQutions,
                publicTime: tests[i].publicTime,
                EndpublicTime: tests[i].EndpublicTime,
                isPublic: tests[i].isPublic,
                belongUnit: tests[i].belongUnit

            }
            const testUnit = await Unit.findById(test.belongUnit);
            const testClass = await Class.findById(testUnit.belongClass)
            test['unit'] = testUnit;
            test['class'] = testClass
            testsData.push(test)
        }
        res.send(testsData)
    } catch (err) {
        console.log(err)
        res.send('{"error" : "要求失敗", "status" : 500}')
    }
})


// 取得所有登入紀錄
router.get('/getLoginHistory', async function (req, res) {
    try {
        let history = await LoginHistoty.find({}).sort({ UTCDate: -1 });
        const now = new Date();
        const passDay = req.query.passDay || 7;
        const day = 86400000
        let filteredHistory = []
        for (let i = 0; i < history.length; i++) {
            if (now - history[i].UTCDate < passDay * day) {
                const date = history[i].date.split(',')[0]
                const year = date.split('/')[2]
                const month = date.split('/')[0]
                const day = date.split('/')[1]

                const data = {
                    userId: history[i].userId,
                    date: history[i].date,
                    UTCDate: history[i].UTCDate,
                    action: history[i].action,
                    inClass: history[i].inClass,
                    detail: history[i].detail
                }
                let user = await User.findById(history[i].userId)
                data.user = user
                data.date = year + '/' + month + '/' + day + '/' + ' ' + history[i].date.split(',')[1]
                filteredHistory.push(data)
            } else {
                break;
            }
        }
        res.send(filteredHistory)
    } catch (err) {
        console.log(err)
        res.send('{"error" : "要求失敗", "status" : 500}')
    }
})


// 取得所有程式題目
router.get('/getCodingQutions', function (req, res) {
    CodingQution.find({}, function (err, qutions) {
        if (err) {
            res.status(500).send('{"error" : "要求失敗", "status" : 500}')
        } else {
            res.status(200).json(qutions)
        }
    })
})

// 取得所有程式題標籤
router.get('/getTags', function (req, res) {
    CodeTag.find({}, function (err, tags) {
        if (err) {
            res.status(500).json({ error: "取得失敗！" })
        } else {
            res.status(200).json(tags)
        }
    })
})

// 審核使用者
router.post('/activeUser', async function (req, res) {
    const userId = req.body.userId
    try {
        let user = await User.findByIdAndUpdate(userId, { InActive: false })
        console.log(user)
        mailToTeacher(user.email, `<h3>${user.name} 老師您好:</h3> \n<p>您的帳號已被管理員審核通過！🎉</p>\n<p>現在可開始到平台上建立課程了!</p>\n<a href="${req.protocol + '://' + req.get('host')}">平台連結</a>`)
        res.json({ message: "審核成功" })
    } catch (err) {
        res.status(500).json({ error: "審核失敗" })
    }
})

// 封鎖使用者
router.post('/inActiveUser', async function (req, res) {
    const userId = req.body.userId
    try {
        let result = await User.findByIdAndUpdate(userId, { InActive: true })
        res.json({ message: "封鎖成功" })
    } catch (err) {
        res.status(500).json({ error: "封鎖失敗" })
    }
})

async function mailToTeacher(mail, message) {
    let admins = await User.find({ permission: "admin" })
    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i]
        mailServerInstant.sendMail("nkust.online.study@gmail.com", mail, 'i-Coding學習平臺 教師審核通過通知', message)
    }
}
//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', '請先登入');
        res.redirect('/users/login');
    }
}

module.exports = router;
