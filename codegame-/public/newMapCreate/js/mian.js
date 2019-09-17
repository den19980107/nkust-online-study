
var mapNum = "game01";
var map;    ///0 是草地  1是沙漠  2是海洋
var people_init;    //x,y,面相   0->  1^  2<-  3 down
var end_init = [];  //x,y,面相        0- 1 |
var arrowObject = [], mapObject = []; //問號石頭[2] 是對於問號的方向
var imgObject = [], mapwinLinit;
var imgDic = new Array();  //0 是石頭 1是樹
var mapSize;
var edgeToEdge;

var data, Res_data, width, height;
var iscreatecanvas = 0;  //0 fase 1 true 2 load success
var iscreateImg = 0;  //0 fase 1 true 2 load success
var selsize = document.getElementById('mapSize');
var selobj = document.getElementById('objectSelect');
var pos = document.getElementById('college-pos');
var cmap = document.getElementById('mapDeploy');
var mapID, mapOri, mapAll;
var editMapterrain = false;
var heightestLevelStar = 0;
var secondCanvans;

var nowEditOId = -1;

var lockAnswerTextarea = document.getElementById('lockAnswerTextarea');
var boxTextarea = document.getElementById('boxTextarea');
var enemyBlodTextarea = document.getElementById('enemyBlodTextarea');
var enemyAttackTextarea = document.getElementById('enemyAttackTextarea');
var codingTextarea = document.getElementById('codingTextarea');

var levelNameTextarea = document.getElementById('levelNameTextarea');
var levelIntroductionTextarea = document.getElementById('levelIntroductionTextarea');
var levelDescriptionTextarea = document.getElementById('levelDescriptionTextarea');

var changeFile = false;
levelNameTextarea.onchange = function () {
    changeFile = true;
}
levelIntroductionTextarea.onchange = function () {
    changeFile = true;
}
levelDescriptionTextarea.onchange = function () {
    changeFile = true;
}

codingTextarea.onchange = function () {
    changeFile = true;
    // console.log(codingTextarea.value);
    codingTextarea = document.getElementById('codingTextarea');
    data.extendCode = codingTextarea.value;
}

