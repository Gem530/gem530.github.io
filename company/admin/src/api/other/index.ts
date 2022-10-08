import request from '@/request'
import * as tsType from '../type'

/**
 * @author hjj
 * @description 获取渠道标识列表
 * @param phoneNum 手机号
 * @param sendState 状态
 * @param pageIndex 页码
 * @param pageSize 每页总量
 */
export function getListAPI(params: tsType.channleList) {
  return request({
    url: "/v1/sms/page",
    method: "get",
    params
  });
}