import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DiscardReasonVO, DiscardReasonForm, DiscardReasonQuery } from '@/api/basedata/discardReason/types';

/**
 * 查询报废原因列表
 * @param query
 * @returns {*}
 */

export const listDiscardReason = (query?: DiscardReasonQuery): AxiosPromise<DiscardReasonVO[]> => {
  return request({
    url: '/basedata/discardReason/list',
    method: 'get',
    params: query
  });
};

export const getListDiscardReason = (data:any) => {
  return request({
    url: '/basedata/discardReason/getList',
    method: 'post',
    data:data
  });
};

/**
 * 查询报废原因详细
 * @param id
 */
export const getDiscardReason = (id: string | number): AxiosPromise<DiscardReasonVO> => {
  return request({
    url: '/basedata/discardReason/' + id,
    method: 'get'
  });
};

/**
 * 新增报废原因
 * @param data
 */
export const addDiscardReason = (data: DiscardReasonForm) => {
  return request({
    url: '/basedata/discardReason',
    method: 'post',
    data: data
  });
};

/**
 * 修改报废原因
 * @param data
 */
export const updateDiscardReason = (data: DiscardReasonForm) => {
  return request({
    url: '/basedata/discardReason',
    method: 'put',
    data: data
  });
};

/**
 * 删除报废原因
 * @param id
 */
export const delDiscardReason = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/discardReason/' + id,
    method: 'delete'
  });
};
