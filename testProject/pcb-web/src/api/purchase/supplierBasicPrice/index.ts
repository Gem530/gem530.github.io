import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SupplierBasicPriceVO, SupplierBasicPriceForm, SupplierBasicPriceQuery } from '@/api/purchase/supplierBasicPrice/types';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { RawMaterialVO } from '@/api/basedata/rawMaterial/types';
/**
 * 查询供应商基价列表
 * @param query
 * @returns {*}
 */

export const listSupplierBasicPrice = (query?: SupplierBasicPriceQuery): AxiosPromise<SupplierBasicPriceVO[]> => {
  return request({
    url: '/purchase/supplierBasicPrice/list',
    method: 'get',
    params: query
  });
};
/**
 * 查询未审核供应商基价列表
 * @param query
 * @returns {*}
 */

export const listNotCheckSupplierBasicPrice = (query?: SupplierBasicPriceQuery): AxiosPromise<SupplierBasicPriceVO[]> => {
  return request({
    url: '/purchase/basicPriceRecord/list',
    method: 'get',
    params: query
  });
};
/**
 * 查询已审核供应商基价列表
 * @param query
 * @returns {*}
 */

export const listCheckSupplierBasicPrice = (query?: SupplierBasicPriceQuery): AxiosPromise<SupplierBasicPriceVO[]> => {
  return request({
    url: '/purchase/basicPriceRecord/checkList',
    method: 'get',
    params: query
  });
};

/**
 * 查询供应商基价详细
 * @param id
 */
export const getSupplierBasicPrice = (id: string | number): AxiosPromise<SupplierBasicPriceVO> => {
  return request({
    url: '/purchase/supplierBasicPrice/getInfo/' + id,
    method: 'get'
  });
};
/**
 * 提交审核
 * @param id
 */
export const submitCheck = (id: string | number): AxiosPromise<boolean> => {
  return request({
    url: '/purchase/basicPriceRecord/submit/' + id,
    method: 'get'
  });
};
/**
 * 审核通过
 * @param id
 */
export const reviewCheck = (id: string | number): AxiosPromise<boolean> => {
  return request({
    url: '/purchase/basicPriceRecord/review/' + id,
    method: 'get'
  });
};
/**
 * 驳回
 * @param id
 */
export const rejectCheck = (id: string | number): AxiosPromise<boolean> => {
  return request({
    url: '/purchase/basicPriceRecord/reject/' + id,
    method: 'get'
  });
};
/**
 * 查询供应商基价记录详细
 * @param id
 */
export const getBasicPriceRecord = (id: string | number): AxiosPromise<SupplierBasicPriceVO> => {
  return request({
    url: '/purchase/basicPriceRecord/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增供应商基价
 * @param data
 */
export const addSupplierBasicPrice = (data: SupplierBasicPriceForm) => {
  return request({
    url: '/purchase/basicPriceRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改供应商基价
 * @param data
 */
export const updateSupplierBasicPrice = (data: SupplierBasicPriceForm) => {
  return request({
    url: '/purchase/supplierBasicPrice',
    method: 'put',
    data: data
  });
};
/**
 * 修改未审核的供应商基价
 * @param data
 */
export const updateBasicPriceRecord = (data: SupplierBasicPriceForm) => {
  return request({
    url: '/purchase/basicPriceRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除供应商基价
 * @param id
 */
export const delSupplierBasicPrice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/supplierBasicPrice/' + id,
    method: 'delete'
  });
};
/**
 * 未审核的删除供应商基价
 * @param id
 */
export const delBasicPriceRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/basicPriceRecord/' + id,
    method: 'delete'
  });
};

/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export const listSupplier = (): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/purchase/supplierBasicPrice/supplierList',
    method: 'get'
  });
};

/**
 * 查询原料列表
 * @param query
 * @returns {*}
 */

export const getRawMaterialVoList = (): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/purchase/supplierBasicPrice/rawMaterialVoList',
    method: 'get'
  });
};

/**
 * 批量审核
 * @param data
 */
export const batchAudit = (data: any) => {
  return request({
    url: '/purchase/basicPriceRecord/batchAudit',
    method: 'post',
    data: data
  });
};
