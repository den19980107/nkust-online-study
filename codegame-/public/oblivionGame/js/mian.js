// import { pipeline } from "stream";
// import { finished } from "stream";

class User {
    constructor(key) {
        this.key = key;
    }
}
const user1 = new User("CVMRMWLFp6Okr1UksgGo0fqP7qstkSdHrKCz6OBHzU");
const runApi = 'https://api.runmycode.online/run'
let lang = 'cpp', inputStr = "", codeStr = "";
var mapNum = "01";
var map = [];    ///0 是草地  1是沙漠  2是海洋
var people_init;    //x,y,面相   0->  1^  2<-  3 down
var end_init = [];  //x,y,面相        0- 1 |
var mapObject = []; //問號石頭[2] 是對於問號的方向
var imgObject = [], mapwinLinit;
var imgDic = new Array();  //0 是石頭 1是樹
var mapSize;
var edgeToWidth, edgeToHeight;
var mode = "easygame";
var data, Res_data, width, height;
var action_code = [], action_now = 0;
var onChanged = false;
var onChanging = false;
var stepSpeed = 2, turnSpeed = 5, delayResSpeed = 5, pipleLineSpeed = 0, pipleLineO = 0, tempAction, ActionLen;  //
var stepValue = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var now_PeooleEESW, old_PeooleEESW;
var now_PeooleX, old_PeooleX;
var now_PeooleY, old_PeooleY;
var finishCoin = true, gameEndingCode = 0;   //0 未完成 1完成 2經過終點線 3駛出地圖_失敗 4撞到障礙物_失敗  5編譯失敗    10
var gameEndingCodeDic = new Array();  //0 未完成 1完成 2經過終點線 3駛出地圖_失敗 4撞到障礙物_失敗  5編譯失敗
var iscodesheetTeseLive = false, decodeMod = 1; //0 api 編譯  1 自行編譯     //測試 先佔為1
var decodeOutput = "";
var textarea_0 = document.getElementById('textarea_0');
var textarea_1 = document.getElementById('textarea_1');
var btn1 = document.getElementById('btn1');
var backgroundGraph, objectGraph, peopleGraph, HPObject = [];
var iscreatecanvas = 0;  //0 fase 1 true 2 load success
var iscreateImg = 0;  //0 fase 1 true 2 load success
var haveFoggy = false, complementStep = false;
var lock2DelObjpos = 0;
var codeValue;
var xmlhttp = new XMLHttpRequest();
var computeEndCode;
var errMessage;
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        codeValue = this.responseText;
    }
};
xmlhttp.open("GET", "gameNew/gameNew/json/code.cpp", true);
xmlhttp.send();


var equipmentData;
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//         equipmentData = JSON.parse(this.responseText);
//     }
// };
// xmlhttp.open("GET", "json/equipment.json", true);
// xmlhttp.send();

var initCode = [
    `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[])
{    /*請在此處輸入程式碼(ps:我是註解)*/
    
    return 0;
 }


`
].join('\n')
textarea_0.value = initCode;
// console.log(initCode);
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
        // var imgpath = "gameNew/gameNew/image/" + path[i] + ".png";
        var imgpath = "GameImage/" + path[i] + ".png";
        var img = loadImage(imgpath);
        imgObject.push(img), imgDic[path[i]] = i.toString();
    }
    gameEndingCodeDic['0'] = "未完成";
    gameEndingCodeDic['1'] = "完成";
    gameEndingCodeDic['2'] = "經過終點線了,差一點好可惜";
    gameEndingCodeDic['3'] = "駛出地圖_失敗";
    gameEndingCodeDic['4'] = "撞到障礙物_失敗";
    gameEndingCodeDic['5'] = "編譯失敗";
    gameEndingCodeDic['6'] = "被炸彈炸死或撞到敵人爆炸身亡";
    gameEndingCodeDic['7'] = "被打死了";
    gameEndingCodeDic['8'] = "不必要的指令過多";
    var divcanvas = document.getElementById('divcanvas');
    var winW = divcanvas.offsetWidth;
    var winH = divcanvas.offsetHeight;
    // var winW = Math.max($(window).width()* 0.4,windowWidth * 0.4, 506);
    // var winH = Math.max($(window).height()* 0.892,windowHeight * 0.892, 500);
    // var canvas = createCanvas((windowWidth * 0.4), (windowHeight * 0.89));
    var canvas = createCanvas(winW - 6, winH - 6);
    canvas.parent('divcanvas');
    canvas.background(211, 211, 211);
    width = canvas.width;
    height = canvas.height;
    init_setup();
    iscreateImg = 1;

    /*777777 */
    textSize(12);

}

// window.onresize = function () {
//     console.log("ddd");
//     setup();
// }
function init_setup() {
    // changeCollege(10) ;

    let nowurl = new URL(window.location.href);
    let pathname = nowurl.pathname;   // "/search"
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
                var jumpPage = false;
                console.log(res);
                //不是自己的地圖檢測畫面
                console.log(pathname);
                if (pathname == "/oblivionDetectionView") {
                    console.log(res.check);

                    // if (res.check == true) {
                    //     jumpPage = true;
                    //     alert("已檢測通過");
                    //     var index = 0, href = window.location.href;
                    //     for (var i = 0; i < href.length; ++i) {
                    //         if (href[i] == '/' || href[i] == "\\") {
                    //             index = i;
                    //         }
                    //     }
                    //     href = href.substr(0, index + 1) + "oblivionUser";
                    //     window.location.replace(href);
                    // }
                    // else
                    if (user) {
                        if (res.author != user.name) {
                            jumpPage = true;
                            alert("不是你的地圖");
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
                }
                //是自己的地圖遊戲畫面
                else if (pathname == "/oblivionGameView") {
                    if (res.check == false) {
                        jumpPage = true;
                        alert("地圖測通尚未通過");
                        var index = 0, href = window.location.href;
                        for (var i = 0; i < href.length; ++i) {
                            if (href[i] == '/' || href[i] == "\\") {
                                index = i;
                            }
                        }
                        href = href.substr(0, index + 1) + "oblivion";
                        window.location.replace(href);
                    }
                    else if (user&&res.author == user.name) {
                        jumpPage = true;
                        alert("不能玩自己的地圖");
                        var index = 0, href = window.location.href;
                        for (var i = 0; i < href.length; ++i) {
                            if (href[i] == '/' || href[i] == "\\") {
                                index = i;
                            }
                        }
                        href = href.substr(0, index + 1) + "oblivion";
                        window.location.replace(href);
                    }
                }
                if (jumpPage == false) {
                    divTag = document.getElementById("titleFont");
                    divTag.innerHTML = "";
                    divTag.innerHTML = res.mapName;
                    console.log(res.mapDescription);
                    getMapDescription(res.mapDescription);
                    data = JSON.parse(res.map);
                    Res_data = JSON.parse(JSON.stringify(data));
                    loadData();
                    updateCanvas();
                }
            }
        })
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
    // data = JSON.parse(this.responseText);
    // Res_data = JSON.parse(JSON.stringify(data));
    // loadData();
    // updateCanvas();

}

