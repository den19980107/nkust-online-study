var divTag, dictionaryData, firstIntoThis = true;

//創建更改裝備Table
function modifyEquipment() {
  var equipmentData = getEquipmentData();
  document.getElementById("allTitle").innerHTML = "裝備等級表";
  divTag = document.getElementById("equipageTable");
  divTag.innerHTML = "";
  document.getElementById("modifyEquipageView").style.display = "none";
  //i是代表16行，j是代表4個欄位
  for (var i = 0; i < 17; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 4; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      b.setAttribute("class", "modifyEquipmentTd" + j);
      divTag.appendChild(b);
      if (i == 0) {
        divTag = document.getElementById("row" + i + "col" + j);
        divTag.style.background = "#EBB76F";
        b = document.createElement("span");
        switch (j) {
          case 0:
            b.setAttribute("id", "levelTitle");
            b.innerHTML = "等級";
            break;
          case 1:
            b.setAttribute("id", "swordTitle");
            b.innerHTML = "武器數值";
            break;
          case 2:
            b.setAttribute("id", "shieldTitle");
            b.innerHTML = "護甲數值";
            break;
          case 3:
            b.setAttribute("id", "conditionTitle");
            b.innerHTML = "升級條件";
            break;
        }
        divTag.appendChild(b);
      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        if (j == 0) {
          divTag.style.background = "#EBB76F";
          b = document.createElement("span");
          b.setAttribute("id", "levelTitle");
          b.innerHTML = "lv" + (i - 1);
          divTag.appendChild(b);
        } else {
          divTag.style.background = "#FFDEB8";
          b = document.createElement("input");
          b.setAttribute("type", "text")
          b.setAttribute("class", "modifyEquipmentInput");
          switch (j) {
            case 1:
              b.setAttribute("id", "swordValue" + i);
              break;
            case 2:
              b.setAttribute("id", "shieldValue" + i);
              break;
            case 3:
              b.setAttribute("id", "conditionValue" + i);
              break;
          }
          if (i < 12) {
            switch (j) {
              case 1:
                b.value = equipmentData.weaponLevel[i - 1].attack;
                break;
              case 2:
                b.value = equipmentData.armorLevel[i - 1].attack;
                break;
              case 3:
                b.value = equipmentData.levelUpLevel[i - 1].star;
                break;
            }
          } else {
            if (j == 3) {
              b.value = equipmentData.levelUpLevel[i - 1].star;
            } else {
              b.value = "X";
              b.setAttribute("readonly", "true");
            }
          }
          divTag.appendChild(b);
        }
      }
    }
    divTag = document.getElementById("equipageTable");
  }
  var resetEquipageLevel = document.getElementById("resetEquipageLevel")
  resetEquipageLevel.setAttribute("value", "取消");
  resetEquipageLevel.setAttribute("class", "resetBtn");
  resetEquipageLevel.setAttribute("onclick", "resetTableToOriginal(this)");
  divTag = document.getElementById("equipageView");
  b = document.createElement("input");
  b.setAttribute("type", "button");
  b.setAttribute("id", "saveBtn");
  b.setAttribute("class", "saveBtn");
  b.setAttribute("value", "儲存");
  b.setAttribute("onclick", "saveEquipment()");
  divTag.appendChild(b);
}

