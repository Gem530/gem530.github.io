import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SupplierMaterialVO, SupplierMaterialForm, SupplierMaterialQuery } from '@/api/basedata/supplierMaterial/types';

/**
 * 查询供应商物料列表
 * @param query
 * @returns {*}
 */

export const listSupplierMaterial = (query?: SupplierMaterialQuery): AxiosPromise<SupplierMaterialVO[]> => {
  return request({
    url: '/basedata/supplierMaterial/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询供应商物料详细
 * @param id
 */
export const getSupplierMaterial = (id: string | number): AxiosPromise<SupplierMaterialVO> => {
  return request({
    url: '/basedata/supplierMaterial/' + id,
    method: 'get'
  });
};

/**
 * 新增供应商物料
 * @param data
 */
export const addSupplierMaterial = (data: SupplierMaterialForm) => {
  return request({
    url: '/basedata/supplierMaterial',
    method: 'post',
    data: data
  });
};

/**
 * 修改供应商物料
 * @param data
 */
export const updateSupplierMaterial = (data: SupplierMaterialForm) => {
  return request({
    url: '/basedata/supplierMaterial',
    method: 'put',
    data: data
  });
};

/**
 * 删除供应商物料
 * @param id
 */
export const delSupplierMaterial = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/supplierMaterial/' + id,
    method: 'delete'
  });
};
