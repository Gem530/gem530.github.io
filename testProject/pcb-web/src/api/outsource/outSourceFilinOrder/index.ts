import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OutSourceFilinOrderVO, OutSourceFilinOrderForm, OutSourceFilinOrderQuery } from '@/api/outsource/outSourceFilinOrder/types';

/**
 * 查询菲林网板外协单列表
 * @param query
 * @returns {*}
 */

export const listOutSourceFilinOrder = (query?: OutSourceFilinOrderQuery): AxiosPromise<OutSourceFilinOrderVO[]> => {
  return request({
    url: '/outsource/outSourceFilinOrder/list',
    method: 'get',
    params: query
  });
};

export const listProCarftFilesInfo = (query?: any): AxiosPromise<OutSourceFilinOrderVO[]> => {
  return request({
    url: '/outsource/outSourceFilinOrder/proCraftFilesInfo',
    method: 'post',
    data: query
  });
};

/**
 * 查询菲林网板外协单详细
 * @param id
 */
export const getOutSourceFilinOrder = (id: string | number): AxiosPromise<OutSourceFilinOrderVO> => {
  return request({
    url: '/outsource/outSourceFilinOrder/' + id,
    method: 'get'
  });
};

export const getPrintOutSourceFilinOrder = (id: string | number): AxiosPromise<OutSourceFilinOrderVO> => {
  return request({
    url: '/outsource/outSourceFilinOrder/printInfo/' + id,
    method: 'get'
  });
};
/**
 * 新增菲林网板外协单
 * @param data
 */
export const addOutSourceFilinOrder = (data: OutSourceFilinOrderForm) => {
  return request({
    url: '/outsource/outSourceFilinOrder/add',
    method: 'post',
    data: data
  });
};
/**
 * 新增菲林网板外协单
 * @param data
 */
export const addOutSourceFilinOrderSingle = (data: OutSourceFilinOrderForm) => {
  return request({
    url: '/outsource/outSourceFilinOrder',
    method: 'post',
    data: data
  });
};
/**
 * 修改菲林网板外协单
 * @param data
 */
export const updateOutSourceFilinOrder = (data: OutSourceFilinOrderForm) => {
  return request({
    url: '/outsource/outSourceFilinOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除菲林网板外协单
 * @param id
 */
export const delOutSourceFilinOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/outSourceFilinOrder/' + id,
    method: 'delete'
  });
};

/**
 * 查询菲林网板外协单文件列表
 * @param id
 */
export const getOutSourceFilinOrderFile = (id: string | number): AxiosPromise<OutSourceFilinOrderVO> => {
  return request({
    url: '/outsource/outSourceFilinOrder/' + id,
    method: 'get'
  });
};

/**
 * 查询菲林网板外协单列表
 * @param query
 * @returns {*}
 */
export const listAccountOutSourceFilinOrder = (query?: OutSourceFilinOrderQuery): AxiosPromise<OutSourceFilinOrderVO[]> => {
  return request({
    url: '/outsource/outSourceFilinOrder/queryAccountPageList',
    method: 'get',
    params: query
  });
};

/**
 * 确认完成菲林网板外协单
 * @param data
 */
export const doCompleteFilinOrder = (data: OutSourceFilinOrderForm) => {
  return request({
    url: '/outsource/outSourceFilinOrder/doCompleteFilinOrder',
    method: 'post',
    data: data
  });
};

/**
 * 批量确认完成菲林网板外协单
 * @param data
 */
export const doCompleteFilinOrderBatch = (data: OutSourceFilinOrderForm) => {
  return request({
    url: '/outsource/outSourceFilinOrder/doCompleteFilinOrderBatch',
    method: 'post',
    data: data
  });
};

/**
 * 查询菲林网板外协单列表
 * @param query
 * @returns {*}
 */

export const listOutSourceFilinDetailList = (query?: OutSourceFilinOrderQuery): AxiosPromise<OutSourceFilinOrderVO[]> => {
  return request({
    url: '/outsource/outSourceFilinOrder/getDetailList',
    method: 'get',
    params: query
  });
};
