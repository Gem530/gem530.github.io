import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SaleOrderDetailVO, SaleOrderDetailQuery } from '@/api/report/saleOrderDetail/types';

/**
 * @param query
 * @returns {*}
 */
export const listOrder = (query?: SaleOrderDetailQuery): AxiosPromise<SaleOrderDetailVO[]> => {
  return request({
    url: '/report/saleOrderDetail/list',
    method: 'get',
    params: query
  });
};
/**
 * @param query
 * @returns {*}
 */
export const listPostOrder = (query?: SaleOrderDetailQuery): AxiosPromise<SaleOrderDetailVO[]> => {
  return request({
    url: '/report/saleOrderDetail/list',
    method: 'post',
    data: query
  });
};


/**
 * @param query
 * @returns {*}
 */
export const getCount = (query?: SaleOrderDetailQuery): AxiosPromise<SaleOrderDetailVO[]> => {
  return request({
    url: '/report/saleOrderDetail/count',
    method: 'get',
    params: query
  });
};
export const getPostCount = (query?: SaleOrderDetailQuery): AxiosPromise<SaleOrderDetailVO[]> => {
  return request({
    url: '/report/saleOrderDetail/count',
    method: 'post',
    data: query
  });
};