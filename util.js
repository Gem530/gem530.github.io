/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * @author wenbin
 * @description 将将文件处理成 Image 对象
 * @param file 文件对象
 */
 export function toImage (file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = function (e) {
      img.src = e.target.result
    }
    reader.onerror = function (e) {
      reject(e)
    }
    reader.readAsDataURL(file)
    img.onload = function () {
      resolve(img)
    }
    img.onerror = function (e) {
      reject(e)
    }
  })
}

/**
 * @author wenbin
 * @description 通过画布减小图像尺寸，实现图片压缩
 * @param img 被压缩的img对象
 * @param type 压缩后转换的文件类型
 * @param mx 触发压缩的图片最大宽度限制
 * @param mh 触发压缩的图片最大高度限制
 */
export function compressImg (img, type, mx, mh) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const { width: originWidth, height: originHeight } = img
      // 最大尺寸限制
      const maxWidth = mx
      const maxHeight = mh
      // 目标尺寸
      let targetWidth = originWidth
      let targetHeight = originHeight
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > 1) {
          // 宽图片
          targetWidth = maxWidth
          targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
          // 高图片
          targetHeight = maxHeight
          targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
      }
      canvas.width = targetWidth
      canvas.height = targetHeight
      context.clearRect(0, 0, targetWidth, targetHeight)
      // 图片绘制
      context.drawImage(img, 0, 0, targetWidth, targetHeight)
      canvas.toBlob(function (blob) {
        resolve(blob)
      }, type || 'image/png')
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author hjj
 * @description 通过画布改变图片质量，不改变大小
 * @param img 被压缩的img对象
 * @param quality 压缩的质量，值越小图片大小越小，例：quality=0.13，压缩后，6.4M的图片只有630kb
 */
export function compressImgQuality (img, quality = 0.13) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const { width, height } = img
      canvas.width = width
      canvas.height = height
      context.clearRect(0, 0, width, height)
      // 图片绘制
      context.drawImage(img, 0, 0, width, height)
      const tempFile = canvas.toDataURL('image/jpeg', quality)
      const blob = await convertBase64UrlToBlob(tempFile)
      // console.log(blob)
      resolve(blob)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @author hjj
 * @param urlData
 * 将以base64的图片url数据转换为Blob 用url方式表示的base64图片数据
 */
export function convertBase64UrlToBlob (urlData) {
  const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byt
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/jpeg' })
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// 员工手机号校验规则
const isPhoneNumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else {
    // 由于现在号段太多太杂，所以只是简单校验一下
    const phoenReg = /^1[0-9]{10}$/
    // const a = new RegExp(phoenReg)
    if (!phoenReg.test(value)) {
      callback(new Error('请输入有效的手机号码'))
    } else {
      callback()
    }
  }
}
export const RULE_PHONE = [
  { validator: isPhoneNumber, trigger: 'blur' }
]

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// 金额校验规则
const isPriceNumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入金额'))
  } else {
    const priceReg = /^\d+(\.\d{1,10})?$/
    // const a = new RegExp(phoenReg)
    if (!priceReg.test(value)) {
      callback(new Error('请输入有效的金额'))
    } else {
      callback()
    }
  }
}
export const RULE_PRICE = { validator: isPriceNumber, trigger: 'blur' }

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// 金额校验规则 允许为负
const isOFFPriceNumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入金额'))
  } else {
    const priceReg = /^-?\d+(\.\d{1,10})?$/
    // const a = new RegExp(phoenReg)
    if (!priceReg.test(value)) {
      callback(new Error('请输入有效的金额'))
    } else {
      callback()
    }
  }
}
export const RULE_OFFPRICE = { validator: isOFFPriceNumber, trigger: 'blur' }

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// 数值校验规则
const isNumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入数值'))
  } else {
    const priceReg = /^\d+$/
    // const a = new RegExp(phoenReg)
    if (!priceReg.test(value)) {
      callback(new Error('请输入有效的数值'))
    } else {
      callback()
    }
  }
}
export const RULE_NUMBER = { validator: isNumber, trigger: 'blur' }

const blurText = async (rule, value, callback) => {
  const boolean = /^[0-9]+$/.test(value)
  if (!boolean) {
    callback(new Error('请输入大于等于0的整数'))
  } else {
    callback()
  }
}
export const RULE_INTEGER = { validator: blurText, trigger: 'blur' }

// 员工邮箱校验规则
const isEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}
export const RULE_EMAIL = [
  { validator: isEmail, trigger: 'blur' }
]

/**
 * @author wenbin
 * @description 移动端 vant 表单校验是否是有效的中文名字
 * @param value 待校验的字符串
 */
export function mobileIsValidName (value) {
  if (value.length && value.length < 5) {
    return /^[\u4e00-\u9fa5]+$/i.test(value)
  } else {
    return false
  }
}

/**
 * @author wenbin
 * @description 移动端 vant 表单校验是否是有效的电话号码
 * @param value
 */
export function mobileIsValidPhone (value) {
  if (value.length === 11) {
    return /^1[0-9]{10}$/.test(value)
  } else {
    return false
  }
}

/**
 * @author wenbin
 * @description 移动端 vant 表单校验是否是有效的VIN
 * @param value
 */
export function mobileIsValidVin (value) {
  // Vin 码长度肯定是 17 位
  if (value.length === 17) {
    let sum = 0
    const vinList = value.split('') // 将传进来的 Vin 字符串转换为数组
    const mapIndexList = [] // Vin 每一位对应校验列表的数组下标（索引）数组

    // Vin 计算权重
    const vinWeightList = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
    // Vin 校验列表
    const a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    // Vin 校验列表对应用来累加的值类似于 a[3] => b[3]
    const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9]

    // 将传入 Vin 每一位在校验列表的位置找出来，并存放进关系映射数组 mapIndexList 中
    vinList.forEach(item => {
      mapIndexList.push(a.findIndex(ele => item === ele))
    })

    // 将权重数组与 Vin 转换后的数值进行累加求和
    mapIndexList.forEach((item, index) => {
      sum += b[item] * vinWeightList[index]
    })

    const checkCode = sum % 11 // 计算校验码

    if (checkCode === 10) {
      // 如果校验码等于 10 那么传入的 Vin 码第9位（校验位）一定是 ‘X'
      if (vinList[8] === 'X') return true
      return false
    } else {
      // 如果校验码不等于 10 那么传入的 Vin 码第9位（校验位）等于 校验码
      if (checkCode === Number(vinList[8])) return true
      return false
    }
  } else {
    return false
  }
}

/**
 * @author wenbin
 * @description 校验字符串是否是整数字符串串
 * @param value 待校验的值
 */
export function isInteger (value) {
  if (!(/(^[1-9]\d*$)/.test(value))) {
    return false
  } else {
    return true
  }
}

/**
 * @author wenbin
 * @description 下载文件
 */
export function download (fileUrl, fileName) {
  const aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.href = fileUrl
  aLink.target = '_blank'
  aLink.setAttribute('download', fileName)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
