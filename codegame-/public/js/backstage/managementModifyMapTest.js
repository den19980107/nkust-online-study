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
var levelNum = localStorage.getItem("gameNumber") - 1;
function back() {
  // var index = 0;
  // var href = window.location.href;
  // for (var i = 0; i < href.length; ++i) {
  //   if (href[i] == '/' || href[i] == "\\") {
  //     index = i;
  //   }
  // }
  // href = href.substr(0, index + 1);
  href = "gameView_text?level=" + (localStorage.getItem("gameNumber")).toString();
  window.location.replace(href);
  // console.log(href);
}
var href = window.location.href;
var user, objectData, levelDivAlive = false, isOblivionCreaterOpen;
var swordLevel = 0, shieldLevel = 0, levelUpLevel = 0, musicLevel = 1, bkMusicSwitch, bkMusicVolumn = 0.1, args, gameSpeed, gameNumber;
var musicData;
var scriptData = {
  type: "init"
}
var nowMapData, allMapData;
var mapInformation,elementNumber = 0,createNewElementTop = 0,lastHeight = 0;
function loadGameMap() {
  $.ajax({
    url: 'loadGameMap',              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: {
      gameLevel: levelNum+1
    },  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      allMapData = res;
      initMapData(res);
    }
  })
}
$.ajax({
  url: href,              // 要傳送的頁面
  method: 'POST',               // 使用 POST 方法傳送請求
  dataType: 'json',             // 回傳資料會是 json 格式
  data: scriptData,  // 將表單資料用打包起來送出去
  success: function (res) {
    // console.log(res);
    user = res;
    /*loadmusicData();*/
    // console.log(user);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        equipmentData = JSON.parse(this.responseText);
        initHome();
      }
    };
    xmlhttp.open("GET", "json/equipment.json", true);
    xmlhttp.send();
  }
})
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    objectData = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", "json/oblivionObject.json", true);
xmlhttp.send();

function initMapData(res) {
  var mapData = res.data;
  /*設置版本*/
  divTag = document.getElementById("versionControl");
  for (let index = mapData.length - 1; index > -1; index--) {
    const element = mapData[index];
    var b = document.createElement("span");
    b.setAttribute("onclick", "selectVersion(this)");
    b.innerHTML = element.versionID;
    divTag.appendChild(b);
    if (element.versionID == res.versionID) {
      nowMapData = JSON.parse(JSON.stringify(element));
      mapInformation = JSON.parse(element.map);
      b.style.background = "#E6E6E6";
      lastSelect = b;
      // console.log("nowMapData",nowMapData);
    }
  }
  var innerStr = "";
  for (let index = 0; index < nowMapData.description.mainGrammar.length; index++) {
    const element = nowMapData.description.mainGrammar[index];
    innerStr += element.innerGrammar;
    innerStr += '\n';
  }
  // console.log(innerStr);

  $('#levelIntroductionTextarea').val(innerStr);
  $('#levelDescriptionTextarea').val(nowMapData.description.description);
  $('#starConditionTextareaThree').val(mapInformation.winLinit.threeStar[0]);
  $('#starConditionTextareaTwo').val(mapInformation.winLinit.twoStar[0]);


  init_GameMapSetup(mapInformation);


}
function changeMapData(mapVersion) {
  var mapData = allMapData.data;
  for (let index = mapData.length - 1; index > -1; index--) {
    const element = mapData[index];
    if (element.versionID == mapVersion) {
      nowMapData = JSON.parse(JSON.stringify(element));
      mapInformation = JSON.parse(element.map);
    }
  }
  var innerStr = "";
  for (let index = 0; index < nowMapData.description.mainGrammar.length; index++) {
    const element = nowMapData.description.mainGrammar[index];
    innerStr += element.innerGrammar;
    innerStr += '\n';
  }
  // console.log(innerStr);

  $('#levelIntroductionTextarea').val(innerStr);
  $('#levelDescriptionTextarea').val(nowMapData.description.description);
  $('#starConditionTextareaThree').val(mapInformation.winLinit.threeStar[0]);
  $('#starConditionTextareaTwo').val(mapInformation.winLinit.twoStar[0]);
  init_GameMapSetup(mapInformation);

}

