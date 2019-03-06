let mongoose = require('mongoose');

let studentCommentArticleSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true
    },
    articleID: {
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

let studentCommentArticle = module.exports = mongoose.model('StudentCommentArticle', studentCommentArticleSchema, 'studentCommentArticle');