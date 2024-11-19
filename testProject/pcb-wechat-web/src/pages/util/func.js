import dayjs from "dayjs";
import Taro from "@tarojs/taro";
import bmap from './bmap-wx.min'
import config, { MAP_AK, TEMPLATE_IDS } from "../config/commonConfig";
import { getSignedUrlErpAPI, getUrlByKeysErpAPI } from '../services/upload/index'

const { windowWidth, windowHeight } = config;

export const calcPx = (px) => {
  return px * 750 / windowWidth;
}

// 计算一倍率，如：canvas 宽为80rpx，qrcode生成时需要计算出实际的px
export const rpxToPx = (px) => {
  return px * windowWidth / 750;
}

export const calcHeightPercentPx = (percent) => {
  return percent / 100 * windowHeight * 750 / windowWidth;
}

// 删除所有 dom标签
export const removeAllTags = (str) => {
  if (!str) return
  return str.replaceAll(/<[^>]*>/g, '');
}

export const loginOut = () => {
  // 登录超时后，需要重定向到具体页面
  const needRedirect = Taro.getStorageSync('__RedirectInfo__')
  // console.log('needRedirect', needRedirect)
  let paramPath = ''
  if (needRedirect) {
    paramPath = `?${needRedirect}`
  }
  Taro.clearStorageSync();
  Taro.reLaunch({
    url: `/pages/index/index${paramPath}`,
  }).then();
}

// 订阅流程审批消息
export const subscribeMessage = () => {
  return new Promise((resolve, reject) => {
    console.log(TEMPLATE_IDS)
    Taro.requestSubscribeMessage({
      tmplIds: TEMPLATE_IDS,
      success: (res) => {
        console.log(res)
        resolve(res)
      },
      fail: (err) => {
        console.log(err)
        reject(err)
        // againSetting()
      }
    })
  })
}

export const calcWidthPercentPx = (percent) => {
  return percent / 100 * windowWidth * 750 / windowWidth;
}

export const buildCookie = (a, b, c, d) => {
  var e = [a + "=" + escape(b), "/", (domain, window.location.host)],
    f = function () {
      if ("NaN" == parseInt(d)) return "";
      var a = new Date;
      return a.setTime(a.getTime() + 60 * parseInt(d) * 60 * 1e3),
        a.toGMTString()
    };
  return d && e.push(f(d)),
    document.cookie = e.join("; ")
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export const deepClone = (source) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
};


// 是否有什么角色
export const hasPermi = (arr) => {
  const data = Taro.getStorageSync('__USER_INFO__')
  // console.log(arr, data.roles, data.roles.some((s) => arr.includes(s)))
  const res = data.roles.some((s) => {
    return arr.includes(s)
  })
  return res
}
// 是否有什么权限
export const hasPermission = (arr) => {
  const data = Taro.getStorageSync('__USER_INFO__')
  // console.log(arr, data.roles, data.roles.some((s) => arr.includes(s)))
  const res = data.permissions.some((s) => {
    return arr.includes(s)
  })
  return res
}

// 金额千分号，逗号分隔
export const priceFormat = (val, float = 2) => {
  let num = Number(val || 0)
  if (float <= 0) {
    num = num.toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  } else {
    num = num.toFixed(float).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  }
  return num
}

/**
 * 脱敏公用
 * @param str 脱敏字符串
 * @param begin 起始保留长度，从0开始
 * @param end 结束保留长度，到str.length结束
 * @returns {string}
 */
export const desensitizedCommon = (str, begin = 3, end = 4, symbol = '*') => {
  if (!str || (begin + end) >= str.length) {
      return "";
  }
  if(str.indexOf(symbol)!==-1){
      return str;
  }

  let leftStr = str.substring(0, begin);
  let rightStr = str.substring(str.length - end, str.length);

  let strCon = ''
  for (let i = 0; i < str.length - end - begin; i++) {
      strCon += symbol;
  }
  return leftStr + strCon + rightStr;
}

/**
 * 脱敏 两个字以内不脱敏，文字有多少，展示多少个*
 * @param str 脱敏字符串
 * @param symbol 加密的展示字符串
 * @returns {string}
 */
