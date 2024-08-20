import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialIqcVO, MaterialIqcForm, MaterialIqcQuery } from '@/api/purchase/materialIqc/types';

/**
 * 查询IQC检测记录列表
 * @param query
 * @returns {*}
 */

export const listMaterialIqc = (query?: MaterialIqcQuery): AxiosPromise<MaterialIqcVO[]> => {
  return request({
    url: '/system/materialIqc/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询IQC检测记录详细
 * @param id
 */
export const getMaterialIqc = (id: string | number): AxiosPromise<MaterialIqcVO> => {
  return request({
    url: '/system/materialIqc/' + id,
    method: 'get'
  });
};

/**
 * 新增IQC检测记录
 * @param data
 */
export const addMaterialIqc = (data: MaterialIqcForm) => {
  return request({
    url: '/system/materialIqc',
    method: 'post',
    data: data
  });
};

/**
 * 修改IQC检测记录
 * @param data
 */
export const updateMaterialIqc = (data: MaterialIqcForm) => {
  return request({
    url: '/system/materialIqc',
    method: 'put',
    data: data
  });
};

/**
 * 删除IQC检测记录
 * @param id
 */
export const delMaterialIqc = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialIqc/' + id,
    method: 'delete'
  });
};
