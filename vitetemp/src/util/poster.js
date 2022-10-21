const poster = {
  canvas: undefined,
  ctx: undefined,
  scale: 3,
  width: 236,
  height: 428,
  draw (list) {
    return new Promise(async (resolve, reject) => {
      try {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width * this.scale
        this.canvas.height = this.height * this.scale
        this.ctx = this.canvas.getContext('2d')
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.type === 'image') {
            // 绘制图片
            await this.drawImage(item.url, item.x, item.y, item.width, item.height)
          }
          if (item.type === 'text') {
            // 绘制文字
            await this.drawText(item.url, item.x, item.y, item.color, item.font)
          }
        }
        const base = await this.canvas.toDataURL('img/png')
        resolve(base)
      } catch (err) {
        reject(err)
      }
    })
  },
  drawImage (dom, x, y, width, height) {
    return new Promise((resolve, reject) => {
      // 导入图片
      const img = new Image()
      img.crossorigin = 'Anonymous'
      img.src = dom
      img.onload = () => {
        // 图片加载完 开始绘制图片
        this.ctx.beginPath()
        this.ctx.drawImage(img, x * this.scale, y * this.scale, width * this.scale, height * this.scale)
        resolve(true)
      }
      img.onerror = (err) => {
        reject(err)
      }
    })
  },
  drawText (dom, x, y, color, font = '16px Arial') {
    return new Promise(resolve => {
      // 绘制文字
      this.ctx.beginPath()
      this.ctx.font = font
      this.ctx.fillStyle = color
      this.ctx.fillText(dom, x * this.scale, y * this.scale)
      resolve(true)
    })
  }
}

export default poster


// 使用案例
// const qr = [
//   {
//     name: 'baseImg',
//     type: 'image',
//     url: poster_1,
//     x: 0,
//     y: 0,
//     width: 236,
//     height: 428
//   },
//   {
//     name: 'qrcode',
//     type: 'image',
//     url: '',
//     x: 180,
//     y: 375,
//     width: 45,
//     height: 45
//   },
//   {
//     name: 'link',
//     type: 'text',
//     url: '绘制文字',
//     x: 10,
//     y: 358,
//     color: 'white',
//     font: '26px Arial'
//   }
// ]
// const imgs = await poster.draw(qr) // base64