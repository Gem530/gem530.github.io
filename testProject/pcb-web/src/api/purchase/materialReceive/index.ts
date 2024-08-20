import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {MaterialReceiveForm, MaterialReceiveQuery, MaterialReceiveVO} from '@/api/purchase/materialReceive/types';
import {DirectMaterialOrderDetail} from "@/api/purchase/materialOrder/types";

/**
 * 查询采购收货记录列表
 * @param query
 * @returns {*}
 */
export const listMaterialReceive = (query?: MaterialReceiveQuery): AxiosPromise<MaterialReceiveVO[]> => {
  return request({
    url: '/system/materialReceive/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询待IQC检测列表
 * @param query
 * @returns {*}
 */
export const getMaterialReceiveList = (query?: MaterialReceiveQuery): AxiosPromise<MaterialReceiveVO[]> => {
  return request({
    url: '/system/materialIqc/getMaterialReceiveList',
    method: 'get',
    params: query
  });
};


/**
 * 查询物料收货记录列表
 * @param query
 * @returns {*}
 */
export const listQueryMaterialReceive = (query?: MaterialReceiveQuery): AxiosPromise<MaterialReceiveVO[]> => {
  return request({
    url: '/system/materialReceive/queryMaterialReceiveList',
    method: 'get',
    params: query
  });
};

/**
 * 保存收货记录
 * @param data
 */
export const saveMaterialOrderDetailInout = (data: DirectMaterialOrderDetail) => {
  return request({
    url: '/system/materialReceive/saveMaterialOrderDetail',
    method: 'post',
    data: data
  });
};



/**
 * 查询采购收货记录详细
 * @param id
 */
export const getMaterialReceive = (id: string | number): AxiosPromise<MaterialReceiveVO> => {
  return request({
    url: '/system/materialReceive/' + id,
    method: 'get'
  });
};

/**
 * 新增采购收货记录
 * @param data
 */
export const addMaterialReceive = (data: MaterialReceiveForm) => {
  return request({
    url: '/system/materialReceive',
    method: 'post',
    data: data
  });
};

/**
 * 修改采购收货记录
 * @param data
 */
export const updateMaterialReceive = (data: MaterialReceiveForm) => {
  return request({
    url: '/system/materialReceive',
    method: 'put',
    data: data
  });
};

/**
 * 删除采购收货记录
 * @param id
 */
export const delMaterialReceive = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/materialReceive/' + id,
    method: 'delete'
  });
};
