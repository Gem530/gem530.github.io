import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 查询奖惩管理列表
 * @param query
 * @returns {*}
 */

export const listIncentive = (data?: any): AxiosPromise<any> => {
  return request({
    url: '/basedata/incentive/list',
    method: 'post',
    data: data
  });
};

/**
 * 查询奖惩管理详细
 * @param id
 */
export const getIncentive = (id: string | number): AxiosPromise<any> => {
  return request({
    url: '/basedata/incentive/' + id,
    method: 'get'
  });
};

/**
 * 新增奖惩管理
 * @param data
 */
export const addIncentive = (data: any) => {
  return request({
    url: '/basedata/incentive',
    method: 'post',
    data: data
  });
};

/**
 * 修改奖惩管理
 * @param data
 */
export const updateIncentive = (data: any) => {
  return request({
    url: '/basedata/incentive',
    method: 'put',
    data: data
  });
};

/**
 * 删除奖惩管理
 * @param id
 */
export const delIncentive = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/incentive/' + id,
    method: 'delete'
  });
};
