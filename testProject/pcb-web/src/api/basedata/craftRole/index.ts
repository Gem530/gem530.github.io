import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftRoleVO, CraftRoleForm, CraftRoleQuery } from '@/api/basedata/craftRole/types';

/**
 * 查询工艺角色关联列表
 * @param query
 * @returns {*}
 */

export const listCraftRole = (query?: CraftRoleQuery): AxiosPromise<CraftRoleVO[]> => {
  return request({
    url: '/basedata/craftRole/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺角色关联详细
 * @param id
 */
export const getCraftRole = (id: string | number): AxiosPromise<CraftRoleVO> => {
  return request({
    url: '/basedata/craftRole/' + id,
    method: 'get'
  });
};

/**
 * 新增工艺角色关联
 * @param data
 */
export const addCraftRole = (data: CraftRoleForm) => {
  return request({
    url: '/basedata/craftRole',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺角色关联
 * @param data
 */
export const updateCraftRole = (data: CraftRoleForm) => {
  return request({
    url: '/basedata/craftRole',
    method: 'put',
    data: data
  });
};

/**
 * 删除工艺角色关联
 * @param id
 */
export const delCraftRole = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftRole/' + id,
    method: 'delete'
  });
};
