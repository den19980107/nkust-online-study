if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function () {

  // cache window 物件
  var win = window.top || window;

  // 將資料都存入 window.name 這個 property
  var store = (win.name ? JSON.parse(win.name) : {});

  // 將要存入的資料轉成 json 格式
  function Save() {
    win.name = JSON.stringify(store);
  };

  // 在頁面 unload 的時候將資料存入 window.name
  if (window.addEventListener) window.addEventListener("unload", Save, false);
  else if (window.attachEvent) window.attachEvent("onunload", Save);
  else window.onunload = Save;

  // public methods
  return {

    // 設定一個 session 變數
    set: function (name, value) {
      store[name] = value;
    },

    // 列出指定的 session 資料
    get: function (name) {
      return (store[name] ? store[name] : undefined);
    },

    // 清除資料 ( session )
    clear: function () { store = {}; },

    // 列出所有存入的資料
    dump: function () { return JSON.stringify(store); }

  };

})();
function back() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
    if (href[i] == '/' || href[i] == "\\") {
      index = i;
    }
  }
  href = href.substr(0, index + 1);
  href += "oblivion";
  window.location.replace(href);
  // console.log(href);
}
var href = window.location.href;
var user, equipmentData, achievemenData, dictionaryData, levelDivAlive = false, isOblivionUserOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed, shelfSwitch = 0;
var musicData;
var userMap;

createLoadingMainView("centerLost");
createMainDescription() ;
var scriptData = {
  type: "init"
}

$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  async: false,
  success: function (res) {
    // console.log(res);
    user = res;
    /*loadmusicData();*/
    // console.log(user);
    initHome();
  }
})
closeMainLoadingView();
function error() {
  // alert("有不當的操作發生");
  remindView("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  if (Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null) {
    bkMusicVolumn = Session.get("bkMusicVolumn");
    bkMusicSwitch = Session.get("bkMusicSwitch");
    musicLevel = Session.get("musicLevel");
    gameSpeed = Session.get("gameSpeed");
  } else {
    bkMusicVolumn = 0.1;
    bkMusicSwitch = 2;
    musicLevel = 1;
    gameSpeed = 5;
  }
  myVid = document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
  myVid.play();
  bkMusicSwitch++;
  // console.log(myVid.volume);
  //sendSession();
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  levelUpLevel = user.levelUpLevel;
  swordLevel = user.weaponLevel;
  shieldLevel = user.armorLevel;
  try {
    isOblivionUserOpen = Session.get("isOblivionUserOpen");
  } catch (e) {
    isOblivionUserOpen = false;
  }
  if (!isOblivionUserOpen) {
    helper('createrDiv');
  }
  sendLoadUsernameMap();
}
function logout() {
  // console.log("dddddd");
  var href = "/logout";
  window.location.replace(href);
}

