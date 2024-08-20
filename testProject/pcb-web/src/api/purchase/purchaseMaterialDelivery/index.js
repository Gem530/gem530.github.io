import request from "@/utils/request";


/**
 * 查询可生成送货单的采购明细列表
 * @param query
 * @returns {*}
 */
export const listPurchaseDetailDelivery = (query) => {
  return request({
    url: '/purchase/materialHandleDetail/listPurchaseDetailByDelivery',
    method: 'get',
    params: query
  });
};

/**
 * 查询送货单列表
 * @param query
 * @returns {*}
 */
export const listWaitConfirmDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/list',
    method: 'get',
    params: query
  });
};


/**
 * 查询送货单明细
 */
export const viewDeliveryDetail = (id) => {
  return request({
    url: '/purchase/materialDelivery/'+id,
    method: 'get',
  });
};


/**
 * 新增送货单
 */
export const insertDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/add',
    method: 'post',
    data: query.data
  });
};


/**
 * 修改送货单
 */
export const confirmVerifyDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/updateVerify',
    method: 'post',
    data: query.data
  });
};


/**
 * 修改送货单
 */
export const editOrConfirmDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/edit',
    method: 'post',
    data: query.data
  });
};


/**
 * 修改送货单
 */
export const signDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/sign',
    method: 'post',
    data: query.data
  });
};


/**
 * 删除未确认的送货单单据
 */
export const delDelivery = (query) => {
  return request({
    url: '/purchase/materialDelivery/' + query.id,
    method: 'delete'
  });
};






