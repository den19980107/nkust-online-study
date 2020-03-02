var UserName = document.getElementById('userName');
var OldPass = document.getElementById('oldPass');
var UserPass = document.getElementById('Pass');
var UserCheckPass = document.getElementById('checkPass');
// history.pushState("", "page", "");
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
  // console.log(href);
}

function changePassword() {
  var strN = UserName.value;
  var strOP = OldPass.value;
  var strP = UserPass.value;
  var strCP = UserCheckPass.value;
  if (UserName.value == "") {
    // alert("動作失敗\n" + "\"使用者帳號\"不能為空");
    remindValue = "動作失敗<br>" + "\"使用者帳號\"不能為空";
    remindView(remindValue);
  } else if (strN.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "使用者帳號有空白字元");
    remindValue = "動作失敗<br>" + "使用者帳號有空白字元";
    remindView(remindValue);
  } else if (OldPass.value == "") {
    // alert("動作失敗\n" + "\"舊密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"舊密碼\"不能為空";
    remindView(remindValue);
  } else if (strOP.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "\"舊密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"舊密碼\"有空白字元";
    remindView(remindValue);
  } else if (UserPass.value == "") {
    // alert("動作失敗\n" + "\"密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"密碼\"不能為空";
    remindView(remindValue);
  } else if (strP.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "\"密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"密碼\"有空白字元";
    remindView(remindValue);
  } else if (UserCheckPass.value == "") {
    // alert("動作失敗\n" + "\"確認密碼\"不能為空");
    remindValue = "動作失敗<br>" + "\"確認密碼\"不能為空";
    remindView(remindValue);
  } else if (strCP.indexOf(" ") != -1) {
    // alert("動作失敗\n" + "\"確認密碼\"有空白字元");
    remindValue = "動作失敗<br>" + "\"確認密碼\"有空白字元";
    remindView(remindValue);
  } else if (UserCheckPass.value != UserPass.value) {
    // alert("動作失敗\n" + "\"密碼\"與\"確認密碼\"不同");
    remindValue = "動作失敗<br>" + "\"密碼\"與\"確認密碼\"不同";
    remindView(remindValue);
  } else {
    var scriptData = {
      username: UserName.value,
      oldPassword: OldPass.value,
      password: UserPass.value,
    }
    var href = window.location.href;
    $.ajax({
      url: href, // 要傳送的頁面
      method: 'POST', // 使用 POST 方法傳送請求
      dataType: 'json', // 回傳資料會是 json 格式
      data: scriptData, // 將表單資料用打包起來送出去
      success: function(res) {
        result = "動作失敗<br>";
        // alert(res.responce );
        if (res.responce == "sucesss") {
          result = "修改成功";
          // alert(result);
          remindValue = result;
          remindView(remindValue);
          // var href = "/login";
          // window.location.replace(href);
        } else if (res.responce == "failPassUndifine") {
          result += "\"密碼\"未被啟用";
          // alert(result);
          remindValue = result;
          remindView(remindValue);
        } else if (res.responce == "failNamUndifine") {
          result += "\"使用者帳號\"未被啟用";
          // alert(result);
          remindValue = result;
          remindView(remindValue);
        }
      },
    });
  }
}

function validateEmail(email) {
  reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
  if (reg.test(email)) {
    // alert("E-Mail 格式正確!");
    return true;
  } else {
    // alert("E-Mail 格式錯誤!");
    return false;
  }
}

function post_to_url(path, params, method) {
  method = method || "post"; // Set method to post by default, if not specified.
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form); // Not entirely sure if this is necessary
  form.submit();
}

var levelDivAlive = false;
//創造提醒視窗函式
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
  } catch (e) {}
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
  b.setAttribute("title", "關閉");
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
  } catch (e) {}
  divTag = document.getElementById(thisDiv2);
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
  levelDivAlive = false;
}
