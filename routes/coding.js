const express = require('express');
const router = express.Router();
//bring codeqution model
let CodeQution = require('../model/codeQution');
let CodingSubmitRecord = require('../model/codingSubmitRecord')
router.get('/', ensureAuthenticated, function (req, res) {
    CodeQution.find({}, function (err, qutions) {
        CodingSubmitRecord.find({}, function (err, submitRecord) {
            console.log(qutions.length);
            console.log(submitRecord.length);
            for (let i = 0; i < qutions.length; i++) {
                qutions[i].submitTime = 0;
                qutions[i].acceptTime = 0;
                qutions[i].isWritten = "Not";
            }
            console.log(submitRecord);
            console.log(req.user._id);

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
                res.render('coding', {
                    qutions: qutions,
                    submitRecord: submitRecord,
                    myRecord: myRecord
                })
            })
        })
    })
});

//到新增題目頁面
router.get('/createNewCodingQution', ensureAuthenticated, function (req, res) {
    res.render('createNewCodingQution');
})

//新增題目
router.post('/addQution', ensureAuthenticated, function (req, res) {
    console.log(req.body);
    let newQuestion = new CodeQution();
    newQuestion.title = req.body.title;
    newQuestion.body = req.body.body;
    newQuestion.testData = req.body.testData;
    console.log(req.body.testData);
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
    console.log(newRecord);
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
        console.log("qutionData = ");
        console.log(qutionData);

        CodingSubmitRecord.find({
            codingQutionID: qutionData._id,
            submiterID: req.user._id
        }, function (err, submitRecord) {
            if (err) {
                console.log(err);
            }
            console.log(qutionData);
            console.log(qutionData.testData);
            console.log(submitRecord);
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