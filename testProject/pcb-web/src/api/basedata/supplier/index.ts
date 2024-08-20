import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SupplierVO, SupplierForm, SupplierQuery } from '@/api/basedata/supplier/types';

/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export const listSupplier = (query?: SupplierQuery): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/basedata/supplier/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export const listSupplierNoPage = (query?: SupplierQuery): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/basedata/supplier/supplierList',
    method: 'post',
    data: query ? query : {}
  });
};



/**
 * 查询供应商详细
 * @param id
 */
export const getSupplier = (id: string | number): AxiosPromise<SupplierVO> => {
  return request({
    url: '/basedata/supplier/' + id,
    method: 'get'
  });
};

/**
 * 查询所有单位节点的部门
 * @returns {*}
 */

export const selectCompanyDept = () => {
  return request({
    url: '/system/dept/selectCompanyDeptUnSetSupplier',
    method: 'get'
  });
};

/**
 * 新增供应商
 * @param data
 */
export const addSupplier = (data: SupplierForm) => {
  return request({
    url: '/basedata/supplier',
    method: 'post',
    data: data
  });
};

/**
 * 修改供应商
 * @param data
 */
export const updateSupplier = (data: SupplierForm) => {
  return request({
    url: '/basedata/supplier',
    method: 'put',
    data: data
  });
};
/**
 * 修改供应商状态
 * @param data
 */
export const modifyStatus = (data: any) => {
  return request({
    url: '/basedata/supplier/modifyStatus',
    method: 'post',
    data: data
  });
};

/**
 * 删除供应商
 * @param id
 */
export const delSupplier = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/supplier/' + id,
    method: 'delete'
  });
};

/**
 * 供应商含税状态修改
 * @param data
 */
export const changeTaxStatus = (supplierId: string | number, status: number) => {
  const data = {
    supplierId,
    status
  };
  return request({
    url: '/basedata/supplier/changeTaxStatus',
    method: 'put',
    data: data
  });
};


/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export const listOwnerSupplier = (query?: SupplierQuery): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/basedata/supplier/listOwner',
    method: 'get',
    params: query
  });
};