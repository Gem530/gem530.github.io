import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceHalfCountAttrLogVO, SourceHalfCountAttrLogForm, SourceHalfCountAttrLogQuery } from '@/api/outsource/sourceHalfCountAttrLog/types';

/**
 * 查询外协计价记录列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfCountAttrLog = (query?: SourceHalfCountAttrLogQuery): AxiosPromise<SourceHalfCountAttrLogVO[]> => {
  return request({
    url: '/outsource/sourceHalfCountAttrLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协计价记录详细
 * @param id
 */
export const getSourceHalfCountAttrLog = (id: string | number): AxiosPromise<SourceHalfCountAttrLogVO> => {
  return request({
    url: '/outsource/sourceHalfCountAttrLog/' + id,
    method: 'get'
  });
};

/**
 * 新增外协计价记录
 * @param data
 */
export const addSourceHalfCountAttrLog = (data: SourceHalfCountAttrLogForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttrLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协计价记录
 * @param data
 */
export const updateSourceHalfCountAttrLog = (data: SourceHalfCountAttrLogForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttrLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协计价记录
 * @param id
 */
export const delSourceHalfCountAttrLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfCountAttrLog/' + id,
    method: 'delete'
  });
};
