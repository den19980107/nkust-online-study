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

var multer = require("multer");
// 这里dest对应的值是你要将上传的文件存的文件夹
var upload = multer({ dest: '../public/testImg' });

var formidable = require('formidable');
var jqupload = require('jquery-file-upload-middleware');
var fs = require('fs');

router.post('/onloadImg', function (req, res, next) {

    console.log(req.body.imgName);
    var imgName = req.body.imgName;
    var imgData = req.body.imgData;
    // console.log(imgData);
    // res.json({user:123});
    // //過濾data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer.from(base64Data, 'base64');
    fs.writeFile("../codegame-/public/img/GameLevel/" + imgName, dataBuffer, function (err) {
        if (err) {
            return res.json({ state: true, err: err });
        } else {
            return res.json({ state: true, path: "GameLevel/" + imgName });
        }
    });
});

router.get('/kuruma', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/kuruma', {
        user: req.user.username
    });
});
router.post('/kuruma', function (req, res, next) {
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
    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    else {

    }

});

router.get('/pruss', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/pruss', {
        user: req.user.username
    });
});
router.post('/pruss', function (req, res, next) {
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
    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    else {

    }

});

router.get('/gameView_text', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/gameView_text', {
        user: req.user.username
    });
});
router.post('/gameView_text', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----關卡紀錄 ------
    else if (type == "codeLevelResult" || type == "blockLevelResult") {
        console.log("codeLevelResult");
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        }
        console.log("data:", data);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (empire == "EasyEmpire") {
                var EasyEmpire = user.EasyEmpire
                var starChange = false, starChangeNum = 0;
                if (EasyEmpire.codeHighestLevel == data.level && data.HighestStarNum > 0) {
                    EasyEmpire.codeHighestLevel = parseInt(EasyEmpire.codeHighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = EasyEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (codeLevel[levelnum].HighestStarNum < data.HighestStarNum) {
                        starChange = true;
                        starChangeNum = data.HighestStarNum - EasyEmpire.codeLevel[levelnum].HighestStarNum;
                        EasyEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    EasyEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    EasyEmpire.codeLevel.push(data);
                }
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }
            }
            else if (empire == "MediumEmpire") {
                var MediumEmpire = user.MediumEmpire
                var starChange = false, starChangeNum = 0;
                if ((MediumEmpire.HighestLevel == data.level || MediumEmpire.HighestLevel <= data.level) && data.HighestStarNum > 0) {
                    MediumEmpire.HighestLevel = parseInt(data.level) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = MediumEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (parseInt(codeLevel[levelnum].HighestStarNum) < parseInt(data.HighestStarNum)) {
                        starChange = true;
                        starChangeNum = parseInt(data.HighestStarNum) - parseInt(MediumEmpire.codeLevel[levelnum].HighestStarNum);
                        MediumEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    MediumEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    MediumEmpire.codeLevel.push(data);
                }
                console.log(MediumEmpire);
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }



            }
        })
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    else {

    }

});


router.get('/gameView_blockly', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('home/gameView_blockly', {
        user: req.user.username
    });
});
router.post('/gameView_blockly', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
        console.log("codeLevelResult");
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        }
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (empire == "EasyEmpire") {
                var EasyEmpire = user.EasyEmpire
                var starChange = false, starChangeNum = 0;
                if (EasyEmpire.codeHighestLevel == data.level && data.HighestStarNum > 0) {
                    EasyEmpire.codeHighestLevel = parseInt(EasyEmpire.codeHighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = EasyEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (codeLevel[levelnum].HighestStarNum < data.HighestStarNum) {
                        starChange = true;
                        starChangeNum = data.HighestStarNum - EasyEmpire.codeLevel[levelnum].HighestStarNum;
                        EasyEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    EasyEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    EasyEmpire.codeLevel.push(data);
                }
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }
            }
            else if (empire == "MediumEmpire") {
                var MediumEmpire = user.MediumEmpire
                var starChange = false, starChangeNum = 0;
                if (MediumEmpire.HighestLevel == data.level && data.HighestStarNum > 0) {
                    MediumEmpire.HighestLevel = parseInt(MediumEmpire.HighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = MediumEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (parseInt(codeLevel[levelnum].HighestStarNum) < parseInt(data.HighestStarNum)) {
                        starChange = true;
                        starChangeNum = parseInt(data.HighestStarNum) - parseInt(MediumEmpire.codeLevel[levelnum].HighestStarNum);
                        MediumEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    MediumEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    MediumEmpire.codeLevel.push(data);
                }
                console.log(MediumEmpire);
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }



            }
        })
    }
    //-------------------
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else {

    }

});

