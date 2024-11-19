import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceCountProcessAttrVO, SourceCountProcessAttrForm, SourceCountProcessAttrQuery } from '@/api/outsource/sourceCountProcessAttr/types';

/**
 * 查询外协接单管理-计价配置公用参数列表
 * @param query
 * @returns {*}
 */

export const listSourceCountProcessAttr = (query?: SourceCountProcessAttrQuery): AxiosPromise<SourceCountProcessAttrVO[]> => {
  return request({
    url: '/outsource/sourceCountProcessAttr/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单管理-计价配置公用参数详细
 * @param id
 */
export const getSourceCountProcessAttr = (id: string | number): AxiosPromise<SourceCountProcessAttrVO> => {
  return request({
    url: '/outsource/sourceCountProcessAttr/' + id,
    method: 'get'
  });
};

/**
 * 新增外协接单管理-计价配置公用参数
 * @param data
 */
export const addSourceCountProcessAttr = (data: SourceCountProcessAttrForm) => {
  return request({
    url: '/outsource/sourceCountProcessAttr',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单管理-计价配置公用参数
 * @param data
 */
export const updateSourceCountProcessAttr = (data: SourceCountProcessAttrForm) => {
  return request({
    url: '/outsource/sourceCountProcessAttr',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单管理-计价配置公用参数
 * @param id
 */
export const delSourceCountProcessAttr = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceCountProcessAttr/' + id,
    method: 'delete'
  });
};
