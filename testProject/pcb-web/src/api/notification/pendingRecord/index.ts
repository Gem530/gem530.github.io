import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PendingRecordVO, PendingRecordForm, PendingRecordQuery } from '@/api/notification/pendingRecord/types';

/**
 * 获取代办处理记录集合
 * @param query
 * @returns {*}
 */

export const pendingRecordGetList = (query?: PendingRecordQuery): AxiosPromise<PendingRecordVO[]> => {
  return request({
    url: '/notification/pendingRecord/getList',
    method: 'get',
    params: query
  });
};
/**
 * 获取已办数量
 */
export const getRecordNum = (query?: PendingRecordQuery) => {
  return request({
    url: '/notification/pendingRecord/getRecordNum',
    method: 'get',
    params: query
  });
};
/**
 * 获取已办集合和已办未办数量
 */
export const getPendingRecordListAndNum = (query?: PendingRecordQuery) => {
  return request({
    url: '/notification/pendingRecord/getListAndNum',
    method: 'get',
    params: query
  });
};
