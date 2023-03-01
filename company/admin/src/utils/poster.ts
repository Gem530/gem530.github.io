import qrcode from './qrcode'
interface postItem {
  x: number,
  y: number,
  url: string,
  type: string,
  font?: string,
  name?: string, // 想要生成二维码时，name必须为qrcode
  color?: string,
}
// vitetemp中有js的用法
class poster {
  ctx: any
  list: any[]
  canvas: any
  scale: number
  width: number
  height: number
  constructor (list: postItem[]|postItem[][], width: number = 236, height: number = 428, scale: number = 3) {
    this.list = list
    this.scale = scale
    this.width = width
    this.height = height
  }
  // 传入二维数组，生成多张海报图
  // let poster: Poster = new Poster(list); poster.drawAll();
  drawAll (): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      let imgList = []
      for (let i = 0; i < this.list.length; i++) {
        const imgs = await this.draw(this.list[i])
        imgList.push(imgs)
      }
      resolve(imgList)
    })
  }
  // 传入一维数组，生成一张海报图
  // let poster: Poster = new Poster(list); poster.draw();
  draw (currentPost?: postItem[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const list = currentPost || this.list
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width * this.scale
        this.canvas.height = this.height * this.scale
        this.ctx = this.canvas.getContext('2d')
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.type === 'image') {
            if (item.name === 'qrcode' && item.url) {
              const qrImg = await qrcode(item.url)
              item.url = qrImg
            }
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
  }
  drawImage (dom: string, x: number, y: number, width: number, height: number) {
    return new Promise((resolve, reject) => {
      // 导入图片
      const img = new Image()
      img.crossOrigin = 'Anonymous'
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
  }
  drawText (dom: string, x: number, y: number, color: number, font: string = '16px Arial') {
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