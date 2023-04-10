/**
 * 存储数据
 */
 export const setItem = (key:string, value:any) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

/**
 * 获取数据
 */
export const getItem = (key:any) => {
  const data:any = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 删除数据
 */
export const removeItem = (key:string) => {
  window.sessionStorage.removeItem(key)
}

/**
 * 删除所有数据
 */
export const removeAllItem = () => {
  window.sessionStorage.clear()
}

/**
 * 存储数据
 */
 export const setLocalItem = (key:string, value:any) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/**
 * 获取数据
 */
export const getLocalItem = (key:any) => {
  const data:any = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 删除数据
 */
export const removeLocalItem = (key:string) => {
  window.localStorage.removeItem(key)
}