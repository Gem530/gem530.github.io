import request from "@/utils/request";


/**
 * 查询工程产能列表数据
 * @param query
 * @returns {*}
 */
export const getMiProjectReport = (query) => {
  return request({
    url: '/project/productionPlan/getMiProjectReport',
    method: 'GET',
    params: query
  });
};





