import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  SourceHalfProcessReceiveVO,
  SourceHalfProcessReceiveForm,
  SourceHalfProcessReceiveQuery
} from '@/api/outsource/sourceHalfProcessReceive/types';

/**
 * 查询外协加工收货记录列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfProcessReceive = (query?: SourceHalfProcessReceiveQuery): AxiosPromise<SourceHalfProcessReceiveVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/list',
    method: 'get',
    params: query
  });
};
export const listSourceHalfProcessReceiveList = (query?: SourceHalfProcessReceiveQuery): AxiosPromise<SourceHalfProcessReceiveVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/accountList',
    method: 'get',
    params: query
  });
};
/**
 * 查询外协加工收货记录列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfProcessOrder = (query?: SourceHalfProcessReceiveQuery): AxiosPromise<SourceHalfProcessReceiveVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/orderList',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工收货记录详细
 * @param id
 */
export const getSourceHalfProcessReceive = (id: string | number): AxiosPromise<SourceHalfProcessReceiveVO> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/getInfo/' + id,
    method: 'get'
  });
};
/**
 * 查询外协加工收货记录详细
 * @param id
 */
export const getSourceHalfProcessOrder = (id: string | number): AxiosPromise<SourceHalfProcessReceiveVO> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/order/' + id,
    method: 'get'
  });
};
/**
 * 查询外协加工收货记录详细
 */
export const getSourceHalfProcessOrderByCode = (code: any) => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/orderByCode/' + code,
    method: 'get'
  });
};
/**
 * 供应商发货单处 --> 通过工序外协单id查询单位数据
 * @param id 工序外协单id
 * @param deliveryId 需要过滤的发货单id
 * @return 单位数据
 */
export const getDeliveryUnit = (id: string | number,deliveryId: string | number): AxiosPromise<SourceHalfProcessReceiveVO> => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/deliveryUnit/' + id +'/'+ deliveryId,
    method: 'get'
  });
};

/**
 * 新增外协加工收货记录
 * @param data
 */
export const addSourceHalfProcessReceive = (data: SourceHalfProcessReceiveForm) => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/add',
    method: 'post',
    data: data
  });
};

/**
 * 批量新增外协加工收货记录
 * @param data
 */
export const addBatchSourceHalfProcessReceive = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/addBatch',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工收货记录
 * @param data
 */
export const updateSourceHalfProcessReceive = (data: SourceHalfProcessReceiveForm) => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/add',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工收货记录
 * @param id
 */
export const delSourceHalfProcessReceive = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfProcessReceive/end/' + id,
    method: 'get'
  });
};
