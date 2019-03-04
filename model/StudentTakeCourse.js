let mongoose = require('mongoose');

let StudebtTakeCourseSchema = mongoose.Schema({
    studentID: {
        type: String,
        require: true
    },
    classID: {
        type: String,
        require: true
    },
    pridectGrade: {
        type: String,
        require: true
    },
    permission: {
        type: String,
        require: true
    }
});

let StudebtTakeCourse = module.exports = mongoose.model('StudebtTakeCourse', StudebtTakeCourseSchema, 'StudebtTakeCourse');