lockAnswerTextarea.onchange = function () {

    changeFile = true;
    lockAnswerTextarea = document.getElementById('lockAnswerTextarea');
    // console.log(lockAnswerTextarea.value);
    console.log("lockAnswerTextarea:", lockAnswerTextarea);
    mapObject[nowEditOId].ans = lockAnswerTextarea.value;
}
boxTextarea.onchange = function () {
    changeFile = true;
    // console.log(boxTextarea.value);
    boxTextarea = document.getElementById('boxTextarea');
    console.log("boxTextarea:", boxTextarea);
    mapObject[nowEditOId].string = boxTextarea.value;
}
enemyBlodTextarea.onchange = function () {
    changeFile = true;
    // console.log(enemyBlodTextarea.value);
    enemyBlodTextarea = document.getElementById('enemyBlodTextarea');
    mapObject[nowEditOId].hp = enemyBlodTextarea.value;
}
enemyAttackTextarea.onchange = function () {
    changeFile = true;
    // console.log(enemyAttackTextarea.value);
    enemyAttackTextarea = document.getElementById('enemyAttackTextarea');
    mapObject[nowEditOId].atk = enemyAttackTextarea.value;
}
function loadObjectValue() {
    if (nowEditOId > -1) {
        if (mapObject[nowEditOId].type == "enemyTank") {
            enemyAttackTextarea.value = mapObject[nowEditOId].atk;
            enemyBlodTextarea.value = mapObject[nowEditOId].hp;
        }
        else if (mapObject[nowEditOId].type == "treasure") {
            boxTextarea.value = mapObject[nowEditOId].string;
        }
        else if (mapObject[nowEditOId].type == "lock2") {
            lockAnswerTextarea.value = mapObject[nowEditOId].ans;
        } else {
            enemyAttackTextarea.value = "";
            enemyBlodTextarea.value = "";
            boxTextarea.value = "";
            lockAnswerTextarea.value = "";
        }
    }
}
var saveBtn = document.getElementById('saveBtn');
saveBtn.onclick = function () {
    // console.log(changeFile);
    if (mapID) {
        if (changeFile) {
            var scriptData = precessSaveData();
            console.log("scriptData:", scriptData);
            var notrep = true;
            for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
                const element = mapAll[indexMap];
                if (element.mapName == scriptData.mapName && element._id != mapID) {
                    notrep = false;
                    break;
                }
            }
            if (notrep) {
                console.log(scriptData);
                sendSaveMap(scriptData);
            }
            else {
                // alert("")
                remindView("關卡名稱重複");
            }
        }
        else {
            console.log("123");
            // alert("儲存成功")
            remindView("儲存成功");
        }
    }
    else {
        var scriptData = precessSaveData();

        console.log("scriptData:", scriptData);
        var notrep = true;
        for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
            const element = mapAll[indexMap];
            if (element.mapName == scriptData.mapName && element._id != mapID) {
                notrep = false;
                break;
            }
        }
        if (notrep) {
            console.log(scriptData);
            sendSaveMap(scriptData);
        }
        else {
            // alert("")
            remindView("關卡名稱重複");
        }
    }
}
var finishBtn = document.getElementById('finishBtn');
finishBtn.onclick = function () {
    // console.log(changeFile);
    if (mapID) {
        if (changeFile) {
            var scriptData = precessSaveData();

            console.log("scriptData:", scriptData);
            var notrep = true;
            for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
                const element = mapAll[indexMap];
                if (element.mapName == scriptData.mapName && element._id != mapID) {
                    notrep = false;
                    break;
                }
            }
            if (notrep) {
                console.log(scriptData);
                sendFinishMap(scriptData);
            }
            else {
                // alert("")
                remindView("關卡名稱重複");
            }
        }
        else {
            var index = 0, href = window.location.href;
            for (var i = 0; i < href.length; ++i) {
                if (href[i] == '/' || href[i] == "\\") {
                    index = i;
                }
            }
            href = href.substr(0, index + 1) + "oblivionUser";
            window.location.replace(href);
        }
    }
    else {
        var scriptData = precessSaveData();

        console.log("scriptData:", scriptData);
        var notrep = true;
        for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
            const element = mapAll[indexMap];
            if (element.mapName == scriptData.mapName && element._id != mapID) {
                notrep = false;
                break;
            }
        }
        if (notrep) {
            console.log(scriptData);
            sendFinishMap(scriptData);
        }
        else {
            // alert("")
            remindView("關卡名稱重複");
        }
    }
}