router.get('/managementModifyMap', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('backstage/managementModifyMap', {
        user: req.user.username
    });
});
router.post('/managementModifyMap', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
        console.log("codeLevelResult");
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        }
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (empire == "EasyEmpire") {
                var EasyEmpire = user.EasyEmpire
                var starChange = false, starChangeNum = 0;
                if (EasyEmpire.codeHighestLevel == data.level && data.HighestStarNum > 0) {
                    EasyEmpire.codeHighestLevel = parseInt(EasyEmpire.codeHighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = EasyEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (codeLevel[levelnum].HighestStarNum < data.HighestStarNum) {
                        starChange = true;
                        starChangeNum = data.HighestStarNum - EasyEmpire.codeLevel[levelnum].HighestStarNum;
                        EasyEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    EasyEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    EasyEmpire.codeLevel.push(data);
                }
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }
            }
            else if (empire == "MediumEmpire") {
                var MediumEmpire = user.MediumEmpire
                var starChange = false, starChangeNum = 0;
                if (MediumEmpire.HighestLevel == data.level && data.HighestStarNum > 0) {
                    MediumEmpire.HighestLevel = parseInt(MediumEmpire.HighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = MediumEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (parseInt(codeLevel[levelnum].HighestStarNum) < parseInt(data.HighestStarNum)) {
                        starChange = true;
                        starChangeNum = parseInt(data.HighestStarNum) - parseInt(MediumEmpire.codeLevel[levelnum].HighestStarNum);
                        MediumEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    MediumEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    MediumEmpire.codeLevel.push(data);
                }
                console.log(MediumEmpire);
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }



            }
        })
    }
    //-------------------
    else {

    }

});

/*以下測試檔*/
router.get('/managementModifyMapTest', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    res.render('backstage/managementModifyMapTest', {
        user: req.user.username
    });
});
router.post('/managementModifyMapTest', function (req, res, next) {
    // Parse Info
    var type = req.body.type
    console.log("home post--------gameView");
    console.log(req.body.type);
    console.log("--------------");
    if (type == "init") {
        var id = req.user.id;
        bkMusicVolumn = 1;
        bkMusicSwitch = parseInt(req.body.bkMusicSwitch);
        musicLevel = parseInt(req.body.musicLevel);
        if (req.session.bkMusicVolumn) {
            scriptData = {
                bkMusicVolumn: req.session.bkMusicVolumn
                , bkMusicSwitch: req.session.bkMusicSwitch
                , musicLevel: req.session.musicLevel
            }
            res.json(scriptData);
        }

        // console.log(req.user.id);
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }


        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    //-----關卡紀錄 ------
    else if (type == "blockLevelResult" || type == "codeLevelResult") {
        console.log("codeLevelResult");
        var id = req.user.id;
        var empire = req.body.Empire
        var data = {
            level: req.body.level,
            HighestStarNum: req.body.StarNum,
            challengeLog: [{
                submitTime: req.body.submitTime,
                result: req.body.result,
                code: req.body.code,
                srarNum: req.body.StarNum,
                instructionNum: req.body.instructionNum
            }]
        }
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (empire == "EasyEmpire") {
                var EasyEmpire = user.EasyEmpire
                var starChange = false, starChangeNum = 0;
                if (EasyEmpire.codeHighestLevel == data.level && data.HighestStarNum > 0) {
                    EasyEmpire.codeHighestLevel = parseInt(EasyEmpire.codeHighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = EasyEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (codeLevel[levelnum].HighestStarNum < data.HighestStarNum) {
                        starChange = true;
                        starChangeNum = data.HighestStarNum - EasyEmpire.codeLevel[levelnum].HighestStarNum;
                        EasyEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    EasyEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    EasyEmpire.codeLevel.push(data);
                }
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateEasyEmpireById(id, EasyEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }
            }
            else if (empire == "MediumEmpire") {
                var MediumEmpire = user.MediumEmpire
                var starChange = false, starChangeNum = 0;
                if (MediumEmpire.HighestLevel == data.level && data.HighestStarNum > 0) {
                    MediumEmpire.HighestLevel = parseInt(MediumEmpire.HighestLevel) + 1;
                    starChange = true;
                    starChangeNum = data.HighestStarNum;
                }
                var codeLevel = MediumEmpire.codeLevel
                var level = false, levelnum = 0;
                for (var i = 0; i < codeLevel.length; i++) {
                    if (codeLevel[i].level == data.level) {
                        level = true;
                        levelnum = i;
                        break;
                    }
                }
                if (level) {
                    if (parseInt(codeLevel[levelnum].HighestStarNum) < parseInt(data.HighestStarNum)) {
                        starChange = true;
                        starChangeNum = parseInt(data.HighestStarNum) - parseInt(MediumEmpire.codeLevel[levelnum].HighestStarNum);
                        MediumEmpire.codeLevel[levelnum].HighestStarNum = data.HighestStarNum;

                    }
                    MediumEmpire.codeLevel[levelnum].challengeLog.push(data.challengeLog[0]);
                }
                else {
                    MediumEmpire.codeLevel.push(data);
                }
                console.log(MediumEmpire);
                if (starChange) {
                    var starNum = user.starNum;
                    starNum = parseInt(starNum) + parseInt(starChangeNum);
                    User.updateStarNumById(id, starNum, function (err, level) {
                        if (err) throw err;
                        User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                            if (err) throw err;
                            User.getUserById(id, function (err, user) {
                                if (err) throw err;
                                res.json(user);

                            })
                        })
                    })
                }
                else {
                    User.updateMediumEmpireById(id, MediumEmpire, function (err, level) {
                        if (err) throw err;
                        User.getUserById(id, function (err, user) {
                            if (err) throw err;
                            res.json(user);

                        })
                    })
                }



            }
        })
    }
    //-------------------
    else {

    }

});
/*到此結束*/

