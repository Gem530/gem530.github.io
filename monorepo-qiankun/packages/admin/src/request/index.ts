import axios from "axios"
import router from "@/router"
import cache from '@/utils/cache'
import { getItem, setItem, removeItem, getLocalItem } from '@/utils/storage'
import { ElMessage, ElMessageBox } from "element-plus"

// 使用联合类型验证请求方法
type method = 'get' | 'delete' | 'post' | 'put'
// let loadingInstance: { close: () => void } | null = null
const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const timeout = 10000

/**
 * @author wenbin
 * @description 请求封装函数，会在这里自动对上传参数做 驼峰转下划线，对返回参数 下划线转驼峰。
 */
// config {
//   method = 'GET',
//   url = '',
//   data = {},
//   header = {},
//   timeout = 10000,
// }
function request (config: any): Promise<unknown> {
  config.timeout = config.timeout || timeout
  config.url = BASE_URL + config.url
  // console.log('token--', getLocalItem('token'))
  config.headers = config.headers || { 'Authorization': getLocalItem('token') || '' }

  // console.log(config, BASE_URL)

  // return config

  return new Promise((resolve, reject) => {
    // axios get/delete 请求的参数通过 params 字段传输，但是 post/put 通过 data 字段传输

    if (config.method == 'post' || config.method == 'put') {
      const requestObj = {
        url: config.url,
        data: config.data,
        time: new Date().getTime()
      }
      const sessionObj = getItem('sessionObj')
      if (!sessionObj) {
        setItem('sessionObj', requestObj)
        // cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                // 请求地址
        const s_data = sessionObj.data;              // 请求数据
        const s_time = sessionObj.time;              // 请求时间
        const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          // console.warn(`[${s_url}]: ` + message)
          reject(new Error(message))
        } else {
          setItem('sessionObj', requestObj)
          // cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }

    axios(config).then(res => {
      if (config.responseType) {
        resolve(res)
        return
      }
      const { status, data } = res
      if (status === 200 && data.code === 200) {
        resolve(data)
      } else if (data.code === 401 || data.code === 403) {
        ElMessageBox.confirm(
          '登录已过期，是否重新登录?',
          '提示'
        ).then(() => {
          removeItem('tagsView')
          removeItem('defaultActive')
          router.push('/admin/login')
        }).catch(() => {})
        reject(data)
      } else if (data.code === 409) {
        ElMessageBox.confirm(
          '您的账号已在其他设备登录，请重新登录',
          '提示'
        ).then(() => {
          removeItem('tagsView')
          removeItem('defaultActive')
          router.push('/admin/login')
        }).catch(() => {})
        reject(data)
      } else {
        ElMessage({
          message: data.msg,
          type: 'error'
        })
        reject(data)
      }
    }).catch(err => {
      ElMessage({
        message: err.message,
        type: 'error'
      })
      reject(err)
    })
  })
}

export default request

/** 以下是 axios 超时重新请求代码 **/
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
