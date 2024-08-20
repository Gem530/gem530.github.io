import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftTemplateCraftVO, CraftTemplateCraftForm, CraftTemplateCraftQuery } from '@/api/basedata/craftTemplateCraft/types';

/**
 * 查询工艺模板关联列表
 * @param query
 * @returns {*}
 */

export const listCraftTemplateCraft = (query?: CraftTemplateCraftQuery): AxiosPromise<CraftTemplateCraftVO[]> => {
  return request({
    url: '/basedata/craftTemplateCraft/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺模板关联详细
 * @param id
 */
export const getCraftTemplateCraft = (id: string | number): AxiosPromise<CraftTemplateCraftVO> => {
  return request({
    url: '/basedata/craftTemplateCraft/' + id,
    method: 'get'
  });
};

/**
 * 新增工艺模板关联
 * @param data
 */
export const addCraftTemplateCraft = (data: CraftTemplateCraftForm) => {
  return request({
    url: '/basedata/craftTemplateCraft',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺模板关联
 * @param data
 */
export const updateCraftTemplateCraft = (data: CraftTemplateCraftForm) => {
  return request({
    url: '/basedata/craftTemplateCraft',
    method: 'put',
    data: data
  });
};

/**
 * 删除工艺模板关联
 * @param id
 */
export const delCraftTemplateCraft = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftTemplateCraft/' + id,
    method: 'delete'
  });
};
