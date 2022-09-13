import request from '@/request'
import * as tsType from '../type'

/**
 * @author hjj
 * @description 登录接口
 * @param username 账号
 * @param password 密码
 */
 export function loginAPI (data: tsType.loginInfo): Promise<unknown> {
  return request({
      method: 'post',
      url: '/login',
      data
  })
}

/**
 * @author hjj
 * @description 获取用户信息接口
 */
 export function getInfoAPI (): Promise<unknown> {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

/**
 * @author hjj
 * @description 退出登录
 */
export function logoutAPI() {
  return request({
    url: '/logout',
    method: 'post'
  })
}