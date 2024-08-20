import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DifferenceOrderVO, DifferenceOrderQuery } from '@/api/report/difference/types';

/**
 * @param query
 * @returns {*}
 */
export const listOrder = (query?: DifferenceOrderQuery): AxiosPromise<DifferenceOrderVO[]> => {
  return request({
    url: '/report/differenceOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * @param query
 * @returns {*}
 */
export const orderBackListOrder = (query?: DifferenceOrderQuery): AxiosPromise<DifferenceOrderVO[]> => {
  return request({
    url: '/report/differenceOrder/orderBackList',
    method: 'get',
    params: query
  });
};

export const getPrintOrder = (query?: DifferenceOrderQuery): AxiosPromise<DifferenceOrderVO[]> => {
  return request({
    url: '/report/differenceOrder/getOrderInfo',
    method: 'get',
    params: query
  });
};

