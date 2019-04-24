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
//bring note model
let Note = require('../model/note')
//bring studentWatchChapter modal
let studentWatchChapter = require('../model/studentWatchChapter');

//拿到單元內影片
router.get('/getVideoInUnit/:unitID', function (req, res) {
    Video.find({
        belongUnit: req.params.unitID
    }, function (err, videos) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            console.log(videos);

            studentCommentVideo.find({}, function (err, comments) {
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                } else {
                    Videobehavior.find({}, function (err, behaviors) {
                        if (err) {
                            res.send('{"error" : "要求失敗", "status" : 500}');
                        } else {
                            processArray(videos, comments, behaviors).then(function (videoinfo) {
                                res.send(`{"videos" : ${JSON.stringify(videoinfo)}} `);
                            });
                        }
                    })
                }
            })
        }
    })
})
async function processArray(videos, comments, behaviors) {
    let data = await append(videos, comments, behaviors)
    return data
}

function append(videos, comments, behaviors) {
    for (let i = 0; i < videos.length; i++) {
        videos[i].comments = [];
    }
    let data = []
    for (let i = 0; i < videos.length; i++) {
        videosinfo = {
            belongUnit: videos[i].belongUnit,
            videoName: videos[i].videoName,
            videoURL: videos[i].videoURL,
            vtime: videos[i].vtime,
            postTime: videos[i].postTime,
            _id: ObjectID(videos[i]._id).toString(),
            comments: [],
            watchTime: 0
        }
        for (let j = 0; j < comments.length; j++) {
            if (videos[i].id == comments[j].videoID) {
                videos[i].comments.push(comments[j].body);
                videosinfo.comments.push(comments[j].body)
            }
        }
        data.push(videosinfo)
    }

    for (let i = 0; i < data.length; i++) {
        for (j = 0; j < behaviors.length; j++) {
            console.log(data[i]._id, behaviors[j].videoID);

            if (data[i]._id == behaviors[j].videoID) {
                data[i].watchTime++;
            }
        }
    }
    return data
}

//刪除單元
router.post('/deleteUnit/:unitID',function(req,res){
    Unit.remove({_id:req.params.unitID},function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//send影片資訊
router.get('/getVideoInfo/:videoID', function (req, res) {
    Video.findById(req.params.videoID, function (err, videoinfo) {
        Videobehavior.find({
            videoID: videoinfo._id
        }, function (err, behaviors) {
            if (err) {
                res.send('{"error" : "要求失敗", "status" : 500}');
            } else {
                res.send(`{"videoinfo" : ${JSON.stringify(videoinfo)},"behaviors":${JSON.stringify(behaviors)} }`);
            }
        })
    })
})

//send影片detial
router.get('/getVideoDetial/:videoID', function (req, res) {
    Video.findById(req.params.videoID, function (err, videoinfo) {
        Videobehavior.find({
            videoID: videoinfo._id
        }, function (err, behaviors) {
            let watchers = []
            for (let i = 0; i < behaviors.length; i++) {
                if (watchers.indexOf(ObjectID(behaviors[i].watcherID).toString()) == -1) {
                    watchers.push(ObjectID(behaviors[i].watcherID).toString())
                }
            }
            query = {
                _id: watchers
            }
            User.find(query, function (err, watchersInfo) {
                Unit.findById({
                    _id: videoinfo.belongUnit
                }, function (err, Unit) {
                    Class.findById({
                        _id: Unit.belongClass
                    }, function (err, ClassInfo) {
                        let videoName = videoinfo.videoName;
                        let videoWatchTime = behaviors.length;
                        let videoTime = parseInt(videoinfo.vtime);
                        let belongUnit = Unit;
                        let belongClass = ClassInfo;
                        let watchersNumber = watchersInfo.length;
                        let data = {
                            "videoName": videoName,
                            "videoWatchTime": videoWatchTime,
                            "videoTime": videoTime,
                            "watchersInfo": watchersInfo,
                            "belongUnit": belongUnit,
                            "belongClass": belongClass,
                            "watchersNumber": watchersNumber
                        }
                        console.log(data);
                        res.send(`[{
                            "videoName":${JSON.stringify(videoName)},
                            "videoWatchTime":"${JSON.stringify(videoWatchTime)}",
                            "videoTime":"${JSON.stringify(videoTime)}",
                            "watchersNumber":"${JSON.stringify(watchersNumber)}"
                        },
                        ${JSON.stringify(watchersInfo)}
                        ,
                        ${JSON.stringify(belongUnit)}
                        ,
                        ${JSON.stringify(belongClass)}
                        ]`);
                    });
                })
            })
        })
    })
})

//send影片留言
router.get('/getVideoComment/:videoID', function (req, res) {
    studentCommentVideo.find({
        videoID: req.params.videoID
    }, function (err, comments) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.send(`{"comments" : ${JSON.stringify(comments)}}`);
        }
    })
})

//delete影片
router.post('/deleteVideo/:videoID',function(req,res){
    Video.remove({_id:req.params.videoID},function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//send講義資訊
router.get('/getChapterInUnit/:chapterID', function (req, res) {
    Chapter.find({
        belongUnit: req.params.chapterID
    }, function (err, chapters) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            console.log(chapters);

            studentCommentChapter.find({}, function (err, comments) {
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                } else {
                    // processArray(chapters, comments, {}).then(function (chapterinfo) {
                    //     console.log("------------");
                    //     console.log(chapterinfo);
                    // });
                    res.send(`{"chapter" : ${JSON.stringify(chapters)},"comment":${JSON.stringify(comments)}} `);
                }
            })
        }
    })
})

//rename講義名稱
router.post('/renameChapter/:chapterID',function(req,res){
    let myquery = { _id: req.params.chapterID };
    let newvalues = { $set: {chapterName: req.body.chapterName} };
    Chapter.updateOne(myquery,newvalues,function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "更改失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//delete講義
router.post('/deleteChapter/:chapterID',function(req,res){
    Chapter.remove({_id:req.params.chapterID},function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})


//rename講義名稱
router.post('/renameTest/:testID',function(req,res){
    let myquery = { _id: req.params.testID };
    let newvalues = { $set: {testName: req.body.testName} };
    Test.updateOne(myquery,newvalues,function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "更改失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//delete測驗
router.post('/deleteTest/:testID',function(req,res){
    Test.remove({_id:req.params.testID},function(err){
        if(err){
            console.log(err);
            res.send('{"error" : "刪除失敗", "status" : 500}');
        }else{
            res.send('{"success" : "儲存成功"}');
        }
    })
})

//send測驗資訊
router.get('/getTestInUnit/:chapterID', function (req, res) {
    Test.find({
        belongUnit: req.params.chapterID
    }, function (err, tests) {
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            res.send(`{"tests" : ${JSON.stringify(tests)}} `);
        }
    })
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