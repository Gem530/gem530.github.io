import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialOrderVO, MaterialOrderForm, MaterialOrderQuery } from '@/api/purchase/materialOrder/types';
import {RecordVO} from "@/api/purchase/record/types";

/**
 * 查询采购订单列表
 * @param query
 * @returns {*}
 */

export const listMaterialOrder = (query?: MaterialOrderQuery): AxiosPromise<MaterialOrderVO[]> => {
  return request({
    url: '/purchase/materialOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询采购订单列表
 * @param query
 * @returns {*}
 */
export const listPurchaseMaterialOrder = (query?: MaterialOrderQuery): AxiosPromise<MaterialOrderVO[]> => {
  return request({
    url: '/purchase/materialOrder/coll/list',
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
    url: '/purchase/materialOrder/' + id,
    method: 'get'
  });
};

/**
 * 根据订单id查询采购单操作记录
 * @param id
 */
export const operateRecordList = (query?: MaterialOrderQuery): AxiosPromise<RecordVO> => {
  return request({
    url: '/purchase/materialOrder/coll/operateRecordList',
    method: 'get',
    params: query
  });
};

/**
 * 根据订单id查询采购单操作记录
 * @param id
 */
export const getUrlLink = (query : any) => {
  return request({
    url: '/applet/send/generateUrlLink',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料收货采购订单详细
 * @param
 */
export const getMaterialDeliveryOrderDetail =(query?: MaterialOrderQuery): AxiosPromise<MaterialOrderVO[]> => {
  return request({
    url: '/purchase/materialOrder/coll/getMaterialDeliveryOrderDetail',
    method: 'get',
    params: query
  });
};

/**
 * 查询采购订单详细
 * @param id
 */
export const getMaterialOrderDetilList = (id: string | number): AxiosPromise<MaterialOrderVO> => {
  return request({
    url: '/purchase/materialOrder/coll/' + id,
    method: 'get'
  });
};


/**
 * 查询采购订单详细
 * @param id
 */
export const getMaterialOrderDetailReceiptList = (id: string | number): AxiosPromise<MaterialOrderVO> => {
  return request({
    url: '/purchase/materialOrder/coll/receipt/' + id,
    method: 'get'
  });
};


/**
 * 结单
 * @param id
 */
export const updateDetailStatusOpen = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialOrder/coll/updateDetailStatusOpen/' + id,
    method: 'get'
  });
};


/**
 * 取消结单
 * @param id
 */
export const updateDetailStatusClose = (id: string | number) => {
  return request({
    url: '/purchase/materialOrder/coll/updateDetailStatusClose/' + id,
    method: 'get'
  });
};

/**
 * 新增采购订单
 * @param data
 */
export const addMaterialOrder = (data: MaterialOrderForm) => {
  return request({
    url: '/purchase/materialOrder',
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
    url: '/purchase/materialOrder',
    method: 'put',
    data: data
  });
};

/**
 * 采购订单确认
 * @param data
 */
export const confirmOrder = (data: MaterialOrderVO | undefined) => {
  return request({
    url: '/purchase/materialOrder/coll/confirmOrder',
    method: 'post',
    data: data
  });
};

/**
 * 供应商-采购订单确认
 * @param data
 */
export const confirmOrderApp = (data: MaterialOrderVO | undefined) => {
  return request({
    url: '/purchase/materialOrder/coll/confirmOrderApp',
    method: 'post',
    data: data
  });
};

/**
 * 供应商-最终签名确认
 * @param data
 */
export const confirmOrderFinish = (data: MaterialOrderVO | undefined) => {
  return request({
    url: '/purchase/materialOrder/coll/confirmOrderFinish',
    method: 'post',
    data: data
  });
};

/**
 * 采购订单数据对比
 * @param data
 */
export const compareList = (data: MaterialOrderVO | undefined) => {
  return request({
    url: '/purchase/materialOrder/coll/compareList',
    method: 'post',
    data: data
  });
};

/**
 * 设为主单
 * @param data
 */
export const setMainOrder = (id: number | undefined, orderIdList: (string | number)[]) => {
  return request({
    url: '/purchase/materialOrder/setMainOrder',
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
export const modifyStatus = (id: number, status: string) => {
  return request({
    url: '/purchase/materialOrder/modifyStatus',
    method: 'put',
    data: { id, status }
  });
};

/**
 * 删除采购订单
 * @param id
 */
export const delMaterialOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialOrder/coll/' + id,
    method: 'delete'
  });
};


export const doRejectOrder = async (data?: any) => {
  return request({
    url: '/purchase/materialOrder/coll/doRejectOrder',
    method: 'post',
    data: data
  });
}

export const doCopyOrder = async (data?: any) => {
  return request({
    url: '/purchase/materialOrder/coll/doCopyOrder',
    method: 'post',
    data: data
  });
}

/**
 * 订单取消
 */
export const cancelOrder = async (data?: any) => {
  return request({
    url: '/purchase/materialOrder/coll/cancelOrder',
    method: 'post',
    data: data
  });
}

/**
 * 查询采购订单详细
 * @param id
 */
export const getMaterialOrderDetil= (query?: MaterialOrderQuery): AxiosPromise<MaterialOrderVO> => {
  return request({
    url: '/purchase/materialOrder/coll/getOrderDetail',
    method: 'get',
    params: query
  });
};
