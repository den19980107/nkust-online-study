var UserName = document.getElementById('UsreName');
var UserPass = document.getElementById('UsrePass');
var loginBtn = document.getElementById('loginBtn');
var parentObj;

window.onload = function() {
  var href = new URL(window.location.href);
  let params = href.searchParams;
  if (params.has('token')) {
    // console.log("0.0");
    // console.log(UserName.value);
    // console.log(UserPass.value);
    if (UserName.value && UserPass.value) {
      if (params.get('token') == "IncorrectUsername") {
        // alert("'使用者帳號'輸入錯誤");
        remindValue = "使用者帳號輸入錯誤";
        remindView(remindValue);
      } else if (params.get('token') == "InvalidPassword") {
        // alert("'密碼'輸入錯誤");
        remindValue = "密碼輸入錯誤";
        remindView(remindValue);
      }
    } else if (params.get('token') == "userBlocked") {
      // alert("'密碼'輸入錯誤");
      remindValue = "此帳號已被封鎖<br>請聯絡官方";
      remindView(remindValue);
    }
  }
}



function login() {
  call_Login_api();
}

function call_Login_api() {
  var strN = UserName.value;
  var strP = UserPass.value;
  if (UserName.value == "") {
    // alert("使用者名稱不能為空");
    remindValue = "使用者名稱不能為空";
    remindView(remindValue);
  } else if (strN.indexOf(" ") != -1) {
    // alert("使用者名稱有空白字元");
    remindValue = "使用者名稱有空白字元";
    remindView(remindValue);
  } else if (UserPass.value == "") {
    // alert("密碼不能為空");
    remindValue = "密碼不能為空";
    remindView(remindValue);
  } else if (strP.indexOf(" ") != -1) {
    // alert("密碼有空白字元");
    remindValue = "密碼有空白字元";
    remindView(remindValue);
  } else {
    var scriptData = {
      username: UserName.value,
      password: UserPass.value,
    }
    // console.log(scriptData);
    var href = window.location.href;
    post_to_url(href, scriptData);

  }
}

function forgest() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
    if (href[i] == '/' || href[i] == "\\") {
      index = i;
    }
  }
  href = href.substr(0, index + 1) + "forgetPass";
  window.location.replace(href);
  // console.log(href);
}

function registered() {
  var index = 0;
  var href = window.location.href;
  for (var i = 0; i < href.length; ++i) {
    if (href[i] == '/' || href[i] == "\\") {
      index = i;
    }
  }
  href = href.substr(0, index + 1) + "register";
  window.location.replace(href);
  // console.log(href);
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
document.getElementById("UsrePass").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    //event.preventDefault();
    document.getElementById("loginBtn").click();
  }
});
document.getElementById("UsreName").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    //event.preventDefault();
    document.getElementById("loginBtn").click();
  }
});
