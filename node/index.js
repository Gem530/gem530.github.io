// 读取iconfont文件，并返回iconfont类名数组
const fs = require('fs')
const sass = require('sass')

/**
 * @params {string} url --- url is a relative path string of a css file
 */
const readSassOrScss = (url) => {
  // console.log()
  let res
  try {
    const sassStr = fs.readFileSync(url, 'utf-8')
    // console.log(sassStr)
    res = sassStr.match(/.(\S*):before/g)
    res = Array.from(res)
    for (let i = 0; i < res.length; i++) {
      res[i] = res[i].replace('.', '').replace(':before', '')
    }
  } catch (err) {
    throw new Error(err)
  }
  return res
}

const wirteClassList = () => {
  const res = readSassOrScss('../company/admin/src/assets/styles/iconfont.scss')
  fs.writeFileSync('classList.txt', JSON.stringify(res), (result, err) => {
    if (err) return console.log(err)
    console.log('成功', result)
  })
}
wirteClassList()