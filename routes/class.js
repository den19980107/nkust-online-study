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
//bring studentWatchChapter modal
let studentWatchChapter = require('../model/studentWatchChapter');
//bring note model
let Note = require('../model/note');
//bring RFM model
let RFM = require('../model/RFM');
//bring EBookData model
let EBookData = require('../model/EBookData');
//bring classEBook model
let classEBook = require('../model/classEBook');
//寄email的工具
var nodemailer = require('nodemailer');

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


//TODO 把前端切換頁面做完
//一個頁面最多多少個課程
let maxClassInPage = 8;

//顯示所有課程
router.get('/', ensureAuthenticated, function (req, res) {
  Class.find({}, function (err, classes) {
    classes = classes.reverse(); //讓最新課的排在最前面
    //console.log(classes);
    let totalPage = Math.ceil(classes.length / maxClassInPage);
    let allClass = [];
    let classIMG = [];
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].isLunched == true) {
        console.log(classes[i].isLunched);
        if (allClass.length < maxClassInPage) {
          allClass.push(classes[i])
        }
        if (classes[i].classImage != undefined) {
          classIMG.push(classes[i].classImage)
        }
      }
    }
    //console.log(allClass);
    //console.log(classIMG);

    if (err) {
      //console.log(err);
    } else {
      // res.render('class', {
      //     classes: classes
      // });

      gfs.files.find({
        filename: {
          $in: classIMG
        }
      }).toArray((err, imgs) => {
       // console.log(imgs);

        if (!imgs || imgs.length === 0) {
          res.render('class', {
            classes: allClass,
            imgs: false,
            page: "1",
            totalPage: totalPage
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
            classes: allClass,
            page: "1",
            totalPage: totalPage
          });
        }
      })
    }

  });
});

//顯示所有課程with page
router.get('/page/:page', ensureAuthenticated, function (req, res) {
  //console.log(req.params.page);
  let page = req.params.page - 1;
  Class.find({}, function (err, classes) {
    classes = classes.reverse(); //讓最新課的排在最前面
    //console.log(classes);
    let totalPage = Math.ceil(classes.length / maxClassInPage);
    let allClass = [];
    let classIMG = [];
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].isLunched == true) {
        //console.log(classes[i].isLunched);
        allClass.push(classes[i])
        if (classes[i].classImage != undefined) {
          classIMG.push(classes[i].classImage)
        }
      }
    }
    let sendClass = []
    for (let i = 0; i < allClass.length; i++) {
      if (i > page * maxClassInPage - 1 && sendClass.length < maxClassInPage) {
        sendClass.push(allClass[i])
      }
    }
    //console.log("-------------");

    //console.log(sendClass);
    //console.log(classIMG);

    if (err) {
      console.log(err);
    } else {
      // res.render('class', {
      //     classes: classes
      // });

      gfs.files.find({
        filename: {
          $in: classIMG
        }
      }).toArray((err, imgs) => {
        //console.log(imgs);

        if (!imgs || imgs.length === 0) {
          res.render('class', {
            classes: sendClass,
            imgs: false,
            page: page + 1,
            totalPage: totalPage
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
            classes: sendClass,
            page: page + 1,
            totalPage: totalPage
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
  //console.log(req);

  let errors = req.validationErrors();
  if (errors) {
    res.render('CreateNewClass', {
      user: req.user,
      title: req.body.title,
      outline: req.body.outline,
      credit: req.body.credit,
      classroom: req.body.classroom,
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
    if (req.files.length > 0) {
      newclass.classImage = req.files[0].filename
    } else {

    }
    newclass.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', '建立課程成功');
        res.redirect('/users/myclass'); //?
      }
    });
    //console.log(newclass);

  }
});

//換課程封面照片
router.post('/changeClassImg/:classID', upload.any(), ensureAuthenticated,function(req,res){
  console.log(req.files)
  if (req.files.length > 0) {
    let classImage = req.files[0].filename;
    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        classImage: classImage
      }
    };
    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(req.params.classID)
        res.redirect('/class/'+req.params.classID);
      }
    });
  }

})

//查看課程內容
router.get('/:id', ensureAuthenticated, function (req, res) {
  //console.log("in");
  Class.findById(req.params.id, function (error, classinfo) {
    if (error) {
      res.render('notExist', {
        title: "喔喔！此課程不存在...",
        message: "此課程有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
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
                  //console.log(img);

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
    }
  });
});
//@顯示照片的route
router.get('/image/:imageName', ensureAuthenticated, (req, res) => {
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
router.get('/classManager/:id', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.id, function (error, classinfo) {
    if (error) {
      res.render('notExist', {
        title: "喔喔！此課程不存在...",
        message: "此課程有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Unit.find({
        belongClass: classinfo._id
      }, function (error2, units) {
        StudebtTakeCourse.find({
          classID: req.params.id
        }, function (err, thisClassStudents) {
          if (err) {
            console.log(err);
          }
          res.render('classManger', {
            id: req.params.id,
            classinfo: classinfo,
            units: units,
            noSelectUnit: true,
            thisClassStudents: thisClassStudents
          });
        })
      })
    }
  });
});
//新版管理課程內容
router.get('/newclassManager/:id', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.id, function (error, classinfo) {
    //console.log(classinfo);
    if (error) {
      res.render('notExist', {
        title: "喔喔！此課程不存在...",
        message: "此課程有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Unit.find({
        belongClass: classinfo._id
      }, function (error2, units) {
        classEBook.find({classId:req.params.id,belongUnit:units},function(err1,classEBooks){
          if (err1) {
            console.log(err1);
          }
          StudebtTakeCourse.find({
            classID: req.params.id
          }, function (err, thisClassStudents) {
            if (err) {
              console.log(err);
            }
            res.render('newClassManager', {
              id: req.params.id,
              classinfo: classinfo,
              units: units,
              thisClassStudents: thisClassStudents,
              classEBooks:classEBooks
            });
          });
        });
      })
    }
  });
});

