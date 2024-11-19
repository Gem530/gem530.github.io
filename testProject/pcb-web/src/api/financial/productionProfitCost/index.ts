import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 查询排产利润核算列表
 * @param data
 * @returns {*}
 */
export const getProductionProfiOrderList = (data: any): any => {
  return request({
    url: '/cost/productionProfit/productionList',
    method: 'post',
    data
  });
};

/**
 * 订单利润核算页面&&排产利润核算页面  查询详情接口
 * @param params
 * @returns {*}
 */
export const queryDetailProductionProfit = (params: any): any => {
  return request({
    url: '/cost/productionProfit/queryDetail',
    method: 'get',
    params
  });
};