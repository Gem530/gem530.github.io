import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeliveryConfigVO, DeliveryConfigForm, DeliveryConfigQuery } from '@/api/basedata/deliveryConfig/types';

/**
 * 查询deliveryConfig列表
 * @param query
 * @returns {*}
 */

export const listDeliveryConfig = (query?: DeliveryConfigQuery): AxiosPromise<DeliveryConfigVO[]> => {
  return request({
    url: '/basedata/deliveryConfig/list',
    method: 'get',
    params: query
  });
};

export const postListDeliveryConfig = (query?: DeliveryConfigQuery): AxiosPromise<DeliveryConfigVO[]> => {
  return request({
    url: '/basedata/deliveryConfig/list',
    method: 'post',
    data: query
  });
};
/**
 * 查询deliveryConfig详细
 * @param id
 */
export const getDeliveryConfig = (id: string | number): AxiosPromise<DeliveryConfigVO> => {
  return request({
    url: '/basedata/deliveryConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增deliveryConfig
 * @param data
 */
export const addDeliveryConfig = (data: DeliveryConfigForm) => {
  return request({
    url: '/basedata/deliveryConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改deliveryConfig
 * @param data
 */
export const updateDeliveryConfig = (data: DeliveryConfigForm) => {
  return request({
    url: '/basedata/deliveryConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除deliveryConfig
 * @param id
 */
export const delDeliveryConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/deliveryConfig/' + id,
    method: 'delete'
  });
};
