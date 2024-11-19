import request from '@/utils/request';

/**
 * @param query
 * @returns {*}
 * 开始月份	costMonthStart ("yyyy-MM")
 * 结束月份	costMonthEnd ("yyyy-MM")
 */
export const getCraftListOutsourcCost = (params: any): any => {
  return request({
    url: '/cost/outSourceCraft/list',
    method: 'get',
    params
  });
};

