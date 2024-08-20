import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AccountOrderDeductionVO, AccountOrderDeductionForm, AccountOrderDeductionQuery } from '@/api/financial/AccountOrderDeduction/types';

/**
 * 查询财务扣款记录列表
 * @param query
 * @returns {*}
 */

export const listAccountOrderDeduction = (query?: AccountOrderDeductionQuery): AxiosPromise<AccountOrderDeductionVO[]> => {
  return request({
    url: '/financial/AccountOrderDeduction/list',
    method: 'get',
    params: query
  });
};
export const postListAccountOrderDeduction = (query?: AccountOrderDeductionQuery): AxiosPromise<AccountOrderDeductionVO[]> => {
  return request({
    url: '/financial/AccountOrderDeduction/list',
    method: 'post',
    data: query
  });
};
/**
 * 查询财务扣款记录详细
 * @param id
 */
export const getAccountOrderDeduction = (id: string | number): AxiosPromise<AccountOrderDeductionVO> => {
  return request({
    url: '/financial/AccountOrderDeduction/' + id,
    method: 'get'
  });
};

/**
 * 新增财务扣款记录
 * @param data
 */
export const addAccountOrderDeduction = (data: AccountOrderDeductionForm) => {
  return request({
    url: '/financial/AccountOrderDeduction',
    method: 'post',
    data: data
  });
};

/**
 * 修改财务扣款记录
 * @param data
 */
export const updateAccountOrderDeduction = (data: AccountOrderDeductionForm) => {
  return request({
    url: '/financial/AccountOrderDeduction',
    method: 'put',
    data: data
  });
};
/**
 * 财务扣款记录-校验财务扣款记录是否被扣款
 * @param data
 */
export const verifyStatus = (data: any) => {
  return request({
    url: '/financial/AccountOrderDeduction/verifyStatus',
    method: 'post',
    data: data
  });
};

/**
 * 删除财务扣款记录
 * @param id
 */
export const delAccountOrderDeduction = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/AccountOrderDeduction/' + id,
    method: 'delete'
  });
};


/**
 * 查询未分配的供应商的财务扣款记录
 * @param query
 * @returns {*}
 */

export const listAccountOrderSupplierDeduction = (query?: any): AxiosPromise<AccountOrderDeductionVO[]> => {
  return request({
    url: '/financial/AccountOrderDeduction/supList',
    method: 'get',
    params: query
  });
};
