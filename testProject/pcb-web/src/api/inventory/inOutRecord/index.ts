import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InOutRecordVO, InOutRecordForm, InOutRecordQuery } from '@/api/inventory/inOutRecord/types';

/**
 * 查询成品出入库记录列表
 * @param query
 * @returns {*}
 */

export const listInOutRecord = (query?: InOutRecordQuery): AxiosPromise<InOutRecordVO[]> => {
  return request({
    url: '/inventory/inOutRecord/list',
    method: 'get',
    params: query
  });
};

export const getInOutSum = (data?: any) => {
  return request({
    url: '/inventory/inOutRecord/getInOutSum',
    method: 'post',
    data: data
  });
};

/**
 * 查询成品出入库记录详细
 * @param id
 */
export const getInOutRecord = (id: string | number): AxiosPromise<InOutRecordVO> => {
  return request({
    url: '/inventory/inOutRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增成品出入库记录
 * @param data
 */
export const addInOutRecord = (data: InOutRecordForm) => {
  return request({
    url: '/inventory/inOutRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改成品出入库记录
 * @param data
 */
export const updateInOutRecord = (data: InOutRecordForm) => {
  return request({
    url: '/inventory/inOutRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除成品出入库记录
 * @param id
 */
export const delInOutRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/inOutRecord/' + id,
    method: 'delete'
  });
};