var saveBtn = document.getElementById('saveBtn');
saveBtn.onclick = function () {
    // console.log(changeFile);
    if (mapID) {
        if (changeFile) {
            var scriptData = precessSaveData();
            console.log("scriptData:", scriptData);
            var notrep = true;
            for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
                const element = mapAll[indexMap];
                if (element.mapName == scriptData.mapName && element._id != mapID) {
                    notrep = false;
                    break;
                }
            }
            if (notrep) {
                console.log(scriptData);
                sendSaveMap(scriptData);
            }
            else {
                // alert("")
                remindView("關卡名稱重複");
            }
        }
        else {
            console.log("123");
            // alert("儲存成功")
            remindView("儲存成功");
        }
    }
    else {
        var scriptData = precessSaveData();

        console.log("scriptData:", scriptData);
        var notrep = true;
        for (let indexMap = 0; indexMap < mapAll.length; indexMap++) {
            const element = mapAll[indexMap];
            if (element.mapName == scriptData.mapName && element._id != mapID) {
                notrep = false;
                break;
            }
        }
        if (notrep) {
            console.log(scriptData);
            sendSaveMap(scriptData);
        }
        else {
            // alert("")
            remindView("關卡名稱重複");
        }
    }
}
function precessSaveData() {
    for (let indexS = 0; indexS < mapObject.length - 1; indexS++) {
        var ma = mapObject[indexS];
        var mb = mapObject[indexS + 1];
        if (ma.type == mb.type && ma.postion[0] == mb.postion[0] && ma.postion[1] == mb.postion[1]) {
            mapObject.splice(indexS + 1, 1);
        }
    }
    var foggy = document.getElementById('openFoggy').checked;

    heightestLevelStar = 0;

    if (parseInt(changeSize[selsize.selectedIndex].toString()) > 6 && heightestLevelStar < 81) {
        heightestLevelStar = 81;
    }
    codingTextareaElement = document.getElementById('codingTextarea');
    if (codingTextareaElement.value.length > 0 && heightestLevelStar < 120) {
        heightestLevelStar = 120;
    }

    if (foggy) {
        data.foggy = true;
        heightestLevelStar = 120;
    }
    else {
        data.foggy = false;
    }
    var qMarkL = [];
    var qStoneL = [];
    for (let index = 0; index < mapObject.length; index++) {
        var obj = mapObject[index].type;
        if (obj == "questionstone") {
            obj.objid = index;
            qStoneL.push(obj);
        }
        else if (obj == "questionMark") {
            obj.objid = index;
            qMarkL.push(obj);
        }
        else if (obj == "boon") {
            if (heightestLevelStar < 45) {
                heightestLevelStar = 45;
            }
        }
        else if (obj == "questionstone") {
            if (heightestLevelStar < 21) {
                heightestLevelStar = 21;
            }
        }
        else if (obj == "coin") {
            if (heightestLevelStar < 12) {
                heightestLevelStar = 12;
            }
        }
        else if (obj == "tree" || obj == "stone") {
            if (heightestLevelStar < 3) {
                heightestLevelStar = 3;
            }
        }
        else if (obj == "enemyTank") {
            if (heightestLevelStar < 75) {
                heightestLevelStar = 75;
            }
        }
        else if (obj == "endline") {
            if (heightestLevelStar < 3) {
                heightestLevelStar = 3;
            }
        }
        else if (obj == "arrow") {
            if (heightestLevelStar < 39) {
                heightestLevelStar = 39;
            }
        }
        else if (obj == "lock") {
            if (heightestLevelStar < 39) {
                heightestLevelStar = 39;
            }
        }
        else if (obj == "lock2") {
            if (heightestLevelStar < 15) {
                heightestLevelStar = 15;
            }
        }
        else if (obj == "treasure") {
            heightestLevelStar = 120;
        }
    }
    for (let index = 0; index < qMarkL.length; index++) {
        var obj = qMarkL[index];
        var qMarkList = [];
        var mx = obj.postion[0], my = obj.postion[1];
        for (let si = 0; si < qStoneL.length; si++) {
            var objStone = qStoneL[si];
            var sx = objStone.postion[0], sy = objStone.postion[1];
            var dx = mx - sx, dy = my - sy;
            if (dx == 0 && dy == 1) {
                qMarkList.push(1);
            }
            else if (dx == 1 && dy == 0) {
                qMarkList.push(2);
            }
            else if (dx == 0 && dy == -1) {
                qMarkList.push(3);
            }
            else if (dx == -1 && dy == 0) {
                qMarkList.push(0);
            }
        }
        mapObject[obj.objid].chooseNum = qMarkList;
    }
    var str = JSON.stringify(data, undefined, 4);
    var levelIntroductionTextarea = document.getElementById('levelIntroductionTextarea');
    var levelDescriptionTextarea = document.getElementById('levelDescriptionTextarea');
    var levelNameTextarea = document.getElementById('levelNameTextarea');
    var postStage = 0;
    if (mapID && mapOri) {
        if (mapOri.postStage) {
            postStage = mapOri.postStage;
        }
        if (postStage == 1) {
            postStage = 0;
        }
    }


    var scriptData = {
        username: user.username,
        author: user.name,
        mapName: levelNameTextarea.value,
        introduction: levelIntroductionTextarea.value,
        description: levelDescriptionTextarea.value,
        code: str,
        requireStar: heightestLevelStar,
        postStage: postStage
    }
    console.log(scriptData);
    return scriptData;
}

function sendFinishMap(scriptData) {
    console.log(scriptData);
    if (mapID) {
        console.log("mapID:", mapID);
        scriptData.type = "updateMap";
        scriptData.mapID = mapID;
        // alert(mapID)
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                var index = 0, href = window.location.href;
                for (var i = 0; i < href.length; ++i) {
                    if (href[i] == '/' || href[i] == "\\") {
                        index = i;
                    }
                }
                href = href.substr(0, index + 1) + "oblivionUser";
                window.location.replace(href);
            }
        })
    }
    else {
        console.log("mapID:", "createMap");
        scriptData.type = "createMap";
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                var index = 0, href = window.location.href;
                for (var i = 0; i < href.length; ++i) {
                    if (href[i] == '/' || href[i] == "\\") {
                        index = i;
                    }
                }
                href = href.substr(0, index + 1) + "oblivionUser";
                window.location.replace(href);
            }
        })
    }
}

