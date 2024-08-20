import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialRequisitionVO, MaterialRequisitionForm, MaterialRequisitionQuery } from '@/api/purchase/materialRequisition/types';

/**
 * 查询物料领用记录单列表
 * @param query
 * @returns {*}
 */

export const listMaterialRequisition = (query?: MaterialRequisitionQuery): AxiosPromise<MaterialRequisitionVO[]> => {
  return request({
    url: '/purchase/materialRequisition/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料领用记录单详细
 * @param id
 */
export const getMaterialRequisition = (id: string | number): AxiosPromise<MaterialRequisitionVO> => {
  return request({
    url: '/purchase/materialRequisition/' + id,
    method: 'get'
  });
};

/**
 * 新增物料领用记录单
 * @param data
 */
export const addMaterialRequisition = (data: MaterialRequisitionForm) => {
  return request({
    url: '/purchase/materialRequisition',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料领用记录单
 * @param data
 */
export const updateMaterialRequisition = (data: MaterialRequisitionForm) => {
  return request({
    url: '/purchase/materialRequisition',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料领用记录单
 * @param id
 */
export const delMaterialRequisition = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialRequisition/' + id,
    method: 'delete'
  });
};

/**
 * 查询物料列表 --按领料单
 * @param query
 * @returns {*}
 */

export const getRequisitionPageList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/purchase/materialRequisition/getPageList',
    method: 'get',
    params: query
  });
};

/**
 * 新增物料领用记录单
 * @param data
 */
export const addRequisition = (data: MaterialRequisitionForm) => {
  return request({
    url: '/purchase/materialRequisition/add',
    method: 'post',
    data: data
  });
};

/**
 * 查询物料领用记录单详细
 * @param id
 */
export const getMaterialRequisitionsByCode = (code: string): AxiosPromise<MaterialRequisitionVO> => {
  return request({
    url: '/purchase/materialRequisition/getListByCode/' + code,
    method: 'get'
  });
};

/**
 * 预览物料领用记录单
 * @param id
 */
export const getMaterialRequisitionsPrintByCode = (code: string): AxiosPromise<MaterialRequisitionVO> => {
  return request({
    url: '/purchase/materialRequisition/getPrintByCode/' + code,
    method: 'get'
  });
};

/**
 * 查询物料领用归还记录
 * @param id
 */
export const getReturnRecordListById = (id: string | number | Array<string | number>): AxiosPromise<any> => {
  return request({
    url: '/purchase/materialRequisition/returnRecord/' + id,
    method: 'get'
  });
};

/**
 * 查询物料--待审核
 * @param id
 */
export const getMaterialRequisitionsByCodeSelf = (code: string): AxiosPromise<MaterialRequisitionVO> => {
  return request({
    url: '/purchase/materialRequisition/getListByCodeSelf/' + code,
    method: 'get'
  });
};

/**
 * 查询工作流审核记录
 * @param id
 */
export const getFlowHistory = (data: any): AxiosPromise<MaterialRequisitionVO> => {
  return request({
    url: 'flowable/task/flowRecord',
    method: 'get',
    params: data
  });
};

/**
 * 查询物料列表 --按物料
 * @param query
 * @returns {*}
 */

export const getByMaterialList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/purchase/materialRequisition/getByMaterialList',
    method: 'get',
    params: query
  });
};

/**
 * 提交物料领用记录单
 * @param data
 */
export const submitMaterialRequisition = (data: any) => {
  return request({
    url: '/purchase/materialRequisition/submit',
    method: 'post',
    data: data
  });
};
/**
 * 提交物料领用还回记录
 * @param data
 */
export const submitReturn = (data: any) => {
  return request({
    url: '/purchase/materialRequisition/submitReturn',
    method: 'post',
    data: data
  });
};

/**
 * 审核通过
 * @param data
 */
export const passMaterialRequisition = (data: any) => {
  return request({
    url: '/purchase/materialRequisition/pass',
    method: 'post',
    data: data
  });
};

/**
 * 审核驳回
 * @param data
 */
export const rejectMaterialRequisition = (data: any) => {
  return request({
    url: '/purchase/materialRequisition/reject',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料领用记录单
 * @param data
 */
export const updateRequisition = (data: any) => {
  return request({
    url: '/purchase/materialRequisition/update',
    method: 'post',
    data: data
  });
};