function loadData() {
    let mapNumber = data;
    if (mapNumber.foggy) {
        haveFoggy = true;
    }
    else {
        haveFoggy = false;
    }
    if (mapNumber.presetCode) {
        var file = mapNumber.presetCode;
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                initCode = this.responseText;
                textarea_0.value = initCode;
            }
        };
        var url = "../json/" + file + ".cpp"
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    map = mapNumber['mapValue'];
    mapSize = Math.sqrt(mapNumber['mapSize']);
    people_init = mapNumber['people_init'];
    end_init = mapNumber['end_init'];
    mapObject = mapNumber['obj'];
    mapwinLinit = mapNumber['winLinit'];
    // var s1 = mapwinLinit["threeStar"], s2 = mapwinLinit["twoStar"];
    var linit = "";
    var stemp = textarea_0.value.substr(textarea_0.value.indexOf('#') - 1);
    textarea_0.value = linit + stemp;
    // console.log(initCode);
    var stemp = initCode.substr(initCode.indexOf('#') - 1);
    initCode = linit + stemp;
    // console.log(initCode);
    var tA = textarea_0.value.indexOf("main");
    var tEnd = textarea_0.value.indexOf("{", tA);
    console.log("tEnd", tEnd);

    textarea_0.selectionStart = tEnd + 1;
    textarea_0.selectionEnd = tEnd + 1;


    var dx = people_init["postion"][0] * edgeToWidth, dy = people_init["postion"][1] * edgeToHeight, drotate = 360 - people_init["postion"][2] * 90;
    old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
    now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;


    edgeToWidth = width / mapSize;
    edgeToHeight = height / mapSize;
    iscreatecanvas = 1;
    action_now = 0;
    peopleGraph = createGraphics(width, height);
    objectGraph = createGraphics(width, height);
    backgroundGraph = createGraphics(width, height);
    pg = createGraphics(edgeToWidth, edgeToHeight);
    updateBackgroundGraph();
    updateObjectGraph();
    updatePeopleGraph();
}


// var timeD = new Date().getTime();
function endgame() {
    // console.log((new Date().getTime())- timeD);

    onChanged = false;
    onChanging = false;
    action_code = [];
    clear();
    updateCanvas();
    for (var i = 0; i < end_init.length; ++i) {
        var dx = end_init[i]["postion"][0] * edgeToWidth, dy = end_init[i]["postion"][1] * edgeToHeight, drotate = (360 - end_init[i]["postion"][2] * 90) % 180;
        var ddx = Math.abs(dx - old_PeooleX);
        var ddy = Math.abs(dy - old_PeooleY);
        // console.log(ddx, " ", ddy);
        if (ddx < stepSpeed * 2 && ddy < stepSpeed * 2) {
            // if (dx == old_PeooleX && dy == old_PeooleY) {
            if (drotate == (((old_PeooleEESW + 360) % 180) + 90) % 180) {
                gameEndingCode = 1;
            }
            else {
                gameEndingCode = 2;
            }
        }
    }
    if (!finishCoin) {
        gameEndingCode = 0;
    }

    /*     actionCode       */
    var str = computeEndCode, temp = "";
    var systemCall = ["moveForward", "moveForward(", "moveForward()", "moveForward();",
        "turnRight", "turnRight(", "turnRight()", "turnRight();",
        "turnLeft", "turnLeft(", "turnLeft()", "turnLeft();",
        "fire", "fire(", "fire()", "fire();",
        "printf", "printf(", "scanf", "scanf("];
    var counter = 0;
    temp = str;
    var words = temp.split('\n');
    for (var i = 1; i < words.length; ++i) {
        var wt = words[i].split(' ');
        for (var wi = 0; wi < wt.length; ++wi) {
            if (wt[wi].length > 1) {
                for (var di = 0; di < systemCall.length; ++di) {
                    var pos = wt[wi].indexOf(systemCall[di]);
                    if (pos > -1) {
                        if (pos > 0) {
                            if (!(wt[wi][pos - 1] == '\t' || wt[wi][pos - 1] == ',' || wt[wi][pos - 1] == ';' || wt[wi][pos - 1] == '(')) {
                                continue;
                            }
                        }
                        if (pos + systemCall[di].length < wt[wi].length - 1) {
                            var del = systemCall[di].length;
                            if (!(wt[wi][pos + del] == ',' || wt[wi][pos + del] == ';' || wt[wi][pos + del] == '(')) {
                                continue;
                            }
                        }
                        ++counter;
                        var strTemp = wt[wi].substr(pos + systemCall[di].length);
                        wt[wi] = strTemp;
                        --wi;
                        break;
                    }
                }
            }
        }
    }
    // console.log("指令個數:", counter);

    /*        fun       */
    var splitstr = str.substr(0, str.indexOf("main"));
    var numofPostive = 0, wIndex = false;
    for (var i = str.indexOf("main"); i < str.length; ++i) {
        if (str[i] == '{') {
            if (!wIndex) {
                numofPostive = 1;
                wIndex = true;
            } else {
                ++numofPostive;
            }
        } else if (str[i] == '}') {
            --numofPostive;
            if (numofPostive == 0) {
                numofPostive = i;
                break;
            }
        }
    }
    splitstr = splitstr + str.substr(numofPostive);
    // console.log(splitstr);
    /*    find funName     */
    temp = splitstr.split('').reverse().join('');//字串反轉 int ad(){ abc } -> }  cba { )(ad tin
    // console.log(temp);
    var funname = [];
    var tempStr;
    index = 0;
    while (index > -1) {
        index = temp.indexOf('{');
        if (index > -1) {
            tempStr = temp.substr(index + 1);  // '{'.len=1
            temp = tempStr;
            index = temp.indexOf('(');
            tempStr = temp.substr(index + 1);  // '('.len=1
            temp = tempStr;
            var ws = temp.split(' ');
            if (ws[0] != "niam") {
                funname.push(ws[0].split('').reverse().join('')); //補正回來 } cba { )(cba --> abc
            }
            index = 0;
        }
    }
    index = str.indexOf("main");
    tempStr = str.substr(index + 4);   // 'main'.len=4
    index = tempStr.indexOf("}");
    temp = tempStr.substr(0, index); //取main 函是裡頭的
    // console.log(funname);
    // console.log(temp);
    var funcounter = 0;
    systemCall = [];
    for (var i = 0; i < funname.length; ++i) {
        var e0 = funname[i];
        var e1 = e0 + '(';
        var e2 = e1 + ')';
        var e3 = e2 + ';';
        systemCall.push(e0);
        systemCall.push(e1);
        systemCall.push(e2);
        systemCall.push(e3);
    }
    var words = temp.split('\n');
    for (var i = 1; i < words.length; ++i) {
        var wt = words[i].split(' ');
        for (var wi = 0; wi < wt.length; ++wi) {
            if (wt[wi].length > 1) {
                for (var di = 0; di < systemCall.length; ++di) {
                    var pos = wt[wi].indexOf(systemCall[di]);
                    if (pos > -1) {
                        if (pos > 0) {
                            if (!(wt[wi][pos - 1] == '\t' || wt[wi][pos - 1] == ',' || wt[wi][pos - 1] == ';')) {
                                // console.log("outBefore :", wt[wi], " ", wt[wi][pos - 1]);
                                continue;
                            }
                        }
                        if (pos + systemCall[di].length < wt[wi].length - 1) {
                            var del = systemCall[di].length;
                            if (!(wt[wi][pos - 1] == '\t' || wt[wi][pos + del] == ',' || wt[wi][pos + del] == ';')) {
                                // console.log("outAfter :", wt[wi], " ", wt[wi][pos + 1]);
                                continue;
                            }
                        }
                        ++funcounter;
                        var strTemp = wt[wi].substr(pos + systemCall[di].length);
                        wt[wi] = strTemp;
                        --wi;
                        break;
                    }
                }
            }
        }
    }
    var result = "";
    // var tc = counter + funname.length + funcounter;
    var tc = counter + funcounter;
    if (gameEndingCode == 1) {


        console.log("counter:", counter);
        console.log("funname.length:", funname.length);
        console.log("funcounter:", funcounter);
        console.log("總動作為:", tc);

        if (mapwinLinit["threeStar"][0] >= tc) {
            result = "拍手!恭喜你獲得三星! \n~來繼續挑戰下關吧~";
            createEndView(3, result, tc, computeEndCode);
        }
        else if (mapwinLinit["twoStar"][0] >= tc) {
            result = "恭喜你二星! \n~差一點就有一星了!加油~";
            createEndView(2, result, tc, computeEndCode);
        }
        else {
            result = "好可惜只有一星! \n~在檢查看看有沒有可以縮減的~";
            createEndView(1, result, tc, computeEndCode);
        }
    }
    else {
        result = gameEndingCodeDic[gameEndingCode];
        console.log(gameEndingCodeDic[gameEndingCode]);
        createEndView(0, result, tc, computeEndCode,errMessage);
        // alert(gameEndingCodeDic[gameEndingCode]);
    }


    // alert(result);
}


