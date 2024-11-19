import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {SaleDashboardForm, SaleDashboardQuery, SaleDashboardVO } from '@/api/order/saleDashboard/types';

/**
 * 查询报价单列表
 * @param query
 * @returns {*}
 */

export const getDashboardInfo = (query?: SaleDashboardQuery): AxiosPromise<SaleDashboardVO> => {
  return request({
    url: '/order/saleDashboard/dashboardInfo',
    method: 'get',
    params: query
  });
};
/**
 * 查询报价单列表-详情
 * @param query
 * @returns {*}
 */

export const getDashboardInfoDetail = (query?: SaleDashboardQuery): AxiosPromise<SaleDashboardVO> => {
  return request({
    url: '/order/saleDashboard/dashboardDetail',
    method: 'get',
    params: query
  });
};
