module.exports = {
    dict:
    {
        "code": [
            {   "level":1,
                "type": "動作",
                "element": [
                    {
                        "name": "moveForward(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp玩家載具(車、坦克、船)向前移動一格。",
                        "limit": 1
                    },
                    {
                        "name": "turnRight(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp玩家載具(車、坦克、船)順時針轉&nbsp90&nbsp度。",
                        "limit": 2
                    },
                    {
                        "name": "turnLeft(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp玩家載具(車、坦克、船)逆時針轉&nbsp90&nbsp度。",
                        "limit": 2
                    },
                    {
                        "name": "printf(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp輸出參數值、數字、字元、字串。範例如下：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出固定字串：printf(\"123\");<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出單一字元：printf(\"%c\",'A');<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出字串：printf(\"%s\",字串陣列名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出變數值：printf(變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出十進位整數：printf(\"%d\",變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸出浮點數：printf(\"%f\",變數名稱);",
                        "limit": 5
                    },
                    {
                        "name": "scanf(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp輸入整數、浮點數、字元等變數值，範例如下：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸入：scanf(\"輸入格式\",&變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸入字元：scanf(\"%c\",&字元變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸入整數：scanf(\"%d\",&整數變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸入浮點數：scanf(\"%f\",浮點數變數名稱);<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp輸入字串：scanf(\"%s\",字元陣列名稱);",
                        "limit": 6
                    },
                    {
                        "name": "fire(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp向前方發射子彈，攻擊距離為&nbsp2&nbsp格，攻擊力可於裝備內提升。",
                        "limit": 15
                    }
                ]
            },
            {
                "level":2,
                "type": "變數",
                "element": [
                    {
                        "name": "int 變數名稱",
                        "value": "&nbsp&nbsp&nbsp&nbsp宣告一個變數，型態為整數值。",
                        "limit": 6
                    },
                    {
                        "name": "char 變數名稱",
                        "value": "&nbsp&nbsp&nbsp&nbsp宣告一個變數，型態為字元。",
                        "limit": 6
                    }
                ]
            },
            {
                "level":3,
                "type": "函式",
                "element": [
                    {
                        "name": "main(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbspmain是主程式，是一個程式開始的地方與主體。",
                        "limit": 1
                    },
                    {
                        "name": "for(迴圈次數設定)",
                        "value": "&nbsp&nbsp&nbsp&nbsp用來創出一個迴圈，使用一個變數設定進入迴圈的條件，若未達成則跳出迴圈。使用方法如下：<br>for(參數初始值;進入迴圈條件;每跑一次迴圈後參數變化){欲執行指令}<br>--範例如下：<br>   int i=0;<br>   for(i=5;i>0;i++){...}",
                        "limit": 10
                    },
                    {
                        "name": "function&nbsp函式名稱(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp用來創出一個自訂函式。",
                        "limit": 17
                    }, {
                        "name": "void&nbsp函式名稱(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp建立一個自訂函式也稱作副程式，能夠自訂函式型態、函式名稱、函式內容。<br>自訂函式後，想呼叫自訂函式時，只需要直接打出函式名稱即可。<br>使用方法：<br>傳回值型態  函數名稱(參數一的型態  參數一的名稱, 參數二的型態  參數二的名稱, ....)<br>{<br>  變數宣告<br>  程式碼<br>  return  傳回值;<br>}<br>傳回值型態若為void則代表不會回傳任何數值。<br><br>範例1：<br>void ABC( ){<br> moveForward( );<br> moveForward( );<br>}<br>void main( ){<br> turnRight( );<br> turnRight( );<br> ABC( );<br>}<br>宣告一個自訂函式ABC，當呼叫ABC時會執行2次moveForward。<br>而整個程式執行後會是右轉兩次後前進兩格。<br><br>範例2：<br>int C(int a){<br> int b=5;<br> a=a+b;<br> return a;<br>}<br>void main( ){<br> int sum=2;<br> sum=C(sum);<br>}<br>宣告一個自訂函式C，當呼叫C時，需給C一個型態為int的變數，而C會將這個變數加上b的數值後傳回來。<br>整個程式執行後，sum的值將變為7。",
                        "limit": 17
                    }, {
                        "name": "call&nbspfunction&nbsp函式名稱(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp在Blockly模式中用來呼叫已創建的自訂函式。",
                        "limit": 17
                    },
                    {
                        "name": "becameCar(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp使載具變形為汽車。",
                        "limit": 27
                    },
                    {
                        "name": "becameTank(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp使載具變形為坦克。",
                        "limit": 27
                    },
                    {
                        "name": "becameShip(&nbsp)",
                        "value": "&nbsp&nbsp&nbsp&nbsp使載具變形為船。",
                        "limit": 27
                    },
                    {
                        "name": "getKeyArray(整數陣列名稱,陣列大小)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將密碼陣列存入給予的整數陣列中。用法：<br>&nbsp&nbsp&nbsp&nbspint&nbsparray[6];<br>&nbsp&nbsp&nbsp&nbspint&nbspsize=6;<br>&nbsp&nbsp&nbsp&nbspgetKeyArray(array,size);",
                        "limit": 31
                    },
                    {
                        "name": "getDistance(整數陣列名稱)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將距離陣列存入給予的整數陣列中，獲得的陣列內容代表的是每一段直線要走的距離。用法：<br>&nbsp&nbsp&nbsp&nbspint&nbspdist[10];<br>&nbsp&nbsp&nbsp&nbspgetDistance(dist);",
                        "limit": 33
                    },
                    {
                        "name": "getDirection(字元陣列名稱)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將方向陣列存入給予的字元陣列中，獲得的陣列內容代表的是每一次要做的動作。用法：<br>&nbsp&nbsp&nbsp&nbspchar&nbspdire[5];<br>&nbsp&nbsp&nbsp&nbspgetDistance(dire);<br><br>&nbsp&nbsp&nbsp&nbsp字元對應動作：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'L'：左轉<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'R'：右轉<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'F'：開火",
                        "limit": 34
                    },
                    {
                        "name": "getKey(整數變數位址x,整數變數位址y)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將密碼存入給予的2個整數變數中，給予兩個整數變數的位址，系統將自動給予數值。用法：<br>&nbsp&nbsp&nbsp&nbspint&nbspx,y;<br>&nbsp&nbsp&nbsp&nbspgetKey(&x,&y);",
                        "limit": 37
                    },
                    {
                        "name": "getBox(字元陣列名稱)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將寶箱裡所藏的字串存入給予字元陣列中。用法：<br>&nbsp&nbsp&nbsp&nbspchar&nbspstr[256];<br>&nbsp&nbsp&nbsp&nbspgetBox(str);",
                        "limit": 38
                    },
                    {
                        "name": "getString(字元陣列名稱)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將關卡給予的字串存入給予的字元陣列中，字串依照關卡不同所要做的動作也不同。用法：<br>&nbsp&nbsp&nbsp&nbspchar&nbspstr[256];<br>&nbsp&nbsp&nbsp&nbspgetString(str);",
                        "limit": 39
                    },
                    {
                        "name": "getMap(二維整數陣列名稱,地圖的長度)",
                        "value": "&nbsp&nbsp&nbsp&nbsp將代表關卡的數字地圖存入給予的二維陣列中，陣列裡的每個元素所代表的就是對應到的地圖資訊。用法：<br>&nbsp&nbsp&nbsp&nbspint&nbspmap[9][9];<br>&nbsp&nbsp&nbsp&nbspint&nbspsize=9;<br>&nbsp&nbsp&nbsp&nbspgetMap(map,size);<br><br>&nbsp&nbsp&nbsp&nbsp陣列數值對應地型：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp0：障礙物<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp1：草原<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp2：河流<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp3：沙漠<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp4：終點",
                        "limit": 39
                    }
                ]
            },
            {
                "level":4,
                "type": "判斷式",
                "element": [
                    {
                        "name": "if(條件){...}",
                        "value": "&nbsp&nbsp&nbsp&nbsp用來判斷是否達成條件，若達成條件則執行大括號內的指令。",
                        "limit": 7
                    },
                    {
                        "name": "if(條件){...}else{...}",
                        "value": "&nbsp&nbsp&nbsp&nbsp用來判斷是否達成條件，若達成條件則執行大括號內的指令，沒達成的話則執行else內的指令。",
                        "limit": 8
                    },
                    {
                        "name": "switch(條件參數){...}",
                        "value": "&nbsp&nbsp&nbsp&nbsp用來判斷多重選擇，以一個參數的值做為選擇的key，再用case來選擇執行指令，使用方法如下：<br>switch(關鍵參數名稱){<br>&nbsp&nbsp&nbsp&nbspcase&nbsp關鍵參數值：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp欲執行指令...<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase&nbsp關鍵參數值：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp欲執行指令...<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbsp...<br>}<br>--範例如下<br>switch(hint){<br>&nbsp&nbsp&nbsp&nbspcase&nbsp'R'：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnRight();<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbspcase&nbsp'L'：<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspturnLeft();<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbreak;<br>&nbsp&nbsp&nbsp&nbsp...<br>}",
                        "limit": 9
                    }
                ]
            }
        ]
    }
};