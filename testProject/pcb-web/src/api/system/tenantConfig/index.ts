import request from '@/utils/request';
import { AxiosPromise } from 'axios';
// import { TenantConfigVO, TenantConfigForm, TenantConfigQuery } from '@/api/system/tenantConfig/types';
import { TenantConfigVO, TenantConfigForm, TenantConfigQuery} from './types';

/**
 * 查询租户配置列表
 * @param query
 * @returns {*}
 */

export const listTenantConfig = (query?: TenantConfigQuery): AxiosPromise<TenantConfigVO[]> => {
  return request({
    url: '/tenant/tenantConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询租户配置详细
 * @param id
 */
export const getTenantConfig = (id: string | number): AxiosPromise<TenantConfigVO> => {
  return request({
    url: '/tenant/tenantConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增租户配置
 * @param data
 */
export const addTenantConfig = (data: TenantConfigForm) => {
  return request({
    url: '/tenant/tenantConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改租户配置
 * @param data
 */
export const updateTenantConfig = (data: TenantConfigForm) => {
  return request({
    url: '/tenant/tenantConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除租户配置
 * @param id
 */
export const delTenantConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/tenant/tenantConfig/' + id,
    method: 'delete'
  });
};