//////////////////////////////////////////////////
//              left.js                        //
//////////////////////////////////////////////////
/*小幫手*/
function helper(mainDiv) {
  var thisLevelNum = 1;
  var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  isOblivionUserOpen = true;
  sendSession();
  divTag = document.getElementById(mainDiv);
  if (levelDivAlive) {
    divTag = document.getElementById("helperView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    divTag = document.getElementById("helperBkView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById(mainDiv);
  }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "helperBkView");
  b.setAttribute("onclick", "clossFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  divTag = document.getElementById(mainDiv);
  b = document.createElement("div");
  b.setAttribute("id", "helperView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("helperView");
  divTag.innerHTML = "";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "說明";
  if (selectMod == 2) {
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea1");
    divTag.appendChild(b);
    /*設定文字塊一*/
    document.getElementById("helperTextarea1").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;

    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv1");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv1");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg1");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img1);
    divTag.appendChild(b);

    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperImgDiv2");
    divTag.appendChild(b);
    divTag = document.getElementById("helperImgDiv2");
    b = document.createElement("img");
    b.setAttribute("id", "helperImg2");
    b.setAttribute("class", "helperImg");
    b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
    divTag.appendChild(b);

    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea2");
    divTag.appendChild(b);
    /*設定文字塊二*/
    document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
  } else if (selectMod == 1) {
    divTag = document.getElementById("helperView");
    b = document.createElement("div");
    b.setAttribute("id", "helperTextarea3");
    divTag.appendChild(b);
    document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
  }
}

/*XX按鈕*/
function clossFunc(thisDiv, thisDiv2) {
  var divTag = document.getElementById(thisDiv);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById(thisDiv2);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  levelDivAlive = false;
}

//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var myVid;
var divID, divID2, divTag, b;
var userdataFont;
var dataTitle = ["帳&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp號：",
  "使用者名稱：",
  "主&nbsp要&nbsp進&nbsp&nbsp度：",
  "成&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp就：",
  "上架地圖數：",
  "已獲得星星數："];
function userData() {
  try {
    divTag = document.getElementById("userDataView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("userDataBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divID = "userDataView";
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "userDataBkView");
  b.setAttribute("onclick", "clossFunc(\"userDataView\",\"userDataBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "userDataView");
  divTag.appendChild(b);
  divTag = document.getElementById("userDataView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"userDataView\",\"userDataBkView\")");
  divTag.appendChild(b);
  createUserView(divID);
}
function createUserView(mainDiv) {
  divTag = document.getElementById(mainDiv);
  b = document.createElement("h1");
  b.setAttribute("id", "userTitle");
  divTag.appendChild(b);
  document.getElementById("userTitle").innerHTML = "個人資料";
  b = document.createElement("div");
  b.setAttribute("id", "userInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("userInnerDiv");
  b = document.createElement("div");
  b.setAttribute("id", "userH3Div");
  divTag.appendChild(b);
  divTag = document.getElementById("userH3Div");
  b = document.createElement("table");
  b.setAttribute("id", "userTable");
  divTag.appendChild(b);
  for (var i = 0; i < dataTitle.length; i++) {
    divTag = document.getElementById("userTable");
    b = document.createElement("tr");
    b.setAttribute("id", "userTr" + i);
    divTag.appendChild(b);
    if (i == 0) {
      userdataFont = user.username;
    } else if (i == 1) {
      userdataFont = user.name;
    } else if (i == 2) {
      if (user.MediumEmpire.HighestLevel > user.EasyEmpire.codeHighestLevel || user.MediumEmpire.HighestLevel > user.EasyEmpire.blockHighestLevel) {
        userdataFont = "庫魯瑪帝國-第" + user.MediumEmpire.HighestLevel + "關";
      } else {
        if (user.EasyEmpire.codeHighestLevel > user.EasyEmpire.blockHighestLevel) {
          userdataFont = "普魯斯帝國-第" + user.EasyEmpire.codeHighestLevel + "關";
        } else {
          userdataFont = "普魯斯帝國-第" + user.EasyEmpire.blockHighestLevel + "關";
        }
      }
    } else if (i == 3) {
      var getAchievement = Session.get("getAchievement");
      if (getAchievement == undefined) {
        getAchievement = 0;
        // console.log("this is undefine");
      }
      userdataFont = getAchievement + "/9";
    } else if (i == 4) {
      userdataFont = user.createMap.length;
    } else if (i == 5) {
      userdataFont = user.starNum;
    }
    // document.getElementById("titleDatah3" + i).innerHTML = dataTitle[i] + userdataFont;
    for (var j = 0; j < 2; j++) {
      divTag = document.getElementById("userTr" + i);
      b = document.createElement("td");
      if (j % 2 == 0) {
        b.innerHTML = dataTitle[i];
      } else {
        b.innerHTML = userdataFont;
      }
      divTag.appendChild(b);
    }
  }
}

var thisSelectionId;
var args;
var divTag, level;
var lastObject = null, lastColor;

function selectionLevel(thisObject) {
  if (lastObject != null) {
    lastObject.style.backgroundColor = lastColor;
  }
  lastColor = thisObject.style.backgroundColor;
  thisSelectionId = thisObject.id;
  thisObject.style.backgroundColor = "#7f73bf";
  lastObject = thisObject;
  // console.log(document.getElementById(thisSelectionId).rows[1]);
  // console.log(thisSelectionId);
}

/*設定*/
function settingAllView(mainDiv) {
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "helperBkView");
  b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "settingAllView");
  divTag.appendChild(b);
  divTag = document.getElementById("settingAllView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "設定";
  b = document.createElement("table");
  b.setAttribute("id", "settingAllTable");
  divTag.appendChild(b);

  /*設定音樂開或關*/
  divTag = document.getElementById("settingAllTable");
  b = document.createElement("tr");
  b.setAttribute("id", "setTr0");
  divTag.appendChild(b);
  divTag = document.getElementById("setTr0");
  b = document.createElement("td");
  b.setAttribute("id", "setRow0_0");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow0_0");
  b = document.createElement("h2");
  b.setAttribute("id", "settingMusic");
  divTag.appendChild(b);
  document.getElementById("settingMusic").innerHTML = "遊戲音樂";
  divTag = document.getElementById("setTr0");
  b = document.createElement("td");
  b.setAttribute("id", "setRow0_1");
  b.setAttribute("colspan", "2");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow0_1");
  b = document.createElement("form");
  b.setAttribute("id", "musicForm");
  b.setAttribute("name", "form1");
  divTag.appendChild(b);
  divTag = document.getElementById("musicForm");
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "musicOpen");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "return chk(this);");
  if (bkMusicSwitch == 2) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "openText");
  divTag.appendChild(b);
  document.getElementById("openText").innerHTML = "開";
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "musicClose");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "return chk(this);");
  if (bkMusicSwitch == 1) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "closeText");
  divTag.appendChild(b);
  document.getElementById("closeText").innerHTML = "關";
  /*設定音量大小*/
  divTag = document.getElementById("settingAllTable");
  b = document.createElement("tr");
  b.setAttribute("id", "setTr1");
  divTag.appendChild(b);
  divTag = document.getElementById("setTr1");
  b = document.createElement("td");
  b.setAttribute("id", "setRow1_0");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow1_0");
  b = document.createElement("h2");
  b.setAttribute("id", "musicVolume");
  divTag.appendChild(b);
  document.getElementById("musicVolume").innerHTML = "音樂大小";
  divTag = document.getElementById("setTr1");
  b = document.createElement("td");
  b.setAttribute("id", "setRow1_1");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow1_1");
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelDown()');
  b.setAttribute('value', '-');
  divTag.appendChild(b);

  divTag = document.getElementById("setTr1");
  b = document.createElement("td");
  b.setAttribute("id", "setRow1_2");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow1_2");
  b = document.createElement("div");
  b.setAttribute('id', 'musicVolumeDiv');
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeDiv");
  b = document.createElement("table");
  b.setAttribute("id", "musicVolumeTable");
  b.setAttribute("rules", "rows");
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeTable");
  b = document.createElement("tr");
  b.setAttribute("id", "musicVolumeTr");
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeTr");
  for (var i = 0; i < 10; i++) {
    b = document.createElement("td");
    b.setAttribute("id", "musicVolumeTd" + i);
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeTd" + i);
    b = document.createElement("div");
    if (i == 0) {
      b.setAttribute('class', 'musicVolumeInnerDiv');
      b.setAttribute('id', 'musicVolumeInnerDiv' + i);
    } else {
      b.setAttribute('class', 'musicVolumeInnerDivDefault');
      b.setAttribute('id', 'musicVolumeInnerDiv' + i);
    }
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeTr");
  }

  divTag = document.getElementById("setTr1");
  b = document.createElement("td");
  b.setAttribute("id", "setRow1_3");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow1_3");
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelUp()');
  b.setAttribute('value', '+');
  divTag.appendChild(b);

  /*調整遊戲速度*/
  divTag = document.getElementById("settingAllTable");
  b = document.createElement("tr");
  b.setAttribute("id", "setTr2");
  divTag.appendChild(b);
  divTag = document.getElementById("setTr2");
  b = document.createElement("td");
  b.setAttribute("id", "setRow2_0");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow2_0");
  b = document.createElement("h2");
  b.setAttribute("id", "settingSpeed");
  divTag.appendChild(b);
  document.getElementById("settingSpeed").innerHTML = "遊戲速度";
  divTag = document.getElementById("setTr2");
  b = document.createElement("td");
  b.setAttribute("id", "setRow2_1");
  b.setAttribute("colspan", "2");
  divTag.appendChild(b);
  divTag = document.getElementById("setRow2_1");
  b = document.createElement("form");
  b.setAttribute("id", "speedForm");
  b.setAttribute("name", "form2");
  divTag.appendChild(b);
  divTag = document.getElementById("speedForm");
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedLow");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "return chk2(this);");
  if (gameSpeed == 3) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "speedLowText");
  divTag.appendChild(b);
  document.getElementById("speedLowText").innerHTML = "慢";
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedMid");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "return chk2(this);");
  if (gameSpeed == 5) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "speedMidText");
  divTag.appendChild(b);
  document.getElementById("speedMidText").innerHTML = "中";
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedQuick");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "3");
  b.setAttribute("onclick", "return chk2(this);");
  if (gameSpeed == 7) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "speedQuickText");
  divTag.appendChild(b);
  document.getElementById("speedQuickText").innerHTML = "快";

  for (var i = 0; i < musicLevel; i++) {
    b = document.getElementById("musicVolumeInnerDiv" + i);
    b.className = "musicVolumeInnerDiv";
  }
}
function musicLevelUp() {
  b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
  if (musicLevel <= 9) {
    b.className = "musicVolumeInnerDiv";
    musicLevel++;
  }
  if (musicLevel > 9) {
    musicLevel = 10;
  }
  myVid = document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  // console.log("音量=" + bkMusicSwitch * (musicLevel * bkMusicVolumn));
  bkMusicSwitch++;
  sendSession();
}
function musicLevelDown() {
  if (musicLevel < 9) {
    b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
    b.className = "musicVolumeInnerDivDefault";
    musicLevel--;
    if (musicLevel < 0) {
      musicLevel = 0;
    }
  } else if (musicLevel == 9) {
    b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
    b.className = "musicVolumeInnerDivDefault";
    musicLevel--;
  } else if (musicLevel > 9) {
    musicLevel--;
    b = document.getElementById("musicVolumeInnerDiv" + musicLevel);
    b.className = "musicVolumeInnerDivDefault";
  }
  myVid = document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  bkMusicSwitch++;
  sendSession();
}

