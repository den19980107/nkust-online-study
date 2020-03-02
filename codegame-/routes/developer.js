var express = require('express');
var router = express.Router();
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy

// var Equipment = require('../models/equipment')
var User = require('../models/user')
var MapRecord = require('../models/map')
var DictionaryRecord = require('../models/dictionary')
var EquipmentRecord = require('../models/equipment')
var GameMapRecord = require('../models/gameMap')
var testDict = require('../models/dataJson/dictionaryJson')
var testEquip = require('../models/dataJson/equipmentJson')
var testMapData = require('../models/mapData/levelData')
router.get('/developer', function (req, res, next) {


    res.render('develper/home');

})


router.post('/developer', function (req, res, next) {
    var type = req.body.type
    console.log("home post--------developer");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {


    }
    else if (type == "loadGameMap") {
        var levelId = req.body.gameLevel;
        console.log(req.body.gameLevel);
        GameMapRecord.getMapByLevel(levelId, function (err, mapData) {
            res.json(mapData);
        });
    }
});



router.get('/buildDatabase', function (req, res, next) {
    /*初次一定要做 預設檔案進db*/
    //建立字典資料庫
    /*
    var dictJson = testDict.dict.code;
    for (let index = 0; index < dictJson.length; index++) {
        console.log(dictJson[index].type, dictJson[index].element);
        var newDictionary = new DictionaryRecord({
            type: dictJson[index].type,
            element: dictJson[index].element
        })
        DictionaryRecord.createDictionary(newDictionary, function (err, dict) {

            console.log(dict);
        })
    }*/

    //建立裝備資料庫
    /*
    var equipJson = testEquip;
    var newEquipment = new EquipmentRecord({
        levelUpLevel: equipJson.levelUpLevel,
        weaponLevel: equipJson.weaponLevel,
        armorLevel: equipJson.armorLevel
    })
    EquipmentRecord.createEquipment(newEquipment, function (err, dict) {
        // console.log(dict);
    })*/
    /*
    //建立地圖資料庫
    var levelDescription = testMapData.levelDescription.Early;
    var mainDescription = testMapData.mainDescription.oblivionObject;
    var mainDescriptionBlocky = testMapData.mainDescriptionBlocky.oblivionObject;
    var directiveData = testMapData.directiveData.instruction;

    for (let index = 0; index < 50; index++) {
        var path = "../models/mapData/map/map";
        if (index < 9) {
            path += '0'
        }
        path += (index + 1).toString();
        // console.log(path);
        var map = require(path)
        var mapStr = JSON.stringify(map);
        var blockyDescription = {};
        if (index < 25) {
            blockyDescription = mainDescriptionBlocky[index];
        }
        var newMapRecord = new GameMapRecord({
            level: index,
            versionID: "V1_2019/07/27",
            data: {
                versionID: "V1_2019/07/27",
                description: levelDescription[index],
                canUseInstruction: directiveData[index],
                mainCodeDescription: mainDescription[index],
                mainBlockyDescription: blockyDescription,
                map: mapStr
            }
        })
        // console.log(newMapRecord);
        GameMapRecord.createMap(newMapRecord, function (err, dict) {
            console.log(dict);
        })
    }
    */
    res.render('develper/home');
})
router.post('/buildDatabase', function (req, res, next) {
    var type = req.body.type
    if (type == "createMapDB") {

        //建立地圖資料庫
        var levelDescription = testMapData.levelDescription.Early;
        var mainDescription = testMapData.mainDescription.oblivionObject;
        var mainDescriptionBlocky = testMapData.mainDescriptionBlocky.oblivionObject;
        var directiveData = testMapData.directiveData.instruction;

        for (let index = 0; index < 50; index++) {
            var path = "../models/mapData/map/map";
            if (index < 9) {
                path += '0'
            }
            path += (index + 1).toString();
            // console.log(path);
            var map = require(path)
            var mapStr = JSON.stringify(map);
            var blockyDescription = {};
            if (index < 25) {
                blockyDescription = mainDescriptionBlocky[index];
            }
            var newMapRecord = new GameMapRecord({
                level: index,
                versionID: "V1_2019/07/27",
                data: {
                    versionID: "V1_2019/07/27",
                    description: levelDescription[index],
                    canUseInstruction: directiveData[index],
                    mainCodeDescription: mainDescription[index],
                    mainBlockyDescription: blockyDescription,
                    map: mapStr
                }
            })
            // console.log(newMapRecord);
            GameMapRecord.createMap(newMapRecord, function (err, dict) {
                console.log(dict);
            })
        }


    }
    else if (type == "createEquip") {


        //建立裝備資料庫

        var equipJson = testEquip;
        var newEquipment = new EquipmentRecord({
            levelUpLevel: equipJson.levelUpLevel,
            weaponLevel: equipJson.weaponLevel,
            armorLevel: equipJson.armorLevel
        })
        EquipmentRecord.createEquipment(newEquipment, function (err, dict) {
            // console.log(dict);
        })
    }
    else if (type == "createDict") {
        //建立字典資料庫
        var dictJson = testDict.dict.code;
        for (let index = 0; index < dictJson.length; index++) {
            console.log(dictJson[index].type, dictJson[index].element);
            var newDictionary = new DictionaryRecord({
                level:dictJson[index].level,
                type: dictJson[index].type,
                element: dictJson[index].element
            })
            DictionaryRecord.createDictionary(newDictionary, function (err, dict) {

                console.log(dict);
            })
        }

    }
    else if (type == "delMapDb") {
        GameMapRecord.dropDB(function (err, dict) {

            console.log(dict);
        })
    }
    else if (type == "delEquipDb") {
        EquipmentRecord.dropDB(function (err, dict) {

            console.log(dict);
        })
    }
    else if (type == "delDictDb") {
        DictionaryRecord.dropDB(function (err, dict) {

            console.log(dict);
        })
    };
});
module.exports = router;