//儲存更改後的資料
function saveEquipment() {
  var levelUpLevel = [],
    weaponLevel = [],
    armorLevel = [];
  for (var i = 1; i < 17; i++) {
    for (var j = 1; j < 4; j++) {
      switch (j) {
        case 1:
          divTag = document.getElementById("swordValue" + i);
          // armorLevel.push(divTag.value);
          if (i < 12) {
            weaponLevel.push({
              level: i - 1,
              attack: parseInt(divTag.value)
            });
          }

          break;
        case 2:
          divTag = document.getElementById("shieldValue" + i);
          // weaponLevel.push(divTag.value);
          if (i < 12) {
            armorLevel.push({
              level: i - 1,
              attack: parseInt(divTag.value)
            });
          }
          break;
        case 3:
          divTag = document.getElementById("conditionValue" + i);
          // levelUpLevel.push(divTag.value);
          levelUpLevel.push({
            level: i - 1,
            star: parseInt(divTag.value)
          });
          break;
      }
    }
  }
  equipmentData.armorLevel = armorLevel;
  equipmentData.weaponLevel = weaponLevel;
  equipmentData.levelUpLevel = levelUpLevel;
  var seri = {
    armorLevel: armorLevel,
    weaponLevel: weaponLevel,
    levelUpLevel: levelUpLevel
  }

  var scriptData = {
    type: "updateEquip",
    seriJson: JSON.stringify(seri)
  }
  $.ajax({
    url: href, // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    data: scriptData, // 將表單資料用打包起來送出去
    success: function(res) {
      remindView("儲存成功");
    }
  })
  // console.log(armorLevel);
  // console.log(weaponLevel);
  // console.log(levelUpLevel);
  //將表格清0並重建，請在這之前做儲存資料之動作
  resetTableToOriginal();
}

