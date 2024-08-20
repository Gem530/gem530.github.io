import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftTemplateVO, CraftTemplateForm, CraftTemplateQuery } from '@/api/basedata/craftTemplate/types';

/**
 * 查询工艺模板列表
 * @param query
 * @returns {*}
 */

export const listCraftTemplate = (query?: CraftTemplateQuery): AxiosPromise<CraftTemplateVO[]> => {
  return request({
    url: '/basedata/craftTemplate/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺模板详细
 * @param id
 */
export const getCraftTemplate = (id: string | number): AxiosPromise<CraftTemplateVO> => {
  return request({
    url: '/basedata/craftTemplate/' + id,
    method: 'get'
  });
};

/**
 * 新增工艺模板
 * @param data
 */
export const addCraftTemplate = (data: CraftTemplateForm) => {
  return request({
    url: '/basedata/craftTemplate',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺模板
 * @param data
 */
export const updateCraftTemplate = (data: CraftTemplateForm) => {
  return request({
    url: '/basedata/craftTemplate',
    method: 'put',
    data: data
  });
};

/**
 * 删除工艺模板
 * @param id
 */
export const delCraftTemplate = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftTemplate/' + id,
    method: 'delete'
  });
};
