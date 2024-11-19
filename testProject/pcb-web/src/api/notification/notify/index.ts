import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NotifyVO, NotifyForm, NotifyQuery } from '@/api/notify/types';

/**
 * 查询未读通知列表
 * @param query
 * @returns {*}
 */

export const notifyGetList = (query?: NotifyQuery): AxiosPromise<NotifyVO[]> => {
  return request({
    url: '/notify/getList',
    method: 'get',
    params: query
  });
};
/**
 * 获取未读数量
 * @param query
 */
export const getNotifyNum = (query?: NotifyQuery) => {
  return request({
    url: '/notify/getNotifyNum',
    method: 'get',
    params: query
  });
};
/**
 * 获取所有未读集合和未读已读数量
 *
 * @param query
 */
export const getNotifyListAndNum = (query?: NotifyQuery) => {
  return request({
    url: '/notify/getListAndNum',
    method: 'get',
    params: query
  });
};

