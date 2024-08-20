import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {QuotationVO, QuotationForm, QuotationQuery, DirectQuotation} from '@/api/order/quotation/types';
import {DirectOrder} from "@/api/order/directOrder/types";



/**
 * 查询报价单列表
 * @param query
 * @returns {*}
 */

export const listQuotation = (query?: QuotationQuery): AxiosPromise<QuotationVO[]> => {
  return request({
    url: '/order/quotation/list',
    method: 'get',
    params: query
  });
};

export const postListQuotation = (query?: QuotationQuery): AxiosPromise<QuotationVO[]> => {
  return request({
    url: '/order/quotation/list',
    method: 'post',
    data: query
  });
};

/**
 * 查询已作废报价单数据
 * @param query
 */
export const listVoidedQuotation = (query?: QuotationQuery): AxiosPromise<QuotationVO[]> => {
  return request({
    url: '/order/quotation/getVoidedList',
    method: 'get',
    params: query
  });
};

/**
 * 查询报价单详细
 * @param id
 */
export const getQuotation = (id: string | number): AxiosPromise<QuotationVO> => {
  return request({
    url: '/order/quotation/' + id,
    method: 'get'
  });
};

/**
 *批量查询报价单
 */
export const getQuotationList = (data: DirectOrder): AxiosPromise<QuotationVO> => {
  return request({
    url: '/order/quotation/getQuotationList',
    method: 'post',
    data: data
  });
};


/**
 * 查询客户地址详细
 * @param id
 */
export const getCustomerAddressQuotation  = (id: string | number | Array<string | number>)  => {
  return request({
    url: '/basedata/customer/' + id,
    method: 'get',
  });
};


/**
 * 新增报价单
 * @param data
 */
export const addQuotation = (data: QuotationForm) => {
  return request({
    url: '/order/quotation',
    method: 'post',
    data: data
  });
};

/**
 * 修改报价单
 * @param data
 */
export const updateQuotation = (data: QuotationForm) => {
  return request({
    url: '/order/quotation',
    method: 'put',
    data: data
  });
};

/**
 * 驳回报价单
 * @param id
 */
export const delQuotation = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/quotation/rejectOrder/'+id,
    method: 'get',
  });
};

/**
 * 作废报价单
 * @param id
 */
export const cancellationQuotation = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/quotation/cancellation/' + id,
    method: 'get'
  });
};


/**
 * 恢复报价单
 * @param id
 */
export const restoreQuotation = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/quotation/restore/' + id,
    method: 'get'
  });
};



/**
 * 保存报价单
 * @param id
 */
export const aleadyQuotation = (data: DirectQuotation) => {
  return request({
    url: '/order/quotation/already',
    method: 'post',
    data: data
  });
};

