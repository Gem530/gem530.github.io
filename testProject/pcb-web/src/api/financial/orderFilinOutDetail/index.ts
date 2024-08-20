import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderFilinOutDetailVO, OrderFilinOutDetailForm, OrderFilinOutDetailQuery } from '@/api/financial/orderFilinOutDetail/types';

/**
 * 查询外发菲林/网板对账单明细列表
 * @param query
 * @returns {*}
 */

export const listOrderFilinOutDetail = (query?: OrderFilinOutDetailQuery): AxiosPromise<OrderFilinOutDetailVO[]> => {
  return request({
    url: '/financial/orderFilinOutDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外发菲林/网板对账单明细详细
 * @param id
 */
export const getOrderFilinOutDetail = (id: string | number): AxiosPromise<OrderFilinOutDetailVO> => {
  return request({
    url: '/financial/orderFilinOutDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增外发菲林/网板对账单明细
 * @param data
 */
export const addOrderFilinOutDetail = (data: OrderFilinOutDetailForm) => {
  return request({
    url: '/financial/orderFilinOutDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改外发菲林/网板对账单明细
 * @param data
 */
export const updateOrderFilinOutDetail = (data: OrderFilinOutDetailForm) => {
  return request({
    url: '/financial/orderFilinOutDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除外发菲林/网板对账单明细
 * @param id
 */
export const delOrderFilinOutDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/orderFilinOutDetail/' + id,
    method: 'delete'
  });
};
