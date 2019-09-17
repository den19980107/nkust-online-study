if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function() {

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
    set: function(name, value) {
      store[name] = value;
    },

    // 列出指定的 session 資料
    get: function(name) {
      return (store[name] ? store[name] : undefined);
    },

    // 清除資料 ( session )
    clear: function() {
      store = {};
    },

    // 列出所有存入的資料
    dump: function() {
      return JSON.stringify(store);
    }

  };

})();
//返回上一頁
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
}
var href = window.location.href;
var user, equipmentData, achievemenData, dictionaryData, levelDivAlive = false,
  isOblivionOpen;
var swordLevel = 0,
  shieldLevel = 0,
  levelUpLevel = 0,
  musicLevel = 1,
  bkMusicSwitch, bkMusicVolumn = 0.1,
  args, gameSpeed;
var musicData;

var allUserData, completallUserData, oldDisMapNum = 0;


initHome();


function error() {
  alert("有不當的操作發生");
  window.location.replace(href);

}

function initHome() {
  sendLoadUsernameMap();
}
//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////
//登出函式
function logout() {
  var href = "/logout";
  window.location.replace(href);
}

var thisSelectionId;
var args;
var divTag, level, thisIndex;
var lastObject = null,
  lastColor;
//當那一列資料被選到調用此函式
function selectionLevel(thisObject) {
  var mapIndex = 0;
  thisSelectionId = thisObject.id;
  if (thisSelectionId) {
    //將該table後面的數字切割出來並轉為Int
    mapIndex = parseInt(thisSelectionId.substr("lostUserCreateTable".length));
    thisIndex = mapIndex;
    // console.log(thisIndex);
  }
  if (lastObject != null) {
    //將上一個被選到的table的顏色設為原本的顏色
    lastObject.style.backgroundColor = lastColor;
  }
  //設定完之後將lastColor設為現在正被選到的這個顏色
  lastColor = thisObject.style.backgroundColor;
  //將現在被選到的table的顏色設為#C2C2C2
  thisObject.style.backgroundColor = "#C2C2C2";
  //將thisObjsct存到lastObiect
  lastObject = thisObject;
  //如果現在被選到的狀態為"封鎖"，改變底下按鈕的圖片
  if (document.getElementById("td0" + mapIndex + "6").innerHTML == "封鎖") {
    document.getElementById("changeStatus").style.backgroundImage = "url(../img/unBlockade.png)";
  } else { //如果是"正常"狀態，就改成"封鎖"圖片
    document.getElementById("changeStatus").style.backgroundImage = "url(../img/blockade.png)";
  }
}

function createMapPermission(index) {
  // console.log(allUserData[index]._id);
  var checkName = "#input0" + index + "6";
  if ($(checkName).is(":checked")) {
    var canCreateMapPermission = true;
    allUserData[index].canCreateMapPermission = true;
  } else {
    var canCreateMapPermission = false;

    allUserData[index].canCreateMapPermission = false;
  }

  createLoadingMainView("center");
  $.ajax({
    url: "changeUserCreateMapPermission", // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    async: false,
    data: {
      userId: allUserData[index]._id,
      canCreateMapPermission: canCreateMapPermission
    }, // 將表單資料用打包起來送出去
    success: function(res) {
      // console.log(res);

    }
  })
  closeMainLoadingView();
}

