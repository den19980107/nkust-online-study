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

var href = window.location.href;
var user, directiveData, levelDivAlive = true;
var swordLevel = 0,
  shieldLevel = 0,
  levelUpLevel = 0,
  musicLevel = 1,
  bkMusicSwitch, bkMusicVolumn = 0.1,
  args, gameSpeed;
var musicData;

createLoadingMainView("center");
loadDict();
var scriptData = {
  type: "init"
}

function back() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
    if (href[i] == '/' || href[i] == "\\") {
      index = i;
    }
  }
  href = href.substr(0, index + 1);
  href += "pruss";
  window.location.replace(href);
}
let params = new URL(window.location.href).searchParams;
if (!params.has('level')) {
  href = "";
  window.location.replace(href);
}
var maplevelId = params.get('level');
$.ajax({
  url: "loadThisLevelGameMapData", // 要傳送的頁面
  method: 'POST', // 使用 POST 方法傳送請求
  dataType: 'json', // 回傳資料會是 json 格式
  async: false,
  data: {
    level: maplevelId,
    gameMode: "blocky" //blocky
  }, //
  success: function(res) {
    // console.log(res);

    thisLevelNum = maplevelId;
    mainDescription = {
      oblivionObject: res
    };
    helper("blocklyDiv");
  }
})

$.ajax({
  url: href, // 要傳送的頁面
  method: 'POST', // 使用 POST 方法傳送請求
  dataType: 'json', // 回傳資料會是 json 格式
  data: scriptData, // 將表單資料用打包起來送出去
  async: false,
  success: function(res) {
    // console.log(res);
    user = res;

    let nowurl = new URL(window.location.href);
    let params = nowurl.searchParams;
    if (!params.has('level')) {
      href = "";
      window.location.replace(href);
    }
    var maplevelId = params.get('level');
    // console.log(maplevelId);
    // console.log(user.EasyEmpire.codeLevel.length);
    if (maplevelId < 24) {
      if (user.EasyEmpire.codeLevel.length < maplevelId) {
        // console.log("Bye 實力不夠");
        alert("不能越級過關喔");
        href = "pruss";
        window.location.replace(href);
      }
    } else {
      alert("不能越級過關喔");
      href = "pruss";
      window.location.replace(href);
    }

    /*loadmusicData();*/
    // console.log(user);
    var scriptData = {
      type: "loadEquip"
    }
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
      async: false,
      success: function(res) {
        // console.log(res);
        equipmentData = res;
        initHome();
      }
    })
  }
})
closeMainLoadingView();

function error() {
  alert("有不當的操作發生");
  window.location.replace(href);
}

function initHome() {
  //如果每個session都有值得話就將值存到變數內
  if (Session.get("bkMusicVolumn") != null && Session.get("bkMusicSwitch") != null && Session.get("musicLevel") != null && Session.get("gameSpeed") != null) {
    bkMusicVolumn = Session.get("bkMusicVolumn");
    bkMusicSwitch = Session.get("bkMusicSwitch");
    musicLevel = Session.get("musicLevel");
    gameSpeed = Session.get("gameSpeed");
  } else { //若沒有就設為預設值
    bkMusicVolumn = 0.1;
    bkMusicSwitch = 2;
    musicLevel = 1;
    gameSpeed = 5;
  }
  //設定音樂的音量
  myVid = document.getElementById("bkMusic");
  myVid.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
  //設定完之後才撥放音樂
  myVid.play();
  bkMusicSwitch++;
  //調用sendSession()將值存到session內
  sendSession();
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  var text = user.name;
  //顯示使用者名稱與星星數
  userName.textContent = text;
  starNumber.textContent = user.starNum;

  levelUpLevel = user.levelUpLevel;
  swordLevel = user.weaponLevel;
  shieldLevel = user.armorLevel;
  if (user.username == "NKUSTCCEA") {
    // console.log(document.getElementById("gameModifyBtn"));
    document.getElementById("gameModifyBtn").style.display = "";
  }
  getArgs();
}

//---------紀錄關卡資訊---------//
function recordLevel(scriptData) {
  var NowDate = new Date();
  scriptData.submitTime = NowDate
  $.ajax({
    url: href, // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    data: scriptData, // 將表單資料用打包起來送出去
    success: function(res) {
      user = res
      // console.log(user);
    }
  })
}
//登出
function logout() {
  var href = "/logout";
  window.location.replace(href);
}

//////////////////////////////////////////////////
//              right.js                        //
//////////////////////////////////////////////////

