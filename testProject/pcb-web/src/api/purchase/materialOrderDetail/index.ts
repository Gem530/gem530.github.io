import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {
  MaterialOrderDetailForm,
  MaterialOrderDetailQuery,
  MaterialOrderDetailVO
} from '@/api/purchase/materialOrderDetail/types';
import {FileItemVO, FileQuery} from "@/api/upload/types";
import {RecordVO} from "@/api/purchase/record/types";

/**
 * 查询采购明细列表
 * @param query
 * @returns {*}
 */

export const listMaterialOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialOrderDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料收货采购订单列表
 * @param query
 * @returns {*}
 */
export const listPurchaseMaterialOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialOrder/coll/receiptList',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料收货待收货列表 2024.1.3
 * @param query
 * @returns {*}
 */
export const listPurchaseMaterialReceiptOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialOrder/coll/orderDetailList',
    method: 'get',
    params: query
  });
};


/**
 * 查询采购订单按物料列表
 * @param query
 * @returns {*}
 */
export const listPurchaseOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/listPurchaseOrderDetail',
    method: 'get',
    params: query
  });
};
/**
 * 查询采购订单按物料列表-退货审核
 * @param query
 * @returns {*}
 */
export const listPurchaseOrderDetailByBack = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/listBackOrderDetail',
    method: 'get',
    params: query
  });
};


/**
 * 查询采购订单按物料列表
 * @param query
 * @returns {*}
 */
export const listPurchaseOrderDetailSum = (query?: any) => {
  return request({
    url: '/purchase/materialHandleDetail/listPurchaseOrderDetailSum',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询采购订单按物料列表
 * @param query
 * @returns {*}
 */
export const listSupplierOrderDetail = (query?: MaterialOrderDetailQuery): AxiosPromise<MaterialOrderDetailVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/listSupplierOrderDetail',
    method: 'get',
    params: query
  });
};

/**
 * 根据采购明细id查询操作记录
 * @param query
 * @returns {*}
 */
export const queryOperateRecordList = (query?: MaterialOrderDetailQuery): AxiosPromise<RecordVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/queryOperateRecordList',
    method: 'get',
    params: query
  });
};

/**
 * 根据订单id查询附件
 * @param query
 * @returns {*}
 */
export const listFile = (query: FileQuery): AxiosPromise<FileItemVO[]> => {
  return request({
    url: '/purchase/materialHandleDetail/listFile',
    method: 'get',
    params: query
  });
};

/**
 * 上传附件
 * @param data
 */
export const uploadFile = (data: any) => {
  return request({
    url: '/purchase/materialHandleDetail/uploadFile',
    method: 'post',
    data: data
  });
};

/**
 * 新增采购明细操作记录
 * @param data
 */
export const addOperateRecord = (data: RecordVO | undefined) => {
  return request({
    url: '/purchase/materialHandleDetail/addOperateRecord',
    method: 'post',
    data: data
  });
};

/**
 * 查询采购明细详细
 * @param id
 */
export const getMaterialOrderDetail = (id: string | number): AxiosPromise<MaterialOrderDetailVO> => {
  return request({
    url: '/purchase/materialOrderDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增采购明细
 * @param data
 */
export const addMaterialOrderDetail = (data: MaterialOrderDetailForm) => {
  return request({
    url: '/purchase/materialOrderDetail',
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
    url: '/purchase/materialOrderDetail/saveOrderDetailList',
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
    url: '/purchase/materialOrderDetail/submitOrderDetailList',
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
    url: '/purchase/materialOrderDetail',
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
 * 查询采购订单单预览打印
 * @param query
 * @returns {*}
 */
export const review = (id?: any): AxiosPromise<any> => {
  return request({
    url: '/purchase/materialHandle/review/' + id,
    method: 'get'
  });
};
/**
 * 查询采购订单单预览打印
 * @param query
 * @returns {*}
 */
export const reviewList = (id?: any): AxiosPromise<any> => {
  return request({
    url: '/purchase/materialHandle/reviewList/' + id,
    method: 'get'
  });
};