function sendSaveMap(scriptData) {
    console.log(scriptData);
    if (mapID) {
        console.log("mapID:", mapID);
        scriptData.type = "updateMap";
        scriptData.mapID = mapID;
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                // console.log(res._id);
                console.log(res);
                for (let indexS = 0; indexS < mapAll.length; indexS++) {
                    // const element = mapAll[indexS];
                    if (mapAll[indexS]._id == mapID) {
                        mapAll.splice(indexS, 1);
                        break;
                    }
                }
                mapID = res._id;
                // alert("儲存成功");
                remindView("儲存成功");
            }
        })
    }
    else {
        console.log("mapID:", "createMap");
        scriptData.type = "createMap";
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                // console.log(res._id);
                // alert("儲存成功");
                remindView("儲存成功");
                mapID = res._id;

                // let nowurl = new URL(window.location.href);
                // var searchParams = new URLSearchParams({ mapID: res._id });
                // nowurl.search = searchParams;
                // nowurl.href;
                // window.location.replace(nowurl.href);
            }
        })
    }


}


var MouseX = 0, MouseY = 0, MouseMode = 0; //MouseMode 0 is none 1 is default 2 is dragged
var real = true;


var inner = "";
var selectedIndex = 0;
var changeSize = ['6', '7', '8', '9', '10', '11', '12', '13'];

var collegemap = ['0', '1', '2'];
var collegePos = ['0度', '90度', '180度', '270度'];
var collegeObj = ['people', 'endline', 'stone', 'tree', 'coin', 'lock2', 'questionMark', 'questionstone',
    'lock', 'arrow', 'boon',
    'enemyTank', "treasure",];

function setup() {
    var path = ["stone", "tree", "tank", "bot", "start",
        "car", "endline", "questionMark", "F",
        "L", "R", "coin", "boon",
        "arrow", "lock", "lock2", "bullet",
        "boon_hit", "questionstone", "arrowWite", "enemyTank",
        "unlock", "unlock2", "unlockfail2", "foggy", "peopleFoggy", "treasure",
        "HPandArmor", "HP", "enemyDead", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "desret", "lawn", "sea",
    ]
    for (var i = 0; i < path.length; ++i) {
        var imgpath = "GameImage/" + path[i] + ".png";
        var img = loadImage(imgpath);
        imgObject.push(img), imgDic[path[i]] = i.toString();
    }
    init_setup();
    iscreateImg = 1;
}
function init_setup() {
    let nowurl = new URL(window.location.href);
    let params = nowurl.searchParams;
    if (params.has('mapID')) {
        mapID = params.get('mapID').toString();    // "react"
        console.log(mapID);
        var scriptData = {
            type: "loadMap",
            mapId: mapID
        }
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                console.log(res);
                //不是自己的地圖頁面
                if (res.author != user.name || res.checked == true) {
                    var index = 0, href = window.location.href;
                    for (var i = 0; i < href.length; ++i) {
                        if (href[i] == '/' || href[i] == "\\") {
                            index = i;
                        }
                    }
                    href = href.substr(0, index + 1) + "oblivionCreater";
                    window.location.replace(href);
                }
                else {
                    data = JSON.parse(res.map);
                    mapOri = res;
                    Res_data = JSON.parse(JSON.stringify(data));
                    loadData();
                    var levelIntroductionTextarea = document.getElementById('levelIntroductionTextarea');
                    var levelDescriptionTextarea = document.getElementById('levelDescriptionTextarea');
                    var levelNameTextarea = document.getElementById('levelNameTextarea');
                    // console.log("7777", mapSize);
                    selsize.selectedIndex = mapSize - 6;
                    levelIntroductionTextarea.value = res.mapIntroduction;
                    levelDescriptionTextarea.value = res.mapDescription;
                    levelNameTextarea.value = res.mapName;
                    heightestLevelStar = res.requireStar;
                    if (data.extendCode) {
                        codingTextarea.value = data.extendCode;
                    }
                    if (data.foggy) {
                        var foggy = document.getElementById('openFoggy');
                        foggy.checked = true;
                        var foggy = document.getElementById('closeFoggy');
                        foggy.checked = false;
                    }

                }
            }
        })
    }
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                Res_data = JSON.parse(JSON.stringify(data));
                loadData();
            }
        };
        xmlhttp.open("GET", "newMapCreate/map.json", true);
        xmlhttp.send();
    }
    var scriptData = {
        type: "LoadUsernameMap",
    }
    $.ajax({
        url: href,              // 要傳送的頁面
        method: 'POST',               // 使用 POST 方法傳送請求
        dataType: 'json',             // 回傳資料會是 json 格式
        data: scriptData,  // 將表單資料用打包起來送出去
        success: function (res) {
            mapAll = res;
            console.log(res);
        }
    })

}

