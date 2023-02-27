/*
 * @Description:
 * @Author: cjw
 * @Date: 2023-02-06 17:14:28
 * @LastEditTime: 2023-02-21 11:15:40
 * @LastEditors: cjw
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

const rfHandle = (pathUrl: string, content: string, callBack?: Function) => {
  fs.readFile(pathUrl, 'utf-8', (err: Error, dataStr) => {
    if (err) console.log(`读取${pathUrl}失败: ${err}`)
    else {
      content += dataStr
      // console.log(pathUrl, content)
      wfHandle(pathUrl, content)
      callBack && callBack()
    }
  })
}

function fileDisplay(filePath: string) {
  const fileList = fs.readdirSync('./src/api/' + filePath)
  let arr = fileList.filter((item: string) => item != 'index.ts')
  if (!arr.length) return
  let content = ''
  arr.forEach((item: string) => {
    content += `export * from './${item.replace('.ts', '')}'` + '\n'
  })
  // if (fileList.includes('index.ts')) {
  //   rfHandle(path.resolve(__dirname, `./src/api/${filePath}/index.ts`), content)
  // } else 
  wfHandle(path.resolve(__dirname, `./src/api/${filePath}/index.ts`), content)
}

fs.watch(
  filePath,
  {
    recursive: true //是否连同其子文件一起监视
  },
  (eventType, filename) => {
    //第一个参数，文件是修改还是增加还是删除等，第二个是文件名
    if (eventType == 'rename') {
      createFile()
    }
  }
)

function createFile() {
  const fileNameArr = fs.readdirSync('./src/api')
  let outsideList = fileNameArr.filter((item: string) => item != 'index.ts')

  let folderList = fileNameArr.filter((item: string) => !item.includes('.ts'))
  let content = ''
  outsideList.forEach((item: string) => {
    content += `export * from './${item.replace('.ts', '')}'` + '\n'
  })
  // if (fileNameArr.includes('index.ts')) {
  //   rfHandle(path.resolve(__dirname, './src/api/index.ts'), content)
  // } else
  wfHandle(path.resolve(__dirname, './src/api/index.ts'), content)
  folderList.forEach((item: string) => {
    fileDisplay(item)
  })
}

export default function () {
  return {
    name: 'autoApiPlugin',
    options(res) {
      createFile()
    },
    handleHotUpdate(data) {
      if (data.file.includes(filePath)) {
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
