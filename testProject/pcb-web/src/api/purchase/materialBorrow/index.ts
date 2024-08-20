import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {
  DirectMaterialBorrow,
  DirectMaterialReject,
  MaterialBorrowForm,
  MaterialBorrowQuery,
  MaterialBorrowVO
} from '@/api/purchase/materialBorrow/types';

/**
 * 查询物料借料管理列表
 * @param query
 * @returns {*}
 */
export const listMaterialBorrow = (query?: MaterialBorrowQuery): AxiosPromise<MaterialBorrowVO[]> => {
  return request({
    url: '/purchase/materialBorrow/list',
    method: 'get',
    params: query
  });
};

/**
 *借料审核驳回
 * @param query
 * @returns {*}
 */
export const updateMaterialReject = (data: DirectMaterialReject) => {
  return request({
    url: '/purchase/materialBorrow/updateMaterialReject',
    method: 'post',
    data: data
  });
};

/**
 *物料借入保存
 * @param query
 * @returns {*}
 */
export const saveRawMaterialBorrowDetail = (data: DirectMaterialBorrow) => {
  return request({
    url: '/purchase/materialBorrow/saveRawMaterialBorrowDetail',
    method: 'post',
    data: data
  });
};
/**
 *物料还回保存
 * @param query
 * @returns {*}
 */
export const savaInventoryBorrowDetail = (data: DirectMaterialBorrow) => {
  return request({
    url: '/purchase/materialBorrow/savaInventoryBorrowDetail',
    method: 'post',
    data: data
  });
};



/**
 *借料审核驳回
 * @param query
 * @returns {*}
 */
export const saveRejectBorrowDetail = (data: DirectMaterialReject) => {
  return request({
    url: '/purchase/materialBorrow/saveRejectBorrowDetail',
    method: 'post',
    data: data
  });
};

/**
 * 查询物料借料管理详细
 * @param id
 */
export const getMaterialBorrow = (id: string | number): AxiosPromise<MaterialBorrowVO> => {
  return request({
    url: '/purchase/materialBorrow/' + id,
    method: 'get'
  });
};

/**
 * 变更物料借料管理状态
 * @param id
 */
export const updatePurchaseMaterialBorrow = (id: string | number): AxiosPromise<MaterialBorrowVO> => {
  return request({
    url: '/purchase/materialBorrow/updatePurchaseMaterialBorrow/' + id,
    method: 'get'
  });
};

/**
 * 新增物料借料管理
 * @param data
 */
export const addMaterialBorrow = (data: MaterialBorrowForm) => {
  return request({
    url: '/purchase/materialBorrow',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料借料管理
 * @param data
 */
export const updateMaterialBorrow = (data: MaterialBorrowForm) => {
  return request({
    url: '/purchase/materialBorrow',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料借料管理
 * @param id
 */
export const delMaterialBorrow = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialBorrow/' + id,
    method: 'delete'
  });
};


export const getBorrowRecordDetail = (query?: any): AxiosPromise<MaterialBorrowVO[]> => {
  return request({
    url: '/purchase/materialBorrow/getBorrowRecordDetailList',
    method: 'get',
    params: query
  });
};
