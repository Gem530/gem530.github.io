import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  MaterialProductionInOutVO,
  MaterialProductionInOutForm,
  MaterialProductionInOutQuery,
  DirectProductInout
} from '@/api/purchase/materialProductionInOut/types';

/**
 * 查询发料退料列表
 * @param query
 * @returns {*}
 */
export const listMaterialProductionInOut = (query?: MaterialProductionInOutQuery): AxiosPromise<MaterialProductionInOutVO[]> => {
  return request({
    url: '/purchase/materialProductionInOut/list',
    method: 'get',
    params: query
  });
};

/**
 * 生产物料发料确定
 */
export const saveProductionInout = (data: DirectProductInout) => {
  return request({
    url: '/purchase/materialProductionInOut/saveProductionInout',
    method: 'post',
    data: data
  });
};

/**
 *查詢发料物料早过期日期
 */
/*export const queryProductInout = (data: DirectProductInout) => {
  return request({
    url: '/system/materialInventory/inventorySelectList',
    method: 'post',
    data: data
  });
};*/


/**
 * 查询发料退料详细
 * @param id
 */
export const getMaterialProductionInOut = (id: string | number): AxiosPromise<MaterialProductionInOutVO> => {
  return request({
    url: '/purchase/materialProductionInOut/' + id,
    method: 'get'
  });
};

/**
 * 新增发料退料
 * @param data
 */
export const addMaterialProductionInOut = (data: MaterialProductionInOutForm) => {
  return request({
    url: '/purchase/materialProductionInOut',
    method: 'post',
    data: data
  });
};

/**
 * 修改发料退料
 * @param data
 */
export const updateMaterialProductionInOut = (data: MaterialProductionInOutForm) => {
  return request({
    url: '/purchase/materialProductionInOut',
    method: 'put',
    data: data
  });
};

/**
 * 发料退料
 * @param data
 */
export const saveMaterialRerturn = (data: MaterialProductionInOutForm) => {
  return request({
    url: '/purchase/materialProductionInOut/saveMaterialRerturn',
    method: 'put',
    data: data
  });
};

/**
 * 删除发料退料
 * @param id
 */
export const delMaterialProductionInOut = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialProductionInOut/' + id,
    method: 'delete'
  });
};
