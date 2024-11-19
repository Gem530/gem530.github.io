import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeliveryRecordVO, DeliveryRecordForm, DeliveryRecordQuery } from '@/api/order/deliveryRecord/types';

/**
 * 查询发货记录列表
 * @param query
 * @returns {*}
 */

export const listDeliveryRecord = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/list',
    method: 'get',
    params: query
  });
};
export const postListDeliveryRecord = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/list',
    method: 'post',
    data: query
  });
};

export const listSignDeliveryRecord = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/signList',
    method: 'get',
    params: query
  });
};

export const postListSignDeliveryRecord = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/signList',
    method: 'post',
    data: query
  });
};

export const getSignDeliveryRecordSum = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/signListSum',
    method: 'post',
    data: query
  });
};

export const queryBackSignListSum = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/backSignListSum',
    method: 'post',
    data: query
  });
};

export const queryOrderBackSignPageList = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/queryOrderBackSignPageList',
    method: 'get',
    params: query
  });
};

export const postQueryOrderBackSignPageList = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/queryOrderBackSignPageList',
    method: 'post',
    data: query
  });
};

export const accountList = (query?: DeliveryRecordQuery): AxiosPromise<DeliveryRecordVO[]> => {
  return request({
    url: '/order/deliveryRecord/accountList',
    method: 'get',
    params: query
  });
};
/**
 * 查询发货记录详细
 * @param id
 */
export const getDeliveryRecord = (id: string | number): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/order/deliveryRecord/' + id,
    method: 'get'
  });
};

export const getDeliveryRecordByCode = (code: string | number): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/order/deliveryRecord/detailByCode/' + code,
    method: 'get'
  });
};
/**
 * 查询打印发货记录详细
 * @param id
 */
export const getPrintDeliveryRecord = (id: string | number): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/order/deliveryRecord/printInfo/' + id,
    method: 'get'
  });
};

/**
 * 查询退货单的打印发货记录详细
 * @param id
 */
export const getOrderBackPrintDeliveryRecord = (id: string | number): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/order/deliveryRecord/orderBackPrintInfo/' + id,
    method: 'get'
  });
};

/**
 * 查询采购送货单的打印发货记录详细
 * @param id
 */
export const getPurchaseDeliveryPrintDeliveryRecord = (id: string | number): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/purchase/materialDelivery/'+id,
    method: 'get',
  });
};

/**
 * 新增发货记录
 * @param data
 */
export const addDeliveryRecord = (data: DeliveryRecordForm) => {
  return request({
    url: '/order/deliveryRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改发货记录
 * @param data
 */
export const updateDeliveryRecord = (data: DeliveryRecordForm) => {
  return request({
    url: '/order/deliveryRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除发货记录
 * @param id
 */
export const delDeliveryRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/deliveryRecord/' + id,
    method: 'delete'
  });
};
/**
 * 回签发货记录
 * @param id
 */
export const signDeliveryRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/deliveryRecord/sign/' + id,
    method: 'post'
  });
};
/**
 * 回签发货记录
 * @param id
 */
export const unSignDeliveryRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/deliveryRecord/unSign/' + id,
    method: 'post'
  });
};
export const getRefreshDeliveryInfoList = (query: any): AxiosPromise<DeliveryRecordVO> => {
  return request({
    url: '/order/deliveryRecord/getRefreshDeliveryInfoList',
    method: 'get',
    params: query
  });
};

/**
 * 修改关联物流信息
 * @param data
 */
export const updateDeliveryRecordLogNo = (data: DeliveryRecordForm) => {
  return request({
    url: '/order/deliveryRecord/updateLogNo',
    method: 'post',
    data: data
  });
};

/**
 * 物流下单
 * @param data
 */
export const createOrder = (data: any) => {
  return request({
    url: '/order/deliveryRecord/createOrder',
    method: 'post',
    data: data
  });
};