//getEbookData
router.get('/getEbookData/:page', ensureAuthenticated, function (req, res) {
  let page = req.params.page;
  let nowPage = "" ;
  for(let i = 4;i < page.length;i++){
    nowPage += page[i];
  }
  EBookData.find({},function(error,EBooks){
    if(error){
      res.status(500).send("find error!")
    }
    let totalpage = Math.ceil(EBooks.length/10);
    let wanttoreturndata = [];
    for(let i = 0 ;i < EBooks.length; i++){
      if(Math.ceil((i+1)/10) == nowPage){
        wanttoreturndata.push(ObjectID(EBooks[i]._id).toString());
      }
    }
    EBookData.find({ _id:wanttoreturndata},function(error2,EBookarray){
      if(error2){
        res.status(500).send("find error2!");
      }
      console.log(nowPage);
      res.status(200).send(`{"EBookarray" : ${JSON.stringify(EBookarray)},"nowpage" : ${nowPage},"totalpage" : ${totalpage}} `);
    });
  });
});

//saveEbookData
router.post('/saveEbookData/:UnitID/:EBookID', ensureAuthenticated, function (req, res) {
  let UnitID = req.params.UnitID;
  let EBookID = ObjectID(req.params.EBookID).toString();

  classEBook.findOne({
    BookID: EBookID,
    belongUnit: UnitID
  }, function (err, classEBooks) {
    if (err) {
      console.log(err);
      res.status(500).send("find error!");
    }
    if (classEBooks) {
      res.status(200).send("already exist!");
      //已經有了
    } else {
      EBookData.findOne({_id: EBookID},function(error,EBook){
        if(error){
          res.status(500).send("find error!");
        }
        let addclassEBook = new classEBook();
        addclassEBook.BookName = EBook.BookName;
        addclassEBook.BookImg = EBook.BookImg;
        addclassEBook.BookID = EBookID;
        addclassEBook.belongUnit = UnitID;
        addclassEBook.save(function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("save error!");
          }
          res.status(200).send("save success!");
        });
      });
    }
  });

});

//刪除EBook
router.post('/deleteEbookData/:UnitID/:EBookID',function (req, res){
  console.log("deleteEbookdata",req.params.UnitID,req.params.EBookID);

  classEBook.findOne({
    BookID: req.params.EBookID,
    belongUnit: req.params.UnitID
  },function(err,EBook){
    console.log(EBook);
    let query = {
      _id: EBook._id
    }
    classEBook.remove(query,function(err){
      if(err){
        res.status(500).send("delete error!");
      }
      res.status(200).send("delete success!");
    });
  });
});

//搜尋EBook
router.get('/searchEbook/:searchkeyword/:page',  ensureAuthenticated, function (req, res){
  let page = req.params.page;
  let nowPage = "" ;
  for(let i = 4;i < page.length;i++){
    nowPage += page[i];
  }
  let searchkeyword = req.params.searchkeyword;
  EBookData.find({},function(error,EBooks){
    let searchtoEBook = EBooks.filter(function (item) {
      return item.BookName.toLowerCase().match(searchkeyword.toLowerCase()) == searchkeyword.toLowerCase();
    });
    if(searchtoEBook.length == 0){
      res.status(200).send("No Find Book!")
    }
    let totalpage = Math.ceil(searchtoEBook.length/10);
    let EBookarray = [];
    for(let i = (nowPage-1)*10;i < nowPage*10;i++){
      if(searchtoEBook[i] == undefined){
        break;
      }
      EBookarray.push(searchtoEBook[i]);
    }
    console.log(EBookarray);
    res.status(200).send(`{"EBookarray" : ${JSON.stringify(EBookarray)},"nowpage" : ${nowPage},"totalpage" : ${totalpage}} `);
  });
});

//刪除課程
router.get('/deleteCourse/:id', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.id, function (error, classinfo) {
    if (error) {
      res.render('notExist', {
        title: "喔喔！此課程不存在...",
        message: "此課程有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      let query = {
        _id: req.params.id
      }
      if (classinfo.teacher == req.user.id) { //確認課程的創立人是否等於發出要求的使用者
        Class.remove(query, function (err) {
          if (err) {
            console.log(err);
          }
          req.flash('success', '刪除成功');
          res.redirect('/users/myclass');
        })
      } else {
        req.flash('danger', '這堂課不是您開的課');
        res.redirect('/class');
      }
    }
  })

})
//上架課程
router.get('/LunchClass/:cid', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.cid, function (err, classinfo) {
    if (err) {
      res.render('notExist', {
        title: "喔喔！此課程不存在...",
        message: "此課程有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
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
      //console.log(updateClass);

      Class.update(query, updateClass, function (err) {
        if (err) {
          console.log(err);
        }
        req.flash('success', "上架成功！");
        res.redirect('/class/' + req.params.cid);
      })
    }
  })
})