function changeStatus() {
  //如果有選擇到table
  if (thisSelectionId) {
    var userstatus = 0;
    //如果被選為"封鎖"，改變狀態為"正常"，此處是改table內的欄位
    if (document.getElementById("td0" + thisIndex + "6").innerHTML == "封鎖") {
      document.getElementById("td0" + thisIndex + "6").innerHTML = "正常";
      document.getElementById("changeStatus").style.backgroundImage = "url(../img/blockade.png)";
      allUserData[thisIndex].userstatus = 0;
      userstatus = 0
    } else { //若為"正常"，則改為"封鎖"
      document.getElementById("td0" + thisIndex + "6").innerHTML = "封鎖";
      document.getElementById("changeStatus").style.backgroundImage = "url(../img/unBlockade.png)";
      allUserData[thisIndex].userstatus = 1;
      userstatus = 1
    }
    //此為豐銘更改資料庫用
    var scriptData = {
      type: "changeUserStatus",
      userId: allUserData[thisIndex]._id,
      userstatus: userstatus
    }
    // console.log(scriptData)
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
      success: function(res) {
        // console.log(res);

      }
    })

  } else { //若沒選到table則調用提醒視窗顯示錯誤資訊
    remindValue = "請點選一位使用者";
    remindView(remindValue);
  }
}
var levelDivAlive = false;
//創造提醒視窗的函式
function remindView(remindValue) {
  var isTwoLine = false;
  //用以判斷顯示資訊是一行還是兩行
  for (var i = 0; i < remindValue.length; i++) {
    //因為兩行的資訊內會有<br>所以只要有"<"就可以知道為兩行
    if (remindValue[i] == "<") {
      isTwoLine = true;
      break;
    }
  }
  //為預防重複創立，所以先刪除看看，成功的話會把舊的刪除，失敗就會有錯誤發生，所以才是try的方式
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
  //如果是兩行則將class設為twoLine，反之則設為oneLine
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
  //先將文字清空再把文字設定進去
  document.getElementById("remindH2").innerHTML = "";
  document.getElementById("remindH2").innerHTML = remindValue;

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "remindTrueBtn");
  b.setAttribute("value", "確定");
  b.setAttribute("onclick", "clossFunc(\"remindView\",\"remindBkView\")");
  divTag.appendChild(b);
}
//關閉按鈕的函式
function clossFunc(thisDiv, thisDiv2) {
  var divTag = document.getElementById(thisDiv);
  //嘗試刪除div
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById(thisDiv2);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  levelDivAlive = false;
}


/*建立表格*/
function sendLoadUsernameMap() {
  var scriptData = {
    type: "LoadUser",
  }
  $.ajax({
    url: href, // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    data: scriptData, // 將表單資料用打包起來送出去
    success: function(res) {
      // console.log(res);
      allUserData = res;
      // console.log(allUserData);
      var mapData = [];
      for (let index = 0; index < res.length; index++) {
        var obj = res[index];
        var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1; //0~49 49+1 -->1~50 51
        if (hightLevel == 51) {
          hightLevel = 50;
        }
        allUserData[index].hightLevel = hightLevel;
        var userstatusStr = "正常"
        if (obj.userstatus) {
          userstatusStr = "封鎖"
        } else {
          allUserData[index].userstatus = 0;
        }
        var script = {
          td01: obj.username,
          td02: obj.name,
          td03: obj.email,
          td04: obj.starNum,
          td05: allUserData[index].hightLevel,
          td06: userstatusStr,
        }
        if (obj.canCreateMapPermission) {
          script.canCreateMapPermission = obj.canCreateMapPermission
        }

        mapData.push(script);
      }
      completallUserData = allUserData.slice(0);
      createLevelTable(mapData);
    }
  })
}


