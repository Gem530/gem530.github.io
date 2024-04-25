// 读取iconfont文件，并返回iconfont类名数组
// import path from 'path'
const fs = require('fs')
const path = require('path')
const sass = require('sass')
let xlsx = require('node-xlsx')

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve(__dirname)

const wfHandle = (pathUrl, content) => {
  fs.writeFile(pathUrl, content, (error) => {
    // 创建失败
    if (error) console.log(`创建失败：${error}`)
  })
}

const rfHandle = (pathUrl, content, callBack) => {
  fs.readFile(pathUrl, 'utf-8', (err, dataStr) => {
    if (err) console.log(`读取${pathUrl}失败: ${err}`)
    else {
      callBack && callBack(dataStr)
    }
  })
}

// 两列多语言，左右对比
const rfFile = () => {
  // rfHandle('./zh_CN.ts')
  // rfHandle('./kr.xlsx')
  rfHandle('./zh_CN.ts', '', (dataStr) => {
    let sheets = xlsx.parse(filePath + '/kr.xlsx')
    // console.log(sheets[0].data)
    // console.log(dataStr)
    sheets[0].data.map((item) => {
      let tip1 = item[0] && item[0].replace(/'/g, "")
      let tip2 = item[1] && item[1].replace(/'/g, "")
      // console.log(tip1, tip2)
      dataStr = dataStr.replace(tip1, tip2)
    })
    // console.log(dataStr)
    wfHandle('./ko_KR.ts', dataStr)
  })
}
rfFile()

// 一列多语言，上下对比
const rfOneFile = () => {
  // rfHandle('./zh_CN.ts')
  // rfHandle('./kr.xlsx')
  rfHandle('./zh_CN.ts', '', (dataStr) => {
    let sheets = xlsx.parse(filePath + '/kr.xlsx')
    // console.log(sheets[0].data)
    // console.log(dataStr)
    let tempList = []
    sheets[0].data.map((item, index) => {
      if (index % 2 == 0) {
        tempList.push([item[0], sheets[0].data[index + 1][0]])
      }
    })
    // console.log(tempList)
    tempList.map((item) => {
      let tip1 = item[0]
      let tip2 = item[1]
      // console.log(tip1, tip2)
      dataStr = dataStr.replace(tip1, tip2)
    })
    // console.log(dataStr)
    wfHandle('./ko_KR.ts', dataStr)
  })
}
rfOneFile()