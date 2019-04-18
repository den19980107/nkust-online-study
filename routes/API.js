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


//拿到單元內影片
router.get('/getVideoInUnit/:unitID',function(req,res){
    Video.find({belongUnit:req.params.unitID},function(err,videos){
        if (err) {
            res.send('{"error" : "要求失敗", "status" : 500}');
        } else {
            console.log(videos);
            
            studentCommentVideo.find({},function(err,comments){
                if (err) {
                    res.send('{"error" : "要求失敗", "status" : 500}');
                }else{
                    Videobehavior.find({},function(err,behaviors){
                        if (err) {
                            res.send('{"error" : "要求失敗", "status" : 500}');
                        }else{
                            processArray(videos,comments,behaviors).then(function(videoinfo){
                                res.send(`{"videos" : ${JSON.stringify(videoinfo)}} `);
                            });
                        }
                    })
                } 
            })
        }
    })
})
async function processArray(videos,comments,behaviors) {
    let data = await append(videos,comments,behaviors)
    return data
}
function append(videos,comments,behaviors) {
    for(let i = 0;i<videos.length;i++){
        videos[i].comments = [];
    }
    let data = []
    for(let i = 0;i<videos.length;i++){
        videosinfo = {
            belongUnit:videos[i].belongUnit,
            videoName: videos[i].videoName,
            videoURL: videos[i].videoURL,
            vtime: videos[i].vtime,
            postTime:videos[i].postTime,
            _id:ObjectID(videos[i]._id).toString(),
            comments:[],
            watchTime:0
        }
        for(let j = 0;j<comments.length;j++){
            if(videos[i].id == comments[j].videoID){
                videos[i].comments.push(comments[j].body);
                videosinfo.comments.push(comments[j].body)
            }
        }
        data.push(videosinfo)
    }

    for(let i = 0;i<data.length;i++){
        for(j=0;j<behaviors.length;j++){
            console.log(data[i]._id,behaviors[j].videoID);
            
            if(data[i]._id == behaviors[j].videoID){
                data[i].watchTime++;
            }
        }
    }
    return data
}

//send影片資訊
router.get('/getVideoInfo/:videoID',function(req,res){
    Video.findById(req.params.videoID,function(err,videoinfo){
        Videobehavior.find({videoID:videoinfo._id},function(err,behaviors){
            if (err) {
                res.send('{"error" : "要求失敗", "status" : 500}');
            } else {
                res.send(`{"videoinfo" : ${JSON.stringify(videoinfo)},"behaviors":${JSON.stringify(behaviors)} }`);
            }
        })
    })
})

//send影片留言
router.get('/getVideoComment/:videoID',function(req,res){
    studentCommentVideo.find({videoID:req.params.videoID},function(err,comments){
        if(err){
            res.send('{"error" : "要求失敗", "status" : 500}');
        }else{
            res.send(`{"comments" : ${JSON.stringify(comments)}}`);
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