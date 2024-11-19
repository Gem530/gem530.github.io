import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialQuantityAdjustVO, MaterialQuantityAdjustForm, MaterialQuantityAdjustQuery } from '@/api/purchase/materialQuantityAdjust/types';

/**
 * 查询物料数量调整列表
 * @param query
 * @returns {*}
 */
export const listMaterialQuantityAdjust = (query?: MaterialQuantityAdjustQuery): AxiosPromise<MaterialQuantityAdjustVO[]> => {
  return request({
    url: '/purchase/quantityAdjust/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料数量调整详细
 * @param id
 */
export const getMaterialQuantityAdjust = (id: string | number): AxiosPromise<MaterialQuantityAdjustVO> => {
  return request({
    url: '/purchase/quantityAdjust/' + id,
    method: 'get'
  });
};

/**
 * 新增物料数量调整
 * @param data
 */
export const addMaterialQuantityAdjust = (data: MaterialQuantityAdjustForm) => {
  return request({
    url: '/purchase/quantityAdjust',
    method: 'post',
    data: data
  });
};

/**
 * 批量新增物料数量调整
 * @param data
 */
export const addQuantityAdjustList = (data: MaterialQuantityAdjustVO[]) => {
  return request({
    url: '/purchase/quantityAdjust/addList',
    method: 'post',
    data: data
  });
};


/**
 * 修改物料数量调整
 * @param data
 */
export const updateMaterialQuantityAdjust = (data: MaterialQuantityAdjustForm) => {
  return request({
    url: '/purchase/quantityAdjust',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料数量调整
 * @param id
 */
export const delMaterialQuantityAdjust = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/quantityAdjust/' + id,
    method: 'delete'
  });
};

/**
 * 查询物料数量调整列表
 * @param query
 * @returns {*}
 */
export const listQuantityAdjust = (query?: MaterialQuantityAdjustQuery): AxiosPromise<MaterialQuantityAdjustVO[]> => {
  return request({
    url: '/purchase/quantityAdjust/queryList',
    method: 'post',
    data: query
  });
};

/**
 * 审核成本调整
 * @param data
 */
export const auditQuantityAdjust = (data: MaterialQuantityAdjustVO[]) => {
  return request({
    url: '/purchase/quantityAdjust/audit',
    method: 'post',
    data: data
  });
};

/**
 * 查询物料收货数量调整列表
 * @param query
 * @returns {*}
 */
export const listReceiveQuantityAdjust = (query?: MaterialQuantityAdjustQuery): AxiosPromise<MaterialQuantityAdjustVO[]> => {
  return request({
    url: '/purchase/quantityAdjust/receiveList',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料退货数量调整列表
 * @param query
 * @returns {*}
 */
export const listBackQuantityAdjust = (query?: MaterialQuantityAdjustQuery): AxiosPromise<MaterialQuantityAdjustVO[]> => {
  return request({
    url: '/purchase/quantityAdjust/backList',
    method: 'get',
    params: query
  });
};
