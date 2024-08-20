import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftSupplierAutoOutVO, CraftSupplierAutoOutForm, CraftSupplierAutoOutQuery } from '@/api/basedata/craftSupplierAutoOut/types';

/**
 * 查询自动外协配置列表
 * @param query
 * @returns {*}
 */

export const listCraftSupplierAutoOut = (query?: CraftSupplierAutoOutQuery): AxiosPromise<CraftSupplierAutoOutVO[]> => {
  return request({
    url: '/basedata/craftSupplierAutoOut/list',
    method: 'post',
    data: query
  });
};

/**
 * 查询自动外协配置详细
 * @param id
 */
export const getCraftSupplierAutoOut = (id: string | number): AxiosPromise<CraftSupplierAutoOutVO> => {
  return request({
    url: '/basedata/craftSupplierAutoOut/' + id,
    method: 'get'
  });
};

/**
 * 新增自动外协配置
 * @param data
 */
export const addCraftSupplierAutoOut = (data: CraftSupplierAutoOutForm) => {
  return request({
    url: '/basedata/craftSupplierAutoOut',
    method: 'post',
    data: data
  });
};

/**
 * 修改自动外协配置
 * @param data
 */
export const updateCraftSupplierAutoOut = (data: CraftSupplierAutoOutForm) => {
  return request({
    url: '/basedata/craftSupplierAutoOut',
    method: 'put',
    data: data
  });
};

/**
 * 删除自动外协配置
 * @param id
 */
export const delCraftSupplierAutoOut = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftSupplierAutoOut/' + id,
    method: 'delete'
  });
};
