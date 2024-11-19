import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeptVO, DeptForm, DeptQuery } from '@/api/cost/dept/types';

/**
 * 查询部门成本列表
 * @param query
 * @returns {*}
 */

export const listDept = (query?: DeptQuery): AxiosPromise<DeptVO[]> => {
  return request({
    url: '/cost/dept/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询部门成本详细
 * @param id
 */
export const getDept = (id: string | number): AxiosPromise<DeptVO> => {
  return request({
    url: '/cost/dept/' + id,
    method: 'get'
  });
};

/**
 * 新增部门成本
 * @param data
 */
export const addDept = (data: DeptForm) => {
  return request({
    url: '/cost/dept',
    method: 'post',
    data: data
  });
};

/**
 * 修改部门成本
 * @param data
 */
export const updateDept = (data: DeptForm) => {
  return request({
    url: '/cost/dept',
    method: 'put',
    data: data
  });
};

/**
 * 删除部门成本
 * @param id
 */
export const delDept = (id: string | number | Array<string | number>) => {
  return request({
    url: '/cost/dept/' + id,
    method: 'delete'
  });
};
