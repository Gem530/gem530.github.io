import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceHalfProcessOrderVO, SourceHalfProcessOrderForm, SourceHalfProcessOrderQuery } from '@/api/outsource/sourceHalfProcessOrder/types';
import { AnyColumn } from 'element-plus/es/components/table-v2/src/common';


/**
 * 查询外协加工订单列表-根据外协单号
 * @param query
 * @returns {*}
 */

export const listByOutSourceCode = (code: string): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/getByOutSourceCode/' + code,
    method: 'get'
  });
};
/**
 * 查询外协加工订单列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfProcessOrder = (query?: SourceHalfProcessOrderQuery): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询外协加工订单列表
 * @param query
 * @returns {*}
 */
export const listSupplierHalfOrder = (query?: SourceHalfProcessOrderQuery): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/listSupplierOrder',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工订单列表
 * @param query
 * @returns {*}
 */
export const supplierOrderDetail = (query?: SourceHalfProcessOrderQuery): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/supplierOrderDetail',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工订单列表-已发数量
 * @param query
 * @returns {*}
 */
export const getSourceHalfProcessOrderIssuedQuantity = (query?: SourceHalfProcessOrderQuery): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/issuedQuantity',
    method: 'get',
    params: query
  });
};
/**
 * 查询外协加工可选产品列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfCommodityList = (query?:any): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/commodityList',
    method: 'post',
    data: query
  });
};
/**
 * 查询外协加工可选工序列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfNodeList = (id: string | number): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/productionInfo/' + id,
    method: 'get'
  });
};
/**
 * 查询外协加工可选产品列表
 * @param query
 * @returns {*}
 */

export const getSourceHalfPlanInfo = (data: any): AxiosPromise<SourceHalfProcessOrderVO> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/planInfo',
    method: 'post',
    data: data
  });
};
/**
 * 查询外协加工可选产品列表
 * @param query
 * @returns {*}
 */

export const getProductionInfo = (data: any): AxiosPromise<any> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/getMiByProductionIds?ids=' + data,
    method: 'get'
    // params: { ids: data }
  });
};
/**
 * 查询可选单位列表
 * @param query
 * @returns {*}
 */

export const getUnitList = (data: any): AxiosPromise<any> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/getUnitList',
    method: 'get',
    params: data
  });
};
export const listSourceHalfPnlList = (id: string | number): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/pnlList/' + id,
    method: 'get'
  });
};

/**
 * 查询外协加工订单详细
 * @param id
 */
export const getSourceHalfProcessOrder = (id: string | number): AxiosPromise<SourceHalfProcessOrderVO> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/' + id,
    method: 'get'
  });
};
export const getPrintSourceHalfProcessOrder = (id: string | number): AxiosPromise<SourceHalfProcessOrderVO> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/printInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增外协加工订单
 * @param data
 */
export const addSourceHalfProcessOrder = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/add',
    method: 'post',
    data: data
  });
};

/**
 * 批量修改外协加工订单
 * @param data
 */
export const batchEditSourceHalfProcessOrder = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/batchEdit',
    method: 'post',
    data: data
  });
};

/**
 * 确认外协加工订单
 * @param data
 */
export const confirmSourceHalfProcessOrder = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/confirm',
    method: 'post',
    data: data
  });
};

/**
 * 工序外协单对比是否修改
 * @param data
 */
export const compareList = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/compareList',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工订单
 * @param data
 */
export const updateSourceHalfProcessOrder = (data: SourceHalfProcessOrderForm) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/edit',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工订单
 * @param id
 */
export const delSourceHalfProcessOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/' + id,
    method: 'delete'
  });
};
export const listSourceHalfReduceNodeList = (id: string | number): AxiosPromise<SourceHalfProcessOrderVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/productionInfo/reduceInfo',
    method: 'get'
  });
};
//获取排产单开料板厚信息
export const getProductionCuttingMaterialInfo = (data: any) => {
  return request({
    url: '/production/production/productionInfo/getCuttingMaterial',
    method: 'post',
    data: data
  });
};
/**
 * 修改外协加工订单
 * @param data
 */
export const getSupplierByProductionId = (data: any) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/getSupplierByProductionId',
    method: 'post',
    data: data
  });
};

export const getReworkAllUnitList = (data: any): AxiosPromise<any> => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/getAllUnitList',
    method: 'get',
    params: data
  });
};

/**
 * 工序外协单申请结单
 * @param data
 */
export const sourceHalfStatementDetail = (data: SourceHalfProcessOrderForm) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/statementDetail',
    method: 'post',
    data: data
  });
};

/**
 * 工序外协单申请结单
 * @param data
 */
export const sourceHalfCancelOrder = (data: SourceHalfProcessOrderForm) => {
  return request({
    url: '/outsource/sourceHalfProcessOrder/cancelOrder',
    method: 'post',
    data: data
  });
};