router.get('/managementUser', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (req.user.username != "NKUSTCCEA") { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementUser', {
        user: req.user.username
    });
});
router.post('/managementUser', function (req, res, next) {
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
    else if (type == "LoadUser") {
        User.getUser(req.user.id, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }
    else if (type == "changeUserStatus") {
        var userstatus = req.body.userstatus;
        var userId = req.body.userId;
        User.updateUserStatus(userId, userstatus, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }

});

router.get('/management', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (req.user.username != "NKUSTCCEA") { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/management', {
        user: req.user.username
    });
});
router.post('/management', function (req, res, next) {
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

});

router.get('/managementStatistics', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)
    if (req.user.username != "NKUSTCCEA") { //如有其他管理者 在這加
        res.redirect('/login')
    }
    res.render('backstage/managementStatistics', {
        user: req.user.username
    });
});
router.post('/managementStatistics', function (req, res, next) {
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
    else if (type == "readAllPlay") {
        User.getUser(req.user.id, function (err, users) {
            if (err) throw err;
            res.json(users);
        })
    }
    else {

    }

});

router.get('/', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
        if (user.username != "NKUSTCCEA") { //如有其他管理者 在這加
            res.redirect('/home')
        }

        /*初次一定要做 預設檔案進db*/
        // var dictJson = testDict.dict.code;
        // for (let index = 0; index < dictJson.length; index++) {
        //     console.log(dictJson[index].type, dictJson[index].element);
        //     var newDictionary = new DictionaryRecord({
        //         type:dictJson[index].type,
        //         element:dictJson[index].element
        //     })
        //     DictionaryRecord.createDictionary(newDictionary, function (err, dict) {

        //         console.log(dict);
        //     })
        // }
        // var equipJson = testEquip;
        // var newEquipment = new EquipmentRecord({
        //     levelUpLevel: equipJson.levelUpLevel,
        //     weaponLevel:equipJson.weaponLevel,
        //     armorLevel: equipJson.armorLevel
        // })
        // EquipmentRecord.createEquipment(newEquipment, function (err, dict) {
        //     console.log(dict);
        // })

        var openLokCastle = false;
        var codeLevel = -1;
        for (let index = 0; index < user.EasyEmpire.codeLevel.length; index++) {
            const element = user.EasyEmpire.codeLevel[index];
            if (parseInt(element.level) > codeLevel && element.HighestStarNum > 0) {
                codeLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    // console.log(codeLevel, parseInt(element.level));
                }
            }
        }
        var blockLevel = -1;
        for (let index = 0; index < user.EasyEmpire.blockLevel.length; index++) {
            const element = user.EasyEmpire.blockLevel[index];
            if (parseInt(element.level) > blockLevel && element.HighestStarNum > 0) {
                blockLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    // console.log(blockLevel, parseInt(element.level));
                }
            }
        }
        var codeLevel = user.EasyEmpire.codeLevel.length;
        var blockLevel = user.EasyEmpire.blockLevel.length;
        var totalLevel = Math.max(codeLevel, blockLevel);
        var lock = "unCastle_code";
        if (openLokCastle) {
            lock = "castle_code";
        }


        res.render('home/homeByManage', {
            user: req.user.username,
            castlelock: lock,
        });
    })
});
router.post('/', function (req, res, next) {
    console.log(req.body);
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
        /*if(req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch){
          req.session.bkMusicVolumn=arseInt(req.body.bkMusicVolumn);
          req.session.bkMusicSwitch=parseInt(req.body.bkMusicSwitch);
          req.session.musicLevel=parseInt(req.body.musicLevel);
          console.log("tstt success");
          scriptData={
            bkMusicVolumn: req.session.bkMusicVolumn
            ,bkMusicSwitch: req.session.bkMusicSwitch
            ,musicLevel: req.session.musicLevel
          }
          res.json(JSON.stringify(scriptData));
        }
        else{
          console.log("tstt nome");
          scriptData={
            bkMusicVolumn: 0.1
            ,bkMusicSwitch: 1
            ,musicLevel: 1
          }
          req.session.bkMusicVolumn=0.1;
          req.session.bkMusicSwitch=1;
          req.session.musicLevel=1;
          res.json(JSON.stringify(scriptData));

        }*/

    }

    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------

    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);

        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "updateDict") {
        var dictType = req.body.dictType
        var dictNum = req.body.dictNum
        var dictValue = req.body.dictValue
        console.log(dictType, dictNum, dictValue);
        DictionaryRecord.getDictionary(function (err, dict) {
            if (err) throw err;
            var typeIndex = 0;
            for (let index = 0; index < dict.length; index++) {
                var element = dict[index];
                if (element.type == dictType) {
                    element.element[dictNum].value = dictValue;
                    typeIndex = index;
                    break;
                    // console.log(element);

                }
            }
            DictionaryRecord.updateDictionaryByType(dict[typeIndex].type, dict[typeIndex].element, function (err, dictResult) {
                if (err) throw err;
                res.json({ res: true });
            });
        });
    }
    //-------------------
    else {

    }

});