function loadData() {
    // console.log(data);
    let mapNumber = data;
    if (data.extendCode) {
        codingTextarea.value = data.extendCode;
    }
    map = mapNumber['mapValue'];
    mapSize = Math.sqrt(mapNumber['mapSize']);
    people_init = mapNumber['people_init'];
    end_init = mapNumber['end_init'];
    mapObject = mapNumber['obj'];
    mapwinLinit = mapNumber['winLinit'];
    var dx = people_init["postion"][0] * edgeToEdge, dy = people_init["postion"][1] * edgeToEdge, drotate = 360 - people_init["postion"][2] * 90;
    old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
    now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
    if (real) {
        var wd = document.getElementById('divcanvas').offsetWidth;
        var hd = document.getElementById('divcanvas').offsetWidth;
        var canvas = createCanvas(wd - 5, hd - 5);
        // var canvas =createCanvas((windowWidth * 0.4), (windowHeight * 0.89));
        canvas.parent('divcanvas');
        canvas.background(211, 211, 211);
        canvas.mouseClicked(mycanvasMouseClicked);
        width = canvas.width;
        height = canvas.height;
        real = false;
    }

    edgeToEdge = width / mapSize;
    // console.log(edgeToEdge);

    iscreatecanvas = 1;
    action_now = 0;

    // var pretty = JSON.stringify(obj, undefined, 4);
    var str = JSON.stringify(data, undefined, 4);
    // textarea_0.value = str;

    // console.log(str);
}

function draw() {
    // //
    if (iscreatecanvas == 1 && iscreateImg == 1) {
        var dx = people_init["postion"][0] * edgeToEdge, dy = people_init["postion"][1] * edgeToEdge, drotate = 360 - people_init["postion"][2] * 90;
        old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
        now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
        updateCanvas();
        iscreatecanvas = 2;
    }
    if (iscreatecanvas > 1 && iscreatecanvas < 100) {
        ++iscreatecanvas;
        if (iscreatecanvas - 50 == 0) {
            updateCanvas();
        }
    } else if (iscreatecanvas >= 100) {
        ++iscreatecanvas;
        if (iscreatecanvas % 50 == 0) {
            iscreatecanvas = 100;
            updateCanvas();
        }
        var objF = false;
        for (let index = 0; index < mapObject.length; index++) {
            var obj = mapObject[index];
            if (MouseX == obj["postion"][0] && MouseY == obj["postion"][1]) {
                objF = true;
                break;
            }
        }
        if (!objF) {
            changeObjectAttributes("tree");
        }
    }
}



function keyPressed() {
    isKeyPressed = true;
    var cx = Math.floor(mouseX / edgeToEdge);
    var cy = Math.floor(mouseY / edgeToEdge);
    if (cx >= 0 && cy >= 0 && cx < mapSize && cy < mapSize) {
        if (key == 'd') {
            del();
        }
        else if (key == ' ') {
            input("keyPressed");
            if (mapObject.length > 2) {
                var ma = mapObject[mapObject.length - 1];
                var mb = mapObject[mapObject.length - 2];
                if (ma.type == mb.type && ma.postion[0] == mb.postion[0] && ma.postion[1] == mb.postion[1]) {
                    mapObject.splice(mapObject.length - 1, 1);
                }
            }
        }
    }
}