var myVid;
var divID, divID2, divTag, b;
var userdataFont, thisLevelNum;
var dataTitle = ["帳&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp號：",
  "使用者名稱：",
  "主&nbsp要&nbsp進&nbsp度：",
  "成&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp就：",
  "上架地圖數：",
  "已獲得星星數："
];
//創造使用者資訊外框函式
function userData() {
  //先試著刪除背後黑布以及顯示視窗，發生錯誤就跳過
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
  //調用創造使用者資訊內容函式
  createUserView(divID);
}
//創造使用者資訊內容函式
function createUserView(mainDiv) {
  divTag = document.getElementById(mainDiv);
  //創造個人資料的title
  b = document.createElement("h1");
  b.setAttribute("id", "userTitle");
  b.innerHTML = "個人資料";
  divTag.appendChild(b);
  //創造內部div，白色那塊
  b = document.createElement("div");
  b.setAttribute("id", "userInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("userInnerDiv");
  //在白色那塊內再創一個，方便資料編排
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

/*讀取網址資訊*/
function getArgs() {
  args = new Object();
  var query = location.search.substring(1);
  var pairs = query.split("&");
  //用來判斷網址的，不太需要更改
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    args[argname] = decodeURIComponent(value);
  }
  //http://127.0.0.1:3000/gameView_blockly?level=0 -> Level就是標籤 標籤內有東西才執行下面的事情
  var level = args.level
  if (level) {
    selectFunc(level);
    divTag = document.getElementById("titleFont");
    divTag.innerHTML = "";
    if (level > 10) {
      document.getElementById("gameModifyBtn").style.transform = "translateX(6.5vw)";
    }
    if (level > 19) {
      document.getElementById("gameModifyBtn").style.transform = "translateX(7.5vw)";
    }
    //標籤文字字串
    var numStr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
      "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八",
      "十九", "二十", "二十一", "二十二", "二十三", "二十四"
    ];
    divTag.innerHTML = "第&nbsp" + numStr[++level] + "&nbsp關";
    //changeCollege(--args.level);
    thisLevelNum = level - 1;
  }
  return;
}

