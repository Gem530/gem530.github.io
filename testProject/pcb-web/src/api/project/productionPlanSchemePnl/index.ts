import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductionPlanSchemePnlVO, ProductionPlanSchemePnlForm, ProductionPlanSchemePnlQuery } from '@/api/project/productionPlanSchemePnl/types';

/**
 * 查询工程- 工艺制作单开料方案和pnl的中间列表
 * @param query
 * @returns {*}
 */

export const listProductionPlanSchemePnl = (query?: ProductionPlanSchemePnlQuery): AxiosPromise<ProductionPlanSchemePnlVO[]> => {
  return request({
    url: '/project/productionPlanSchemePnl/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程- 工艺制作单开料方案和pnl的中间详细
 * @param id
 */
export const getProductionPlanSchemePnl = (id: string | number): AxiosPromise<ProductionPlanSchemePnlVO> => {
  return request({
    url: '/project/productionPlanSchemePnl/' + id,
    method: 'get'
  });
};

/**
 * 新增工程- 工艺制作单开料方案和pnl的中间
 * @param data
 */
export const addProductionPlanSchemePnl = (data: ProductionPlanSchemePnlForm) => {
  return request({
    url: '/project/productionPlanSchemePnl',
    method: 'post',
    data: data
  });
};

/**
 * 修改工程- 工艺制作单开料方案和pnl的中间
 * @param data
 */
export const updateProductionPlanSchemePnl = (data: ProductionPlanSchemePnlForm) => {
  return request({
    url: '/project/productionPlanSchemePnl',
    method: 'put',
    data: data
  });
};

/**
 * 删除工程- 工艺制作单开料方案和pnl的中间
 * @param id
 */
export const delProductionPlanSchemePnl = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlanSchemePnl/' + id,
    method: 'delete'
  });
};
