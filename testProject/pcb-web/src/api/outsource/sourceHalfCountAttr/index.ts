import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceHalfCountAttrVO, SourceHalfCountAttrForm, SourceHalfCountAttrQuery } from '@/api/outsource/sourceHalfCountAttr/types';

/**
 * 查询半制程外协计价配置列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfCountAttr = (query?: SourceHalfCountAttrQuery): AxiosPromise<SourceHalfCountAttrVO[]> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询半制程外协计价配置详细
 * @param id
 */
export const getSourceHalfCountAttr = (id: string | number): AxiosPromise<SourceHalfCountAttrVO> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/' + id,
    method: 'get'
  });
};

/**
 * 新增半制程外协计价配置
 * @param data
 */
export const addSourceHalfCountAttr = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttr',
    method: 'post',
    data: data
  });
};

/**
 * 修改半制程外协计价配置
 * @param data
 */
export const updateSourceHalfCountAttr = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttr',
    method: 'put',
    data: data
  });
};

/**
 * 删除半制程外协计价配置
 * @param id
 */
export const delSourceHalfCountAttr = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfCountAttr/' + id,
    method: 'delete'
  });
};
/**
 * 获取所有的参数
 * @param id
 */
export const getAllAttr = (): AxiosPromise<SourceHalfCountAttrVO[]> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/getAllAttr',
    method: 'get'
  });
};
