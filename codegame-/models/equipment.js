// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')

//創造資料庫需要的欄位(schema)
var EquipmentSchema = mongoose.Schema({
    type: { type: String ,default:"equipment"},
    levelUpLevel: { type: Array ,default:[]},
    weaponLevel: { type: Array ,default:[]},
    armorLevel: { type: Array ,default:[]}
    
})

var EquipmentRecord = module.exports = mongoose.model('Equipment', EquipmentSchema)


module.exports.dropDB = function (callback) {
    EquipmentRecord.remove({}, callback);
}
module.exports.createEquipment = function (newEquipment, callback) {
    newEquipment.save(callback)
}
// getEquipment
module.exports.getEquipment = function (callback) {
    EquipmentRecord.find({ }, callback)
}

// updateMap, 透過type更新地圖
module.exports.updateEquipment = function (armorLevel,weaponLevel,levelUpLevel, callback) {
    var query = { type: "equipment"}
    var setquery = {
        levelUpLevel: levelUpLevel,
        weaponLevel: weaponLevel,
        armorLevel:armorLevel
    }
    EquipmentRecord.updateOne(query, setquery, callback);
}
