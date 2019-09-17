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

var achievementStr;
var href = window.location.href;
var user, equipmentData, achievemenData, dictionaryData, test;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, gameSpeed;
var musicData;
var scriptData = {
  type: "init"
}

createLoadingMainView("center");
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  async:false,
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    // console.log(res);
    user = res;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        achievemenData = JSON.parse(this.responseText);
        initHome();
      }
    };
    xmlhttp.open("GET", "json/achievement.json", true);
    xmlhttp.send();
    try{
      loadmusicData();
    }
    catch{
      // console.log("no music");
    }
    // console.log(user);
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function () {
    //   if (this.readyState == 4 && this.status == 200) {
    //     equipmentData = JSON.parse(this.responseText);
    //     // console.log(equipmentData);
    //
    //   }
    // };
    // xmlhttp.open("GET", "json/equipment.json", true);
    // xmlhttp.send();

  }
})

// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function () {
//   if (this.readyState == 4 && this.status == 200) {
//     dictionaryData = JSON.parse(this.responseText);
//   }
// };
// xmlhttp.open("GET", "json/dictionary.json", true);
// xmlhttp.send();

dictionaryData = {
  code: []
}
var scriptData = {
  type: "loadDict"
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  async:false,
  success: function (res) {
    // console.log(res);
    dictionaryData = {
      code: res
    }
  }
})
equipmentData = {
  levelUpLevel: [],
  weaponLevel: [],
  armorLevel: []
}
var scriptData = {
  type: "loadEquip"
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  async:false,
  success: function (res) {
    // console.log(res);
    equipmentData = res;
  }
})
// console.log(123);
// console.log(equipmentData,dictionaryData,user);
closeMainLoadingView();

function getEquipmentData() {
  return equipmentData;
}

function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}
function initHome() {
  myAudio = document.getElementById("bkMusic");
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
  myAudio.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
  myAudio.play();
  bkMusicSwitch++;
  //// console.log(myAudio.volume);
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  levelUpLevel = user.levelUpLevel;
  swordLevel = user.weaponLevel;
  shieldLevel = user.armorLevel;
  achievementStr = achievementJudge();
  sendSession();
}
function weaponLevelup() {
  var scriptData = {
    type: "weaponLevelup"
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      if (res.err) {
        error();
      }
      user = res;
    }
  })
}
function armorLevelup() {
  var scriptData = {
    type: "armorLevelup",
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      if (res.err) {
        error();
      }
      // console.log(res.err);
      // console.log(user);
    }
  })
}
function getJson() {
  return dictionaryData;
}
//---------紀錄關卡資訊---------//
function recordLevel(scriptData) {
  var NowDate = new Date();
  scriptData.submitTime = NowDate
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptData,  // 將表單資料用打包起來送出去
    success: function (res) {
      user = res
      // console.log(user);
    }
  })
}
//////-------------/////////
function test() {
  // console.log("testbtn ---  onclick");
  // 武器升級
  // weaponLevelup();
  // 護甲升級
  // armorLevelup();

  // 儲存關卡
  // var scriptData = {
  //     type: "codeLevelResult",  //"codeLevelResult" or "blockLevelResult"限"EasyEmpire"
  //     Empire: "MediumEmpire",     //"EasyEmpire" or "MediumEmpire"
  //     level: 3,                 // 0~24 or 25
  //     StarNum: 4,               // 0 or 1 or 2 or 3
  //     result: "2星 or 1星 or 駛出邊界 or 未完成通關條件 ... ",
  //     code: " #include ........"
  // }
  // recordLevel(scriptData)
}

function logout() {
  // console.log("dddddd");
  var href = "/logout";
  window.location.replace(href);
}


//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var myAudio;
var divID, divID2, divTag, b;
var userdataFont;
var dataTitle = ["帳&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp號：",
  "使用者名稱：",
  "主&nbsp要&nbsp進&nbsp度：",
  "成&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp就：",
  "上架地圖數：",
  "已獲得星星數："];


