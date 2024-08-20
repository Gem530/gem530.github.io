import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AddressVO, AddressForm, AddressQuery } from '@/api/basedata/address/types';

/**
 * 查询客户地址列表
 * @param query
 * @returns {*}
 */

export const listAddress = (query?: AddressQuery): AxiosPromise<AddressVO[]> => {
  return request({
    url: '/basedata/address/list',
    method: 'get',
    params: query
  });
};

export const postlistAddress = (query?: AddressQuery): AxiosPromise<AddressVO[]> => {
  return request({
    url: '/basedata/address/list',
    method: 'post',
    data: query
  });
};

/**
 * 查询客户地址详细
 * @param id
 */
export const getAddress = (id: string | number): AxiosPromise<AddressVO> => {
  return request({
    url: '/basedata/address/' + id,
    method: 'get'
  });
};

/**
 * 新增客户地址
 * @param data
 */
export const addAddress = (data: AddressForm) => {
  return request({
    url: '/basedata/address',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户地址
 * @param data
 */
export const updateAddress = (data: AddressForm) => {
  return request({
    url: '/basedata/address',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户地址
 * @param id
 */
export const delAddress = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/address/' + id,
    method: 'delete'
  });
};

export const getListAddress = () => {
  return request({
    url: '/basedata/address/listAddress',
    method: 'get'
  });
};