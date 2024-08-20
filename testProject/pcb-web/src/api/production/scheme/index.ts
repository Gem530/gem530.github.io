import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SchemeVO, SchemeForm, SchemeQuery } from '@/api/production/scheme/types';

/**
 * 查询生产-大料投料列表
 * @param query
 * @returns {*}
 */

export const listScheme = (query?: SchemeQuery): AxiosPromise<SchemeVO[]> => {
  return request({
    url: '/production/scheme/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产-大料投料详细
 * @param id
 */
export const getScheme = (id: string | number): AxiosPromise<SchemeVO> => {
  return request({
    url: '/production/scheme/' + id,
    method: 'get'
  });
};

/**
 * 新增生产-大料投料
 * @param data
 */
export const addScheme = (data: SchemeForm) => {
  return request({
    url: '/production/scheme',
    method: 'post',
    data: data
  });
};

/**
 * 修改生产-大料投料
 * @param data
 */
export const updateScheme = (data: SchemeForm) => {
  return request({
    url: '/production/scheme',
    method: 'put',
    data: data
  });
};

/**
 * 删除生产-大料投料
 * @param id
 */
export const delScheme = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/scheme/' + id,
    method: 'delete'
  });
};
