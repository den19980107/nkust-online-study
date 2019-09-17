/*滑鼠事件區*/
/*將ctrl+滾輪事件移除*/
var scrollFunc=function(e){
  e=e || window.event;
  if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome
    event.returnValue=false;
  }else if(e.detail){//Firefox
    event.returnValue=false;
  }
}
document.onkeydown=function (e) {
  if(e.keyCode == 107 && event.ctrlKey){
    event.returnValue=false;
  }else if(e.keyCode == 109 && event.ctrlKey){
    event.returnValue=false;
  }
}
/*註冊事件*/
if(document.addEventListener){
document.addEventListener('DOMMouseScroll',scrollFunc,false);
}
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari
