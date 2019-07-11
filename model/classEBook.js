let mongoose = require('mongoose');

let classEBookSchema = mongoose.Schema({
    BookName: {
        type: String,
        require: true
    },
    BookImg: {
        type: String,
        require: true
    },
    BookID:{
        type: String,
        require: true
    },
    classId: {
        type: String,
        require: true
    },
    belongUnit: {
        type: String,
        require: true
    }
});

let ClassEBook = module.exports = mongoose.model('ClassEBook', classEBookSchema, 'ClassEBook');
