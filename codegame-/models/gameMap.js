// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')

//創造資料庫需要的欄位(schema)
var GameMapSchema = mongoose.Schema({
    level:{ type: Number, "default": 0 },
    versionID:{ type: String },
    data:{ type: Array, "default": [
        {
            versionID:{ type: String },
            description:{
                mainGrammar:{ type: Array, "default": [
                        {
                            innerGrammar:{ type: String }
                        }
                    ]
                },
                description:{ type: String },
            },
            canUseInstruction:{ type: Array, "default": [
                {
                    name:{ type: String },
                    usable:{ type: Array, "default": [
                        {
                            value:{ type: String }
                        }
                    ]}
                }
            ]},
            mainCodeDescription:{
                mode:{ type: Number, "default": 0 },
                textarea1:{ type: String },
                textarea2:{ type: String },
                textarea3:{ type: String },
                textarea4:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea7:{ type: String },
                textarea8:{ type: String },
                img1:{ type: String },
                img2:{ type: String },
                img3:{ type: String },
                img4:{ type: String },
                img5:{ type: String },
                img6:{ type: String },
                img7:{ type: String }
            },
            mainBlockyDescription:{
                mode:{ type: Number, "default": 0 },
                textarea1:{ type: String },
                textarea2:{ type: String },
                textarea3:{ type: String },
                textarea4:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea7:{ type: String },
                textarea8:{ type: String },
                img1:{ type: String },
                img2:{ type: String },
                img3:{ type: String },
                img4:{ type: String },
                img5:{ type: String },
                img6:{ type: String },
                img7:{ type: String }
            },
            map:{ type: String }
        }
    ]}
})

var GameMapRecord = module.exports = mongoose.model('GameMap', GameMapSchema)


module.exports.dropDB = function (callback) {
    GameMapRecord.remove({}, callback);
}

module.exports.createMap = function (newGameMap, callback) {
    newGameMap.save(callback)
}

// getMap
module.exports.getMap = function (callback) {
    var query = { };
    GameMapRecord.find(query, callback)
}

// getMap
module.exports.getMapByLevel = function (levelID, callback) {
    var query = { level: levelID }
    GameMapRecord.findOne(query, callback)
}

// updateMap, 透過mapId更新地圖
module.exports.updateMapByLevel = function (levelID, scriptData, callback) {
    var query = { level: levelID  }
    var setquery = {
        versionID:scriptData.versionID,
        data:scriptData.data
    }
    // console.log("setquery",setquery);
    
    // MapRecord.updateOne(query, setquery, callback);
    GameMapRecord.updateOne(query, setquery, callback);
}