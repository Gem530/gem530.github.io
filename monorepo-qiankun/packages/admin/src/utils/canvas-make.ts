// 根据图片地址 返回图片
// url 图片地址：base63/url地址/上传的file文件/blob文件
export const createImage = (url: string|File) => {
  return new Promise((resolve, reject) => {
    let img: any = new Image()
    if (url instanceof File) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        img.src = e.target.result
      }
      reader.onerror = (e: any) => {
        e.name = 'FileReader'
        reject(e)
      }
      reader.readAsDataURL(url)
    } else {
      img.src = url
    }
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      resolve({ img, w: img.width, h: img.height })
    }
    img.onerror = (err: any) => {
      err.name = 'createImage'
      reject(err)
    }
  })
}

// 生成canvas
// url 图片地址：base63/url地址/上传的file文件/blob文件
// quilaty 图片质量：默认0.92，可输入 0-1，超过0-1，则默认0.92
// type 图片类型：默认image/jpeg，可选：image/png等等图片类型
// w 图片宽度：只输入宽度时，高度成正比
// h 图片高度：宽度设为0，输入高度，以高度为准，宽度成正比
export const createCanvas = async (url: string|File, width?: number, height?: number) => {
  let canvas = document.createElement('canvas')
  let ctx: any = canvas.getContext('2d')
  const { w, h, img }: any = await createImage(url)
  const wi = width as number
  const hi = height as number
  let tempW: number = 0
  let tempH: number = 0
  if (width && !height) {
    tempW = wi
    tempH = (tempW * h) / w
  }
  if (!width && height) {
    tempH = hi
    tempW = (w * tempH) / h
  }
  canvas.width = tempW
  canvas.height = tempH
  ctx.drawImage(img, 0, 0, tempW, tempH)
  return { canvas, ctx }
}

// 返回压缩的blob文件
// url 图片地址：base63/url地址/上传的file文件/blob文件
// quilaty 图片质量：默认0.92，可输入 0-1，超过0-1，则默认0.92
// type 图片类型：默认image/jpeg，可选：image/png等等图片类型
// w 图片宽度：只输入宽度时，高度成正比
// h 图片高度：宽度设为0，输入高度，以高度为准，宽度成正比
export const compressionImgToBlob = (url: string|File, quilaty: number = 0.92, type: string = 'image/jpeg', w?: number, h?:number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { canvas, ctx }: any = await createCanvas(url, w, h)
      canvas.toBlob((blob: Blob) => {
        resolve(blob)
      }, type, quilaty)
    } catch (err: any) {
      err.name = 'compressionImgToBlob'
      reject(err)
    }
  })
}

// 返回压缩的base64图片
// url 图片地址：base63/url地址/上传的file文件/blob文件
// quilaty 图片质量：默认0.92，可输入 0-1，超过0-1，则默认0.92
// type 图片类型：默认image/jpeg，可选：image/png等等图片类型
// w 图片宽度：只输入宽度时，高度成正比
// h 图片高度：宽度设为0，输入高度，以高度为准，宽度成正比
export const compressionImgToDataUrl = async (url: string|File, quilaty: number = 0.92, type: string = 'image/jpeg', w?: number, h?:number) => {
  const { canvas, ctx }: any = await createCanvas(url, w, h)
  // 有些电脑生成jpeg的base64，图片在下载时可能是默认jfif格式，这是电脑的配置问题
  // 修改配置教程地址 https://zhuanlan.zhihu.com/p/399997794
  // 该路径下 计算机\HKEY_CLASSES_ROOT\MIME\Database\Content Type\image/jpeg 把默认jfif改为jpg即可
  return canvas.toDataURL(type, quilaty)
}