let mongoose = require('mongoose');

let studentSubmitTestSchema = mongoose.Schema({
    testName: {
        type: String,
        require: true
    },
    testID: {
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
    },
    obtainscore: {
        type: String
    }
});

let StudentSubmitTest = module.exports = mongoose.model('StudentSubmitTest', studentSubmitTestSchema, 'studentSubmitTest');
