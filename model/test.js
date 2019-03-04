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
    }
});

let Test = module.exports = mongoose.model('Test', testSchema, 'test');