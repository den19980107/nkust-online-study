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
  window.location.replace(href);
  // console.log(href);
}
var href = window.location.href;
var user, equipmentData, achievemenData, dictionaryData, levelDivAlive = false,isOblivionOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed;
var musicData;
var userMap, completUserMap, oldDisMapNum = 0, playMap = [];


createLoadingMainView("center");

mainDescription = {
  "oblivionObject": [
    {
      "level": 1,
      "mode": 1,
      "textarea1": "歡迎來到失落帝國！<br>在這裡你可以發揮你的無限想像力創造出獨一無二的地圖，也可以遊玩其他使用者創建的地圖。<br><br>每一個地圖都有遊玩條件，達成遊玩條件後即可遊玩地圖。<br><br>完成地圖後可給予地圖評價，評價高的地圖會更加吸引人喔！！<br><br>點擊左下角的\"自訂地圖\"即可看到自己已創建的地圖以及開始創建屬於你的地圖。<br><br>選定欲遊玩的地圖後點擊右下角的\"進入地圖\"即可開始遊玩。<br><br>未遊玩過的地圖為淡藍色。<br>已遊玩過的地圖為淡紫色。"
    },
    {
      "level": 2,
      "mode": 1,
      "textarea1": "創建地圖後，地圖將處於”待發布”的狀態，需先點擊右下角””檢測地圖”，自己先遊玩過一次，並且成功通關才能成功發布地圖<br><br>若要創建地圖，點擊左下角”創建地圖”即可進入創建地圖頁面<br>若要修改已創建地圖，選定欲修改的地圖，然後點擊右下方的”修改地圖”即可修改地圖"
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
var scriptData = {
  type: "init"
}

$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  async:false,
  success: function (res) {
    // console.log(res);
    user = res;
    /*loadmusicData();*/
    // console.log(user);
    initHome();
    // var scriptData = {
    //   type: "loadEquip"
    // }
    // $.ajax({
    //   url: href,              // 要傳送的頁面
    //   method: 'POST',               // 使用 POST 方法傳送請求
    //   dataType: 'json',             // 回傳資料會是 json 格式
    //   data: scriptData,  // 將表單資料用打包起來送出去
    //   success: function (res) {
    //     // console.log(res);
    //     equipmentData = res;
    //   }
    // })

  }
})
closeMainLoadingView();
function error() {
  alert("有不當的操作發生");
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
  //// console.log(myVid.volume);
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
    isOblivionOpen = Session.get("isOblivionOpen");
  } catch (e) {
    isOblivionOpen = false;
  }
  if(!isOblivionOpen){
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
  var thisLevelNum = 0;
  var selectMod = mainDescription.oblivionObject[thisLevelNum].mode;
  isOblivionOpen = true;
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
  divTag = document.getElementById("center");
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
  } catch (e) {}
  divID = "userDataView";
  divTag = document.getElementById("center");
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
      if(getAchievement == undefined){
        getAchievement=0;
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
      if(j%2 == 0){
        b.innerHTML = dataTitle[i];
      }else{
        b.innerHTML = userdataFont;
      }
      divTag.appendChild(b);
    }
  }
}

var thisSelectionId;
var args;
var divTag, level;
var lastObject = null,lastColor;

