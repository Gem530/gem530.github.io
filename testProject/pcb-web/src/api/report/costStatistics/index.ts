import request from '@/utils/request';

/**
 * @param query
 * @returns {*}
 * 开始月份	costMonthStart ("yyyy-MM")
 * 结束月份	costMonthEnd ("yyyy-MM")
 */
export const getCraftListCost = (params: any): any => {
  return request({
    url: '/cost/craft/list',
    method: 'get',
    params
  });
};

