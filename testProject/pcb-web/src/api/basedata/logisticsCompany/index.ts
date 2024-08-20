import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LogisticsCompanyVO, LogisticsCompanyForm, LogisticsCompanyQuery } from '@/api/basedata/logisticsCompany/types';

/**
 * 查询物流公司列表
 * @param query
 * @returns {*}
 */

export const listLogisticsCompany = (query?: LogisticsCompanyQuery): AxiosPromise<LogisticsCompanyVO[]> => {
  return request({
    url: '/basedata/logisticsCompany/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物流公司详细
 * @param id
 */
export const getLogisticsCompany = (id: string | number): AxiosPromise<LogisticsCompanyVO> => {
  return request({
    url: '/basedata/logisticsCompany/' + id,
    method: 'get'
  });
};

/**
 * 新增物流公司
 * @param data
 */
export const addLogisticsCompany = (data: LogisticsCompanyForm) => {
  return request({
    url: '/basedata/logisticsCompany',
    method: 'post',
    data: data
  });
};

/**
 * 修改物流公司
 * @param data
 */
export const updateLogisticsCompany = (data: LogisticsCompanyForm) => {
  return request({
    url: '/basedata/logisticsCompany',
    method: 'put',
    data: data
  });
};

/**
 * 删除物流公司
 * @param id
 */
export const delLogisticsCompany = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/logisticsCompany/' + id,
    method: 'delete'
  });
};
