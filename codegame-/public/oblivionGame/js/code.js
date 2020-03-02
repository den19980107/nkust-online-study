'use strict';
//變數宣告區
var toolbox = document.getElementById("toolbox");
var options = {
	toolbox : toolbox,
	collapse : true,
	comments : true,
	disable : true,
	maxBlocks : Infinity,
	trashcan : true,
	horizontalLayout : false,
	toolboxPosition : 'start',
	css : true,
	media : 'https://blockly-demo.appspot.com/static/media/',
	rtl : false,
	scrollbars : true,
	sounds : true,
	oneBasedIndex : true
};
var workspace = Blockly.inject('blocklyDiv', options);
var workspaceBlocks = document.getElementById("workspaceBlocks");
Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
var blocks = [];
var mainBlock;
var nowBlock;
var nextBlock;
var isIndentation = false;
var number = 0;
var isPresence = false;
//var workspace = Blockly.inject('blocklyDiv',{toolbox: document.getElementById('toolbox')});
var content = document.getElementById('code');
var isUnderMain = false;
var textarea_0 = document.getElementById('textarea_0');
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
var x=1;
var loopVariable = 0;
var funTimes = 0;
var midFuncode = [];
var textMidFuncode = [];
var clossDiv = document.getElementById("clossDiv");
var textareaDiv = document.getElementById("textareaBk");

//函示區
function myFunction(){
  document.getElementById('blocklyDiv').innerHTML="";
  workspace = Blockly.inject('blocklyDiv', options);
	workspaceBlocks = document.getElementById("workspaceBlocks");
	Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
  workspace.addChangeListener(onFirstComment);
  code = '';
  textcode = '';
  //content.innerHTML = code;
  textarea_0.value = '';
  //clearcodeAndInit();
  clearcodeAndInit();
}

function onFirstComment(event){
  try{
    if(workspace.getBlockById(event.blockId).type == 'block_main'){
      mainBlock = event.blockId;
    }
  }catch(e){}
  if(workspace.getBlockById(event.blockId) != null)
    for(var i = 0;i < blocks.length; i++){
      if(blocks[i] == event.blockId)
        isPresence = true;
      else
        isPresence = false;
    }
    if(!isPresence){
      blocks.push(event.blockId);
    }
    //console.log( workspace.getBlockById(blocks[0]),'\n');
    //console.log( workspace.getBlockById(blocks[1]),'\n');
    //console.log( workspace.getBlockById(blocks[3]),'\n');
    //console.log( workspace.getBlockById(blocks[4]),'\n');
    //console.log( workspace.getBlockById(blocks[0]).childBlocks_.length,'\n');
    //console.log( workspace.getBlockById(blocks[0]).childBlocks_[0].nextConnection.sourceBlock_.type,'\n');
    //console.log( workspace.getBlockById(blocks[0]).previousConnection.sourceBlock_.inputList[0].fieldRow[1].text_,'\n');
}
workspace.addChangeListener(onFirstComment);

