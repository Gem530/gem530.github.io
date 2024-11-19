import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceProcessOrderVO, SourceProcessOrderForm, SourceProcessOrderQuery } from '@/api/outsource/sourceProcessOrder/types';

/**
 * 查询外协加工接单管理列表
 * @param query
 * @returns {*}
 */

export const listSourceProcessOrder = (query?: SourceProcessOrderQuery): AxiosPromise<SourceProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceProcessOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工接单管理详细
 * @param id
 */
export const getSourceProcessOrder = (id: string | number): AxiosPromise<SourceProcessOrderVO> => {
  return request({
    url: '/outsource/sourceProcessOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增外协加工接单管理
 * @param data
 */
export const addSourceProcessOrder = (data: SourceProcessOrderForm) => {
  return request({
    url: '/outsource/sourceProcessOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工接单管理
 * @param data
 */
export const updateSourceProcessOrder = (data: SourceProcessOrderForm) => {
  return request({
    url: '/outsource/sourceProcessOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工接单管理
 * @param id
 */
export const delSourceProcessOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceProcessOrder/' + id,
    method: 'delete'
  });
};
