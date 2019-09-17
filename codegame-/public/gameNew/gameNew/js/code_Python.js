'use strict';
//變數宣告區
var toolbox = document.getElementById("toolbox");
var options = {
  toolbox: toolbox,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: 'start',
  css: true,
  media: 'https://blockly-demo.appspot.com/static/media/',
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
  enable: false
};
var workspace = Blockly.inject('blocklyDiv', options);
var workspaceBlocks = document.getElementById("workspaceBlocks");
Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
var blocks = [];
var mainBlock;
var nowBlock;
var nextBlock;
var isPresence = false;
var content = document.getElementById('code');
var textarea_0 = document.getElementById('textarea_0');
// 有text表示給編譯器或HTML的textarea看的
// 沒有front的代表放後面
var frontTextcode;
var textcode = [];
var frontcode;
var code = [];
var frontFuncode = [];
var funcode = [];
var frontTextFuncode = [];
var textfuncode = [];
var funLoopVar = 0;
var funLoop = [];
var textFunLoop = [];
var x = 1;
var loopVariable = 0;
var funTimes = 0;
var midFuncode = [];
var textMidFuncode = [];
var clossDiv = document.getElementById("clossDiv");
var textareaDiv = document.getElementById("textareaBk");
var myMap = {
  'textSpacing': '    ',
  'spacing': '&nbsp&nbsp&nbsp&nbsp',
  'main': 'int main(int argc,char* argv[]){',
  'var': 'int i',
  'moveForward': 'moveForward();',
  'turnRight': 'turnRight();',
  'turnLeft': 'turnLeft();',
  'fire': 'fire();',
  'printL': 'printf(\"',
  'printR': '\");',
  'scanfL': 'scanf(\"',
  'break': 'break;',
  'ifL': 'if(',
  'ifR': '){',
  'forL': 'for('
};
var blocklyMap = {

};
//函示區
function myFunction() {
  var divTag = document.getElementById('blocklyDiv'),
    b;
  document.getElementById('blocklyDiv').innerHTML = "";
  workspace = Blockly.inject('blocklyDiv', options);
  workspaceBlocks = document.getElementById("workspaceBlocks");
  Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
  workspace.addChangeListener(onFirstComment);
  code = '';
  textcode = '';
  b = document.createElement("div");
  b.setAttribute("id", "blocklyButtonBottomDiv");
  divTag.appendChild(b);
  b = document.createElement("div");
  b.setAttribute("id", "blocklyButtonRightDiv");
  divTag.appendChild(b);

  divTag = document.getElementById('blocklyButtonRightDiv');
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "btn1");
  b.setAttribute("class", "runButton");
  b.setAttribute("title", "開始");
  b.setAttribute("onclick", "changeToC(0)");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("class", "transformButton");
  b.setAttribute("title", "轉譯積木");
  b.setAttribute("onclick", "transformButton('blocklyDiv')");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("class", "clearButton");
  b.setAttribute("title", "重置地圖");
  b.setAttribute("onclick", "myFunction()");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("class", "restartButton");
  b.setAttribute("title", "重置遊戲");
  b.setAttribute("onclick", "restartButton()");
  divTag.appendChild(b);

  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("class", "settingButton");
  b.setAttribute("title", "設定");
  b.setAttribute("onclick", "settingAllView(blocklyDiv)");
  divTag.appendChild(b);
  //content.innerHTML = code;
  textarea_0.value = '';
  //clearcodeAndInit();
  clearcodeAndInit();
}

// 第一次跑的話會記錄main的資訊
function onFirstComment(event) {
  try {
    if (workspace.getBlockById(event.blockId).type == 'block_main') {
      mainBlock = event.blockId;
    }
  } catch (e) {}
  if (workspace.getBlockById(event.blockId) != null)
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i] == event.blockId)
        isPresence = true;
      else
        isPresence = false;
    }
  if (!isPresence) {
    blocks.push(event.blockId);
  }
}
workspace.addChangeListener(onFirstComment);

