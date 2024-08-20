import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderHalfProcessOutDetailVO, OrderHalfProcessOutDetailForm, OrderHalfProcessOutDetailQuery } from '@/api/financial/orderHalfProcessOutDetail/types';

/**
 * 查询外协加工对账单明细列表
 * @param query
 * @returns {*}
 */

export const listOrderHalfProcessOutDetail = (query?: OrderHalfProcessOutDetailQuery): AxiosPromise<OrderHalfProcessOutDetailVO[]> => {
  return request({
    url: '/financial/orderHalfProcessOutDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工对账单明细详细
 * @param id
 */
export const getOrderHalfProcessOutDetail = (id: string | number): AxiosPromise<OrderHalfProcessOutDetailVO> => {
  return request({
    url: '/financial/orderHalfProcessOutDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增外协加工对账单明细
 * @param data
 */
export const addOrderHalfProcessOutDetail = (data: OrderHalfProcessOutDetailForm) => {
  return request({
    url: '/financial/orderHalfProcessOutDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工对账单明细
 * @param data
 */
export const updateOrderHalfProcessOutDetail = (data: OrderHalfProcessOutDetailForm) => {
  return request({
    url: '/financial/orderHalfProcessOutDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工对账单明细
 * @param id
 */
export const delOrderHalfProcessOutDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderHalfProcessOutDetail/' + id,
    method: 'delete'
  });
};