function changeToC(isDisplay){
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
  x=1;
  loopVariable = 0;
  frontcode = '#include &ltstdio.h&gt<br>#include &ltstdlib.h&gt<br>#include &ltstring.h&gt<br><br>';
  frontTextcode = '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n';
  try{
    nowBlock = workspace.getBlockById(mainBlock).childBlocks_[0].id;
  }catch{
    frontcode = frontcode + 'int main(int argc,char* argv[]){<br>';
    frontTextcode = frontTextcode + 'int main(int argc,char* argv[]){\n';
    code = code + '&nbsp&nbsp&nbsp&nbspreturn 0;<br>}';
    textcode = textcode + '    return 0;\n}';
    for(var i=0;i<loopVariable;i++){
      frontcode = frontcode + '&nbsp&nbsp&nbsp&nbspint var' + i + ' = 0;<br>';
      frontTextcode = frontTextcode + '    int var' + i + ' = 0;\n';
    }
    code = frontcode + code;
    textcode = frontTextcode + textcode;
    //content.innerHTML = code;
    textarea_0.value = textcode;
    
  }
  nextBlock = workspace.getBlockById(nowBlock).previousConnection.dbOpposite_[1].sourceBlock_.id;
  //console.log(nextBlock);
  for(var i = 0; i < workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_.length; i++){
    try{
      nowBlock = workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[i].sourceBlock_.id;
    }catch(err){
      break;
    }
    //console.log(nowBlock);
    switch (workspace.getBlockById(nowBlock).type) {
      case 'block_step':
        selectionType('block_step',x);
        break;
      case 'block_turn_right':
        selectionType('block_turn_right',x);
        break;
      case 'block_turn_left':
        selectionType('block_turn_left',x);
        break;
      case 'block_fire':
        selectionType('block_fire',x);
        break;
      case 'block_break':
        selectionType('block_break',x);
        break;
      case 'block_var':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        var var0,var1,var2;
        var0 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[0].text_;
        var1 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_;
        var2 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_
        code = code + var0 + ' ' + var1 + '=' + var2 + ';<br>';
        textcode = textcode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
        break;
      case 'block_printf':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        i = loopChange(x,i);
        break;
      case 'block_if_else':
        i = judgment(x,i,false);
        break;
      case 'block_if':
        i = judgment(x,i,true);
        break;
      case 'block_switch':
        i = judgment_sw(x,i);
        break;
      case 'block_function':
        i = functionChange(x,i);
        i--;
        break;
      case 'block_main':
        break;
      default:
        nextBlock = null;
    }
  }
  code = code + '&nbsp&nbsp&nbsp&nbspreturn 0;<br>}<br>';
  textcode = textcode + '    return 0;\n}\n';
  frontcode = frontcode + frontFuncode;
  frontcode = frontcode + '<br>int main(int argc,char* argv[]){<br>';
  frontTextcode = frontTextcode + frontTextFuncode;
  frontTextcode = frontTextcode + '\nint main(int argc,char* argv[]){\n';
  for(var i=0;i<loopVariable;i++){
    frontcode = frontcode + '&nbsp&nbsp&nbsp&nbspint var' + i + ' = 0;<br>';
    frontTextcode = frontTextcode + '    int var' + i + ' = 0;\n';
  }
  code = frontcode + code;
  textcode = frontTextcode + textcode;
  code = code + funcode;
  textcode = textcode + textfuncode;
  //content.innerHTML = code;
	//console.log(isDisplay);
  textarea_0.value = textcode;
	// console.log(textcode);
	clossDiv.onclick = function() {
		textareaDiv.style.display = "none";
	}
	console.log(textarea_0.value);
	if(isDisplay){
		console.log("?????????");
		textareaDiv.style.display = 'block';
	}else{
		challengeGameAgain();
	  codeToCompiler(textcode);
	}
}

function loopChange(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var loop1,loop2,loop3,loop4,loop5,loop6;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
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
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        selectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        selectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        selectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        selectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        selectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = loopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes,nextPosition,true);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment(repeatTimes,nowPosition,onlyIf){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var ifTimes = 1;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  repeatTimes++;
  code = code + 'if(' +  workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + '){<br>';
  textcode = textcode + 'if(' +  workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + '){\n';
  while(1){
    if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
      ifTimes++;
    }
    if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf){
      break;
    }else if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
      repeatTimes--;
      for(var i = 0;i < repeatTimes;i++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + '}else{<br>';
      textcode = textcode + '}else{\n';
      repeatTimes++;
      if(ifTimes == 2){
        onlyIf = 1;
        nextPosition++;
        continue;
      }else if(ifTimes == 3){
        nextPosition++;
        break;
      }
    }
    //console.log(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type);
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        selectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        selectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        selectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        selectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        selectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = loopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes,nextPosition,true);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment_sw(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  repeatTimes++;
  code = code + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
  textcode = textcode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        selectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        selectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        selectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        selectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        selectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = loopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  code = code + '}<br>';
  textcode = textcode + '}\n';
  return nextPosition;
}

