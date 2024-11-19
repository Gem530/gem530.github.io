import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceProcessOrderRecordVO, SourceProcessOrderRecordForm, SourceProcessOrderRecordQuery } from '@/api/outsource/sourceProcessOrderRecord/types';

/**
 * 查询外协加工接单明细列表
 * @param query
 * @returns {*}
 */

export const listSourceProcessOrderRecord = (query?: SourceProcessOrderRecordQuery): AxiosPromise<SourceProcessOrderRecordVO[]> => {
  return request({
    url: '/outsource/sourceProcessOrderRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工接单明细详细
 * @param id
 */
export const getSourceProcessOrderRecord = (id: string | number): AxiosPromise<SourceProcessOrderRecordVO> => {
  return request({
    url: '/outsource/sourceProcessOrderRecord/' + id,
    method: 'get'
  });
};

export const getSourceProcessOrderRecordList = (data:any) => {
  return request({
    url: '/outsource/sourceProcessOrderRecord/getList',
    method: 'post',
    data:data
  });
};

/**
 * 新增外协加工接单明细
 * @param data
 */
export const addSourceProcessOrderRecord = (data: SourceProcessOrderRecordForm) => {
  return request({
    url: '/outsource/sourceProcessOrderRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工接单明细
 * @param data
 */
export const updateSourceProcessOrderRecord = (data: SourceProcessOrderRecordForm) => {
  return request({
    url: '/outsource/sourceProcessOrderRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工接单明细
 * @param id
 */
export const delSourceProcessOrderRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceProcessOrderRecord/' + id,
    method: 'delete'
  });
};
