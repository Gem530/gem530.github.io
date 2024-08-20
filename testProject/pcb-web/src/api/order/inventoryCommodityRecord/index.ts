import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InventoryCommodityRecordVO, InventoryCommodityRecordForm, InventoryCommodityRecordQuery } from '@/api/order/inventoryCommodityRecord/types';

/**
 * 查询产品入库记录列表
 * @param query
 * @returns {*}
 */

export const listInventoryCommodityRecord = (query?: InventoryCommodityRecordQuery): AxiosPromise<InventoryCommodityRecordVO[]> => {
  return request({
    url: '/order/inventoryCommodityRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询产品入库记录详细
 * @param id
 */
export const getInventoryCommodityRecord = (id: string | number): AxiosPromise<InventoryCommodityRecordVO> => {
  return request({
    url: '/order/inventoryCommodityRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增产品入库记录
 * @param data
 */
export const addInventoryCommodityRecord = (data: InventoryCommodityRecordForm) => {
  return request({
    url: '/order/inventoryCommodityRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改产品入库记录
 * @param data
 */
export const updateInventoryCommodityRecord = (data: InventoryCommodityRecordForm) => {
  return request({
    url: '/order/inventoryCommodityRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除产品入库记录
 * @param id
 */
export const delInventoryCommodityRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/inventoryCommodityRecord/' + id,
    method: 'delete'
  });
};
