import request from '@/request'
import * as tsType from '../type'
/**
 * @author hjj
 * @description 用于动态接口
 */
 export function baseAPI (req: tsType.baseAPIType<any>): Promise<unknown> {
  return request(req)
}

/**
 * @author hjj
 * @description 上传图片
 * @param fileTo 账号
 * @param file 密码
 */
 export function uploadAPI (data: FormData): Promise<unknown> {
  return request({
      method: 'post',
      url: '/upload/img',
      data
  })
}