export const desensitizedOne = (str, symbol = '*') => {
  if (!str) return '';
  let res = ''
  str = str.trim()
  if (str.length <= 2) {
    res = str
  } else {
    let startStr = str.slice(0, 1)
    let centerStr = str.slice(1, str.length - 1)
    let endStr = str.slice(str.length - 1)
    // console.log(startStr, centerStr, endStr, startStr.length, centerStr.length, endStr.length)
    let desenitizeStr = ''
    for (let i = 0; i < centerStr.length; i++) {
      desenitizeStr += symbol
    }
    res = startStr + desenitizeStr + endStr
  }
  return res
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export const validEmail = (email) => {
  const reg =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

// 获取dom的外边距等
export const getDomRect = (domId) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery().select(domId).boundingClientRect((res) => resolve(res)).exec()
  })
}
// 获取dom的宽高
export const getDomInfo = (domId) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery().select(domId).fields({ node: true, size: true }).exec((res) => resolve(res))
  })
}
// 下载图片
export const downloadImg = (url) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url,
      success: (res) => {
        if (res?.statusCode == 200 && res?.tempFilePath) resolve(res.tempFilePath)
        else reject(false)
      },
      fail: err => reject(false)
    })
  })
}
// type2d 生成图片
export const createImage = (canvas, path) => {
    return new Promise((resolve, reject) => {
        try {
          console.log(canvas, path)
            let image = canvas.createImage() // 创建image实例
            image.src = path
            image.onload = async () => {
                resolve(image)
            }
        } catch(err) {
            reject(err)
        }
    })
}
// canvas保存图片 type jpg/png quality 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
export const toDataUrl = (canvasId, type = 'png', quality = 1) => {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      quality,
      fileType: type,
      canvasId: canvasId,
      fail: err => reject(err),
      success: res => resolve(res),
    });
  })
}
// canvas保存图片 type jpg/png quality 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
export const toDataUrlNative = (canvas, params, type = 'png', quality = 1) => {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      quality,
      ...params,
      fileType: type,
      canvas: canvas,
      fail: err => reject(err),
      success: res => resolve(res),
    });
  })
}
// 临时地址转换 height:图片原始高度 width:图片原始宽度 orientation:拍照时设备方向 path:图片的本地路径 type:图片格式
export const getImageInfo = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    Taro.getImageInfo({
      src: tempFilePath,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
// 临时地址转换 size:文件大小，以字节为单位
export const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    Taro.getFileSystemManager().getFileInfo({
      filePath: filePath,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
// 绘制图形
export const canvasDraw = (canvas, reserve = true) => {
  return new Promise((resolve, reject) => {
    canvas?.draw(reserve, () => resolve(true))
  })
}

// oss上传url
export const ossUpload = (row) => {
  return new Promise((resolve, reject) => {
    let { url, data, tmpUrl } = row
    Taro.uploadFile({
      url: url,
      filePath: tmpUrl,
      name: 'file',
      formData: {
        ...data
      },
      success: (res) => resolve(res),
      fail: (err) => reject(false)
    })
  })
}
// 根据图片获取url
/**
 * fileName 文件名称
 * tmpUrl 小程序临时地址
 * size 文件大小 单位为kb，需先从字节转为kb再转入
 * type 文件类型 png/jpg/pdf
 */
export const uploadFileByAl = (row) => {
  return new Promise((resolve, reject) => {
    let { fileName, tmpUrl, size, type } = row
    if (fileName.indexOf('.') == -1) {
      fileName = fileName + '.' + type
    }
    const params = {
      fileName
    }
    getSignedUrlErpAPI(params).then(async (res) => {
      if (res.code == 200) {
        const rowTemp = {
          url: res.data.urlStr,
          data: res.data,
          tmpUrl,
          fileInfo: {
            size: size,
            type: type,
            name: fileName,
            key: res?.data?.key
          }
        }

        const result = await ossUpload(rowTemp)
        // console.log('result', result)
        result.params = rowTemp
        resolve(result)
      } else {
        reject(false)
      }
    }).catch((err) => reject(err))
  })
}
// 根据图片获取url
/**
 * files 文件列表
 *    name 文件名称
 *    path 临时地址
 *    size 字节
 */
export const uploadFileDeal = (files, params) => {
  let query = {
    name: params?.fileName || '',
    hasInfo: params?.hasInfo || false,
  }
  let { hasInfo, name } = query
  return new Promise(async (resolve, reject) => {
    try {
      if (files?.length) {
        if (!hasInfo) files = files.map((m) => { return { path: m } })
        // console.log(files)
        let tempList = []
        for (let index = 0; index < files.length; index++) {
          let item = files[index]
          // files.map(async (item, index) => {
          if (!hasInfo) {
            // 获取文件大小
            let fileSize = await getFileInfo(item.path)
            const mobileIndex = item.path.indexOf('tmp_')
            const tmpIndex = mobileIndex != -1 ? mobileIndex : item.path.indexOf('tmp/')
            // const tmpLastIndex = item.path.lastIndexOf('.')
            // const tempName = item.path.slice(tmpIndex + 4, tmpLastIndex)
            // const suffix = item.path.substring(item.path.lastIndexOf('.'))
            // item.name = `${(name || tempName)}_${index}_${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}${suffix}`
            const tempName = item.path.slice(tmpIndex + 4)
            console.log(tempName, item.path)
            item.name = tempName
            item.size = fileSize.size
            // console.log(fileSize)
          }
          let fileName = item.name.replaceAll(/,/g, '')
          let type = fileName.substring(fileName.lastIndexOf('.') + 1)
          let params = {
            type,
            fileName,
            tmpUrl: item.path,
            size: item.size / 1024,
          }
          let res = await uploadFileByAl(params)
          // console.log(res)
          tempList.push(res)
          // })
        }
        console.log('tempList', tempList)
        resolve(tempList)
      } else {
        reject('请先选择文件')
      }
    } catch (err) {
      reject(err)
    }
    // uploadFileByAl()
  })
}

// 根据keys获取url keys:支持获取多个文件的下载地址，多个文件的key， 用英文逗号分隔
export const downloadFileByKeys = (keys, loading = true) => {
  return new Promise((resolve, reject) => {
    loading && Taro.showLoading({title: '加载中...', mask: true})
    getUrlByKeysErpAPI({ keys }).then((res) => {
      // console.log('down', res)
      if (res.code == 200) resolve(res)
      else reject(false)
    }).catch((err) => reject(err)).finally(() => {loading && Taro.hideLoading()})
  })
}

// 获取定位
export const getLocal = () => {
  return new Promise((resolve, reject) => {
    Taro.getLocation({
      // Taro.getFuzzyLocation({
        success: (res) => {
          console.log(res)
          let BMapCtx = new bmap.BMapWX({ ak: MAP_AK })
          // 发起regeocoding检索请求 
          BMapCtx.regeocoding({ 
            fail: err => {
              console.log(err)
              reject(err)
            }, 
            success: success => {
              console.log(success, success?.wxMarkerData[0])
              resolve(success)
              // setAddress(success?.wxMarkerData[0]?.address)
            }
          });
        },
        fail: (err) => {
          reject(err)
        }
      })
  })
}