let mongoose = require('mongoose');

let codeQutionSchema = mongoose.Schema({
    //課程編號使用mongo db自己產生的id
    // classID: {
    //     type: String,
    //     require: true
    // },
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    testData: {
        type: Array,
        require: true
    }
});

let CodeQution = module.exports = mongoose.model('CodeQution', codeQutionSchema, 'codeQution');