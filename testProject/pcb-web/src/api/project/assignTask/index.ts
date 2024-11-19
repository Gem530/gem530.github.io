import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AssignTaskVO, AssignTaskForm, AssignTaskQuery } from '@/api/project/assignTask/types';

/**
 * 查询工程-订单分配列表
 * @param query
 * @returns {*}
 */
export const listAssignTask = (query?: AssignTaskQuery): AxiosPromise<AssignTaskVO[]> => {
  return request({
    url: '/project/assignTask/list',
    method: 'get',
    params: query
  });
};

export const getSumSet = (data?:any) => {
  return request({
    url: '/project/assignTask/getAuditSum',
    method: 'post',
    data: data
  });
};

/**
 * 查询工程-历史分配
 * @param query
 * @returns {*}
 */
export const listHistoryAssignTask = (query?: any) => {
  return request({
    url: '/project/assignTask/historyList',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程-订单分配详细
 * @param id
 */
export const getAssignTask = (id: string | number): AxiosPromise<AssignTaskVO> => {
  return request({
    url: '/project/assignTask/' + id,
    method: 'get'
  });
};

/**
 * 新增工程-订单分配
 * @param data
 */
export const addAssignTask = (data: AssignTaskForm) => {
  return request({
    url: '/project/assignTask',
    method: 'post',
    data: data
  });
};

export const addAssignTaskHistory = (data: AssignTaskForm) => {
  return request({
    url: '/project/assignTask/insertHistory',
    method: 'post',
    data: data
  });
};

/**
 * 修改工程-订单分配
 * @param data
 */
export const updateAssignTask = (data: AssignTaskForm) => {
  return request({
    url: '/project/assignTask',
    method: 'put',
    data: data
  });
};

/**
 * 删除工程-订单分配
 * @param id
 */
export const delAssignTask = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/assignTask/' + id,
    method: 'delete'
  });
};

/**
 * 修改工程-订单分配
 * @param data
 */
export const updateEq = (data: AssignTaskForm) => {
  return request({
    url: '/project/assignTask/editEq',
    method: 'post',
    data: data
  });
};

/**
 * 订单分配-文件列表
 * @param data
 */
export const getAssignTaskProjectFile = (data: AssignTaskForm) => {
  return request({
    url: '/project/assignTask/getProjectFile',
    method: 'post',
    data: data
  });
};

/**
 * 订单分配-EQ记录列表
 * @param query
 * @returns {*}
 */
export const listEQList = (query?: AssignTaskQuery): AxiosPromise<AssignTaskVO[]> => {
  return request({
    url: '/project/assignTask/eqlist',
    method: 'get',
    params: query
  });
};
