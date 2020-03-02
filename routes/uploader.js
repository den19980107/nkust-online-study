const express = require('express');
const router = express.Router();
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
    gfs.collection('articleIMG');
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
                    bucketName: 'articleIMG'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});

//上傳照片到教材
router.post('/', ensureAuthenticated, upload.any(), function (req, res) {
    console.log(req.url);
    //console.log("/uploader/image/" + req.files[0].filename);
    var CKEcallback = req.query.CKEditorFuncNum;
    var fileUrl = "/uploader/image/" + req.files[0].filename;
    var msg = "";
    res.send(`<script type="text/javascript">
    window.parent.CKEDITOR.tools.callFunction("${CKEcallback}", "${fileUrl}", "上傳成功");
    console.log("sendback");
    </script>`);

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