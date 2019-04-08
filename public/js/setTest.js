
     let MCQ = document.getElementById('MCQ');
    let YNQ = document.getElementById('YNQ');
    let FBQ = document.getElementById('FBQ');
    let PGQ = document.getElementById('PGQ');
    let changeTypeOfQution = function functionName(e) {
      console.log("onchange");
      if(e.value == "選擇題"){
        MCQ.style.cssText = "display:block";
        YNQ.style.cssText = "display:none";
        FBQ.style.cssText = "display:none";
        PGQ.style.cssText = "display:none";
      }
      else if(e.value == "是非題"){
        MCQ.style.cssText = "display:none";
        YNQ.style.cssText = "display:block";
        FBQ.style.cssText = "display:none";
        PGQ.style.cssText = "display:none";
      }
      else if(e.value == "填空題"){
        MCQ.style.cssText = "display:none";
        YNQ.style.cssText = "display:none";
        FBQ.style.cssText = "display:block";
        PGQ.style.cssText = "display:none";
      }
      else if(e.value == "程式題"){
        MCQ.style.cssText = "display:none";
        YNQ.style.cssText = "display:none";
        FBQ.style.cssText = "display:none";
        PGQ.style.cssText = "display:block";
      }
    }

    let QuationList = [];
    function updateCreatedQutionList(newQution){
      QuationList.push(newQution);
      updateQutionList();
    }
    function updateQutionList() {
      let QuationListDIV = document.getElementById('QuationList');
      QuationListDIV.innerHTML ="";
      let indexofQution = 0;
      QuationList.forEach(function(newQution){
        if (newQution.type == '選擇題') {
            // <div class="alert alert-warning alert-dismissible fade show" role="alert">
            //     <h5>題目類型：選擇題</h5>
            //     <h6>題目：我有10顆蘋果吃了兩顆請問還剩幾科</h6>
            //     <p>A:9顆 B:8顆 C:7顆 D:6顆</p>
            //     <p>正確答案:(B) 8顆</p>
            //     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            //         <span aria-hidden="true">&times;</span>
            //     </button>
            // </div>
            let div = document.createElement('div');
            div.className = 'alert alert-light alert-dismissible fade show mt-3';
            div.style.cssText = "color:black";
            div.setAttribute('onclick',`editQution(${indexofQution})`);
            let h5 = document.createElement('h5');
            h5.innerText = "題目類型：選擇題";
            let h6 = document.createElement('h6');
            h6.innerText = `題目：${newQution.qutionName}`;
            let p1 = document.createElement('div');
            p1.innerHTML+="<h6>選項：</h6>"
            for(let i = 0;i< newQution.selection.length;i++){
              p1.innerHTML+=`<div class="form-group row answer1">
                                <div class="col-sm-1 answer1-check-col">
                                    <i class="far fa-circle" style="padding:12px"></i>
                                </div>
                                <div class="col-sm-11">
                                    <input type="text" class="form-control input-border" disabled style="background:none" value=${newQution.selection[i]}>
                                </div>
                            </div>`
            }
            let p2 = document.createElement('p');
            let correctanswer = '未設定'
            if(newQution.correctAnswers.length!=0){
              correctanswer = "";
              for(let i = 0;i<newQution.correctAnswers.length;i++){
                correctanswer += newQution.correctAnswers[i];
                if(i<newQution.correctAnswers.length-1){
                  correctanswer+=" 與 "
                }
              }
            }
            p2.innerText = `正確答案：${correctanswer}`;
            let p3 = document.createElement('p');
            p3.innerText = '配分：' + newQution.score;
            let btn = document.createElement('button');
            btn.className = 'close';
            btn.setAttribute("data-dismiss", "alert");
            btn.setAttribute("aria-label", "Close");
            btn.setAttribute("onclick", `deleteQutioListItem(${indexofQution})`);

            let span = document.createElement('span');
            span.attributes = 'aria-hidden="true"';
            span.setAttribute("aria-hidden", "true");
            span.innerHTML = '&times;';
            btn.appendChild(span);
            div.appendChild(h5);
            div.appendChild(h6);
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p3);
            div.appendChild(btn);

            QuationListDIV.appendChild(div);
        }
        if (newQution.type == '是非題') {
            // <div class="alert alert-warning alert-dismissible fade show" role="alert">
            //     <h5>題目類型：是非題</h5>
            //     <h6>題目：我是不是一個帥哥？</h6>
            //     <p>正確答案:是</p>
            //     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            //         <span aria-hidden="true">&times;</span>
            //     </button>
            // </div>
            let div = document.createElement('div');
            div.className = 'alert alert-light alert-dismissible fade show mt-3';
            div.style.cssText = "color:black";
            div.setAttribute('onclick',`editQution(${indexofQution})`);
            let h5 = document.createElement('h5');
            h5.innerText = "題目類型：是非題";
            let h6 = document.createElement('h6');
            h6.innerText = `題目：${newQution.qutionName}`;
            let p = document.createElement('p');
            if (newQution.correctAnswers == 'yes') {
                p.innerHTML = '正確答案：是';
            }
            if (newQution.correctAnswers == 'no') {
                p.innerHTML = '正確答案：否';
            }
            let p3 = document.createElement('p');
            p3.innerText = '配分：' + newQution.score;
            let btn = document.createElement('button');
            btn.className = 'close';
            btn.setAttribute("data-dismiss", "alert");
            btn.setAttribute("aria-label", "Close");
            btn.setAttribute("onclick", `deleteQutioListItem(${indexofQution})`);

            let span = document.createElement('span');
            span.attributes = 'aria-hidden="true"';
            span.setAttribute("aria-hidden", "true");
            span.innerHTML = '&times;';
            btn.appendChild(span);
            div.appendChild(h5);
            div.appendChild(h6);
            div.appendChild(p);
            div.appendChild(p3);
            div.appendChild(btn);
            QuationListDIV.appendChild(div);

        }
        if (newQution.type == '填空題') {
            // <div class="alert alert-warning alert-dismissible fade show" role="alert">
            //     <h5>題目類型：填空題</h5>
            //     <h6>題目：請寫出這學期上這堂課之後的心得</h6>
            //     <p>正確答案:無設定正確答案</p>
            //     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            //         <span aria-hidden="true">&times;</span>
            //     </button>
            // </div>
            let div = document.createElement('div');
            div.className = 'alert alert-light alert-dismissible fade show mt-3';
            div.style.cssText = "color:black";
            div.setAttribute('onclick',`editQution(${indexofQution})`);
            let h5 = document.createElement('h5');
            h5.innerText = "題目類型：填空題";
            let h6 = document.createElement('h6');
            h6.innerText = `題目：${newQution.qutionName}`;
            let p = document.createElement('div');
            p.innerHTML+="<h6>答案：</h6>"
            for(let i = 0;i<newQution.correctAnswers.length;i++){
              let input = document.createElement('input');
              input.className = "form-control mb-1";
              input.value = newQution.correctAnswers[i];
              p.appendChild(input)
            }
            let p3 = document.createElement('p');
            p3.innerText = '配分：' + newQution.score;
            let btn = document.createElement('button');
            btn.className = 'close';
            btn.setAttribute("data-dismiss", "alert");
            btn.setAttribute("aria-label", "Close");
            btn.setAttribute("onclick", `deleteQutioListItem(${indexofQution})`);

            let span = document.createElement('span');
            span.attributes = 'aria-hidden="true"';
            span.setAttribute("aria-hidden", "true");
            span.innerHTML = '&times;';
            btn.appendChild(span);
            div.appendChild(h5);
            div.appendChild(h6);
            div.appendChild(p);
            div.appendChild(p3);
            div.appendChild(btn);
            QuationListDIV.appendChild(div);
        }
        if (newQution.type == '程式題') {
            //             div class="alert alert-warning alert-dismissible fade show" role="alert">
            //                 <h5>題目類型：程式題</h5>
            //                 <h6>題目：請用c語言print出下列圖形</h6>
            //                 <p>輸入說明:輸入一個n且為正整數</p>
            //                 <p>輸出說明:印出n階的三角形 註:不可直接印出此圖形</p>
            //                 <pre>範例輸入:3</pre>
            //                 <pre>範例輸出:
            // *
            // **
            // ***
            //                 </pre>

            //                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            //                     <span aria-hidden="true">&times;</span>
            //                 </button>
            let div = document.createElement('div');
            div.className = 'alert alert-light alert-dismissible fade show mt-3';
            div.style.cssText = "color:black";
            div.setAttribute('onclick',`editQution(${indexofQution})`);
            let h5 = document.createElement('h5');
            h5.innerText = "題目類型：程式題";
            let h6 = document.createElement('h6');
            h6.innerText = `題目：${newQution.qutionName}`;
            let p1 = document.createElement('p');
            p1.innerHTML = `輸入說明：${newQution.inputDescription}`;
            let p2 = document.createElement('p');
            p2.innerHTML = `輸出說明：${newQution.outputDescription}`;
            let p3 = document.createElement('pre');
            p3.innerHTML = `輸入範例：\n${newQution.inputExample}`;
            let p4 = document.createElement('pre');
            p4.innerHTML = `輸出範例：\n${newQution.outputExample}`;
            let btn = document.createElement('button');
            let p5 = document.createElement('p');
            p5.innerText = '配分：' + newQution.score;
            btn.className = 'close';
            // btn.attributes = 'data-dismiss="alert" aria-label="Close" qutionID=' + QuationList.length - 1;
            btn.setAttribute("data-dismiss", "alert");
            btn.setAttribute("aria-label", "Close");
            btn.setAttribute("onclick", `deleteQutioListItem(${indexofQution})`);

            let span = document.createElement('span');
            span.attributes = 'aria-hidden="true"';
            span.setAttribute("aria-hidden", "true");
            span.innerHTML = '&times;';
            btn.appendChild(span);
            div.appendChild(h5);
            div.appendChild(h6);
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p3);
            div.appendChild(p4);
            div.appendChild(p5);
            div.appendChild(btn);
            QuationListDIV.appendChild(div);
        }
        indexofQution+=1;
      })
    }
    function editQution(id){
      console.log(QuationList[id]);
      if(QuationList[id].type == "選擇題"){
        editMCQ(QuationList[id],id);
        changeTypeOfQution({value:"選擇題"})
      }
      if(QuationList[id].type == "是非題"){
        editYNQ(QuationList[id],id);
        changeTypeOfQution({value:"是非題"})
      }
      if(QuationList[id].type == "填空題"){
        editFBQ(QuationList[id],id);
        changeTypeOfQution({value:"填空題"})
      }
      if(QuationList[id].type == "程式題"){
        editPGQ(QuationList[id],id);
        changeTypeOfQution({value:"程式題"})
      }
    }

    function deleteQutioListItem(id) {
        QuationList[id] = '';
        console.log(QuationList);
    }

    //這邊要從原本的存新的一個測驗變成更新這篇測驗
    function saveQutionList() {
        QuationList = QuationList.filter(list => list != '');
        let testName = document.getElementById('testNameinput');
        let publicTime =new Date(document.getElementById('publicTime').value);
        let EndpublicTime = new Date(document.getElementById('EndpublicTime').value)
        let publishScoreNow = document.getElementById('publishScoreNow').checked;
        let canCheckQuestionAndAnswer = document.getElementById('canCheckQuestionAndAnswer').checked;
        // let today = new Date();
        // var timeDiff = (publicTime.getTime() - today.getTime())/1000;
        // console.log(timeDiff);
        
        let testinfo = {
            testName: testName.value,
            QuationList: QuationList,
            publicTime:publicTime,
            EndpublicTime:EndpublicTime,
            isPublic:false,
            publishScoreNow:publishScoreNow,
            canCheckQuestionAndAnswer:canCheckQuestionAndAnswer
        }
        console.log(testinfo);
        
        //TODO
        //傳到伺服器存起來
        
      
        $.ajax({
            url: '/class/saveTest/' + Test._id,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(testinfo),
            dataType: 'json',
            success: function (response) {
                alert('儲存成功');
                window.location.href = '/class/showTest/'+Test._id
            },
            error: function (err) {
                alert('錯誤訊息：' + err.responseJSON.msg);
            }
        });
    
    }
