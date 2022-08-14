import axios from "axios"
import { BASE_URL } from '@/config/index'

// 使用联合类型验证请求方法
type method = 'get' | 'GET' | 'delete' | 'DELETE' | 'post' | 'POST' | 'put' | 'PUT'
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
  header = {},
  timeout = 60000,
  showLoading = false
}): Promise<unknown> {

  return new Promise((resolve, reject) => {
    // axios get/delete 请求的参数通过 params 字段传输，但是 post/put 通过 data 字段传输
    let temp = {}
    if (method === 'post' || method === 'POST' || method === 'put' || method === 'PUT') {
      temp = { data: data || {} }
    }
    //  else if (method === 'delete' || method === 'DELETE') {
    //   const param = data || {}
    //   temp = { data: param, params: param }
    // } 
    else {
      temp = { params: data || {} }
    }

    axios({
      ...temp,
      timeout,
      url: BASE_URL + url,
      method: method as method,
      headers: Object.assign({ 'token': 'Bearer ' + (sessionStorage.getItem('token') || '') }, header) as any
    }).then(res => {
      const { status, data } = res
      if (status === 200 && data.code !== 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(err => {
      reject({...err, message: err.response.data})
    })
  })
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
