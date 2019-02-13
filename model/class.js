let mongoose = require('mongoose');

let classSchema = mongoose.Schema({
    //課程編號使用mongo db自己產生的id
    // classID: {
    //     type: String,
    //     require: true
    // },
    className: {
        type: String,
        require: true
    },
    credit: {
        type: String,
        require: true
    },
    classTime: {
        type: String,
        require: true
    },
    classRoom: {
        type: String,
        require: true
    },
    teacher: {
        type: String,
        require: true
    },
    outline: {
        type: String
    }
});

let Class = module.exports = mongoose.model('Class', classSchema, 'class');