function draw() {
    // //
    if (iscreatecanvas == 1 && iscreateImg == 1) {
        var dx = people_init["postion"][0] * edgeToWidth, dy = people_init["postion"][1] * edgeToHeight, drotate = 360 - people_init["postion"][2] * 90;
        old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
        now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
        updateObjectGraph();
        updatePeopleGraph();
        updateBackgroundGraph();
        updateCanvas();
        iscreatecanvas = 2;
    }
    if (iscreatecanvas > 1 && iscreatecanvas < 400) {
        ++iscreatecanvas;
        if (iscreatecanvas % 50 == 0) {
            // console.log(iscreatecanvas);
            updateObjectGraph();
            updatePeopleGraph();
            updateBackgroundGraph();
            updateCanvas();
        }
    }

    // console.log(createGraphics(width, height));

    if (onChanged) {
        // console.log("running");
        if (!onChanging) {
            /*優化部分*/
            ActionLen = action_code.length;
            if (ActionLen - action_now > 0) {
                tempAction = action_code[action_now];
            }
            /*  */
            now_PeooleEESW = old_PeooleEESW;
            now_PeooleX = old_PeooleX;
            now_PeooleY = old_PeooleY;
            // stepSpeed = 7; //控制車子速度
            // stepSpeed = gameSpeed; //控制車子速度
            stepSpeed = gameSpeed + 1 + Math.floor(ActionLen / 50); //控制車子速度
            delayResSpeed = 30-(gameSpeed-6)*5;
            turnSpeed = 2 + Math.floor(stepSpeed / 2);
        }
        while (ActionLen - action_now > 0) {
            var mapObjectChange = true;
            // console.log(action_now);
            if (pipleLineSpeed > 0) {
                // console.log(pipleLineSpeed);
                --pipleLineSpeed;
            }
            else if (pipleLineO > 0) {
                var temp = pipleLineO - 1
                pipleLineO = -1 * (2 + action_now);
                action_now = temp;
                tempAction = action_code[action_now];
            }
            else if (pipleLineO < -1) {
                pipleLineO = -1 * (2 + pipleLineO);
                action_now = pipleLineO;
                pipleLineO = 0;
                tempAction = action_code[action_now];
            }

            var type = tempAction.type;
            if (type == "E") {
                var value = tempAction.value; // 3駛出地圖 4 碰壁 6被炸死  9金幣未完成 10金幣完成  7沒血了
                if (value == 2) {
                    gameEndingCode = value;
                }
                else if (value == 4) {
                    for (let ssi = 0; ssi < mapObject.length; ssi++) {
                        const x = mapObject[ssi].postion[0];
                        const y = mapObject[ssi].postion[1];
                        var dx = Math.abs(x * edgeToWidth - old_PeooleX);
                        var dy = Math.abs(y * edgeToHeight - old_PeooleY);
                        // console.log(dx,dy,ssi);
                        if (dx < stepSpeed && dy < stepSpeed) {
                            gameEndingCode = value;
                            onChanged = false;
                            onChanging = false;
                            updateCanvas();
                            break;
                        }
                    }
                }
                else if (value == 3 || value == 6 || value == 7) {
                    console.log("gg");
                    pipleLineSpeed = 0
                    gameEndingCode = value;
                    // action_now = action_code.length;
                    // action_code = [];
                    onChanged = false;
                    onChanging = false;
                    // updateCanvas();
                    // break;
                }
                else if (value == 9) {
                    finishCoin = false;
                }
                else if (value == 10) {
                    finishCoin = true;
                }

                else {
                    alert("'E'還未處理,", value);
                    console.log("'E'還未處理,", value);
                }
                ++action_now;
            }
            else if (type == "W") {
                // console.log("123");
                pipleLineSpeed = 20;
                ++action_now;
                pipleLineO = action_now + 1;
                ++action_now;
            }
            else if (type == "M") {
                var value = tempAction.value;
                if (!onChanging) {
                    for (var i = 0; i < value.length; ++i) {
                        var nowValue = value[i];
                        if (nowValue.obj == -1) {
                            old_PeooleX = old_PeooleX + nowValue.value[0] * edgeToWidth;
                            old_PeooleY = old_PeooleY + nowValue.value[1] * edgeToHeight;
                            old_PeooleEESW = old_PeooleEESW - nowValue.value[2] * 90;
                        }
                        else {
                            var dx = mapObject[nowValue.obj].postion[0];
                            var dy = mapObject[nowValue.obj].postion[1];
                            mapObject[nowValue.obj].oldX = dx + nowValue.value[0] * edgeToWidth;
                            mapObject[nowValue.obj].oldY = dy + nowValue.value[1] * edgeToHeight;
                            // console.log(mapObject[nowValue.obj]);
                        }
                    }
                    onChanging = true;
                }
                else {
                    for (var i = 0; i < value.length; ++i) {
                        var nowValue = value[i];
                        if (nowValue.obj == -1) {  //人
                            if (nowValue.value[0] + nowValue.value[1] + nowValue.value[2] == -3) {
                                //-1,-1,-1 丟到世界外
                                now_PeooleX = mapSize * edgeToWidth;
                                now_PeooleY = mapSize * edgeToHeight;
                                old_PeooleX = mapSize * edgeToWidth;
                                old_PeooleY = mapSize * edgeToHeight;
                                onChanging = false;
                            }
                            else {
                                if (pipleLineSpeed == 0) {
                                    now_PeooleX = now_PeooleX + (stepSpeed * nowValue.value[0]);
                                    now_PeooleY = now_PeooleY + (stepSpeed * nowValue.value[1]);
                                    now_PeooleEESW = now_PeooleEESW - (turnSpeed * nowValue.value[2]);
                                    var difX = Math.abs(now_PeooleX - old_PeooleX)
                                    var difY = Math.abs(now_PeooleY - old_PeooleY)
                                    var difE = Math.abs(now_PeooleEESW - old_PeooleEESW)
                                    var dif = difX + difY + difE;
                                    if (complementStep) {
                                        complementStep = false;
                                        now_PeooleX = old_PeooleX;
                                        now_PeooleY = old_PeooleY;
                                        now_PeooleEESW = old_PeooleEESW;
                                        onChanging = false;
                                    }
                                    else if (dif <= stepSpeed) {
                                        complementStep = true;
                                    }
                                    /*

                                    */
                                }
                            }
                            updatePeopleGraph();
                            break;
                        }
                        else {      //物件的
                            var difX = Math.abs(mapObject[nowValue.obj].postion[0] - mapObject[nowValue.obj].oldX);
                            var difY = Math.abs(mapObject[nowValue.obj].postion[1] - mapObject[nowValue.obj].oldY);
                            var dif = difX + difY;
                            // console.log(dif);
                            if (dif > stepSpeed) {
                                for (var ssi = 0; ssi < 2; ++ssi) {
                                    if (Math.abs(nowValue.value[ssi]) > 0.1) {
                                        if (nowValue.value[ssi] > 0) {
                                            mapObject[nowValue.obj].postion[ssi] += stepSpeed;
                                        }
                                        else {
                                            mapObject[nowValue.obj].postion[ssi] -= stepSpeed;
                                        }
                                    }
                                }
                                onChanging = true;
                            }
                            else if (complementStep) {
                                complementStep = false;
                                mapObject[nowValue.obj].postion[0] = mapObject[nowValue.obj].oldX;
                                mapObject[nowValue.obj].postion[1] = mapObject[nowValue.obj].oldY;
                                onChanging = false;
                            }
                            else {
                                complementStep = true;
                            }
                            // else {
                            //     onChanging = false;
                            // }
                            updateObjectGraph();
                            break;
                        }
                    }

                }
                if (onChanging == false) {
                    ++action_now;
                }
            }
            else if (type == "C") {
                if (onChanging == false) {
                    var value = tempAction.value;
                    for (var i = 0; i < value.length; ++i) {
                        var o = -1;
                        var nowValue = value[i];
                        if (nowValue.obj == -1) {
                            people_init["type"] = nowValue.type;
                        }
                        else {
                            if (nowValue.x > -1 && nowValue.y > -1) {
                                for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
                                    // console.log(mapObject[ssi].type);
                                    if (mapObject[ssi].type == "lock2" || mapObject[ssi].type == "unlockfail2") {
                                        if (mapObject[ssi].postion[0] == nowValue.x && mapObject[ssi].postion[1] == nowValue.y) {
                                            o = ssi;
                                            lock2DelObjpos = o;
                                            break;
                                        }
                                    }
                                }
                            }
                            else {
                                o = nowValue.obj;
                            }
                            if (nowValue.type && o > -1) {
                                // console.log(nowValue.type);
                                // console.log(o,mapObject[o]);
                                mapObject[o].type = nowValue.type;
                            }
                        }
                    }
                }
                var delayAnimn = tempAction.value[0].type;
                if (delayAnimn == "unlock" || delayAnimn == "unlock2" || delayAnimn == "unlockfail2" || delayAnimn == "enemyDead") {
                    onChanging = true;
                    --delayResSpeed;
                    if (delayResSpeed < 0) {
                        onChanging = false;
                        ++action_now;
                    }
                }
                else {
                    onChanging = false;
                    ++action_now;
                }
                updateObjectGraph();
            }
            else if (type == "D") {
                var value = tempAction.value;
                // console.log(mapObject);
                for (var i = 0; i < value.length; ++i) {
                    var nowValue = value[i];
                    var o = -1;
                    // console.log("und Test:",nowValue,nowValue.x,nowValue.y);
                    if (nowValue.x > -1 && nowValue.y > -1) {
                        for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
                            // console.log(mapObject[ssi].type);
                            if (mapObject[ssi].type == "lock2" || mapObject[ssi].type == "unlock2") {
                                if (mapObject[ssi].postion[0] == nowValue.x && mapObject[ssi].postion[1] == nowValue.y) {
                                    o = ssi;
                                    break;
                                }
                            }
                        }
                        // console.log("test O:",o);
                    }
                    else if (nowValue.forgetDel > 0) {
                        // if(nowValue.obj<=lock2DelObjpos+nowValue.forgetDel){
                        //     o = nowValue.obj+nowValue.forgetDel;
                        // }
                        console.log(nowValue.obj, nowValue.forgetDel, lock2DelObjpos);

                        if (nowValue.obj + nowValue.forgetDel < lock2DelObjpos) {
                            o = nowValue.obj + nowValue.forgetDel;
                        }
                        else {
                            o = nowValue.obj;
                            console.log("123");

                        }
                    }
                    else {
                        o = nowValue.obj;
                    }
                    mapObject.splice(o, 1);
                }
                // console.log(mapObject);
                updateObjectGraph();
                ++action_now;
            }
            else if (type == "A") {
                var value = tempAction.value;
                var delayFlag=false
                if (onChanging == false) {
                    for (var i = 0; i < value.length; ++i) {
                        var nowValue = value[i];
                        var nowList = [nowValue.value[0], nowValue.value[1], nowValue.value[2]]
                        if (nowValue.type == "bullet") {
                            nowList[0] = nowList[0] * edgeToWidth;
                            nowList[1] = nowList[1] * edgeToHeight;
                            var obj = { "type": "bullet", "postion": nowList };
                            mapObject.push(obj);
                        }
                        else if (nowValue.type == "HP") {
                            onChanging = true;
                            if (nowValue.obj == -1) {
                                var hp = 5, armor = 0;
                                if (nowValue.value[2] >= 5) {
                                    hp = 5;
                                    armor = nowValue.value[2] - hp;
                                }
                                else {
                                    hp = nowValue.value[2];
                                    armor = 0;
                                }
                                var obj = { "type": "HPandArmor", "postion": nowList, "hp": hp, "armor": armor };
                                mapObject.push(obj);
                            }
                            else {
                                var obj = { "type": "HP", "postion": nowList, "hp": nowValue.value[2] };
                                mapObject.push(obj);
                            }
                        }
                        else {
                            var obj = { "type": nowValue.type, "postion": nowList };
                            mapObject.push(obj);
                        }
                        if (mapObject.length - 1 != nowValue.obj && (nowValue.obj != -1)) {
                            console.log("error:", mapObject.length - 1, " ", nowValue.obj);
                        }
                        if(nowValue.type == "boon_hit"){
                            delayFlag=true;
                        }
                    }
                    // delayResSpeed *= 2;
                    updateObjectGraph();
                    if(delayFlag){
                        onChanging=true;
                    }
                }
                else {
                    mapObjectChange = false;
                    --delayResSpeed;
                    if (delayResSpeed < 0) {
                        onChanging = false;
                    }
                }

                if (!onChanging) {
                    onChanging = false;
                    // console.log(mapObject);
                    ++action_now;
                }
            }
            break;
        }
        // sleep(50);
        if (mapObjectChange == true) {
            updateCanvas();
        }
        ////old///
        if (pipleLineSpeed == 0 && (!onChanged || action_code.length - action_now == 0)) {
            endgame();

        }
    }

}
function updateBackgroundGraph() {
    // backgroundGraph = createGraphics(width, height);
    backgroundGraph.clear();
    backgroundGraph.noStroke();
    var imgDesret = imgObject[parseInt(imgDic["desret"])];
    var imgLawn = imgObject[parseInt(imgDic["lawn"])];
    var imgSea = imgObject[parseInt(imgDic["sea"])];
    // for (var y = 0; y < mapSize; ++y) {
    //     for (var x = 0; x < mapSize; ++x) {
    //         var i = y * mapSize + x;

    //         if (map[i] == '0') {
    //             backgroundGraph.fill('#bafba7');
    //         }
    //         else if (map[i] == '1') {
    //             backgroundGraph.fill('#FFE599');
    //         }
    //         else if (map[i] == '2') {
    //             backgroundGraph.fill('#CCE5FF');
    //         }
    //         else {
    //             console.log(map[i]);
    //         }
    //         backgroundGraph.rect(x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight)    

    //     }
    // }
    for (var y = 0; y < mapSize; ++y) {
        for (var x = 0; x < mapSize; ++x) {
            var i = y * mapSize + x;

            if (map[i] == '0') {
                // backgroundGraph.fill('#bafba7');
                backgroundGraph.image(imgLawn, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else if (map[i] == '1') {
                backgroundGraph.image(imgDesret, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else if (map[i] == '2') {
                backgroundGraph.image(imgSea, x * edgeToWidth, y * edgeToHeight, edgeToWidth, edgeToHeight);
            }
            else {
                console.log(map[i]);
            }
        }
    }
    // backgroundGraph.stroke(0);
    // for (var i = 1; i < mapSize; ++i) {
    //     backgroundGraph.line(0, i * edgeToHeight, width, i * edgeToHeight);
    //     backgroundGraph.line(i * edgeToWidth, 0, i * edgeToWidth, height);
    // }

    for (var i = 0; i < end_init.length; ++i) {
        // var pg = createGraphics(edgeToWidth, edgeToHeight);
        pg.clear();
        pg.push();
        var dx = end_init[i]["postion"][0] * edgeToWidth, dy = end_init[i]["postion"][1] * edgeToHeight, drotate = 360 - end_init[i]["postion"][2] * 90;
        var img = imgObject[parseInt(imgDic[end_init[i]["type"]])];
        pg.translate(pg.width / 2, pg.height / 2);
        pg.rotate(PI / 180 * drotate);
        pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
        backgroundGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);
        pg.pop();
    }
    var img = imgObject[parseInt(imgDic["start"])];
    backgroundGraph.image(img, people_init["postion"][0] * edgeToWidth, people_init["postion"][1] * edgeToHeight, edgeToWidth, edgeToHeight);
}

function updateObjectGraph() {
    HPObject = [];
    // objectGraph = createGraphics(width, height);
    objectGraph.clear();
    for (var i = 0; i < mapObject.length; ++i) {
        var obj = mapObject[i];
        var dx = obj["postion"][0] * edgeToWidth, dy = obj["postion"][1] * edgeToHeight;
        var img = imgObject[parseInt(imgDic[obj["type"]])];
        if (obj["type"] == "arrow" || obj["type"] == "arrowWite" || obj["type"] == "enemyTank") {
            var drotate = 360 - obj["postion"][2] * 90;
            // var pg = createGraphics(edgeToWidth, edgeToHeight);
            pg.clear();
            pg.push();   //   pg.pop();
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
            objectGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);
            pg.pop();
        }
        else if (obj["type"] == "bullet") {
            dx = obj["postion"][0], dy = obj["postion"][1];
            // var drotate = obj["postion"][2] * 90 + 90;

            var drotate = (4 - obj["postion"][2]) * 90 + 90;
            // var drotate = obj["postion"][2] * 90 + 270;
            // var pg = createGraphics(edgeToWidth, edgeToHeight);
            pg.clear();
            pg.push();   //   pg.pop();
            pg.translate(pg.width / 2, pg.height / 2);
            pg.rotate(PI / 180 * drotate);
            pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
            objectGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);
            pg.pop();
        }
        else if (obj["type"] == "unlock2" || obj["type"] == "unlockfail2") {
            dx = obj["postion"][0] * edgeToWidth;
            dy = (obj["postion"][1] - 0.5) * edgeToHeight;

            objectGraph.image(img, dx, dy, edgeToWidth * 1.5, edgeToHeight * 1.5);
        }
        else if (obj["type"] == "HPandArmor" || obj["type"] == "HP") {
            HPObject.push(obj);
        }
        else {
            objectGraph.image(img, dx, dy, edgeToWidth, edgeToHeight);
        }

    }

}
function updatePeopleGraph() {
    // console.log("updatePeopleGraph");
    if (people_init) {
        // peopleGraph = createGraphics(width, height);
        peopleGraph.clear();
        // var pg = createGraphics(edgeToWidth, edgeToHeight);
        pg.clear();
        pg.push();
        var dx = now_PeooleX, dy = now_PeooleY, drotate = now_PeooleEESW;
        var img = imgObject[parseInt(imgDic[people_init["type"]])];
        pg.translate(pg.width / 2, pg.height / 2);
        pg.rotate(PI / 180 * drotate);
        pg.image(img, -edgeToWidth / 2, -edgeToHeight / 2, edgeToWidth, edgeToHeight);
        peopleGraph.image(pg, dx, dy, edgeToWidth, edgeToHeight);

        pg.pop();
    }

}

function updateCanvas() {
    // clear();
    if (haveFoggy) {
        // console.log("sucess");
        var img = imgObject[parseInt(imgDic["foggy"])];
        var peopleFoggyImg = imgObject[parseInt(imgDic["peopleFoggy"])];

        var dx = now_PeooleX - edgeToWidth, dy = now_PeooleY - edgeToHeight;

        var dWidth = edgeToWidth * 3, dHight = edgeToHeight * 3;
        // console.log(dWidth, dHight);
        image(img, 0, 0, width, height);
        image(backgroundGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);
        image(objectGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);
        image(peopleGraph, dx, dy, dWidth, dHight, dx, dy, dWidth, dHight);

        for (let HPi = 0; HPi < HPObject.length; HPi++) {
            var obj = HPObject[HPi];
            var img = imgObject[parseInt(imgDic[obj["type"]])];
            var dx = obj["postion"][0] * edgeToWidth;
            var dy = obj["postion"][1] * edgeToHeight + 0.85 * edgeToHeight;
            hp = obj["hp"];
            if (obj["type"] == "HPandArmor") {
                armor = obj["armor"];
                // console.log(dx, dy, )
                console.log(" hp:", hp, " armor:", armor);
                // fill(0);
                // text(hp, dx+0.35*edgeToWidth, dy);
                // text(armor, dx+0.85*edgeToWidth, dy);
                if (hp >= 10) {//30 40
                    var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    image(d10, dx + 0.3 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.4 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {  //35
                    // var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    // image(d, dx + 0.30 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    if (hp < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.45 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                        image(d, dx + 0.35 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                if (armor >= 10) { //60 70
                    var d10 = imgObject[parseInt(imgDic[Math.floor(armor / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
                    image(d10, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.75 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {
                    if (armor < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                image(img, dx, dy, edgeToWidth, edgeToHeight * 0.15);
            }
            else if (obj["type"] == "HP") {
                /*777777 */
                // console.log(dx, dy, "hp:", hp);
                // fill(0);
                var ndy = dy + 0.10 * edgeToHeight;
                // text(hp, dx+0.65*edgeToWidth, dy);
                if (hp >= 10) {//40 50
                    var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    image(d10, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.55 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {  //45
                    if (hp < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                        image(d, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                image(img, dx, ndy, edgeToWidth, edgeToHeight * 0.15);
            }
        }

        image(peopleFoggyImg, dx, dy, dWidth, dHight);


    }
    else {
        image(backgroundGraph, 0, 0, width, height);
        image(objectGraph, 0, 0, width, height);
        image(peopleGraph, 0, 0, width, height);
        for (let HPi = 0; HPi < HPObject.length; HPi++) {
            var obj = HPObject[HPi];
            var img = imgObject[parseInt(imgDic[obj["type"]])];
            var dx = obj["postion"][0] * edgeToWidth;
            var dy = obj["postion"][1] * edgeToHeight + 0.85 * edgeToHeight;
            hp = obj["hp"];
            if (obj["type"] == "HPandArmor") {
                armor = obj["armor"];
                // console.log(dx, dy, )
                console.log(" hp:", hp, " armor:", armor);
                // fill(0);
                // text(hp, dx+0.35*edgeToWidth, dy);
                // text(armor, dx+0.85*edgeToWidth, dy);
                if (hp >= 10) {//30 40
                    var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    image(d10, dx + 0.3 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.4 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {  //35
                    // var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    // image(d, dx + 0.30 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    if (hp < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.45 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                        image(d, dx + 0.35 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                if (armor >= 10) { //60 70
                    var d10 = imgObject[parseInt(imgDic[Math.floor(armor / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
                    image(d10, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.75 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {
                    if (armor < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(armor % 10).toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                image(img, dx, dy, edgeToWidth, edgeToHeight * 0.15);
            }
            else if (obj["type"] == "HP") {
                /*777777 */
                // console.log(dx, dy, "hp:", hp);
                // fill(0);
                var ndy = dy + 0.10 * edgeToHeight;
                // text(hp, dx+0.65*edgeToWidth, dy);
                if (hp >= 10) {//40 50
                    var d10 = imgObject[parseInt(imgDic[Math.floor(hp / 10).toString()])];
                    var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                    image(d10, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    image(d, dx + 0.55 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                }
                else {  //45
                    if (hp < 0) {
                        var d = imgObject[parseInt(imgDic["0".toString()])];
                        image(d, dx + 0.65 * edgeToWidth, dy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                    else {
                        var d = imgObject[parseInt(imgDic[Math.floor(hp % 10).toString()])];
                        image(d, dx + 0.45 * edgeToWidth, ndy, edgeToWidth * 0.1, edgeToHeight * 0.15);
                    }
                }
                image(img, dx, ndy, edgeToWidth, edgeToHeight * 0.15);
            }
        }
    }
    return true;
}

function codeToCompiler(stringCode) {
    //輸出字串處理
    challengeGameAgain();
    createLoadingView();
    textarea_0 = document.getElementById('textarea_0');
    computeEndCode=textarea_0.value;
    // console.log("stringCode:",textarea_0.value);
    // console.log("stringCode:",stringCode);
    if (stringCode) {
        textarea_0.value = stringCode;
    }
    // console.log("stringCode:",textarea_0.value);
    var addfun = codeValue;
    if (data.extendCode) {
        addfun += data.extendCode;
    }

    var indexof = textarea_0.value.indexOf("int main(");
    var tempStr = textarea_0.value.indexOf("{", indexof);
    var tempBefore = textarea_0.value.substr(0, tempStr + 1);
    var tempAfter = textarea_0.value.substr(tempStr + 1);
    tempBefore += "input_init();";
    tempBefore += tempAfter;
    tempStr = tempBefore;
    tempBefore = addfun + tempStr;
    var mapStr = map;
    // console.log("map為:",mapStr);
    var peopleAtk = equipmentData.weaponLevel[user.weaponLevel].attack;
    var peopleArmor = equipmentData.armorLevel[user.armorLevel].attack;
    console.log(peopleAtk, peopleArmor);
    var peopleStr = people_init["postion"][0].toString() + " " + people_init["postion"][1].toString() + " " + people_init["postion"][2].toString();
    // if (people_init["hp"]) {
    //     peopleStr = peopleStr + " " + people_init["hp"] + " " + people_init["armor"] + " " + people_init["atk"];
    // }
    // else {
    //     peopleStr = peopleStr + " 5  80  20";
    // }
    peopleStr = peopleStr + " 5  " + peopleArmor.toString() + " " + peopleAtk.toString();
    if (people_init["type"] == "car") {
        peopleStr = peopleStr + " 0";
    } else if (people_init["type"] == "tank") {
        peopleStr = peopleStr + " 1";
    }
    else if (people_init["type"] == "bot") {
        peopleStr = peopleStr + " 2";
    }

    // console.log("people初始位置:",peopleStr);
    var endlineStr = end_init.length.toString();
    for (var i = 0; i < end_init.length; ++i) {
        endlineStr = endlineStr + " " + end_init[i]["postion"][0] + " " + end_init[i]["postion"][1] + " " + end_init[i]["postion"][2];
    }
    // console.log("endline數量 [初始位置]:",endlineStr);
    var mpaobjStr = mapObject.length.toString();
    for (var i = 0; i < mapObject.length; ++i) {
        if (mapObject[i]['type'] == 'arrow') { //有方向性的 ex:箭頭
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]["postion"][2];
        }
        else if (mapObject[i]['type'] == 'questionMark') { //問號 要有  n種 隨機 n=2 左右 n=3 f前
            var rand = Math.floor(Math.random() * mapObject[i]['chooseNum'].length);
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1] + " " + mapObject[i]['chooseNum'][rand];
        }
        else if (mapObject[i]['type'] == 'lock' || mapObject[i]['type'] == 'lock2') { //鎖頭 要分  箭頭解鎖 or　輸出解鎖
            mpaobjStr = mpaobjStr + " " + mapObject[i]["unlock"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
        }
        else if (mapObject[i]['type'] == 'enemyTank') { //敵人
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
            mpaobjStr = mpaobjStr + " " + mapObject[i]["postion"][2] + " " + mapObject[i]["hp"] + " " + mapObject[i]["atk"];
        }
        else if (mapObject[i]['type'] == 'treasure') { //寶箱
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
            mpaobjStr = mpaobjStr + " " + mapObject[i]["string"];
        }
        else {
            mpaobjStr = mpaobjStr + " " + mapObject[i]["type"] + " " + mapObject[i]["postion"][0] + " " + mapObject[i]["postion"][1];
        }
    }
    // console.log("mpaobjStr 數量 [初始位置]:",mpaobjStr);
    var str = [mapStr, peopleStr, endlineStr, mpaobjStr].join('\n');
    inputStr = str;
    if (data.input != "z0") {  //為第 6 關  11
        inputStr = inputStr + " " + data.input;
    }
    else {
        inputStr = inputStr + data.input;
    }

    console.log(tempBefore);
    console.log(inputStr);
    // console.log(tempBefore);
    var runInput = inputStr;


    call_JDOODLE_api(tempBefore, runInput);
    // if (decodeMod == 0) {
    // const url = `${runApi}/${lang}?platform=codesheet&args=${encodeURIComponent(runInput)}`;
    //     codeStr = tempBefore;
    //     call_codesheet_Api(url, user1.key, tempBefore);
    // }  //編譯結果在  decodeOutput
    // else {
    //     console.log("要用 JDOODLE_api 編譯了QQ");
    //     call_JDOODLE_api(tempBefore, runInput);

    // }  //編譯結果在  decodeOutput
}
function clearcodeAndInit() {
    // console.log(initCode);
    textarea_0.value = initCode;
}

function codeOutputTranstionAction() {
    var source = decodeOutput;
    console.log(source);

    // var temp = new Array();
    var temp = [], tempNew = [];
    temp = source.split("$");
    // console.log(temp);
    for (var i = 0; i < temp.length; ++i) {
        if (temp[i][0] != ' ') {
            if (temp[i][0] != 'I') {
                var spaceT = temp[i].split(' ');
                tempNew.push(spaceT[0]);
            }
            else {
                // console.log("77777777");
                // console.log(temp[i]);
                tempNew.push(temp[i]);
            }
        }
    }
    // temp = tempNew.slice(0);
    temp.length = 0;

    // textarea_1.value = tempNew.join('\n');
    textarea_1.value = decodeOutput;
    closeLoadingView();
    var forgetDel = 0;

    for (var i = 0; i < tempNew.length; ++i) {
        var spaceT = tempNew[i].split(",,");
        if (spaceT.length < 2) {
            continue;
        }

        if (spaceT[0] == 'M') {
            var spaceList = [];
            for (var di = 1; di < spaceT.length; di = di + 2) {
                var tempList = spaceT[di + 1].split(',');
                var x = parseFloat(tempList[0]);
                var y = parseFloat(tempList[1]);
                var z = parseInt(tempList[2]);
                if (parseInt(spaceT[di]) == -1) {
                    var listTranstion = {
                        obj: parseInt(spaceT[di]),
                        value: [x, y, z]
                    }
                    spaceList.push(listTranstion);
                }
                else {
                    var listTranstion = {
                        obj: parseInt(spaceT[di]) - forgetDel,
                        value: [x, y, z]
                    }
                    spaceList.push(listTranstion);
                }

            }
            var spaceTranstion = {
                type: "M",
                value: spaceList
            }
            temp.push(spaceTranstion);
        }
        else if (spaceT[0] == 'C') {
            var spaceList = [], waitD = [];
            var conditionD = true;
            var loopCount = 0;
            while (conditionD) {
                console.log(spaceT);
                for (var di = 1; di < spaceT.length; di = di + 2) {
                    var o = parseInt(spaceT[di]) - forgetDel;
                    var o = parseInt(spaceT[di]) - forgetDel;
                    if (loopCount > 0 && parseInt(spaceT[di]) == -1) {
                        o = -1 - loopCount;
                    }
                    var listTranstion = {
                        obj: o + loopCount,
                        type: spaceT[di + 1]
                    }
                    spaceList.push(listTranstion);
                }
                var ssi = i + 1, ssj = i + 2;
                if (ssj < tempNew.length) {
                    var sstemp = tempNew[ssi].split(",,");
                    var sstempJ = tempNew[ssj].split(",,");
                    if (sstemp[0] == 'D' && sstempJ[0] == 'C') {
                        waitD.push(tempNew[ssi]);
                        i = ssj;
                        spaceT = tempNew[i].split(",,");
                    }
                    else {
                        conditionD = false;
                        break;
                    }
                }
                else {
                    conditionD = false;
                    break;
                }
                ++loopCount;
            }
            var spaceTranstion = {
                type: "C",
                value: spaceList
            }
            temp.push(spaceTranstion);
            if (waitD.length > 0) {
                var spaceListD = [];
                for (var sdi = 0; sdi < waitD.length; ++sdi) {
                    spaceT = waitD[sdi].split(",,");
                    for (var di = 1; di < spaceT.length; di++) {
                        var tempList = spaceT[di];
                        var listTranstion = {
                            obj: parseInt(tempList) - forgetDel
                        }
                        spaceListD.push(listTranstion);
                    }
                }
                var spaceTranstionD = {
                    type: "D",
                    value: spaceListD
                }
                temp.push(spaceTranstionD);
            }
        }
        else if (spaceT[0] == 'I') {
            // var o = parseInt(spaceT[1]);
            var o = -1, tlx, tly;
            var tempList = spaceT[1].split(',');
            for (let ssi = 0; ssi < mapObject.length && o < 0; ssi++) {
                // console.log(mapObject[ssi].type);
                if (mapObject[ssi].type == "lock2") {
                    tlx = parseInt(tempList[0]);
                    tly = parseInt(tempList[1]);
                    // console.log(tlx, tly);
                    if (mapObject[ssi].postion[0] == tlx && mapObject[ssi].postion[1] == tly) {
                        o = ssi;
                        break;
                    }
                }
            }
            if (o > -1 && spaceT[2].length > 1) {
                // console.log(mapObject[o - forgetDel].ans ,"  ",spaceT[2]);
                var conditionAns = true;
                var inputList = [];
                // if (spaceT[2].indexOf('') > -1) { //c++的空白
                //     let s=spaceT[2].split('');
                //     for (let indexS = 0; indexS < s.length; indexS++) {
                //         var element = s[indexS];
                //         let temp=element[2].split(' ');
                //         for (let indexST = 0; indexST < temp.length; indexST++) {
                //             inputList.push(temp[indexST]);
                //         }
                //     }
                // }
                // else{
                //     inputList = spaceT[2].split(' ');
                // }
                var indexSpace = spaceT[2].indexOf('');
                // while(indexSpace>-1){
                //     console.log(indexSpace,spaceT[2][indexSpace]);
                //     spaceT[2] = spaceT[2].substr(0, indexSpace-1) + ' ' + spaceT[2].substring(indexSpace+1, spaceT[2].length);
                //     // spaceT[2][indexSpace]=" ";
                //     console.log(indexSpace,spaceT[2],spaceT[2][indexSpace]);
                //     indexSpace=spaceT[2].indexOf('');
                // }
                var ns = "";
                if (indexSpace > -1) {
                    for (let indexS = 0; indexS < spaceT[2].length; indexS++) {
                        if (spaceT[2][indexS] == '') {
                            ns = ns + " ";
                        }
                        else {
                            ns = ns + spaceT[2][indexS];
                        }
                    }
                }
                else {
                    ns = spaceT[2];
                }
                spaceT[2] = ns;
                inputList = spaceT[2].split(' ');


                //

                var ansList = mapObject[o].ans.split(' ');
                console.log("ans:", ansList);
                console.log("input:", inputList);
                // console.log(inputList,ansList);
                for (let ansI = 0; ansI < ansList.length; ansI++) {
                    if (ansList[ansI].length < 1) {
                        ansList.splice(ansI, 1);
                        --ansI;
                        continue;
                    }
                    var haveA = false;
                    for (var inputI = 0; inputI < inputList.length; ++inputI) {
                        if (inputList[inputI].length < 1) {
                            inputList.splice(inputI, 1);
                            --inputI;
                            continue;
                        }
                        if (inputList[inputI] == ansList[ansI]) {
                            inputList.splice(inputI, 1);
                            haveA = true;
                            break;
                        }
                    }
                    if (haveA == false) {
                        conditionAns = false;
                        break;
                    }
                }
                // console.log(inputList,ansList,conditionAns);
                for (let sindex = 0; sindex < inputList.length; sindex++) {
                    if (inputList[sindex].length < 1) {
                        inputList.splice(sindex, 1);
                        --sindex;
                        continue;
                    }
                }

                console.log("ans:", ansList);
                console.log("input:", inputList);
                if (inputList.length > 0) {
                    conditionAns = false;
                }
                if (conditionAns) {
                    var listTranstion = {
                        obj: o,
                        type: "unlock2"
                        , x: tlx,
                        y: tly
                    }
                    var spaceTranstion = {
                        type: "C",
                        value: [listTranstion]
                    }
                    temp.push(spaceTranstion);
                    listTranstion = {
                        obj: o,
                        x: tlx,
                        y: tly,
                    }
                    spaceTranstion = {
                        type: "D",
                        value: [listTranstion]
                    }
                    temp.push(spaceTranstion);
                    ++forgetDel;
                }
                else {
                    var listTranstion = {
                        obj: o,
                        x: tlx,
                        y: tly,
                        type: "unlockfail2"
                    }
                    var spaceTranstion = {
                        type: "C",
                        value: [listTranstion]
                    }
                    temp.push(spaceTranstion);
                    var listTranstion = {
                        obj: o,
                        x: tlx,
                        y: tly,
                        type: "lock2"
                    }
                    var spaceTranstion = {
                        type: "C",
                        value: [listTranstion]
                    }
                    temp.push(spaceTranstion);
                }

            }

        }
        else if (spaceT[0] == 'A') {
            var spaceList = [];
            for (var di = 1; di < spaceT.length; di = di + 2) {
                var tempList = spaceT[di + 1].split(',');
                var x = parseInt(tempList[0]);
                var y = parseInt(tempList[1]);
                var z = parseInt(tempList[2]);
                var listTranstion = {
                    obj: parseInt(spaceT[di]) - forgetDel,
                    value: [x, y, z],
                    type: tempList[3]
                }
                spaceList.push(listTranstion);
            }
            var spaceTranstion = {
                type: "A",
                value: spaceList
            }
            temp.push(spaceTranstion);
        }
        else if (spaceT[0] == 'D') {
            var spaceList = [];
            var conditionD = true;
            while (conditionD) {
                for (var di = 1; di < spaceT.length; di++) {
                    var tempList = spaceT[di];
                    var listTranstion = {
                        obj: parseInt(tempList) - forgetDel,
                        forgetDel: forgetDel
                    }
                    spaceList.push(listTranstion);
                }
                var ssi = i + 1;
                if (ssi < tempNew.length) {
                    var sstemp = tempNew[ssi].split(",,");
                    if (sstemp[0] == 'D') {
                        i = ssi;
                        spaceT = tempNew[i].split(",,");
                    }
                    else {
                        conditionD = false;
                        break;
                    }
                }
                else {
                    conditionD = false;
                    break;
                }
            }
            var spaceTranstion = {
                type: "D",
                value: spaceList
            }
            temp.push(spaceTranstion);
        }
        else if (spaceT[0] == 'W') {
            var spaceTranstion = {
                type: "W",
            }
            temp.push(spaceTranstion);
        }
        else if (spaceT[0] == 'E') {
            var spaceTranstion = {
                type: "E",
                value: parseInt(spaceT[1])
            }
            temp.push(spaceTranstion);
        }
        else {
            console.log("error Type: ", spaceT);
        }


    }
    // temp = tempNew.slice(0);
    // timeD = new Date().getTime();
    if (temp.length > 0) {
        onChanged = true;
        onChanging = false;
        action_code = temp;
        gameEndingCode = 0;
        action_now = 0;
        console.log(action_code);
    }
    else {
        action_code = [];
        gameEndingCode = 0;
        onChanged = false;
        onChanging = false;
        textarea_1.value = "";
        endgame();
    }

}



function call_codesheet_Api(url, apiKey, code) {
    fetch(url, {
        method: 'post',
        headers: { 'x-api-key': apiKey },
        //   body: platformMap[platform]['pages'][page].getCode()
        body: code
    })
        .then(res => res.json())
        .then((resp) => {
            decode_codesheet_api(resp);
        })
        .catch((error) => {
            console.error('Error:', error);
            iscodesheetTeseLive = false;
            decodeMod = 1;
            console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
            // console.log("test output " + code);
            call_JDOODLE_api(code, inputStr);
        })
}
function decode_codesheet_api(resp) {
    if (resp.status === 'Successful') {
        // runOutput.classList.remove('error')
        // runOutput.value = resp.stdout || resp.stderr
        decodeOutput = resp.stdout;
        if (iscodesheetTeseLive == false) {
            var test_codesheet = decodeOutput.indexOf("system_test_codesheet_sucess");
            if (test_codesheet > -1) {
                decodeMod = 0;
                iscodesheetTeseLive = true;
                console.log("test_codesheet Api is live_sucess");
            }
            else {
                console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
                decodeMod = 1;
            }
        }
        else {
            codeOutputTranstionAction()
        }
    } else if (resp.status === 'Failed' || resp.status === 'BadRequest' || resp.message === 'Forbidden') {
        console.log('Run response', resp);
        // runOutput.value = `Failed: ${resp.error}${resp.stdout}` // stdout for php which puts error in stdout
        resp.stdout = "compiler error";
        if (iscodesheetTeseLive == false) {
            console.log("test_codesheet Api is dead  切換為 JDOODLE_Api _fail");
            decodeMod = 1;
        } else {
            if (reap.status === "Failed" && reap.stderr === "" && reap.stdout === "compiler error") {
                decodeMod = 1;
                call_JDOODLE_api(codeStr, inputStr);
            }
            else {
                textarea_1.value = "";
                gameEndingCode = 5;
                console.log("Error =  compiler error");
                endgame();
            }
        }
    } else {
        call_JDOODLE_api(codeStr, inputStr);
    }
    // runBtn.disabled = false // enable run button
}


function call_JDOODLE_api(scriptData, inputData) {
    var scriptData = {
        input: inputData,
        script: scriptData,
        language: "cpp",
        id: "001"
    }
    // console.log(scriptData);
    var socket = io();
    socket.emit('script', scriptData);
    //   output.innerHTML = "編譯中....\n";
    socket.on('answer', function (obj) {
        console.log(obj);

        if (obj.body.cpuTime != null && obj.body.memory != null) {
            //   output.innerHTML = "輸出:\n" + obj.body.output;
            decode_JDOODLE_api(obj.body.output)
        }
        else {
            gameEndingCode = 5;
            if (obj.body.output != null) {
                if (obj.body.output.indexOf("JDoodle - output Limit reached.") > -1) {
                    gameEndingCode = 8;
                }
                else{
                    errMessage="錯誤原因:\n"+obj.body.output.substr(1)
                }
            }
            
            closeLoadingView();
            console.log("Error =  compiler error");
            endgame();
        }

    });
}
function decode_JDOODLE_api(str) {
    // console.log(str);
    decodeOutput = str;
    codeOutputTranstionAction();
}

function challengeGameAgain() {
    data = JSON.parse(JSON.stringify(Res_data));
    // loadData();
    var dx = people_init["postion"][0] * edgeToWidth, dy = people_init["postion"][1] * edgeToHeight, drotate = 360 - people_init["postion"][2] * 90;
    old_PeooleX = dx, old_PeooleY = dy, old_PeooleEESW = drotate;
    now_PeooleX = dx, now_PeooleY = dy, now_PeooleEESW = drotate;
    edgeToWidth = width / mapSize;
    edgeToHeight = height / mapSize;
    iscreatecanvas = 1;
    action_now = 0;

    let mapNumber = data;
    if (mapNumber.foggy) {
        haveFoggy = true;
    }
    else {
        haveFoggy = false;
    }
    map = mapNumber['mapValue'];
    mapSize = Math.sqrt(mapNumber['mapSize']);
    people_init = mapNumber['people_init'];
    end_init = mapNumber['end_init'];
    mapObject = mapNumber['obj'];
    mapwinLinit = mapNumber['winLinit'];

    // peopleGraph = createGraphics(width, height);
    // objectGraph = createGraphics(width, height);
    // backgroundGraph = createGraphics(width, height);
    // pg = createGraphics(edgeToWidth, edgeToHeight);
    peopleGraph.clear();
    objectGraph.clear();
    backgroundGraph.clear();
    pg.clear();
    updateBackgroundGraph();
    updateObjectGraph();
    updatePeopleGraph();
    //
    updateCanvas();
    gameEndingCode = 0;
    decodeOutput = "";
    action_code = [];
    action_now = 0;
    finishCoin = true;
}


/*btn1.onclick = function () {
    challengeGameAgain();

    textarea_1.value = "   .....編譯中~請稍後....."
    codeToCompiler();

    //測試用//
    // decodeOutput = textarea_1.value
    // codeOutputTranstionAction();
    ////

}*/
var colleges = ['01', '02', '03', '04', '05',
    '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25',
    '26', '27', '28', '29',
    '30', '31', '32', '33', '34',
    '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44',
    '45', '46', '47', '48', '49', '50', 'test', 'T2', 'T1'];

function changeCollege(index) {
    console.log(index);

    action_code = [];
    onChanged = false;

    mapNum = colleges[index];

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            Res_data = JSON.parse(JSON.stringify(data));
            // console.log(data);

            for (var timeC = 0; timeC < 10; ++timeC) {
                loadData();
                updateCanvas();
            }
        }
    };
    var url = "gameNew/gameNew/json/map/map" + mapNum + ".json";
    // console.log(url);
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


    // // loadData();

    return 0;
}
