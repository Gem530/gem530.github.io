import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PendingVO, PendingForm, PendingQuery } from '@/api/notification/pending/types';

/**
 * 获取待办集合
 * @param query
 * @returns {*}
 */
export const pendingGetList = (query?: PendingQuery): AxiosPromise<PendingVO[]> => {
  return request({
    url: '/notification/pending/getList',
    method: 'get',
    params: query
  });
};

/**
 * 获取待办数量
 *
 * @returns {*}
 */
export const getPendingNum = (query?: PendingQuery) => {
  return request({
    url: '/notification/pending/getPendingNum',
    method: 'get',
    params: query
  });
};

/**
 * 获取所有代办集合和已办未办数量
 *
 * @returns {*}
 */
export const getPendingListAndNum = (query?: PendingQuery) => {
  return request({
    url: '/notification/pending/getListAndNum',
    method: 'get',
    params: query
  });
};