//修改課程資訊
router.post('/updateClassInfo/:classID/:part/:text', ensureAuthenticated, function (req, res) {
  //console.log(req.params.classID, req.params.part, req.params.text);
  if (req.params.part == 'title') {
    //console.log("intitle");

    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        className: req.params.text
      }
    };
    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('更新課程名稱失敗！');

      } else {
        //console.log('update success');
        res.status(200).send('更新課程名稱成功！');
      }
    });
  }
  if (req.params.part == 'outline') {
   // console.log(req.body);

    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        outline: req.body.outline
      }
    };
    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('更新課程說明失敗！');

      } else {
        //console.log('update success');
        res.status(200).send('更新課程說明成功！');
      }
    });
  }
  if (req.params.part == 'classTime') {
    console.log(req.body);

    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        classTime: req.body
      }
    };
    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('更新課程上課時間失敗！');

      } else {
        //console.log('update success');
        res.status(200).send('更新課程上課時間成功！');
      }
    });
  }

  if (req.params.part == "classRoom") {
    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        classRoom: req.params.text
      }
    };
    //console.log(newvalues);

    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('更新課程上課教室失敗！');

      } else {
        //console.log('update success');
        res.status(200).send('更新課程上課教室成功！');
      }
    });
  }

  if (req.params.part == "credit") {
    var myquery = {
      _id: ObjectID(req.params.classID)
    };
    var newvalues = {
      $set: {
        credit: req.params.text
      }
    };
    Class.updateOne(myquery, newvalues, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send('更新課程學分失敗！');

      } else {
        //console.log('update success');
        res.status(200).send('更新課程學分成功！');
      }
    });
  }


});


//新增單元
router.get('/:id/addUnit/:unitName', ensureAuthenticated, function (req, res) {
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
    // if (classinfo.teacher != req.user._id) {
    //   console.log("不是老師");
    // } else {
    let newUnit = new Unit();
    newUnit.unitName = req.params.unitName;
    newUnit.belongClass = classId;
    //console.log(newUnit);
    newUnit.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/class/newClassManager/' + req.params.id);
      }
    })

    // }
  })


});

//刪除單元
router.get('/classManager/:classID/deleteUnit/:UnitID', ensureAuthenticated, function (req, res) {
  let query = {
    _id: ObjectID(req.params.UnitID)
  }
  Unit.remove(query, function (error, unit) {
    if (error) {
      res.render('notExist', {
        title: "喔喔！此單元不存在...",
        message: "此單元有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      req.flash("success", "刪除成功");
      res.redirect('/class/classManager/' + req.params.classID)
    }
  });

})

//顯示單元內容
router.get('/:classID/showUnit/:unitID', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (error, classinfo) {
    if (error) {
      res.render('notExist', {
        title: "喔喔！此單元不存在...",
        message: "此單元有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
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
              Homework.find({
                belongUnit: req.params.unitID
              }, function (err, homeworks) {
                if (err) {
                  console.log(err);
                }
                //console.log(homeworks);

                studntSubmitTest.find({}, function (err, TestSubmitRecords) {
                  if (err) {
                    console.log(err);
                  }
                  //console.log(TestSubmitRecords);
                  //console.log(tests);
                  //console.log("start");
                  for (let i = 0; i < TestSubmitRecords.length; i++) {
                    for (let j = 0; j < tests.length; j++) {
                      if (TestSubmitRecords[i].writer == req.user._id) {
                        if (TestSubmitRecords[i].testID == tests[j]._id) {
                          tests[j].isComplete = true
                        }
                      }
                    }
                  }
                  studntSubmitHomework.find({}, function (err, HomeworkSubmitRecords) {
                    for (let i = 0; i < HomeworkSubmitRecords.length; i++) {
                      for (let j = 0; j < homeworks.length; j++) {
                        if (HomeworkSubmitRecords[i].writer == req.user._id) {
                          if (HomeworkSubmitRecords[i].homeworkID == homeworks[j]._id) {
                            homeworks[j].isComplete = true
                          }
                        }
                      }
                    }
                    StudebtTakeCourse.find({
                      classID: req.params.classID
                    }, function (err, thisClassStudents) {
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
                        tests: tests,
                        homeworks: homeworks,
                        thisClassStudents: thisClassStudents
                      });
                    });


                  })
                })

              })

            })

          });
        });
      })
    }
  });
})

//新增講義
router.post('/unit/addLecture', ensureAuthenticated, function (req, res) {
  req.checkBody('title', '講義標題不得為空').notEmpty();
  req.checkBody('body', '講義內容不得為空').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    req.flash('danger', "講義標題與內容不得為空");
    res.redirect('/class/' + req.body.classID + '/showUnit/' + req.body.unitID);
  } else {
    //console.log("---------------");
    //console.log(req.body.classID);
    //console.log(req.body.title);
    //console.log(req.body.body);

    let chapter = new Chapter();
    chapter.chapterName = req.body.title;
    chapter.belongUnit = req.body.unitID;
    chapter.body = req.body.body;
    chapter.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        //req.flash('success', "新增成功");
        res.redirect('/class/newClassManager/'+req.body.classID);
      }
    });

  }
})

//進入編輯講義頁面
router.get('/editChapter/:chapterID',function(req,res){
  Chapter.findById(req.params.chapterID,function(err,chapterinfo){
    if(err){
      console.log(err);
    }
    Unit.findById(chapterinfo.belongUnit,function(err,unitinfo){
      res.render('edit_chapter',{
        chapterinfo:chapterinfo,
        calssID:unitinfo.belongClass
      })
    })
  })
})
//儲存編輯結果
router.post('/saveEditedChapter',function(req,res){
  //console.log(req.body);

  let myquery = { _id: req.body.chapterID };
  let newvalues = { $set: {chapterName: req.body.chapterName,body:req.body.body} };
  Chapter.updateOne(myquery,newvalues,function(err){
      if(err){
          console.log(err);
          res.send('{"error" : "更改失敗", "status" : 500}');
      }else{
          res.send('{"success" : "儲存成功"}');
      }
  })
})

