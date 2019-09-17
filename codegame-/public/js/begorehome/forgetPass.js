var UserName = document.getElementById('userName');
var eMail = document.getElementById('userEmail');

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

function forgetPass() {
    call_forgetPass_api();
}
function call_forgetPass_api() {
    var strN = UserName.value;
    var strE = eMail.value;

    if (UserName.value == "") {
        // alert("動作失敗\n" + "\"使用者名稱\"不能為空");
        remindValue = "動作失敗<br>" + "\"使用者名稱\"不能為空";
        remindView(remindValue);
    }
    else if (strN.indexOf(" ") != -1) {
        // alert("動作失敗\n" + "使用者名稱有空白字元");
        remindValue = "動作失敗<br>" + "使用者名稱有空白字元";
        remindView(remindValue);
    }
    else if (eMail.value == "") {
        // alert("動作失敗\n" + "\"信箱\"不能為空");
        remindValue = "動作失敗<br>" + "\"信箱\"不能為空";
        remindView(remindValue);
    }
    else if (strE.indexOf(" ") != -1) {
        // alert("動作失敗\n" + "\"信箱\"有空白字元");
        remindValue = "動作失敗<br>" + "\"信箱\"有空白字元";
        remindView(remindValue);
    }
    else if (!validateEmail(eMail.value)) {
        // alert("動作失敗\n" + "\"信箱\"格式錯誤");
        remindValue = "動作失敗<br>" + "\"信箱\"格式錯誤";
        remindView(remindValue);

    }
    else {
        var href = window.location.href;
        for (var i = 0; i < href.length; ++i) {
            if (href[i] == '/' || href[i] == "\\") {
                index = i;
            }
        }
        href = href.substr(0, index + 1);
        // alert(href)
        var scriptData = {
            username: UserName.value,
            email: eMail.value,
            homeUrl: href
        }
        // console.log(scriptData);
        var href = window.location.href;
        $.ajax({
            url: href,              // 要傳送的頁面
            method: 'POST',               // 使用 POST 方法傳送請求
            dataType: 'json',             // 回傳資料會是 json 格式
            data: scriptData,  // 將表單資料用打包起來送出去
            success: function (res) {
                // alert(res.responce);
                var result = "動作失敗<br>";
                if (res.responce == "sucesss") {
                    result = "請收信確認";
                    // alert(result);
                    remindValue = result;
                    remindView(remindValue);
                    // var href = "/login";
                    // window.location.replace(href);
                }
                else if (res.responce == "failNamUndifine") {
                    result += "\"使用者\"未被啟用";
                    // alert(result);
                    remindValue = result;
                    remindView(remindValue);
                }
                else if (res.responce == "failuserisNotEmail") {
                    result += "\"信箱\"錯誤";
                    // alert(result);
                    remindValue = result;
                    remindView(remindValue);
                }
                else if (res.responce == "failEMailUndifine") {
                    result += "\"信箱\"未被啟用";
                    // alert(result);
                    remindValue = result;
                    remindView(remindValue);
                }
                else if (res.responce == "fail") {
                    resul += "未達預期結果,請再試一次";
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
    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
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
  divTag = document.getElementById("center");
  if (levelDivAlive) {
      divTag = document.getElementById("remindView");
      try {
          parentObj = divTag.parentNode;
          parentObj.removeChild(divTag);
      } catch (e) { }
      levelDivAlive = false;
      divTag = document.getElementById("center");
  }
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
    } catch (e) { }
    divTag = document.getElementById(thisDiv2);
    try {
        parentObj = divTag.parentNode;
        parentObj.removeChild(divTag);
    } catch (e) { }
    levelDivAlive = false;
}