router.get('/home', ensureAuthenticated, function (req, res, next) {
    // console.log(req.user)

    User.getUserById(req.user.id, function (err, user) {
        if (err) throw err;
        if (user.username == "NKUSTCCEA") { //如有其他管理者 在這加
            return res.redirect('/management');
        }
        var openLokCastle = false;
        var codeLevel = -1;
        for (let index = 0; index < user.EasyEmpire.codeLevel.length; index++) {
            const element = user.EasyEmpire.codeLevel[index];
            if (parseInt(element.level) > codeLevel && element.HighestStarNum > 0) {
                codeLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    console.log(codeLevel, parseInt(element.level));
                }
            }
        }
        var blockLevel = -1;
        for (let index = 0; index < user.EasyEmpire.blockLevel.length; index++) {
            const element = user.EasyEmpire.blockLevel[index];
            if (parseInt(element.level) > blockLevel && element.HighestStarNum > 0) {
                blockLevel = parseInt(element.level);
                if (parseInt(element.level) >= 23) {
                    openLokCastle = true;
                    break;
                }
                else {
                    console.log(blockLevel, parseInt(element.level));
                }
            }
        }
        var codeLevel = user.EasyEmpire.codeLevel.length;
        var blockLevel = user.EasyEmpire.blockLevel.length;
        var totalLevel = Math.max(codeLevel, blockLevel);
        var lock = "unCastle_code";
        if (openLokCastle) {
            lock = "castle_code";
        }
        console.log(JSON.stringify(req.user).toString());
        // DictionaryRecord.getDictionary(function (err, dict) {
        //     EquipmentRecord.getEquipment(function (err, equip) {
        //         return res.render('home/home', {
        //             user: req.user.username,
        //             castlelock: lock,
        //             player:JSON.stringify(req.user).toString(),
        //             gameDict:JSON.stringify(dict).toString(),
        //             gameEquip:JSON.stringify(equip[0]).toString()
        //         });
        //     });
        // });
        return res.render('home/home', {
            user: req.user.username,
            castlelock: lock
        });
    })
});
router.post('/home', function (req, res, next) {
    console.log(req.body);
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
        /*if(req.session.bkMusicVolumn && req.session.musicLevel && req.session.bkMusicSwitch){
          req.session.bkMusicVolumn=arseInt(req.body.bkMusicVolumn);
          req.session.bkMusicSwitch=parseInt(req.body.bkMusicSwitch);
          req.session.musicLevel=parseInt(req.body.musicLevel);
          console.log("tstt success");
          scriptData={
            bkMusicVolumn: req.session.bkMusicVolumn
            ,bkMusicSwitch: req.session.bkMusicSwitch
            ,musicLevel: req.session.musicLevel
          }
          res.json(JSON.stringify(scriptData));
        }
        else{
          console.log("tstt nome");
          scriptData={
            bkMusicVolumn: 0.1
            ,bkMusicSwitch: 1
            ,musicLevel: 1
          }
          req.session.bkMusicVolumn=0.1;
          req.session.bkMusicSwitch=1;
          req.session.musicLevel=1;
          res.json(JSON.stringify(scriptData));

        }*/

    }

    /**更新部分 */
    else if (type == "resetEquip") {
        var id = req.user.id;
        User.updateResetEquip(id, function (err, user) {
            if (err) throw err;
            console.log("up   :", user);
            User.getUserById(id, function (err, user) {
                if (err) throw err;
                res.json(user);
            })
        })
    }
    else if (type == "userMap") {
        MapRecord.getMapByUserID(req.user.id, function (err, map) {
            if (err) throw err;
            var dataMap = [];
            for (let indexM = 0; indexM < map.length; indexM++) {
                const element = map[indexM];
                if (element.check == true && element.postStage == 2) {
                    dataMap.push(element);
                }

            }
            res.json(dataMap);
            // console.log(req.user.id);
            // console.log(map);
            // res.json(map);
        })
    }
    /********* */
    else if (type == "weaponLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var weaponLevel = parseInt(user.weaponLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateWeaponLevel(id, weaponLevel, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    else if (type == "armorLevelup") {
        var id = req.user.id;
        User.getUserById(id, function (err, user) {
            if (err) throw err;
            var armorLevelup = parseInt(user.armorLevel) + 1
            var levelUpLevel = parseInt(user.levelUpLevel)
            // if (Equipment.levelUpLevel[levelUpLevel].star > user.starNum) {
            //     res.json({ err: "error" });
            // }
            // else {
            levelUpLevel += 1;
            User.updateArmorLevel(id, armorLevelup, levelUpLevel, function (err, user) {
                if (err) throw err;
                // console.log("up   :", user);
                User.getUserById(id, function (err, user) {
                    if (err) throw err;
                    res.json(user);
                })
            })
            // }
        })
    }
    //-----暫時的 ------
    else if (type == "loadDict") {
        DictionaryRecord.getDictionary(function (err, dict) {
            returnData = dict.sort(function (a, b) {
                return a.level > b.level ? 1 : -1;
            });
            res.json(returnData);

        });
    }
    else if (type == "loadEquip") {
        EquipmentRecord.getEquipment(function (err, equip) {
            res.json(equip[0]);
        });
    }
    else if (type == "updateEquip") {
        var seriJson = JSON.parse(req.body.seriJson)
        var armorLevel = seriJson.armorLevel;
        var weaponLevel = seriJson.weaponLevel;
        var levelUpLevel = seriJson.levelUpLevel;
        // console.log(seriJson);
        // console.log(armorLevel,weaponLevel,levelUpLevel);
        EquipmentRecord.updateEquipment(armorLevel, weaponLevel, levelUpLevel, function (err, dictResult) {
            if (err) throw err;
            res.json({ res: true });
        });
    }
    else if (type == "changePassword") {
        var id = req.user.id
        var password = req.body.password
        var oldPassword = req.body.oldPassword
        // console.log(password,oldPassword);

        User.getUserById(id, function (err, user) {
            if (err) throw err;
            if (user) {
                // console.log(user);
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(user.username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            } else {
                return res.json({ responce: 'error' });
            }
        })
        // res.redirect('/login')
    }

    //-------------------
    else {

    }

});