//刪除講義
router.delete('/deletechapter/:chapterID', ensureAuthenticated, function (req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {
    _id: req.params.chapterID
  }

  Chapter.findById(req.params.chapterID, function (err, chapter) {
    if (err || chapter == null) {
      res.render('notExist', {
        title: "喔喔！此講義不存在...",
        message: "此講義有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Chapter.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      })
    }
  })
})

//顯示講義內容
router.get('/showChapter/:id', ensureAuthenticated, function (req, res) {
  let query = {
    _id: req.params.id
  }
  Chapter.findById(query, function (err, chapter) {
    //console.log(chapter);

    if (err || chapter == null) {
      res.render('notExist', {
        title: "喔喔！此講義不存在...",
        message: "此講義有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
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
            if(err){
              console.log(err);
            }
            let newRecord = new studentWatchChapter()
            newRecord.studentID = req.user._id;
            newRecord.chapterID = req.params.id;
            newRecord.save(function(err){
              if(err){
                console.log(err);
              }
              let findchaptercommentsID = [];
              for (let i = 0; i < comments.length; i++) {
                findchaptercommentsID .push(comments[i].userID.toString());
              }
              User.find({_id: findchaptercommentsID},function(err,users){
                res.render('chapter', {
                  chapter: chapter,
                  comments: comments,
                  classinfo: classinfo,
                  users:users
                });
              })
            })
          })
        })

      })
    }
  })
});

//新增影片
router.post('/:unitID/addvideo/:videoName/:videoURLid', ensureAuthenticated, function (req, res) {
  //console.log(req.body.date);

  let newVideo = new Video();
  newVideo.videoName = req.params.videoName;
  newVideo.videoURL = req.params.videoURLid;
  newVideo.belongUnit = req.params.unitID;
  newVideo.vtime = "";
  newVideo.postTime = req.body.date
  //console.log(newVideo);

  newVideo.save(function (err) {
    if (err) {
      console.log(err);
    }
    res.send('200');

  });
});

//刪除影片
router.delete('/deletevideo/:videoID', ensureAuthenticated, function (req, res) {
  //console.log(req.user._id);

  if (!req.user._id) {
    req.flash('danger', '請先登入');
    res.redirect('/');
  }

  let query = {
    _id: req.params.videoID
  }
  Video.findById(req.params.videoID, function (err, video) {
    if (err || video == null) {
      res.render('notExist', {
        title: "喔喔！此影片不存在...",
        message: "此影片有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Video.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      })
    }
  })
});

//顯示影片內容
router.get('/showVideo/:id', ensureAuthenticated, function (req, res) {
  let query = {
    _id: req.params.id
  }
  Video.findById(query, function (err, video) {
    if (err || video == null) {
      res.render('notExist', {
        title: "喔喔！此影片不存在...",
        message: "此影片有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
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
            Note.find({
              author_id: req.user._id
            }, function (err, notes) {
              Video.find({belongUnit:unit._id},function(err,recommandVideo){
                let findvideocommentsID = [];
                for (let i = 0; i < comments.length; i++) {
                  findvideocommentsID .push(comments[i].userID.toString());
                }
                User.find({_id: findvideocommentsID},function(err,users){
                  res.render('video', {
                    video: video,
                    comments: comments,
                    classinfo: classinfo,
                    notes: notes,
                    recommandVideo:recommandVideo,
                    users:users
                  });
                });
              })
            })
          });

        })
      });
    }
  })
});

