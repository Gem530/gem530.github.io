import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialMonthInventoryVO, MaterialMonthInventoryForm, MaterialMonthInventoryQuery } from '@/api/purchase/materialMonthInventory/types';

/**
 * 查询物料月度结存列表
 * @param query
 * @returns {*}
 */

export const listMaterialMonthInventory = (query?: MaterialMonthInventoryQuery): AxiosPromise<MaterialMonthInventoryVO[]> => {
  return request({
    url: '/system/materialMonthInventory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料月度结存详细
 * @param id
 */
export const getMaterialMonthInventory = (id: string | number): AxiosPromise<MaterialMonthInventoryVO> => {
  return request({
    url: '/system/materialMonthInventory/' + id,
    method: 'get'
  });
};

/**
 * 新增物料月度结存
 * @param data
 */
export const addMaterialMonthInventory = (data: MaterialMonthInventoryForm) => {
  return request({
    url: '/system/materialMonthInventory',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料月度结存
 * @param data
 */
export const updateMaterialMonthInventory = (data: MaterialMonthInventoryForm) => {
  return request({
    url: '/system/materialMonthInventory',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料月度结存
 * @param id
 */
export const delMaterialMonthInventory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialMonthInventory/' + id,
    method: 'delete'
  });
};
