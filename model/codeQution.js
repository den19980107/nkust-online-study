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
    description: {
        type: String,
        require: true
    },
    exInput: {
        type: String,
        require: true
    },
    exoutput: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    }
});

let CodeQution = module.exports = mongoose.model('CodeQution', codeQutionSchema, 'codeQution');