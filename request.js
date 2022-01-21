/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { toCamels, toUnderLine, isMobileUtil } from '../utils/index'
import { BASE_URL } from '@/config/config'
import { Loading } from 'element-ui'
import { Toast } from 'vant'
import axios from 'axios'

// 使用联合类型验证请求方法
type method = 'get' | 'GET' | 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT'
const isPc = !isMobileUtil()
let loadingInstance: { close: () => void } | null = null

/**
 * @author wenbin
 * @description 请求封装函数，会在这里自动对上传参数做 驼峰转下划线，对返回参数 下划线转驼峰。
 * @param method 请求方法
 * @param url 请求地址
 * @param data 携带参数
 * @param showLoading 是否现实 loading 层
 * @param header 自定义请求头部
 * @param timeOut 自定义超时时长
 */
export function request ({
  method = 'GET',
  url = '',
  data = {},
  showLoading = false,
  header = {},
  timeout = 60000
}): Promise<unknown> {
  openLoading(showLoading)

  return new Promise((resolve, reject) => {
    // axios get/delete 请求的参数通过 params 字段传输，但是 post/put 通过 data 字段传输
    let temp = {}
    if (method === 'post' || method === 'POST' || method === 'put' || method === 'PUT') {
      temp = { data: toUnderLine(data || {}) }
    } else if (method === 'delete' || method === 'DELETE') {
      const param = toUnderLine(data || {})
      temp = { data: param, params: param }
    } else {
      temp = { params: toUnderLine(data || {}) }
    }

    axios({
      ...temp,
      timeout,
      url: BASE_URL + url,
      method: method as method,
      headers: Object.assign({ 'Access-Token': localStorage.getItem('Token') }, header)
    }).then(res => {
      const { status, data } = res
      if (status === 200 && data.code === 0) {
        resolve(toCamels(data))
      } else {
        reject(toCamels(data))
      }
    }).catch(err => {
      reject(err)
    }).finally(() => closeLoading(showLoading))
  })
}

/**
 * @author wenbin
 * @description 上传文件封装函数
 * @param url 上传地址
 * @param formData 上传数据，其中必须包含 'file'
 */
export function uploadFile (url: string, formData: FormData): Promise <unknown> {
  openLoading(true)

  return new Promise((resolve, reject) => {
    axios.post(url, formData, { headers: { 'Access-Token': localStorage.getItem('Token') } }).then(res => {
      resolve(toCamels(res.data))
    }).catch(err => {
      reject(err)
    }).finally(() => closeLoading(true))
  })
}

/**
 * @author wenbin
 * @description 根据不同环境使用不同的加载提示 移动端：vant-toast pc端：element-ui loadingInstance
 * @param showLoading 是否需要现实请求loading动画
 */
export function openLoading (showLoading: boolean): any {
  if (showLoading) {
    if (isPc) {
      const options = {
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, .7)'
      }
      loadingInstance = Loading.service(options)
    } else {
      // 自定义加载图标
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
        loadingType: 'spinner'
      })
    }
  }
}

/**
 * @author wenbin
 * @description 关闭请求动画
 * @param showLoading 是否需要显示请求loading
 */
export function closeLoading (showLoading: boolean): any {
  if (showLoading) {
    if (isPc) {
      if (loadingInstance) {
        loadingInstance.close()
      }
    } else {
      Toast.clear()
    }
  }
}

/** 以下是 axios 超时重新请求代码，因为种种原因，无限期关闭，请不要擅自打开 by wenbin。 **/

// // 设置全局的请求次数，请求的间隙
// const defaults = axios.defaults as any

// defaults.retry = 2
// defaults.retryDelay = 1000
// defaults.timeout = 3000

// // 使用响应拦截器，统计超时次数，超过1s没有响应（注意时响应超过1s）为超时
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
//   const config = err.config
//   // If config does not exist or the retry option is not set, reject
//   if (!config || !config.retry) return Promise.reject(err)

//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0

//   // Check if we've maxed out the total number of retries
//   if (config.__retryCount >= config.retry) {
//     // Reject with the error
//     alert('服务器开小差了～～')
//     return Promise.reject(err)
//   }

//   // Increase the retry count
//   config.__retryCount += 1

//   // Create new promise to handle exponential backoff
//   const backoff = new Promise(function (resolve) {
//     setTimeout(function () {
//       resolve('success')
//     }, config.retryDelay || 1)
//   })

//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function () {
//     return axios(config)
//   })
// })