/*小幫手*/
function helper(mainDiv) {
  //判斷要顯示資料的模式
  var selectMod = mainDescription.oblivionObject[maplevelId].mode;
  divID = "equipageView";
  divTag = document.getElementById("helperView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById(mainDiv);
  //創造小幫手div
  b = document.createElement("div");
  b.setAttribute("id", "helperView");
  divTag.appendChild(b);
  divTag = document.getElementById("helperView");
  divTag.innerHTML = "";
  //創造X按鈕
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"helperView\")");
  divTag.appendChild(b);
  //創造關卡說明的title
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "關卡說明";
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");
  switch (selectMod) {
    case 1:
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea3");
      divTag.appendChild(b);
      document.getElementById("helperTextarea3").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea1;
      break;
    case 2:
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

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv2");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv2");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg2");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea2");
      divTag.appendChild(b);
      /*設定文字塊二*/
      document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;
      break;
    case 3:
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

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv2");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv2");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg2");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea2");
      divTag.appendChild(b);
      /*設定文字塊二*/
      document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;

      /*圖片四*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv4");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv4");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg4");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea4");
      divTag.appendChild(b);
      /*設定文字塊四*/
      document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;

      /*圖片五*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv5");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv5");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg5");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea5");
      divTag.appendChild(b);
      /*設定文字塊五*/
      document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;

      /*圖片六*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv6");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv6");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg6");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea6");
      divTag.appendChild(b);
      /*設定文字塊六*/
      document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;

      /*圖片七*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv7");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv7");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg7");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea7");
      divTag.appendChild(b);
      /*設定文字塊七*/
      document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea8");
      divTag.appendChild(b);
      /*設定文字塊八*/
      document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;
      break;
    case 4:
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

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv2");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv2");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg2");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img2);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea2");
      divTag.appendChild(b);
      /*設定文字塊二*/
      document.getElementById("helperTextarea2").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea2;

      /*圖片四*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv4");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv4");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg4");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img4);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea4");
      divTag.appendChild(b);
      /*設定文字塊四*/
      document.getElementById("helperTextarea4").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea4;

      /*圖片五*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv5");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv5");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg5");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img5);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea5");
      divTag.appendChild(b);
      /*設定文字塊五*/
      document.getElementById("helperTextarea5").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea5;

      /*圖片六*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv6");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv6");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg6");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img6);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea6");
      divTag.appendChild(b);
      /*設定文字塊六*/
      document.getElementById("helperTextarea6").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea6;

      /*圖片七*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv7");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv7");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg7");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img7);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea7");
      divTag.appendChild(b);
      /*設定文字塊七*/
      document.getElementById("helperTextarea7").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea7;

      /*圖片八*/
      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperImgDiv8");
      divTag.appendChild(b);
      divTag = document.getElementById("helperImgDiv8");
      b = document.createElement("img");
      b.setAttribute("id", "helperImg8");
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/" + mainDescription.oblivionObject[thisLevelNum].img8);
      divTag.appendChild(b);

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea8");
      divTag.appendChild(b);
      /*設定文字塊八*/
      document.getElementById("helperTextarea8").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea8;

      divTag = document.getElementById("helperInnerDiv");
      b = document.createElement("div");
      b.setAttribute("id", "helperTextarea9");
      divTag.appendChild(b);
      /*設定文字塊九*/
      document.getElementById("helperTextarea9").innerHTML = mainDescription.oblivionObject[thisLevelNum].textarea9;
      break;
    case 5:
      helperJson = mainDescription.oblivionObject[thisLevelNum].selfSettintPatten;
      if (helperJson) {
        for (var i = 0; i < helperJson.length; i++) {
          divTag = document.getElementById("helperInnerDiv");
          var helperId = helperJson[i].id;
          lastHeight = helperJson[i].lastHeight;
          var isImgLeft = false;
          if (helperJson[i].isImgLeft != "" && helperJson[i].isImgLeft == true) {
            isImgLeft = true;
          }
          switch (helperJson[i].mode) {
            case "img":
              b = document.createElement("div");
              b.setAttribute("id", "imgDiv" + helperId);
              b.setAttribute("class", "bigImgDiv");
              b.setAttribute("style", "top:" + lastHeight + "%;");
              divTag.appendChild(b);

              divTag = document.getElementById("imgDiv" + helperId);
              b = document.createElement("img");
              b.setAttribute("id", "bigImg" + helperId);
              var strText = helperJson[i].imgUrl1;
              b.setAttribute("src", "img/" + strText);
              divTag.appendChild(b);
              break;
            case "text":
              b = document.createElement("div");
              b.setAttribute("id", "textareaDiv" + helperId);
              b.setAttribute("class", "bigTextareaDiv");
              b.setAttribute("style", "top:" + lastHeight + "%;");
              divTag.appendChild(b);

              divTag = document.getElementById("textareaDiv" + helperId);
              b = document.createElement("textarea");
              b.setAttribute("id", "bigHelperTextarea" + helperId);
              b.setAttribute("class", "bigHelperTextarea");
              b.setAttribute("readonly", "readonly");
              b.innerHTML = helperJson[i].textareaValue;
              divTag.appendChild(b);
              break;
            case "imgAndText":
              b = document.createElement("div");
              b.setAttribute("id", "imgAndTextDiv" + helperId);
              b.setAttribute("class", "imgAndTextDiv");
              b.setAttribute("style", "top:" + lastHeight + "%;");
              divTag.appendChild(b);

              divTag = document.getElementById("imgAndTextDiv" + helperId);

              b = document.createElement("textarea");
              b.setAttribute("id", "imgAndTextTextarea" + helperId);
              b.setAttribute("class", "imgAndTextTextarea");
              b.setAttribute("readonly", "readonly");
              if (isImgLeft) {
                b.setAttribute("style", "right:6%;");
              } else {
                b.setAttribute("style", "left:6%;");
              }
              b.innerHTML = helperJson[i].textareaValue;
              divTag.appendChild(b);

              b = document.createElement("div");
              b.setAttribute("id", "imgDivInner" + helperId);
              if (isImgLeft) {
                b.setAttribute("style", "width:40%;height:100%;position: absolute;left:5%;");
              } else {
                b.setAttribute("style", "width:40%;height:100%;position: absolute;right:5%;");
              }
              divTag.appendChild(b);

              divTag = document.getElementById("imgDivInner" + helperId);
              b = document.createElement("img");
              b.setAttribute("id", "imgAndTextImg" + helperId);
              b.setAttribute("class", "helperImg");
              var strText = helperJson[i].imgUrl1;
              b.setAttribute("src", "img/" + strText);
              divTag.appendChild(b);
              break;
            case "twoImgAndText":
              b = document.createElement("div");
              b.setAttribute("id", "twoImgAndTextDiv" + helperId);
              b.setAttribute("class", "twoImgAndTextDiv");
              b.setAttribute("style", "top:" + lastHeight + "%;");
              divTag.appendChild(b);

              divTag = document.getElementById("twoImgAndTextDiv" + helperId);

              b = document.createElement("textarea");
              b.setAttribute("id", "twoImgAndTextTextarea" + helperId);
              b.setAttribute("class", "twoImgAndTextTextarea");
              b.setAttribute("readonly", "readonly");
              if (isImgLeft) {
                b.setAttribute("style", "right:6%;");
              } else {
                b.setAttribute("style", "left:6%;");
              }
              b.innerHTML = helperJson[i].textareaValue;
              divTag.appendChild(b);

              b = document.createElement("div");
              b.setAttribute("id", "twoImgAndTextInnerDiv" + helperId);
              b.setAttribute("class", "twoImgAndTextInneDiv");
              if (isImgLeft) {
                b.setAttribute("style", "left:5%;");
              } else {
                b.setAttribute("style", "right:5%;");
              }
              divTag.appendChild(b);

              divTag = document.getElementById("twoImgAndTextInnerDiv" + helperId);
              b = document.createElement("img");
              b.setAttribute("id", "twoImgAndTextTopImg" + helperId);
              var strText = helperJson[i].imgUrl1;
              b.setAttribute("src", "img/" + strText);
              divTag.appendChild(b);

              divTag = document.getElementById("twoImgAndTextInnerDiv" + helperId);
              b = document.createElement("img");
              b.setAttribute("id", "twoImgAndTextBottomImg" + helperId);
              var strText = helperJson[i].imgUrl2;
              b.setAttribute("src", "img/" + strText);
              divTag.appendChild(b);
              break;
            case "smallImgAndText":
              b = document.createElement("div");
              b.setAttribute("id", "smallImgAndTextDiv" + helperId);
              b.setAttribute("class", "smallImgAndTextDiv");
              b.setAttribute("style", "top:" + lastHeight + "%;");
              divTag.appendChild(b);

              divTag = document.getElementById("smallImgAndTextDiv" + helperId);
              b = document.createElement("textarea");
              b.setAttribute("id", "smallImgAndTextTextarea" + helperId);
              b.setAttribute("class", "smallImgAndTextTextarea");
              b.setAttribute("readonly", "readonly");
              if (isImgLeft) {
                b.setAttribute("style", "right:6%;");
              } else {
                b.setAttribute("style", "left:6%;");
              }
              b.innerHTML = helperJson[i].textareaValue;
              divTag.appendChild(b);

              b = document.createElement("div");
              b.setAttribute("id", "smallImgAndTextInnerDiv" + helperId);
              b.setAttribute("class", "smallImgAndTextInneDiv");
              if (isImgLeft) {
                b.setAttribute("style", "left:5%;");
              } else {
                b.setAttribute("style", "right:5%;");
              }
              divTag.appendChild(b);

              divTag = document.getElementById("smallImgAndTextInnerDiv" + helperId);
              b = document.createElement("img");
              b.setAttribute("id", "smallImgAndTextImg" + helperId);
              var strText = helperJson[i].imgUrl1;
              b.setAttribute("src", "img/" + strText);
              divTag.appendChild(b);
              break;
          }
        }
      }
      break;
  }
}

