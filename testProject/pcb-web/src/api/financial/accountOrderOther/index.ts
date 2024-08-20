import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AccountOrderOtherVO, AccountOrderOtherForm, AccountOrderOtherQuery } from '@/api/financial/accountOrderOther/types';

/**
 * 查询对账单其他增减记录列表
 * @param query
 * @returns {*}
 */

export const listAccountOrderOther = (query?: AccountOrderOtherQuery): AxiosPromise<AccountOrderOtherVO[]> => {
  return request({
    url: '/financial/accountOrderOther/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对账单其他增减记录详细
 * @param id
 */
export const getAccountOrderOther = (id: string | number): AxiosPromise<AccountOrderOtherVO> => {
  return request({
    url: '/financial/accountOrderOther/' + id,
    method: 'get'
  });
};

/**
 * 新增对账单其他增减记录
 * @param data
 */
export const addAccountOrderOther = (data: AccountOrderOtherForm) => {
  return request({
    url: '/financial/accountOrderOther',
    method: 'post',
    data: data
  });
};

/**
 * 修改对账单其他增减记录
 * @param data
 */
export const updateAccountOrderOther = (data: AccountOrderOtherForm) => {
  return request({
    url: '/financial/accountOrderOther',
    method: 'put',
    data: data
  });
};

/**
 * 删除对账单其他增减记录
 * @param id
 */
export const delAccountOrderOther = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/accountOrderOther/' + id,
    method: 'delete'
  });
};
