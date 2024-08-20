import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialApplyVO, MaterialApplyForm, MaterialApplyQuery, RawMaterialVO, RawMaterialQuery } from '@/api/purchase/materialApply/types';

/**
 * 查询物料申请列表
 * @param query
 * @returns {*}
 */

export const listMaterialApply = (query?: MaterialApplyQuery): AxiosPromise<MaterialApplyVO[]> => {
  return request({
    url: '/purchase/materialApply/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料库存列表
 * @param query
 * @returns {*}
 */

export const listMaterialInventory = (query?: RawMaterialQuery): AxiosPromise<RawMaterialVO[]> => {
  return request({
    url: '/purchase/materialApply/materialInventory',
    method: 'get',
    params: query
  });
};
/**
 * 查询物料申请列表-按物料展示
 * @param query
 * @returns {*}
 */

export const listApplyByMaterial = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/purchase/materialApply/byMaterialList',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料申请详细
 * @param id
 */
export const getMaterialApply = (id: string | number): AxiosPromise<MaterialApplyVO> => {
  return request({
    url: '/purchase/materialApply/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增物料申请
 * @param data
 */
export const addMaterialApply = (data: MaterialApplyForm) => {
  return request({
    url: '/purchase/materialApply/add',
    method: 'post',
    data: data
  });
};
/**
 * 根据供应商id和物料id查询供应商基价
 * @param data
 */
export const getSupplierMaterialPrice = (supplierId: number, rawMaterialId: number) => {
  return request({
    url: '/purchase/supplierBasicPrice/getSupplierMaterialPrice',
    method: 'post',
    data: { supplierId, rawMaterialId }
  });
};
/**
 * 根据待受理id集合查询供应商基价
 * @param data
 */
export const getDefaultSupplierMaterialPrice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/supplierBasicPrice/getDefaultSupplierMaterialPrice',
    method: 'post',
    data:  {ids:id}

  });
};

export const getDefaultSupplierMaterialPriceByRawIds = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/supplierBasicPrice/getDefaultSupplierMaterialPriceByRawIds',
    method: 'post',
    data:  {rawMaterialIdList:id}

  });
};

/**
 * 修改物料申请
 * @param data
 */
export const updateMaterialApply = (data: MaterialApplyForm) => {
  return request({
    url: '/purchase/materialApply/edit',
    method: 'put',
    data: data
  });
};
/**
 * 修改物料申请状态
 * @param data
 */
export const modifyStatus = (id: number, status: string) => {
  return request({
    url: '/purchase/materialApply/modifyStatus',
    method: 'put',
    data: { id: id, status: status }
  });
};

/**
 * 删除物料申请
 * @param id
 */
export const delMaterialApply = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialApply/' + id,
    method: 'delete'
  });
};