/*初始化*/
function modifyInit() {
  let tempStr = localStorage.getItem("gameName");
  gameNumber = localStorage.getItem("gameNumber");
  document.getElementById("previewBtn").setAttribute("onclick", "btnClick(" + gameNumber + ")")
  // console.log("這裡是關卡數:" + gameNumber);
  var gameNameStr = tempStr.replace(/&nbsp;/g, " ");
  divTag = document.getElementById("levelNameTextarea");
  divTag.value = gameNameStr;
  divTag.setAttribute("readonly", "");
  divTag.style = "background: #CCCCCC; text-align: center;";
}
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
  try {
    myVid = document.getElementById("bkMusic");
    myVid.volume = --bkMusicSwitch * ((musicLevel) * bkMusicVolumn);
    // myVid.play();
  }
  catch{

  }
  bkMusicSwitch++;
  var userName = document.getElementById("userName");
  var starNumber = document.getElementById("starNumber");
  // var text = user.name;
  userName.textContent = user.name;
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
  // try {
  //   isOblivionCreaterOpen = Session.get("isOblivionCreaterOpen");
  // } catch (e) {
  //   isOblivionCreaterOpen = false;
  // }
  // if (!isOblivionCreaterOpen) {
  //   helper('centerLost');
  // }
  modifyInit();
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
var helperMod = "code"; //code or blocky
function changeHelperMod(mainDiv){
  try {
    divTag = document.getElementById("changeHelperModView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("changeHelperModBkView");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  divTag = document.getElementById("centerLost");
  b = document.createElement("div");
  b.setAttribute("id", "changeHelperModBkView");
  b.setAttribute("onclick", "closeFunc(\"changeHelperModView\",\"changeHelperModBkView\")");
  b.setAttribute("class", "bkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "changeHelperModView");
  divTag.appendChild(b);

  divTag = document.getElementById("changeHelperModView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "blocklyBtn");
  b.setAttribute("value", "積木");
  b.setAttribute("onclick", "changeMod(\"blocky\")");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "codeBtn");
  b.setAttribute("value", "程式");
  b.setAttribute("onclick", "changeMod(\"code\")");
  divTag.appendChild(b);
}
function changeMod(modStr) {
  helperMod = modStr;
  clossFunc("changeHelperModView","changeHelperModBkView");
  helper();
}
function helper() {
  divTag = document.getElementById("helperView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch { }
  divTag = document.getElementById("helperBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch { }
  divTag = document.getElementById("blocklyDiv");
  b = document.createElement("div");
  b.setAttribute("id", "helperBkView");
  divTag.appendChild(b);
  divTag = document.getElementById("blocklyDiv");
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
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "儲存");
  b.setAttribute("id", "saveHelper");
  b.setAttribute("value", "儲存");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "取消");
  b.setAttribute("id", "cancelSaveHelper");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "closeFunc(\"helperView\",\"helperBkView\")");
  divTag.appendChild(b);
  b = document.createElement("h1");
  b.setAttribute("id", "allTitle");
  divTag.appendChild(b);
  document.getElementById("allTitle").innerHTML = "說明";
  b = document.createElement("div");
  b.setAttribute("id", "helperInnerDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("helperInnerDiv");
  /*新增按鈕*/
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "createNewElement");
  b.setAttribute("value", "+");
  b.setAttribute("onclick", "setCreateElementFunc()");
  divTag.appendChild(b);

}
/*創建新欄位函式*/
function setCreateElementFunc(){
  divTag = document.getElementById("helperView");
  b = document.createElement("div");
  b.setAttribute("id", "createElementBkView");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "createElementView");
  divTag.appendChild(b);
  divTag = document.getElementById("createElementView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "createElementClose");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"createElementBkView\",\"createElementView\")");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "createImgBtn");
  b.setAttribute("value", "圖片");
  b.setAttribute("onclick", "selectCreateNode('img')");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "createTextBtn");
  b.setAttribute("value", "文字");
  b.setAttribute("onclick", "selectCreateNode('text')");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "createImgAndTextBtn");
  b.setAttribute("value", "圖片+文字");
  b.setAttribute("onclick", "selectCreateNode('imgAndText')");
  divTag.appendChild(b);
}
/*選擇添加樣式*/
function selectCreateNode(mode) {
  divTag = document.getElementById("createElementView");
  divTag.innerHTML = "";
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("title", "關閉");
  b.setAttribute("id", "createElementClose");
  b.setAttribute("value", "X");
  b.setAttribute("onclick", "closeFunc(\"createElementBkView\",\"createElementView\")");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "confirmBtn");
  b.setAttribute("value", "確認");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "cancelBtn");
  b.setAttribute("value", "取消");
  b.setAttribute("onclick", "closeFunc(\"createElementBkView\",\"createElementView\")");
  divTag.appendChild(b);
  switch (mode) {
    case "img":
      document.getElementById("confirmBtn").setAttribute("onclick","createElementView(\"img\")");
      divTag.style.height = "20%";
      b = document.createElement("table");
      b.setAttribute("id", "setElementTable");
      divTag.appendChild(b);
      for(var i=0;i<2;i++){
        divTag = document.getElementById("setElementTable");
        b = document.createElement("tr");
        b.setAttribute("id", "setElementTr" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTr" + i);
        b = document.createElement("p");
        if(i == 0) b.innerHTML = "欄位高度（％）";
        else b.innerHTML = "欄位寬度（％）";
        divTag.appendChild(b);
        b = document.createElement("td");
        b.setAttribute("id", "setElementTd" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTd" + i);
        b = document.createElement("input");
        b.setAttribute("type", "number");
        b.setAttribute("id", "setElementInput" + i);
        divTag.appendChild(b);
      }
      break;
    case "text":
      document.getElementById("confirmBtn").setAttribute("onclick","createElementView(\"text\")");
      divTag.style.height = "20%";
      b = document.createElement("table");
      b.setAttribute("id", "setElementTable");
      divTag.appendChild(b);
      for(var i=0;i<2;i++){
        divTag = document.getElementById("setElementTable");
        b = document.createElement("tr");
        b.setAttribute("id", "setElementTr" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTr" + i);
        b = document.createElement("p");
        if(i == 0) b.innerHTML = "欄位高度（％）";
        else b.innerHTML = "欄位寬度（％）";
        divTag.appendChild(b);
        b = document.createElement("td");
        b.setAttribute("id", "setElementTd" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTd" + i);
        b = document.createElement("input");
        b.setAttribute("type", "number");
        b.setAttribute("id", "setElementInput" + i);
        divTag.appendChild(b);
      }
      break;
    case "imgAndText":
      document.getElementById("confirmBtn").setAttribute("onclick","createElementView(\"imgAndText\")");
      divTag.style.height = "35%";
      b = document.createElement("table");
      b.setAttribute("id", "setElementTable");
      divTag.appendChild(b);
      for(var i=0;i<4;i++){
        divTag = document.getElementById("setElementTable");
        b = document.createElement("tr");
        b.setAttribute("id", "setElementTr" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTr" + i);
        b = document.createElement("p");
        switch (i) {
          case 0:
            b.innerHTML = "文字欄位高度（％）";
            break;
          case 1:
            b.innerHTML = "文字欄位寬度（％）";
            break;
          case 2:
            b.innerHTML = "圖片欄位高度（％）";
            break;
          case 3:
            b.innerHTML = "圖片欄位寬度（％）";
            break;
        }
        divTag.appendChild(b);
        b = document.createElement("td");
        b.setAttribute("id", "setElementTd" + i);
        divTag.appendChild(b);
        divTag = document.getElementById("setElementTd" + i);
        b = document.createElement("input");
        b.setAttribute("type", "number");
        b.setAttribute("id", "setElementInput" + i);
        divTag.appendChild(b);
      }
      divTag = document.getElementById("setElementTable");
      b = document.createElement("tr");
      b.setAttribute("id", "setElementTr4");
      divTag.appendChild(b);
      divTag = document.getElementById("setElementTr4");
      b = document.createElement("td");
      b.setAttribute("id", "setElementTd4");
      b.setAttribute("colspan", "2");
      b.setAttribute("style", "text-align:center;");
      divTag.appendChild(b);
      divTag = document.getElementById("setElementTd4");
      b = document.createElement("input");
      b.setAttribute("type", "checkbox");
      b.setAttribute("id", "imgLeft");
      b.setAttribute("name", "c1");
      b.setAttribute("value", "1");
      b.setAttribute("onclick", "changeCheckBoxStatus(this)");
      divTag.appendChild(b);
      b = document.createElement("font");
      b.setAttribute("id", "leftText");
      b.innerHTML = "圖片在左";
      divTag.appendChild(b);
      b = document.createElement("input");
      b.setAttribute("type", "checkbox");
      b.setAttribute("id", "imgRight");
      b.setAttribute("name", "c1");
      b.setAttribute("value", "2");
      b.setAttribute("onclick", "changeCheckBoxStatus(this)");
      b.setAttribute("checked", "true");
      divTag.appendChild(b);
      b = document.createElement("font");
      b.setAttribute("id", "rightText");
      b.innerHTML = "圖片在右";
      divTag.appendChild(b);
      break;
  }
}
function changeCheckBoxStatus(input) {
  for (var i = 0; i < document.getElementById("setElementTd4").childNodes.length; i++) {
    document.getElementById("setElementTd4").childNodes[i].checked = false;
  }
  input.checked = true;
}
/*新增欄位*/
function createElementView(mode) {
  let imgHeight,imgWidth,textHeight,textWidth,isImgLeft;
  divTag = document.getElementById("helperInnerDiv");
  switch (mode) {
    case "img":
      imgHeight =  document.getElementById("setElementInput0").value;
      imgWidth =  document.getElementById("setElementInput1").value;
      b = document.createElement("div");
      b.setAttribute("id", "imgDiv" + elementNumber);
      b.setAttribute("class", "imgDiv");
      b.setAttribute("style", "width:100%;height:" + imgHeight + "%;top:" + lastHeight + "%;");
      divTag.appendChild(b);

      divTag = document.getElementById("imgDiv" + elementNumber);
      b = document.createElement("div");
      b.setAttribute("id", "imgDivInner" + elementNumber);
      b.setAttribute("class", "imgDivInner");
      b.setAttribute("style", "width:" + imgWidth + "%;height:100%;");
      divTag.appendChild(b);

      divTag = document.getElementById("imgDivInner" + elementNumber);
      b = document.createElement("img");
      b.setAttribute("id", "helperImg" + elementNumber);
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/noImage.png");
      divTag.appendChild(b);

      b = document.createElement("br");
      divTag.appendChild(b);

      b = document.createElement("input");
      b.setAttribute("id", "helperImg" + elementNumber + "Input");
      b.setAttribute("type", "file");
      b.setAttribute("style", "margin-left:15%;");
      b.setAttribute("accept", "image/gif, image/jpeg, image/png");
      b.setAttribute("onchange", "readImgUrl(this," + elementNumber + ")");
      divTag.appendChild(b);
      lastHeight = (parseInt(lastHeight) + 10 + parseInt(imgHeight));
      createNewElementTop = (parseInt(createNewElementTop) + 10 + parseInt(imgHeight));
      elementNumber++;
      break;
    case "text":
      textHeight =  document.getElementById("setElementInput0").value;
      textWidth =  document.getElementById("setElementInput1").value;
      b = document.createElement("div");
      b.setAttribute("id", "textDiv" + elementNumber);
      b.setAttribute("class", "textDiv");
      b.setAttribute("style", "width:100%;height:" + textHeight + "%;top:" + lastHeight + "%;");
      divTag.appendChild(b);

      divTag = document.getElementById("textDiv" + elementNumber);
      b = document.createElement("textarea");
      b.setAttribute("id", "helperTextarea" + elementNumber);
      b.setAttribute("class", "helperTextarea");
      b.setAttribute("style", "width:" + textWidth + "%;height:100%;background:white;");
      divTag.appendChild(b);

      lastHeight = (parseInt(lastHeight) + 5 + parseInt(textHeight));
      createNewElementTop = (parseInt(createNewElementTop) + 5 + parseInt(textHeight));
      elementNumber++;
      break;
    case "imgAndText":
      textHeight =  document.getElementById("setElementInput0").value;
      textWidth =  document.getElementById("setElementInput1").value;
      imgHeight =  document.getElementById("setElementInput2").value;
      imgWidth =  document.getElementById("setElementInput3").value;
      isImgLeft = document.getElementById("imgLeft").checked;
      let maxHeight = Math.max(textHeight,imgHeight);

      b = document.createElement("div");
      b.setAttribute("id", "imgAndTextDiv" + elementNumber);
      b.setAttribute("class", "textDiv");
      b.setAttribute("style", "width:100%;height:" + maxHeight + "%;top:" + lastHeight + "%;");
      divTag.appendChild(b);

      divTag = document.getElementById("imgAndTextDiv" + elementNumber);
      b = document.createElement("textarea");
      b.setAttribute("id", "helperTextarea" + elementNumber);
      if(isImgLeft){
        b.setAttribute("style", "width:" + textWidth + "%;height:100%;background:white;right:5%;");
      }else{
        b.setAttribute("style", "width:" + textWidth + "%;height:100%;background:white;left:5%;");
      }
      divTag.appendChild(b);

      b = document.createElement("div");
      b.setAttribute("id", "imgDivInner" + elementNumber);
      if(isImgLeft){
        b.setAttribute("style", "width:" + imgWidth + "%;height:auto;position: absolute;left:5%;");
      }else{
        b.setAttribute("style", "width:" + imgWidth + "%;height:auto;position: absolute;right:5%;");
      }
      divTag.appendChild(b);

      divTag = document.getElementById("imgDivInner" + elementNumber);
      b = document.createElement("img");
      b.setAttribute("id", "helperImg" + elementNumber);
      b.setAttribute("class", "helperImg");
      b.setAttribute("src", "img/noImage.png");
      divTag.appendChild(b);

      b = document.createElement("br");
      divTag.appendChild(b);

      b = document.createElement("input");
      b.setAttribute("id", "helperImg" + elementNumber + "Input");
      b.setAttribute("type", "file");
      b.setAttribute("style", "margin-left:15%;");
      b.setAttribute("accept", "image/gif, image/jpeg, image/png");
      b.setAttribute("onchange", "readImgUrl(this," + elementNumber + ")");
      divTag.appendChild(b);

      lastHeight = (parseInt(lastHeight) + 5 + parseInt(maxHeight));
      createNewElementTop = (parseInt(createNewElementTop) + 5 + parseInt(maxHeight));
      elementNumber++;
      break;
  }
  var obj = document.getElementById("createNewElement");
  obj.style.top = createNewElementTop + "%";
  closeFunc("createElementBkView","createElementView");
}
/*儲存小幫手*/
function saveHelper(modelNumber) {
  // remindView("儲存成功");
  // console.log(modelNumber);

  if (helperMod != "blocky") {
    var postData = nowMapData.mainCodeDescription;
  }
  else {
    var postData = nowMapData.mainBlockyDescription;
  }
  var level = localStorage.getItem("gameNumber");
  postData.mode=modelNumber;
  if (modelNumber == 1) {
    var textarea1 = strChange(document.getElementById("helperTextarea3").value);
    postData.textarea1 = textarea1;
  }
  else if (modelNumber == 2) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.img1 = img1;
    postData.img2 = img2;
  }
  else if (modelNumber == 3) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var textarea4 = strChange(document.getElementById("helperTextarea4").value);
    var textarea5 = strChange(document.getElementById("helperTextarea5").value);
    var textarea6 = strChange(document.getElementById("helperTextarea6").value);
    var textarea7 = strChange(document.getElementById("helperTextarea7").value);
    var textarea8 = strChange(document.getElementById("helperTextarea8").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg4")[0];
    var img4 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg5")[0];
    var img5 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg6")[0];
    var img6 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg7")[0];
    var img7 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.textarea4 = textarea4;
    postData.textarea5 = textarea5;
    postData.textarea6 = textarea6;
    postData.textarea7 = textarea7;
    postData.textarea8 = textarea8;
    postData.img1 = img1;
    postData.img2 = img2;
    postData.img4 = img4;
    postData.img5 = img5;
    postData.img6 = img6;
    postData.img7 = img7;

  }
  else if (modelNumber == 4) {
    var textarea1 = strChange(document.getElementById("helperTextarea1").value);
    var textarea2 = strChange(document.getElementById("helperTextarea2").value);
    var textarea4 = strChange(document.getElementById("helperTextarea4").value);
    var textarea5 = strChange(document.getElementById("helperTextarea5").value);
    var textarea6 = strChange(document.getElementById("helperTextarea6").value);
    var textarea7 = strChange(document.getElementById("helperTextarea7").value);
    var textarea8 = strChange(document.getElementById("helperTextarea8").value);
    var textarea9 = strChange(document.getElementById("helperTextarea9").value);
    var imageObj = $("#helperImg1")[0];
    var img1 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg2")[0];
    var img2 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg4")[0];
    var img4 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg5")[0];
    var img5 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg6")[0];
    var img6 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg7")[0];
    var img7 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    var imageObj = $("#helperImg8")[0];
    var img8 = imageObj.value ? imageObj.value : new URL(imageObj.src).pathname.substr(5);
    postData.textarea1 = textarea1;
    postData.textarea2 = textarea2;
    postData.textarea4 = textarea4;
    postData.textarea5 = textarea5;
    postData.textarea6 = textarea6;
    postData.textarea7 = textarea7;
    postData.textarea8 = textarea8;
    postData.textarea9 = textarea9;
    postData.img1 = img1;
    postData.img2 = img2;
    postData.img4 = img4;
    postData.img5 = img5;
    postData.img6 = img6;
    postData.img7 = img7;
    postData.img8 = img8;

  }
  // console.log(postData);
  var mapData = allMapData.data;
  for (let index = mapData.length - 1; index > -1; index--) {
    var element = mapData[index];
    if (element.versionID == allMapData.versionID) {
      if (helperMod != "blocky") {
        element.mainCodeDescription = postData;
      }
      else {
        element.mainBlockyDescription = postData;
      }
      // console.log(allMapData);
      break;
    }
  }
  var objData = JSON.stringify(allMapData);
  var scriptObjData = {
    gameLevel: level-1,
    data: objData
  }
  $.ajax({
    url: 'updateGameMap',              // 要傳送的頁面
    method: 'POST',               // 使用 POST 方法傳送請求
    dataType: 'json',             // 回傳資料會是 json 格式
    data: scriptObjData,  // 將表單資料用打包起來送出去
    success: function (res) {
      // console.log(res);
      remindView("儲存成功");
    }
  })
}
/*將字串轉為HTML格式*/
function strChange(textareaStr) {
  textareaStr = textareaStr.replace(/ /g, "&nbsp;");
  textareaStr = textareaStr.replace(/\n/g, "<br>");
  return textareaStr;
}
/*將HTML轉為字串格式*/
function htmlStrChange(textareaStr) {
  textareaStr = textareaStr.replace(/&nbsp;/g, " ");
  textareaStr = textareaStr.replace(/<br>/g, "\n");
  return textareaStr;
}
/*XX按鈕*/
function closeFunc(thisDiv, thisDiv2) {
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
/*讀取圖片*/
function readImgUrl(input, imgId) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      // console.log(input.files[0].name);
      data = {
        imgName: input.files[0].name,
        imgData: e.target.result.toString()
      }
      // console.log(data);
      $.ajax({
        url: "onloadImg",
        type: 'POST',
        cache: false, //上传文件不需要缓存
        dataType: 'json',
        data: data,
        success: function (res) {
          // console.log(res);
          var img = document.getElementById("helperImg" + imgId);
          img.setAttribute("src", e.target.result)
          $("#helperImg" + imgId)[0].value = res.path;
        },
        error: function (data) {
          // console.log("上传失败");
        }
      })
    }
    reader.readAsDataURL(input.files[0]);
  }
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
  b.setAttribute("onclick", "closeFunc(\"userDataView\",\"userDataBkView\")");
  divTag.appendChild(b);
  createUserView(divID);
}
function closeFunc(thisDiv, thisDiv2) {
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
  for (var i = 0; i < dataTitle.length; i++) {
    b = document.createElement("h3");
    b.setAttribute("id", "titleDatah3" + i);
    b.setAttribute("align", "left");
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
    document.getElementById("titleDatah3" + i).innerHTML = dataTitle[i] + userdataFont;
    for (var j = 0; j < 3; j++) {
      b = document.createElement("br");
      divTag.appendChild(b);
    }
  }
}

var thisSelectionId;
var args;
var divTag, level, b;
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
  // editMapterrain
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
  b.setAttribute("onclick", "closeFunc(\"lessRequirementView\")");
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
  b.setAttribute("onclick", "closeFunc(\"remindView\",\"remindBkView\")");
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
  divTag = document.getElementById(thisDiv);
  parentObj = divTag.parentNode;
  parentObj.removeChild(divTag);
  divTag = document.getElementById(thisDiv2);
  parentObj = divTag.parentNode;
  parentObj.removeChild(divTag);
  levelDivAlive = false;
}
/*儲存地圖*/
function saveModifyMap() {
  divTag = document.getElementById("versionControl");

  let versionNum = allMapData.versionID;
  b = document.createElement("span");
  b.setAttribute("onclick", "selectVersion(this)");
  b.innerHTML = versionNum;

  b.style.background = "#E6E6E6";
  if (lastSelect != null) {
    lastSelect.style.background = "none";
  }
  lastSelect = b;


  divTag.insertBefore(b, divTag.firstChild);


  // divTag.appendChild(b);
}

