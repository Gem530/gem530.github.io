import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  RawMaterialDeliveryVO,
  RawMaterialDeliveryForm,
  RawMaterialDeliveryQuery,
  DirectMaterialDeliver
} from '@/api/purchase/rawMaterialDelivery/types';

/**
 * 查询供应商物料发货记录列表
 * @param query
 * @returns {*}
 */
export const listRawMaterialDelivery = (query?: RawMaterialDeliveryQuery): AxiosPromise<RawMaterialDeliveryVO[]> => {
  return request({
    url: '/purchase/rawMaterialDelivery/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询供应商物料发货记录详细
 * @param id
 */
export const getRawMaterialDelivery = (id: string | number): AxiosPromise<RawMaterialDeliveryVO> => {
  return request({
    url: '/purchase/rawMaterialDelivery/' + id,
    method: 'get'
  });
};

/**
 * 新增供应商物料发货记录
 * @param data
 */
export const addRawMaterialDelivery = (data: RawMaterialDeliveryForm) => {
  return request({
    url: '/purchase/rawMaterialDelivery',
    method: 'post',
    data: data
  });
};


/**
 * 增加供应商物料发货记录
 * @param data
 */
export const saveRawMaterialDeliver = (data: DirectMaterialDeliver) => {
  return request({
    url: '/purchase/rawMaterialDelivery/saveRawMaterialDeliver',
    method: 'post',
    data: data
  });
};


/**
 * 修改供应商物料发货记录
 * @param data
 */
export const updateRawMaterialDelivery = (data: RawMaterialDeliveryForm) => {
  return request({
    url: '/purchase/rawMaterialDelivery',
    method: 'put',
    data: data
  });
};

/**
 * 删除供应商物料发货记录
 * @param id
 */
export const delRawMaterialDelivery = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/rawMaterialDelivery/' + id,
    method: 'delete'
  });
};