/*建立表格*/
function createLevelTable(scriptData) {

  // console.log(scriptData);
  oldDisMapNum = scriptData.length;
  //根據scriptData的長度創造對應數量的table
  for (var i = 0; i < scriptData.length; i++) {
    // for (var i = 0; i < 20; i++) {
    var obj = scriptData[i];
    divTag = document.getElementById("createrDiv");
    //創造table標籤
    b = document.createElement("table");
    b.setAttribute("id", "lostUserCreateTable" + i);
    b.setAttribute("class", "lostUserCreateTable");
    b.setAttribute("border", "5");
    b.setAttribute("RULES", "ALL");
    b.setAttribute("onclick", "selectionLevel(this)");
    divTag.appendChild(b);
    //將偶數的table的背景顏色改為#F0E0CF
    divTag = document.getElementById("lostUserCreateTable" + i);
    if ((i % 2) == 0) {
      divTag.style.backgroundColor = "#F0E0CF";
    }
    //創造tr標籤
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    divTag = document.getElementById("tr" + i);
    //創造6個br標籤
    for (var j = 1; j <= 7; j++) {
      b = document.createElement("td");
      b.setAttribute("id", "td0" + i + j);
      b.setAttribute("class", "td0" + j);
      divTag.appendChild(b);
      //在每個br標籤內創立input標籤來顯示文字
      divTag = document.getElementById("td0" + i + j);
      b = document.createElement("input");
      b.setAttribute("type", "text");
      b.setAttribute("id", "input0" + i + j);
      b.setAttribute("readonly", "readonly");
      // b.setAttribute("onclick", "createMapPermission(" + i + ")");
      divTag.appendChild(b);
      if (j == 1) { /*使用者帳號*/
        document.getElementById("input0" + i + j).value = obj.td01;
        // document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 2) { /*使用者名稱*/
        document.getElementById("input0" + i + j).value = obj.td02;
        // document.getElementById("td0" + i + j).innerHTML = "aa";
      } else if (j == 3) { /*使用者信箱*/
        document.getElementById("input0" + i + j).value = obj.td03;
        // document.getElementById("td0" + i + j).innerHTML = "karta1335618@gmail.com";
      } else if (j == 4) { /*星星數*/
        document.getElementById("input0" + i + j).value = obj.td04;
        // document.getElementById("td0" + i + j).innerHTML = "50";
      } else if (j == 5) { /*最高的關卡*/
        document.getElementById("input0" + i + j).value = obj.td05;
        // document.getElementById("td0" + i + j).innerHTML = "13";
      } else if (j == 6) { /*使用者狀態*/
        b.setAttribute("type", "checkbox");
        b.setAttribute("class", "mapCheckbox");
        if (obj.canCreateMapPermission) {
          b.setAttribute("checked", true);
        }
        b.setAttribute("onclick", "createMapPermission(" + i + ")");
      } else if (j == 7) {
        document.getElementById("input0" + i + j).value = obj.td06;
        // document.getElementById("td0" + i + j).innerHTML = "封鎖"
      }
      divTag = document.getElementById("tr" + i);
    }
  }
}


var levelNameStatus = 0,
  conditionStatus = 0,
  creatorStatus = 0,
  evaluateStatus = 0,
  dateStatus = 0,
  introductionStatus = 0;
var tdStatus = [0, 0, 0, 0, 0, 0];
//改變排序時會調用此函式
function changeTdName(thisObiect) {
  var str = thisObiect.className,
    s, s2;
  var thisStatus = parseInt(str.substr(str.length - 1, 1)) - 1;
  s = thisObiect.innerHTML;
  // console.log(s2.length);
  //第一次點會加上"&nbsp▴"
  if (tdStatus[thisStatus] == 0) {
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    thisObiect.innerHTML = s + "&nbsp▴";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 1) { //第二次點會加上"&nbsp▾"
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s + "&nbsp▾";
    tdStatus[thisStatus]++;
  } else if (tdStatus[thisStatus] == 2) { //第三次點會把後面文字清空
    // s = thisObiect.innerHTML;
    // console.log(s.length);
    s = s.substring(0, s.length - 7);
    // s = s.substring(0,s.length-1);
    thisObiect.innerHTML = s;
    tdStatus[thisStatus] = 0;
  }
  //調用改變表格內容的函式
  changeTdNameDisplay();
}

