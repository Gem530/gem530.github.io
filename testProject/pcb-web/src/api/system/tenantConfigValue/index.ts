import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TenantConfigValueVO, TenantConfigValueForm, TenantConfigValueQuery } from '@/api/system/tenantConfigValue/types';

/**
 * 查询租户配置值列表
 * @param query
 * @returns {*}
 */

export const listTenantConfigValue = (query?: TenantConfigValueQuery): AxiosPromise<TenantConfigValueVO[]> => {
  return request({
    url: '/system/tenantConfigValue/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询租户配置值详细
 * @param id
 */
export const getTenantConfigValue = (id: string | number): AxiosPromise<TenantConfigValueVO> => {
  return request({
    url: '/system/tenantConfigValue/' + id,
    method: 'get'
  });
};

/**
 * 新增租户配置值
 * @param data
 */
export const addTenantConfigValue = (data: TenantConfigValueForm) => {
  return request({
    url: '/system/tenantConfigValue',
    method: 'post',
    data: data
  });
};

/**
 * 修改租户配置值
 * @param data
 */
export const updateTenantConfigValue = (data: TenantConfigValueForm) => {
  return request({
    url: '/system/tenantConfigValue',
    method: 'put',
    data: data
  });
};

/**
 * 删除租户配置值
 * @param id
 */
export const delTenantConfigValue = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/tenantConfigValue/' + id,
    method: 'delete'
  });
};