// 當轉譯按鈕被按下時
function changeToC(isDisplay) {
  var nowBlockType;
  var x = 1;
  code = '';
  textcode = '';
  frontFuncode = '';
  frontTextFuncode = '';
  textfuncode = '';
  frontFuncode = '';
  funcode = '';
  funLoop = '';
  textFunLoop = '';
  x = 1;
  loopVariable = 0;
  frontcode = '#include &ltstdio.h&gt<br>#include &ltstdlib.h&gt<br>#include &ltstring.h&gt<br><br>';
  frontTextcode = '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n';
  try {
    nowBlock = workspace.getBlockById(mainBlock).childBlocks_[0].id;
  } catch {
    frontcode = frontcode + myMap.main + '<br>';
    frontTextcode = frontTextcode + myMap.main + '\n';
    code = code + myMap.spacing + 'return 0;<br>}';
    textcode = textcode + myMap.textSpacing + 'return 0;\n}';
    for (var i = 0; i < loopVariable; i++) {
      frontcode = frontcode + myMap.spacing + myMap.var+i + ' = 0;<br>';
      frontTextcode = frontTextcode + myMap.textSpacing + myMap.var+i + ' = 0;\n';
    }
    code = frontcode + code;
    textcode = frontTextcode + textcode;
    textarea_0.value = textcode;

  }
  nextBlock = workspace.getBlockById(nowBlock).previousConnection.dbOpposite_[1].sourceBlock_.id;
  for (var i = 0; i < workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_.length; i++) {
    try {
      nowBlock = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[i].sourceBlock_.id;
    } catch (err) {
      break;
    }
    switch (workspace.getBlockById(nowBlock).type) {
      case 'block_var':
        for (var j = 0; j < x; j++) {
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        var var0, var1, var2;
        var0 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[0].text_;
        var1 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_;
        var2 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_
        code = code + var0 + ' ' + var1 + '=' + var2 + ';<br>';
        textcode = textcode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
        break;
      case 'block_loop':
        i = loopChange(x, i);
        break;
      case 'block_if_else':
        i = judgment(x, i, false);
        break;
      case 'block_if':
        i = judgment(x, i, true);
        break;
      case 'block_switch':
        i = judgment_sw(x, i);
        break;
      case 'block_function':
        i = functionChange(x, i);
        i--;
        break;
      default:
        if (workspace.getBlockById(nowBlock).type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(nowBlock).type, x);
        break;
    }
  }
  code = code + '&nbsp&nbsp&nbsp&nbspreturn 0;<br>}<br>';
  textcode = textcode + '    return 0;\n}\n';
  frontcode = frontcode + frontFuncode;
  frontcode = frontcode + '<br>int main(int argc,char* argv[]){<br>';
  frontTextcode = frontTextcode + frontTextFuncode;
  frontTextcode = frontTextcode + '\nint main(int argc,char* argv[]){\n';
  for (var i = 0; i < loopVariable; i++) {
    frontcode = frontcode + '&nbsp&nbsp&nbsp&nbspint var' + i + ' = 0;<br>';
    frontTextcode = frontTextcode + '    int var' + i + ' = 0;\n';
  }
  code = frontcode + code;
  textcode = frontTextcode + textcode;
  code = code + funcode;
  textcode = textcode + textfuncode;
  //content.innerHTML = code;
  textarea_0.value = textcode;
  clossDiv.onclick = function() {
    textareaDiv.style.display = "none";
  }
  if (isDisplay) {
    textareaDiv.style.display = 'block';
  } else {
    challengeGameAgain();
    codeToCompiler(textcode);
  }
}

function loopChange(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var loop1, loop2, loop3, loop4, loop5, loop6;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  repeatTimes++;
  loop1 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_;
  loop2 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[3].text_;
  loop3 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[5].text_;
  loop4 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[6].text_;
  loop5 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[7].text_;
  loop6 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[9].text_;
  code = code + 'for(' + loop1 + '=' + loop2 + ';' + loop3 + loop4 + loop5 + ';' + loop6 + '){<br>';
  textcode = textcode + 'for(' + loop1 + '=' + loop2 + ';' + loop3 + loop4 + loop5 + ';' + loop6 + '){\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = loopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment(repeatTimes, nowPosition, onlyIf) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var ifTimes = 1;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  repeatTimes++;
  code = code + myMap.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + myMap.ifR + '<br>';
  textcode = textcode + myMap.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + myMap.ifR + '\n';
  while (1) {
    if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
      ifTimes++;
    }
    if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf) {
      break;
    } else if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
      repeatTimes--;
      for (var i = 0; i < repeatTimes; i++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + '}else{<br>';
      textcode = textcode + '}else{\n';
      repeatTimes++;
      if (ifTimes == 2) {
        onlyIf = 1;
        nextPosition++;
        continue;
      } else if (ifTimes == 3) {
        nextPosition++;
        break;
      }
    }
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = loopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment_sw(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  repeatTimes++;
  code = code + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
  textcode = textcode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = loopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment_case(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  repeatTimes++;
  code = code + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':<br>';
  textcode = textcode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = loopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes);
        break;
    }
    nextPosition++;
  }
  return nextPosition;
}

