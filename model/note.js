let mongoose = require('mongoose');

//article schema
let noteSchema = mongoose.Schema({
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
    postTime: {
        type: String,
        require: true
    }
});

let Note = module.exports = mongoose.model('Note', noteSchema, 'note');