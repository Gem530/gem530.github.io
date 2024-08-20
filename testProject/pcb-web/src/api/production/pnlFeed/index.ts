import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PnlFeedVO, PnlFeedForm, PnlFeedQuery } from '@/api/production/pnlFeed/types';

/**
 * 查询pnl生产投料列表
 * @param query
 * @returns {*}
 */

export const listPnlFeed = (query?: PnlFeedQuery): AxiosPromise<PnlFeedVO[]> => {
  return request({
    url: '/production/pnlFeed/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询pnl生产投料详细
 * @param id
 */
export const getPnlFeed = (id: string | number): AxiosPromise<PnlFeedVO> => {
  return request({
    url: '/production/pnlFeed/' + id,
    method: 'get'
  });
};

/**
 * 新增pnl生产投料
 * @param data
 */
export const addPnlFeed = (data: PnlFeedForm) => {
  return request({
    url: '/production/pnlFeed',
    method: 'post',
    data: data
  });
};

/**
 * 修改pnl生产投料
 * @param data
 */
export const updatePnlFeed = (data: PnlFeedForm) => {
  return request({
    url: '/production/pnlFeed',
    method: 'put',
    data: data
  });
};

/**
 * 删除pnl生产投料
 * @param id
 */
export const delPnlFeed = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/pnlFeed/' + id,
    method: 'delete'
  });
};
