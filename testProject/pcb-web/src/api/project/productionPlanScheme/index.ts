import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductionPlanSchemeVO, ProductionPlanSchemeForm, ProductionPlanSchemeQuery } from '@/api/project/productionPlanScheme/types';

/**
 * 查询工程- 开料方案列表
 * @param query
 * @returns {*}
 */

export const listProductionPlanScheme = (query?: ProductionPlanSchemeQuery): AxiosPromise<ProductionPlanSchemeVO[]> => {
  return request({
    url: '/project/productionPlanScheme/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程- 开料方案详细
 * @param id
 */
export const getProductionPlanScheme = (id: string | number): AxiosPromise<ProductionPlanSchemeVO> => {
  return request({
    url: '/project/productionPlanScheme/' + id,
    method: 'get'
  });
};

/**
 * 新增工程- 开料方案
 * @param data
 */
export const addProductionPlanScheme = (data: ProductionPlanSchemeForm) => {
  return request({
    url: '/project/productionPlanScheme',
    method: 'post',
    data: data
  });
};

/**
 * 修改工程- 开料方案
 * @param data
 */
export const updateProductionPlanScheme = (data: ProductionPlanSchemeForm) => {
  return request({
    url: '/project/productionPlanScheme',
    method: 'put',
    data: data
  });
};

/**
 * 删除工程- 开料方案
 * @param id
 */
export const delProductionPlanScheme = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlanScheme/' + id,
    method: 'delete'
  });
};
