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
//bring Test model
let Test = require('../model/test');

const mongoose = require('mongoose');

const config = require('../config/database'); //在我們的config file裡面可以設定要用的database URL
const path = require('path');

//上傳照片
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
//init gfs   
let gfs

mongoose.connect(config.database);
let db = mongoose.connection;


//check connection
db.once('open', function () {
    console.log("connect to mongodb");

    //init Stream
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});

//create storage engine

const storage = new GridFsStorage({
    url: config.database,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});

router.get('/', ensureAuthenticated, function (req, res) {
    Class.find({}, function (err, classes) {
        if (err) {
            console.log(err);
        } else {
            // res.render('class', {
            //     classes: classes
            // });

            gfs.files.find().toArray((err, imgs) => {
                if (!imgs || imgs.length === 0) {
                    res.render('class', {
                        classes: classes,
                        imgs: false
                    });
                } else {
                    imgs.map(img => {
                        if (img.contentType === 'image/jpeg' || img.contentType === "image/png") {
                            img.isImage = true;
                        } else {
                            img.isImage = false;
                        }
                    });

                    res.render('class', {
                        classes: classes
                    });
                }
            })
        }

    });
});

//顯示新增課程介面
router.get('/CreateNewClass', ensureAuthenticated, function (req, res) {
    //確定進入此網址的事不是老師
    if (req.user.permission == "teacher") {
        res.render('CreateNewClass')
    } else {
        req.flash('danger', '您不是老師');
        res.redirect('/');
    }
});

//新增課程資料
router.post('/CreateNewClass', upload.any(), ensureAuthenticated, function (req, res) {
    req.checkBody('title', '課程名稱不得為空').notEmpty();
    // req.checkBody('outline', '課程大綱不得為空').notEmpty();
    // req.checkBody('credit', '學分不得為空').notEmpty();
    // req.checkBody('classroom', '教室不得為空').notEmpty();
    // req.checkBody('chooseClassTime', '上課時間不得為空').notEmpty();
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
        newclass.isLunched = false;
        newclass.classImage = req.files[0].filename
        newclass.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', '新增成功');
                res.redirect('/users/myclass'); //?
            }
        });
        console.log(newclass);

    }
});

//查看課程內容
router.get('/:id', ensureAuthenticated, function (req, res) {
    Class.findById(req.params.id, function (error, classinfo) {
        User.findById(classinfo.teacher, function (error2, teacher) {
            Unit.find({
                belongClass: classinfo._id
            }, function (error3, units) {
                if (error3) {
                    console.log(error3);
                } else {
                    StudebtTakeCourse.find({
                        classID: classinfo._id
                    }, function (error4, thisClassStudents) {
                        if (error4) {
                            console.log(error4);
                        }
                        gfs.files.findOne({
                            filename: classinfo.classImage
                        }, (err, img) => {
                            if (!img || img.length === 0) {
                                res.render('classDashboard', {
                                    id: req.params.id,
                                    classinfo: classinfo,
                                    units: units,
                                    teacher: teacher,
                                    thisClassStudents: thisClassStudents,
                                    img: 'not Image'
                                });
                            } else {
                                if (img.contentType === 'image/jpeg' || img.contentType === "image/png") {
                                    img.isImage = true;
                                } else {
                                    img.isImage = false;
                                }
                                console.log(img);

                                res.render('classDashboard', {
                                    id: req.params.id,
                                    classinfo: classinfo,
                                    units: units,
                                    teacher: teacher,
                                    thisClassStudents: thisClassStudents,
                                    img: img
                                });
                            }
                        })
                    });
                }
            })

        });
    });
});
//@顯示照片的route
router.get('/image/:imageName', (req, res) => {
    gfs.files.findOne({
        filename: req.params.imageName
    }, (err, img) => {
        //check if image exists
        if (!img || img.length === 0) {
            return res.status(404).json({
                err: 'No image exists'
            })
        }
        //check if image
        if (img.contentType === 'image/jpeg' || img.contentType === "image/png") {
            const readstream = gfs.createReadStream(img.filename);
            readstream.pipe(res);
        } else {
            return res.status(404).json({
                err: 'No an image'
            })
        }
    });
})

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
            req.flash('danger', '這堂課不是您開的課');
            res.redirect('/class');
        }

    })

})
//上架課程
router.get('/LunchClass/:cid', function (req, res) {
    Class.findById(req.params.cid, function (err, classinfo) {
        let updateClass = {}
        updateClass.className = classinfo.className
        updateClass.credit = classinfo.credit
        updateClass.classTime = classinfo.classTime
        updateClass.classRoom = classinfo.classRoom
        updateClass.teacher = classinfo.teacher
        updateClass.outline = classinfo.outline
        updateClass.isLunched = true
        let query = {
            _id: classinfo._id
        }
        console.log(updateClass);

        Class.update(query, updateClass, function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', "上架成功！");
            res.redirect('/class/' + req.params.cid);
        })
    })
})

//新增單元
router.get('/:id/addUnit/:unitName', function (req, res) {
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
            newUnit.unitName = req.params.unitName;
            newUnit.belongClass = classId;
            console.log(newUnit);
            newUnit.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/class/classManager/' + req.params.id);
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
                    Test.find({
                        belongUnit: req.params.unitID
                    }, function (err, tests) {
                        if (err) {
                            console.log(err);
                        }
                        res.render('classManger', {
                            id: req.params.id,
                            classinfo: classinfo,
                            units: units,
                            chapters: chapters,
                            unitName: selectUnit,
                            unitID: selectUnitID,
                            videos: videos,
                            tests: tests
                        });
                    })

                });
            });
        })
    });
})

