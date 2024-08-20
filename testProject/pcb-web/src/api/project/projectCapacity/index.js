import request from "@/utils/request";


/**
 * 查询工程产能列表数据
 * @param query
 * @returns {*}
 */
export const queryPageNew = (query) => {
  return request({
    url: '/project/productionPlan/getProjectCapacityReportNew',
    method: 'GET',
    params: query
  });
};





