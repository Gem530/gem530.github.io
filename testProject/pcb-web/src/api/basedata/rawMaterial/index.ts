import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RawMaterialVO, RawMaterialForm, RawMaterialQuery } from '@/api/basedata/rawMaterial/types';

/**
 * 查询原料列表
 * @param query
 * @returns {*}
 */

export const listRawMaterial = (query?: RawMaterialQuery): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/basedata/rawMaterial/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询原料列表
 * @param query
 * @returns {*}
 */

export const listMaterial = (query?: RawMaterialQuery): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/basedata/rawMaterial/getList',
    method: 'get',
    params: query
  });
};

/**
 * 查询原料详细
 * @param id
 */
export const getRawMaterial = (id: string | number): AxiosPromise<RawMaterialVO> => {
  return request({
    url: '/basedata/rawMaterial/' + id,
    method: 'get'
  });
};

/**
 * 新增原料
 * @param data
 */
export const addRawMaterial = (data: RawMaterialForm) => {
  return request({
    url: '/basedata/rawMaterial',
    method: 'post',
    data: data
  });
};
/**
 * 修改原料状态
 * @param data
 */
export const editRawMaterialStatus = (data: any) => {
  return request({
    url: '/basedata/rawMaterial/updateStatus',
    method: 'post',
    data: data
  });
};

/**
 * 修改原料
 * @param data
 */
export const updateRawMaterial = (data: RawMaterialForm) => {
  return request({
    url: '/basedata/rawMaterial',
    method: 'put',
    data: data
  });
};

/**
 * 删除原料
 * @param id
 */
export const delRawMaterial = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/rawMaterial/' + id,
    method: 'delete'
  });
};

/**
 * 查询原料库存列表
 * @param query
 * @returns {*}
 */
export const listInvMaterial = (query?: RawMaterialQuery): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/system/materialInventory/getInventoryList',
    method: 'get',
    params: query
  });
};
/**
 * 查询原料库存列表
 * @param query
 * @returns {*}
 */
export const getRawSizeList = (query?: RawMaterialQuery): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/system/materialInventory/getRawSizeList',
    method: 'get',
    params: query
  });
};