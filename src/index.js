const stringify = require('csv-stringify/lib/sync')
const parse = require('csv-parse/lib/sync')
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const chardet = require('chardet');
const _ = require('lodash')

const readDebris = () => {

  const newLines = [];
  const allDataObject = [];

  for (let y = 108; y <= 109; y++) {
    for (let m = 1; m <= 12; m++) {

      const p = path.join(__dirname, '..', 'data', 'raw', `海洋廢棄物清理狀況統計${y}年${m}月.csv`);
      if (fs.existsSync(p)) {
        const encoding = chardet.detectFileSync(p);
        console.log(`[${encoding}]` + p + '\n');

        const content = iconv.decode(fs.readFileSync(p), encoding).replace(/ |　/g, '').trim();
        const r = parse(content, { columns: true }).map(r => ({ ...r, '日期': `${1911 + y}${_.padStart(m, 2, '0')}` })); //YYYYMM
        allDataObject.push(...r);
      }
    }
  }

  const okData = allDataObject
    .filter(e => e['縣市別'] !== '總計')

  const columns = [
    '日期',
    '縣市別',
    '清理範圍(處)',
    '清理次數(次)',
    '參與人數(人次)',
    '海洋廢棄物來源(噸)_海漂',
    '海洋廢棄物來源(噸)_海底',
    '海洋廢棄物來源(噸)_淨灘',
    '清理方式_雇工(人次)',
    '清理方式_機械(輛次)',
    '清理數量分類(噸)_計',
    '清理數量分類(噸)_寶特瓶',
    '清理數量分類(噸)_鐵罐',
    '清理數量分類(噸)_鋁罐',
    '清理數量分類(噸)_玻璃瓶',
    '清理數量分類(噸)_廢紙',
    '清理數量分類(噸)_竹木',
    '清理數量分類(噸)_保麗龍',
    '清理數量分類(噸)_廢漁具漁網',
    '清理數量分類(噸)_其他',
    '清理後處理方式(噸)_焚化',
    '清理後處理方式(噸)_回收再利用',
    '清理後處理方式(噸)_其他']

  allDataObject.forEach((e) => {
    for (const col of columns) {
      if (!e[col]) {
        console.error(e, col);
      }
    }
  })

  console.log(allDataObject.slice(0, 5));


  const csvOutput = stringify(okData, { header: true, columns })
  const doneFile = path.join(__dirname, '..', 'data', 'done', `海洋廢棄物清理狀況統計.csv`);
  fs.writeFileSync(doneFile, csvOutput)
  // console.log(newLines);
}

readDebris();