import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderWriteOffRecordVO, OrderWriteOffRecordForm, OrderWriteOffRecordQuery } from '@/api/financial/orderWriteOffRecord/types';

/**
 * 查询冲销记录列表
 * @param query
 * @returns {*}
 */

export const listOrderWriteOffRecord = (query?: OrderWriteOffRecordQuery): AxiosPromise<OrderWriteOffRecordVO[]> => {
  return request({
    url: '/financial/orderWriteOffRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询冲销记录详细
 * @param id
 */
export const getOrderWriteOffRecord = (id: string | number): AxiosPromise<OrderWriteOffRecordVO> => {
  return request({
    url: '/financial/orderWriteOffRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增冲销记录
 * @param data
 */
export const addOrderWriteOffRecord = (data: OrderWriteOffRecordForm) => {
  return request({
    url: '/financial/orderWriteOffRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改冲销记录
 * @param data
 */
export const updateOrderWriteOffRecord = (data: OrderWriteOffRecordForm) => {
  return request({
    url: '/financial/orderWriteOffRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除冲销记录
 * @param id
 */
export const delOrderWriteOffRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderWriteOffRecord/' + id,
    method: 'delete'
  });
};