function selectionLevel(thisObject) {
  var mapIndex = 0;
  if (thisSelectionId) {
    mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
  }

  if (lastObject != null) {
    // console.log(lastObject);
    // console.log(mapIndex);

    if (playMap[mapIndex] == 1) {
      lastObject.style.backgroundColor = "#7f73bf";
    }
    else {
      lastObject.style.backgroundColor = lastColor;
    }
  }
  lastColor = thisObject.style.backgroundColor;
  thisSelectionId = thisObject.id;
  thisObject.style.backgroundColor = "rgb(133, 81, 29)";
  lastObject = thisObject;
}
function enterLevel() {
  if (thisSelectionId) {
    var mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
    var obj = userMap[mapIndex];
    if (parseInt(obj.requireStar) > parseInt(user.starNum)) {
      // alert("星星數未到達，無法挑戰");

      remindValue = "星星數未到達，無法挑戰";
      remindView(remindValue);
    }
    else {
      // console.log(user.starNum);
      // console.log(obj.requireStar);
      var mapID = obj._id;
      document.location.href = 'oblivionGameView?mapID=' + mapID;
    }

    // document.location.href = 'oblivionGameView?levelName=' + levelName;
    // document.location.href = 'oblivionCreater?mapID=' + mapID;

  }
  else {
    // alert("請點選其中一張地圖");
    remindValue = "請點選其中一張地圖";
    remindView(remindValue);
  }

}
var levelDivAlive = false;
function remindView(remindValue) {
  var isTwoLine = false;
  for (var i = 0; i < remindValue.length; i++) {
    if(remindValue[i] == "<"){
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
  } catch (e) {}
  divTag = document.getElementById("center");
  b = document.createElement("div");
  b.setAttribute("id", "remindBkView");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  if(isTwoLine){
    b.setAttribute("class", "twoLine");
  }else{
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


/*設定*/
function settingAllView(mainDiv) {
  // divTag = document.getElementById("helperView");
  // try {
  //   parentObj = divTag.parentNode;
  //   parentObj.removeChild(divTag);
  // } catch (e) { }
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
  //// console.log("音量=" + bkMusicSwitch * (musicLevel * bkMusicVolumn));
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
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  Session.set("isOblivionOpen", isOblivionOpen);
  return;
}


/*建立表格*/
function sendLoadUsernameMap() {
  var scriptData = {
    type: "LoadMap",
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    async:false,
    success: function (res) {
      // console.log(res);
      userMap = res;
      var mapData = [];
      for (let index = 0; index < res.length; index++) {

        var playF = false;
        for (let pfi = 0; pfi < user.finishMapNum.length; pfi++) {
          var item = user.finishMapNum[pfi].mapID;
          if (item == res[index]._id) {
            playF = true;
            playMap.push(1);
            break;
          }
        }
        if (playF == false) {
          playMap.push(0);
        }
        // var findLike = user.finishMapNum.find(function (item, index, array) {
        //   return item.mapID == res._id;  // 取得陣列 like === '蘿蔔泥'
        // });
        // if (findLike) {
        //   playMap.push(1);
        // }
        // else {
        //   playMap.push(0);
        // }
        var obj = res[index], check = "X";
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
        var postDate;
        var data = new Date(obj.postDate);
        var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
        postDate = year.toString() + "/" + month.toString() + "/" + day.toString();

        var script = {
          td01: obj.mapName,
          td02: obj.requireStar,
          td03: obj.author,
          td04: avgScoreStr,
          td05: postDate,
          td06: obj.mapIntroduction,
        }
        userMap[index].avgScoreStr = avgScoreStr;
        userMap[index].postDateSecond = data.getTime();
        mapData.push(script);
      }

      completUserMap = userMap.slice(0);
      createLevelTable(mapData);
    }
  })
}

var levelNameStatus = 0, conditionStatus = 0, creatorStatus = 0, evaluateStatus = 0, dateStatus = 0, introductionStatus = 0;
var tdStatus = [0, 0, 0, 0, 0, 0];
function changeTdName(thisObiect) {
  var str = thisObiect.className, s, s2;
  var thisStatus = parseInt(str.substr(str.length - 1, 1)) - 1;
  s = thisObiect.innerHTML;
  // console.log(s2.length);
  if (tdStatus[thisStatus] == 0) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    thisObiect.innerHTML = s + "&nbsp▴";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 1) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s + "&nbsp▾";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 2) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s;
    tdStatus[thisStatus] = 0;
  }
  changeTdNameDisplay();
}

var TdNameTable = ["mapName", "requireStar", "author", "avgScoreStr", "postDateSecond", "mapIntroduction"]
function changeTdNameDisplay() {
  // console.log(tdStatus);
  // console.log(userMap);
  var index = levelSelect.selectedIndex;
  // console.log(index);
  if (index == 0) { //全部
    userMap = completUserMap.slice(0);
  }
  else { //可遊玩
    userMap.length = 0;
    for (let indexS = 0; indexS < completUserMap.length; indexS++) {
      const element = completUserMap[indexS];
      if (user.starNum >= element.requireStar) {
        userMap.push(completUserMap[indexS]);
      }
    }
  }

  // for (let index = 0; index < tdStatus.length; index++) {
  for (let index = tdStatus.length-1; index >-1; index--){
    var item=TdNameTable[index];
    // console.log("item:",item);
    // console.log("tdStatus[index]:",item);
    if(tdStatus[index]==1){
      userMap = userMap.sort(function (a, b) {
        return a[item] > b[item] ? 1 : -1;
       });
    }
    else if(tdStatus[index]==2){
      userMap = userMap.sort(function (a, b) {
        return a[item] < b[item] ? 1 : -1;
       });
    }
  }

  // console.log(userMap);

  updateMapData(userMap)

}