function judgment_default(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    code = code + myMap.spacing;
    textcode = textcode + myMap.textSpacing;
  }
  repeatTimes++;
  code = code + 'default:<br>';
  textcode = textcode + 'default:\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = loopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        selectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes);
        break;
    }
    nextPosition++;
  }
  return nextPosition;
}

function selectionType(type, x) {
  switch (type) {
    case 'block_moveForward':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.moveForward + '<br>';
      textcode = textcode + myMap.moveForward + '\n';
      break;
    case 'block_turn_right':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.turnRight + '<br>';
      textcode = textcode + myMap.turnRight + '\n';
      break;
    case 'block_turn_left':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.turnLeft + '<br>';
      textcode = textcode + myMap.turnLeft + '\n';
      break;
    case 'block_fire':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.fire + '<br>';
      textcode = textcode + myMap.fire + '\n';
      break;
    case 'block_break':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.break+'<br>';
      textcode = textcode + myMap.break+'\n';
      break;
    case 'block_printf':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + myMap.printR + '<br>';
      textcode = textcode + myMap.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + myMap.printR + '\n';
      break;
    case 'block_printf2':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + myMap.printR + '<br>';
      textcode = textcode + myMap.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + myMap.printR + '\n';
      break;
    case 'block_scanf':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + myMap.scanfL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');<br>';
      textcode = textcode + myMap.scanfL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');\n';
      break;
    case 'block_call':
      for (var j = 0; j < x; j++) {
        code = code + myMap.spacing;
        textcode = textcode + myMap.textSpacing;
      }
      code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
      textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
      break;
  }
}

