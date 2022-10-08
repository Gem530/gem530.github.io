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

/**
 * @author hjj
 * @description app操作日志列表
 */
export function sysLogAPI(params: tsType.appoperateList) {
  return request({
    url: "/app/operLog/page",
    method: "get",
    params
  });
}

/**
 * @author hjj
 * @description 批量删除app操作日志列表
 */
export function delSysLogAPI(operIds: string) {
  return request({
    url: `/app/operLog/del/${operIds}`,
    method: "delete"
  });
}