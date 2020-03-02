let mongoose = require('mongoose');

let universityCourseInfoSchema = mongoose.Schema({
    courseId: {
        type: String
    },
    year: {
        type: String
    }, 
    semester: {
        type: String
    }, 
    schoolLevel: {
        type: String 
    },
    schoolName: {
        type: String
    }, 
    className: {
        type: String
    },
    collegeName:{
        type: String
    },
    departmentName: {
        type: String
    }, 
    departmentEName: {
        type: String
    }, 
    grade: {
        type: String
    }, 
    teacherName: {
        type: String 
    }, 
    credit: {
        type: String
    }, 
    classInfo: {
        type: String
    }, 
    classUrl:{
        type: String
    }, 
    note: {
        type: String
    }, 
    schoolSystem: {
        type: String
    }, 
    belongUnit: {
        type: String
    }
});

let UniversityCourseInfo = module.exports = mongoose.model('UniversityCourseInfo', universityCourseInfoSchema, 'universityCourseInfo');