function chk(input) {
  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  myVid = document.getElementById("bkMusic");
  if (input.id == "musicOpen") {
    bkMusicSwitch = 2;
  } else {
    bkMusicSwitch = 1;
  }
  myVid.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  bkMusicSwitch++;
  sendSession();
  return true;
}
function chk2(input) {
  for (var i = 0; i < document.form2.c1.length; i++) {
    document.form2.c1[i].checked = false;
  }
  input.checked = true;
  if (input.id == "speedLow") {
    gameSpeed = 3;
  } else if (input.id == "speedMid") {
    gameSpeed = 5;
  } else if (input.id == "speedQuick") {
    gameSpeed = 7;
  }
  sendSession();
  return true;
}
function sendSession() {
  // console.log("bkMusicSwitch:" + bkMusicSwitch);
  // console.log("musicLevel:" + musicLevel);
  // console.log("bkMusicVolumn:" + bkMusicVolumn);
  // console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  Session.set("isOblivionUserOpen", isOblivionUserOpen);
  return;
}

var reciprocalDate = [];

function sendLoadUsernameMap() {
  var scriptData = {
    type: "LoadUsernameMap",
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    async: false,
    success: function (res) {
      // console.log(res);
      userMap = res;
      var mapData = [];
      res = res.reverse();
      for (let index = 0; index < res.length; index++) {
        var obj = res[index], check = "X", post = "X";//△ ⌛
        if (obj.postStage == 1) {
          post = "⌛"; //代發佈
        }
        else if (obj.postStage == 2) {
          post = "✔"; //發佈
        }
        else if (obj.postStage == 3) {
          post = "△"; //已發布
        }
        if (obj.check) {
          check = "✔";
        }
        var avgScore = obj.avgScore, avgScoreStr;
        if (avgScore == 0) {
          avgScoreStr = "--/";
        }
        else {
          avgScoreStr = avgScore.toString() + "/";
        }
        if (obj.score.length == 0) {
          avgScoreStr += "--";
        }
        else {
          avgScoreStr += obj.score.length;
        }
        var updateDate, postDate;
        var data = new Date(obj.updateDate);
        var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
        updateDate = year.toString() + "/" + month.toString() + "/" + day.toString();
        if (obj.postDate.length > 0) {
          var data = new Date(obj.postDate);
          if (obj.postStage == 1) {
            var nowDate = new Date();
            var time = data.getTime() - nowDate.getTime();
            var hours = parseInt(time / (1000 * 60 * 60));
            if (hours < 24) {
              if (hours <= 0) {
                var minutes = parseInt(time / (1000 * 60));
                postDate = "倒數" + minutes + "分鐘";
              }
              else {
                postDate = "倒數" + hours + "小時";
              }
            }
            else {
              postDate = "大於一天上架";
            }
            if(reciprocalDate){
              reciprocalDate.push(index);
            }
            else{
              reciprocalDate=[];
              reciprocalDate.push(index);
            }
          }
          else {
            var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
            postDate = year.toString() + "/" + month.toString() + "/" + day.toString();
          }
        }
        else {
          postDate = "--------"
        }
        var script = {
          td01: post,
          td02: check,
          td03: obj.mapName,
          td04: obj.requireStar,
          td05: avgScoreStr,
          td06: updateDate,
          td07: postDate,
        }
        mapData.push(script);
      }
      createLevelTable(mapData);
    }
  })
}
/*建立表格*/
function createLevelTable(scriptData) {
  // console.log(scriptData);
  for (var i = 0; i < scriptData.length; i++) {
    var obj = scriptData[i];
    divTag = document.getElementById("createrDiv");
    b = document.createElement("table");
    b.setAttribute("id", "lostUserCreateTable" + i);
    b.setAttribute("class", "lostUserCreateTable");
    b.setAttribute("border", "5");
    b.setAttribute("RULES", "ALL");
    b.setAttribute("onclick", "selectionLevel(this)");
    divTag.appendChild(b);

    divTag = document.getElementById("lostUserCreateTable" + i);
    if ((i % 2) == 0) {
      divTag.style.backgroundColor = "#BDD5D5";
    } else {
      divTag.style.backgroundColor = "#D6E5E5";
    }
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    // var isShelf = true, imgSrc = "";
    divTag = document.getElementById("tr" + i);
    for (var j = 1; j <= 8; j++) {
      b = document.createElement("td");
      b.setAttribute("id", "td0" + i + j);
      b.setAttribute("class", "td0" + j);
      divTag.appendChild(b);
      if (j == 1) {
        document.getElementById("td0" + i + j).innerHTML = obj.td01;
      } else if (j == 2) {
        document.getElementById("td0" + i + j).innerHTML = obj.td02;
      } else if (j == 3) {
        document.getElementById("td0" + i + j).innerHTML = obj.td03;
      } else if (j == 4) {
        document.getElementById("td0" + i + j).innerHTML = obj.td04;
      } else if (j == 5) {
        document.getElementById("td0" + i + j).innerHTML = obj.td05;
      } else if (j == 6) {
        document.getElementById("td0" + i + j).innerHTML = obj.td06;
      } else if (j == 7) {
        document.getElementById("td0" + i + j).innerHTML = obj.td07;
      } else if (j == 8) {
        divTag = document.getElementById("td0" + i + j);
        /*上架按鈕*/     /*備註:要改成下架按鈕 把class改成unShelfBtn*/    /*要改成不能按的按紐請參考if(isShelf)加上"disabled"記得兩個class中間要有空白*/
        b = document.createElement("input");
        b.setAttribute("type", "button");
        b.setAttribute("id", "shelfBtn" + i + j);
        // b.setAttribute("onclick", "shelfBtn()");
        divTag.appendChild(b);

        if (userMap[i].check == false) {
          b = document.getElementById("shelfBtn" + i + j);
          b.className = "shelfBtn " + "disabled";
          b.setAttribute("onclick", "shelfMap(this)");
        }
        else if (userMap[i].check == true && userMap[i].postStage == 1) {
          b = document.getElementById("shelfBtn" + i + j);
          b.className = "unShelfBtn";
          // b.setAttribute("onclick", "unShelf(this)");
          b.setAttribute("onclick", "checkView(\"下架地圖\",this)");
        }
        else if (userMap[i].check == true && userMap[i].postStage == 2) {
          b = document.getElementById("shelfBtn" + i + j);
          b.className = "unShelfBtn";
          b.setAttribute("onclick", "checkView(\"下架地圖\",this)");
        }
        else if (userMap[i].check == true) {
          b = document.getElementById("shelfBtn" + i + j);
          b.className = "shelfBtn";
          b.setAttribute("onclick", "shelfMap(this)");
        }
        else {
          // console.log("錯誤" + userMap[i].check.toString() + "," + userMap[i].postStage.toString());
          alert("錯誤" + userMap[i].check.toString() + "," + userMap[i].postStage.toString());
        }
        /*修改按鈕*/
        b = document.createElement("input");
        b.setAttribute("type", "button");
        if (userMap[i].postStage == 2 || userMap[i].postStage == 1) {
          // console.log("777");
          b.className = "modifyBtn  " + "disabled";
        }
        else {
          b.className = "modifyBtn";
        }
        b.setAttribute("id", "modifyBtn" + i + j);
        b.setAttribute("onclick", "updateMap(this)");
        divTag.appendChild(b);

        /*簡介按鈕*/
        b = document.createElement("input");
        b.setAttribute("type", "button");
        b.setAttribute("class", "introductionBtn");
        b.setAttribute("id", "introductionBtn" + i + j);
        b.setAttribute("onclick", "viewValueMap(\"lostUserCreateTable" + i + "\")");
        divTag.appendChild(b);

        /*刪除按紐*/
        b = document.createElement("input");
        b.setAttribute("type", "button");
        if (userMap[i].postStage == 2 || userMap[i].postStage == 1) {
          // console.log("777");
          b.className = "deleteBtn  " + "disabled";
        }
        else {
          b.className = "deleteBtn";
        }
        b.setAttribute("id", "deleteBtn" + i + j);
        b.setAttribute("onclick", "checkView(\"刪除地圖\",this)");
        divTag.appendChild(b);
      }
    }
  }
}

