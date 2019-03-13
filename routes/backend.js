const express = require('express');
const router = express.Router();
//Bring in User Model
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
//bring codeqution model
let CodeQution = require('../model/codeQution');
//bring studentTakeCourse model
let StudentTakeCourse = require('../model/StudentTakeCourse');
router.get('/', function (req, res) {
    if (req.user.permission != "admin") {
        req.flash('danger', '您不是管理員');
        res.redirect('/');
    }
    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
        }
        Class.find({}, function (err, classes) {
            if (err) {
                console.log(err);
            }
            Unit.find({}, function (err, units) {
                if (err) {
                    console.log(err);
                }
                Chapter.find({}, function (err, chapters) {
                    if (err) {
                        console.log(err);
                    }
                    Video.find({}, function (err, videos) {
                        if (err) {
                            console.log(err);
                        }
                        StudentTakeCourse.find({}, function (err, stc) {
                            if (err) {
                                console.log(err);
                            }
                            res.render('backend', {
                                users: users,
                                classes: classes,
                                units: units,
                                chapters: chapters,
                                videos: videos,
                                stc: stc
                            });
                        })
                    })
                })
            });
        })
    })

});

router.get('/videoBehavior/:id', function (req, res) {
    let videoID = req.params.id;
    let query1 = {
        _id: videoID
    }

    Video.findById(query1, function (err, video) {
        if (err) {
            console.log(err);
        }
        Videobehavior.find({}, function (err, videoBehaviors) {
            if (err) {
                console.log(err);
            }
            let thisvideoBehaviors = [];
            for (let i = 0; i < videoBehaviors.length; i++) {
                if (videoBehaviors[i].videoID == video._id) {
                    thisvideoBehaviors.push(videoBehaviors[i]);
                }
            }
            console.log(thisvideoBehaviors);

            res.render('videoBehavior', {
                video: video,
                videoBehaviors: thisvideoBehaviors
            })
        });

    });
});

router.get('/uploadCodeQution', function (req, res) {
    res.render('uploadCodeingQution')
})
router.post('/uploadCodeQution', function (req, res) {
    //TODO 把題目存進資料庫
    console.log(req.body);
    let newQution = CodeQution();
    newQution.title = req.body.title;
    newQution.description = req.body.description;
    newQution.exInput = req.body.Exinput;
    newQution.exoutput = req.body.Exoutput;
    newQution.url = req.body.qutionURL
    newQution.save(function (err) {
        if (err) {
            console.log(err);
        }
        req.flash('success', '新增成功');
        res.redirect('/backend/uploadCodeQution');
    })
})
module.exports = router;