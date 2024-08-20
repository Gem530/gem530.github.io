import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AccountOrderDeductionAssignVO, AccountOrderDeductionAssignForm, AccountOrderDeductionAssignQuery } from '@/api/financial/AccountOrderDeductionAssign/types';

/**
 * 查询财务扣款记录分配列表
 * @param query
 * @returns {*}
 */

export const listAccountOrderDeductionAssign = (query?: AccountOrderDeductionAssignQuery): AxiosPromise<AccountOrderDeductionAssignVO[]> => {
  return request({
    url: '/financial/AccountOrderDeductionAssign/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询财务扣款记录分配详细
 * @param id
 */
export const getAccountOrderDeductionAssign = (id: string | number): AxiosPromise<AccountOrderDeductionAssignVO> => {
  return request({
    url: '/financial/AccountOrderDeductionAssign/' + id,
    method: 'get'
  });
};

/**
 * 新增财务扣款记录分配
 * @param data
 */
export const addAccountOrderDeductionAssign = (data: AccountOrderDeductionAssignForm) => {
  return request({
    url: '/financial/AccountOrderDeductionAssign',
    method: 'post',
    data: data
  });
};

/**
 * 修改财务扣款记录分配
 * @param data
 */
export const updateAccountOrderDeductionAssign = (data: AccountOrderDeductionAssignForm) => {
  return request({
    url: '/financial/AccountOrderDeductionAssign',
    method: 'put',
    data: data
  });
};

/**
 * 删除财务扣款记录分配
 * @param id
 */
export const delAccountOrderDeductionAssign = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/AccountOrderDeductionAssign/' + id,
    method: 'delete'
  });
};