/*提醒視窗*/
function remindView(remindValue) {
  var isTwoLine = false;
  for (var i = 0; i < remindValue.length; i++) {
    if (remindValue[i] == "<") {
      isTwoLine = true;
      break;
    }
  }
  try {
    divTag = document.getElementById("remindView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("remindBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "remindBkView");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  if (isTwoLine) {
    b.setAttribute("class", "twoLine");
  } else {
    b.setAttribute("class", "oneLine");
  }
  b.setAttribute("id", "remindView");
  divTag.appendChild(b);
  levelDivAlive = true;

  divTag = document.getElementById("remindView");
  b = document.createElement("h2");
  b.setAttribute("id", "remindH2");
  divTag.appendChild(b);
  document.getElementById("remindH2").innerHTML = "";
  document.getElementById("remindH2").innerHTML = remindValue;

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "remindTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  divTag.appendChild(b);
}

/*確定視窗*/
var postVar, postLaterVar, unShelfVar, delVar, latePostVar;
function checkView(checkFont, checkStatus) {
  divTag = document.getElementById("centerLost");
  if (levelDivAlive) {
    divTag = document.getElementById("checkView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById("centerLost");
  }
  b = document.createElement("div");
  b.setAttribute("id", "checkBkView");
  b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "checkView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("checkView");

  b = document.createElement("h2");
  b.setAttribute("id", "checkH2");
  divTag.appendChild(b);
  document.getElementById("checkH2").innerHTML = "確定要" + checkFont + "嗎?";

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "checkFalseBtn");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "checkTrueBtn");
  b.setAttribute("value", "確定");
  if (checkFont == "上架地圖") {
    if (checkStatus == "now") {
      postVar = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
      b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\");nowShelfNowAction(" + postVar.toString() + ")");
    } else {
      // console.log(checkStatus);

      // console.log(postVar);
      b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\");shelfLaterAction(latePostVar.toString())");
    }
  } else if (checkFont == "下架地圖") {
    unShelfVar = checkStatus;
    var ele = document.createElement("input");
    b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\");unShelf(unShelfVar)");
  } else if (checkFont == "刪除地圖") {
    b.setAttribute("onclick", "clossFunc(\"checkView\",\"checkBkView\");delMap(delVar)");
  }
  divTag.appendChild(b);
}

