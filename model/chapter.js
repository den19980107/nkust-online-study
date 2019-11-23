let mongoose = require('mongoose');

let chapterSchema = mongoose.Schema({
    chapterName: {
        type: String,
        require: true
    },
    belongUnit: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    images: {
        type: Array
    },
    like:{
        type: Number,
    },
    pdf:{
        type: String
    }
});

let Chapter = module.exports = mongoose.model('Chapter', chapterSchema, 'chapter');