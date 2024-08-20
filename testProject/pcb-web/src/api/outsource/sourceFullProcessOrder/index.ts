import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceFullProcessOrderVO, SourceFullProcessOrderForm, SourceFullProcessOrderQuery } from '@/api/outsource/sourceFullProcessOrder/types';
import { CustomerAddressVO } from '@/api/basedata/customerAddress/types';
import { SupplierVO } from '@/api/basedata/supplier/types';

/**
 * 修改外协订单状态
 * @param data
 */
export const updateSourceFullProcessOrderStatus = (data: any) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/updateStatus',
    method: 'post',
    data: data
  });
};
/**
 * 查询订单外协订单列表
 * @param query
 * @returns {*}
 */

export const listSourceFullProcessOrder = (query?: SourceFullProcessOrderQuery): AxiosPromise<SourceFullProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询外协订单列表
 * @param query
 * @returns {*}
 */
export const listSupplierOrder = (query?: SourceFullProcessOrderQuery): AxiosPromise<SourceFullProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/listSupplierOrder',
    method: 'get',
    params: query
  });
};

/**
 * 查询订单外协供应商列表
 * @param query
 * @returns {*}
 */
export const listOutSourceSupplierList = (): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/supplierList',
    method: 'get'
  });
};

export const listOutSourceSupplierListV2 = (craftId?: number): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/supplierListV2?craftId=' + craftId,
    method: 'get'
  });
};

export const listOutSourceSupplierListV3 = (craftId?: string): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/supplierListV3?craftId=' + craftId,
    method: 'get'
  });
};

/**
 * 查询地址列表
 * @param query
 * @returns {*}
 */
export const listOutSourceAddressList = (customerId?: string | number): AxiosPromise<CustomerAddressVO[]> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/addressList',
    method: 'get',
    params: { customerId }
  });
};

/**
 * 查询订单外协订单详细
 * @param id
 */
export const getSourceFullProcessOrder = (id: string | number): AxiosPromise<SourceFullProcessOrderVO> => {
  return request({
    url: '/outsource/sourceFullProcessOrder/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增订单外协订单
 * @param data
 */
export const addSourceFullProcessOrder = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder',
    method: 'post',
    data: data
  });
};
/**
 * 取消订单外协订单
 * @param data
 */
export const cancelSourceFullProcessOrder = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/cancelled',
    method: 'post',
    data: data
  });
};

/**
 * 修改订单外协订单
 * @param data
 */
export const updateSourceFullProcessOrder = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder',
    method: 'put',
    data: data
  });
};

/**
 * 外协订单对比是否修改
 * @param data
 */
export const compareList = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/compareList',
    method: 'post',
    data: data
  });
};

/**
 * 删除订单外协订单
 * @param id
 */
export const delSourceFullProcessOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/' + id,
    method: 'delete'
  });
};

/**
 * 根据订单ids查询对应供应商
 */
export const getSupplierByOrderIds = (data:any) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/getSupplierByOrderIds',
    method: 'post',
    data:data
  });
};

/**
 * 外协订单申请结单
 * @param data
 */
export const outSourceStatementDetail = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/statementDetail',
    method: 'post',
    data: data
  });
};

/**
 * 外协订单申请取消
 * @param data
 */
export const outSourceCancelOrder = (data: SourceFullProcessOrderForm) => {
  return request({
    url: '/outsource/sourceFullProcessOrder/cancelOrder',
    method: 'post',
    data: data
  });
};