/*刪除地圖--檢測*/
function delMap(thisObject) {
  // var mapIndex = parseInt(thisObject.id.substr("deleteBtn".length));
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  // var objI = parseInt((mapIndex - 8) / 10);
  var objI = mapIndex;
  // console.log(objI);
  var obj = userMap[objI];
  if (obj.postStage == 2 || obj.postStage == 1) { //預防出錯
    // alert("請先下架該地圖");
    remindView("請先下架該地圖");

  }
  else {
    // if (confirm('你確定要刪除這張地圖嗎?')) {
    delMapAction(objI);
    // } else {
    //   // Do nothing!
    // }
  }

}
/*刪除地圖--功能*/
function delMapAction(objI) {
  // console.log(objI);
  var obj = userMap[objI];
  // if (confirm('你確定要刪除這張地圖嗎?')) {
  var mapId = obj._id;
  // console.log(obj, "id:", mapId);
  var scriptData = {
    type: "DeleteMap",
    mapId: mapId
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      // userMap.splice(obj,1);
      var str = "lostUserCreateTable" + objI.toString();
      divTag = document.getElementById(str);
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    }
  })
}

/*簡介地圖--功能*/
function viewValueMap(thisObject) {
  // var mapIndex = parseInt(thisObject.id.substr("introductionBtn".length));
  var mapIndex = parseInt(thisObject.substr("lostUserCreateTable".length));
  // var objI = parseInt((mapIndex - 8) / 10);
  var objI = mapIndex;
  var obj = userMap[objI];
  if (levelDivAlive) {
    divTag = document.getElementById("levelDiv");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById("centerLost");
  }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "levelDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("levelDiv");
  b = document.createElement("form");
  b.setAttribute("id", "levelForm");
  levelDivAlive = true;
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"levelDiv\")");
  divTag.appendChild(b);
  divTag = document.getElementById("levelForm");
  b = document.createElement("h3");
  b.setAttribute("id", "levelDescription");
  // console.log(obj.mapName);
  b.innerHTML = obj.mapName;
  divTag.appendChild(b);

  /*地圖說明*/
  divTag = document.getElementById("levelForm");
  b = document.createElement("textarea");
  b.setAttribute("rows", "20");
  b.setAttribute("cols", "20");
  b.setAttribute("id", "levelDescriptiontextarea");
  b.innerHTML = obj.mapIntroduction;
  divTag.appendChild(b);
  b = document.createElement("br");
  divTag.appendChild(b);
  // console.log("地圖簡介:", obj.mapIntroduction);
  // console.log("地圖名稱:", obj.mapName);
  // console.log("地圖說明:", obj.mapDescription);
}
/*更新地圖--功能*/
function updateMap(thisObject) {
  var mapIndex = parseInt(thisObject.id.substr("modifyBtn".length));
  // var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  var objI = parseInt((mapIndex - 8) / 10);
  // var objI = mapIndex;
  var obj = userMap[objI];
  // console.log(obj);
  if (obj.postStage == 2 || obj.postStage == 1) {
    // alert("請先下架該地圖");
    remindView("請先下架該地圖");

  }
  else {
    var mapID = userMap[objI]._id;
    document.location.href = 'oblivionCreater?mapID=' + mapID;
  }
}
/*上架地圖--觸發事件*/
function shelfMap(thisObject) {
  // var mapIndex = parseInt(thisObject.id.substr("shelfBtn".length));
  // var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  // var objI = parseInt((mapIndex - 8) / 10);
  // var objI = mapIndex;
  shelfBtn();
}

