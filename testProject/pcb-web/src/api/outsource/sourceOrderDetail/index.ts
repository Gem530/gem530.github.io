import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceOrderDetailVO, SourceOrderDetailForm, SourceOrderDetailQuery } from '@/api/outsource/sourceOrderDetail/types';

/**
 * 查询外协接单加工单详情列表
 * @param query
 * @returns {*}
 */

export const listSourceOrderDetail = (query?: SourceOrderDetailQuery): AxiosPromise<SourceOrderDetailVO[]> => {
  return request({
    url: '/outsource/sourceOrderDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单加工单详情详细
 * @param id
 */
export const getSourceOrderDetail = (id: string | number): AxiosPromise<SourceOrderDetailVO> => {
  return request({
    url: '/outsource/sourceOrderDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增外协接单加工单详情
 * @param data
 */
export const addSourceOrderDetail = (data: SourceOrderDetailForm) => {
  return request({
    url: '/outsource/sourceOrderDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单加工单详情
 * @param data
 */
export const updateSourceOrderDetail = (data: SourceOrderDetailForm) => {
  return request({
    url: '/outsource/sourceOrderDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单加工单详情
 * @param id
 */
export const delSourceOrderDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceOrderDetail/' + id,
    method: 'delete'
  });
};

/**
 * 查询外协接单加工单详情列表
 * @param query
 * @returns {*}
 */

export const countOrderDetail = (query?: SourceOrderDetailQuery): AxiosPromise<SourceOrderDetailVO> => {
  return request({
    url: '/outsource/sourceOrderDetail/listCount',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单加工单详情列表
 * @param query
 * @returns {*}
 */

export const querySourceOrderDetailList = (query?: SourceOrderDetailQuery): AxiosPromise<SourceOrderDetailVO[]> => {
  return request({
    url: '/outsource/sourceOrderDetail/queryList',
    method: 'post',
    data: query
  });
};

/**
 * 校验加工单计价规则
 * @param query
 */
export const verifySourceOrderRule = (query?: SourceOrderDetailQuery) => {
  return request({
    url: '/outsource/sourceOrderDetail/verify',
    method: 'post',
    data: query
  });
};