//將Table變回原來的Table
function resetTableToOriginal() {
  document.getElementById("allTitle").innerHTML = "裝備";
  document.getElementById("modifyEquipageView").style.display = "";
  divTag = document.getElementById("equipageTable");
  divTag.innerHTML = "";
  for (var i = 0; i < 2; i++) {
    b = document.createElement("tr");
    b.setAttribute("id", "tr" + i);
    divTag.appendChild(b);
    for (var j = 0; j < 3; j++) {
      divTag = document.getElementById("tr" + i);
      b = document.createElement("td");
      b.setAttribute("id", "row" + i + "col" + j);
      divTag.appendChild(b);
      if (j == 0) {
        if (i == 0) {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "swordImg");
          b.setAttribute("src", "img/sword.png");
          divTag.appendChild(b);
        } else {
          divTag = document.getElementById("row" + i + "col" + j);
          b = document.createElement("img");
          b.setAttribute("id", "shieldImg");
          b.setAttribute("src", "img/shield.png");
          divTag.appendChild(b);
        }
      } else if (j == 1) {
        divTag = document.getElementById("row" + i + "col" + j);
        b = document.createElement("div");
        if (i == 0) {
          b.setAttribute("id", "swordLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "swordLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("swordLevelUpDivH3").innerHTML = "";
        } else {
          b.setAttribute("id", "shieldLevelUpDiv");
          divTag.appendChild(b);
          b = document.createElement("h3");
          b.setAttribute("id", "shieldLevelUpDivH3");
          divTag.appendChild(b);
          document.getElementById("shieldLevelUpDivH3").innerHTML = "";
        }
      } else {
        divTag = document.getElementById("row" + i + "col" + j);
        /*b = document.createElement("input");
        b.setAttribute("type","button");
        b.setAttribute("id","levelUp" + i);
        b.setAttribute("value","升級");*/
        b = document.createElement("button");
        b.setAttribute("id", "levelUpDefault" + i);
        if (i == 0) {
          b.setAttribute("onclick", "swordLevelUp()");
          b.setAttribute("class", "levelUpDefault");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        } else {
          b.setAttribute("onclick", "shieldLevelUp()");
          b.setAttribute("class", "levelUp");
          divTag.appendChild(b);
          document.getElementById("levelUpDefault" + i).innerHTML = "升級";
          divTag = document.getElementById("levelUpDefault" + i);
          b = document.createElement("br");
          divTag.appendChild(b);
          b = document.createElement("img");
          b.setAttribute("id", "levelUpImg");
          divTag.appendChild(b);
          b = document.createElement("font");
          b.setAttribute("id", "levelUpFont" + i);
          b.setAttribute("class", "levelUpFont");
          divTag.appendChild(b);
          document.getElementById("levelUpFont" + i).innerHTML = "";
        }
      }
    }
    divTag = document.getElementById("equipageTable");
  }

  for (var i = 0; i < 2; i++) {
    if (i == 0) {
      divTag = document.getElementById("swordLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "swordLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("swordLevelUpTable");
    } else {
      divTag = document.getElementById("shieldLevelUpDiv");
      b = document.createElement("table");
      b.setAttribute("id", "shieldLevelUpTable");
      b.setAttribute("rules", "rows");
      divTag.appendChild(b);
      divTag = document.getElementById("shieldLevelUpTable");
    }
    for (var j = 0; j < 10; j++) {
      b = document.createElement("td");
      divTag.appendChild(b);
      b = document.createElement("div");
      if (i == 0) {
        b.setAttribute("id", "swordLevelUpinnerDiv" + j);
      } else {
        b.setAttribute("id", "shieldLevelUpinnerDiv" + j);
      }

      if (j == 0) {
        b.setAttribute("class", "levelFont");
      } else if (j == 9) {
        b.setAttribute("class", "levelLaterDefault");
      } else {
        b.setAttribute("class", "levelDefault");
      }
      divTag.appendChild(b);
    }
  }

  for (var li = 0; li < equipmentData.weaponLevel.length && li < 10; ++li) {
    var temp = document.getElementById("swordLevelUpinnerDiv" + li);
    if (li < swordLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    } else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  for (var li = 0; li < equipmentData.armorLevel.length && li < 10; ++li) {
    var temp = document.getElementById("shieldLevelUpinnerDiv" + li);
    if (li < shieldLevel) {
      if (li == 0) {
        temp.className = "levelFont";
      } else if (li == 9) {
        temp.className = "levelLater";
      } else {
        temp.className = "levelChange";
      }
    } else {
      if (li == 0) {
        temp.className = "levelFontDefault";
      } else if (li == 9) {
        temp.className = "levelLaterDefault";
      } else {
        temp.className = "levelDefault";
      }
    }
  }
  var swordmaxFlag = false,
    shiledmaxFlag = false;
  if ((swordLevel + shieldLevel) >= 15) {
    if (swordLevel == 10) {
      document.getElementById("levelUpDefault0").innerHTML = "";
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿"
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    } else if (shieldLevel == 10) {
      document.getElementById("levelUpDefault1").innerHTML = "";
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
    } else {
      var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
      document.getElementById("swordLevelUpDivH3").innerHTML = text;
      var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
      document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    }
    document.getElementById("levelUpDefault0").innerHTML = "";
    // document.getElementById("levelUpDefault0").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault1").innerHTML = "";
    // document.getElementById("levelUpDefault1").innerHTML = "已達<br>上限";
    document.getElementById("levelUpDefault0").className = "levelUpDefault2";
    document.getElementById("levelUpDefault1").className = "levelUpDefault2";
  } else if (swordLevel == 10) {
    document.getElementById("levelUpDefault0").innerHTML = "";
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + "  等級已升到最滿";
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont1").innerHTML = text;
    // document.getElementById("levelUpDefault0").innerHTML = "最高<br>等級";

    if (star <= user.starNum) {
      // console.log("重製失敗");
      document.getElementById("levelUpDefault0").className = "highestLevel";
      document.getElementById("levelUpDefault1").className = "levelUp";
    } else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  } else if (shieldLevel == 10) {
    document.getElementById("levelUpDefault1").innerHTML = "";
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + "  等級已升到最滿";
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;

    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    // document.getElementById("levelUpDefault1").innerHTML = "最高<br>等級";
    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "highestLevel";
    } else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  } else {
    var text = "攻擊力：" + equipmentData.weaponLevel[swordLevel].attack + " &nbsp 下一級為：" + equipmentData.weaponLevel[swordLevel + 1].attack;
    document.getElementById("swordLevelUpDivH3").innerHTML = text;
    var text = "防禦力：" + equipmentData.armorLevel[shieldLevel].attack + " &nbsp 下一級為：" + equipmentData.armorLevel[shieldLevel + 1].attack;
    document.getElementById("shieldLevelUpDivH3").innerHTML = text;
    var star = equipmentData.levelUpLevel[levelUpLevel].star;
    var text = "x" + star;
    document.getElementById("levelUpFont0").innerHTML = text;
    document.getElementById("levelUpFont1").innerHTML = text;

    if (star <= user.starNum) {
      document.getElementById("levelUpDefault0").className = "levelUp";
      document.getElementById("levelUpDefault1").className = "levelUp";
    } else {
      document.getElementById("levelUpDefault0").className = "levelUpDefault";
      document.getElementById("levelUpDefault1").className = "levelUpDefault";
    }
  }
  document.getElementById("resetEquipageLevel").value = "重置升級";
  document.getElementById("resetEquipageLevel").className = "resetEquipageLevel";
  resetEquipageLevel.setAttribute("onclick", "resetEquipClick(this)");
  var divTag = document.getElementById("saveBtn");
  try {
    parentObj = divTag.parentNode;
    parentObj.removeChild(divTag);
  } catch (e) {}
}

//修改指令大全
function modifyInstruction(modifyNumber) {
  if (firstIntoThis) {
    dictionaryData = getJson();
    firstIntoThis = false;
  }
  var dic = dictionaryData.code;
  let trNumber = parseInt(modifyNumber) + 1;
  let subLength = parseInt(document.getElementById("actionDiv" + trNumber).getElementsByTagName("details").length);
  var li = dic[parseInt(trNumber / 2)].element;
  for (var i = 0; i < subLength; i++) {
    divTag = document.getElementById("detailsInner" + trNumber + i);
    divTag.innerHTML = "";

    b = document.createElement("summary");
    b.setAttribute("id", "summaryInner" + trNumber + i);
    b.setAttribute("class", "summaryInner");
    divTag.appendChild(b);
    document.getElementById("summaryInner" + trNumber + i).innerHTML = li[i].name;

    // var transformVal = "    " + li[i].value.replace(/&nbsp/g, " "),temp;
    var transformVal = li[i].value.replace(/&nbsp/g, " "),
      temp;
    transformVal = transformVal.replace(/<br>/g, "\n");
    b = document.createElement("textarea");
    b.setAttribute("id", "item" + trNumber + i);
    b.setAttribute("class", "itemTextarea");
    b.setAttribute("row", "5");
    b.style.background = "rgba(255, 255, 255, 0.29)";
    b.innerHTML = transformVal;
    divTag.appendChild(b);

    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "resetBtn");
    b.setAttribute("class", "resetBtnToIt");
    b.setAttribute("value", "取消");
    b.setAttribute("onclick", "resetInstruction(" + trNumber + "," + i + ")");
    divTag.appendChild(b);
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "saveBtn");
    b.setAttribute("class", "saveBtnToIt");
    b.setAttribute("value", "儲存");
    b.setAttribute("onclick", "saveInstruction(" + trNumber + "," + i + ")");
    divTag.appendChild(b);
  }
}

