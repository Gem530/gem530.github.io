import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderBackInventoryRecordVO, OrderBackInventoryRecordForm, OrderBackInventoryRecordQuery } from '@/api/inventory/orderBackInventoryRecord/types';

/**
 * 查询退货产品处理记录列表
 * @param query
 * @returns {*}
 */

export const listOrderBackInventoryRecord = (query?: OrderBackInventoryRecordQuery): AxiosPromise<OrderBackInventoryRecordVO[]> => {
  return request({
    url: '/order/orderBackHandle/list',
    method: 'get',
    params: query
  });
};

export const listOrderBackInventoryRecord1 = (query?: OrderBackInventoryRecordQuery): AxiosPromise<OrderBackInventoryRecordVO[]> => {
  return request({
    url: '/order/orderBackHandle/list1',
    method: 'get',
    params: query
  });
};

/**
 * 查询退货产品处理记录详细
 * @param id
 */
export const getOrderBackInventoryRecord = (id: string | number): AxiosPromise<OrderBackInventoryRecordVO> => {
  return request({
    url: '/inventory/orderBackInventoryRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增退货产品处理记录
 * @param data
 */
export const addOrderBackInventoryRecord = (data: OrderBackInventoryRecordForm) => {
  return request({
    url: '/order/orderBackHandle',
    method: 'put',
    data: data
  });
};



/**
 * 修改退货产品处理记录
 * @param data
 */
export const updateOrderBackInventoryRecord = (data: OrderBackInventoryRecordForm) => {
  return request({
    url: '/order/orderBackHandle',
    method: 'post',
    data: data
  });
};

/**
 * 删除退货产品处理记录
 * @param id
 */
export const delOrderBackInventoryRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/orderBackInventoryRecord/' + id,
    method: 'delete'
  });
};

/**
 * 单号,完成状态查询退货产品处理记录
 * @param id
 */
export const getOrderBackRecordByNo = (id: string | number, status: string): AxiosPromise<OrderBackInventoryRecordVO> => {
  return request({
    url: '/order/orderBackHandle/getRecordByNo/' + id + '/' + status,
    method: 'get'
  });
};
