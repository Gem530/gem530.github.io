/**
 * 直接返回二维码图片 base64
 * 例：
 * qrcode('https://www.baidu.com').then(base => {
 *  // console.log(base)
 *  img.value = base as string
 * })
 */
import QrcodeVue from "qrcode.vue"
// 引入创建虚拟节点和渲染方法
import { createVNode, render } from "vue"

interface qrcode {
  size?: number,
  value: string,
  level?: 'L' | 'M' | 'Q' | 'H'
}

export default (data: qrcode|string) => {
  return new Promise((resolve, reject) => {
    let size, value, level
    if (typeof data == 'object') {
      size = data.size
      value = data.value
      level = data.level
    } else {
      value = data
    }
    // 定义一个div容器
    const div = document.createElement("div")
    div.style.display = 'none'
    // 将定义的容器添加到dom上
    document.body.appendChild(div)
    try {
      const vnode = createVNode(QrcodeVue, { value, size: size ?? 60, level: level ?? 'H' })
      // 调用渲染方法：将虚拟节点渲染到dom中
      render(vnode, div)
      const canvas = div.getElementsByTagName('canvas')[0]
      const base = canvas.toDataURL('img/png')
      resolve(base)
    } catch (err) {
      reject(err)
    } finally {
      document.body.removeChild(div)
    }
  })
}