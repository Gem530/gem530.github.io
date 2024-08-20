import request from "@/utils/request";

/**
 * 查询销售个人产能数据
 * @param query
 * @returns {*}
 */
export const queryCapacity = (query) => {
  return request({
    url: '/order/saleOrder/getOrderPersonalCapacityReport',
    method: 'GET',
    params: query
  });
};



