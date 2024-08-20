import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderFullProcessOutDetailVO, OrderFullProcessOutDetailForm, OrderFullProcessOutDetailQuery } from '@/api/financial/orderFullProcessOutDetail/types';

/**
 * 查询外协全制程对账单明细列表
 * @param query
 * @returns {*}
 */

export const listOrderFullProcessOutDetail = (query?: OrderFullProcessOutDetailQuery): AxiosPromise<OrderFullProcessOutDetailVO[]> => {
  return request({
    url: '/financial/orderFullProcessOutDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协全制程对账单明细详细
 * @param id
 */
export const getOrderFullProcessOutDetail = (id: string | number): AxiosPromise<OrderFullProcessOutDetailVO> => {
  return request({
    url: '/financial/orderFullProcessOutDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增外协全制程对账单明细
 * @param data
 */
export const addOrderFullProcessOutDetail = (data: OrderFullProcessOutDetailForm) => {
  return request({
    url: '/financial/orderFullProcessOutDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协全制程对账单明细
 * @param data
 */
export const updateOrderFullProcessOutDetail = (data: OrderFullProcessOutDetailForm) => {
  return request({
    url: '/financial/orderFullProcessOutDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协全制程对账单明细
 * @param id
 */
export const delOrderFullProcessOutDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderFullProcessOutDetail/' + id,
    method: 'delete'
  });
};