function updateCanvas() {
    var imgDesret = imgObject[parseInt(imgDic["desret"])];
    var imgLawn = imgObject[parseInt(imgDic["lawn"])];
    var imgSea = imgObject[parseInt(imgDic["sea"])];
    edgeToHeight = edgeToEdge
    edgeToWidth = edgeToEdge
    for (var y = 0; y < mapSize; ++y) {
        for (var x = 0; x < mapSize; ++x) {
            var i = y * mapSize + x;

            if (map[i] == '0') {
                // backgroundGraph.fill('#bafba7');
                image(imgLawn, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else if (map[i] == '1') {
                image(imgDesret, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else if (map[i] == '2') {
                image(imgSea, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else {
                console.log(map[i]);
            }
        }
    }
    // noStroke();

    // for (var y = 0; y < mapSize; ++y) {
    //     for (var x = 0; x < mapSize; ++x) {
    //         var i = y * mapSize + x;
    //         if (map[i] == '0') {
    //             fill('#bafba7');
    //         }
    //         else if (map[i] == '1') {
    //             fill('#FFE599');
    //         }
    //         else if (map[i] == '2') {
    //             fill('#CCE5FF');
    //         }
    //         else {
    //             console.log(map[i]);
    //         }
    //         rect(x * edgeToEdge, y * edgeToEdge, edgeToEdge, edgeToEdge);
    //     }
    // }
    // stroke(0);
    // for (var i = 1; i < mapSize; ++i) {
    //     line(i * edgeToEdge, 0, i * edgeToEdge, height);
    //     line(0, i * edgeToEdge, width, i * edgeToEdge);
    // }

    for (var i = 0; i < mapObject.length; ++i) {
        var obj = mapObject[i];
        var dx = obj["postion"][0] * edgeToEdge, dy = obj["postion"][1] * edgeToEdge;
        var img = imgObject[parseInt(imgDic[obj["type"]])];
        // console.log(mapObject);

        if (obj["type"] == "arrow" || obj["type"] == "arrowWite" || obj["type"] == "enemyTank") {
            var drotate = 360 - obj["postion"][2] * 90;
            var pg = createGraphics(edgeToEdge, edgeToEdge);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToEdge / 2, -edgeToEdge / 2, edgeToEdge, edgeToEdge);
            image(pg, dx, dy, edgeToEdge, edgeToEdge);
        }
        else if (obj["type"] == "bullet") {
            dx = obj["postion"][0], dy = obj["postion"][1];
            var drotate = obj["postion"][2] * 90 + 90;
            var pg = createGraphics(edgeToEdge, edgeToEdge);
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToEdge / 2, -edgeToEdge / 2, edgeToEdge, edgeToEdge);
            image(pg, dx, dy, edgeToEdge, edgeToEdge);
        }
        else {
            // console.log(img, dx, dy, edgeToEdge, edgeToEdge);


            image(img, dx, dy, edgeToEdge, edgeToEdge);
        }

    }

    for (var i = 0; i < end_init.length; ++i) {
        var pg = createGraphics(edgeToEdge, edgeToEdge);
        var dx = end_init[i]["postion"][0] * edgeToEdge, dy = end_init[i]["postion"][1] * edgeToEdge, drotate = 360 - end_init[i]["postion"][2] * 90;
        var img = imgObject[parseInt(imgDic[end_init[i]["type"]])];
        pg.translate(pg.width / 2, pg.height / 2);
        pg.rotate(PI / 180 * drotate);
        pg.image(img, -edgeToEdge / 2, -edgeToEdge / 2, edgeToEdge, edgeToEdge);
        image(pg, dx, dy, edgeToEdge, edgeToEdge);
    }


    var pg = createGraphics(edgeToEdge, edgeToEdge);
    var dx = now_PeooleX, dy = now_PeooleY, drotate = now_PeooleEESW;
    var img = imgObject[parseInt(imgDic[people_init["type"]])];
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(PI / 180 * drotate);
    pg.image(img, -edgeToEdge / 2, -edgeToEdge / 2, edgeToEdge, edgeToEdge);
    var img = imgObject[parseInt(imgDic["start"])];
    image(img, dx, dy, edgeToEdge, edgeToEdge);
    image(pg, dx, dy, edgeToEdge, edgeToEdge);



    stroke('red');
    strokeWeight(4);
    noFill();
    rect(MouseX * edgeToEdge, MouseY * edgeToEdge, edgeToEdge, edgeToEdge);
    strokeWeight(1);


    return true;
}


function mycanvasMouseClicked() {
    MouseX = Math.floor(mouseX / edgeToEdge);
    MouseY = Math.floor(mouseY / edgeToEdge);
    realDoMycanvasMouseClicked();
}

function realDoMycanvasMouseClicked() {

    var objF = false;
    nowEditOId = -1;
    for (let index = 0; index < mapObject.length; index++) {
        var obj = mapObject[index];
        if (MouseX == obj["postion"][0] && MouseY == obj["postion"][1]) {
            console.log(obj.type);
            objF = true;
            nowEditOId = index;
            loadObjectValue();
            changeObjectAttributes(obj.type);
            break;
        }
    }
    if (!objF) {
        changeObjectAttributes("tree");
    }
    if (editMapterrain == true) {
        changeFile = true;

        var index = cmap.selectedIndex;
        // var size = collegemap[index];
        var size = index.toString();
        // console.log("size:",size);
        // console.log("MouseY*mapSize+MouseX:", MouseY * mapSize + MouseX);
        var temp = MouseY * mapSize + MouseX;
        if (temp > 0) {
            var str = mapTerrain.substr(0, temp);
            str = str + size;
            str = str + mapTerrain.substr(temp + 1);
            mapTerrain = str
        }
        else {
            var str = size;
            str = str + mapTerrain.substr(1);
            mapTerrain = str
        }
        data['mapValue'] = mapTerrain;
    }

    // mapTerrain = mapNumber['mapValue'];
    loadData();
    // mapTerrain[MouseY*mapSize+MouseX]=size

    // console.log(mapTerrain);
    // console.log(MouseX, MouseY);
    updateCanvas();
}



selsize.onchange = function (index) {
    changeFile = true;

    changeObjectAttributes();
    // console.log(college_size.selectedIndex);
    var index = selsize.selectedIndex;
    var size = changeSize[index].toString();
    var value = ""
    for (var i = 0; i < size * size; i++) {
        value = value + "0";
    }
    data['mapValue'] = value;
    data['mapSize'] = size * size;
    loadData();
}

selobj.onchange = function () {
    var objectName = document.getElementById("objectSelect").value;
    var tableId = ["enemyTable", "lockAnswerTable", "boxTable"];
    var tableValue = ["enemy", "blueLock", "box"];
    for (var i = 0; i < objectData.oblivionObject.length; i++) {
        if (objectName == objectData.oblivionObject[i].value) {
            if (objectData.oblivionObject[i].requirementStar > user.starNum) {
                document.getElementById("objectSelect").selectedIndex = 0;
                lessRequirement(objectData.oblivionObject[i].requirementStar);
            }
        }
    }
}
pos.onchange = function (index) {
    console.log(index);
}
function del() {
    changeFile = true;

    var delF = false;
    for (var i = 0; i < data['end_init'].length; ++i) {
        if (data['end_init'][i]['postion'][0] == MouseX && data['end_init'][i]['postion'][1] == MouseY) {
            data['end_init'].splice(i, 1);
            loadData();
            updateCanvas();
            changeObjectAttributes("");
            delF = true;
            break;
            // var temp=data['end_init'];
            // temp.splice(i, 1)
        }
    }
    if (delF == false) {
        for (var i = 0; i < data['obj'].length; ++i) {
            if (data['obj'][i]['postion'][0] == MouseX && data['obj'][i]['postion'][1] == MouseY) {
                data['obj'].splice(i, 1);
                loadData();
                updateCanvas();
                break;
                // var temp=data['end_init'];
                // temp.splice(i, 1)
            }
        }
    }
    realDoMycanvasMouseClicked();
}

var keyPressedCount = 0;
function input(eventFrom = "button") {
    if (eventFrom != "button") {
        ++keyPressedCount;
    }
    if (nowEditOId < 0) {
        changeFile = true;
        // console.log("ok");
        size = document.getElementById('mapSize');
        selobj = document.getElementById('objectSelect');
        pos = document.getElementById('college-pos');

        var index = selobj.selectedIndex;
        // console.log(index);
        nowEditOId = -1;
        var obj = collegeObj[index];
        // console.log(obj);
        changeObjectAttributes(obj);
        if (obj == "people") {
            var rotate = pos.selectedIndex;
            var obj = {
                "type": "car", "postion": [MouseX, MouseY, rotate],
                "hp": 5,
                "armor": 20,
                "atk": 2
            };
            data['people_init'] = obj;

        }
        else if (obj == "enemyTank") {
            var rotate = pos.selectedIndex;
            var obj = { "type": "enemyTank", "postion": [MouseX, MouseY, rotate], "hp": 5, "atk": 5 };
            data['obj'].push(obj);
            nowEditOId = data['obj'].length - 1;
            if (heightestLevelStar < 75) {
                heightestLevelStar = 75;
            }
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
        }
        else if (obj == "endline") {
            var rotate = pos.selectedIndex;
            var obj = { "type": "endline", "postion": [MouseX, MouseY, rotate % 2] };
            data['end_init'].push(obj);
            nowEditOId = data['obj'].length - 1;
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
            if (heightestLevelStar < 3) {
                heightestLevelStar = 3;
            }
        }
        else if (obj == "arrow") {
            var rotate = pos.selectedIndex;
            var obj = { "type": "arrow", "postion": [MouseX, MouseY, rotate] };
            data['obj'].push(obj);
            nowEditOId = data['obj'].length - 1;
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
            if (heightestLevelStar < 39) {
                heightestLevelStar = 39;
            }
        }
        else if (obj == "lock") {
            var obj = { "type": "lock", "unlock": "lock_arrow", "postion": [MouseX, MouseY] };
            data['obj'].push(obj);
            nowEditOId = data['obj'].length - 1;
            if (heightestLevelStar < 39) {
                heightestLevelStar = 39;
            }
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
        }
        else if (obj == "lock2") {
            var obj = { "type": "lock2", "unlock": "lock_output", "postion": [MouseX, MouseY], "ans": "Hello", "response": "Hello" };
            data['obj'].push(obj);
            // console.log(data['obj']);
            nowEditOId = data['obj'].length - 1;
            if (heightestLevelStar < 15) {
                heightestLevelStar = 15;
            }
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
        }
        else if (obj == "questionMark") {
            var obj = { "type": obj, "postion": [MouseX, MouseY], "chooseNum": [] };
            data['obj'].push(obj);
            // console.log(data['obj']);
            nowEditOId = data['obj'].length - 1;
            if (heightestLevelStar < 21) {
                heightestLevelStar = 21;
            }
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
        }
        else if (obj == "treasure") {
            var obj = { "type": obj, "postion": [MouseX, MouseY], "string": "str" };
            data['obj'].push(obj);
            // console.log(data['obj']);
            nowEditOId = data['obj'].length - 1;
            //"end_init":[{"type":"endline","postion":[5,2,1]}],
            heightestLevelStar = 120;
        }
        else {
            var obj = { "type": obj, "postion": [MouseX, MouseY] };
            data['obj'].push(obj);
            // console.log(data['obj']);
            nowEditOId = data['obj'].length - 1;
        }
        loadData();
        updateCanvas();
        loadObjectValue()
        // console.log("dddd");
        // var bullet = { "type": "boon_hit", "postion": [dx, dy] };
        // mapObject.push(bullet);

    }
    else {
        if (eventFrom == "button" || keyPressedCount % 2 == 1) {

            remindValue = "不能重疊元件";
            remindView(remindValue);

        }
    }
}

function changeObjectAttributes(object) {
    // console.log("123");
    var objectName = object;
    var tableId = ["enemyTable", "lockAnswerTable", "boxTable"];
    var tableValue = ["enemyTank", "lock2", "treasure"];
    for (var i = 0; i < 3; i++) {
        divTag = document.getElementById(tableId[i]);
        // console.log(tableValue[i]);
        if (objectName == tableValue[i]) {
            document.getElementById(tableId[i]).style.display = '';
        } else if (objectName == tableId[i]) {
            document.getElementById(tableId[i]).style.display = '';
        } else if (objectName == tableId[i]) {
            document.getElementById(tableId[i]).style.display = '';
        } else {
            document.getElementById(tableId[i]).style.display = 'none';
        }
    }
    return;
}
function load() {

    var load = JSON.parse(textarea_0.value);
    // console.log(textarea_0.value);
    // console.log("------*--------");
    // console.log(load);
    data = load;
    Res_data = JSON.parse(JSON.stringify(load));
    loadData();
}
