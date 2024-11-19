import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AdjustOrderVO, AdjustOrderForm, AdjustOrderQuery } from '@/api/financial/adjustOrder/types';

/**
 * 查询成本调整列表
 * @param query
 * @returns {*}
 */

export const listAdjustOrder = (query?: AdjustOrderQuery): AxiosPromise<AdjustOrderVO[]> => {
  return request({
    url: '/financial/adjustOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询成本调整详细
 * @param id
 */
export const getAdjustOrder = (id: string | number): AxiosPromise<AdjustOrderVO> => {
  return request({
    url: '/financial/adjustOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增成本调整
 * @param data
 */
export const addAdjustOrder = (data: AdjustOrderForm) => {
  return request({
    url: '/financial/adjustOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改成本调整
 * @param data
 */
export const updateAdjustOrder = (data: AdjustOrderForm) => {
  return request({
    url: '/financial/adjustOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除成本调整
 * @param id
 */
export const delAdjustOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/adjustOrder/' + id,
    method: 'delete'
  });
};

/**
 * 审核成本调整
 * @param data
 */
export const auditAdjustOrder = (data: AdjustOrderForm) => {
  return request({
    url: '/financial/adjustOrder/audit',
    method: 'post',
    data: data
  });
};