//儲存更改後的資料函式
function saveInstruction(trNumber, tdNumber) {
  var transformVal = document.getElementById("item" + trNumber + tdNumber).value.replace(/ /g, "&nbsp");
  transformVal = transformVal.replace(/\n/g, "<br>"); //處理完成的字串，可直接存起來
  // console.log(trNumber,tdNumber);
  var data = dictionaryData.code[parseInt((trNumber - 1) / 2)];
  data.element[tdNumber].value = transformVal;
  var scriptData = {
    type: "updateDict",
    dictType: data.type,
    dictNum: tdNumber,
    dictValue: transformVal
  }
  $.ajax({
    url: href, // 要傳送的頁面
    method: 'POST', // 使用 POST 方法傳送請求
    dataType: 'json', // 回傳資料會是 json 格式
    data: scriptData, // 將表單資料用打包起來送出去
    success: function(res) {
      remindView("儲存成功");
    }
  })
  // console.log(transformVal);
  //將表格清0並重建，請在這之前做儲存資料之動作
  //resetInstruction(trNumber,tdNumber);
}

function resetInstruction(trNumber, tdNumber) {
  var dic = dictionaryData.code;
  var li = dic[parseInt(trNumber / 2)].element;
  divTag = document.getElementById("item" + trNumber + tdNumber);
  divTag.value = "";
  var transformVal = li[tdNumber].value.replace(/&nbsp/g, " ");
  transformVal = transformVal.replace(/<br>/g, "\n");
  divTag.value = transformVal;
}