//新增測驗
router.post('/addTest/class/:cid/unit/:uid', ensureAuthenticated, function (req, res) {
  //console.log(req.body);
  if (req.body.testName == '' || req.body.testName == undefined) {
    res.status(500).send({
      msg: '測驗名稱不得為空'
    });
  } else {
    let newTest = new Test();
    newTest.testName = req.body.testName;
    newTest.testQutions = req.body.QuationList;
    newTest.belongUnit = req.body.belongUnit;
    newTest.isPublic = req.body.isPublic;
    newTest.publicTime = req.body.publicTime;
    newTest.EndpublicTime = req.body.EndpublicTime;
    newTest.publishScoreNow = req.body.publishScoreNow;
    newTest.canCheckQuestionAndAnswer = req.body.canCheckQuestionAndAnswer;
    //console.log(newTest);
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
router.delete('/deletetest/:testID', ensureAuthenticated, function (req, res) {
  //console.log(req.user._id);

  if (!req.user._id) {
    req.flash('danger', '請先登入');
    res.redirect('/');
  }

  let query = {
    _id: req.params.testID
  }
  Test.findById(req.params.testID, function (err, test) {
    if (err || test == null) {
      res.render('notExist', {
        title: "喔喔！此測驗不存在...",
        message: "此測驗有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Test.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      })
    }
  })
})

//顯示測驗
router.get('/showTest/:testID', ensureAuthenticated, function (req, res) {
  let query = {
    _id: req.params.testID
  }
  Test.findById(query, function (err, test) {
    if (err || test == null) {
      res.render('notExist', {
        title: "喔喔！此測驗不存在...",
        message: "此測驗有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Unit.findById({
        _id: test.belongUnit
      }, function (err, unit) {
        Class.findById({
          _id: unit.belongClass
        }, function (err, classinfo) {
          if (err) {
            console.log(err);
          }
          let isSubmited = false;
          studntSubmitTest.find({}, function (err, TestSubmitRecords) {
            for (let i = 0; i < TestSubmitRecords.length; i++) {
              if (TestSubmitRecords[i].writer == req.user._id) {
                if (TestSubmitRecords[i].testID == test._id) {
                  isSubmited = true
                }
              }
            }
            res.render('test', {
              test: test,
              classinfo: classinfo,
              isSubmited: isSubmited
            });
          })

        })
      });
    }
  })

});
//開放測驗
router.post('/publicTest/:testID', ensureAuthenticated, function (req, res) {
  var myquery = {
    _id: ObjectID(req.params.testID)
  };
  var newvalues = {
    $set: {
      isPublic: true
    }
  };
  Test.updateOne(myquery, newvalues, function (err) {
    if (err) {
      console.log(err);
    } else {
      //console.log('update success');
      res.json({
        success: 1
      });
    }
  });
})

//關閉測驗
router.post('/EndpublicTest/:testID', ensureAuthenticated, function (req, res) {
  var myquery = {
    _id: ObjectID(req.params.testID)
  };
  var newvalues = {
    $set: {
      isPublic: false
    }
  };
  Test.updateOne(myquery, newvalues, function (err) {
    if (err) {
      console.log(err);
    } else {
      //console.log('update success');
      res.json({
        success: 1
      });
    }
  });
})

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
//更改測驗
router.post('/saveTest/:testID', ensureAuthenticated, function (req, res) {
  console.log(req.body);
  let query = {
    _id: ObjectID(req.params.testID)
  }
  var newvalues = {
    $set: {
      testName: req.body.testName,
      publicTime: new Date(req.body.publicTime).addHours(8),
      EndpublicTime: new Date(req.body.EndpublicTime).addHours(8),
      testQutions: req.body.QuationList,
      publishScoreNow: req.body.publishScoreNow,
      canCheckQuestionAndAnswer: req.body.canCheckQuestionAndAnswer
    }
  }
  console.log(newvalues);

  Test.findById(query, function (err, testinfo) {
    //console.log("testinfo = ");
    //console.log(testinfo)
    if (err || testinfo == null) {
      res.render('notExist', {
        title: "喔喔！此測驗不存在...",
        message: "此測驗有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Test.updateOne(query, newvalues, function (err) {
        if (err) {
          console.log(err);
        } else {
          //console.log('update success');
          res.json({
            success: 1
          });
        }
      })
    }
  })

})

//新增作業
router.post('/addHomeWork/class/:cid/unit/:uid', ensureAuthenticated, function (req, res) {
  //console.log(req.body);
  if (req.body.testName == '' || req.body.testName == undefined) {
    res.status(500).send({
      msg: '作業名稱不得為空'
    });
  } else {
    let newHomeWork = new Homework();
    newHomeWork.homeworkName = req.body.testName;
    newHomeWork.testQutions = req.body.QuationList;
    newHomeWork.belongUnit = req.body.belongUnit;
    //console.log(newHomeWork);
    newHomeWork.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.json({
        success: 1
      });
    })

  }
});


//顯示作業
router.get('/showHomeWork/:homeworkID', ensureAuthenticated, function (req, res) {
  let query = {
    _id: req.params.homeworkID
  }
  Homework.findById(query, function (err, homework) {
    if (err || homework == null) {
      res.render('notExist', {
        title: "喔喔！此作業不存在...",
        message: "此作業有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Unit.findById({
        _id: homework.belongUnit
      }, function (err, unit) {
        Class.findById({
          _id: unit.belongClass
        }, function (err, classinfo) {
          if (err) {
            console.log(err);
          }
          let isSubmited = false;
          studntSubmitHomework.find({}, function (err, HomeworkSubmitRecords) {
            for (let i = 0; i < HomeworkSubmitRecords.length; i++) {
              if (HomeworkSubmitRecords[i].writer == req.user._id) {
                if (HomeworkSubmitRecords[i].homeworkID == homework._id) {
                  isSubmited = true
                }
              }
            }
            res.render('homework', {
              homework: homework,
              classinfo: classinfo,
              isSubmited: isSubmited
            });
          })

        })
      });
    }
  })

});

//刪除作業
router.delete('/deletehomework/:homeworkID', ensureAuthenticated, function (req, res) {
  //console.log(req.user._id);

  if (!req.user._id) {
    req.flash('danger', '請先登入');
    res.redirect('/');
  }

  let query = {
    _id: req.params.homeworkID
  }
  Homework.findById(req.params.homeworkID, function (err, homework) {
    if (err || homework == null) {
      res.render('notExist', {
        title: "喔喔！此作業不存在...",
        message: "此作業有可能被該任課老師刪除了！請聯絡任課老師暸解情況"
      })
    } else {
      Homework.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send('Success');
      })
    }
  })
})
//批閱考卷
router.get('/correctTestIn/:classID', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (err, classinfo) {
    if (err) {
      console.log(err);
    }
    Unit.find({
      belongClass: classinfo._id
    }, function (err, units) {
      if (err) {
        console.log(err);
      }
      let querytext = []

      for (let i = 0; i < units.length; i++) {
        querytext.push(ObjectID(units[i]._id).toString())
      }
      query = {
        belongUnit: querytext
      }
      //console.log("query = " + query);

      Test.find(query, function (err, tests) {
        if (err) {
          console.log(err);
        }
        studntSubmitTest.find(query, function (err, submits) {
          if (err) {
            console.log(err);
          }
          let querytext = []

          for (let i = 0; i < submits.length; i++) {
            querytext.push(ObjectID(submits[i].writer).toString())
          }
          query = {
            _id: querytext
          }
          User.find(query, function (err, submiter) {
            if (err) {
              console.log(err);

            }
            res.render('sudentSubmitTests', {
              units: units,
              tests: tests,
              submits: submits,
              submiter: submiter,
              classinfo:classinfo
            });
          })

        })
      })
    })
  })
});

