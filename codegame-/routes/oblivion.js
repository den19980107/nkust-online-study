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
router.get('/oblivion', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    var canCreateMapPermission = false;
    if (req.user.canCreateMapPermission) {
        canCreateMapPermission = true;
    }

    res.render('oblivion/oblivion', {
        user: req.user.username,
        canCreateMapPermission: canCreateMapPermission
    });
});
router.post('/oblivion', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    } else if (type == "LoadMap") {
        var id = req.user.id;
        MapRecord.getMap(id, function (err, map) {
            if (err) throw err;
            // console.log(map);
            // return res.json(map);
            var update = []
            var postMap = [];
            var nowDate = new Date();
            for (let index = 0; index < map.length; index++) {
                var element = map[index];
                if (element.postStage == 1) {
                    var data = new Date(element.postDate);
                    var time = data.getTime() - nowDate.getTime();
                    if (time <= 0) {
                        map[index].postStage = 2;
                        update.push(element._id);
                        postMap.push(element);
                    }
                }
                else {
                    postMap.push(element);
                }
            }
            // res.json(map);
            res.json(postMap);
            console.log("Hello");
            // console.log(update);

            for (let index = 0; index < update.length; index++) {
                MapRecord.updateShelfLaterById(update[index], function (err, map) {
                    if (err) throw err;
                })
            }

        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            res.json(dict);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    //-------------------
    else {

    }

});

router.get('/oblivionUser', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (!(req.user.canCreateMapPermission)) {
        res.redirect('/oblivion');
    }
    res.render('oblivion/oblivionUser', {
        user: req.user.username
    });
});
router.post('/oblivionUser', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }
    else if (type == "LoadUsernameMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var update = []
            var nowDate = new Date();
            for (let index = 0; index < map.length; index++) {
                var element = map[index];
                if (element.postStage == 1) {
                    var data = new Date(element.postDate);
                    var time = data.getTime() - nowDate.getTime();
                    if (time <= 0) {
                        map[index].postStage = 2;
                        update.push(element._id);
                    }
                }
            }
            res.json(map);
            for (let index = 0; index < update.length; index++) {
                MapRecord.updateShelfLaterById(update[index], function (err, map) {
                    if (err) throw err;
                })
            }
        })
    }
    else if (type == "DeleteMap") {
        var id = req.body.mapId;
        MapRecord.deleteMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(req.user.id);
            // console.log(map); 
            res.json(map);
        })
    }
    else if (type == "unShelfMap") {
        var id = req.body.mapId;
        MapRecord.unShelfMapMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(req.user.id);
            // console.log(map); 
            res.json(map);
        })
    }
    else if (type == "shelfMap") {
        var id = req.body.mapId;
        MapRecord.ShelfMapMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(req.user.id);
            // console.log(map); 
            res.json(map);
        })
    }
    else if (type == "shelfLaterMap") {
        var id = req.body.mapId;
        var postDate = req.body.postDate;
        MapRecord.ShelfLaterMapById(id, postDate, function (err, map) {
            if (err) throw err;
            // console.log(req.user.id);
            // console.log(map); 
            res.json(map);
        })
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            res.json(dict);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    //------------------- 
    else {

    }

});

router.get('/oblivionGameView', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('oblivion/oblivionGameView', {
        user: req.user.username
    });
});
router.post('/oblivionGameView', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }

    //-----關卡紀錄 ------
    else if (type == "loadMap") {
        var id = req.body.mapId;
        MapRecord.getMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })

    }
    else if (type == "sendEvaluation") {
        var id = req.body.mapId;
        var evaluation = req.body.evaluation;

        User.getUserById(req.user.id, function (err, user) {
            if (err) throw err;
            // console.log(map);
            var finishMapNum = user.finishMapNum;
            var repeatIndex = 0, repeat = false, change = false;
            for (let indexi = 0; indexi < finishMapNum.length; indexi++) {
                var fobj = finishMapNum[indexi];
                if (fobj.mapID == id) {
                    repeat = true;
                    repeatIndex = indexi;
                    break;
                }
            }
            if (repeat) {
                console.log("repeat");
                if (finishMapNum[repeatIndex].evaluation < evaluation) {
                    finishMapNum[repeatIndex].evaluation = evaluation;
                    User.updatefinishMapNumById(req.user.id, finishMapNum, function (err, user) {
                        if (err) throw err;
                        MapRecord.getMapById(id, function (err, map) {
                            if (err) throw err;
                            // console.log(map);
                            var score = map.score, avgscore = map.avgScore;
                            for (let sindex = 0; sindex < score.length; sindex++) {
                                const element = score[sindex];
                                if (element.id == req.user.id) {
                                    score[sindex].evaluation = evaluation;
                                    break;
                                }
                            }
                            if (score.length > 4) {
                                var tot = 0;
                                for (let scoreIndex = 0; scoreIndex < score.length; scoreIndex++) {
                                    const element = score[scoreIndex];
                                    tot += parseInt(element.evaluation);
                                }
                                tot /= score.length;
                                var size = Math.pow(10, 1);
                                avgscore = Math.round(tot * size) / size;
                            }
                            MapRecord.updateMapScoreById(id, score, avgscore, function (err, map) {
                                return res.json(map);
                            })
                        })
                    })
                }
                else {
                    console.log("沒有筆記錄高", evaluation, finishMapNum[repeatIndex].evaluation);
                    change = true;
                    return res.json({});
                }
            }
            else {
                var finishScript = {
                    mapID: id,
                    evaluation: evaluation
                }
                finishMapNum.push(finishScript);
                User.updatefinishMapNumById(req.user.id, finishMapNum, function (err, user) {
                    if (err) throw err;
                    console.log("creat recodr");

                    MapRecord.getMapById(id, function (err, map) {
                        if (err) throw err;
                        // console.log(map);
                        var test = map;
                        console.log(test);
                        var score = [];
                        if (test.score) {
                            score = map.score;
                        }
                        var avgscore = map.avgScore;
                        var recodeDate = {
                            id: req.user.id,
                            evaluation: evaluation
                        }
                        score.push(recodeDate);
                        if (score.length > 4) {
                            var tot = 0;
                            for (let scoreIndex = 0; scoreIndex < score.length; scoreIndex++) {
                                const element = score[scoreIndex];
                                tot += parseInt(element.evaluation);
                            }
                            tot /= score.length;
                            var size = Math.pow(10, 1);
                            avgscore = Math.round(tot * size) / size;
                        }
                        MapRecord.updateMapScoreById(id, score, avgscore, function (err, map) {
                            if (err) throw err;
                            return res.json(map);
                        })
                    })
                })
            }
        })




    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            res.json(dict);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    //-------------------
    else {

    }

});

