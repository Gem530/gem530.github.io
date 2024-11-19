import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CheckPlanVO, CheckPlanForm, CheckPlanQuery } from '@/api/inventory/checkPlan/types';
import {CheckPlanDetailVO} from "@/api/inventory/checkPlanDetail/types";

/**
 * 查询盘点计划列表
 * @param query
 * @returns {*}
 */

export const listCheckPlan = (query?: CheckPlanQuery): AxiosPromise<CheckPlanVO[]> => {
  return request({
    url: '/inventory/checkPlan/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询盘点计划详细
 * @param id
 */
export const getCheckPlan = (id: string | number): AxiosPromise<CheckPlanVO> => {
  return request({
    url: '/inventory/checkPlan/' + id,
    method: 'get'
  });
};

/**
 * 查询盘点计划详细
 * @param query
 */
export const getCheckDetail = (query?: any): AxiosPromise<CheckPlanVO> => {
  return request({
    url: '/inventory/checkPlan/getDetail',
    method: 'get',
    params: query
  });
};

/**
 * 新增盘点计划
 * @param data
 */
export const addCheckPlan = (data: CheckPlanForm) : AxiosPromise<number> => {
  return request({
    url: '/inventory/checkPlan',
    method: 'post',
    data: data
  });
};

/**
 * 修改盘点计划
 * @param data
 */
export const updateCheckPlan = (data: CheckPlanForm) => {
  return request({
    url: '/inventory/checkPlan',
    method: 'put',
    data: data
  });
};

/**
 * 删除盘点计划
 * @param id
 */
export const delCheckPlan = (id: string | number | Array<string | number>) => {
  return request({
    url: '/inventory/checkPlan/' + id,
    method: 'delete'
  });
};

/**
 * 盘点计划作废
 * @param data
 */
export const cancelCheckPlan = (data: CheckPlanForm) => {
  return request({
    url: '/inventory/checkPlan/cancel',
    method: 'post',
    data: data
  });
};

/**
 * 开始盘点计划详细
 * @param data
 */
export const startCheckPlan = (data: CheckPlanForm): AxiosPromise<CheckPlanDetailVO[]> => {
  return request({
    url: '/inventory/checkPlan/start',
    method: 'post',
    data: data
  });
};


/**
 * 提交审核盘点计划
 * @param data
 */
export const submitAuditCheckPlan = (data: CheckPlanForm) => {
  return request({
    url: '/inventory/checkPlan/submitAudit',
    method: 'post',
    data: data
  });
};

/**
 * 驳回盘点计划
 * @param data
 */
export const rejectCheckPlan = (data: CheckPlanForm) => {
  return request({
    url: '/inventory/checkPlan/rejectCheck',
    method: 'post',
    data: data
  });
};

/**
 * 审核盘点计划
 * @param data
 */
export const auditCheckPlan = (data: CheckPlanForm) => {
  return request({
    url: '/inventory/checkPlan/audit',
    method: 'post',
    data: data
  });
};

/**
 * 盘点信息导入
 * @param key
 */
export const importDataCheckPlan = (data: any) => {
  return request({
    url: '/inventory/checkPlan/importData',
    method: 'post',
    data
  });
};