//儲存成績
router.post('/saveMark/:testID/:writerID', ensureAuthenticated, function (req, res) {
  console.log(req.body);
  studntSubmitTest.find({
    writer: req.params.writerID
  }, function (err, testinfo) {
    for (let i = 0; i < testinfo.length; i++) {
      if (testinfo[i].testID == req.params.testID) {
        testinfo = testinfo[i];
      }
    }
    //console.log("writer = " + req.params.writerID);

    //console.log("-----------------");

    //console.log(testinfo);
    //console.log("-----------------");

    let updatetestinfo = {};
    updatetestinfo.testQutionsAndAnswer = testinfo.testQutionsAndAnswer
    updatetestinfo.isTeacherMarked = true;
    updatetestinfo.obtainscore = req.body.score.toString();
    updatetestinfo.score = req.body.score.toString();
    updatetestinfo.markArray = req.body.markArray;
    updatetestinfo.testName = testinfo.testName;
    updatetestinfo.testID = testinfo.testID;
    updatetestinfo.writer = testinfo.writer;
    updatetestinfo.belongUnit = testinfo.belongUnit;
    for (let i = 0; i < req.body.markArray.length; i++) {
      if (req.body.markArray[i] == "right") {
        updatetestinfo.testQutionsAndAnswer[i].isCorrect = true;
      } else if (req.body.markArray[i] == "wrong") {
        updatetestinfo.testQutionsAndAnswer[i].isCorrect = false;
      } else {
        //console.log("markArray is none");
      }
    }
    //console.log(updatetestinfo);
    //console.log("testinfoID = " + testinfo._id);

    studntSubmitTest.update({
      _id: testinfo._id
    }, updatetestinfo, function (err) {
      if (err) {
        console.log("err");
        res.status(500).send();
      } else {
        //console.log("ok");
        res.send('200');
      }
    })
  });
})



//@v-1
// //顯示所有有修這堂課的學生
// router.get('/showStudentIn/:classID', function (req, res) {

//     StudebtTakeCourse.find({
//         classID: req.params.classID
//     }, function (err, students) {
//         if (err) {
//             console.log(err);
//         }
//         let findStudentInfoQuery = [];
//         for (let i = 0; i < students.length; i++) {
//             findStudentInfoQuery.push(ObjectID(students[i].studentID).toString());
//         }
//         let query = {
//             _id: findStudentInfoQuery
//         }
//         User.find({
//             _id: findStudentInfoQuery
//         }, function (err, users) {
//             if (err) {
//                 console.log(err);
//             }
//             res.render('showStudentInClass', {
//                 classID: req.params.classID,
//                 students: users
//             })
//         });

//     })

// });

//顯示所有有修這堂課的學生
router.get('/showStudentIn/:classID', ensureAuthenticated, ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (error, classinfo) {
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
        let find = [];
        for (let j = 0; j < students.length; j++) {
          for (let z = 0; z < students.length; z++) {
            if(users[z] != undefined){
              if (findStudentInfoQuery[j] == users[z]._id) {
                find.push(users[z]).toString();
              }
            }
          }
        }
        res.render('showStudentInClass', {
          classID: req.params.classID,
          users: find,
          classinfo: classinfo,
          students: students
        })
      });
    })
  })
});

//搜尋課程名稱
router.get('/search/:className', ensureAuthenticated, function (req, res) {
  Class.find({}, function (err, classes) {

    if (err) {
      console.log(err);
    } else {
      classes = classes.reverse(); //讓最新課的排在最前面
      let searchClassName = req.params.className;
      if (searchClassName == 'null') {
        let page = 0;
        let allClass = [];
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].isLunched == true) {
            //console.log(classes[i].isLunched);
            allClass.push(classes[i])
          }
        }
        let sendClass = []
        for (let i = 0; i < allClass.length; i++) {
          if (i > page * maxClassInPage - 1 && sendClass.length < maxClassInPage) {
            sendClass.push(allClass[i])
          }
        }
        res.render('class', {
          classes: sendClass,
          totalPage: Math.ceil(classes.length / maxClassInPage),
          page: page + 1
        });
      } else {
        let searchedClasses = []
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].className.includes(searchClassName)) {
            searchedClasses.push(classes[i]);
          }
        }
        res.render('class', {
          classes: searchedClasses,
          page: 1,
          totalPage: -1,
        });
      }
    }

  });
})

//看課程內同學的個人頁面
router.get('/:id/showClassmateInfo/:sid', ensureAuthenticated, function (req, res) {
  //console.log(req.params.sid);

  User.findById({
    _id: req.params.sid
  }, function (err, student) {
    //console.log(student);

    res.render('userinfo', {
      user: student,
      authenticate: false
    })
  });
})

//-------------------new---------------------