/*建立表格*/
function createLevelTable(scriptData) {
  // console.log("--playMap---");
  // console.log(playMap);
  // console.log(scriptData);
  oldDisMapNum = scriptData.length;
  for (var i = 0; i < scriptData.length; i++) {

    var obj = scriptData[i];
    // console.log(td01[i]);
    divTag = document.getElementById("createrDiv");
    b = document.createElement("table");
    b.setAttribute("id", "lostUserCreateTable" + i);
    b.setAttribute("class", "lostUserCreateTable");
    b.setAttribute("border", "5");
    b.setAttribute("RULES", "ALL");
    b.setAttribute("onclick", "selectionLevel(this)");
    divTag.appendChild(b);

    divTag = document.getElementById("lostUserCreateTable" + i);
    if((i%2) == 0){
      divTag.style.backgroundColor = "#BDD5D5";
    }else{
      divTag.style.backgroundColor = "#D6E5E5";
    }
    if (playMap[i] == 1) {
      divTag.style.backgroundColor = "#7f73bf";
    }
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    divTag = document.getElementById("tr" + i);
    for (var j = 1; j <= 6; j++) {
      b = document.createElement("td");
      b.setAttribute("id", "td0" + i + j);
      b.setAttribute("class", "td0" + j);
      divTag.appendChild(b);
      if (j == 6) {
        divTag = document.getElementById("td0" + i + j);
        b = document.createElement("textarea");
        b.setAttribute("id", "textarea" + i + j);
        b.setAttribute("rows", "1");
        b.setAttribute("onfocus", "blur()");
        divTag.appendChild(b);
        document.getElementById("textarea" + i + j).innerHTML = obj.td06;
        divTag = document.getElementById("tr" + i);
      } else if (j == 1) {
        document.getElementById("td0" + i + j).innerHTML = obj.td01;
      } else if (j == 2) {
        document.getElementById("td0" + i + j).innerHTML = obj.td02;
      } else if (j == 3) {
        document.getElementById("td0" + i + j).innerHTML = obj.td03;
      } else if (j == 4) {
        document.getElementById("td0" + i + j).innerHTML = obj.td04;
      } else if (j == 5) {
        document.getElementById("td0" + i + j).innerHTML = obj.td05;
      }
    }
  }
}


/*選單*/
var levelSelect = document.getElementById("levelSelect");
levelSelect.onchange = function (index) {
  changeTdNameDisplay();
  // var index = levelSelect.selectedIndex;
  // console.log(index);
  // if (index == 0) { //全部
  //   userMap = completUserMap.slice(0);
  // }
  // else { //可遊玩
  //   userMap.length = 0;
  //   for (let indexS = 0; indexS < completUserMap.length; indexS++) {
  //     const element = completUserMap[indexS];
  //     if (user.starNum >= element.requireStar) {
  //       userMap.push(completUserMap[indexS]);
  //     }
  //   }
  // }
  // updateMapData(userMap)
}
var selectType = document.getElementById("selectType");
var searchType=0;
var searchTypeTable=["mapName", "requireStar", "author", "avgScoreStr", "postDateSecond", "mapIntroduction"]
selectType.onchange = function (index) {
  searchType= selectType.selectedIndex;
  // console.log(searchType);
  // console.log(searchTypeTable[searchType]);
  searchFunc();
}



