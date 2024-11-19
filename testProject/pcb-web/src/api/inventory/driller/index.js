import request from "@/utils/request";


/**
 * 查询钻咀可用库存列表
 * @param query
 * @returns {*}
 */
export const listDrillerInventory = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询钻咀领用列表
 * @param query
 * @returns {*}
 */
export const listDrillerReceive = (query) => {
  return request({
    url: '/purchase/materialDrillerReceive/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询钻咀操作记录列表
 * @param query
 * @returns {*}
 */
export const listDrillerAbrade = (query) => {
  return request({
    url: '/purchase/materialDrillerAbrade/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询钻咀操作记录列表
 * @param query
 * @returns {*}
 */
export const listDrillerRecord = (query) => {
  return request({
    url: '/purchase/materialDrillerRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 提交钻咀领用
 */
export const commitReceiveDriller = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/commitReceive',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀归还总仓
 */
export const returnMainStorage = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/returnMainStorage',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀领用归还
 */
export const receiveReturn = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/receiveReturn',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀研磨归还
 */
export const abradeReturn = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/abradeReturn',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀领用研磨
 */
export const receiveAbrade = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/receiveAbrade',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀领用报废
 */
export const receiveScrap = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/receiveScrap',
    method: 'post',
    data: query.data
  });
};

/**
 * 钻咀研磨报废
 */
export const abradeScrap = (query) => {
  return request({
    url: '/purchase/materialDrillerInventory/abradeScrap',
    method: 'post',
    data: query.data
  });
};