//顯示所有待審核名單
router.get('/showStudentApproval/:classID', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (error, classinfo) {
    StudebtTakeCourse.find({
      classID: req.params.classID
    }, function (err, studentscheck) {
      if (err) {
        console.log(err);
      }
      let checkStudentInfoQuery = [];
      for (let i = 0; i < studentscheck.length; i++) {
        checkStudentInfoQuery.push(ObjectID(studentscheck[i].studentID).toString());
      }
      let query = {
        _id: checkStudentInfoQuery
      }
      User.find({
        _id: checkStudentInfoQuery
      }, function (err, users) {
        if (err) {
          console.log(err);
        }
        let find = [];
        for (let j = 0; j < studentscheck.length; j++) {
          for (let z = 0; z < studentscheck.length; z++) {
            if(users[z] != undefined){
              if (checkStudentInfoQuery[j] == users[z]._id) {
                find.push(users[z]).toString();
              }
            }
          }
        }
        res.render('showWaitingapproval', {
          classID: req.params.classID,
          users: find,
          classinfo: classinfo,
          studentscheck: studentscheck
        })
      });
    })
  })
});
//刪除課程學生
router.get('/deleteStudent/:id/unit/:classID', ensureAuthenticated, function (req, res) {
  var string = req.params.id;
  let delsidarray = string.split(",");
  for (let i = 0; delsidarray.length > i; i++) {
    StudebtTakeCourse.find({
      studentID: delsidarray[i],
      classID: req.params.classID
    }, function (err, stc) {
      if (err) {
        console.log(err);
      }
      StudebtTakeCourse.remove({
        _id: stc[0]._id
      }, function (err) {
        if (err) {
          console.log(err);
        }
      })
    })
  }
  req.flash('success', '刪除成功');
  res.redirect('/class/showStudentIn/' + req.params.classID);
})
//批准待審核學生
router.get('/checkStudent/:sid/unit/:classID', ensureAuthenticated, function (req, res) {
  var string = req.params.sid;
  let permission = "11111"
  let sidarray = string.split(",");
  for (let i = 0; sidarray.length > i; i++) {
    StudebtTakeCourse.updateMany({
      studentID: sidarray[i],
      classID: req.params.classID
    }, {
      $set: {
        permission: permission
      }
    }, {
      w: 1
    }, function (err, result) {
      if (err) throw err;
      //console.log('Document Updated Successfully');
      User.findById({
        _id: sidarray[i]
      }, function (err, student) {
        if (err) {
          console.log(err);
        }
        Class.findById({
          _id: req.params.classID
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
          //console.log(student.email);
          var mailOptions = {
            from: 'nkust.online.study@gmail.com',
            to: student.email,
            subject: 'nkust線上學習平台',
            text: '歡迎您加入[' + classinfo.className + ']課程!'
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              //console.log('Email sent: ' + info.response);
            }
          });
        });
      });
    });
  }
  res.redirect('/class/showStudentApproval/' + req.params.classID);
})
//-------------------new---------------------

//----------------助教-----------------------
//顯示所有有修這堂課的助教
router.get('/showAssistantIn/:classID', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (error, classinfo) {
    User.find(function (err, users) {
      if (err) {
        console.log(err);
      }
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
        }, function (err, Assistants) {
          if (err) {
            console.log(err);
          }
          let find = [];
          for (let j = 0; j < students.length; j++) {
            for (let z = 0; z < Assistants.length; z++) {
              if (findStudentInfoQuery[j] == Assistants[z]._id) {
                find.push(Assistants[z]).toString();
              }
            }
          }
          res.render('showAssistantInClass', {
            classID: req.params.classID,
            users: users,
            classinfo: classinfo,
            students: students,
            Assistants: find
          })
        });
      })
    });
  })
});
//加入助教
router.get('/checkAssistant/:sid/unit/:classID', ensureAuthenticated, function (req, res) {
  var string = req.params.sid;
  let permission = "2222";
  let sidarray = string.split(",");
  for (let i = 0; sidarray.length > i; i++) {
    StudebtTakeCourse.findOne({
      studentID: sidarray[i],
      classID: req.params.classID
    }, function (err, students) {
      if (students) {
        StudebtTakeCourse.updateMany({
          studentID: sidarray[i],
          classID: req.params.classID
        }, {
          $set: {
            permission: permission
          }
        }, {
          w: 1
        }, function (err, result) {
          if (err) throw err;
          //console.log('Assistant Document Updated Successfully');
        });
      } else {
        User.find({
          _id: sidarray[i]
        }, function (err, stc) {
          if (err) {
            console.log(err);
          }
          //console.log('Assistant Document Create Successfully');
          let newAssistant = new StudebtTakeCourse;
          newAssistant.studentID = sidarray[i];
          newAssistant.classID = req.params.classID;
          newAssistant.pridectGrade = "null";
          newAssistant.permission = "2222";
          newAssistant.save(function (err) {
            if (err) {
              console.log(err);
            }
          })
        })
      }
    })
  }
  res.redirect('/class/showAssistantIn/' + req.params.classID);
})
//刪除課程助教
router.get('/deleteAssistant/:id/unit/:classID', ensureAuthenticated, function (req, res) {
  var string = req.params.id;
  let delsidarray = string.split(",");
  for (let i = 0; delsidarray.length > i; i++) {
    StudebtTakeCourse.updateMany({
      studentID: delsidarray[i],
      classID: req.params.classID
    }, {
      $set: {
        permission: "11111"
      }
    }, {
      w: 1
    }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        //console.log('Assistant Permission Delete Successfully');
      }
    })
  }
  req.flash('success', '刪除成功');
  res.redirect('/class/showAssistantIn/' + req.params.classID);
})
//助教權限設定
router.get('/setAssistant/:id/unit/:classID/set/:mode', ensureAuthenticated, function (req, res) {
  StudebtTakeCourse.find({
    studentID: req.params.id,
    classID: req.params.classID
  }, function (err, stc) {
    if (err) {
      console.log(err);
    }
    if (stc[0].permission[req.params.mode] == '2') {
      let setmode = "";
      for (let i = 0; i < 4; i++) {
        if (req.params.mode == i) {
          setmode = setmode + "A"
        } else {
          setmode = setmode + stc[0].permission[i]
        }
      }
      StudebtTakeCourse.updateMany({
        studentID: req.params.id,
        classID: req.params.classID
      }, {
        $set: {
          permission: setmode
        }
      }, {
        w: 1
      }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log('Assistant Permission Updated Successfully');
        }
      });
    } else {
      let setmode = "";
      for (let i = 0; i < 4; i++) {
        if (req.params.mode == i) {
          setmode = setmode + "2"
        } else {
          setmode = setmode + stc[0].permission[i]
        }
      }
      StudebtTakeCourse.updateMany({
        studentID: req.params.id,
        classID: req.params.classID
      }, {
        $set: {
          permission: setmode
        }
      }, {
        w: 1
      }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          //console.log('Assistant Permission Updated Successfully');
        }
      });
    }
    res.redirect('/class/showAssistantIn/' + req.params.classID);
  })
})
//----------------助教-----------------------

