let mongoose = require('mongoose');

let homeworkSchema = mongoose.Schema({
    homeworkName: {
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

let Homework = module.exports = mongoose.model('Homework', homeworkSchema, 'homework');