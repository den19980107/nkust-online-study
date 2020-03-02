// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')

//創造資料庫需要的欄位(schema)
var DictionarySchema = mongoose.Schema({
    level:{ type: String },
    type: { type: String },
    element: { type: Array , "default": [
        {
            name: { type: String, "default": "" },
            value: { type: String, "default": "" },
            limit: { type: Number, "default": 0 }
        }
    ] }
})

var DictionaryRecord = module.exports = mongoose.model('Dictionary', DictionarySchema)

module.exports.dropDB = function (callback) {
    DictionaryRecord.remove({}, callback);
}
module.exports.createDictionary = function (newDictionary, callback) {
    newDictionary.save(callback)
}
// getDictionary
module.exports.getDictionary = function (callback) {
    DictionaryRecord.find({ }, callback)
}

// updateMap, 透過type更新地圖
module.exports.updateDictionaryByType = function (type, element, callback) {
    var query = { type: type}
    var setquery = {
        element:element
    }
    DictionaryRecord.updateOne(query, setquery, callback);
}
