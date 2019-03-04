let mongoose = require('mongoose');

//article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    author_id: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    belongClass: {
        type: String,
        require: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema, 'article');