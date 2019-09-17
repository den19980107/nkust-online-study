var x = "hi.",b;
var divTag = document.getElementById("centerBlockly");
for (var i = 0; i < 24; i++) {
  if (i == 0) {
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("onclick", "btnClick(" + i + ")");
    b.setAttribute("class", "btn btn" + i);
    divTag.appendChild(b);
  } else {
    (b = document.createElement("button")).innerHTML = "";
    b.setAttribute("onclick", "btnClick(" + i + ")");
    b.setAttribute("class", "unbtn btn" + i);
    divTag.appendChild(b);
  }
}

function btnTransfer(number) {
  window.location.assign("index.html");
  btnClick(number);
}