function searchFunc() {
  // var a = document.getElementById("searchTextBox");
  // if (a.value == "") {
  //   a.className = "search-text";
  //   clearSearch();
  // } else {
  //   a.className = "searchFocus";
  // }
  if (searchTextBox.value.length > 0) {
    userMap.length = 0;
    for (let indexS = 0; indexS < completUserMap.length; indexS++) {
      // const element = completUserMap[indexS];
      var compareStr=completUserMap[indexS][searchTypeTable[searchType]].toString()
      if (compareStr.indexOf(searchTextBox.value) > -1) {
        userMap.push(completUserMap[indexS]);
      }
    }
    for (let index = tdStatus.length - 1; index > -1; index--) {
      var item = TdNameTable[index];
      // console.log("item:",item);
      // console.log("tdStatus[index]:",item);
      if (tdStatus[index] == 1) {
        userMap = userMap.sort(function (a, b) {
          return a[item] > b[item] ? 1 : -1;
        });
      }
      else if (tdStatus[index] == 2) {
        userMap = userMap.sort(function (a, b) {
          return a[item] < b[item] ? 1 : -1;
        });
      }
    }
    updateMapData(userMap)
  }
  else {
    changeTdNameDisplay();
  }
  // updateMapData(userMap)



}
/*表單更動*/
function updateMapData(res) {
  var mapData = [];
  playMap.length = 0;
  for (let index = 0; index < res.length; index++) {
    var playF = false;
    for (let pfi = 0; pfi < user.finishMapNum.length; pfi++) {
      var item = user.finishMapNum[pfi].mapID;
      if (item == res[index]._id) {
        playF = true;
        playMap.push(1);
        break;
      }
    }
    if (playF == false) {
      playMap.push(0);
    }
    var obj = res[index], check = "X";
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
    var updateDate;
    var data = new Date(obj.updateDate);
    var year = data.getFullYear(), month = data.getMonth() + 1, day = data.getDate();
    updateDate = year.toString() + "/" + month.toString() + "/" + day.toString();

    var script = {
      td01: obj.mapName,
      td02: obj.requireStar,
      td03: obj.author,
      td04: avgScoreStr,
      td05: updateDate,
      td06: obj.mapIntroduction,
    }
    mapData.push(script);
  }
  // console.log(mapData);

  updateLevelTable(mapData);
}
function updateLevelTable(scriptData) {
  // console.log(scriptData);

  // console.log(oldDisMapNum, scriptData.length);

  for (var i = 0; i < scriptData.length; i++) {
    var obj = scriptData[i];
    if (i < oldDisMapNum) {
      document.getElementById("textarea" + i + "6").innerHTML = obj.td06;
      document.getElementById("td0" + i + "1").innerHTML = obj.td01;
      document.getElementById("td0" + i + "2").innerHTML = obj.td02;
      document.getElementById("td0" + i + "3").innerHTML = obj.td03;
      document.getElementById("td0" + i + "4").innerHTML = obj.td04;
      document.getElementById("td0" + i + "5").innerHTML = obj.td05;

      divTag = document.getElementById("lostUserCreateTable" + i);
      if (playMap[i] == 1) {
        divTag.style.backgroundColor = "#7f73bf";
      }
      else {
        if((i%2) == 0){
          divTag.style.backgroundColor = "#BDD5D5";
        }else{
          divTag.style.backgroundColor = "#D6E5E5";
        }
      }

      // divTag.style.backgroundColor = "rgb(153, 204, 255)";
    }
    else {
      // console.log(td01[i]);
      divTag = document.getElementById("createrDiv");
      b = document.createElement("table");
      b.setAttribute("id", "lostUserCreateTable" + i);
      b.setAttribute("class", "lostUserCreateTable");
      b.setAttribute("border", "5");
      b.setAttribute("RULES", "ALL");
      b.setAttribute("onclick", "selectionLevel(this)");
      divTag.appendChild(b);

      divTag = document.getElementById("lostUserCreateTable" + i);
      if (playMap[i] == 1) {
        divTag.style.backgroundColor = "#7f73bf";
      }

      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      for (var j = 1; j <= 6; j++) {
        b = document.createElement("td");
        b.setAttribute("id", "td0" + i + j);
        b.setAttribute("class", "td0" + j);
        divTag.appendChild(b);
        if (j == 6) {
          divTag = document.getElementById("td0" + i + j);
          b = document.createElement("textarea");
          b.setAttribute("id", "textarea" + i + j);
          b.setAttribute("rows", "1");
          b.setAttribute("onfocus", "blur()");
          divTag.appendChild(b);
          document.getElementById("textarea" + i + j).innerHTML = obj.td06;
          divTag = document.getElementById("tr" + i);
        } else if (j == 1) {
          document.getElementById("td0" + i + j).innerHTML = obj.td01;
        } else if (j == 2) {
          document.getElementById("td0" + i + j).innerHTML = obj.td02;
        } else if (j == 3) {
          document.getElementById("td0" + i + j).innerHTML = obj.td03;
        } else if (j == 4) {
          document.getElementById("td0" + i + j).innerHTML = obj.td04;
        } else if (j == 5) {
          document.getElementById("td0" + i + j).innerHTML = obj.td05;
        }
      }

    }
  }
  if (scriptData.length < oldDisMapNum) {
    for (var ssi = scriptData.length; ssi < oldDisMapNum; ssi++) {
      divTag = document.getElementById("lostUserCreateTable" + ssi.toString());
      parentObj = divTag.parentNode;
      parentObj.removeChild(divTag);

    }
  }
  oldDisMapNum = scriptData.length

}

