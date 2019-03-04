const mongoose = require('mongoose');

//User Schema
const VideoSchema = mongoose.Schema({
    videoName: {
        type: String,
        require: true
    },
    videoURL: {
        type: String,
        require: true
    },
    belongUnit: {
        type: String,
        require: true
    },
    vtime: {
        type: String,
        require: true
    }

});


const Video = module.exports = mongoose.model('Video', VideoSchema);