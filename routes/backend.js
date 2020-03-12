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
let ObjectID = require('mongodb').ObjectID;
//bring EBookData model
let EBookData = require('../model/EBookData');
//bring School model
let School = require('../model/school');

const path = require('path')
//進入後台
router.get('/', function (req, res) {
    if (req.user.permission != "admin") {
        req.flash('danger', '您不是管理員');
        res.redirect('/');
    }

    // 先不開放
    // req.flash('danger', '此功能尚未開放');
    // res.redirect('/');

    // 開放
    router.use(express.static('iCoding_admin'))
    console.log(__dirname)
    res.sendFile(path.resolve(__dirname, '../iCoding_admin', 'index.html'));

});

router.get('/videoBehavior/:id', ensureAuthenticated, function (req, res) {
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
            //console.log(thisvideoBehaviors);

            res.render('videoBehavior', {
                video: video,
                videoBehaviors: thisvideoBehaviors
            })
        });

    });
});

router.get('/uploadCodeQution', ensureAuthenticated, function (req, res) {
    res.render('uploadCodeingQution')
})
router.post('/uploadCodeQution', ensureAuthenticated, function (req, res) {
    //TODO 把題目存進資料庫
    //console.log(req.body);
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
//進入訓練頁面
router.get('/training', function (req, res) {
    res.render('training');
})
//開始訓練
router.post('/getAverage', function (req, res) {
    Videobehavior.find({}, function (err, behaviors) {
        if (err) {
            console.log(err);
        }
        let behaviorsInVideo = {};
        //console.log(behaviors[0]._id in behaviorsInVideo);

        for (let i = 0; i < behaviors.length; i++) {
            if (behaviors[i].videoID in behaviorsInVideo) {
                let key = behaviors[i].videoID
                behaviorsInVideo[key].push(behaviors[i]);
            } else {
                let key = behaviors[i].videoID
                behaviorsInVideo[key] = [];
                behaviorsInVideo[key].push(behaviors[i])
            }
        }
        let videos = []
        for (let k in behaviorsInVideo) {
            videos.push(k);
        }
        // console.log("totole videos = "+videos.length);
        // console.log("videos = ");
        // console.log(videos);

        let querytext = []
        for (let i = 0; i < videos.length; i++) {
            querytext.push(ObjectID(videos[i]).toString())
        }
        //console.log(querytext);

        query = {
            _id: querytext
        }
        Video.find(query, function (err, videosinfo) {
            //console.log(videosinfo);
            let data = []

            for (let i = 0; i < videos.length; i++) {
                //console.log("video " + i +"有" +behaviorsInVideo[videos[i]].length + " 筆紀錄");
                let behaviorRecord = behaviorsInVideo[videos[i]].length; //每一部影片有n筆記路
                let vtime = null;
                for (let j = 0; j < videosinfo.length; j++) {
                    if (videosinfo[j]._id == videos[i]) {
                        vtime = videosinfo[j].vtime
                    }
                }
                if (vtime != null) {
                    //console.log("video " + i +"影片長度是" + vtime);
                    data.push({
                        behaviors: behaviorsInVideo[videos[i]],
                        vtime: vtime
                    })
                }
            }
            let average = []
            for (let i = 0; i < data.length; i++) {
                average[i] = {
                    videoID: data[i].behaviors[0].videoID,
                    start: 0,
                    fastforward: 0,
                    reverse: 0,
                    pause: 0,
                    close: 0,
                    play: 0,
                    note: 0
                }
                let vtime = data[i].vtime;
                let behaviorRecord = data[i].behaviors;
                //start
                let videoTimeLine = [];
                for (let k = 0; k < parseInt(vtime); k++) {
                    videoTimeLine[k] = {
                        start: 0,
                        play: 0,
                        fastforward: 0,
                        reverse: 0,
                        pause: 0,
                        close: 0,
                        note: 0
                    }
                }
                for (let r = 0; r < behaviorRecord.length; r++) { //跑過每一比看影片行為記錄
                    //console.log(behaviorRecord[i]);
                    let videoActions = behaviorRecord[r].videoActions;
                    for (let j = 0; j < videoActions.length; j++) { //跑過每一筆紀錄中的動作
                        //console.log(videoActions[j].split(":"));
                        for (let k = 0; k < parseInt(vtime); k++) { //跑過每一秒
                            let thisAction = videoActions[j].split(":")
                            let nextAction;
                            if (j < videoActions.length - 1) {
                                nextAction = videoActions[j + 1].split(":")
                            } else {
                                nextAction = false
                            }
                            if (thisAction[1] == k) { //在這一秒發生
                                if (thisAction[0] == '0') {
                                    videoTimeLine[k].start += 1
                                } else if (thisAction[0] == 'fastTurn') {
                                    if (parseInt(thisAction[1]) > parseInt(thisAction[2])) {
                                        videoTimeLine[k].reverse += 1
                                    } else {
                                        videoTimeLine[k].fastforward += 1
                                    }
                                } else if (thisAction[0] == 'pause') {
                                    videoTimeLine[k].pause += 1
                                } else if (thisAction[0] == 'close') {
                                    videoTimeLine[k].close += 1
                                } else if (thisAction[0] == 'note') {
                                    videoTimeLine[k].note += 1
                                } else if (thisAction[0] == 'play') {
                                    //console.log("play");

                                    //console.log(thisAction);
                                    //console.log(nextAction);
                                    if (nextAction != false) {
                                        //console.log("have next");
                                        let start = null
                                        let end = null
                                        if (parseInt(nextAction[1]) > parseInt(thisAction[1])) {
                                            end = parseInt(nextAction[1])
                                            start = parseInt(thisAction[1])
                                        }
                                        //console.log(start);
                                        //console.log(end);
                                        if (start != null && end != null) {
                                            for (let q = start; q <= end; q++) {
                                                videoTimeLine[q].play += 1
                                                //console.log(q,videoTimeLine[q]);

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
                let start = [];
                let fastforward = []
                let reverse = []
                let pause = []
                let close = []
                let play = []
                let label = []
                let note = []
                //console.log(videoTimeLine);

                for (let j = 0; j < videoTimeLine.length; j++) {
                    start[j] = videoTimeLine[j].start;
                    fastforward[j] = videoTimeLine[j].fastforward;
                    reverse[j] = videoTimeLine[j].reverse;
                    pause[j] = videoTimeLine[j].pause;
                    close[j] = videoTimeLine[j].close;
                    play[j] = videoTimeLine[j].play;
                    note[j] = videoTimeLine[j].note;
                    label[j] = j
                }
                let step = Math.floor(vtime / 10);

                let splitTimeLine = {
                    start: 0,
                    fastforward: 0,
                    reverse: 0,
                    pause: 0,
                    close: 0,
                    play: 0,
                    note: 0
                }


                for (let k = 0; k < vtime; k++) {
                    splitTimeLine.start += videoTimeLine[k].start;
                    splitTimeLine.fastforward += videoTimeLine[k].fastforward;
                    splitTimeLine.reverse += videoTimeLine[k].reverse;
                    splitTimeLine.pause += videoTimeLine[k].pause;
                    splitTimeLine.close += videoTimeLine[k].close;
                    splitTimeLine.play += videoTimeLine[k].play;
                    splitTimeLine.note += videoTimeLine[k].note;
                }
                let numberofView = data[i].behaviors.length;
                splitTimeLine.start = splitTimeLine.start / numberofView;
                splitTimeLine.fastforward = splitTimeLine.fastforward / numberofView;
                splitTimeLine.reverse = splitTimeLine.reverse / numberofView;
                splitTimeLine.pause = splitTimeLine.pause / numberofView;
                splitTimeLine.close = splitTimeLine.close / numberofView;
                splitTimeLine.play = splitTimeLine.play / numberofView;
                splitTimeLine.note = splitTimeLine.note / numberofView;

                //console.log(`--------第${i}個影片 id = ${data[i].behaviors[0].videoID}  觀看次數${data[i].behaviors.length}----------`);
                //console.log(splitTimeLine);
                average[i].start = splitTimeLine.start;
                average[i].fastforward = splitTimeLine.fastforward;
                average[i].reverse = splitTimeLine.reverse;
                average[i].pause = splitTimeLine.pause;
                average[i].close = splitTimeLine.close;
                average[i].play = splitTimeLine.play;
                average[i].note = splitTimeLine.note;


            }
            //console.log(average);
            res.contentType('application/json');
            res.send(average);
        })
    })
})
router.post('/getSudentAverage', function (req, res) {
    User.find({
        permission: "student"
    }, function (err, allstudent) {
        Videobehavior.find({}, function (err, allVideoBehavior) {
            //console.log(allVideoBehavior);
            let studentWatchVideos = []
            for (let i = 0; i < allstudent.length; i++) {
                studentWatchVideos[i] = {
                    studentID: allstudent[i]._id,
                    behaviors: []
                }
                for (let j = 0; j < allVideoBehavior.length; j++) {
                    if (allstudent[i]._id == allVideoBehavior[j].watcherID) {
                        studentWatchVideos[i].behaviors.push(allVideoBehavior[j])
                    }
                }
            }
            for (let i = 0; i < studentWatchVideos.length; i++) {
                let thisStudent = studentWatchVideos[i];
                //console.log(thisStudent.studentID);
                let thisStudentWatchVideo = []
                for (let j = 0; j < thisStudent.behaviors.length; j++) {
                    if (thisStudentWatchVideo.includes(thisStudent.behaviors[j].videoID)) {

                    } else {
                        thisStudentWatchVideo.push(thisStudent.behaviors[j].videoID);
                    }
                }
                //console.log(thisStudentWatchVideo);

            }

        })
    })
})

//EBookDataLode
router.post('/EBookDataload', function (req, res) {
    let data = req.body;
    let newBookData = new EBookData();
    newBookData.BookImg = data.BookImg;
    newBookData.BookName = data.BookName;
    newBookData.BookSid = data.BookSid;
    newBookData.save(function (err) {
        if (err) {
            console.log(err);
        }
        let progress = 100 * (data.nowIndex / data.Length);
        progress = Math.round(progress);
        if (progress < 10) {
            console.log("█ " + progress + "%");
        } else if (progress < 20) {
            console.log("█ █ " + progress + "%");
        } else if (progress < 30) {
            console.log("█ █ █ " + progress + "%");
        } else if (progress < 40) {
            console.log("█ █ █ █ " + progress + "%");
        } else if (progress < 50) {
            console.log("█ █ █ █ █ " + progress + "%");
        } else if (progress < 60) {
            console.log("█ █ █ █ █ █ " + progress + "%");
        } else if (progress < 70) {
            console.log("█ █ █ █ █ █ █ " + progress + "%");
        } else if (progress < 80) {
            console.log("█ █ █ █ █ █ █ █ " + progress + "%");
        } else if (progress < 90) {
            console.log("█ █ █ █ █ █ █ █ █ " + progress + "%");
        } else {
            console.log("█ █ █ █ █ █ █ █ █ █ " + progress + "%");
        }

        res.send('200');
    });
});


//儲存學校資料
router.post('/saveSchoolData', function (req, res) {
    let data = req.body;
    let school = new School()
    school.schoolName = data.schoolName
    school.collegeName = data.collegeName
    school.departmentName = data.departmentName
    school.departmentCode = data.departmentCode
    school.phone = data.phone
    school.phoneExtension = data.phoneExtension
    school.fax = data.fax
    school.email = data.email
    school.url = data.url
    console.log(school)

    school.save(function (err) {
        if (err) {
            console.log(err)
        }
        res.send('200');
    });

})

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', '請先登入');
        let nextURL = req.originalUrl.replace(new RegExp('/', 'g'), '%2F');
        //console.log("inuser ensure = "+nextURL);
        //console.log("url = /users/login/?r="+nextURL);

        res.redirect('/users/login/?r=' + nextURL);
    }
}
module.exports = router;
