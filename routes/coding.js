const express = require('express');
const router = express.Router();
//bring codeqution model
let CodeQution = require('../model/codeQution');
let CodingSubmitRecord = require('../model/codingSubmitRecord');
let CodeTags = require("../model/codeTags");
//bring login history model
const LoginHistory = require('../model/loginHistory');

router.get('/', ensureAuthenticated, function (req, res) {
    CodeQution.find({}, function (err, qutions) {
        CodingSubmitRecord.find({}, function (err, submitRecord) {
            //console.log(qutions.length);
            //console.log(submitRecord.length);
            for (let i = 0; i < qutions.length; i++) {
                qutions[i].submitTime = 0;
                qutions[i].acceptTime = 0;
                qutions[i].isWritten = "Not";
            }
            //console.log(submitRecord);
            //console.log(req.user._id);

            for (let i = 0; i < qutions.length; i++) {
                for (let j = 0; j < submitRecord.length; j++) {
                    if (qutions[i]._id == submitRecord[j].codingQutionID) {
                        qutions[i].submitTime += 1;
                        if (submitRecord[j].status == "Accepted") {
                            qutions[i].acceptTime += 1;
                        }
                        if (submitRecord[j].submiterID == req.user._id) {
                            if (submitRecord[j].status == "Accepted") {
                                if (qutions[i].isWritten == "Not" || qutions[i].isWritten == "Wrong") {
                                    qutions[i].isWritten = "Right"
                                }
                            }
                            if (submitRecord[j].status == "Wrong Answer" || submitRecord[j].status == "Compile Error") {
                                if (qutions[i].isWritten != "Right") {
                                    qutions[i].isWritten = "Wrong"
                                }
                            }
                        }
                    }
                }
            }
            CodingSubmitRecord.find({
                submiterID: req.user._id
            }, function (err, myRecord) {
                CodeTags.find({},function(err,tags){
                    if(err){
                        console.log(err);
                        
                    }
                    res.render('coding', {
                        qutions: qutions,
                        submitRecord: submitRecord,
                        myRecord: myRecord,
                        tags:tags
                    })
                })
            })
        })
    })
});

//使用者依據標籤分類
router.get('/select/:tagName',ensureAuthenticated,function(req,res){
    CodeQution.find({}, function (err, qutions) {
        let newQutionList = []
        for(let i = 0;i<qutions.length;i++){
            if(qutions[i].tags.indexOf(req.params.tagName)!=-1){
                newQutionList.push(qutions[i])
            }
        }
        qutions = newQutionList;
        //console.log(qutions);
        
        CodingSubmitRecord.find({}, function (err, submitRecord) {
            //console.log(qutions.length);
            //console.log(submitRecord.length);
            for (let i = 0; i < qutions.length; i++) {
                qutions[i].submitTime = 0;
                qutions[i].acceptTime = 0;
                qutions[i].isWritten = "Not";
            }
            //console.log(submitRecord);
            //console.log(req.user._id);

            for (let i = 0; i < qutions.length; i++) {
                for (let j = 0; j < submitRecord.length; j++) {
                    if (qutions[i]._id == submitRecord[j].codingQutionID) {
                        qutions[i].submitTime += 1;
                        if (submitRecord[j].status == "Accepted") {
                            qutions[i].acceptTime += 1;
                        }
                        if (submitRecord[j].submiterID == req.user._id) {
                            if (submitRecord[j].status == "Accepted") {
                                if (qutions[i].isWritten == "Not" || qutions[i].isWritten == "Wrong") {
                                    qutions[i].isWritten = "Right"
                                }
                            }
                            if (submitRecord[j].status == "Wrong Answer" || submitRecord[j].status == "Compile Error") {
                                if (qutions[i].isWritten != "Right") {
                                    qutions[i].isWritten = "Wrong"
                                }
                            }
                        }
                    }
                }
            }
            CodingSubmitRecord.find({
                submiterID: req.user._id
            }, function (err, myRecord) {
                CodeTags.find({},function(err,tags){
                    if(err){
                        console.log(err);
                        
                    }
                    res.render('coding', {
                        qutions: qutions,
                        submitRecord: submitRecord,
                        myRecord: myRecord,
                        tags:tags
                    })
                })
            })
        })
    })
})

//到新增題目頁面
router.get('/createNewCodingQution', ensureAuthenticated, function (req, res) {
    CodeTags.find({},function(err,tags){
        res.render('createNewCodingQution',{
            tags:tags
        });
    })
})

