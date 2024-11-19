
import request from '@/utils/request';

/**
 * 查询订单利润核算列表
 * @param params
 * @returns {*}
 */
export const getProfiOrderList = (data: any): any => {
  return request({
    url: '/cost/productionProfit/orderList',
    method: 'post',
    data
  });
};