let mongoose = require('mongoose');

let studentSubmitHomeworkSchema = mongoose.Schema({
    homeworkName: {
        type: String,
        require: true
    },
    homeworkID: {
        type: String,
        require: true
    },
    writer: {
        type: String,
        require: true
    },
    belongUnit: {
        type: String,
        require: true
    },
    testQutionsAndAnswer: {
        type: Array,
        require: true
    },
    isTeacherMarked: {
        type: Boolean,
        require: true
    },
    markArray: {
        type: Array,
    },
    score: {
        type: String
    }
});

let StudentSubmitHomework = module.exports = mongoose.model('StudentSubmitHomework', studentSubmitHomeworkSchema, 'studentSubmitHomework');