import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InventoryVO, InventoryForm, InventoryQuery } from '@/api/inventory/inventory/types';

/**
 * 查询成品库存列表
 * @param query
 * @returns {*}
 */

export const listInventory = (query?: InventoryQuery): AxiosPromise<InventoryVO[]> => {
  return request({
    url: '/inventory/inventory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询产品库存数量
 * @param query
 * @returns {*}
 */
export const queryByCommodity = (query?: InventoryQuery): AxiosPromise<InventoryVO[]> => {
  return request({
    url: '/inventory/inventory/queryByCommodity',
    method: 'get',
    params: query
  });
};

/**
 * 查询成品库存详细
 * @param id
 */
export const getInventory = (id: string | number): AxiosPromise<InventoryVO> => {
  return request({
    url: '/inventory/inventory/' + id,
    method: 'get'
  });
};

/**
 * 新增成品库存
 * @param data
 */
export const addInventory = (data: InventoryForm) => {
  return request({
    url: '/inventory/inventory',
    method: 'post',
    data: data
  });
};

export const addInventoryCheck = (data: InventoryForm) => {
  return request({
    url: '/inventory/inventory/checkIn',
    method: 'post',
    data: data
  });
};

/**
 * 修改成品库存
 * @param data
 */
export const updateInventory = (data: InventoryForm) => {
  return request({
    url: '/inventory/inventory',
    method: 'put',
    data: data
  });
};

/**
 * 删除成品库存
 * @param id
 */
export const delInventory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/inventory/' + id,
    method: 'delete'
  });
};
  
//成品库存++
export const addCommodityCheck = (data: InventoryForm) => {
  return request({
    url: '/inventory/inventory/addCommodityCheck',
    method: 'post',
    data: data
  });
};

/**
 * 查询产品库存数量
 * @param query
 * @returns {*}
 */
export const queryInventoryByCommodity = (query?: any): AxiosPromise<InventoryVO[]> => {
  return request({
    url: '/inventory/inventory/getInventory',
    method: 'post',
    data: query
  });
};

/**
 * 查询尾数库存列表
 * @param query
 * @returns {*}
 */
export const listRelaInventory = (query?: InventoryQuery): AxiosPromise<InventoryVO[]> => {
  return request({
    url: '/production/relationCommodity/list',
    method: 'get',
    params: query
  });
};

/**
 * 解锁尾数库存
 * @param query
 * @returns {*}
 */
export const unLockRelaInventory = (id?: any): AxiosPromise<InventoryVO[]> => {
  return request({
    url: '/production/relationCommodity/unlock/'+ id,
    method: 'get'
  });
};