/*XX按鈕*/
function clossFunc(thisDiv, thisDiv2) {
  var divTag = document.getElementById(thisDiv);
  //刪除thisDiv
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById(thisDiv2);
  //刪除thisDiv2
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  levelDivAlive = false;
}

/*清除畫布動作*/
function clearButton(thisTextarea) {
  challengeGameAgain();
}
/*重新開始*/
function restartButton(thisTextarea) {
  challengeGameAgain();
  myFunction();
}
/*重新開始*/
function restartGame(thisDiv, thisDiv2) {
  clossFunc(thisDiv, thisDiv2);
}
/*轉換程式碼*/
function transformButton() {
  changeToC(1);
}
/*設定*/
function settingAllView(mainDiv) {
  divTag = document.getElementById(mainDiv.id);
  //創造背景黑布div
  b = document.createElement("div");
  b.setAttribute("id", "equipageBkView");
  b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"equipageBkView\")");
  divTag.appendChild(b);
  //創造設定視窗div
  b = document.createElement("div");
  b.setAttribute("id", "settingAllView");
  divTag.appendChild(b);
  divTag = document.getElementById("settingAllView");
  //創造X按鈕
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "clossDiv");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "clossFunc(\"settingAllView\",\"equipageBkView\")");
  divTag.appendChild(b);
  //創造設定title
  b = document.createElement("h1");
  b.setAttribute("id", "settingTitle");
  divTag.appendChild(b);
  document.getElementById("settingTitle").innerHTML = "設定";
  //創造設定表格
  b = document.createElement("table");
  b.setAttribute("id", "settingAllTable");
  divTag.appendChild(b);

  /*設定音樂開或關*/
  divTag = document.getElementById("settingAllTable");
  //創造第一行tr
  b = document.createElement("tr");
  b.setAttribute("id", "tr0");
  divTag.appendChild(b);
  divTag = document.getElementById("tr0");
  //第一行第一列td即遊戲音樂
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
  //音樂開關的表單，用form是為了搭配群組做單選動作
  b = document.createElement("form");
  b.setAttribute("id", "musicForm");
  b.setAttribute("name", "form1");
  divTag.appendChild(b);
  divTag = document.getElementById("musicForm");
  //創造"開"的checkbox
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "musicOpen");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "return chk(this);");
  //如果session中存的是2，代表為開，所以要將checkbox打勾
  if (bkMusicSwitch == 2) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  //因為checkedbox不能顯示文字，所以要另外創造font來顯示"開"
  b = document.createElement("font");
  b.setAttribute("id", "openText");
  divTag.appendChild(b);
  document.getElementById("openText").innerHTML = "開";
  //創造"關"的checkbox
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "musicClose");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "return chk(this);");
  //如果session中存的是1，代表為關，所以要將checkbox打勾
  if (bkMusicSwitch == 1) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  //創造"關"的文字
  b = document.createElement("font");
  b.setAttribute("id", "closeText");
  divTag.appendChild(b);
  document.getElementById("closeText").innerHTML = "關";
  /*設定音量大小*/
  divTag = document.getElementById("settingAllTable");
  //創造音量大小的tr
  b = document.createElement("tr");
  b.setAttribute("id", "tr1");
  divTag.appendChild(b);
  divTag = document.getElementById("tr1");
  //創造放"音樂大小"文字的td
  b = document.createElement("td");
  b.setAttribute("id", "row1_0");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_0");
  //創造音樂大小的h2
  b = document.createElement("h2");
  b.setAttribute("id", "musicVolume");
  divTag.appendChild(b);
  document.getElementById("musicVolume").innerHTML = "音樂大小";
  divTag = document.getElementById("tr1");
  //創造存放"-"的td
  b = document.createElement("td");
  b.setAttribute("id", "row1_1");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_1");
  //創造"-"的按鈕
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelDown()');
  b.setAttribute('value', '-');
  divTag.appendChild(b);

  divTag = document.getElementById("tr1");
  //創造存放中間顯示音量長條的td
  b = document.createElement("td");
  b.setAttribute("id", "row1_2");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_2");
  //在td內放入一個div
  b = document.createElement("div");
  b.setAttribute('id', 'musicVolumeDiv');
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeDiv");
  //再放入table
  b = document.createElement("table");
  b.setAttribute("id", "musicVolumeTable");
  b.setAttribute("rules", "rows");
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeTable");
  //創造一列tr
  b = document.createElement("tr");
  b.setAttribute("id", "musicVolumeTr");
  divTag.appendChild(b);
  divTag = document.getElementById("musicVolumeTr");
  //總共有10格音量，所以要創造10個td，td內放入div配合不同的css來達到不同高度的長條
  for (var i = 0; i < 10; i++) {
    b = document.createElement("td");
    b.setAttribute("id", "musicVolumeTd" + i);
    divTag.appendChild(b);
    divTag = document.getElementById("musicVolumeTd" + i);
    b = document.createElement("div");
    //預設音量為一格，所以當i==0的時候，用到的class會不同
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
  //創造存放"+"的td
  b = document.createElement("td");
  b.setAttribute("id", "row1_3");
  divTag.appendChild(b);
  divTag = document.getElementById("row1_3");
  //創造"+"的按鈕
  b = document.createElement("input");
  b.setAttribute('type', 'button');
  b.setAttribute('id', 'volumeButtonSub');
  b.setAttribute('onclick', 'musicLevelUp()');
  b.setAttribute('value', '+');
  divTag.appendChild(b);

  /*調整遊戲速度*/
  divTag = document.getElementById("settingAllTable");
  //創造遊戲速度的tr
  b = document.createElement("tr");
  b.setAttribute("id", "tr2");
  divTag.appendChild(b);
  divTag = document.getElementById("tr2");
  //創造存放"遊戲速度"的td
  b = document.createElement("td");
  b.setAttribute("id", "row2_0");
  divTag.appendChild(b);
  divTag = document.getElementById("row2_0");
  //創造"遊戲速度"的h2
  b = document.createElement("h2");
  b.setAttribute("id", "settingSpeed");
  divTag.appendChild(b);
  document.getElementById("settingSpeed").innerHTML = "遊戲速度";
  divTag = document.getElementById("tr2");
  //創造存放3組checked的td
  b = document.createElement("td");
  b.setAttribute("id", "row2_1");
  b.setAttribute("colspan", "2");
  divTag.appendChild(b);
  divTag = document.getElementById("row2_1");
  //創造遊戲速度checkbox的form
  b = document.createElement("form");
  b.setAttribute("id", "speedForm");
  b.setAttribute("name", "form2");
  divTag.appendChild(b);
  divTag = document.getElementById("speedForm");
  //創造"慢"的checkbox
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedLow");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "1");
  b.setAttribute("onclick", "return chk2(this);");
  //如果session內為3則將此打勾，3.5.7分別代表慢中快，跟著豐銘的設定走，如有變更數值，這裡記得改
  if (gameSpeed == 3) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  //創造慢的文字
  b = document.createElement("font");
  b.setAttribute("id", "speedLowText");
  divTag.appendChild(b);
  document.getElementById("speedLowText").innerHTML = "慢";
  //創造"中"的checkbox
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedMid");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "2");
  b.setAttribute("onclick", "return chk2(this);");
  //如果session內為5則將此打勾
  if (gameSpeed == 5) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  //創造中的文字
  b = document.createElement("font");
  b.setAttribute("id", "speedMidText");
  divTag.appendChild(b);
  document.getElementById("speedMidText").innerHTML = "中";
  //創造"快"的checkbox
  b = document.createElement("input");
  b.setAttribute("type", "radio");
  b.setAttribute("id", "speedQuick");
  b.setAttribute("name", "c1");
  b.setAttribute("value", "3");
  b.setAttribute("onclick", "return chk2(this);");
  //如果session內為7則將此打勾
  if (gameSpeed == 7) {
    b.setAttribute("checked", "true");
  }
  divTag.appendChild(b);
  //創造快的文字
  b = document.createElement("font");
  b.setAttribute("id", "speedQuickText");
  divTag.appendChild(b);
  document.getElementById("speedQuickText").innerHTML = "快";
  //這邊是用來改變音樂大小中間長條的class用的，因為每次開啟必須顯示上次的設定
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
  // console.log("bkMusicSwitch:" + bkMusicSwitch);
  // console.log("musicLevel:" + musicLevel);
  // console.log("bkMusicVolumn:" + bkMusicVolumn);
  //// console.log("gameSpeed:" + gameSpeed);
  Session.set("bkMusicVolumn", bkMusicVolumn);
  Session.set("bkMusicSwitch", bkMusicSwitch);
  Session.set("musicLevel", musicLevel);
  Session.set("gameSpeed", gameSpeed);
  return;
}

