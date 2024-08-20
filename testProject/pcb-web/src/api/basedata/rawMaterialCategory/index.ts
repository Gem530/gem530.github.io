import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RawMaterialCategoryVO, RawMaterialCategoryForm, RawMaterialCategoryQuery } from '@/api/basedata/rawMaterialCategory/types';

/**
 * 查询原材料类别列表
 * @param query
 * @returns {*}
 */

export const listRawMaterialCategory = (query?: RawMaterialCategoryQuery): AxiosPromise<RawMaterialCategoryVO[]> => {
  return request({
    url: '/basedata/rawMaterialCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询原材料类别详细
 * @param id
 */
export const getRawMaterialCategory = (id: string | number): AxiosPromise<RawMaterialCategoryVO> => {
  return request({
    url: '/basedata/rawMaterialCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增原材料类别
 * @param data
 */
export const addRawMaterialCategory = (data: RawMaterialCategoryForm) => {
  return request({
    url: '/basedata/rawMaterialCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改原材料类别
 * @param data
 */
export const updateRawMaterialCategory = (data: RawMaterialCategoryForm) => {
  return request({
    url: '/basedata/rawMaterialCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除原材料类别
 * @param id
 */
export const delRawMaterialCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/rawMaterialCategory/' + id,
    method: 'delete'
  });
};

/**
 * 查询原材料类别列表不分页
 * @param query
 * @returns {*}
 */

export const listRawMaterialCategoryNoPage = (query?: RawMaterialCategoryQuery): AxiosPromise<RawMaterialCategoryVO[]> => {
  return request({
    url: '/basedata/rawMaterialCategory/listCategory',
    method: 'get',
    params: query
  });
};
