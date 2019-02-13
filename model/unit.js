let mongoose = require('mongoose');

let unitSchema = mongoose.Schema({
    unitName: {
        type: String,
        require: true
    },
    belongClass: {
        type: String,
        require: true
    }
});

let Unit = module.exports = mongoose.model('Unit', unitSchema, 'unit');