var userMap = [];
var scriptData = {
  type: "userMap"
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    // console.log(res);
    // console.log("res:", res);

    userMap = res.length;
  }
})

function userData() {
  try {
    divTag = document.getElementById("userDataView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("userDataBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById("center");
  b = document.createElement("div");
  b.setAttribute("id", "userDataBkView");
  b.setAttribute("onclick", "closeFunc(\"userDataView\",\"userDataBkView\")");
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
  b.setAttribute("onclick", "closeFunc(\"userDataBkView\",\"userDataView\")");
  divTag.appendChild(b);
  /*修改密碼按鈕*/
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "changePasswordBtn");
  b.setAttribute("value", "修改密碼");
  b.setAttribute("onclick", "changePassword(\"userDataView\")");
  divTag.appendChild(b);
  createUserView("userDataView");
}
function closeFunc(thisDiv, thisDiv2) {
  try {
    document.getElementById("changePasswordBtn").className = "";
    document.getElementById("clossDiv").className = "";
  } catch (e) { }
  try {
    divTag = document.getElementById(thisDiv);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  try {
    divTag = document.getElementById(thisDiv2);
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
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
      var count = 0;
      for (var achievementI = 0; achievementI < achievementStr.length; achievementI++) {
        if (achievementStr[achievementI] == 1) {
          count++;
        }
      }
      userdataFont = count + "/9";
    } else if (i == 4) {
      userdataFont = userMap;
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
function changePassword(thisDiv) {
  var tdValue = ["舊密碼", "新密碼", "確認新密碼"], inputID = ["oldPassword", "newPassword", "checkPassword"];
  document.getElementById("changePasswordBtn").className = "disabled";
  document.getElementById("clossDiv").className = "disabled";
  divTag = document.getElementById("userDataView");
  b = document.createElement("div");
  b.setAttribute("id", "changePasswordView");
  divTag.appendChild(b);
  divTag = document.getElementById("changePasswordView");
  b = document.createElement("h1");
  b.setAttribute("id", "changePasswordTitle");
  b.innerHTML = "修改密碼";
  divTag.appendChild(b);

  b = document.createElement("table");
  b.setAttribute("id", "changePasswordTable");
  divTag.appendChild(b);
  divTag = document.getElementById("changePasswordTable");
  for (var i = 0; i < 3; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "changePasswordTr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 2; j++) {
      divTag = document.getElementById("changePasswordTr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "changePasswordTd" + i + j);
      divTag.appendChild(b);
      divTag = document.getElementById("changePasswordTd" + i + j);
      if (j == 0) {
        b = document.createElement("h2");
        b.setAttribute("id", "changePasswordH2" + i + j);
        b.innerHTML = tdValue[i];
        divTag.appendChild(b);
      } else {
        b = document.createElement("input");
        b.setAttribute("type", "password");
        b.setAttribute("id", inputID[i]);
        divTag.appendChild(b);
      }
    }
    divTag = document.getElementById("changePasswordTable");
  }
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "cancelBtn");
  b.setAttribute("value", "取消修改");
  b.setAttribute("onclick", "closeFunc(\"changePasswordView\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "confirmBtn");
  b.setAttribute("value", "確認修改");
  // b.setAttribute("onclick", "closeFunc(\"changePasswordView\")");
  b.setAttribute("onclick", "changePass()");

  divTag.appendChild(b);
}
function changePass() {
  oldPassword = document.getElementById("oldPassword");
  newPassword = document.getElementById("newPassword");
  checkPassword = document.getElementById("checkPassword");

  var strOP = oldPassword.value;
  var strP = newPassword.value;
  var strCP = checkPassword.value;
  if (oldPassword.value == "") {
    // alert("動作失敗<br>" + "\"舊密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"舊密碼\"不能為空";
    remindView(remindValue);
  }
  else if (strOP.indexOf(" ") != -1) {
    // alert("動作失敗<br>" + "\"舊密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"舊密碼\"有空白字元";
    remindView(remindValue);
  }
  else if (newPassword.value == "") {
    // alert("動作失敗<br>" + "\"密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"密碼\"不能為空";
    remindView(remindValue);
  }
  else if (strP.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "\"密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"密碼\"有空白字元";
    remindView(remindValue);
  }
  else if (checkPassword.value == "") {
    // alert("動作失敗\n" + "\"確認密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"確認密碼\"不能為空";
    remindView(remindValue);
  }
  else if (strCP.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "\"確認密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"確認密碼\"有空白字元";
    remindView(remindValue);
  }
  else if (newPassword.value != checkPassword.value) {
    // alert("動作失敗\n" + "\"密碼\"與\"確認密碼\"不同");
    remindValue = "動作失敗<br>" + "\"密碼\"與\"確認密碼\"不同";
    remindView(remindValue);
  }
  else {
    var scriptData = {
      type: "changePassword",
      oldPassword: oldPassword.value,
      password: newPassword.value,
    }
    // console.log(scriptData);
    // alert("wait");
    var href = window.location.href;
    $.ajax({
      url: href,              // 要傳送的頁面
      method: 'POST',         // 使用 POST 方法傳送請求
      dataType: 'json',       // 回傳資料會是 json 格式
      data: scriptData,       // 將表單資料用打包起來送出去
      success: function (res) {
        result = "動作失敗<br>";
        // alert(res.responce );
        if (res.responce == "sucesss") {
          result = "修改成功";
          // alert(result);
          remindValue = result;
          remindView(remindValue);
          closeFunc("changePasswordView");
        }
        else if (res.responce == "failPassUndifine") {
          result += "\"舊密碼\"錯誤";
          // alert(result);
          remindValue = result;
          remindView(remindValue);
        }

      },
    });
  }
}
//////////////////////////////////////////////////
//              homeBtn.js                        //
//////////////////////////////////////////////////
var divTag, b, divID, divID2;

/*裝備*/
function equipageView(mainDiv) {
  // console.log("武器:" + equipmentData.weaponLevel.length, user.weaponLevel);
  // console.log("護具:" + equipmentData.armorLevel.length, user.armorLevel);
  divID = "equipageView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "closeFunc(\"equipageView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "equipageView");
  divTag.appendChild(b);
  divTag = document.getElementById("equipageView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"equipageView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "裝備";
  if (user.username == "NKUSTCCEA") {
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "modifyEquipageView");
    b.setAttribute("onclick", "modifyEquipment()");
    divTag.appendChild(b);
  }
  b = document.createElement("div");
  b.setAttribute("id", "equipageInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("equipageInnerDiv");
  b = document.createElement("table");
  b.setAttribute("id", "equipageTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("equipageTable");
  for (var i = 0; i < 2; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 3; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      divTag.appendChild(b);
      if (j == 0) {
        if (i == 0) {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "swordImg");
          b.setAttribute("src", "img/sword.png");
          divTag.appendChild(b);
        } else {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "shieldImg");
          b.setAttribute("src", "img/shield.png");
          divTag.appendChild(b);
        }
      } else if (j == 1) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("div");
        if (i == 0) {
          b.setAttribute("id", "swordLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "swordLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("swordLevelUpDivH3").innerHTML = "";
        } else {
          b.setAttribute("id", "shieldLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "shieldLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("shieldLevelUpDivH3").innerHTML = "";
        }
      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        /*b = document.createElement("input");
        b.setAttribute("type","button");
        b.setAttribute("id","levelUp" + i);
        b.setAttribute("value","升級");*/
        b = document.createElement("button");
        b.setAttribute("id", "levelUpDefault" + i);
        if (i == 0) {
          b.setAttribute("onclick", "swordLevelUp()");
          b.setAttribute("class", "levelUpDefault");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        } else {
          b.setAttribute("onclick", "shieldLevelUp()");
          b.setAttribute("class", "levelUp");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        }
      }
    }
    divTag = document.getElementById("equipageTable");
  }

  for (var i = 0; i < 2; i++) {
    if (i == 0) {
      divTag = document.getElementById("swordLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "swordLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("swordLevelUpTable");
    } else {
      divTag = document.getElementById("shieldLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "shieldLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("shieldLevelUpTable");
    }
    for (var j = 0; j < 10; j++) {
      b = document.createElement("td");
      divTag.appendChild(b);
      b = document.createElement("div");
      if (i == 0) {
        b.setAttribute("id", "swordLevelUpinnerDiv" + j);
      } else {
        b.setAttribute("id", "shieldLevelUpinnerDiv" + j);
      }

      if (j == 0) {
        b.setAttribute("class", "levelFont");
      } else if (j == 9) {
        b.setAttribute("class", "levelLaterDefault");
      } else {
        b.setAttribute("class", "levelDefault");
      }
      divTag.appendChild(b);
    }
  }

  divTag = document.getElementById("equipageView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "resetEquipageLevel");
  b.setAttribute("class", "resetEquipageLevel");
  b.setAttribute("value", "重置升級");
  b.setAttribute("onclick", "resetEquipClick(this)");
  divTag.appendChild(b);
  ///--------------------------------- ///
  /*             new                    */
  ///--------------------------------- ///
  for (var li = 0; li < equipmentData.weaponLevel.length && li < 10; ++li) {
    var temp = document.getElementById("swordLevelUpinnerDiv" + li);
    if (li < swordLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    }
    else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  for (var li = 0; li < equipmentData.armorLevel.length && li < 10; ++li) {
    var temp = document.getElementById("shieldLevelUpinnerDiv" + li);
    if (li < shieldLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    }
    else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  var swordmaxFlag = false, shiledmaxFlag = false;
  if ((swordLevel + shieldLevel) >= 15) {
    if (swordLevel == 10) {
      document.getElementById("levelUpDefault0").innerHTML = "";
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    }
    else if (shieldLevel == 10) {
      document.getElementById("levelUpDefault1").innerHTML = "";
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
    }
    else {
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    }
    document.getElementById("levelUpDefault0").innerHTML = "";
    // document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    // document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault0").className = "levelUpDefault2";
    document.getElementById("levelUpDefault1").className = "levelUpDefault2";
  }
  else if (swordLevel == 10) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿";
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
    // document.getElementById("levelUpDefault0").innerHTML = "最高<br>等級";

    if (star <= user.starNum) {
      // console.log("重製失敗");
      document.getElementById("levelUpDefault0").className = "highestLevel";
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  else if (shieldLevel == 10) {
    document.getElementById("levelUpDefault1").innerHTML = "";
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    // document.getElementById("levelUpDefault1").innerHTML = "最高<br>等級";
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "highestLevel";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  else {
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    document.getElementById("levelUpFont1").innerHTML = text;

    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  // console.log(swordLevel, shieldLevel);
}
/*重置等級*/
function resetEquipClick() {
  var scriptData = {
    type: "resetEquip"
  }
  $.ajax({
    url: href,              // 要傳送的頁面
    method: 'POST',         // 使用 POST 方法傳送請求
    dataType: 'json',       // 回傳資料會是 json 格式
    data: scriptData,       // 將表單資料用打包起來送出去
    success: function (res) {
      user = res;
      swordLevel = 0;
      shieldLevel = 0;
      levelUpLevel = 0;
      // closeFunc("equipageView","equipageBkViewv");
      closeFunc("equipageView", "equipageBkView");
      equipageView(center);
    }
  })
}
/*武器*/
function swordLevelUp() {
  b = document.getElementById("swordLevelUpinnerDiv" + swordLevel);
  if (swordLevel == 0) {
    b.className = "levelFont";
  } else if (swordLevel == 9) {
    b.className = "levelLater";
  } else if (swordLevel < 9) {
    b.className = "levelChange";
  }
  swordLevel++;
  levelUpLevel++;
  /*   ----------------------------------    */
  weaponLevelup();
  if ((swordLevel + shieldLevel) >= 15) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    // document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    // document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";

    document.getElementById("levelUpDefault0").className = "levelUpDefault2";
    document.getElementById("levelUpDefault1").className = "levelUpDefault2";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

  }
  else if (swordLevel >= 10) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    document.getElementById("levelUpDefault0").innerHTML = "";
    document.getElementById("levelUpDefault0").className = "highestLevel";

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
  }
  else {
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
    }
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;

    document.getElementById("levelUpFont0").innerHTML = text;
    if (shieldLevel < 10) {
      document.getElementById("levelUpFont1").innerHTML = text;
    }
    if (star > user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    else {

      document.getElementById("levelUpDefault0").className = "levelUp";
      if (shieldLevel < 10) {
        document.getElementById("levelUpDefault1").className = "levelUp";
      }
    }
  }


}
/*防具*/
function shieldLevelUp() {
  // console.log("123");

  b = document.getElementById("shieldLevelUpinnerDiv" + shieldLevel);
  if (shieldLevel == 0) {
    b.className = "levelFont";
  } else if (shieldLevel == 9) {
    b.className = "levelLater";
  } else if (shieldLevel < 9) {
    b.className = "levelChange";
  }
  shieldLevel++;
  levelUpLevel++;
  /*   ----------------------------------    */
  armorLevelup();
  if ((swordLevel + shieldLevel) >= 15) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    // document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    // document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";

    document.getElementById("levelUpDefault0").className = "levelUpDefault2";
    document.getElementById("levelUpDefault1").className = "levelUpDefault2";

    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
  }
  else if (shieldLevel >= 10) {
    document.getElementById("levelUpDefault1").innerHTML = "";
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    document.getElementById("levelUpDefault1").innerHTML = "";
    document.getElementById("levelUpDefault1").className = "highestLevel";
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;

  }
  else {
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault1").className = "levelUp";
    }
    else {
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    if (swordLevel < 10) {
      document.getElementById("levelUpFont0").innerHTML = text;
    }
    document.getElementById("levelUpFont1").innerHTML = text;
    if (star > user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
    else {
      if (swordLevel < 10) {

        document.getElementById("levelUpDefault0").className = "levelUp";
      }
      document.getElementById("levelUpDefault1").className = "levelUp";
    }

  }




}
/*指令大全*/
function instructionView(mainDiv) {
  divID = "instructionView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "closeFunc(\"instructionView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "instructionView");
  divTag.appendChild(b);
  divTag = document.getElementById("instructionView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"instructionView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "指令大全";
  b = document.createElement("div");
  b.setAttribute("id", "instructionInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("instructionInnerDiv");
  b = document.createElement("table");
  b.setAttribute("id", "instructionTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("instructionTable");
  var dic = dictionaryData.code;
  var passLevel;
  if (user.MediumEmpire.codeLevel.length != 0) {
    passLevel = user.MediumEmpire.codeLevel.length;
    passLevel += 24;
  } else {
    if (user.EasyEmpire.codeLevel.length > user.EasyEmpire.blockLevel.length) {
      passLevel = user.EasyEmpire.codeLevel.length;
      passLevel++;
    } else {
      passLevel = user.EasyEmpire.blockLevel.length;
      passLevel++;
    }
  }
  for (var i = 0; i < dic.length * 2; i++) {
    if ((i % 2) == 0) {
      var li = dic[parseInt(i / 2)].element;
      var minLimit = 999;
      for (var j = 0; j < li.length; j++) {
        if (minLimit > li[j].limit) {
          minLimit = li[j].limit;
        }
      }
      if (minLimit > passLevel) {
        continue;
      }
      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "td" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("td" + i);
      b = document.createElement("h1");
      b.setAttribute("id", "actionFont" + i);
      divTag.appendChild(b);
      document.getElementById("actionFont" + i).innerHTML = dic[i / 2].type;
      if (user.username == "NKUSTCCEA") {
        var fistChildLength = document.getElementById("td" + i).childNodes[0].innerHTML.length;
        b = document.createElement("input");
        b.setAttribute("type", "button");
        b.setAttribute("id", "modifyInstructionView");
        if(fistChildLength == 3){
          b.setAttribute("style","transform:translate(200%,-90%)");
        }
        b.setAttribute("onclick", "modifyInstruction(" + i + ")");
        divTag.appendChild(b);
      }
    } else {
      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      b.setAttribute("align", "left");
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      b = document.createElement("div");
      b.setAttribute("id", "actionDiv" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("actionDiv" + i);
      // if (i == 1) {
      // for (var j = 0; j < 5; j++) {
      var li = dic[parseInt(i / 2)].element;
      //// console.log(li);
      for (var j = 0; j < li.length; j++) {
        //// console.log(li[j].limit,li[j].name,passLevel);
        divTag = document.getElementById("actionDiv" + i);
        if (li[j].limit > passLevel) {
          continue;
        }
        b = document.createElement("details");
        b.setAttribute("id", "detailsInner" + i + j);
        b.setAttribute("class", "instructionDetailsInner");
        divTag.appendChild(b);
        divTag = document.getElementById("detailsInner" + i + j);
        b = document.createElement("summary");
        b.setAttribute("id", "summaryInner" + i + j);
        b.setAttribute("class", "summaryInner");
        divTag.appendChild(b);
        // document.getElementById("aInner" + j).innerHTML = "step( )▼";
        document.getElementById("summaryInner" + i + j).innerHTML = li[j].name;
        //
        b = document.createElement("p");
        b.setAttribute("id", "item" + i + j);
        b.setAttribute("class", "itemP");
        b.setAttribute("readonly", "true");
        divTag.appendChild(b);
        // document.getElementById("item" + j).innerHTML = "&nbsp&nbsp&nbsp&";
        document.getElementById("item" + i + j).innerHTML = "&nbsp&nbsp&nbsp&nbsp" + li[j].value;
      }
      // } else {
      //     document.getElementById("actionDiv" + i).innerHTML = functionVar;
      // }
    }
    divTag = document.getElementById("instructionTable");
  }
}
/*成就*/
function achievementView(mainDiv) {
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "closeFunc(\"achievementView\",\"equipageBkView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "achievementView");
  divTag.appendChild(b);
  divTag = document.getElementById("achievementView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"achievementView\",\"equipageBkView\")");
  divTag.appendChild(b);

  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "成就";
  b = document.createElement("div");
  b.setAttribute("id", "achievementInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("achievementInnerDiv");
  b = document.createElement("table");
  b.setAttribute("id", "achievementTable");
  b.setAttribute("rules", "rows");
  b.setAttribute("border", "1");
  divTag.appendChild(b);
  divTag = document.getElementById("achievementTable");
  for (var i = 0; i < achievemenData.record.length; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 3; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      divTag.appendChild(b);
      if (j == 0) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("img");
        b.setAttribute("id", "champtionImg" + i);

        if (achievemenData.record[i].level == 1) {
          b.setAttribute("class", "champtionCopper");
        }
        else if (achievemenData.record[i].level == 2) {
          b.setAttribute("class", "champtionSilver");
        }
        else if (achievemenData.record[i].level == 3) {
          b.setAttribute("class", "champtionGold");
        }
        divTag.appendChild(b);
      } else if (j == 1) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("div");
        b.setAttribute("id", "achievementInnerDiv" + i);
        b.setAttribute("class", "achievementInnerDiv");
        divTag.appendChild(b);
        divTag = document.getElementById("achievementInnerDiv" + i);
        b = document.createElement("details");
        b.setAttribute("id", "achievementDetailsInner" + i);
        b.setAttribute("class", "achievementDetailsInner");
        divTag.appendChild(b);
        divTag = document.getElementById("achievementDetailsInner" + i);
        b = document.createElement("summary");
        b.setAttribute("id", "achievementSummaryInner" + i);
        b.setAttribute("class", "achievementSummaryInner");
        divTag.appendChild(b);

        //////---------------------new-----------------------///////////////
        document.getElementById("achievementSummaryInner" + i).innerHTML = achievemenData.record[i].name
        // divTag = document.getElementById("achievementInnerDiv" + i);
        b = document.createElement("p");
        b.setAttribute("id", "achievementItem" + i);
        b.setAttribute("class", "achievementItem");
        divTag.appendChild(b);
        document.getElementById("achievementItem" + i).innerHTML = achievemenData.record[i].value;

      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("font");
        b.setAttribute("id", "achievementFont" + i);
        if (achievementStr[i] == 1) {
          b.setAttribute("class", "achievementFont");
        } else {
          b.setAttribute("class", "achievementFontDefault");
        }
        divTag.appendChild(b);
        if (achievementStr[i] == 1) {
          document.getElementById("achievementFont" + i).innerHTML = "✔";
        } else {
          document.getElementById("achievementFont" + i).innerHTML = "未完成";
        }

      }
    }
    divTag = document.getElementById("achievementTable");
  }
}
/*成就判斷*/
function achievementJudge() {
  var maxValue = [1, 2, 1], isGet = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var empire = [user.EasyEmpire, user.MediumEmpire]
  var maxLevel = 0, getThreeStar = 0, equipmentLevel = user.levelUpLevel, highestLevel = [empire[0].codeHighestLevel, empire[1].HighestLevel];
  if (highestLevel[0] > highestLevel[1]) {
    maxLevel = highestLevel[0];
  } else {
    maxLevel = highestLevel[1];
  }
  for (var i = 0; i < 2; i++) {
    var maxJ = highestLevel[i];
    if (i == 1) {
      maxJ = (highestLevel[i] - 24);
    }
    for (var j = 0; j < maxJ; j++) {
      if (empire[i].codeLevel[j].HighestStarNum == 3) {
        getThreeStar++;
      }
    }
  }
  // console.log("最高過關數:", maxLevel);
  // console.log("獲得三星數:", getThreeStar);
  for (var typeVar = 0; typeVar < 3; typeVar++) {
    for (var valueVar = 0; valueVar < 3; valueVar++) {
      // console.log(typeVar + valueVar);
      switch (typeVar) {
        /*通關數*/
        case 0:
          // console.log(maxLevel, achievemenData.record[typeVar + valueVar].limit[0].value);
          if (maxLevel >= achievemenData.record[typeVar + valueVar].limit[0].value) {
            isGet[typeVar + valueVar] = 1;
          }
          break;
        /*獲得三星數*/
        case 1:
          // console.log(typeVar + valueVar + 2,achievemenData.record[typeVar + valueVar + 2]);
          if (getThreeStar >= achievemenData.record[typeVar + valueVar + 2].limit[0].value) {
            isGet[typeVar + valueVar + 2] = 1;
          }
          break;
        /*裝備升級數*/
        case 2:
          if (equipmentLevel >= achievemenData.record[typeVar + valueVar + 4].limit[0].value) {
            isGet[typeVar + valueVar + 4] = 1;
          }
          break;
      }
    }
  }
  // console.log("長度:",isGet.length);
  // for (var i = 0; i < isGet.length; i++) {
  //   // console.log(isGet[i],i);
  // }
  return isGet;
}
/*設定*/
function settingAllView(mainDiv) {
  divID = "settingAllView";
  divID2 = "equipageBkView";
  divTag = document.getElementById(mainDiv.id);
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "closeFunc(\"settingAllView\",\"equipageBkView\")");
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
  b.setAttribute("onclick", "closeFunc(\"settingAllView\",\"equipageBkView\")");
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
  b.setAttribute("id", "tr0");
  divTag.appendChild(b);
  divTag = document.getElementById("tr0");
  b = document.createElement("td");
  b.setAttribute("id", "row0_0");
  divTag.appendChild(b);
  divTag = document.getElementById("row0_0");
  b = document.createElement("h2");
  b.setAttribute("id", "settingMusic");
  divTag.appendChild(b);
  document.getElementById("settingMusic").innerHTML = "遊戲音樂";
  divTag = document.getElementById("tr0");
  b = document.createElement("td");
  b.setAttribute("id", "row0_1");
  b.setAttribute("colspan", "2");
  divTag.appendChild(b);
  divTag = document.getElementById("row0_1");
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
  b.setAttribute("id", "tr1");
  divTag.appendChild(b);
  divTag = document.getElementById("tr1");
  b = document.createElement("td");
  b.setAttribute("id", "row1_0");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_0");
  b = document.createElement("h2");
  b.setAttribute("id", "musicVolume");
  divTag.appendChild(b);
  document.getElementById("musicVolume").innerHTML = "音樂大小";
  divTag = document.getElementById("tr1");
  b = document.createElement("td");
  b.setAttribute("id", "row1_1");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_1");
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelDown()');
  b.setAttribute('value', '-');
  divTag.appendChild(b);

  divTag = document.getElementById("tr1");
  b = document.createElement("td");
  b.setAttribute("id", "row1_2");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_2");
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

  divTag = document.getElementById("tr1");
  b = document.createElement("td");
  b.setAttribute("id", "row1_3");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_3");
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelUp()');
  b.setAttribute('value', '+');
  divTag.appendChild(b);

  /*調整遊戲速度*/
  divTag = document.getElementById("settingAllTable");
  b = document.createElement("tr");
  b.setAttribute("id", "tr2");
  divTag.appendChild(b);
  divTag = document.getElementById("tr2");
  b = document.createElement("td");
  b.setAttribute("id", "row2_0");
  divTag.appendChild(b);
  divTag = document.getElementById("row2_0");
  b = document.createElement("h2");
  b.setAttribute("id", "settingSpeed");
  divTag.appendChild(b);
  document.getElementById("settingSpeed").innerHTML = "遊戲速度";
  divTag = document.getElementById("tr2");
  b = document.createElement("td");
  b.setAttribute("id", "row2_1");
  b.setAttribute("colspan", "2");
  divTag.appendChild(b);
  divTag = document.getElementById("row2_1");
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
  myAudio = document.getElementById("bkMusic");
  myAudio.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
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
  myAudio = document.getElementById("bkMusic");
  myAudio.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
  bkMusicSwitch++;
  sendSession();
}

function chk(input) {
  for (var i = 0; i < document.form1.c1.length; i++) {
    document.form1.c1[i].checked = false;
  }
  input.checked = true;
  myAudio = document.getElementById("bkMusic");
  if (input.id == "musicOpen") {
    bkMusicSwitch = 2;
  } else {
    bkMusicSwitch = 1;
  }
  myAudio.volume = --bkMusicSwitch * (musicLevel * bkMusicVolumn);
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
  var count = 0;
  for (var achievementI = 0; achievementI < achievementStr.length; achievementI++) {
    if (achievementStr[achievementI] == 1) {
      count++;
    }
  }
  // console.log("bkMusicSwitch:" + bkMusicSwitch);
  // console.log("musicLevel:" + musicLevel);
  // console.log("bkMusicVolumn:" + bkMusicVolumn);
  //// console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  Session.set("getAchievement", count);
  Session.set("xtest", count);
  return;
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
  divTag = document.getElementById("center");
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
