let mongoose = require('mongoose');

let schoolSchema = mongoose.Schema({
    schoolName: {
        type: String,
        require: true
    },
    collegeName: {
        type: String,
        require: true
    },
    departmentName: {
        type: String,
        require: true
    },
    departmentCode: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    phoneExtension: {
        type: String,
        require: true
    },
    fax: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    }
});

let school = module.exports = mongoose.model('School', schoolSchema, 'school');