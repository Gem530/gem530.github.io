import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderBackInventoryVO, OrderBackInventoryForm, OrderBackInventoryQuery } from '@/api/inventory/orderBackInventory/types';

/**
 * 查询退货产品处理列表
 * @param query
 * @returns {*}
 */

export const listOrderBackInventory = (query?: OrderBackInventoryQuery): AxiosPromise<OrderBackInventoryVO[]> => {
  return request({
    url: '/order/orderBackHandle/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询退货产品处理详细
 * @param id
 */
export const getOrderBackInventory = (id: string | number): AxiosPromise<OrderBackInventoryVO> => {
  return request({
    url: '/inventory/orderBackInventory/' + id,
    method: 'get'
  });
};

/**
 * 新增退货产品处理
 * @param data
 */
export const addOrderBackInventory = (data: OrderBackInventoryForm) => {
  return request({
    url: '/order/orderBackHandle',
    method: 'post',
    data: data
  });
};

/**
 * 修改退货产品处理
 * @param data
 */
export const updateOrderBackInventory = (data: OrderBackInventoryForm) => {
  return request({
    url: '/inventory/orderBackInventory',
    method: 'put',
    data: data
  });
};

/**
 * 删除退货产品处理
 * @param id
 */
export const delOrderBackInventory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/orderBackInventory/' + id,
    method: 'delete'
  });
};