/*上架介面*/
function shelfBtn() {
  divTag = document.getElementById("centerLost");
  if (levelDivAlive) {
    divTag = document.getElementById("shelfView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById("createrDiv");
  }
  b = document.createElement("div");
  b.setAttribute("id", "shelfBkView");
  b.setAttribute("class", "bkView");
  b.setAttribute("onclick", "clossFunc(\"shelfView\",\"shelfBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "shelfView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("shelfView");
  divTag.innerHTML = "";

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"shelfView\",\"shelfBkView\")");
  divTag.appendChild(b);

  b = document.createElement("h1");
  b.setAttribute("id", "shelfTitle");
  divTag.appendChild(b);
  document.getElementById("shelfTitle").innerHTML = "上架地圖";

  b = document.createElement("table");
  b.setAttribute("id", "shelfTable");
  divTag.appendChild(b);

  /*上架地圖_定時*/
  divTag = document.getElementById("shelfTable");
  b = document.createElement("tr");
  b.setAttribute("id", "shelfTr0");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfTr0");
  b = document.createElement("td");
  b.setAttribute("id", "shelfRow0_0");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfRow0_0");
  b = document.createElement("h2");
  b.setAttribute("id", "shelfCheckboxH2");
  divTag.appendChild(b);
  document.getElementById("shelfCheckboxH2").innerHTML = "定時";
  divTag = document.getElementById("shelfTr0");
  b = document.createElement("td");
  b.setAttribute("id", "shelfRow0_1");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfRow0_1");
  b = document.createElement("form");
  b.setAttribute("id", "shelfForm");
  b.setAttribute("name", "shelfForm");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfForm");
  /*是否定時checkBox*/
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "shelfTrue");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "return shelfChk(this);");
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "shelfTrueText");
  divTag.appendChild(b);
  document.getElementById("shelfTrueText").innerHTML = "是";
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "shelfFalse");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "2");
  b.setAttribute("checked", "true");
  b.setAttribute("onclick", "return shelfChk(this);");
  divTag.appendChild(b);
  b = document.createElement("font");
  b.setAttribute("id", "shelfFalseText");
  divTag.appendChild(b);
  document.getElementById("shelfFalseText").innerHTML = "否";

  /*設定上架時間*/
  divTag = document.getElementById("shelfTable");
  b = document.createElement("tr");
  b.setAttribute("id", "shelfTr1");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfTr1");
  b = document.createElement("td");
  b.setAttribute("id", "shelfRow1_0");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfRow1_0");
  b = document.createElement("h2");
  b.setAttribute("id", "shelfTimeH2");
  divTag.appendChild(b);
  document.getElementById("shelfTimeH2").innerHTML = "上架時間";
  divTag = document.getElementById("shelfTr1");
  b = document.createElement("td");
  b.setAttribute("id", "shelfRow1_1");
  divTag.appendChild(b);
  divTag = document.getElementById("shelfRow1_1");
  b = document.createElement("input");
  b.setAttribute("type", "datetime-local");
  b.setAttribute("id", "shelfDataTime");
  b.setAttribute("class", "shelfDataTime");


  divTag.appendChild(b);
  b = document.getElementById("shelfDataTime");
  b.className = "shelfDataTime " + "disabled";
  var data = new Date();
  var year = data.getFullYear().toString(), month = (data.getMonth() + 1).toString(), day = data.getDate().toString();
  var hour = data.getHours().toString(), minutes = data.getMinutes().toString()
  var nowDate = year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":00";
  b.min = nowDate;

  /*上架按鈕*/
  divTag = document.getElementById("shelfView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "shelfNow");
  b.setAttribute("class", "shelfNow");
  b.setAttribute("value", "立即上架");
  b.setAttribute("onclick", "checkView(\"上架地圖\",\"now\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "shelfLater");
  b.setAttribute("class", "shelfLater");
  b.setAttribute("value", "設定時間");
  b.className = "shelfLater " + "disabled";
  b.setAttribute("onclick", "shelfLater()");
  divTag.appendChild(b);
  // document.getElementById("shelfLater").className = "shelfLater " + "disabled";

}

function shelfChk(input) {
  // console.log(input);
  for (var i = 0; i < document.shelfForm.c1.length; i++) {
    document.shelfForm.c1[i].checked = false;
  }
  input.checked = true;
  if (input.id == "shelfFalse") {
    shelfSwitch = 0;
    // console.log("可立即上架");
    document.getElementById("shelfNow").className = "shelfNow";
    document.getElementById("shelfLater").className = "shelfLater " + "disabled";
    document.getElementById("shelfDataTime").className = "shelfDataTime " + "disabled";
  } else {
    shelfSwitch = 1;
    // console.log("不可立即上架");
    document.getElementById("shelfLater").className = "shelfLater";
    document.getElementById("shelfNow").className = "shelfNow " + "disabled";
    document.getElementById("shelfDataTime").className = "shelfDataTime";
  }
  return true;
}

/*立即上架--檢測*/
function nowShelfNow(checkFont) {
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  // if (checkView("上架地圖")) {
  //   nowShelfNowAction(mapIndex);
  // } else {
  //   // Do nothing!
  // }
  divTag = document.getElementById("centerLost");
  if (levelDivAlive) {
    divTag = document.getElementById("checkView");
    try {
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
    divTag = document.getElementById("centerLost");
  }
  b = document.createElement("div");
  b.setAttribute("id", "checkView");
  divTag.appendChild(b);
  levelDivAlive = true;
  divTag = document.getElementById("checkView");

  b = document.createElement("h2");
  b.setAttribute("id", "checkH2");
  divTag.appendChild(b);
  document.getElementById("checkH2").innerHTML = "確定要" + checkFont + "嗎?";

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "checkFalseBtn");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "clossFunc(\"checkView\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "checkTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"checkView\");nowShelfNowAction(" + mapIndex.toString() + ")");
  divTag.appendChild(b);
}
/*立即上架--功能*/
function nowShelfNowAction(mapIndex) {
  // var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  var obj = userMap[mapIndex];
  var mapId = obj._id;
  // console.log(obj, "id:", mapId);
  var scriptData = {
    type: "shelfMap",
    mapId: mapId
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',         // 使用 POST 方法傳送請求
    dataType: 'json',       // 回傳資料會是 json 格式
    data: scriptData,       // 將表單資料用打包起來送出去
    success: function (res) {
      clossFunc("shelfView", "shelfBkView");
      // var objI = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
      var objI = mapIndex;
      userMap[mapIndex].postStage = 2;
      var data = new Date();
      var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
      updateDate = year.toString() + "/" + month.toString() + "/" + day.toString();
      document.getElementById("td0" + objI.toString() + "7").innerHTML = updateDate;

      var str = "td0" + objI.toString() + "1";
      divTag = document.getElementById(str);
      divTag.innerHTML = "✔"; //已發布

      str = "shelfBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "unShelfBtn";
      // divTag.setAttribute("onclick", "unShelf(this)");
      divTag.setAttribute("onclick", "checkView(\"下架地圖\",this)");

      str = "modifyBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "modifyBtn  " + "disabled";
      divTag.setAttribute("onclick", "updateMap(this)");

      str = "deleteBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "deleteBtn " + "disabled";
      divTag.setAttribute("onclick", "delMap(this)");
    }
  })
}

