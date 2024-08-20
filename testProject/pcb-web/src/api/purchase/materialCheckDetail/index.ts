import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialCheckDetailVO, MaterialCheckDetailForm, MaterialCheckDetailQuery } from '@/api/purchase/materialCheckDetail/types';
import {DirectMaterialBorrow} from "@/api/purchase/materialBorrow/types";

/**
 * 查询物料盘点明细列表
 * @param query
 * @returns {*}
 */

export const listMaterialCheckDetail = (query?: MaterialCheckDetailQuery): AxiosPromise<MaterialCheckDetailVO[]> => {
  return request({
    url: '/purchase/materialCheckDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询物料盘点明细列表
 * @param query
 * @returns {*}
 */

export const listSupplierBackDetail = (query?: MaterialCheckDetailQuery): AxiosPromise<MaterialCheckDetailVO[]> => {
  return request({
    url: '/system/materialBackDetail/listSupplierBackDetail',
    method: 'get',
    params: query
  });
};

/**
 * 供应商查询物料盘点明细列表
 * @param query
 * @returns {*}
 */

export const listBackDetail = (query?: MaterialCheckDetailQuery): AxiosPromise<MaterialCheckDetailVO[]> => {
  return request({
    url: '/system/materialBackDetail/listBackDetail',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料盘点明细详细
 * @param id
 */
export const getMaterialCheckDetail = (id: string | number): AxiosPromise<MaterialCheckDetailVO> => {
  return request({
    url: '/purchase/materialCheckDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增物料盘点明细
 * @param data
 */
export const addMaterialCheckDetail = (data: MaterialCheckDetailForm) => {
  return request({
    url: '/purchase/materialCheckDetail',
    method: 'post',
    data: data
  });
};



/**
 * 新增物料盘点明细
 * @param data
 */
export const savaRawMaterialCheckDetail = (data: DirectMaterialBorrow) => {
  return request({
    url: '/purchase/materialCheckDetail/savaRawMaterialCheckDetail',
    method: 'post',
    data: data
  });
};
/**
 * 修改物料盘点明细
 * @param data
 */
export const updateMaterialCheckDetail = (data: MaterialCheckDetailForm) => {
  return request({
    url: '/purchase/materialCheckDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料盘点明细
 * @param id
 */
export const delMaterialCheckDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialCheckDetail/' + id,
    method: 'delete'
  });
};
