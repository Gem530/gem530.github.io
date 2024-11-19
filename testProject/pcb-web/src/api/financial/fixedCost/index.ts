import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FixedCostVO, FixedCostForm, FixedCostQuery } from '@/api/cost/fixedCost/types';

/**
 * 查询固定成本列表
 * @param query
 * @returns {*}
 */

export const getFixedCostList = (query?: FixedCostQuery): AxiosPromise<FixedCostVO[]> => {
  return request({
    url: '/cost/fixedCost/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询固定成本详细
 * @param id
 */
export const getFixedCost = (id: any): AxiosPromise<FixedCostVO> => {
  return request({
    url: '/cost/fixedCost/' + id,
    method: 'get'
  });
};

/**
 * 新增固定成本
 * @param data
 */
export const addFixedCost = (data: FixedCostForm) => {
  return request({
    url: '/cost/fixedCost/addFixedCost',
    method: 'post',
    data: data
  });
};

/**
 * 修改固定成本
 * @param data
 */
export const updateFixedCost = (data: FixedCostForm) => {
  return request({
    url: '/cost/fixedCost/editFixedCost',
    method: 'post',
    data: data
  });
};

/**
 * 删除固定成本
 * @param id
 */
export const delFixedCost = (id: string | number | Array<string | number>) => {
  return request({
    url: '/cost/fixedCost/' + id,
    method: 'delete'
  });
};

/**
 * 导入水电费数据
 * @param key
 */
export const importData = (data: any) => {
  return request({
    url: '/cost/fixedCost/importData',
    method: 'post',
    data
  });
};
