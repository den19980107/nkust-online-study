let mongoose = require('mongoose');

let EBookDataSchema = mongoose.Schema({
    BookName: {
        type: String,
        require: true
    },
    BookImg: {
        type: String,
        require: true
    }
});

let EBookData = module.exports = mongoose.model('EBookData', EBookDataSchema, 'EBookData');
