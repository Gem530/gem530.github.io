import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerUserVO, CustomerUserForm, CustomerUserQuery } from '@/api/basedata/customerUser/types';

/**
 * 查询客户用户列表
 * @param query
 * @returns {*}
 */

export const listCustomerUser = (query?: CustomerUserQuery): AxiosPromise<CustomerUserVO[]> => {
  return request({
    url: '/basedata/customerUser/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询列表
 */
export const customerUserList = (customerId: string | number) => {
  return request({
    url: '/basedata/customerUser/getList/' + customerId,
    method: 'get',
  });
};

/**
 * 查询客户用户详细
 * @param id
 */
export const getCustomerUser = (id: string | number): AxiosPromise<CustomerUserVO> => {
  return request({
    url: '/basedata/customerUser/' + id,
    method: 'get'
  });
};

/**
 * 新增客户用户
 * @param data
 */
export const addCustomerUser = (data: CustomerUserForm) => {
  return request({
    url: '/basedata/customerUser',
    method: 'post',
    data: data
  });
};

/**
 * 批量新增客户用户
 * @param data
 */
export const batchInsertCustomerUser = (data: CustomerUserForm[]) => {
  return request({
    url: '/basedata/customerUser/batchInsert',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户用户
 * @param data
 */
export const updateCustomerUser = (data: CustomerUserForm) => {
  return request({
    url: '/basedata/customerUser',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户用户
 * @param id
 */
export const delCustomerUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/customerUser/' + id,
    method: 'delete'
  });
};
