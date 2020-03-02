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
var map = {
    'textSpacing': '    ',
    'spacing': '&nbsp&nbsp&nbsp&nbsp',
    'main': 'int main(int argc,char* argv[]){',
    'var': 'int i',
    'moveForward': 'moveForward();',
    'turnRight': 'turnRight();',
    'turnLeft': 'turnLeft();',
    'fire': 'fire();',
    'printL': 'printf("',
    'printR': '");',
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
        frontcode = frontcode + map.main + '<br>';
        frontTextcode = frontTextcode + map.main + '\n';
        code = code + map.spacing + 'return 0;<br>}';
        textcode = textcode + map.textSpacing + 'return 0;\n}';
        for (var i = 0; i < loopVariable; i++) {
            frontcode = frontcode + map.spacing + map.var+i + ' = 0;<br>';
            frontTextcode = frontTextcode + map.textSpacing + map.var+i + ' = 0;\n';
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
            case 'block_moveForward':
                selectionType('block_moveForward', x);
                break;
            case 'block_turn_right':
                selectionType('block_turn_right', x);
                break;
            case 'block_turn_left':
                selectionType('block_turn_left', x);
                break;
            case 'block_fire':
                selectionType('block_fire', x);
                break;
            case 'block_break':
                selectionType('block_break', x);
                break;
            case 'block_var':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                var var0, var1, var2;
                var0 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[0].text_;
                var1 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_;
                var2 = workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_
                code = code + var0 + ' ' + var1 + '=' + var2 + ';<br>';
                textcode = textcode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
                break;
            case 'block_printf':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_scanf':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + 'scanf("' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');<br>';
                textcode = textcode + 'scanf("' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(nowBlock).inputList[0].fieldRow[3].text_ + ');\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
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
            case 'block_moveForward':
                selectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                selectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                selectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                selectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                selectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_scanf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + 'scanf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + 'scanf("' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '();\n';
                break;
            case 'block_loop':
                nextPosition = loopChange(repeatTimes, nextPosition);
                break;
            case 'block_if_else':
                nextPosition = judgment(repeatTimes, nextPosition, false);
                break;
            case 'block_if':
                nextPosition = judgment(repeatTimes, nextPosition, true);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
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
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    repeatTimes++;
    code = code + map.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.ifR + '<br>';
    textcode = textcode + map.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.ifR + '\n';
    while (1) {
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
            ifTimes++;
        }
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf) {
            break;
        } else if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
            repeatTimes--;
            for (var i = 0; i < repeatTimes; i++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
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
            case 'block_moveForward':
                selectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                selectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                selectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                selectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                selectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
                break;
            case 'block_loop':
                nextPosition = loopChange(repeatTimes, nextPosition);
                break;
            case 'block_if_else':
                nextPosition = judgment(repeatTimes, nextPosition, false);
                break;
            case 'block_if':
                nextPosition = judgment(repeatTimes, nextPosition, true);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    code = code + '}<br>';
    textcode = textcode + '}\n';
    return nextPosition;
}

function judgment_sw(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    repeatTimes++;
    code = code + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
    textcode = textcode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                selectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                selectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                selectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                selectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                selectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
                break;
            case 'block_loop':
                nextPosition = loopChange(repeatTimes, nextPosition);
                break;
            case 'block_if_else':
                nextPosition = judgment(repeatTimes, nextPosition, false);
                break;
            case 'block_if':
                nextPosition = judgment(repeatTimes, nextPosition, true);
                break;
            case 'block_case':
                nextPosition = judgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = judgment_default(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    code = code + '}<br>';
    textcode = textcode + '}\n';
    return nextPosition;
}

function judgment_case(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    repeatTimes++;
    code = code + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':<br>';
    textcode = textcode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                selectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                selectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                selectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                selectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                selectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
                break;
            case 'block_loop':
                nextPosition = loopChange(repeatTimes, nextPosition);
                break;
            case 'block_if_else':
                nextPosition = judgment(repeatTimes, nextPosition, false);
                break;
            case 'block_if':
                nextPosition = judgment(repeatTimes, nextPosition, true);
                break;
            case 'block_case':
                nextPosition = judgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = judgment_default(repeatTimes, nextPosition);
                break;
            case 'block_switch':
                nextPosition = judgment_sw(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    return nextPosition;
}

function judgment_default(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        code = code + map.spacing;
        textcode = textcode + map.textSpacing;
    }
    repeatTimes++;
    code = code + 'default:<br>';
    textcode = textcode + 'default:\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.moveForward + '<br>';
                textcode = textcode + map.moveForward + '\n';
                break;
            case 'block_turn_right':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.turnRight + '<br>';
                textcode = textcode + map.turnRight + '\n';
                break;
            case 'block_turn_left':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.turnLeft + '<br>';
                textcode = textcode + map.turnLeft + '\n';
                break;
            case 'block_fire':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.fire + '<br>';
                textcode = textcode + map.fire + '\n';
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textcode = textcode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_break':
                for (var j = 0; j < repeatTimes; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + map.break+'<br>';
                textcode = textcode + map.break+'\n';
                break;
            case 'block_call':
                for (var j = 0; j < x; j++) {
                    code = code + map.spacing;
                    textcode = textcode + map.textSpacing;
                }
                code = code + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textcode = textcode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
                break;
            case 'block_loop':
                nextPosition = loopChange(repeatTimes, nextPosition);
                break;
            case 'block_if_else':
                nextPosition = judgment(repeatTimes, nextPosition, false);
                break;
            case 'block_if':
                nextPosition = judgment(repeatTimes, nextPosition, true);
                break;
            case 'block_case':
                nextPosition = judgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = judgment_default(repeatTimes, nextPosition);
                break;
            case 'block_switch':
                nextPosition = judgment_sw(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    return nextPosition;
}

function selectionType(type, x) {
    switch (type) {
        case 'block_moveForward':
            for (var j = 0; j < x; j++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
            }
            code = code + map.moveForward + '<br>';
            textcode = textcode + map.moveForward + '\n';
            break;
        case 'block_turn_right':
            for (var j = 0; j < x; j++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
            }
            code = code + map.turnRight + '<br>';
            textcode = textcode + map.turnRight + '\n';
            break;
        case 'block_turn_left':
            for (var j = 0; j < x; j++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
            }
            code = code + map.turnLeft + '<br>';
            textcode = textcode + map.turnLeft + '\n';
            break;
        case 'block_fire':
            for (var j = 0; j < x; j++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
            }
            code = code + map.fire + '<br>';
            textcode = textcode + map.fire + '\n';
            break;
        case 'block_break':
            for (var j = 0; j < x; j++) {
                code = code + map.spacing;
                textcode = textcode + map.textSpacing;
            }
            code = code + map.break+'<br>';
            textcode = textcode + map.break+'\n';
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
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_var':
                for (var j = 0; j < x; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                var var0, var1, var2;
                var0 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[0].text_;
                var1 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[1].text_;
                var2 = workspace.getBlockById(nowBlock).childBlocks_[0].inputList[0].fieldRow[3].text_;
                midFuncode = midFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';<br>';
                textMidFuncode = textMidFuncode + var0 + ' ' + var1 + ' = ' + var2 + ';\n';
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            case 'block_case':
                nextPosition = funJudgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = funJudgment_default(repeatTimes, nextPosition);
                break;
            case 'block_switch':
                nextPosition = funJudgment_sw(repeatTimes, nextPosition);
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
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
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
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
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
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    repeatTimes++;
    midFuncode = midFuncode + map.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.ifR + '<br>';
    textMidFuncode = textMidFuncode + map.ifL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.ifR + '\n';
    while (1) {
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
            ifTimes++;
        }
        if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id && onlyIf) {
            break;
        } else if (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id == workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
            repeatTimes--;
            for (var i = 0; i < repeatTimes; i++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
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
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    midFuncode = midFuncode + '}<br>';
    textMidFuncode = textMidFuncode + '}\n';
    return nextPosition;
}

function funJudgment_sw(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    repeatTimes++;
    midFuncode = midFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){<br>';
    textMidFuncode = textMidFuncode + 'switch(' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '){\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            case 'block_case':
                nextPosition = funJudgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = funJudgment_default(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    repeatTimes--;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    midFuncode = midFuncode + '}<br>';
    textMidFuncode = textMidFuncode + '}\n';
    return nextPosition;
}

function funJudgment_case(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    repeatTimes++;
    midFuncode = midFuncode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':<br>';
    textMidFuncode = textMidFuncode + 'case ' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nowPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + ':\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printL + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printL + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            case 'block_case':
                nextPosition = funJudgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = funJudgment_default(repeatTimes, nextPosition);
                break;
            case 'block_switch':
                nextPosition = funJudgment_sw(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    return nextPosition;
}

function funJudgment_default(repeatTimes, nowPosition) {
    var nextPosition = nowPosition + 1;
    var thisPosition = nowPosition;
    for (var j = 0; j < repeatTimes; j++) {
        midFuncode = midFuncode + map.spacing;
        textMidFuncode = textMidFuncode + map.textSpacing;
    }
    repeatTimes++;
    midFuncode = midFuncode + 'default:<br>';
    textMidFuncode = textMidFuncode + 'default:\n';
    while (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[thisPosition].sourceBlock_.id != workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.id) {
        switch (workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.type) {
            case 'block_moveForward':
                funSelectionType('block_moveForward', repeatTimes);
                break;
            case 'block_turn_right':
                funSelectionType('block_turn_right', repeatTimes);
                break;
            case 'block_turn_left':
                funSelectionType('block_turn_left', repeatTimes);
                break;
            case 'block_fire':
                funSelectionType('block_fire', repeatTimes);
                break;
            case 'block_break':
                funSelectionType('block_break', repeatTimes);
                break;
            case 'block_printf':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + map.printR + '\n';
                break;
            case 'block_printf2':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '<br>';
                textMidFuncode = textMidFuncode + map.printL + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[1].text_ + '",' + workspace.getBlockById(mainBlock).childBlocks_[0].previousConnection.dbOpposite_[nextPosition].sourceBlock_.inputList[0].fieldRow[2].text_ + map.printR + '\n';
                break;
            case 'block_call':
                for (var j = 0; j < repeatTimes; j++) {
                    midFuncode = midFuncode + map.spacing;
                    textMidFuncode = textMidFuncode + map.textSpacing;
                }
                midFuncode = midFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();<br>';
                textMidFuncode = textMidFuncode + workspace.getBlockById(nowBlock).inputList[0].fieldRow[1].text_ + '();\n';
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
            case 'block_case':
                nextPosition = funJudgment_case(repeatTimes, nextPosition);
                break;
            case 'block_default':
                nextPosition = funJudgment_default(repeatTimes, nextPosition);
                break;
            case 'block_switch':
                nextPosition = funJudgment_sw(repeatTimes, nextPosition);
                break;
            default:
                nextBlock = null;
        }
        nextPosition++;
    }
    return nextPosition;
}

function funSelectionType(type, x) {
    switch (type) {
        case 'block_moveForward':
            for (var j = 0; j < x; j++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
            }
            midFuncode = midFuncode + map.moveForward + '<br>';
            textMidFuncode = textMidFuncode + map.moveForward + '\n';
            break;
        case 'block_turn_right':
            for (var j = 0; j < x; j++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
            }
            midFuncode = midFuncode + map.turnRight + '<br>';
            textMidFuncode = textMidFuncode + map.turnRight + '\n';
            break;
        case 'block_turn_left':
            for (var j = 0; j < x; j++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
            }
            midFuncode = midFuncode + map.turnLeft + '<br>';
            textMidFuncode = textMidFuncode + map.turnLeft + '\n';
            break;
        case 'block_fire':
            for (var j = 0; j < x; j++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
            }
            midFuncode = midFuncode + map.fire + '<br>';
            textMidFuncode = textMidFuncode + map.fire + '\n';
            break;
        case 'block_break':
            for (var j = 0; j < x; j++) {
                midFuncode = midFuncode + map.spacing;
                textMidFuncode = textMidFuncode + map.textSpacing;
            }
            midFuncode = midFuncode + map.break+'<br>';
            textMidFuncode = textMidFuncode + map.break+'\n';
            break;
    }
}