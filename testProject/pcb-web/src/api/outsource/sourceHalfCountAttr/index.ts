import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceHalfCountAttrVO, SourceHalfCountAttrForm, SourceHalfCountAttrQuery } from '@/api/outsource/sourceHalfCountAttr/types';

/**
 * 查询半制程外协计价配置列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfCountAttr = (query?: SourceHalfCountAttrQuery): AxiosPromise<SourceHalfCountAttrVO[]> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询半制程外协计价配置详细
 * @param id
 */
export const getSourceHalfCountAttr = (id: string | number): AxiosPromise<SourceHalfCountAttrVO> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/' + id,
    method: 'get'
  });
};

/**
 * 新增半制程外协计价配置
 * @param data
 */
export const addSourceHalfCountAttr = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttr',
    method: 'post',
    data: data
  });
};

/**
 * 修改半制程外协计价配置
 * @param data
 */
export const updateSourceHalfCountAttr = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceHalfCountAttr',
    method: 'put',
    data: data
  });
};

/**
 * 删除半制程外协计价配置
 * @param id
 */
export const delSourceHalfCountAttr = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfCountAttr/' + id,
    method: 'delete'
  });
};
/**
 * 获取所有的参数
 * @param id
 */
export const getAllAttr = (): AxiosPromise<SourceHalfCountAttrVO[]> => {
  return request({
    url: '/outsource/sourceHalfCountAttr/getAllAttr',
    method: 'get'
  });
};


/**
 * 新增外协加工计价配置
 * @param data
 */
export const addOutSourceCountConfig = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceOrderCraft',
    method: 'post',
    data: data
  });
};

/**
 * 查询外协加工计价配置列表
 * @param query
 * @returns {*}
 */
export const listOutSourceCountConfig = (query?: SourceHalfCountAttrQuery): AxiosPromise<SourceHalfCountAttrVO[]> => {
  return request({
    url: '/outsource/sourceOrderCraft/list',
    method: 'get',
    params: query
  });
};


export const modifyConfigStatus = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceOrderCraft/updateIsOpen',
    method: 'post',
    data: data
  });
};

/**
 * 查询外协加工计价工序配置列表
 * @param query
 * @returns {*}
 */

export const getOutSourceCountCraftConfig = (id: string | number): AxiosPromise<SourceHalfCountAttrVO> => {
  return request({
    url: '/outsource/sourceOrderCraft/' + id,
    method: 'get'
  });
};



/**
 * 修改半制程外协计价配置
 * @param data
 */
export const updateAddOutSourceCountConfig = (data: SourceHalfCountAttrForm) => {
  return request({
    url: '/outsource/sourceOrderCraft',
    method: 'put',
    data: data
  });
};
