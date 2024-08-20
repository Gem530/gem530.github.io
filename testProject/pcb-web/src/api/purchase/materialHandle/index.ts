import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialOrderVO, MaterialOrderForm, MaterialOrderQuery } from '@/api/purchase/materialHandle/types';

/**
 * 查询采购订单列表
 * @param query
 * @returns {*}
 */

export const listMaterialOrder = (query?: MaterialOrderQuery): AxiosPromise<MaterialOrderVO[]> => {
  return request({
    url: '/purchase/materialHandle/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询采购订单详细
 * @param id
 */
export const getMaterialOrder = (id: string | number): AxiosPromise<MaterialOrderVO> => {
  return request({
    url: '/purchase/materialHandle/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增采购订单
 * @param data
 */
export const addMaterialOrder = (data: MaterialOrderForm) => {
  return request({
    url: '/purchase/materialHandle',
    method: 'post',
    data: data
  });
};

/**
 * 修改采购订单
 * @param data
 */
export const updateMaterialOrder = (data: MaterialOrderVO | undefined) => {
  return request({
    url: '/purchase/materialHandle',
    method: 'put',
    data: data
  });
};
/**
 * 设为主单
 * @param data
 */
export const setMainOrder = (id: number | undefined, orderIdList: (string | number)[]) => {
  return request({
    url: '/purchase/materialHandle/setMainOrder',
    method: 'put',
    data: {
      id,
      orderIdList
    }
  });
};
/**
 * 修改物料申请状态
 * @param data
 */
export const modifyStatus = (id: number, status: string, supplierId: number, supplierSwitch: any) => {
  return request({
    url: '/purchase/materialHandle/modifyStatus',
    method: 'put',
    data: { id, status, supplierId, supplierSwitch }
  });
};

/**
 * 删除采购订单
 * @param id
 */
export const delMaterialOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialHandle/' + id,
    method: 'delete'
  });
};
