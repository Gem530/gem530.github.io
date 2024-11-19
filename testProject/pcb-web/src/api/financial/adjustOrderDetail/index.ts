import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AdjustOrderDetailVO, AdjustOrderDetailForm, AdjustOrderDetailQuery } from '@/api/financial/adjustOrderDetail/types';

/**
 * 查询成本调整明细列表
 * @param query
 * @returns {*}
 */

export const listAdjustOrderDetail = (query?: AdjustOrderDetailQuery): AxiosPromise<AdjustOrderDetailVO[]> => {
  return request({
    url: '/financial/adjustOrderDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询成本调整明细详细
 * @param id
 */
export const getAdjustOrderDetail = (id: string | number): AxiosPromise<AdjustOrderDetailVO> => {
  return request({
    url: '/financial/adjustOrderDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增成本调整明细
 * @param data
 */
export const addAdjustOrderDetail = (data: AdjustOrderDetailForm) => {
  return request({
    url: '/financial/adjustOrderDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改成本调整明细
 * @param data
 */
export const updateAdjustOrderDetail = (data: AdjustOrderDetailForm) => {
  return request({
    url: '/financial/adjustOrderDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除成本调整明细
 * @param id
 */
export const delAdjustOrderDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/adjustOrderDetail/' + id,
    method: 'delete'
  });
};
