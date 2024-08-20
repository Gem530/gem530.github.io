import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ScrapRecordVO, ScrapRecordForm, ScrapRecordQuery } from '@/api/order/scrapRecord/types';

/**
 * 查询报废记录列表
 * @param query
 * @returns {*}
 */

export const listScrapRecord = (query?: ScrapRecordQuery): AxiosPromise<ScrapRecordVO[]> => {
  return request({
    url: '/order/scrapRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询报废记录详细
 * @param id
 */
export const getScrapRecord = (id: string | number): AxiosPromise<ScrapRecordVO> => {
  return request({
    url: '/order/scrapRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增报废记录
 * @param data
 */
export const addScrapRecord = (data: ScrapRecordForm) => {
  return request({
    url: '/order/scrapRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改报废记录
 * @param data
 */
export const updateScrapRecord = (data: ScrapRecordForm) => {
  return request({
    url: '/order/scrapRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除报废记录
 * @param id
 */
export const delScrapRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/scrapRecord/' + id,
    method: 'delete'
  });
};
