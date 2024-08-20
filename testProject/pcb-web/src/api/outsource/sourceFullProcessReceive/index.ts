import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  SourceFullProcessReceiveVO,
  SourceFullProcessReceiveForm,
  SourceFullProcessReceiveQuery
} from '@/api/outsource/sourceFullProcessReceive/types';

/**
 * 查询订单外协待收货列表
 * @param query
 * @returns {*}
 */

export const listSourceFullProcessReceive = (query?: SourceFullProcessReceiveQuery): AxiosPromise<SourceFullProcessReceiveVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessReceive/list',
    method: 'get',
    params: query
  });
};
/**
 * 查询订单外协收货记录列表
 * @param query
 * @returns {*}
 */

export const listSourceReceive = (query?: SourceFullProcessReceiveQuery): AxiosPromise<SourceFullProcessReceiveVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessReceive/receiveList',
    method: 'get',
    params: query
  });
};

/**
 * 查询订单外协收货记录详细
 * @param id
 */
export const getSourceFullProcessReceive = (id: string | number): AxiosPromise<SourceFullProcessReceiveVO> => {
  return request({
    url: '/outsource/sourceFullProcessReceive/' + id,
    method: 'get'
  });
};

/**
 * 新增订单外协收货记录
 * @param data
 */
export const addSourceFullProcessReceive = (data: SourceFullProcessReceiveForm) => {
  return request({
    url: '/outsource/sourceFullProcessReceive',
    method: 'post',
    data: data
  });
};

/**
 * 修改订单外协收货记录
 * @param data
 */
export const updateSourceFullProcessReceive = (data: SourceFullProcessReceiveForm) => {
  return request({
    url: '/outsource/sourceFullProcessReceive',
    method: 'put',
    data: data
  });
};

/**
 * 删除订单外协收货记录
 * @param id
 */
export const delSourceFullProcessReceive = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceFullProcessReceive/' + id,
    method: 'delete'
  });
};
