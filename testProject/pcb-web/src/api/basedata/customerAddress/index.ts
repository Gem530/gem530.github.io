import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerAddressVO, CustomerAddressForm, CustomerAddressQuery } from '@/api/basedata/customerAddress/types';

/**
 * 查询客户地址列表
 * @param query
 * @returns {*}
 */

export const listCustomerAddress = (query?: CustomerAddressQuery): AxiosPromise<CustomerAddressVO[]> => {
  return request({
    url: '/basedata/customerAddress/list',
    method: 'get',
    params: query
  });
};
/**
 * 查询客户地址列表
 * @param query
 * @returns {*}
 */

export const listCustomerAddressByOwnerId = (): AxiosPromise<CustomerAddressVO[]> => {
  return request({
    url: '/basedata/customerAddress/listByOwnerId',
    method: 'get'
  });
};

/**
 * 查询供应商地址  按供应商id
 */
export const listCustomerSupplierAddress = (supplierId: string | number): AxiosPromise<CustomerAddressVO[]> => {
  return request({
    url: '/basedata/customerAddress/listBySupplier/'+ supplierId,
    method: 'get'
  });
};

/**
 * 按客户id查询客户地址列表
 * @param query
 * @returns {*}
 */
export const listCustomerAddressByCusId = (customerId: string | number): AxiosPromise<CustomerAddressVO[]> => {
  return request({
    url: '/basedata/customerAddress/listByCusId/' + customerId,
    method: 'get'
  });
};

/**
 * 查询客户地址详细
 * @param id
 */
export const getCustomerAddress = (id: string | number): AxiosPromise<CustomerAddressVO> => {
  return request({
    url: '/basedata/customerAddress/' + id,
    method: 'get'
  });
};

/**
 * 新增客户地址
 * @param data
 */
export const addCustomerAddress = (data: CustomerAddressForm) => {
  return request({
    url: '/basedata/customerAddress',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户地址
 * @param data
 */
export const updateCustomerAddress = (data: CustomerAddressForm) => {
  return request({
    url: '/basedata/customerAddress',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户地址
 * @param id
 */
export const delCustomerAddress = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/customerAddress/' + id,
    method: 'delete'
  });
};
