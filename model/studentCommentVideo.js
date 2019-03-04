let mongoose = require('mongoose');

let studentCommentVideoSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true
    },
    videoID: {
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

let StudentCommentVideo = module.exports = mongoose.model('StudentCommentVideo', studentCommentVideoSchema, 'studentCommentVideo');