//新增題目
router.post('/addQution', ensureAuthenticated, function (req, res) {
    console.log(req.body);
    let newQuestion = new CodeQution();
    newQuestion.title = req.body.title;
    newQuestion.body = req.body.body;
    newQuestion.testData = req.body.testData;
    newQuestion.tags = req.body.tags;
    //console.log(req.body.testData);
    newQuestion.save(function (err) {
        if (err) {
            res.send('{"error" : "新增失敗", "status" : 500}');
        } else {
            res.send('{"success" : "新增成功", "status" : 200}');
        }
    })
})


//顯示題目
router.get('/showCodingQution/:qutionID', ensureAuthenticated, function (req, res) {
    recordBehavior(req.user._id,"viewCodingQution",req.params.qutionID);
    CodeQution.findById(req.params.qutionID, function (err, qutionData) {
        if (err) {
            console.log(err);

        }
        CodingSubmitRecord.find({
            codingQutionID: qutionData._id,
            submiterID: req.user._id
        }, function (err, submitRecord) {
            if (err) {
                console.log(err);
            }
            res.render('showCodingQution', {
                qutionData: qutionData,
                testData: qutionData.testData,
                submitRecord: submitRecord
            })
        })
    })
})

//儲存使用者提交紀錄
router.post('/saveRecord', ensureAuthenticated, function (req, res) {
    let newRecord = new CodingSubmitRecord();
    newRecord.codingQutionID = req.body.codingQutionID
    newRecord.submiterID = req.body.submiterID
    newRecord.language = req.body.language
    newRecord.memory = req.body.memory
    newRecord.runtime = req.body.runtime
    newRecord.script = req.body.script
    newRecord.status = req.body.status
    newRecord.submitTime = req.body.submitTime
    //console.log(newRecord);
    newRecord.save(function (err) {
        if (err) {
            res.send('{"error" : "儲存失敗", "status" : 500}');
        } else {
            res.send('{"success" : "儲存成功", "status" : 200}');
        }
    })

})


//查看詳細提交紀錄
router.get('/showCodingDetail/:recordID', ensureAuthenticated, function (req, res) {
    recordBehavior(req.user._id,"viewCodingRecord",req.params.recordID);

    CodingSubmitRecord.findById(req.params.recordID, function (err, record) {
        if (err) {
            console.log(err);
        }
        res.render('showCodingDetail', {
            record: record
        })
    })
})



//編輯已提交過的題目
router.post('/editQution', ensureAuthenticated, function (req, res) {
    console.log(req.body.qutionID);
    CodeQution.findById(req.body.qutionID, function (err, qutionData) {
        if (err) {
            console.log(err);
        }
        //console.log("qutionData = ");
        //console.log(qutionData);

        CodingSubmitRecord.find({
            codingQutionID: qutionData._id,
            submiterID: req.user._id
        }, function (err, submitRecord) {
            if (err) {
                console.log(err);
            }
            // console.log(qutionData);
            // console.log(qutionData.testData);
            // console.log(submitRecord);
            res.render('showCodingQution', {
                qutionData: qutionData,
                testData: qutionData.testData,
                submitRecord: submitRecord,
                user: req.user,
                script: req.body.script,
                language: req.body.language
            })
        })
    })
})

//管理員進入編輯標籤頁面
router.get('/editTag',ensureAuthenticated,function(req,res){
    CodeTags.find({},function(err,tags){
        if(err){

        }else{
            if(tags == null){
                tags = {}
            }
            res.render('CodeEditTag',{
                tags:tags
            })
        }
    })
})

//管理員新增標籤
router.post('/addTag',ensureAuthenticated,function(req,res){
    // console.log(req.body.tagName);
    let newTag = new CodeTags();
    newTag.tagName = req.body.tagName;
    newTag.save(function(err){
        console.log(err);
        
        if(err){
            console.log(err);     
        }else{
            res.status(200).json({
                message: '新增成功'
            });
        }
    })
    
})

//管理員刪除標籤
router.post('/deleteTag',ensureAuthenticated,function(req,res){
    // console.log(req.body.id);
    CodeTags.remove({_id:req.body.id},function(err){
        if(err){
            console.log(err);     
        }else{
            res.status(200).json({
                message: '刪除成功'
            });
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
      //console.log("inuser ensure = "+nextURL);
      //console.log("url = /users/login/?r="+nextURL);
      
      res.redirect('/users/login/?r='+nextURL);
    }
}

//紀錄行為
function recordBehavior(userId,action,detail){
    let loginHistory = new LoginHistory();
    loginHistory.userId = userId;
    loginHistory.action = action;
    loginHistory.detail = detail;
    loginHistory.save(function(err){
        if(err){
            console.log(err)
        }
    })
}
module.exports = router;