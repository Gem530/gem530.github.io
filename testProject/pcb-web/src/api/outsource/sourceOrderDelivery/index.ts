import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceOrderDeliveryVO, SourceOrderDeliveryForm, SourceOrderDeliveryQuery } from '@/api/outsource/sourceOrderDelivery/types';

/**
 * 查询外协接单加工单发货列表
 * @param query
 * @returns {*}
 */

export const listSourceOrderDelivery = (query?: SourceOrderDeliveryQuery): AxiosPromise<SourceOrderDeliveryVO[]> => {
  return request({
    url: '/outsource/sourceOrderDelivery/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单加工单发货详细
 * @param id
 */
export const getSourceOrderDelivery = (id: string | number): AxiosPromise<SourceOrderDeliveryVO> => {
  return request({
    url: '/outsource/sourceOrderDelivery/' + id,
    method: 'get'
  });
};

/**
 * 新增外协接单加工单发货
 * @param data
 */
export const addSourceOrderDelivery = (data: SourceOrderDeliveryForm) => {
  return request({
    url: '/outsource/sourceOrderDelivery',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单加工单发货
 * @param data
 */
export const updateSourceOrderDelivery = (data: SourceOrderDeliveryForm) => {
  return request({
    url: '/outsource/sourceOrderDelivery',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单加工单发货
 * @param id
 */
export const delSourceOrderDelivery = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceOrderDelivery/' + id,
    method: 'delete'
  });
};

/**
 * 查询外协接单加工单发货列表
 * @param query
 * @returns {*}
 */
export const listDeliveryCount = (query?: SourceOrderDeliveryQuery) => {
  return request({
    url: '/outsource/sourceOrderDelivery/listCount',
    method: 'get',
    params: query
  });
};

/**
 * 批量修改加工单发货信息
 * @param data
 */
export const batchUpdaterDelivery = (data: SourceOrderDeliveryForm[]) => {
  return request({
    url: '/outsource/sourceOrderDelivery/batchEdit',
    method: 'post',
    data: data
  });
};

