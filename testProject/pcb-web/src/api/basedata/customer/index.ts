import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerVO, CustomerForm, CustomerQuery } from '@/api/basedata/customer/types';

/**
 * 查询客户列表
 * @param query
 * @returns {*}
 */

export const listCustomer = (query?: CustomerQuery): AxiosPromise<CustomerVO[]> => {
  return request({
    url: '/basedata/customer/list',
    method: 'get',
    params: query
  });
};
export const postListCustomer = (query?: CustomerQuery): AxiosPromise<CustomerVO[]> => {
  return request({
    url: '/basedata/customer/list',
    method: 'post',
    data: query
  });
};

/**
 * 查询所有单位节点的部门
 * @returns {*}
 */

export const selectCompanyDept = () => {
  return request({
    url: '/system/dept/selectCompanyDeptUnSetCustomer',
    method: 'get'
  });
};

/**
 * 查询客户列表无分页
 * @param query
 * @returns {*}
 */

export const getListCustomer = (query?: CustomerQuery): AxiosPromise<CustomerVO[]> => {
  return request({
    url: '/basedata/customer/getList',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户详细
 * @param id
 */
export const getCustomer = (id: string | number): AxiosPromise<CustomerVO> => {
  return request({
    url: '/basedata/customer/' + id,
    method: 'get'
  });
};

/**
 * 新增客户
 * @param data
 */
export const addCustomer = (data: CustomerForm) => {
  return request({
    url: '/basedata/customer',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户
 * @param data
 */
export const updateCustomer = (data: CustomerForm) => {
  return request({
    url: '/basedata/customer',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户
 * @param id
 */
export const delCustomer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/customer/' + id,
    method: 'delete'
  });
};

/**
 * 禁用客户
 * @param id
 */
export const disableCustomer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/customer/disableCustomer/' + id,
    method: 'get'
  });
};
/**
 * 禁用客户
 * @param id
 */
export const unDisableCustomer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/customer/unDisableCustomer/' + id,
    method: 'get'
  });
};

// 查询客户列表
export const listCompany = () => {
  return request({
    url: '/basedata/customer/companyList',
    method: 'get'
  });
};