var searchTextBox = document.getElementById("searchTextBox");
// searchTextBox.onkeydown = function () {
//   // console.log("search:");
//   // console.log(searchTextBox.value);
//   searchTextBox.className = "searchFocus";
//   if (searchTextBox.value.length > 0) {
//     userMap.length = 0;
//     for (let indexS = 0; indexS < completUserMap.length; indexS++) {
//       const element = completUserMap[indexS];
//       if (completUserMap[indexS].author.indexOf(searchTextBox.value) > -1 || completUserMap[indexS].mapName.indexOf(searchTextBox.value) > -1) {
//         userMap.push(completUserMap[indexS]);
//       }
//     }
//   }
//   else {
//     var index = levelSelect.selectedIndex;
//     // console.log(index);
//     if (index == 0) { //全部
//       userMap = completUserMap.slice(0);
//     }
//     else { //可遊玩
//       userMap.length = 0;
//       for (let indexS = 0; indexS < completUserMap.length; indexS++) {
//         const element = completUserMap[indexS];
//         if (user.starNum >= element.requireStar) {
//           userMap.push(completUserMap[indexS]);
//         }
//       }
//     }
//   }
//   updateMapData(userMap)
// }
searchTextBox.onkeyup = function () {
  searchFunc();
  // console.log("search:");
  // console.log(searchTextBox.value);
  // if (searchTextBox.value.length > 0) {
  //   userMap.length = 0;
  //   for (let indexS = 0; indexS < completUserMap.length; indexS++) {
  //     const element = completUserMap[indexS];
  //     if (completUserMap[indexS].author.indexOf(searchTextBox.value) > -1 || completUserMap[indexS].mapName.indexOf(searchTextBox.value) > -1) {
  //       userMap.push(completUserMap[indexS]);
  //     }
  //   }
  // }
  // else {
  //   var index = levelSelect.selectedIndex;
  //   // console.log(index);
  //   if (index == 0) { //全部
  //     userMap = completUserMap.slice(0);
  //   }
  //   else { //可遊玩
  //     userMap.length = 0;
  //     for (let indexS = 0; indexS < completUserMap.length; indexS++) {
  //       const element = completUserMap[indexS];
  //       if (user.starNum >= element.requireStar) {
  //         userMap.push(completUserMap[indexS]);
  //       }
  //     }
  //   }
  // }
  // updateMapData(userMap)
}
searchTextBox.onchange = function () {
  // console.log("happy");
  if (searchTextBox.value == "" || searchTextBox.value.length == 0) {
    clearSearch();
  }
}
function clearSearch() {
  changeTdNameDisplay();
  // console.log("happy");
  // var index = levelSelect.selectedIndex;
  // console.log(index);
  // if (index == 0) { //全部
  //   userMap = completUserMap.slice(0);
  // }
  // else { //可遊玩
  //   userMap.length = 0;
  //   for (let indexS = 0; indexS < completUserMap.length; indexS++) {
  //     const element = completUserMap[indexS];
  //     if (user.starNum >= element.requireStar) {
  //       userMap.push(completUserMap[indexS]);
  //     }
  //   }
  // }
  // updateMapData(userMap)
}
