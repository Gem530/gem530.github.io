/*
 * @Description:
 * @Author: cjw
 * @Date: 2023-02-06 17:14:28
 * @LastEditors: cjw
 *    整合api文件，统一导出。
 *    好处：直接引用@/api就可以导出所有的api了
 *    坏处：不能第一时间知道api在哪个文件中
 */
import fs from 'fs'
import path from 'path'

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve(__dirname, './src/api')

const wfHandle = (pathUrl: string, content: string) => {
  fs.writeFile(pathUrl, content, (error) => {
    // 创建失败
    if (error) console.log(`创建失败：${error}`)
  })
}

const rfHandle = (pathUrl: string, content: string[], callBack?: Function) => {
  fs.readFile(pathUrl, 'utf-8', (err: Error, dataStr) => {
    if (err) console.log(`读取${pathUrl}失败: ${err}`)
    else {
      let contentStr = ''
      content.forEach((v: string) => {
        if (!dataStr.includes(v)) contentStr += v
      })
      wfHandle(pathUrl, contentStr + dataStr)
      callBack && callBack()
    }
  })
}

function fileDisplay(filePath: string) {
  const fileList = fs.readdirSync('./src/api/' + filePath)
  let arr = fileList.filter((item: string) => item != 'index.ts')
  if (!arr.length) return
  let content = []
  arr.forEach((item: string) => {
    content.push(`export * from './${item.replace('.ts', '')}'` + '\n')
  })
  if (fileList.includes('index.ts')) {
    rfHandle(path.resolve(__dirname, `./src/api/${filePath}/index.ts`), content)
  } else wfHandle(path.resolve(__dirname, `./src/api/${filePath}/index.ts`), content.join(''))
}

// 会阻断node打包，导致打包成功后，命令不会结束
// fs.watch(
//   filePath,
//   {
//     recursive: true //是否连同其子文件一起监视
//   },
//   (eventType, filename) => {
//     //第一个参数，文件是修改还是增加还是删除等，第二个是文件名
//     if (eventType == 'rename') {
//       createFile()
//     }
//   }
// )

function createFile() {
  const fileNameArr = fs.readdirSync('./src/api')
  let outsideList = fileNameArr.filter((item: string) => item != 'index.ts')

  let folderList = fileNameArr.filter((item: string) => !item.includes('.ts'))
  let content = []
  outsideList.forEach((item: string) => {
    content.push(`export * from './${item.replace('.ts', '')}'` + '\n')
  })
  if (fileNameArr.includes('index.ts')) {
    rfHandle(path.resolve(__dirname, './src/api/index.ts'), content)
  } else wfHandle(path.resolve(__dirname, './src/api/index.ts'), content.join(''))
  folderList.forEach((item: string) => {
    fileDisplay(item)
  })
}

export default function () {
  return {
    name: 'autoApiPlugin',
    options(res) {
      // createFile()
    },
    handleHotUpdate(data) {
      const pathFormat = filePath.toString().replace(/\\/g,'/')
      if (data.file.includes(pathFormat) && !data.file.includes('index.ts')) {
        createFile()
      }
    },
    buildStart(res) {
      // console.log('解析', res)
    },
    //   解析时
    resolveId(id) {},
    // 运行中
    load(id) {}
  }
}
