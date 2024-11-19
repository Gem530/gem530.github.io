import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LogisticsOrderRecordVO, LogisticsOrderRecordForm, LogisticsOrderRecordQuery } from '@/api/basedata/logisticsOrderRecord/types';

/**
 * 查询物流下单记录列表
 * @param query
 * @returns {*}
 */

export const listLogisticsOrderRecord = (query?: LogisticsOrderRecordQuery): AxiosPromise<LogisticsOrderRecordVO[]> => {
  return request({
    url: '/basedata/logisticsOrderRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物流下单记录详细
 * @param id
 */
export const getLogisticsOrderRecord = (id: string | number): AxiosPromise<LogisticsOrderRecordVO> => {
  return request({
    url: '/basedata/logisticsOrderRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增物流下单记录
 * @param data
 */
export const addLogisticsOrderRecord = (data: LogisticsOrderRecordForm) => {
  return request({
    url: '/basedata/logisticsOrderRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改物流下单记录
 * @param data
 */
export const updateLogisticsOrderRecord = (data: LogisticsOrderRecordForm) => {
  return request({
    url: '/basedata/logisticsOrderRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除物流下单记录
 * @param id
 */
export const delLogisticsOrderRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/logisticsOrderRecord/' + id,
    method: 'delete'
  });
};

/**
 * 查询物流下单记录详细
 * @param id
 */
export const queryByWaybillNo = (wayBillNo:any) => {
  return request({
    url: '/basedata/logisticsOrderRecord/queryByWaybillNo/' + wayBillNo,
    method: 'get'
  });
};

/**
 * 删除物流下单记录
 * @param data
 */
export const deleteOrder = (data: any) => {
  return request({
    url: '/basedata/logisticsOrderRecord/deleteOrder',
    method: 'post',
    data: data
  });
};

/**
 * 获取物流轨迹
 * @param data
 */
export const getLogistics = (data: any) => {
  return request({
    url: '/basedata/logisticsOrderRecord/getLogistics',
    method: 'post',
    data: data
  });
};

/**
 * 获取物流轨迹
 * @param data
 */
export const getPrint = (data: any) => {
  return request({
    url: '/basedata/logisticsOrderRecord/getPrint',
    method: 'post',
    data: data
  });
};
