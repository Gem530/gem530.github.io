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
      url: '/api/login',
      data
  })
}