var TdNameTable = ["username", "name", "email", "starNum", "hightLevel", "userstatus"];
//左上方的下拉式選單狀態改變時會調用此函式，基本上也是豐銘在用
function changeTdNameDisplay() {
  var index = levelSelect.selectedIndex;
  if (index == 0) { //全部
    allUserData = completallUserData.slice(0);
  } else if (index == 1) { //封鎖
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      if (completallUserData[indexS].userstatus == 1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  } else { //未封鎖
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      if (completallUserData[indexS].userstatus == 0) {
        allUserData.push(completallUserData[indexS]);
      }
    }
  }

  for (let index = tdStatus.length - 1; index > -1; index--) {
    var item = TdNameTable[index];
    if (tdStatus[index] == 1) {
      allUserData = allUserData.sort(function(a, b) {
        return a[item] > b[item] ? 1 : -1;
      });
    } else if (tdStatus[index] == 2) {
      allUserData = allUserData.sort(function(a, b) {
        return a[item] < b[item] ? 1 : -1;
      });
    }
  }
  updateMapData(allUserData);
}

/*選單*/
var levelSelect = document.getElementById("levelSelect");
//剛下拉式選單改變，呼叫changeTdNameDisplay()
levelSelect.onchange = function(index) {
  changeTdNameDisplay();
}
var selectType = document.getElementById("selectType");
var searchType = 0;
var searchTypeTable = ["username", "name", "email", "hightLevel", "starNum", "userstatus"];
//當搜尋欄位被輸入時呼叫searchFunc()
selectType.onchange = function(index) {
  searchType = selectType.selectedIndex;
  searchFunc();
}
//搜尋函式，也是豐銘的
function searchFunc() {
  // var a = document.getElementById("searchTextBox");
  // if (a.value == "") {
  //   a.className = "search-text";
  //   changeTdNameDisplay();
  // } else {
  //   a.className = "searchFocus";
  // }
  // console.log("search:up");
  // console.log(searchTextBox.value);
  if (searchTextBox.value.length > 0) {
    allUserData.length = 0;
    for (let indexS = 0; indexS < completallUserData.length; indexS++) {
      // const element = completallUserData[indexS];
      var compareStr = completallUserData[indexS][searchTypeTable[searchType]].toString()
      if (compareStr.indexOf(searchTextBox.value) > -1) {
        allUserData.push(completallUserData[indexS]);
      }
    }
    for (let index = tdStatus.length - 1; index > -1; index--) {
      var item = TdNameTable[index];
      // console.log("item:",item);
      // console.log("tdStatus[index]:",item);
      if (tdStatus[index] == 1) {
        allUserData = allUserData.sort(function(a, b) {
          return a[item] > b[item] ? 1 : -1;
        });
      } else if (tdStatus[index] == 2) {
        allUserData = allUserData.sort(function(a, b) {
          return a[item] < b[item] ? 1 : -1;
        });
      }
    }
    updateMapData(allUserData)
  } else {
    changeTdNameDisplay();
  }
  // updateMapData(allUserData)

}