router.get('/logout', function (req, res, next) {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
})

router.post('/loadGameMap', function (req, res, next) {
    console.log(req.body);
    console.log("loadGameMap post--------");

    var levelId = req.body.gameLevel;
    console.log(req.body.gameLevel);
    GameMapRecord.getMapByLevel(levelId, function (err, mapData) {
        res.json(mapData);
    });

});
router.post('/updateGameMap', function (req, res, next) {
    console.log(req.body);
    console.log("loadGameMap post--------");

    var levelId = req.body.gameLevel;
    var scriptData = JSON.parse(req.body.data);
    // console.log(scriptData);
    GameMapRecord.updateMapByLevel(levelId, scriptData, function (err, mapData) {
        return res.json(mapData);
    });
});

router.post('/loadGameMapData', function (req, res, next) {
    var start = 0, end = 50;
    GameMapRecord.getMap(function (err, mapData) {
        // res.json(mapData);
        if (err)
            console.log(err);

        var returnData = [];
        for (let index = start; index < end; index++) {
            var element = mapData[index];
            // console.log(element.level);

            for (let entry = 0; entry < element.data.length; entry++) {
                var entryItem = element.data[entry];
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    returnData.push(
                        entryItem.description
                    );
                    break;
                }
            }
        }

        returnData = returnData.sort(function (a, b) {
            return a.level > b.level ? 1 : -1;
        });
        res.json(returnData);
    })

});

