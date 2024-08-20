import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { EcnVO, EcnForm, EcnQuery } from '@/api/project/ecn/types';

/**
 * 查询ECN通知列表
 * @param query
 * @returns {*}
 */

export const listEcn = (query?: EcnQuery): AxiosPromise<EcnVO[]> => {
  return request({
    url: '/project/ecn/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询ECN通知详细
 * @param id
 */
export const getEcn = (id: string | number): AxiosPromise<EcnVO> => {
  return request({
    url: '/project/ecn/' + id,
    method: 'get'
  });
};

/**
 * 新增ECN通知
 * @param data
 */
export const addEcn = (_data: EcnForm) => {
  //后台字段类型转换
  //convertData(_data);
  return request({
    url: '/project/ecn/add',
    method: 'post',
    data: _data
  });
};

/**
 * 修改ECN通知
 * @param data
 */
export const updateEcn = (_data: EcnForm) => {
  return request({
    url: '/project/ecn/edit',
    method: 'put',
    data: _data
  });
};
/**
 * 删除ECN通知
 * @param id
 */
export const delEcn = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/ecn/remove' + id,
    method: 'delete'
  });
};
