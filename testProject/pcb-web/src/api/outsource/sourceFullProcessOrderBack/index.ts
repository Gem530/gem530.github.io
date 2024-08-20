import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  SourceFullProcessOrderBackVO,
  SourceFullProcessOrderBackForm,
  SourceFullProcessOrderBackQuery
} from '@/api/outsource/sourceFullProcessOrderBack/types';

/**
 * 查询订单外协退货订单列表
 * @param query
 * @returns {*}
 */

export const listSourceFullProcessOrderBack = (query?: SourceFullProcessOrderBackQuery): AxiosPromise<SourceFullProcessOrderBackVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/list',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询订单外协退货订单列表
 * @param query
 * @returns {*}
 */

export const listSupplierBack = (query?: SourceFullProcessOrderBackQuery): AxiosPromise<SourceFullProcessOrderBackVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/listSupplierBack',
    method: 'get',
    params: query
  });
};

export const listSourceInventoryOrderBack = (query?: SourceFullProcessOrderBackQuery): AxiosPromise<SourceFullProcessOrderBackVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/inventoryList',
    method: 'get',
    params: query
  });
};

/**
 * 查询订单外协退货订单详细
 * @param id
 */
export const getSourceFullProcessOrderBack = (id: string | number): AxiosPromise<SourceFullProcessOrderBackVO> => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/' + id,
    method: 'get'
  });
};

/**
 * 新增订单外协退货订单
 * @param data
 */
export const addSourceFullProcessOrderBack = (data: SourceFullProcessOrderBackForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/back',
    method: 'post',
    data: data
  });
};
/**
 * 修改外协退货订单状态
 * @param data
 */
export const updateSourceOrderBackStatus = (data: any) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/updateStatus',
    method: 'post',
    data: data
  });
};

/**
 * 外协退货订单确认操作
 * @param data
 */
export const confirmOrderBack = (data: any) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/confirmOrderBack',
    method: 'post',
    data: data
  });
};

/**
 * 外协退货订单对比是否修改
 * @param data
 */
export const compareList = (data: any) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/compareList',
    method: 'post',
    data: data
  });
};

/**
 * 修改订单外协退货订单
 * @param data
 */
export const updateSourceFullProcessOrderBack = (data: SourceFullProcessOrderBackForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack',
    method: 'put',
    data: data
  });
};

/**
 * 删除订单外协退货订单
 * @param id
 */
export const delSourceFullProcessOrderBack = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/' + id,
    method: 'delete'
  });
};

/**
 * 修改订单外协退货订单
 * @param data
 */
export const sourceFullCancelBackOrder = (data: any) => {
  return request({
    url: '/outsource/sourceFullProcessOrderBack/cancelBackOrder',
    method: 'post',
    data: data
  });
};
