import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RecordVO, RecordForm, RecordQuery } from '@/api/purchase/record/types';

/**
 * 查询操作记录 列表
 * @param query
 * @returns {*}
 */

export const listRecord = (query?: RecordQuery): AxiosPromise<RecordVO[]> => {
  return request({
    url: '/system/record/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询操作记录 详细
 * @param id
 */
export const getRecord = (id: string | number): AxiosPromise<RecordVO> => {
  return request({
    url: '/system/record/' + id,
    method: 'get'
  });
};

/**
 * 新增操作记录
 * @param data
 */
export const addRecord = (data: RecordForm) => {
  return request({
    url: '/system/record',
    method: 'post',
    data: data
  });
};

/**
 * 修改操作记录
 * @param data
 */
export const updateRecord = (data: RecordForm) => {
  return request({
    url: '/system/record',
    method: 'put',
    data: data
  });
};

/**
 * 删除操作记录
 * @param id
 */
export const delRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/record/' + id,
    method: 'delete'
  });
};
