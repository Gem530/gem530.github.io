import request from '../../../util/request';
import config from "../../../config/commonConfig";

const {
  api: {
    outSource: {
      orderList,
      orderDetail,
      orderCount,
      orderComplete,
      orderEntering,
      orderScrap,
      orderUser,
      orderScrapQuantity
    }
}} = config;

// https://docs.qq.com/doc/DUHZlS3hkU3h4ZVRm
// 1.外协加工单列表
export const orderListAPI = (params) => {
    return request.get(orderList, params, true);
}
// 查询外协加工单详情
export const orderDetailAPI = (id) => {
  return request.get(orderDetail + id, {}, true);
}
// 查询外协加工单详情
export const orderCountAPI = (params) => {
  return request.get(orderCount, params, true);
}
// 加工完成
export const orderCompleteAPI = (params) => {
  return request.postJson(orderComplete, params, true);
}
//加工录入
export const orderEnteringAPI = (params) => {
  return request.postJson(orderEntering, params, true);
}
//报废录入
export const orderScrapAPI = (params) => {
  return request.postJson(orderScrap, params, true);
}
//责任人
export const orderUserAPI = (id) => {
  return request.get(orderUser + id, {}, true);
}
//报废数量
export const orderScrapQuantityAPI = (id) => {
  return request.get(orderScrapQuantity + id, {}, true);
}
