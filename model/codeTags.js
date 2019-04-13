let mongoose = require('mongoose');

let codeTagsSchema = mongoose.Schema({
    tagName: {
        type: String,
        require: true
    }
});

let CodeTags = module.exports = mongoose.model('CodeTags', codeTagsSchema, 'codeTags');