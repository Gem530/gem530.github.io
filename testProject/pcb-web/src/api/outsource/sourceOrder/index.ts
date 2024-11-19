import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceOrderVO, SourceOrderForm, SourceOrderQuery } from '@/api/outsource/sourceOrder/types';

/**
 * 查询外协接单加工单列表
 * @param query
 * @returns {*}
 */

export const listSourceOrder = (query?: SourceOrderQuery): AxiosPromise<SourceOrderVO[]> => {
  return request({
    url: '/outsource/sourceOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单加工单详细
 * @param id
 */
export const getSourceOrder = (id: string | number): AxiosPromise<SourceOrderVO> => {
  return request({
    url: '/outsource/sourceOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增外协接单加工单
 * @param data
 */
export const addSourceOrder = (data: SourceOrderForm) => {
  return request({
    url: '/outsource/sourceOrder',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单加工单
 * @param data
 */
export const updateSourceOrder = (data: SourceOrderForm) => {
  return request({
    url: '/outsource/sourceOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单加工单
 * @param id
 */
export const delSourceOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceOrder/' + id,
    method: 'delete'
  });
};

/**
 * 外协接单加工单转单
 * @param data
 */
export const transferSourceOrder = (data: SourceOrderForm) => {
  return request({
    url: '/outsource/sourceOrder/transfer',
    method: 'post',
    data: data
  });
};

/**
 * 外协接单修改附件
 * @param data
 */
export const updateSourceOrderFiles = (data: SourceOrderForm) => {
  return request({
    url: '/outsource/sourceOrder/updateFiles',
    method: 'post',
    data: data
  });
};
