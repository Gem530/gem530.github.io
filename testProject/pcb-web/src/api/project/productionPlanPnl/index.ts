import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductionPlanPnlVO, ProductionPlanPnlForm, ProductionPlanPnlQuery } from '@/api/project/productionPlanPnl/types';

/**
 * 查询工程- 工艺制作单里面的PNL列表
 * @param query
 * @returns {*}
 */

export const listProductionPlanPnl = (query?: ProductionPlanPnlQuery): AxiosPromise<ProductionPlanPnlVO[]> => {
  return request({
    url: '/project/productionPlanPnl/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程- 工艺制作单里面的PNL详细
 * @param id
 */
export const getProductionPlanPnl = (id: string | number): AxiosPromise<ProductionPlanPnlVO> => {
  return request({
    url: '/project/productionPlanPnl/' + id,
    method: 'get'
  });
};

/**
 * 新增工程- 工艺制作单里面的PNL
 * @param data
 */
export const addProductionPlanPnl = (data: ProductionPlanPnlForm) => {
  return request({
    url: '/project/productionPlanPnl',
    method: 'post',
    data: data
  });
};

/**
 * 修改工程- 工艺制作单里面的PNL
 * @param data
 */
export const updateProductionPlanPnl = (data: ProductionPlanPnlForm) => {
  return request({
    url: '/project/productionPlanPnl',
    method: 'put',
    data: data
  });
};

/**
 * 删除工程- 工艺制作单里面的PNL
 * @param id
 */
export const delProductionPlanPnl = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlanPnl/' + id,
    method: 'delete'
  });
};
