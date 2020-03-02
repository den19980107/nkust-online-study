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
  href += "oblivionUser";
  window.location.replace(href);
  // console.log(href);
}
var href = window.location.href;
var user, objectData, levelDivAlive = false, isOblivionCreaterOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed;
var musicData;
var scriptData = {
  type: "init"
}

createLoadingMainView("centerLost");
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  async: false,
  success: function (res) {
    // console.log(res);
    user = res;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        objectData = JSON.parse(this.responseText);

        initHome();
      }
    };
    xmlhttp.open("GET", "json/oblivionObject.json", true);
    xmlhttp.send();
    /*loadmusicData();*/
    // console.log(user);

  }
})

closeMainLoadingView();


function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  // console.log(document.getElementById("objectSelect"));
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
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  for (var i = 1; i < document.getElementById("objectSelect").length; i++) {
    var objectName = document.getElementById("op" + i).value;
    for (var j = 0; j < objectData.oblivionObject.length; j++) {
      // console.log(objectName,objectData.oblivionObject[j].value);
      if (objectName == objectData.oblivionObject[j].value) {
        if (objectData.oblivionObject[j].requirementStar > user.starNum) {
          document.getElementById("op" + i).className = "unUse";
          break;
        }
      }
    }
  }
  try {
    isOblivionCreaterOpen = Session.get("isOblivionCreaterOpen");
  } catch (e) {
    isOblivionCreaterOpen = false;
  }
  if (!isOblivionCreaterOpen) {
    helper('centerLost');
  }
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
  var thisLevelNum;
  if (user.starNum < 81) {
    thisLevelNum = 2;
  } else if (user.starNum >= 81 && user.starNum < 120) {
    thisLevelNum = 3;
  } else if (user.starNum >= 120) {
    thisLevelNum = 4;
  }
  isOblivionCreaterOpen = true;
  Session.set("isOblivionCreaterOpen", isOblivionCreaterOpen);
  var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  divID = "equipageView";
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
function clossFunc(thisDiv, thisDiv2) {
  divTag = document.getElementById(thisDiv);
  parentObj = divTag.parentNode;
  parentObj.removeChild(divTag);
  divTag = document.getElementById(thisDiv2);
  parentObj = divTag.parentNode;
  parentObj.removeChild(divTag);
  levelDivAlive = false;
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
var lastObject = null;

/*div分頁*/
function clearLinkDot() {
  var i, a, main;
  for (i = 0; (a = document.getElementsByTagName("a")[i]); i++) {
    if (a.getAttribute("onFocus") == null) {
      a.setAttribute("onFocus", "this.blur();");
    } else {
      a.setAttribute("onFocus", a.getAttribute("onFocus") + ";this.blur();");
    }
    a.setAttribute("hideFocus", "hidefocus");
  }
}
function loadTab(obj, n) {
  var layer;
  eval('layer=\'S' + n + '\'');
  //將 Tab 標籤樣式設成 Blur 型態
  var tabsF = document.getElementById('tabsF').getElementsByTagName('li');
  for (var i = 0; i < tabsF.length; i++) {
    tabsF[i].setAttribute('id', null);
    eval('document.getElementById(\'S' + (i + 1) + '\').style.display=\'none\'')
  }
  editMapterrain
  //變更分頁標題樣式
  obj.parentNode.setAttribute('id', 'current');
  editMapterrain = false;
  if (n == 3) {
    editMapterrain = true;
    // console.log(editMapterrain);
  }
  if (n == 4 && user.starNum < objectData.oblivionObject[13].requirementStar) {
    document.getElementById(layer).style.display = 'none';
    // console.log("aaa");
    lessRequirement(objectData.oblivionObject[13].requirementStar);
  }
  else if (n == 3 && user.starNum < objectData.oblivionObject[11].requirementStar) {
    document.getElementById(layer).style.display = 'none';
    // console.log("bbb");
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  }
  else {
    document.getElementById(layer).style.display = 'inline';
  }


}
function chk(input) {
  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  return true;
}

/*select選擇->改變分頁內容*/
function changeObjectAttributes() {
  // console.log("123");
  var objectName = document.getElementById("objectSelect").value;
  var tableId = ["enemyTable", "lockAnswerTable", "boxTable"];
  var tableValue = ["enemy", "blueLock", "box"];
  for (var i = 0; i < objectData.oblivionObject.length; i++) {
    if (objectName == objectData.oblivionObject[i].value) {
      if (objectData.oblivionObject[i].requirementStar > user.starNum) {
        document.getElementById("objectSelect").selectedIndex = 0;
        // console.log("ccc");
        lessRequirement(objectData.oblivionObject[i].requirementStar);
      }
    }
  }
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
}

/*設置地圖*/
function settingMap() {
  if (objectData.oblivionObject[11].requirementStar > user.starNum) {
    lessRequirement(objectData.oblivionObject[11].requirementStar);
  } else {
    document.getElementById("settingMapDiv").style.display = '';
  }
}
function unSaveMap() {
  document.getElementById("settingMapDiv").style.display = 'none';
}
function saveMap() {
  document.getElementById("settingMapDiv").style.display = 'none';
}

/*未達成條件*/
function lessRequirement(starNum) {
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "lessRequirementView");
  divTag.appendChild(b);
  divTag = document.getElementById("lessRequirementView");
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "提醒";
  b = document.createElement("h3");
  b.setAttribute("id", "conditionH3Top");
  divTag.appendChild(b);
  document.getElementById("conditionH3Top").innerHTML = "未達成使用條件：";
  b = document.createElement("div");
  b.setAttribute("id", "lessRequirementInnerView");
  divTag.appendChild(b);
  divTag = document.getElementById("lessRequirementInnerView");
  b = document.createElement("table");
  b.setAttribute("id", "conditionTable");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTable");
  b = document.createElement("tr");
  b.setAttribute("id", "conditionTr");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTr");
  b = document.createElement("td");
  b.setAttribute("id", "conditionTd0");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTd0");
  b = document.createElement("img");
  b.setAttribute("id", "conditionImg");
  b.setAttribute("src", "img/star.png");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTr");
  b = document.createElement("td");
  b.setAttribute("id", "conditionTd1");
  divTag.appendChild(b);
  divTag = document.getElementById("conditionTd1");
  b = document.createElement("h3");
  b.setAttribute("id", "conditionH3Bottom");
  divTag.appendChild(b);
  document.getElementById("conditionH3Bottom").innerHTML = "x" + starNum;
  divTag = document.getElementById("lessRequirementView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "conditionButton");
  b.setAttribute("value", "返回");
  b.setAttribute("onclick", "clossFunc(\"lessRequirementView\")");
  divTag.appendChild(b);
}

var levelDivAlive = false;
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
      "textarea1": "創建地圖後，地圖將處於”待發布”的狀態，需先點擊右下角””檢測地圖”，自己先遊玩過一次，並且成功通關才能成功發布地圖<br><br>若要創建地圖，點擊左下角”創建地圖”即可進入創建地圖頁面<br>若要修改已創建地圖，選定欲修改的地圖，然後點擊右下方的”修改地圖”即可修改地圖"
    },
    {
      "level": 3,
      "mode": 1,
      "textarea1": "此為創建&修改地圖頁面，可在此頁面創建&修改屬於自己的地圖。<br><br>可透過上方\"物件選擇選單\"選擇欲新增至地圖的物件，並且可調整物件角度，然後按下\"新增物件\"至地圖指定位置上，也可點擊指定物件後點擊\"刪除物件\"來移除物件。<br>而可放置的物件是依照星星數量來解鎖的。<br>--------星星解鎖物件表--------<br>終點線-3顆星<br>石頭-3顆星<br>樹-3顆星<br>金幣-12顆星<br>藍色鎖頭-15顆星<br>問號標誌-21顆星<br>問號石頭-21顆星<br>黃色鎖頭-39顆星<br>黃色箭頭-39顆星<br>炸彈-45顆星<br>敵人-75顆星<br>地形-81顆星<br>寶箱-120顆星<br>進階-120顆星<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的\"物件屬性\"來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>當星星集至81顆後，即會解鎖地圖設置，將可進行調整地圖大小以及地形的配置。<br><br>當星星集至120顆後，即會解鎖進階，將可設定是否開啟迷霧以及使用擴充程式區。"
    },
    {
      "level": 4,
      "mode": 1,
      "textarea1": "此為創建&修改地圖頁面，可在此頁面創建&修改屬於自己的地圖。<br><br>可透過上方\"物件選擇選單\"選擇欲新增至地圖的物件，並且可調整物件角度，然後按下\"新增物件\"至地圖指定位置上，也可點擊指定物件後點擊\"刪除物件\"來移除物件。<br>而可放置的物件是依照星星數量來解鎖的。<br>--------星星解鎖物件表--------<br>終點線-3顆星<br>石頭-3顆星<br>樹-3顆星<br>金幣-12顆星<br>藍色鎖頭-15顆星<br>問號標誌-21顆星<br>問號石頭-21顆星<br>黃色鎖頭-39顆星<br>黃色箭頭-39顆星<br>炸彈-45顆星<br>敵人-75顆星<br>地形-81顆星<br>寶箱-120顆星<br>進階-120顆星<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的\"物件屬性\"來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>可透過右方的\"地圖設置\"，進行調整地圖大小以及地形的配置。<br><br>當星星集至120顆後，即會解鎖進階，將可設定是否開啟迷霧以及使用擴充程式區。"
    },
    {
      "level": 5,
      "mode": 1,
      "textarea1": "此為創建&修改地圖頁面，可在此頁面創建&修改屬於自己的地圖。<br><br>可透過上方\"物件選擇選單\"選擇欲新增至地圖的物件，並且可調整物件角度，然後按下\"新增物件\"至地圖指定位置上，也可點擊指定物件後點擊\"刪除物件\"來移除物件。<br>而可放置的物件是依照星星數量來解鎖的。<br>--------星星解鎖物件表--------<br>終點線-3顆星<br>石頭-3顆星<br>樹-3顆星<br>金幣-12顆星<br>藍色鎖頭-15顆星<br>問號標誌-21顆星<br>問號石頭-21顆星<br>黃色鎖頭-39顆星<br>黃色箭頭-39顆星<br>炸彈-45顆星<br>敵人-75顆星<br>地形-81顆星<br>寶箱-120顆星<br>進階-120顆星<br><br>接著可於右方的”地圖設定”設定地圖名稱、地圖簡介、地圖說明。<br><br>然而有些物件(藍色鎖頭、寶箱、敵人)有屬性需進行設定，即可透過點擊地圖上的物件後點擊右方的\"物件屬性\"來進行設定，鎖頭需設定鎖頭解答，敵人需設定血量及攻擊力，而寶箱則需要設定寶箱字串。<br><br>可透過右方的\"地圖設置\"，進行調整地圖大小以及地形的配置。<br><br>可透過右方的\"進階\"，設定是否開啟迷霧以及使用擴充程式區，而擴充程式區則是讓創作者可自訂函式於此地圖中。<br><br>自訂函式可以經由創作者發揮想像力，只要符合程式邏輯以及編碼正確，就可以有無限的可能，以下範例提供給創作者參考，皆為創作者設定一個自訂函式讓使用者必須創陣列、字串來使用函式並且經由函式內容取得創作者給的陣列及字串內容。<br><br>void&nbsp&nbspgetKeyArray(int*&nbsp&nbsparr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個一維陣列內容<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspi;<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspkey[6]={1,5,9,-1,3,10};<br>&nbsp&nbsp&nbsp&nbspfor(i=0;i<6;i++){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsparr[i]=key[i];<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>void&nbsp&nbspgetDirection(char*&nbsp&nbsparr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個一維字元陣列內容<br>&nbsp&nbsp&nbsp&nbspint&nbsp&nbspi;<br>&nbsp&nbsp&nbsp&nbspchar&nbspkey[6]={'L','R','R','L','L','R'};<br>&nbsp&nbsp&nbsp&nbspfor(i=0;i<6;i++){<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsparr[i]=key[i];<br>&nbsp&nbsp&nbsp&nbsp}<br>}<br>void&nbsp&nbspgetKey(int*&nbsp&nbspx,int*&nbsp&nbspy){&nbsp&nbsp&nbsp&nbsp使使用者取得兩個數字<br>&nbsp&nbsp&nbsp&nbspint&nbspi=5,j=10;<br>&nbsp&nbsp&nbsp&nbspx=&i;&nbspy=&j;<br>}<br>void&nbsp&nbspgetString(char*&nbsp&nbspstr){&nbsp&nbsp&nbsp&nbsp使使用者取得一個字串<br>&nbsp&nbsp&nbsp&nbspchar*&nbsp&nbsptmp=\"ABCCCDEDDf\";<br>&nbsp&nbsp&nbsp&nbspstrcpy(str,tmp);&nbsp&nbsp&nbsp&nbspstrcpy複製字串(目標，複製來源);<br>}<br>void&nbsp&nbsp函式名稱(需要的參數型態及在此函式內的名稱){<br>&nbsp&nbsp&nbsp&nbsp函式內容<br>}"
    }
  ]
};
