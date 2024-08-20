import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InProgressOrderVO, InProgressOrderForm, InProgressOrderQuery } from '@/api/report/inProgressOrder/types';

/**
 * @param query
 * @returns {*}
 */
export const listOrder = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/list',
    method: 'get',
    params: query
  });
};

export const getProjectFile = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/getProjectFile',
    method: 'post',
    params: query
  });
};

export const getQualityProjectFile = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/getQualityProjectFile',
    method: 'post',
    data: query
  });
};


export const deletePZFile = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/deleteRecord',
    method: 'post',
    data: query
  });
};


export const uploadPZFile = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/uploadRecord',
    method: 'post',
    data: query
  });
};


export const getPrintOrder = (query?: InProgressOrderQuery): AxiosPromise<InProgressOrderVO[]> => {
  return request({
    url: '/report/inProgressOrder/getOrderInfo',
    method: 'get',
    params: query
  });
};

