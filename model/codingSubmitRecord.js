let mongoose = require('mongoose');

let codingSubmitRecordSchema = mongoose.Schema({
    codingQutionID: {
        type: String,
        require: true
    },
    submiterID: {
        type: String,
        require: true
    },
    language: {
        type: String,
        require: true
    },
    memory: {
        type: String,
        require: true
    },
    runtime: {
        type: String,
        require: true
    },
    script: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    submitTime: {
        type: String,
        require: true
    }
});

let CodingSubmitRecord = module.exports = mongoose.model('CodingSubmitRecord', codingSubmitRecordSchema, 'codingSubmitRecord');