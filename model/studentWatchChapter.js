let mongoose = require('mongoose');

let StudentWatchChapterSchema = mongoose.Schema({
    studentID: {
        type: String,
        require: true
    },
    chapterID: {
        type: String,
        require: true
    }
});

let StudentWatchChapter = module.exports = mongoose.model('StudentWatchChapter', StudentWatchChapterSchema, 'studentWatchChapter');