async function crawl(){
  // 点击顶层按钮
  var parent=document.getElementById("treeZhiBiao_1");
  parent.querySelector("a").click();
  await sleep(1);
  var level1List=parent.querySelectorAll("li");
  var level1Count=level1List.length;
  console.log("0:%s count:%d",parent.querySelector("a").innerText,level1Count);
  for(var i=0;i<level1Count;i++){
    var level1=level1List[i];
    var level1Title=level1.querySelector("a").innerText;
    // 点击第二层按钮
    level1.querySelector("a").click();
    await sleep(2);
    var level2List=level1.querySelectorAll("li");
    var level2Count=level2List.length;
    console.log("0-%d:%s count:%d",i+1,level1Title,level2Count);
    for(var j=0;j<level2Count;j++){
      var level2=level2List[j];
      var level2Title=level2.innerText;
      var level2button=level2.querySelector("a");
      // 点击第三层按钮
      level2button.click();
      await sleep(2);
      var level2buttonName=level2button.querySelectorAll("span")[0].className;
      var level2Flag=level2buttonName.includes("ico_docu");
      console.log('0-%d-%d:%s level2Flag:%s' ,i+1,j+1,level2Title,level2Flag);
      if(level2Flag){
        getExcelData(level1Title+"-"+level2Title);
      }else{
        var level3List=level2.querySelectorAll("li");
        var level3Count=level3List.length;
        console.log('0-%d-%d:%s count:%d' ,i+1,j+1,level2Title,level3Count);
        for(var k=0;k<level3Count;k++){
          var level3=level3List[k];
          var level3Title=level3.innerText;
          console.log("0-%d-%d-%d:%s",i+1,j+1,k+1,level3Title);
          var level3button=level3.querySelector("a");
          // 点击第四层按钮
          level3button.click();
          await sleep(2);
          var level3buttonName=level3button.querySelectorAll("span")[0].className;
          var level3Flag=level3buttonName.includes("ico_docu");
          console.log('0-%d-%d-%d:%s level3Flag:%s',i+1,j+1,k+1,level3Title,level3Flag);
          if(level3Flag){
            getExcelData(level1Title+"-"+level2Title+"-"+level3Title);
          }else{
            var level4List=level3.querySelectorAll("li");
            var level4Count=level4List.length;
            console.log('0-%d-%d-d%:%s count:%d' ,i+1,j+1,k+1,level4List,level4Count);
            for(var l=0;l<level4Count;l++){
              var level4=level4List[l];
              var level4Title=level4.innerText;
              console.log("0-%d-%d-%d-%d:%s",i+1,j+1,k+1,l+1,level4Title);
              var level4button=level4.querySelector("a");
              // 点击第五层按钮
              level4button.click();
              await sleep(2);
              var level4buttonName=level4button.querySelectorAll("span")[0].className;
              var level4Flag=level4buttonName.includes("ico_docu");
              console.log('0-%d-%d-%d-%d:%s level4Flag:%s' ,i+1,j+1,k+1,l+1,level4Title,level4Flag);
              if(level4Flag){
                getExcelData(level1Title+"-"+level2Title+"-"+level3Title+"-"+level4Title);
              }else{
                console.log('0-%d-%d-%d-%d:%s level4Flag:%s needClick' ,i+1,j+1,k+1,l+1,level4Title,level4Flag);
              }
            }
          }
        }
      }
    }
  }
}

// 获取excel数据
function getExcelData(excelName){
  var content = [];
  var table=document.getElementsByClassName("public_table table_column")[0];
  console.log("table");

  var thData = [];
  var thList=table.querySelector("thead").querySelectorAll("tr")[0].querySelectorAll("th");
  var thLength=thList.length;
  console.log("thLength:",thLength);
  for(var i=0;i<thLength;i++){
      var head=thList[i];
      var hStr=head.innerText;
      var hNum=head.querySelector("span").getAttribute("code");
      thData.push(hNum);
  }
  console.log("thData:",thData);
  content.push(thData);

  var trList=table.querySelector("tbody").querySelectorAll("tr");
  var trLength=trList.length;
  console.log("trLength:",trLength);
  for(var i=0;i<trLength;i++){
      var tdData = []
      var tdList=trList[i].querySelectorAll("td");
      var tdLength=tdList.length;
      console.log("tdLength:",tdLength)
      for(var j=0;j<tdLength;j++){
        var d=tdList[j].innerText;
        tdData.push(d);
      }
      content.push(tdData);
  }
  console.log("content:",content)
  // 创建工作簿对象
  var workbook = XLSX.utils.book_new();
  // 将数据转化为工作表
  var ws_data = XLSX.utils.aoa_to_sheet(content);
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, ws_data, "Sheet1");
  // 将工作簿转换为blob以便下载
  var wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), excelName+".xlsx");
}

// 休眠
function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// 使用FileSaver.js进行下载
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

// 爬取数据
crawl();