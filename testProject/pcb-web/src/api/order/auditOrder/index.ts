import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {AuditOrderForm, AuditOrderQuery, AuditOrderVO} from '@/api/order/auditOrder/types';
import {CustomerQuery, CustomerVO} from "@/api/basedata/customer/types";

/**
 * 查询预审单列表
 * @param query
 * @returns {*}
 */

export const listAuditOrder = (query?: AuditOrderQuery): AxiosPromise<AuditOrderVO[]> => {
  return request({
    url: '/system/auditOrder/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询预审单详细
 * @param id
 */
export const getAuditOrder = (id: string | number): AxiosPromise<AuditOrderVO> => {
  return request({
    url: '/system/auditOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增预审单
 * @param data
 */
export const addAuditOrder = (data: AuditOrderForm) => {
  return request({
    url: '/system/auditOrder',
    method: 'post',
    data: data
  });
};

/**
 * 查询客户编码
 */
export const getCustomerCodeList = (query?: CustomerQuery): AxiosPromise<CustomerVO[]> => {
  return request({
    url: '/system/auditOrder/getCustomerCodeList',
    method: 'get',
    params: query
  });
};



/**
 * 修改预审单
 * @param data
 */
export const updateAuditOrder = (data: AuditOrderForm) => {
  return request({
    url: '/system/auditOrder',
    method: 'put',
    data: data
  });
};

/**
 * 删除预审单
 * @param id
 */
export const delAuditOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/auditOrder/' + id,
    method: 'delete'
  });
};

/**
 * 提交预审订单
 * @param id
 */
export const submitAuditOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/auditOrder/updateStatus/' + id,
    method: 'get'
  });
};