//查看影片觀看情形
router.get('/showVideoSituation/:classID', ensureAuthenticated, function (req, res) {
  Class.findById(req.params.classID, function (err, classinfo) {
    if (err) {
      console.log(err);
    }
    Unit.find({
      belongClass: classinfo._id
    }, function (err, units) {
      if (err) {
        console.log(err);
      }
      let querytext = []

      for (let i = 0; i < units.length; i++) {
        querytext.push(ObjectID(units[i]._id).toString())
      }
      query = {
        belongUnit: querytext
      }
      //console.log("query = " + query);

      Video.find(query, function (err, videos) {
        if (err) {
          console.log(err);
        }
        querytext = []
        for (let i = 0; i < videos.length; i++) {
          querytext.push(ObjectID(videos[i]._id).toString())
        }
        query = {
          videoID: querytext
        }
        Videobehavior.find(query, function (err, behaviors) {
          if (err) {
            console.log(err);
          }
          querytext = []

          for (let i = 0; i < behaviors.length; i++) {
            querytext.push(ObjectID(behaviors[i].watcherID).toString())
          }
          query = {
            _id: querytext
          }
          User.find(query, function (err, watcher) {
            if (err) {
              console.log(err);

            }
            //console.log(watcher);

            res.render('showVideoSituation', {
              classinfo: classinfo,
              units: units,
              videos: videos,
              behaviors: behaviors,
              watcher: watcher
            });
          })

        })
      })
    })
  })
})


//查看影片分析
router.get('/videoAnalytics/:videoID', ensureAuthenticated, function (req, res) {
  Video.findById(req.params.videoID, function (err, videoinfo) {
    Unit.findById(videoinfo.belongUnit, function (err, unit) {
      RFM.findOne({videoID:req.params.videoID}, function (err, rfm) {
        if(rfm){
          console.log("rfm=" + rfm);
          res.render('videoAnalytics', {
            videoinfo: videoinfo,
            unit: unit,
            rfm: rfm
          })
        }else{
          console.log("rfm is none");
          res.render('videoAnalytics', {
            videoinfo: videoinfo,
            unit: unit,
            rfm: 0
          })
        }
      })
    })
  })
})



//學生查看成績
router.get('/studentWatchGrade/:classID', function (req, res) {
  Class.findById(req.params.classID, function (err, classinfo) {
    if (err) {
      console.log(err);
    }
    Unit.find({
      belongClass: classinfo._id
    }, function (err, units) {
      if (err) {
        console.log(err);
      }
      let querytext = []
      for (let i = 0; i < units.length; i++) {
        querytext.push(ObjectID(units[i]._id).toString())
      }
      query = {
        belongUnit: querytext
      }
      //console.log("query = " + query);

      Test.find(query, function (err, tests) {
        if (err) {
          console.log(err);
        }
        studntSubmitTest.find(query, function (err, submits) {
          if (err) {
            console.log(err);
          }
          let querytext = []

          for (let i = 0; i < submits.length; i++) {
            querytext.push(ObjectID(submits[i].writer).toString())
          }
          query = {
            _id: querytext
          }
          User.find(query, function (err, submiter) {
            if (err) {
              console.log(err);

            }
            res.render('studentWatchGrade', {
              units: units,
              tests: tests,
              submits: submits,
              submiter: submiter,
              classinfo:classinfo
            });
          })
        })
      })
    })
  })
});

//老師查看測驗成績與錯誤占比
router.get('/showGradeAndTestPercent/:classID', function (req, res) {
  Class.findById(req.params.classID, function (err, classinfo) {
    if (err) {
      console.log(err);
    }
    Unit.find({
      belongClass: classinfo._id
    }, function (err, units) {
      if (err) {
        console.log(err);
      }
      let querytext = []
      for (let i = 0; i < units.length; i++) {
        querytext.push(ObjectID(units[i]._id).toString())
      }
      query = {
        belongUnit: querytext
      }
      //console.log("query = " + query);

      Test.find(query, function (err, tests) {
        if (err) {
          console.log(err);
        }
        studntSubmitTest.find(query, function (err, submits) {
          if (err) {
            console.log(err);
          }
          let querytext = []

          for (let i = 0; i < submits.length; i++) {
            querytext.push(ObjectID(submits[i].writer).toString())
          }
          query = {
            _id: querytext
          }
          User.find(query, function (err, submiter) {
            if (err) {
              console.log(err);

            }
            res.render('showGradeAndTestPercent', {
              units: units,
              tests: tests,
              submits: submits,
              submiter: submiter
            });
          })
        })
      })
    })
  })
});


//Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', '請先登入');
    let nextURL = req.originalUrl.replace(new RegExp('/', 'g'), '%2F');
    //console.log("inuser ensure = " + nextURL);
    //console.log("url = /users/login/?r=" + nextURL);

    res.redirect('/users/login/?r=' + nextURL);
  }
}

module.exports = router;
