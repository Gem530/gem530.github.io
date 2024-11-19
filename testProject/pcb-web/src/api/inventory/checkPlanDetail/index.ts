import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CheckPlanDetailVO, CheckPlanDetailForm, CheckPlanDetailQuery } from '@/api/inventory/checkPlanDetail/types';

/**
 * 查询盘点计划明细列表
 * @param query
 * @returns {*}
 */
export const listCheckPlanDetail = (query?: CheckPlanDetailQuery): AxiosPromise<CheckPlanDetailVO[]> => {
  return request({
    url: '/inventory/checkPlanDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询盘点计划明细详细
 * @param id
 */
export const getCheckPlanDetail = (id: string | number): AxiosPromise<CheckPlanDetailVO> => {
  return request({
    url: '/inventory/checkPlanDetail/' + id,
    method: 'get'
  });
};

/**
 * 新增盘点计划明细
 * @param data
 */
export const addCheckPlanDetail = (data: CheckPlanDetailForm) => {
  return request({
    url: '/inventory/checkPlanDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改盘点计划明细
 * @param data
 */
export const updateCheckPlanDetail = (data: CheckPlanDetailForm) => {
  return request({
    url: '/inventory/checkPlanDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除盘点计划明细
 * @param id
 */
export const delCheckPlanDetail = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/checkPlanDetail/' + id,
    method: 'delete'
  });
};

/**
 * 暂存盘点计划明细
 * @param data
 */
export const temporaryPlanDetail = (data?: CheckPlanDetailVO[]) => {
  return request({
    url: '/inventory/checkPlanDetail/temporary',
    method: 'post',
    data: data
  });
};
