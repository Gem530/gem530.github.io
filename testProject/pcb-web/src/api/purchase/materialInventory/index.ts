import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialInventoryVO, MaterialInventoryForm, MaterialInventoryQuery } from '@/api/purchase/materialInventory/types';
import {DirectMaterialReceipt, DirectMaterialReceive} from "@/api/purchase/materialReceive/types";

/**
 * 查询物料库存列表
 * @param query
 * @returns {*}
 */
export const listMaterialInventory = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/list',
    method: 'get',
    params: query
  });
};
/**
 * 查询物料库存列表count
 * @param query
 * @returns {*}
 */
export const listCountMaterialInventory = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/count',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料库存列表count
 * @param query
 * @returns {*}
 */
export const listCountV2 = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/countV2',
    method: 'get',
    params: query
  });
};
/**
 * 查询物料库存列表
 * @param query
 * @returns {*}
 */

export const getMaterialInventoryList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/purchase/materialApply/materialInventory',
    method: 'get',
    params: query
  });
};

/**
 * 物料盘点  物料库存列表
 * @param query
 * @returns {*}
 */
export const listRawMaterialInventory = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/rawMaterialInventoryList',
    method: 'get',
    params: query
  });
};


/**
 * 选择物料查询物料库存列表
 * @param query
 * @returns {*}
 */
export const materialInventorySelectList = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/materialInventorySelectList',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料库存详细
 * @param id
 */
export const getMaterialInventory = (id: string | number): AxiosPromise<MaterialInventoryVO> => {
  return request({
    url: '/system/materialInventory/' + id,
    method: 'get'
  });
};

/**
 * 新增物料库存
 * @param data
 */
export const addMaterialInventory = (data: MaterialInventoryForm) => {
  return request({
    url: '/system/materialInventory',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料库存
 * @param data
 */
export const updateMaterialInventory = (data: MaterialInventoryForm) => {
  return request({
    url: '/system/materialInventory',
    method: 'put',
    data: data
  });
};

/**
 * 物料出库保存
 * @param data
 */
export const updateMaterialInventoryInOutRecord = (data: DirectMaterialReceive) => {
  return request({
    url: '/system/materialInventory/updateInventory',
    method: 'post',
    data: data
  });
};

/**
 * 物料转仓
 * @param data
 */
export const updateMaterialRollInventoryInOutRecord = (data: MaterialInventoryForm) => {
  return request({
    url: '/system/materialInventory/updateRollInventory',
    method: 'put',
    data: data
  });
};

/**
 * 物料退货
 * @param data
 */
export const updateMaterialBackInventoryInOutRecord = (data: DirectMaterialReceipt) => {
  return request({
    url: '/system/materialInventory/updateBackInventory',
    method: 'post',
    data: data
  });
};


/**
 * 删除物料库存
 * @param id
 */
export const delMaterialInventory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialInventory/' + id,
    method: 'delete'
  });
};

/**
 * 查询物料库存列表
 * @param data
 * @returns {*}
 */
export const listMaterialInventoryList = (data?: any): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/queryList',
    method: 'post',
    data: data
  });
};

/**
 * 打印查询物料库存信息
 * @param query
 * @returns {*}
 */
export const printMaterialList = (query?: MaterialInventoryQuery): AxiosPromise<MaterialInventoryVO[]> => {
  return request({
    url: '/system/materialInventory/printList',
    method: 'get',
    params: query
  });
};