/*表單更動*/
function updateMapData(res) {
  var mapData = [];
  for (let index = 0; index < res.length; index++) {
    var obj = res[index]
    var hightLevel = Math.max(obj.EasyEmpire.codeHighestLevel, obj.MediumEmpire.HighestLevel) + 1; //0~49 49+1 -->1~50 51
    if (hightLevel == 51) {
      hightLevel = 50;
    }
    allUserData[index].hightLevel = hightLevel;
    var userstatusStr = "正常"
    if (obj.userstatus) {
      userstatusStr = "封鎖"
    } else {
      allUserData[index].userstatus = 0;
    }
    var script = {
      td01: obj.username,
      td02: obj.name,
      td03: obj.email,
      td04: obj.starNum,
      td05: allUserData[index].hightLevel,
      td06: userstatusStr
    }
    if (obj.canCreateMapPermission) {
      script.canCreateMapPermission = obj.canCreateMapPermission
    }
    mapData.push(script);
  }
  // console.log(mapData);
  updateLevelTable(mapData);
}
//表單更動時，需要重新創立表格
function updateLevelTable(scriptData) {
  // console.log(scriptData);

  for (var i = 0; i < scriptData.length; i++) {

    var obj = scriptData[i];
    if (i < oldDisMapNum) {
      document.getElementById("input0" + i + "1").value = obj.td01;
      document.getElementById("input0" + i + "2").value = obj.td02;
      document.getElementById("input0" + i + "3").value = obj.td03;
      document.getElementById("input0" + i + "4").value = obj.td04;
      document.getElementById("input0" + i + "5").value = obj.td05;
      if (obj.canCreateMapPermission) {
        $("#input0" + i + "6").prop("checked", true);
        // document.getElementById("input0" + i + "6").setAttribute("checked",true);
      } else {
        // document.getElementById("input0" + i + "6").setAttribute("checked",false);
        $("#input0" + i + "6").prop("checked", false);
      }
      document.getElementById("input0" + i + "7").value = obj.td06;

      if ((i % 2) == 0) {
        document.getElementById("lostUserCreateTable" + i).style.backgroundColor = "#F0E0CF";
      }
      // divTag.style.backgroundColor = "#F5F5F5";
      // divTag.style.backgroundColor = "rgb(153, 204, 255)";
    } else {
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

      b = document.createElement("tr");
      b.setAttribute("id", "tr" + i);
      divTag.appendChild(b);
      divTag = document.getElementById("tr" + i);
      for (var j = 1; j <= 7; j++) {
        b = document.createElement("td");
        b.setAttribute("id", "td0" + i + j);
        b.setAttribute("class", "td0" + j);
        divTag.appendChild(b);
        divTag = document.getElementById("td0" + i + j);
        b = document.createElement("input");
        b.setAttribute("type", "text");
        b.setAttribute("id", "input0" + i + j);
        b.setAttribute("readonly", "readonly");
        divTag.appendChild(b);

        /**

         */
        if (j == 6) {
          b = document.getElementById("input0" + i + "6");
          b.setAttribute("type", "checkbox");
          b.setAttribute("class", "mapCheckbox");
          b.setAttribute("onclick", "createMapPermission(" + i + ")");
          if (obj.canCreateMapPermission) {
            // b.setAttribute("checked",true);
            $("#input0" + i + "6").prop("checked", true);
          }
        } else if (j == 7) { /*使用者狀態*/
          document.getElementById("input0" + i + j).value = obj.td06;
          // document.getElementById("td0" + i + j).innerHTML = "封鎖"
        } else if (j == 1) { /*使用者帳號*/
          document.getElementById("input0" + i + j).value = obj.td01;
          // document.getElementById("td0" + i + j).innerHTML = "aa";
        } else if (j == 2) { /*使用者名稱*/
          document.getElementById("input0" + i + j).value = obj.td02;
          // document.getElementById("td0" + i + j).innerHTML = "aa";
        } else if (j == 3) { /*使用者信箱*/
          document.getElementById("input0" + i + j).value = obj.td03;
          // document.getElementById("td0" + i + j).innerHTML = "karta1335618@gmail.com";
        } else if (j == 4) { /*星星數*/
          document.getElementById("input0" + i + j).value = obj.td04;
          // document.getElementById("td0" + i + j).innerHTML = "50";
        } else if (j == 5) { /*最高的關卡*/
          document.getElementById("input0" + i + j).value = obj.td05;
          // document.getElementById("td0" + i + j).innerHTML = "13";
        }
        divTag = document.getElementById("tr" + i);
      }
      if ((i % 2) == 0) {
        document.getElementById("lostUserCreateTable" + i).style.backgroundColor = "#F0E0CF";
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
//只要搜尋列有輸入就調用一次searchFunc()
searchTextBox.onkeyup = function() {
  searchFunc();
}
//當X按鈕被按下，調用changeTdNameDisplay()
searchTextBox.onchange = function() {
  if (searchTextBox.value == "" || searchTextBox.value.length == 0) {
    changeTdNameDisplay();
  }
}
