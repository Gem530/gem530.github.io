import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NotifyRecordForm, NotifyRecordQuery, NotifyRecordVO } from '@/api/notify/notifyRecord/types';

/**
 * 查询已读通知列表
 * @param query
 * @returns {*}
 */

export const notifyRecordGetList = (query?: NotifyRecordQuery): AxiosPromise<NotifyRecordVO[]> => {
  return request({
    url: '/notify/notifyRecord/getList',
    method: 'get',
    params: query
  });
};
/**
 * 获取已读数量
 */
export const getRecordNum = (query?: NotifyRecordQuery) => {
  return request({
    url: '/notify/notifyRecord/getRecordNum',
    method: 'get',
    params: query
  });
};

/**
 * 已读指定通知
 * @param data
 */
export const readNotify = (data: NotifyRecordForm) => {
  return request({
    url: '/notify/notifyRecord/readNotify',
    method: 'post',
    data: data
  });
};

/**
 * 已读所有通知
 */
export const readAllNotify = () => {
  return request({
    url: '/notify/notifyRecord/readAllNotify',
    method: 'get'
  });
};

/**
 * 获取已读数量
 */
export const getNotifyRecordListAndNum = (query?: NotifyRecordQuery) => {
  return request({
    url: '/notify/notifyRecord/getListAndNum',
    method: 'get',
    params: query
  });
};