//新增講義
router.post('/unit/addLecture', function (req, res) {
    req.checkBody('title', '講義標題不得為空').notEmpty();
    req.checkBody('body', '講義內容不得為空').notEmpty();
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
        studentCommentChapter.find({
            chapterID: chapter._id
        }, function (err, comments) {
            if (err) {
                console.log(err);
            }
            Unit.findById(chapter.belongUnit, function (err, unit) {
                if (err) {
                    console.log(err);
                }
                Class.findById(unit.belongClass, function (err, classinfo) {
                    res.render('chapter', {
                        chapter: chapter,
                        comments: comments,
                        classinfo: classinfo
                    });
                })
            })

        })

    })
});

//新增影片
router.post('/:unitID/addvideo/:videoName/:videoURLid', function (req, res) {
    let newVideo = new Video();
    newVideo.videoName = req.params.videoName;
    newVideo.videoURL = req.params.videoURLid;
    newVideo.belongUnit = req.params.unitID;
    newVideo.vtime = "";
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
        req.flash('danger', '請先登入');
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

//顯示影片內容
router.get('/showVideo/:id', function (req, res) {
    let query = {
        _id: req.params.id
    }
    Video.findById(query, function (err, video) {
        if (err) {
            console.log(error);
        }
        Unit.findById({
            _id: video.belongUnit
        }, function (err, unit) {
            Class.findById({
                _id: unit.belongClass
            }, function (err, classinfo) {
                if (err) {
                    console.log(err);
                }
                studentCommentVideo.find({
                    videoID: video._id
                }, function (err, comments) {
                    if (err) {
                        console.log(err);
                    }
                    res.render('video', {
                        video: video,
                        comments: comments,
                        classinfo: classinfo
                    });
                });

            })
        });

    })
});

//新增測驗
router.post('/addTest/class/:cid/unit/:uid', function (req, res) {
    console.log(req.body);
    if (req.body.testName == '' || req.body.testName == undefined) {
        res.status(500).send({
            msg: '測驗名稱不得為空'
        });
    } else {
        let newTest = new Test();
        newTest.testName = req.body.testName;
        newTest.testQutions = req.body.QuationList;
        newTest.belongUnit = req.body.belongUnit;
        console.log(newTest);
        newTest.save(function (err) {
            if (err) {
                console.log(err);
            }
            res.json({
                success: 1
            });
        })

    }
});

//刪除測驗
router.delete('/deletetest/:testID', function (req, res) {
    console.log(req.user._id);

    if (!req.user._id) {
        req.flash('danger', '請先登入');
        res.redirect('/');
    }

    let query = {
        _id: req.params.testID
    }
    Test.findById(req.params.testID, function (err, test) {
        Test.remove(query, function (err) {
            if (err) {
                console.log(err);
            }
            res.send('Success');
        })

    })
})

//顯示測驗
router.get('/showTest/:testID', function (req, res) {
    let query = {
        _id: req.params.testID
    }
    Test.findById(query, function (err, test) {
        if (err) {
            console.log(error);
        }
        Unit.findById({
            _id: test.belongUnit
        }, function (err, unit) {
            Class.findById({
                _id: unit.belongClass
            }, function (err, classinfo) {
                if (err) {
                    console.log(err);
                }
                res.render('test', {
                    test: test,
                    classinfo: classinfo
                });
            })
        });

    })

})

//顯示所有有修這堂課的學生
router.get('/showStudentIn/:classID', function (req, res) {

    StudebtTakeCourse.find({
        classID: req.params.classID
    }, function (err, students) {
        if (err) {
            console.log(err);
        }
        let findStudentInfoQuery = [];
        for (let i = 0; i < students.length; i++) {
            findStudentInfoQuery.push(ObjectID(students[i].studentID).toString());
        }
        let query = {
            _id: findStudentInfoQuery
        }
        User.find({
            _id: findStudentInfoQuery
        }, function (err, users) {
            if (err) {
                console.log(err);
            }
            res.render('showStudentInClass', {
                classID: req.params.classID,
                students: users
            })
        });

    })

});
//搜尋課程名稱
router.get('/search/:className', function (req, res) {
    Class.find({}, function (err, classes) {
        if (err) {
            console.log(err);
        } else {
            let searchClassName = req.params.className;
            if (searchClassName == 'null') {
                res.render('class', {
                    classes: classes
                });
            } else {
                let searchedClasses = []
                for (let i = 0; i < classes.length; i++) {
                    if (classes[i].className.includes(searchClassName)) {
                        searchedClasses.push(classes[i]);
                    }
                }
                res.render('class', {
                    classes: searchedClasses
                });
            }
        }

    });
})

//看課程內同學的個人頁面
router.get('/:id/showClassmateInfo/:sid', function (req, res) {
    console.log(req.params.sid);

    User.findById({
        _id: req.params.sid
    }, function (err, student) {
        console.log(student);

        res.render('userinfo', {
            user: student,
            authenticate: false
        })
    });
})
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