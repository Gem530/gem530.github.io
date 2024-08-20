import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderSaleDetailVO, OrderSaleDetailForm, OrderSaleDetailQuery } from '@/api/financial/orderSaleDetail/types';

/**
 * 查询销售对账单列表
 * @param query
 * @returns {*}
 */

export const listOrderSaleDetail = (query?: OrderSaleDetailQuery): AxiosPromise<OrderSaleDetailVO[]> => {
  return request({
    url: '/financial/orderSaleDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询销售对账单详细
 * @param id
 */
export const getOrderSaleDetail = (id: string | number): AxiosPromise<OrderSaleDetailVO> => {
  return request({
    url: '/financial/orderSaleDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增销售对账单
 * @param data
 */
export const addOrderSaleDetail = (data: OrderSaleDetailForm) => {
  return request({
    url: '/financial/orderSaleDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改销售对账单
 * @param data
 */
export const updateOrderSaleDetail = (data: OrderSaleDetailForm) => {
  return request({
    url: '/financial/orderSaleDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除销售对账单
 * @param id
 */
export const delOrderSaleDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderSaleDetail/' + id,
    method: 'delete'
  });
};