/*版本控制*/
var lastSelect = null;
function selectVersion(selectValue) {
  if (lastSelect != null && selectValue != lastSelect) {

    // console.log("選擇版本號" + selectValue.innerHTML);
    selectValue.style.background = "#E6E6E6";
    lastSelect.style.background = "none";
    lastSelect = selectValue;
    changeMapData(selectValue.innerHTML.toString());

  }
}

/*預覽*/
function btnClick(number) {
  /*主要語法*/
  var mainGrammarTempStr = document.getElementById("levelIntroductionTextarea").value;
  var mainGrammarStr = [];
  mainGrammarStr = mainGrammarTempStr.split("\n");

  /*關卡說明*/
  var levelDescriptionStr = document.getElementById("levelDescriptionTextarea").value;

  var divTag = document.getElementById("centerLost");
  var b;
  var isCheckClicked;
  number++;
  try {
    divTag = document.getElementById("levelDiv");
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
    divTag = document.getElementById("centerLost");
  } catch (e) {
    divTag = document.getElementById("centerLost");
  }
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
  b.setAttribute("onclick", "closeFunc(\"levelDiv\")");
  divTag.appendChild(b);
  divTag = document.getElementById("levelForm");
  b = document.createElement("h3");
  b.setAttribute("id", "levelDescription");
  b.innerHTML = localStorage.getItem("gameName");
  divTag.appendChild(b);
  /*星星圖*/
  b = document.createElement("div");
  b.setAttribute("id", "startDiv");
  divTag.appendChild(b);
  divTag = document.getElementById("startDiv");
  for (var i = 0; i < 3; i++) {
    b = document.createElement("img");
    b.setAttribute("id", "startImg" + i);
    b.setAttribute("class", "unStartImg");
    divTag.appendChild(b);
  }
  /*將星星預設為三顆滿星*/
  for (var i = 0; i < 3; i++) {
    document.getElementById("startImg" + i).className = "startImg";
  }
  /*主要函式*/
  b = document.createElement("div");
  b.setAttribute("id", "mainGrammar");
  divTag.appendChild(b);
  divTag = document.getElementById("mainGrammar");
  for (var i = 0; i < mainGrammarStr.length; i++) {
    if (mainGrammarStr[i].length > 0) {
      b = document.createElement("div");
      b.setAttribute("class", "innerGrammar");
      b.setAttribute("id", "innerGrammar" + i);
      divTag.appendChild(b);
      b.innerHTML = mainGrammarStr[i];
    }
  }
  b = document.createElement("br");
  divTag.appendChild(b);

  b = document.createElement("br");
  divTag.appendChild(b);

  /*關卡說明*/
  b = document.createElement("textarea");
  b.setAttribute("rows", "20");
  b.setAttribute("cols", "20");
  b.setAttribute("id", "levelDescriptiontextarea");
  b.setAttribute("readonly", "readonly");
  divTag.appendChild(b);
  b.innerHTML = levelDescriptionStr;
  b = document.createElement("br");
  divTag.appendChild(b);

  //number--;
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "historyCode");
  b.setAttribute("value", "查看紀錄");
  divTag.appendChild(b);
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "levelBtn");
  b.setAttribute("value", "進入關卡");
  divTag.appendChild(b);
}
