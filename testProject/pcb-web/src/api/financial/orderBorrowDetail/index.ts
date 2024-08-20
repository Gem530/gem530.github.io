import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderBorrowDetailVO, OrderBorrowDetailForm, OrderBorrowDetailQuery } from '@/api/financial/orderBorrowDetail/types';

/**
 * 查询借料对账单明细列表
 * @param query
 * @returns {*}
 */

export const listOrderBorrowDetail = (query?: OrderBorrowDetailQuery): AxiosPromise<OrderBorrowDetailVO[]> => {
  return request({
    url: '/financial/orderBorrowDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询借料对账单明细详细
 * @param id
 */
export const getOrderBorrowDetail = (id: string | number): AxiosPromise<OrderBorrowDetailVO> => {
  return request({
    url: '/financial/orderBorrowDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增借料对账单明细
 * @param data
 */
export const addOrderBorrowDetail = (data: OrderBorrowDetailForm) => {
  return request({
    url: '/financial/orderBorrowDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改借料对账单明细
 * @param data
 */
export const updateOrderBorrowDetail = (data: OrderBorrowDetailForm) => {
  return request({
    url: '/financial/orderBorrowDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除借料对账单明细
 * @param id
 */
export const delOrderBorrowDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderBorrowDetail/' + id,
    method: 'delete'
  });
};