/*選擇可用函式*/
function selectFunc(levelNumber) {
  /*divTag = document.getElementById("bodyId");
  b = document.createElement("script");
  divTag.appendChild(b);*/
  var classSize = directiveData.instruction[levelNumber].class.length,
    usableSize;
  var className, usableValue;
  divTag = document.getElementById("toolbox");
  for (var i = 0; i < classSize; i++) {
    className = directiveData.instruction[levelNumber].class[i].name;
    usableSize = directiveData.instruction[levelNumber].class[i].usable.length;

    if (className != "函式") {
      b = document.createElement("category");
      b.setAttribute("id", className);
      b.setAttribute("name", className);
      divTag.appendChild(b);
      for (var j = 0; j < usableSize; j++) {
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        blocklyUsable(className, usableValue)
      }
    } else {
      for (var j = 0; j < usableSize; j++) {
        usableValue = directiveData.instruction[levelNumber].class[i].usable[j].value;
        blocklyUsable(className, usableValue)
      }
    }
    divTag = document.getElementById("toolbox");
  }
  divTag = document.getElementById("bodyId");
  b = document.createElement("script");
  b.setAttribute("src", "gameNew/gameNew/js/code_C.js");
  divTag.appendChild(b);
}

function blocklyUsable(thisClassID, thisValue) {
  var blockType;
  switch (thisValue) {
    case "moveForward":
      blockType = "block_moveForward";
      break;
    case "turnRight":
      blockType = "block_turn_right";
      break;
    case "turnLeft":
      blockType = "block_turn_left";
      break;
    case "fire":
      blockType = "block_fire";
      break;
    case "printf":
      blockType = "block_printf";
      break;
    case "printf2":
      blockType = "block_printf2";
      break;
    case "scanf":
      blockType = "block_scanf";
      break;
    case "var":
      blockType = "block_var";
      break;
    case "for":
      blockType = "block_loop";
      break;
    case "function":
      blockType = "block_function";
      break;
    case "call":
      blockType = "block_call";
      break;
    case "if":
      blockType = "block_if";
      break;
    case "if_else":
      blockType = "block_if_else";
      break;
    case "switch":
      blockType = "block_switch";
      break;
    case "case":
      blockType = "block_case";
      break;
    case "default":
      blockType = "block_default";
      break;
    case "break":
      blockType = "block_break";
      break;
  }
  divTag = document.getElementById(thisClassID);
  b = document.createElement("block");
  b.setAttribute("type", blockType);
  divTag.appendChild(b);
  if (blockType == "block_switch") {
    blocklyUsable(thisClassID, "case");
  } else if (blockType == "block_case") {
    blocklyUsable(thisClassID, "default");
  } else if (blockType == "block_default") {
    blocklyUsable(thisClassID, "break");
  }
  if (blockType == "block_loop") {
    blocklyUsable(thisClassID, "var");
  }
  if (blockType == "block_printf") {
    blocklyUsable(thisClassID, "printf2");
  }
}

