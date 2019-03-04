const mongoose = require('mongoose');

//User Schema
const VideobehaviorSchema = mongoose.Schema({
    watchTime: {
        type: String,
        require: true
    },
    watcherID: {
        type: String,
        require: true
    },
    videoID: {
        type: String,
        require: true
    },
    videoActions: {
        type: Array,
        require: true
    }

});


const Videobehavior = module.exports = mongoose.model('Videobehavior', VideobehaviorSchema);