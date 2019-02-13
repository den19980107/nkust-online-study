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

router.get('/', ensureAuthenticated, function (req, res) {
    Class.find({}, function (err, classes) {
        if (err) {
            console.log(err);
        } else {
            res.render('class', {
                classes: classes
            });
        }

    });
});

//顯示新增課程介面
router.get('/CreateNewClass', ensureAuthenticated, function (req, res) {
    //確定進入此網址的事不是老師
    if (req.user.permission == "teacher") {
        res.render('CreateNewClass')
    } else {
        req.flash('danger', 'you are not teacher');
        res.redirect('/');
    }
});

//新增課程資料
router.post('/CreateNewClass', ensureAuthenticated, function (req, res) {
    req.checkBody('title', '課程名稱不得為空').notEmpty();
    req.checkBody('outline', '課程大綱不得為空').notEmpty();
    req.checkBody('credit', '學分不得為空').notEmpty();
    req.checkBody('classroom', '教室不得為空').notEmpty();
    req.checkBody('chooseClassTime', '上課時間不得為空').notEmpty();
    console.log(req.body.chooseClassTime);

    let errors = req.validationErrors();
    if (errors) {
        res.render('CreateNewClass', {
            user: req.user,
            errors: errors
        })
    } else {
        let newclass = new Class();
        newclass.className = req.body.title;
        newclass.outline = req.body.outline;
        newclass.credit = req.body.credit;
        newclass.classRoom = req.body.classroom;
        newclass.classTime = req.body.chooseClassTime;
        newclass.teacher = req.user._id;

        newclass.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', '新增成功');
                res.redirect('/class'); //?
            }
        });
        console.log(newclass);

    }
});

//查看課程內容
router.get('/:id', function (req, res) {
    Class.findById(req.params.id, function (error, classinfo) {
        User.findById(classinfo.teacher, function (error2, teacher) {
            Unit.find({
                belongClass: classinfo._id
            }, function (error3, units) {
                if (error2) {
                    console.log(error3);
                } else {
                    res.render('classDashboard', {
                        id: req.params.id,
                        classinfo: classinfo,
                        units: units,
                        teacher: teacher
                    });
                }
            })

        });
    });
});

//管理課程內容
router.get('/classManager/:id', function (req, res) {
    Class.findById(req.params.id, function (error, classinfo) {
        Unit.find({
            belongClass: classinfo._id
        }, function (error2, units) {
            res.render('classManger', {
                id: req.params.id,
                classinfo: classinfo,
                units: units
            });
        })

    });
});


//刪除課程
router.get('/deleteCourse/:id', function (req, res) {
    Class.findById(req.params.id, function (error, classinfo) {
        let query = {
            _id: req.params.id
        }
        if (classinfo.teacher == req.user.id) { //確認課程的創立人是否等於發出要求的使用者
            Class.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                req.flash('success', '刪除成功');
                res.redirect('/class');
            })
        } else {
            req.flash('danger', 'not your course');
            res.redirect('/class');
        }

    })

})

//新增單元
router.post('/:id/addUnit', function (req, res) {
    //確認是否登入
    if (!req.user._id) {
        res.status(500).send();
    }
    let classId = req.params.id;

    Class.findById(classId, function (err, classinfo) {
        if (err) {
            console.log(err);
        }
        //確認此課程是否為此user的
        if (classinfo.teacher != req.user._id) {
            console.log("不是老師");
        } else {
            let newUnit = new Unit();
            newUnit.unitName = req.body.unitname;
            newUnit.belongClass = classId;
            console.log(newUnit);
            newUnit.save(function (err) {
                if (err) {
                    res.send('error');
                } else {
                    res.send('success');
                }
            })

        }
    })


});

//刪除單元
router.get('/classManager/:classID/deleteUnit/:UnitID', function (req, res) {
    let query = {
        _id: ObjectID(req.params.UnitID)
    }
    Unit.remove(query, function (error, unit) {
        if (error) {
            console.log(error);
        } else {
            req.flash("success", "刪除成功");
            res.redirect('/class/classManager/' + req.params.classID)
        }
    });

})

//顯示單元內容
router.get('/:classID/showUnit/:unitID', function (req, res) {
    Class.findById(req.params.classID, function (error, classinfo) {
        Unit.find({
            belongClass: classinfo._id
        }, function (error2, units) {
            let selectUnit = "";
            let selectUnitID = "";
            for (let i = 0; i < units.length; i++) {
                if (units[i]._id == req.params.unitID) {
                    selectUnit = units[i].unitName;
                    selectUnitID = units[i]._id;
                }
            }
            Chapter.find({
                belongUnit: req.params.unitID
            }, function (error3, chapters) {
                Video.find({
                    belongUnit: req.params.unitID
                }, function (error4, videos) {
                    res.render('classManger', {
                        id: req.params.id,
                        classinfo: classinfo,
                        units: units,
                        chapters: chapters,
                        unitName: selectUnit,
                        unitID: selectUnitID,
                        videos: videos
                    });
                });
            });
        })
    });
})

//新增講義
router.post('/unit/addLecture', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        req.flash('danger', "講義標題與內容不得為空");
        res.redirect('/class/' + req.body.classID + '/showUnit/' + req.body.unitID);
    } else {
        let chapter = new Chapter();
        chapter.chapterName = req.body.title;
        chapter.belongUnit = req.body.unitID;
        chapter.body = req.body.body;
        chapter.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', "新增成功");
                res.redirect('/class/' + req.body.classID + '/showUnit/' + req.body.unitID);
            }
        });

    }
})

//刪除講義
router.delete('/deletechapter/:chapterID', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.chapterID
    }

    Chapter.findById(req.params.chapterID, function (err, article) {

        Chapter.remove(query, function (err) {
            if (err) {
                console.log(err);
            }
            res.send('Success');
        })

    })
})

//顯示講義內容
router.get('/showChapter/:id', function (req, res) {
    let query = {
        _id: req.params.id
    }
    Chapter.findById(query, function (err, chapter) {
        if (err) {
            console.log(error);
        }
        res.render('chapter', {
            chapter: chapter
        });
    })
});

//新增影片
router.post('/:unitID/addvideo/:videoName/:videoURLid', function (req, res) {
    let newVideo = new Video();
    newVideo.videoName = req.params.videoName;
    newVideo.videoURL = req.params.videoURLid;
    newVideo.belongUnit = req.params.unitID;
    console.log(newVideo);

    newVideo.save(function (err) {
        if (err) {
            res.send('error');
        } else {
            res.send('success');
        }
    });
});

//刪除影片
router.delete('/deletevideo/:videoID', function (req, res) {
    console.log(req.user._id);

    if (!req.user._id) {
        req.flash('danger', 'please login');
        res.redirect('/');
    }

    let query = {
        _id: req.params.videoID
    }
    Video.findById(req.params.videoID, function (err, article) {

        Video.remove(query, function (err) {
            if (err) {
                console.log(err);
            }
            res.send('Success');
        })

    })
});

//顯示講義內容
router.get('/showVideo/:id', function (req, res) {
    let query = {
        _id: req.params.id
    }
    Video.findById(query, function (err, video) {
        if (err) {
            console.log(error);
        }
        res.render('video', {
            video: video
        });
    })
});
router.post

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports = router;