/*遊戲結果*/
function createEndView(starNum, gameResult, instructionNum, code, errMessage) {
  // 儲存關卡//
  var scriptData = {
    type: "blockLevelResult", //"codeLevelResult" or "blockLevelResult"限"EasyEmpire"
    Empire: "EasyEmpire", //"EasyEmpire" or "MediumEmpire"
    level: thisLevelNum, // 0~24 or 25
    StarNum: starNum, // 0 or 1 or 2 or 3
    result: gameResult,
    code: code,
    instructionNum: instructionNum
  }
  recordLevel(scriptData);
  // console.log(starNum);
  try {
    divTag = document.getElementById("createEndView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("createEndBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  divTag = document.getElementById("center");
  b = document.createElement("div");
  b.setAttribute("id", "createEndBkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "createEndView");
  b.setAttribute("class", "successView");
  divTag.appendChild(b);
  divTag = document.getElementById("createEndView");
  b = document.createElement("h1");
  b.setAttribute("id", "endViewTitle");
  divTag.appendChild(b);
  if (starNum != 0) {
    document.getElementById("endViewTitle").innerHTML = "通關成功";
  } else {
    document.getElementById("endViewTitle").innerHTML = "通關失敗";
  }
  b = document.createElement("div");
  b.setAttribute("id", "startDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("startDiv");
  for (var i = 0; i < 3; i++) {
    b = document.createElement("img");
    b.setAttribute("id", "starImg" + i);
    b.setAttribute("class", "unStarImg");
    divTag.appendChild(b);
  }
  if (starNum != 0) {
    for (var i = 0; i < starNum; i++) {
      document.getElementById("starImg" + i).className = "starImg";
    }
  }
  b = document.createElement("br");
  divTag.appendChild(b);
  b = document.createElement("h2");
  b.setAttribute("id", "instructionH2");
  divTag.appendChild(b);
  document.getElementById("instructionH2").innerHTML = "指令：" + "&nbsp&nbsp&nbsp&nbsp" + instructionNum + "&nbsp&nbsp&nbsp&nbsp個";
  b = document.createElement("h3");
  b.setAttribute("id", "instructionH3");
  divTag.appendChild(b);
  var highestStarNum;
  try {
    highestStarNum = user.EasyEmpire.blockLevel[thisLevelNum].HighestStarNum;
  } catch (e) {
    highestStarNum = 0;
  }
  if (starNum != 0) {
    if (highestStarNum < starNum) {
      document.getElementById("instructionH3").innerHTML = "(達成新紀錄!)";
    } else {
      document.getElementById("instructionH3").innerHTML = "";
    }
  } else {
    document.getElementById("instructionH3").innerHTML = "(" + gameResult + "!)";
  }
  if (starNum != 0) {
    b = document.createElement("button");
    b.setAttribute("id", "restartGameBtn");
    b.setAttribute("value", "重新挑戰");
    b.setAttribute("onclick", "restartGame(\"createEndView\",\"createEndBkView\")");
    divTag.appendChild(b);
    divTag = document.getElementById("restartGameBtn");
    b = document.createElement("img");
    b.setAttribute("id", "restartImg");
    b.setAttribute("src", "img/RestartButton2.png");
    divTag.appendChild(b);
    b = document.createElement("font");
    b.setAttribute("id", "restartFontImg");
    divTag.appendChild(b);
    document.getElementById("restartFontImg").innerHTML = "重新開始";
    divTag = document.getElementById("startDiv");
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "backToMapBtn");
    b.setAttribute("value", "返回地圖");
    b.setAttribute("onclick", "location.href='pruss'");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "nextLevelBtn");
    b.setAttribute("value", "下一關");
    // console.log(thisLevelNum);
    if (thisLevelNum + 1 == 24) {
      b.setAttribute("onclick", "location.href='gameView_text?level=" + (thisLevelNum + 1) + "'");
    } else {
      b.setAttribute("onclick", "location.href='gameView_blockly?level=" + (thisLevelNum + 1) + "'");
    }
    divTag.appendChild(b);
  } else {
    if (gameResult == "編譯失敗") {
      document.getElementById("createEndView").className = "errView";
      b = document.createElement("textarea");
      b.setAttribute("id", "errTextarea");
      b.innerHTML = errMessage;
      divTag.appendChild(b);
    }

    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "successRestartGameBtn");
    b.setAttribute("value", "重新挑戰");
    b.setAttribute("onclick", "clossFunc(\"createEndView\",\"createEndBkView\")");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "successBackToMapBtn");
    b.setAttribute("value", "返回地圖");
    b.setAttribute("onclick", "location.href='pruss'");
    divTag.appendChild(b);
  }
}