//function函式區
function functionChange(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  midFuncode = '';
  textMidFuncode = '';
  textFunLoop = '';
  funLoopVar = 0;
  frontFuncode = frontFuncode + 'void&nbsp' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '();<br>';
  frontTextFuncode = frontTextFuncode + 'void ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '();\n';
  funLoop = 'void&nbsp' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '(){<br>';
  textFunLoop = 'void ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '(){\n';
  while (nextPosition < workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_.length) {
    try {
      workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type;
    } catch (err) {
      break;
    }
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_var':
        for (var j = 0; j < x; j++) {
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        var var0, var1, var2;
        var0 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[0].text_;
        var1 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[1].text_;
        var2 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[3].text_;
        midFuncode = midFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';<br>';
        textMidFuncode = textMidFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes, nextPosition);
        break;
      case 'block_function':
        funTimes++;
        funcode = funLoop + funcode;
        textfuncode = textFunLoop + textMidFuncode;
        funcode = funcode + '}<br>';
        textfuncode = textfuncode + '}\n';
        return nextPosition;
        break;
      case 'block_main':
        funTimes++;
        funcode = funLoop + funcode;
        textfuncode = textFunLoop + textMidFuncode;
        funcode = funcode + '}<br>';
        textfuncode = textfuncode + '}\n';
        return nextPosition;
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  for (var i = 0; i < funLoopVar; i++) {
    funLoop = funLoop + '&nbsp&nbsp&nbsp&nbspint var' + i + ' = 0;<br>';
    textFunLoop = textFunLoop + '    int var' + i + ' = 0;\n';
  }
  if (funTimes == 0) {
    funcode = funLoop + funcode;
    textfuncode = textFunLoop + textMidFuncode;
  } else {
    funcode = funcode + funLoop;
    textfuncode = textfuncode + textFunLoop + textMidFuncode;
  }
  funcode = funcode + '}<br>';
  textfuncode = textfuncode + '}\n';
  return nextPosition;
}

function funLoopChange(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var loop1, loop2, loop3, loop4, loop5, loop6;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  repeatTimes++;
  loop1 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_;
  loop2 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[3].text_;
  loop3 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[5].text_;
  loop4 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[6].text_;
  loop5 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[7].text_;
  loop6 = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[9].text_;
  midFuncode = midFuncode + 'for(' + loop1 + '=' + loop2 + ';' + loop3 + loop4 + loop5 + ';' + loop6 + '){<br>';
  textMidFuncode = textMidFuncode + 'for(' + loop1 + '=' + loop2 + ';' + loop3 + loop4 + loop5 + ';' + loop6 + '){\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment(repeatTimes, nowPosition, onlyIf) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var ifTimes = 1;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  repeatTimes++;
  midFuncode = midFuncode + myMap.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + myMap.ifR + '<br>';
  textMidFuncode = textMidFuncode + myMap.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + myMap.ifR + '\n';
  while (1) {
    if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
      ifTimes++;
    }
    if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf) {
      break;
    } else if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
      repeatTimes--;
      for (var i = 0; i < repeatTimes; i++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + '}else{<br>';
      textMidFuncode = textMidFuncode + '}else{\n';
      repeatTimes++;
      if (ifTimes == 2) {
        onlyIf = 1;
        nextPosition++;
        continue;
      } else if (ifTimes == 3) {
        nextPosition++;
        break;
      }
    }
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment_sw(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  repeatTimes++;
  midFuncode = midFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
  textMidFuncode = textMidFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  repeatTimes--;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment_case(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  repeatTimes++;
  midFuncode = midFuncode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':<br>';
  textMidFuncode = textMidFuncode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  return nextPosition;
}

function funJudgment_default(repeatTimes, nowPosition) {
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for (var j = 0; j < repeatTimes; j++) {
    midFuncode = midFuncode + myMap.spacing;
    textMidFuncode = textMidFuncode + myMap.textSpacing;
  }
  repeatTimes++;
  midFuncode = midFuncode + 'default:<br>';
  textMidFuncode = textMidFuncode + 'default:\n';
  while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes, nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes, nextPosition, false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes, nextPosition, true);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes, nextPosition);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes, nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes, nextPosition);
        break;
      default:
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type == null) {
          nextBlock = null;
          break;
        }
        funSelectionType(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type, repeatTimes, nextPosition);
        break;
    }
    nextPosition++;
  }
  return nextPosition;
}

function funSelectionType(type, x, nextPosition) {
  switch (type) {
    case 'block_moveForward':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.moveForward + '<br>';
      textMidFuncode = textMidFuncode + myMap.moveForward + '\n';
      break;
    case 'block_turn_right':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.turnRight + '<br>';
      textMidFuncode = textMidFuncode + myMap.turnRight + '\n';
      break;
    case 'block_turn_left':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.turnLeft + '<br>';
      textMidFuncode = textMidFuncode + myMap.turnLeft + '\n';
      break;
    case 'block_fire':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.fire + '<br>';
      textMidFuncode = textMidFuncode + myMap.fire + '\n';
      break;
    case 'block_break':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.break+'<br>';
      textMidFuncode = textMidFuncode + myMap.break+'\n';
      break;
    case 'block_printf':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + myMap.printR + '<br>';
      textMidFuncode = textMidFuncode + myMap.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + myMap.printR + '\n';
      break;
    case 'block_printf2':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[3].text_ + myMap.printR + '<br>';
      textMidFuncode = textMidFuncode + myMap.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[3].text_ + myMap.printR + '\n';
      break;
    case 'block_scanf':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + myMap.scanfL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');<br>';
      textMidFuncode = textMidFuncode + myMap.scanfL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');\n';
      break;
    case 'block_call':
      for (var j = 0; j < x; j++) {
        midFuncode = midFuncode + myMap.spacing;
        textMidFuncode = textMidFuncode + myMap.textSpacing;
      }
      midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
      textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
      break;
  }
}
