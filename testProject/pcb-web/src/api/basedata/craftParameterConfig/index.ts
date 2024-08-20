import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftParameterConfigVO, CraftParameterConfigForm, CraftParameterConfigQuery } from '@/api/basedata/craftParameterConfig/types';

/**
 * 查询工艺参数配置列表
 * @param query
 * @returns {*}
 */

export const listCraftParameterConfig = (query?: CraftParameterConfigQuery): AxiosPromise<CraftParameterConfigVO[]> => {
  return request({
    url: '/basedata/craftParameterConfig/list',
    method: 'get',
    params: query
  });
};

/* 不分页查询工艺参数配置列表*/
export const craftParameterList = (query?: CraftParameterConfigQuery): AxiosPromise<CraftParameterConfigVO[]> => {
  return request({
    url: '/basedata/craftParameterConfig/getCraftParameterList',
    method: 'get',
    params: query
  });
};


/**
 * 查询工艺参数配置详细
 * @param id
 */
export const getCraftParameterConfig = (id: string | number): AxiosPromise<CraftParameterConfigVO> => {
  return request({
    url: '/basedata/craftParameterConfig/' + id,
    method: 'get'
  });
};

/**
 * 查询当前工艺的所有参数信息
 * @param deptId
 */
export const listParameterByCraftId = (craftId: string | number): AxiosPromise<CraftParameterConfigVO[]> => {
  return request({
    url: '/basedata/craftParameterConfig/listByCraftId/' + craftId,
    method: 'get'
  });
};


/**
 * 新增工艺参数配置
 * @param data
 */
export const addCraftParameterConfig = (data: CraftParameterConfigForm) => {
  return request({
    url: '/basedata/craftParameterConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺参数配置
 * @param data
 */
export const updateCraftParameterConfig = (data: CraftParameterConfigForm) => {
  return request({
    url: '/basedata/craftParameterConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除工艺参数配置
 * @param id
 */
export const delCraftParameterConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftParameterConfig/' + id,
    method: 'delete'
  });
};
