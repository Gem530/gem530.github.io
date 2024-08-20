import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ScrapVO, ScrapForm, ScrapQuery } from '@/api/production/scrap/types';

/**
 * 查询生产报废列表
 * @param query
 * @returns {*}
 */

export const listScrap = (query?: ScrapQuery): AxiosPromise<ScrapVO[]> => {
  return request({
    url: '/production/scrap/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产报废详细
 * @param id
 */
export const getScrap = (id: string | number): AxiosPromise<ScrapVO> => {
  return request({
    url: '/production/scrap/' + id,
    method: 'get'
  });
};

/**
 * 新增生产报废
 * @param data
 */
export const addScrap = (data: ScrapForm) => {
  return request({
    url: '/production/scrap',
    method: 'post',
    data: data
  });
};

/**
 * 修改生产报废
 * @param data
 */
export const updateScrap = (data: ScrapForm) => {
  return request({
    url: '/production/scrap',
    method: 'put',
    data: data
  });
};

/**
 * 删除生产报废
 * @param id
 */
export const delScrap = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/scrap/' + id,
    method: 'delete'
  });
};

/**
 * 批量保存报废
 * @param data
 */
export const saveScrap = (data: any) => {
  return request({
    url: '/production/production/saveScrap',
    method: 'post',
    data: data
  });
};

/**
 * 校验报废
 * @param data
 */
export const checkScrap = (data: any) => {
  return request({
    url: '/production/production/checkScrap',
    method: 'post',
    data: data
  });
};

/**
 * 校验报废
 * @param data
 */
export const checkScrapRemediation = (data: any) => {
  return request({
    url: '/production/production/checkScrapRemediation',
    method: 'post',
    data: data
  });
};

/**
 * 获取列表
 * @param data
 */
export const getScrapListByCard = (data: any) => {
  return request({
    url: '/production/scrap/getList',
    method: 'post',
    data: data
  });
};

/**
 * 删除报废
 */
export const delProductionScrap = (data: any) => {
  return request({
    url: '/production/production/delProductionScrap',
    method: 'post',
    data: data
  });
};

/**
 * 报废明细查询
 */
export const getScrapDetails = (data: any) => {
  return request({
    url: '/production/scrap/getScrapDetails',
    method: 'post',
    data: data
  });
};

/**
 * 报废明细
 */
export const getDetailByIds = (data: any) => {
  return request({
    url: '/production/scrap/getDetailByIds',
    method: 'post',
    data: data
  });
};

/**
 * 报废明细
 */
export const checkReasonDelete = (data: any) => {
  return request({
    url: '/production/scrap/checkReasonDelete',
    method: 'post',
    data: data
  });
};
