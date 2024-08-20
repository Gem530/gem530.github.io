import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MaterialInOutRecordVO, MaterialInOutRecordForm, MaterialInOutRecordQuery } from '@/api/purchase/materialInOutRecord/types';

/**
 * 查询出入库记录列表
 * @param query
 * @returns {*}
 */

export const listMaterialInOutRecord = (query?: MaterialInOutRecordQuery): AxiosPromise<MaterialInOutRecordVO[]> => {
  return request({
    url: '/purchase/materialInOutRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询出入库记录列表count
 * @param query
 * @returns {*}
 */
export const listCountMaterialInOutRecord = (query?: MaterialInOutRecordQuery): AxiosPromise<MaterialInOutRecordVO[]> => {
  return request({
    url: '/purchase/materialInOutRecord/count',
    method: 'get',
    params: query
  });
};
/**
 * 查询出入库记录详细
 * @param id
 */
export const getMaterialInOutRecord = (id: string | number): AxiosPromise<MaterialInOutRecordVO> => {
  return request({
    url: '/purchase/materialInOutRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增出入库记录
 * @param data
 */
export const addMaterialInOutRecord = (data: MaterialInOutRecordForm) => {
  return request({
    url: '/purchase/materialInOutRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改出入库记录
 * @param data
 */
export const updateMaterialInOutRecord = (data: MaterialInOutRecordForm) => {
  return request({
    url: '/purchase/materialInOutRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除出入库记录
 * @param id
 */
export const delMaterialInOutRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/purchase/materialInOutRecord/' + id,
    method: 'delete'
  });
};
