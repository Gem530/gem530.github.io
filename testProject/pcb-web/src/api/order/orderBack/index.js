import request from "@/utils/request";

/**
 * 查询退货订单列表
 * @param query
 * @returns {*}
 */
export const queryPage = (query) => {
  return request({
    url: '/order/orderBack/queryPage',
    method: 'post',
    params: query
  });
};

/**
 * 查询退货订单处理列表
 * @param query
 * @returns {*}
 */
export const queryPageContainsBackHandleData = (query) => {
  return request({
    url: '/order/orderBack/queryPageContainsBackHandleData',
    method: 'post',
    params: query
  });
};

/**
 * 删除退货订单
 * @param query
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteBackOrder = (query) => {
  return request({
    url: '/order/orderBack/deleteBackOrder',
    method: 'get',
    params: query
  });
};


/**
 * 保存退货订单
 * @param query
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const saveBackOrder = (query) => {
  return request({
    url: '/order/orderBack/saveBackOrder',
    method: 'post',
    data: query
  });
};

//========**销售对账退货查询================================================================================

export const listOrderBack = (query) => {
  return request({
    url: '/order/orderBack/list',
    method: 'get',
    params: query
  });
};