/*loading*/
function createLoadingView() {
  divTag = document.getElementById("blocklyDiv");
  b = document.createElement("div");
  b.setAttribute("id", "loadingBkView");
  b.setAttribute("onclick", "clossFunc(\"loadingBkView\",\"loadingView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "loadingView");
  b.setAttribute("class", "loadEffect");
  divTag.appendChild(b);
  divTag = document.getElementById("loadingView");
  for (var i = 0; i < 8; i++) {
    b = document.createElement("span");
    divTag.appendChild(b);
  }
}

function closeLoadingView() {
  var divTag = document.getElementById("loadingView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  var divTag = document.getElementById("loadingBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
}
window.onresize = function() {
  setup();
}

/*localStrage*/
function turnToModify() {
  let gameName = document.getElementById("titleFont").innerHTML;
  localStorage.setItem("gameName", gameName);
  localStorage.setItem("gameNumber", args.level);
  document.location.href = "managementModifyMap";
}

/*可用指令*/
function loadDict() {
  directiveData = {
    "instruction": [{
        "level": 1,
        "class": [{
          "name": "動作",
          "usable": [{
            "value": "moveForward"
          }]
        }]
      },
      {
        "level": 2,
        "class": [{
          "name": "動作",
          "usable": [{
              "value": "moveForward"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }]
      },
      {
        "level": 3,
        "class": [{
          "name": "動作",
          "usable": [{
              "value": "moveForward"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }]
      },
      {
        "level": 4,
        "class": [{
          "name": "動作",
          "usable": [{
              "value": "moveForward"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            }
          ]
        }]
      },
      {
        "level": 5,
        "class": [{
          "name": "動作",
          "usable": [{
              "value": "moveForward"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            }
          ]
        }]
      },
      {
        "level": 6,
        "class": [{
          "name": "動作",
          "usable": [{
              "value": "moveForward"
            },
            {
              "value": "turnRight"
            },
            {
              "value": "turnLeft"
            },
            {
              "value": "printf"
            },
            {
              "value": "scanf"
            },
            {
              "value": "var"
            }
          ]
        }]
      },
      {
        "level": 7,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
              "value": "if"
            }]
          }
        ]
      },
      {
        "level": 8,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              }
            ]
          }
        ]
      },
      {
        "level": 9,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
              "value": "switch"
            }]
          }
        ]
      },
      {
        "level": 10,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 11,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 12,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 13,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 14,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 15,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 16,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
              "value": "for"
            }]
          }
        ]
      },
      {
        "level": 17,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 18,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 19,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 20,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 21,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 22,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 23,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      },
      {
        "level": 24,
        "class": [{
            "name": "動作",
            "usable": [{
                "value": "moveForward"
              },
              {
                "value": "turnRight"
              },
              {
                "value": "turnLeft"
              },
              {
                "value": "fire"
              },
              {
                "value": "printf"
              },
              {
                "value": "scanf"
              }
            ]
          },
          {
            "name": "判斷式",
            "usable": [{
                "value": "if"
              },
              {
                "value": "if_else"
              },
              {
                "value": "switch"
              }
            ]
          },
          {
            "name": "函式",
            "usable": [{
                "value": "for"
              },
              {
                "value": "function"
              },
              {
                "value": "call"
              }
            ]
          }
        ]
      }
    ]
  };
}