router.get('/oblivionDetectionView', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('oblivion/oblivionDetectionView', {
        user: req.user.username
    });
});
router.post('/oblivionDetectionView', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }
    //-----關卡紀錄 ------
    else if (type == "loadMap") {
        var id = req.body.mapId;
        MapRecord.getMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })

    }
    else if (type == "updateMapCheck") {
        var id = req.body.mapId;
        MapRecord.updateMapCheckById(id, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })

    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            res.json(dict);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    //-------------------
    else {

    }

});

router.get('/oblivionCreater', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('oblivion/oblivionCreater', {
        user: req.user.username
    });
});
router.post('/oblivionCreater', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    } else if (type == "loadmusicData") {
        if (req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch) {
            req.session.bkMusicVolumn = arseInt(req.body.bkMusicVolumn);
            req.session.bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
            req.session.musicLevel = parseInt(req.body.musicLevel);
            console.log("tstt success");
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(JSON.stringify(scriptData));
        }
        else {
            console.log("tstt nome");
            scriptData = {
                bkMusicVolumn: 0.1
                , bkMusicSwitch: 1
                , musicLevel: 1
            }
            req.session.bkMusicVolumn = 0.1;
            req.session.bkMusicSwitch = 1;
            req.session.musicLevel = 1;
            res.json(scriptData);

        }

    }
    else if (type == "loadMap") {
        var id = req.body.mapId;
        MapRecord.getMapById(id, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })

    }
    else if (type == "LoadUsernameMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var update = []
            var nowDate = new Date();
            for (let index = 0; index < map.length; index++) {
                var element = map[index];
                if (element.postStage == 1) {
                    var data = new Date(element.postDate);
                    var time = data.getTime() - nowDate.getTime();
                    if (time <= 0) {
                        map[index].postStage = 2;
                        update.push(element._id);
                    }
                }
            }
            res.json(map);
            for (let index = 0; index < update.length; index++) {
                MapRecord.updateShelfLaterById(update[index], function (err, map) {
                    if (err) throw err;
                })
            }
        })
    }
    else if (type == "updateMap") {
        var id = req.body.mapID;
        var data = new Date();
        var scriptData = {
            mapName: req.body.mapName,
            mapIntroduction: req.body.introduction,
            mapDescription: req.body.description,
            map: req.body.code,
            requireStar: req.body.requireStar,
            updateDate: data.toString(),
            postStage: req.body.postStage
        }
        MapRecord.updateMapById(id, scriptData, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })
    }
    else if (type == "createMap") {
        var data = new Date();
        // var year = data.getFullYear();
        // var month = data.getMonth() + 1;
        // var day = data.getUTCDate() + 1;
        // var createDate = year.toString() + "/" + month.toString() + "/" + day.toString();

        var scriptData = {
            username: req.body.username,
            author: req.body.author,
            mapName: req.body.mapName,
            introduction: req.body.introduction,
            description: req.body.description,
            code: req.body.code,
            requireStar: req.body.requireStar
        }
        //test
        //Create Map
        var newMap = new MapRecord({
            mapName: scriptData.mapName,
            mapIntroduction: scriptData.introduction,
            mapDescription: scriptData.description,
            author: scriptData.author,
            userID: req.user.id,
            map: scriptData.code,
            requireStar: scriptData.requireStar,
            updateDate: data.toString()
        })
        MapRecord.createMap(newMap, function (err, map) {
            if (err) throw err;
            // console.log(map);
            return res.json(map);
        })
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            res.json(dict);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else {
        console.log("ERROR:", type);
    }
});

module.exports = router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'you are not logged in')
        res.redirect('/login')
    }
}
