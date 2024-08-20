import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialOrderDetailVO, MaterialOrderDetailForm, MaterialOrderDetailQuery } from '@/api/purchase/materialHandleDetail/types';

/**
 * 查询采购明细列表
 * @param query
 * @returns {*}
 */

export const listMaterialOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询采购明细详细
 * @param id
 */
export const getMaterialOrderDetail = (id: string | number): AxiosPromise<MaterialOrderDetailVO> => {
  return request({
    url: '/purchase/materialHandleDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增采购明细
 * @param data
 */
export const addMaterialOrderDetail = (data: MaterialOrderDetailForm) => {
  return request({
    url: '/purchase/materialHandleDetail',
    method: 'post',
    data: data
  });
};
/**
 * 批量保存采购明细
 * @param data
 */
export const saveOrderDetailList = (data: MaterialOrderDetailVO[]) => {
  return request({
    url: '/purchase/materialHandleDetail/saveOrderDetailList',
    method: 'post',
    data: data
  });
};
/**
 * 校验采购明细是否被删除
 * @param data
 */
export const checkOrderDetailList = (data: MaterialOrderDetailVO[]) => {
  return request({
    url: '/purchase/materialHandleDetail/checkOrderDetailList',
    method: 'post',
    data: data
  });
};
/**
 * 批量提交采购明细
 * @param data
 */
export const submitOrderDetailList = (data: MaterialOrderDetailVO[]) => {
  return request({
    url: '/purchase/materialHandleDetail/submitOrderDetailList',
    method: 'post',
    data: data
  });
};
/**
 * 批量保存采购明细
 * @param data
 */
export const copySaveOrderDetailList = (data: MaterialOrderDetailVO[]) => {
  return request({
    url: '/purchase/materialHandleDetail/copySaveOrderDetailList',
    method: 'post',
    data: data
  });
};
/**
 * 批量提交采购明细
 * @param data
 */
export const copySubmitOrderDetailList = (data: MaterialOrderDetailVO[]) => {
  return request({
    url: '/purchase/materialHandleDetail/copySubmitOrderDetailList',
    method: 'post',
    data: data
  });
};

/**
 * 修改采购明细
 * @param data
 */
export const updateMaterialOrderDetail = (data: MaterialOrderDetailForm) => {
  return request({
    url: '/purchase/materialHandleDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除采购明细
 * @param id
 */
export const delMaterialOrderDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialHandleDetail/' + id,
    method: 'delete'
  });
};

/**
 * 采购明细申请结单
 * @param data
 */
export const statementDetail = (data: MaterialOrderDetailVO) => {
  return request({
    url: '/purchase/materialHandleDetail/statementDetail',
    method: 'post',
    data: data
  });
};

/**
 * 查询结单的采购明细详细
 * @param id
 */
export const getStatementInfo = (id: string | number): AxiosPromise<MaterialOrderDetailVO> => {
  return request({
    url: '/purchase/materialHandleDetail/statementInfo/' + id,
    method: 'get'
  });
};
