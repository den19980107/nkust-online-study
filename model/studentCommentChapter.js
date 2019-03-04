let mongoose = require('mongoose');

let studentCommentChapterSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true
    },
    chapterID: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    commentTime: {
        type: String,
        require: true
    }
});

let StudentCommentChapter = module.exports = mongoose.model('StudentCommentChapter', studentCommentChapterSchema, 'studentCommentChapter');