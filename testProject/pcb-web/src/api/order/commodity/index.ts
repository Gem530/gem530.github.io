import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CommodityVO, CommodityForm, CommodityQuery } from '@/api/order/commodity/types';

/**
 * 查询产品列表
 * @param query
 * @returns {*}
 */

export const listCommodity = (query?: CommodityQuery): AxiosPromise<CommodityVO[]> => {
  return request({
    url: '/order/commodity/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询产品详细
 * @param id
 */
export const getCommodity = (id: string | number): AxiosPromise<CommodityVO> => {
  return request({
    url: '/order/commodity/' + id,
    method: 'get'
  });
};

/**
 * 新增产品
 * @param data
 */
export const addCommodity = (data: CommodityForm) => {
  return request({
    url: '/order/commodity',
    method: 'post',
    data: data
  });
};

/**
 * 修改产品
 * @param data
 */
export const updateCommodity = (data: CommodityForm) => {
  return request({
    url: '/order/commodity',
    method: 'put',
    data: data
  });
};

/**
 * 删除产品
 * @param id
 */
export const delCommodity = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/commodity/' + id,
    method: 'delete'
  });
};
