let mongoose = require('mongoose');

let testSchema = mongoose.Schema({
    testName: {
        type: String,
        require: true
    },
    belongUnit: {
        type: String,
        require: true
    },
    testQutions: {
        type: Array,
        require: true
    },
    publicTime:{
        type:Date
    },
    EndpublicTime:{
        type:Date
    },
    isPublic:{
        type:Boolean,
        require:true
    },publishScoreNow:{
        type:Boolean,
        require:true
    },canCheckQuestionAndAnswer:{
        type:Boolean,
        require:true
    }

});

let Test = module.exports = mongoose.model('Test', testSchema, 'test');