function judgment_case(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  repeatTimes++;
  code = code + 'case \'' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '\':<br>';
  textcode = textcode + 'case \'' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '\':\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        selectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        selectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        selectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        selectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        selectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = loopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes,nextPosition);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  return nextPosition;
}

function judgment_default(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    code = code + '&nbsp&nbsp&nbsp&nbsp';
    textcode = textcode + '    ';
  }
  repeatTimes++;
  code = code + 'default:<br>';
  textcode = textcode + 'default:\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'step();<br>';
        textcode = textcode + 'step();\n';
        break;
      case 'block_turn_right':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'turnRight();<br>';
        textcode = textcode + 'turnRight();\n';
        break;
      case 'block_turn_left':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'turnLeft();<br>';
        textcode = textcode + 'turnLeft();\n';
        break;
      case 'block_fire':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'fire();<br>';
        textcode = textcode + 'fire();\n';
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textcode = textcode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_break':
        for(var j = 0; j < repeatTimes; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + 'break;<br>';
        textcode = textcode + 'break;\n';
        break;
      case 'block_call':
        for(var j = 0; j < x; j++){
          code = code + '&nbsp&nbsp&nbsp&nbsp';
          textcode = textcode + '    ';
        }
        code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = loopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = judgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = judgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = judgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = judgment_default(repeatTimes,nextPosition);
        break;
      case 'block_switch':
        nextPosition = judgment_sw(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  return nextPosition;
}

function selectionType(type,x){
  switch (type){
    case 'block_step':
      for(var j = 0; j < x; j++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + 'step();<br>';
      textcode = textcode + 'step();\n';
      break;
    case 'block_turn_right':
      for(var j = 0; j < x; j++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + 'turnRight();<br>';
      textcode = textcode + 'turnRight();\n';
      break;
    case 'block_turn_left':
      for(var j = 0; j < x; j++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + 'turnLeft();<br>';
      textcode = textcode + 'turnLeft();\n';
      break;
    case 'block_fire':
      for(var j = 0; j < x; j++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + 'fire();<br>';
      textcode = textcode + 'fire();\n';
      break;
    case 'block_break':
      for(var j = 0; j < x; j++){
        code = code + '&nbsp&nbsp&nbsp&nbsp';
        textcode = textcode + '    ';
      }
      code = code + 'break;<br>';
      textcode = textcode + 'break;\n';
      break;
    }
}
//function函式區
function functionChange(repeatTimes,nowPosition){
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
  while(nextPosition < workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_.length){
    //console.log(nextPosition);
    try{
      workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type;
    }catch(err){
      break;
    }
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type){
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_var':
        for(var j = 0; j < x; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        var var0,var1,var2;
        var0 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[0].text_;
        var1 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_;
        var2 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_
        midFuncode = midFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';<br>';
        textMidFuncode = textMidFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes,nextPosition);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes,nextPosition);
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
        nextBlock = null;
    }
    nextPosition++;
  }
  for(var i=0;i<funLoopVar;i++){
    funLoop = funLoop + '&nbsp&nbsp&nbsp&nbspint var' + i + ' = 0;<br>';
    textFunLoop = textFunLoop + '    int var' + i + ' = 0;\n';
  }
  if(funTimes == 0){
    funcode = funLoop + funcode;
    textfuncode = textFunLoop + textMidFuncode;
  }else{
    funcode = funcode + funLoop;
    textfuncode = textfuncode + textFunLoop + textMidFuncode;
  }
  funcode = funcode + '}<br>';
  textfuncode = textfuncode + '}\n';
  //console.log(textfuncode);
  return nextPosition;
}

function funLoopChange(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
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
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment(repeatTimes,nowPosition,onlyIf){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  var ifTimes = 1;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  repeatTimes++;
  midFuncode = midFuncode + 'if(' +  workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + '){<br>';
  textMidFuncode = textMidFuncode + 'if(' +  workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + '){\n';
  while(1){
    if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
      ifTimes++;
    }
    if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf){
      break;
    }else if(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
      repeatTimes--;
      for(var i = 0;i < repeatTimes;i++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + '}else{<br>';
      textMidFuncode = textMidFuncode + '}else{\n';
      repeatTimes++;
      if(ifTimes == 2){
        onlyIf = 1;
        nextPosition++;
        continue;
      }else if(ifTimes == 3){
        nextPosition++;
        break;
      }
    }
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment_sw(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  repeatTimes++;
  midFuncode = midFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
  textMidFuncode = textMidFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  repeatTimes--;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  midFuncode = midFuncode + '}<br>';
  textMidFuncode = textMidFuncode + '}\n';
  return nextPosition;
}

function funJudgment_case(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  repeatTimes++;
  midFuncode = midFuncode + 'case \'' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '\':<br>';
  textMidFuncode = textMidFuncode + 'case \'' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '\':\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes,nextPosition);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  return nextPosition;
}

function funJudgment_default(repeatTimes,nowPosition){
  var nextPosition = nowPosition + 1;
  var thisPosition = nowPosition;
  for(var j = 0; j < repeatTimes; j++){
    midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
    textMidFuncode = textMidFuncode + '    ';
  }
  repeatTimes++;
  midFuncode = midFuncode + 'default:<br>';
  textMidFuncode = textMidFuncode + 'default:\n';
  while(workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id){
    switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
      case 'block_step':
        funSelectionType('block_step',repeatTimes);
        break;
      case 'block_turn_right':
        funSelectionType('block_turn_right',repeatTimes);
        break;
      case 'block_turn_left':
        funSelectionType('block_turn_left',repeatTimes);
        break;
      case 'block_fire':
        funSelectionType('block_fire',repeatTimes);
        break;
      case 'block_break':
        funSelectionType('block_break',repeatTimes);
        break;
      case 'block_printf':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");<br>';
        textMidFuncode = textMidFuncode + 'printf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '");\n';
        break;
      case 'block_call':
        for(var j = 0; j < repeatTimes; j++){
          midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
          textMidFuncode = textMidFuncode + '    ';
        }
        midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
        textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
        break;
      case 'block_loop':
        nextPosition = funLoopChange(repeatTimes,nextPosition);
        break;
      case 'block_if_else':
        nextPosition = funJudgment(repeatTimes,nextPosition,false);
        break;
      case 'block_if':
        nextPosition = funJudgment(repeatTimes,nextPosition,true);
        break;
      case 'block_case':
        nextPosition = funJudgment_case(repeatTimes,nextPosition);
        break;
      case 'block_default':
        nextPosition = funJudgment_default(repeatTimes,nextPosition);
        break;
      case 'block_switch':
        nextPosition = funJudgment_sw(repeatTimes,nextPosition);
        break;
      default:
        nextBlock = null;
    }
    nextPosition++;
  }
  return nextPosition;
}

function funSelectionType(type,x){
  switch (type){
    case 'block_step':
      for(var j = 0; j < x; j++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + 'step();<br>';
      textMidFuncode = textMidFuncode + 'step();\n';
      break;
    case 'block_turn_right':
      for(var j = 0; j < x; j++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + 'turnRight();<br>';
      textMidFuncode = textMidFuncode + 'turnRight();\n';
      break;
    case 'block_turn_left':
      for(var j = 0; j < x; j++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + 'turnLeft();<br>';
      textMidFuncode = textMidFuncode + 'turnLeft();\n';
      break;
    case 'block_fire':
      for(var j = 0; j < x; j++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + 'fire();<br>';
      textMidFuncode = textMidFuncode + 'fire();\n';
      break;
    case 'block_break':
      for(var j = 0; j < x; j++){
        midFuncode = midFuncode + '&nbsp&nbsp&nbsp&nbsp';
        textMidFuncode = textMidFuncode + '    ';
      }
      midFuncode = midFuncode + 'break;<br>';
      textMidFuncode = textMidFuncode + 'break;\n';
      break;
    }
}
