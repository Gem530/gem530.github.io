/*
 * @Description:
 * @Author: hjj
 * @Date: 2023-02-28 10:40:28
 * @LastEditors: hjj
 *   读取iconfont文件，并返回iconfont类名数组
 */
import fs from 'fs'
import path from 'path'

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve(__dirname, './src/assets/styles/iconfont.scss')

const wfHandle = (pathUrl: string, content: string, callBack?: Function) => {
  fs.writeFile(pathUrl, content, (err) => {
    // 创建失败
    if (err) console.log(`创建失败：${err}`)
    else callBack && callBack()
  })
}

const rfHandle = (pathUrl: string, content: string, callBack?: Function) => {
  fs.readFile(pathUrl, 'utf-8', (err, dataStr) => {
    if (err) console.log(`读取${pathUrl}失败: ${err}`)
    else callBack && callBack(dataStr)
  })
}

// 会阻断node打包，导致打包成功后，命令不会结束
// fs.watch(
//   filePath,
//   // {
//   //   recursive: true //是否连同其子文件一起监视
//   // },
//   (eventType, filename) => {
//     //第一个参数，文件是修改还是增加还是删除等，第二个是文件名
//     if (eventType == 'rename') {
//       wirteClassList()
//     }
//   }
// )

/**
 * @params {string} url --- url is a relative path string of a css file
 */
const readSassOrScss = (url: string) => {
  let res = undefined
  try {
    const sassStr = fs.readFileSync(url, 'utf-8')
    let resMatch = sassStr.match(/.(\S*):before/g)
    res = Array.from(resMatch)
    for (let i = 0; i < res.length; i++) {
      res[i] = res[i].replace('.', '').replace(':before', '')
    }
  } catch (err) {
    throw new Error(err)
  }
  return res || []
}

const wirteClassList = () => {
  const res = readSassOrScss(filePath)
  const resultStr = 'export const iconList: string[] = ' + JSON.stringify(res)
  wfHandle(path.resolve(__dirname, './src/components/g-choose-icon/config.ts'), resultStr)
}

export default function () {
  return {
    name: 'iconExportPlugin',
    // 在服务器启动时被调用：获取、操纵Rollup选项，严格意义上来讲，它执行于属于构建阶段之前
    options(options) {
      // wirteClassList()
    },
    // 热更新  执行自定义HMR更新，可以通过ws往客户端发送自定义的事件
    handleHotUpdate(ctx) {
      const pathFormat = filePath.toString().replace(/\\/g,'/')
      // console.log('handleHotUpdate-热更新', ctx.file, pathFormat, ctx.file.includes(pathFormat))
      if (ctx.file.includes(pathFormat)) {
        wirteClassList()
      }
    },
    // 在每次开始构建时调用
    buildStart(options) {
    },
    // 解析时 在每个传入模块请求时被调用，创建自定义确认函数，可以用来定位第三方依赖
    resolveId(source, importer, options) {},
    // 运行中 在每个传入模块请求时被调用，可以自定义加载器，可用来返回自定义的内容
    load(id) {}
  }
}
