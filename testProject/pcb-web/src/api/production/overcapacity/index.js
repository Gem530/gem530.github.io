import request from "@/utils/request";

/**
 * 查询过数产品列表数据
 * @param query
 * @returns {*}
 */
export const queryPage = (query) => {
  return request({
    url: '/production/production/getOvercapacityList',
    method: 'GET',
    params: query
  });
};

/**
 * 查询过数左上角总款数和总面积
 * @param query
 * @returns {*}
 */
export const getOvercapacitySum = (query) => {
  return request({
    url: '/production/production/getOvercapacitySum',
    method: 'post',
    data: query
  });
};


