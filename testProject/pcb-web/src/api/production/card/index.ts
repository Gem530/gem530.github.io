import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {CardVO, CardForm, CardQuery} from '@/api/production/card/types';

/**
 * 查询流转卡列表
 * @param query
 * @returns {*}
 */

export const listCard = (query?: CardQuery): AxiosPromise<CardVO[]> => {
  return request({
    url: '/production/production/getCardList',
    method: 'get',
    params: query
  });
};

export const getCardSum = (data?: any) => {
  return request({
    url: '/production/production/getCardSum',
    method: 'post',
    data: data
  });
};

/**
 * 查询流转卡详细
 * @param id
 */
export const getCard = (id: string | number): AxiosPromise<CardVO> => {
  return request({
    url: '/production/card/' + id,
    method: 'get'
  });
};

export const getPrintOrder = (id: string | number): AxiosPromise<CardVO> => {
  return request({
    url: '/production/card/getPrintInfo/' + id,
    method: 'get'
  });
};
/**
 * 新增流转卡
 * @param data
 */
export const addCard = (data: CardForm) => {
  return request({
    url: '/production/card',
    method: 'post',
    data: data
  });
};

/**
 * 修改流转卡
 * @param data
 */
export const updateCard = (data: CardForm) => {
  return request({
    url: '/production/card',
    method: 'put',
    data: data
  });
};

/**
 * 删除流转卡
 * @param id
 */
export const delCard = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/card/' + id,
    method: 'delete'
  });
};

/**
 * 查询可入库列表
 * @param query
 * @returns {*}
 */

export const listCanStorageCard = (query?: CardQuery): AxiosPromise<CardVO[]> => {
  return request({
    url: '/production/production/getCanStorageList',
    method: 'get',
    params: query
  });
};


export const getInOutSum = (data?: any) => {
  return request({
    url: '/production/production/getInOutSum',
    method: 'post',
    data: data
  });
};

/**
 * 查询订单入库数据相关
 * @param data
 */
export const getInInventoryDetails = (data: any) => {
  return request({
    url: '/production/production/getInInventoryDetails',
    method: 'post',
    data: data
  });
};

/**
 * 入库保存接口
 * @param data
 */
export const saveCommodityInOutRecord = (data: any) => {
  return request({
    url: '/production/production/saveCommodityInOutRecord',
    method: 'post',
    data: data
  });
};

/**
 * 查询入库记录
 */
export const getInRecordList = (data: any) => {
  return request({
    url: '/production/production/getInRecordList',
    method: 'post',
    data: data
  });
};

/**
 * 删除出入库记录
 */
export const delInRecords = (data:any) => {
  return request({
    url: '/production/production/delStorageRecord',
    method: 'post',
    data: data
  });
};

/**
 * 查询出入库记录
 * @param query
 * @returns {*}
 */

export const getInOutList = (query?: any) => {
  return request({
    url: '/production/production/getInOutList',
    method: 'get',
    params: query
  });
};

/**
 * 查询报废列表
 * @param query
 * @returns {*}
 */

export const getScrapList = (query?: any) => {
  return request({
    url: '/production/production/getScrapList',
    method: 'get',
    params: query
  });
};

/**
 * 根据排产单id获取对应节点数据
 * @param query
 */
export const getNodesByProductionId = (id?: any) => {
  return request({
    url: '/production/production/getNodesByProductionId?productionId=' + id,
    method: 'get'
  });
};

export const getCardList = (data?: any) => {
  return request({
    url: '/production/card/getList',
    method: 'post',
    data: data
  });
};

/**
 * 同步流转卡
 * @param data
 */
export const updateMiNodesToCard = (data: any) => {
  return request({
    url: '/production/production/updateMiNodesToCard',
    method: 'post',
    data: data
  });
};

/**
 * 暂停排产
 * @param data
 */
export const stopProduction = (data: any) => {
  return request({
    url: '/production/card/stopProduction',
    method: 'post',
    data: data
  });
};

/**
 * 暂停排产
 * @param data
 */
export const restartProduction = (data: any) => {
  return request({
    url: '/production/card/restartProduction',
    method: 'post',
    data: data
  });
};

/**
 * 作废排产
 * @param data
 */
export const deleteProduction = (data: any) => {
  return request({
    url: '/production/production/invalidProduction',
    method: 'post',
    data: data
  });
};

/**
 * 拆卡
 * @param data
 */
export const splitCard = (data: any) => {
  return request({
    url: '/production/card/splitCard',
    method: 'post',
    data: data
  });
};

/**
 * 合卡
 * @param data
 */
export const mergeCard = (data: any) => {
  return request({
    url: '/production/card/mergeCard',
    method: 'post',
    data: data
  });
};
