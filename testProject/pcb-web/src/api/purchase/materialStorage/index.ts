import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialStorageVO, MaterialStorageForm, MaterialStorageQuery } from '@/api/purchase/materialStorage/types';

/**
 * 查询物料仓库列表
 * @param query
 * @returns {*}
 */

export const listMaterialStorage = (query?: MaterialStorageQuery): AxiosPromise<MaterialStorageVO[]> => {
  return request({
    url: '/system/materialStorage/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料仓库列表-不分页
 * @param query
 * @returns {*}
 */

export const listMaterialStorageNoPage = (query?: any): AxiosPromise<MaterialStorageVO[]> => {
  return request({
    url: '/system/materialStorage/listNoPage',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料仓库详细
 * @param id
 */
export const getMaterialStorage = (id: string | number): AxiosPromise<MaterialStorageVO> => {
  return request({
    url: '/system/materialStorage/' + id,
    method: 'get'
  });
};

/**
 * 新增物料仓库
 * @param data
 */
export const addMaterialStorage = (data: MaterialStorageForm) => {
  return request({
    url: '/system/materialStorage',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料仓库
 * @param data
 */
export const updateMaterialStorage = (data: MaterialStorageForm) => {
  return request({
    url: '/system/materialStorage',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料仓库
 * @param id
 */
export const delMaterialStorage = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialStorage/' + id,
    method: 'delete'
  });
};
