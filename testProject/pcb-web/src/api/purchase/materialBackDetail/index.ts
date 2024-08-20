import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  MaterialBackDetailVO,
  MaterialBackDetailForm,
  MaterialBackDetailQuery,
  DirectPurchase
} from '@/api/purchase/materialBackDetail/types';

/**
 * 查询物料退货明细列表
 * @param query
 * @returns {*}
 */

export const listMaterialBackDetail = (query?: MaterialBackDetailQuery): AxiosPromise<MaterialBackDetailVO[]> => {
  return request({
    url: '/system/materialBackDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料退货明细详细
 * @param id
 */
export const getMaterialBackDetail = (id: string | number): AxiosPromise<MaterialBackDetailVO> => {
  return request({
    url: '/system/materialBackDetail/' + id,
    method: 'get'
  });
};

/**
 * 提交退货明细状态
 * @param id
 */
export const updateBackDetailStatus = (id: string | number): AxiosPromise<MaterialBackDetailVO> => {
  return request({
    url: '/system/materialBackDetail/updateMaterialBackDetailStatus/' + id,
    method: 'get'
  });
};

/**
 * 提交退货明细状态
 * @param id
 */
export const updateBackDetailRejectStatus = (id: string | number): AxiosPromise<MaterialBackDetailVO> => {
  return request({
    url: '/system/materialBackDetail/updateBackDetailRejectStatus/' + id,
    method: 'get'
  });
};

/**
 * 通过退货明细状态
 * @param id
 */
export const passBackDetailRejectStatus = (id: string | number): AxiosPromise<MaterialBackDetailVO> => {
  return request({
    url: '/system/materialBackDetail/passBackDetailRejectStatus/' + id,
    method: 'get'
  });
};



/**
 * 新增物料退货明细
 * @param data
 */
export const addMaterialBackDetail = (data: MaterialBackDetailForm) => {
  return request({
    url: '/system/materialBackDetail',
    method: 'post',
    data: data
  });
};

/**
 * 点确定新增物料退货明细
 * @param data
 */
export const saveMaterialBackDetail = (data: DirectPurchase) => {
  return request({
    url: '/system/materialBackDetail/saveMaterialBackDetail',
    method: 'post',
    data: data
  });
};

/**
 * 通过和驳回
 */
export const updateMaterialBackStatus= (data: DirectPurchase) => {
  return request({
    url: '/system/materialBackDetail/updateMaterialBackStatus',
    method: 'post',
    data: data
  });
};

/**
 * 退货单确认
 */
export const confirmMaterialBack = (data: DirectPurchase) => {
  return request({
    url: '/system/materialBackDetail/confirmMaterialBack',
    method: 'post',
    data: data
  });
};

/**
 * 供应商-退货单确认
 */
export const confirmMaterialBackApp = (data: any) => {
  return request({
    url: '/system/materialBackDetail/confirmMaterialBackApp',
    method: 'post',
    data: data
  });
};

/**
 * 供应商-最终签名确认
 */
export const confirmMaterialBackFinish = (data: any) => {
  return request({
    url: '/system/materialBackDetail/confirmMaterialBackFinish',
    method: 'post',
    data: data
  });
};

/**
 * 退货单对比是否修改
 */
export const compareList = (data: any[]) => {
  return request({
    url: '/system/materialBackDetail/compareList',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料退货明细
 * @param data
 */
export const updateMaterialBackDetail = (data: MaterialBackDetailForm) => {
  return request({
    url: '/system/materialBackDetail',
    method: 'put',
    data: data
  });
};

/**
 * 修改物料退货明细
 * @param data
 */
export const updateMaterialBackDetailQuantity = (data: MaterialBackDetailForm) => {
  return request({
    url: '/system/materialBackDetail/updateBackDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料退货明细
 * @param id
 */
export const delMaterialBackDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialBackDetail/' + id,
    method: 'delete'
  });
};

/**
 * 退货单申请取消
 * @param id
 */
export const cancelBackOrder = (data: any) => {
  return request({
    url: '/system/materialBackDetail/cancelBackOrder',
    method: 'post',
    data: data
  });
};
