// シフトから出勤者を配列に格納していく関数
function getName(dayValue) {
  const ssBase = SpreadsheetApp.openById('1OH4gRq-5Jn8w5KKTIt9EjGyxjt6mPzmoPszzvpcr9lI');
  const sheetName = dayValue.year + '.' + dayValue.month
  const sheetBase = ssBase.getSheetByName(sheetName);
  let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OH4gRq-5Jn8w5KKTIt9EjGyxjt6mPzmoPszzvpcr9lI/edit?usp=sharing');


  const sheet = ss.getSheetByName("シフト表")


  let cellRow = 8;
  let cellColumn = 5;

  // 日付と一致する列の探索
  for (var i = 0; i < 31; i++) {
    if (dayValue.day == getValues(6, cellColumn, sheet)) {
      i = 32;
    } else {
      cellColumn++;
    }
  }
  // console.log(dayValue.day, getValues(6, cellColumn, sheet))

  // 配列を定義
  let aryAll = [];
  let aryFP = [];
  let aryFFF = [];
  let aryFFP = [];
  let posiObj = {
    name:'',
    position:''
  }

  // 特定の日付の値を配列に格納
  let count = 0;
  while (count < 22) {
    let range = sheet.getRange(cellRow, cellColumn)
    let value = range.getValue()

    if (value == "F" || value == "P") {
      if(range.getFontLine() == 'underline'){
        posiObj.name = getValues(cellRow, 2, sheet)
        posiObj.position = "FD"      
      }
      aryFP.push(getValues(cellRow, 2, sheet))
      cellRow++;
    } else if (value == "FF") {
      aryFFF.push(getValues(cellRow, 2, sheet))
      cellRow++;
    } else if (value == "FP") {
      aryFFP.push(getValues(cellRow, 2, sheet))
      cellRow++;
    } else {
      cellRow++;
    }
    count++;
  }
  
  // 日付ごとの配列情報を3次元配列に格納
  aryAll.push(aryFP, aryFFF, aryFFP,posiObj);
  // console.log(aryAll)
  return aryAll
}


// URLにアクセスがあった時に起動する関数。webページを表示する場合は必ず使うもの。
function doGet(e) {
  let template = HtmlService.createTemplateFromFile('index');
  template.deployURL = ScriptApp.getService().getUrl();
// 当日の日付を取得する
  let today = new Date();
  year = today.getFullYear();
  month = today.getMonth() + 1;
  day = today.getDate();

  template.year = year
  template.month = month
  template.day = day

  let htmlOutput = template.evaluate();
  htmlOutput.setTitle('レコード入力').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return htmlOutput
}

// セルを特定して値を得る関数
function getValues(x, y, sn) {
  let range = sn.getRange(x, y)
  return range.getValue()
}

// セルを特定して値を入力する関数
function setValues(x, y, sn, value) {
  let range = sn.getRange(x, y)
  return range.setValue(value)
}

// 入力シートの日付と一致するまで日付欄を探索する関数
function dayRowSerch(sn, value) {
  let countF = 0;
  let cellRowF = 4
  while (countF < 96) {
    if (getValues(cellRowF, 2, sn) == value) {
      countF = 99;
    } else {
      cellRowF += 2;
      countF++;
    }
  }
  return cellRowF
}

// 入力範囲のデータが空かを調べる関数
function nullCheck(dayValue) {

  // 管理表を開く
  let url = '1r_OT0raw6BM56VXh6bqaG8gc7mIOYAaOzxtJJ-7sGRg'
  let sheetName = dayValue.year + '.' + dayValue.month
  let ss = SpreadsheetApp.openById(url).getSheetByName(sheetName);
  
  let cellRow = dayRowSerch(ss, dayValue.day);
  let memberCount = getValues(1,3,ss)

  let range = ss.getRange(cellRow,4,1,memberCount)
  let dataCheackAry = range.getValues()
  let nullCount = true

  for(let i = 0;i < dataCheackAry[0].length; i++){
    if(dataCheackAry[0][i] !== ''){
      nullCount = false
    }else{     
    }
  }
  
  return nullCount
}

// 送信されたデータをスプレッドシートに入力する関数
function past(aryArg,sendSheet) {
  let ary = aryArg
  // 管理表を開く
  let url = '1r_OT0raw6BM56VXh6bqaG8gc7mIOYAaOzxtJJ-7sGRg'
  let sheetName = 0
  if(sendSheet === true){
  sheetName = ary[0].year + '.' + ary[0].month
  }else{
  sheetName = 'テスト用'
  }
  let ss = SpreadsheetApp.openById(url).getSheetByName(sheetName);

  let cellRow = dayRowSerch(ss, ary[0].day);
  let cellColumn = 4;

  for (let i = 0; i < ary.length - 1; i++) {
    cellColumn = 4;
    // 配列から該当者を取り出す
    let name = ary[i + 1].name
    if (name == '') {
    } else {
      // 名前が一致するまで探索
      for (let j = 0; j < 23; j++) {
        if (name == getValues(2, cellColumn, ss)) {
          setValues(cellRow, cellColumn, ss, ary[i + 1].record)
          if (ary[i + 1].position == 'N') {

          } else if (ary[i + 1].position == 'P') {
            setValues(cellRow + 1, cellColumn, ss, 'P1')
          } else if (ary[i + 1].position == 'D') {
            setValues(cellRow + 1, cellColumn, ss, 'P2')
          } else if (ary[i + 1].position == 'Z') {
            setValues(cellRow + 1, cellColumn, ss, 'P3')
          }
          j = 24
        } else {
          cellColumn++;
        }
      }
    }
  }
}

