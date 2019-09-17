/*loading*/
function createLoadingMainView(mainDiv) {
  divTag = document.getElementById(mainDiv);
  b = document.createElement("div");
  b.setAttribute("id", "loadingMainBkView");
  // b.setAttribute("onclick", "clossFunc(\"loadingMainBkView\",\"loadingMainView\")");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "loadingMainView");
  b.setAttribute("class", "loadEffect");
  divTag.appendChild(b);
  divTag = document.getElementById("loadingMainView");
  for (var i = 0; i < 8; i++) {
    b = document.createElement("span");
    divTag.appendChild(b);
  }
}

function closeMainLoadingView() {
  var divTag = document.getElementById("loadingMainView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
  var divTag = document.getElementById("loadingMainBkView");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) { }
}