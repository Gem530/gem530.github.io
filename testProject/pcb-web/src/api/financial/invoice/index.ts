import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InvoiceVO, InvoiceForm, InvoiceQuery } from '@/api/financial/invoice/types';

/**
 * 查询发票记录列表
 * @param query
 * @returns {*}
 */

export const listInvoice = (query?: InvoiceQuery): AxiosPromise<InvoiceVO[]> => {
  return request({
    url: '/financial/invoice/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询发票记录详细
 * @param id
 */
export const getInvoice = (id: any): AxiosPromise<InvoiceVO> => {
  return request({
    url: '/financial/invoice/' + id,
    method: 'get'
  });
};

/**
 * 新增发票记录
 * @param data
 */
export const addInvoice = (data: InvoiceForm) => {
  return request({
    url: '/financial/invoice',
    method: 'post',
    data: data
  });
};

/**
 * 导入发票记录
 * @param data
 */
export const importData = (data: any) => {
  return request({
    url: '/financial/invoice/importData',
    method: 'post',
    data: data
  });
};

/**
 * 导入发票记录
 * @param data
 */
export const importDataCustomer = (data: any) => {
  return request({
    url: '/financial/invoice/importDataCustomer',
    method: 'post',
    data: data
  });
};

/**
 * 查询当前用户的导入记录
 * @param query
 * @returns {*}
 */

export const listByUser = (query?: any) => {
  return request({
    url: '/system/importLog/listByUser',
    method: 'get',
    params: query
  });
};

/**
 * 修改发票记录
 * @param data
 */
export const updateInvoice = (data: InvoiceForm) => {
  return request({
    url: '/financial/invoice',
    method: 'put',
    data: data
  });
};

/**
 * 删除发票记录
 * @param id
 */
export const delInvoice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/invoice/' + id,
    method: 'delete'
  });
};