router.post('/loadThisLevelGameMapData', function (req, res, next) {
    var level = req.body.level
    var gameMode = req.body.gameMode   // code  blocky
    console.log(req.body, level, gameMode);
    var start = 0, end = 50;
    if(gameMode=="code"){
        var mainDescription="mainCodeDescription";
    }
    else{
        var mainDescription="mainBlockyDescription";
        // end=24;
    }
    GameMapRecord.getMap(function (err, mapData) {
        // res.json(mapData);
        if (err)
            console.log(err);
        var returnData = [];
        for (let index = start; index < end; index++) {
            var element = mapData[index];
            if (gameMode == "blocky" && element.level>=24) {
                continue;
            }
            if (element.level != level) {
                returnData.push({
                    level: element.level + 1
                })
                continue;
            }
            for (let entry = 0; entry < element.data.length; entry++) {
                var entryItem = element.data[entry];
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    returnData.push(
                        entryItem[mainDescription]
                    );
                    break;
                }
            }
        }

        console.log(returnData);
        returnData = returnData.sort(function (a, b) {
            return a.level > b.level ? 1 : -1;
        });
        res.json(returnData);
    })

});

router.post('/loadThisLevelGameMapMap', function (req, res, next) {
    var level = req.body.level
    console.log(req.body, level);
    var start = 0, end = 50;
    GameMapRecord.getMap(function (err, mapData) {
        // res.json(mapData);
        if (err)
            console.log(err);
        for (let index = start; index < end; index++) {
            var element = mapData[index];
            if (element.level != level) {
                continue;
            }
            for (let entry = 0; entry < element.data.length; entry++) {
                var entryItem = element.data[entry];
                // console.log(entryItem);
                if (entryItem.versionID == element.versionID) {
                    return res.json(entryItem.map);
                }
            }
        }
    })

});
router.post('/changeUserCreateMapPermission', function (req, res, next) {
    var userId = req.body.userId
    var canCreateMapPermission = req.body.canCreateMapPermission
    User.updateUserCreateMapPermission(userId, canCreateMapPermission, function (err, users) {
        if (err) throw err;
        res.json(users);
    })

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