/*稍後上架--檢測*/
function shelfLater(thisObject) {
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));

  var obj = userMap[mapIndex];
  var shelfDataTime = document.getElementById("shelfDataTime");
  if (shelfDataTime.value.length > 0) {
    var selectDate = new Date(shelfDataTime.value.toString());
    var nowDate = new Date();
    if (nowDate - selectDate > 1000 * 30) {
      // console.log("選擇時間錯誤");
      remindView("選擇時間錯誤");
    }
    else {
      // console.log("run 777");
      postVar = selectDate.toString();
      latePostVar = selectDate.toString();
      checkView("上架地圖", "later");
      // if (confirm('你確定要上架這張地圖嗎?')) {
      //   // console.log(latePostVar);
      //   shelfLaterAction(latePostVar);
      // } else {
      //   // Do nothing!
      // }
      // postLaterVar = selectDate.toString();
      // checkView("上架地圖","later");
    }
  }
  else {
    // console.log("選擇時間錯誤");
    remindView("選擇時間錯誤");
  }
}
/*稍後上架--功能*/
function shelfLaterAction(selectDate) {
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  var obj = userMap[mapIndex];
  var mapId = obj._id;
  // console.log(obj, "id:", mapId);
  var scriptData = {
    type: "shelfLaterMap",
    mapId: mapId,
    postDate: selectDate
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',         // 使用 POST 方法傳送請求
    dataType: 'json',       // 回傳資料會是 json 格式
    data: scriptData,       // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log("6666666666666");
      clossFunc("shelfView", "shelfBkView");
      var objI = parseInt(thisSelectionId.substr("lostUserCreateTable".length));;
      var str = "td0" + objI.toString() + "1";
      divTag = document.getElementById(str);
      divTag.innerHTML = "⌛"; //代發布
      userMap[objI].postStage = 1;
      str = "shelfBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "unShelfBtn";
      // divTag.setAttribute("onclick", "unShelf(this)");
      divTag.setAttribute("onclick", "checkView(\"下架地圖\",this)");

      str = "modifyBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "modifyBtn  " + "disabled";

      str = "deleteBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "deleteBtn " + "disabled";

      var data = new Date(selectDate);
      var nowDate = new Date();
      var time = data.getTime() - nowDate.getTime();
      var hours = parseInt(time / (1000 * 60 * 60));
      if (hours < 24) {
        if (hours <= 0) {
          var minutes = parseInt(time / (1000 * 60));
          postDate = "倒數" + minutes + "分鐘";
        }
        else {
          postDate = "倒數" + hours + "小時";
        }
      }
      else {
        postDate = "大於一天上架";
      }
      document.getElementById("td0" + objI.toString() + "7").innerHTML = postDate;
      reciprocalDate.push(objI);
      userMap[objI].postDate = data.toString();
    }
  })
}

/*下架地圖--功能*/
function unShelf(thisObject) {
  // var mapIndex = parseInt(thisObject.id.substr("shelfBtn".length));
  var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  // var objI = parseInt((mapIndex - 8) / 10);
  var objI = mapIndex;
  // console.log(objI);
  var obj = userMap[objI];
  // if (confirm('你確定要下架這張地圖嗎?')) {
  var mapId = obj._id;
  // console.log(obj, "id:", mapId);
  var scriptData = {
    type: "unShelfMap",
    mapId: mapId
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      userMap[objI].postStage = 3;
      userMap[objI].postDate = "";
      var str = "td0" + objI.toString() + "1";
      divTag = document.getElementById(str);
      divTag.innerHTML = "△"; //代發布
      document.getElementById("td0" + objI.toString() + "7").innerHTML = "--------";
      str = "shelfBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "shelfBtn";
      divTag.setAttribute("onclick", "shelfMap(this)");

      str = "modifyBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "modifyBtn";
      divTag.setAttribute("onclick", "updateMap(this)");

      str = "deleteBtn" + objI.toString() + "8";
      divTag = document.getElementById(str);
      divTag.className = "deleteBtn";
      divTag.setAttribute("onclick", "checkView('刪除地圖',this)");

    }
  })
  // } else {
  //   // Do nothing!
  // }
}


