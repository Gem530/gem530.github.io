import request from "@/utils/request";


/**
 * 查询退货订单处理列表
 * @param query
 * @returns {*}
 */
export const queryHandleRecord = (query) => {
  return request({
    url: '/order/orderBackHandle/queryHandleRecord',
    method: 'get',
    params: query
  });
};

/**
 * 新增重新入库退货订单处理记录
 * @param query
 * @returns {*}
 */
export const saveReInventory = (query) => {
  return request({
    url: '/order/orderBackHandle/saveReInventory',
    method: 'post',
    data: query
  });
};

/**
 * 新增重新发货退货订单处理记录
 * @param query
 * @returns {*}
 */
export const saveReDelivery = (query) => {
  return request({
    url: '/order/orderBackHandle/saveReDelivery',
    method: 'post',
    data: query
  });
};
/**
 * 新增供应商责任退货订单处理记录
 * @param query
 * @returns {*}
 */
export const saveSupplierScrap = (query) => {
  return request({
    url: '/order/orderBackHandle/saveSupplierScrap',
    method: 'post',
    data: query
  });
};

/**
 * 新增本厂责任退货订单处理记录
 * @param query
 * @returns {*}
 */
export const saveSelfScrap = (query) => {
  return request({
    url: '/order/orderBackHandle/saveSelfScrap',
    method: 'post',
    data: query
  });
};
