import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CheckOrderVO, CheckOrderForm, CheckOrderQuery } from '@/api/inventory/checkOrder/types';

/**
 * 查询盘点单列表
 * @param query
 * @returns {*}
 */

export const listCheckOrder = (query?: CheckOrderQuery): AxiosPromise<CheckOrderVO[]> => {
  return request({
    url: '/inventory/checkOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询盘点单详细
 * @param id
 */
export const getCheckOrder = (id: string | number): AxiosPromise<CheckOrderVO> => {
  return request({
    url: '/inventory/checkOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增盘点单
 * @param data
 */
export const addCheckOrder = (data: CheckOrderForm) => {
  return request({
    url: '/inventory/checkOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改盘点单
 * @param data
 */
export const updateCheckOrder = (data: CheckOrderForm) => {
  return request({
    url: '/inventory/checkOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除盘点单
 * @param id
 */
export const delCheckOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/checkOrder/' + id,
    method: 'delete'
  });
};