function reviseLevel() {
  if (thisSelectionId) {
    var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
    if (userMap[mapIndex].check == false) {
      var mapID = userMap[mapIndex]._id;
      document.location.href = 'oblivionCreater?mapID=' + mapID;
    }
    else {
      // alert("地圖已發佈，不可更改");
      remindView("地圖已發佈，不可更改");

    }
  }
  else {
    // alert("請點選其中一張地圖");

    remindView("請點選其中一張地圖");
  }
}
function enterLevel() {
  if (thisSelectionId) {
    var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
    var obj = userMap[mapIndex];
    // if (obj.check == false) {
    if (obj.mapName.length < 1) {
      // alert("地圖名稱不能為空白，請修改地圖內容");
      remindView("地圖名稱不能為空白，<br>請修改地圖內容");
    }
    else if (obj.mapName.length > 10) {
      // alert("地圖名稱不能超過10個字，請修改地圖內容");
      remindView("地圖名稱不能超過10個字，<br>請修改地圖內容");
    }
    else {
      if (obj.mapIntroduction.length < 1) {
        // alert("地圖簡介不能為空白，請修改地圖內容");
        remindView("地圖簡介不能為空白，<br>請修改地圖內容");
      }
      else {
        if (obj.mapDescription.length < 1) {
          // alert("地圖介紹不能為空白，請修改地圖內容");
          remindView("地圖介紹不能為空白，<br>請修改地圖內容");
        }
        else {
          var mapID = obj._id;
          // console.log("跳轉");
          // console.log('oblivionDetectionView?mapID=' + mapID);
          document.location.href = 'oblivionDetectionView?mapID=' + mapID;
        }
      }
    }
  }
  else {
    // alert("請點選其中一張地圖");
    remindView("請點選其中一張地圖");
  }
}
function getArgs() {
  var args = new Object();
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    args[argname] = decodeURIComponent(value);
  }
  if (args.levelName) {
    divTag = document.getElementById("titleFont");
    divTag.innerHTML = "";
    divTag.innerHTML = args.levelName;
  }
}
function createMainDescription() {
  mainDescription = {
    "oblivionObject": [
      {
        "level": 1,
        "mode": 1,
        "textarea1": "歡迎來到失落帝國！<br>在這裡你可以發揮你的無限想像力創造出獨一無二的地圖也可以遊玩其他使用者創建的地圖<br>每一個地圖都有遊玩條件，達成遊玩條件後即可遊玩地圖<br>完成地圖後可給予地圖評價，評價高的地圖會更加吸引人喔<br><br>點擊左下角的”自訂地圖”即可看到自己已創建的地圖以及開始創建屬於你的地圖<br><br>選定欲遊玩的地圖後點擊右下角的”進入地圖”即可開始遊玩。<br><br>未遊玩過的地圖為淡藍色<br>已遊玩過的地圖為淡紫色"
      },
      {
        "level": 2,
        "mode": 1,
        "textarea1": "此為\"我的自訂地圖\"介面，可以在這裡查看到目前自訂地圖的狀態以及可透過地圖右方的工具列編輯地圖。<br>工具列按鈕由左至右依序為：上/下架、修改地圖、地圖簡介、刪除地圖。<br>除了查看狀態及編輯地圖，也可以透過左下角的\"創建地圖\"來創建新的地圖。<br><br>創建了地圖後，此時上架狀態及檢測狀態皆為'X'，接下來點選檢測地圖就可以馬上開始檢測自己的地圖。<br>檢測通關後，檢測狀態將變為'✔'，接下來就是要上架地圖了。<br><br>上架地圖可以選擇馬上上架或是定時上架，若選擇馬上上架則上架狀態將變為'✔'，上架日期將變為當天日期。若選擇定時上架則上架狀態將變為'⌛'，上架日期將變為距離上架的剩餘時間。<br><br>上架地圖後，上架按鈕即會變成下架按鈕，點擊即可下架，而上架狀態將會變為'△'，若要上架的話再次按下上架按鈕就可以再次上架地圖了，而下架地圖後若修改了地圖則上架狀態將變為'X'，檢測狀態變為'X'，需再次檢測通關後才能上架地圖。"
      },
      {
        "level": 3,
        "mode": 1,
        "textarea1": "此為創建地圖頁面，可在此頁面創建屬於自己的地圖。<br><br>可透過上方”物件選擇選單”選擇欲新增至地圖的物件，並且可調整物件角度，然後按下”新增物件”至地圖指定位置上，也可點擊指定物件後點擊”刪除物件”來移除物件。<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的”物件屬性”來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>當星星集至81顆後，即會解鎖地圖設置，將可進行調整地圖大小以及地形的配置。<br><br>當星星集至120顆後，即會解鎖進階，將可設定是否開啟迷霧以及使用擴充程式區。"
      },
      {
        "level": 4,
        "mode": 1,
        "textarea1": "此為創建地圖頁面，可在此頁面創建屬於自己的地圖。<br><br>可透過上方”物件選擇選單”選擇欲新增至地圖的物件，並且可調整物件角度，然後按下”新增物件”至地圖指定位置上，也可點擊指定物件後點擊”刪除物件”來移除物件。<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的”物件屬性”來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>可透過右方的”地圖設置”，進行調整地圖大小以及地形的配置。<br><br>當星星集至120顆後，即會解鎖進階，將可設定是否開啟迷霧以及使用擴充程式區。"
      },
      {
        "level": 5,
        "mode": 1,
        "textarea1": "此為創建地圖頁面，可在此頁面創建屬於自己的地圖。<br><br>可透過上方”物件選擇選單”選擇欲新增至地圖的物件，並且可調整物件角度，然後按下”新增物件”至地圖指定位置上，也可點擊指定物件後點擊”刪除物件”來移除物件。<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的”物件屬性”來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>可透過右方的”地圖設置”，進行調整地圖大小以及地形的配置。<br>可透過右方的”進階”，設定是否開啟迷霧以及使用擴充程式區，而擴充程式區則是讓創作者可自訂函式於此地圖中，自訂函式可以經由創作者發揮想像力，只要符合程式邏輯以及編碼正確，就可以有無限的可能，以下範例提供給創作者參考，皆為創作者設定一個自訂函式讓使用者必須創陣列、字串來使用函式並且經由函式內容取得創作者給的陣列及字串內容<br>void&nbsp&nbspgetKeyArray(int*&nbsp&nbsparr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個一維陣列內容<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspi;<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspkey[6]={1,5,9,-1,3,10};<br>&nbsp&nbsp&nbsp&nbspfor(i=0;i<6;i++){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsparr[i]=key[i];<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>void&nbsp&nbspgetDirection(char*&nbsp&nbsparr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個一維字元陣列內容<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspi;<br>&nbsp&nbsp&nbsp&nbspchar&nbspkey[6]={'L','R','R','L','L','R'};<br>&nbsp&nbsp&nbsp&nbspfor(i=0;i<6;i++){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsparr[i]=key[i];<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>void&nbsp&nbspgetKey(int*&nbsp&nbspx,int*&nbsp&nbspy){&nbsp&nbsp&nbsp&nbsp使使用者取得兩個數字<br>&nbsp&nbsp&nbsp&nbspint&nbspi=5,j=10;<br>&nbsp&nbsp&nbsp&nbspx=&i;&nbspy=&j;<br>}<br>void&nbsp&nbspgetString(char*&nbsp&nbspstr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個字串<br>&nbsp&nbsp&nbsp&nbspchar*&nbsp&nbsptmp=\"ABCCCDEDDf\";<br>&nbsp&nbsp&nbsp&nbspstrcpy(str,tmp);&nbsp&nbsp&nbsp&nbspstrcpy複製字串(目標，複製來源);<br>}<br>void&nbsp&nbsp函式名稱(需要的參數型態及在此函式內的名稱){<br>&nbsp&nbsp&nbsp&nbsp函式內容<br>}"
      }
    ]
  };
}
var reciprocalInterval = window.setInterval(reciprocal, 1000);
function reciprocal() {

  // console.log(reciprocalDate);
  var nowDate = new Date();
  for (let index = 0; index < reciprocalDate.length; index++) {
    var ri = reciprocalDate[index], update = false;
    var obj = userMap[ri];
    if (obj.postStage != 1) {
      reciprocalDate.splice(index, 1);
      --ri;
    }
    else {
      var data = new Date(obj.postDate);
      var time = data.getTime() - nowDate.getTime();
      var hours = parseInt(time / (1000 * 60 * 60));
      if (hours < 24) {
        if (hours <= 0) {
          var minutes = parseInt(time / (1000 * 60));
          // console.log(index,minutes);
          if (minutes <= 0) {
            var minutessss = parseInt(time / (1000));
            if (minutessss <= 0) {
              var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
              postDate = year.toString() + "/" + month.toString() + "/" + day.toString();
              update = true;
            }
            else {
              postDate = "倒數0分鐘";
            }

          }
          else {
            postDate = "倒數" + minutes + "分鐘";
          }
        }
        else {
          postDate = "倒數" + hours + "小時";
        }
      }
      else {
        postDate = "大於一天上架";
      }
      document.getElementById("td0" + ri.toString() + "7").innerHTML = postDate;
      if (update) {
        nowShelfNowAction(ri)
        reciprocalDate.splice(index, 1);
        --ri;
      }
    }
  }

}
