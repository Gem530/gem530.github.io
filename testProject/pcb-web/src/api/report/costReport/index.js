import request from "@/utils/request";

/**
 * 查询工序成本详情
 * @param query
 * @returns {*}
 */
export const queryCostCraftDetailPage = (query) => {
  return request({
    url: '/purchase/materialInOutRecord/queryCraftInOutDetailPageList',
    method: 'GET',
    params: query
  });
};

/**
 * 查询发料成本明细
 * @param query
 * @returns {*}
 */
export const queryCostPlateBalancePage = (query) => {
  return request({
    url: '/cost/plateBalance/list',
    method: 'GET',
    params: query
  });
};

/**
 * 查询发料成本明细
 * @param query
 * @returns {*}
 */
export const queryCostOutSourceDetailPage = (query) => {
  return request({
    url: '/cost/outSourceCraft/listOutSourceCraftDetail',
    method: 'GET',
    params: query
  });
};

/**
 * 查询发料成本明细
 * @param query
 * @returns {*}
 */
export const listFeiLinPageList = (query) => {
  return request({
    url: '/cost/outSourceCraft/listFeiLinPageList',
    method: 'GET',
    params: query
  });
};

/**
 * 查询工序成本明细左上角汇总数据
 * @param query
 * @returns {*}
 */
export const getCostCraftDetailSum = (query) => {
  return request({
    url: '/purchase/materialInOutRecord/getCostCraftDetailSum',
    method: 'GET',
    params: query
  });
};


