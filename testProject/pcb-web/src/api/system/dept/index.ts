import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeptForm, DeptQuery, DeptVO } from './types';

// 查询部门列表
export const listDept = (query?: DeptQuery) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  });
};

// 查询自己部门数据
export const listOwnerDept = (query?: DeptQuery) => {
  return request({
    url: '/system/dept/listOwnerDept',
    method: 'get',
    params: query
  });
};

// 查询客户列表
export const listCompany = () => {
  return request({
    url: '/system/dept/companyList',
    method: 'get'
  });
};


// 查询部门列表（排除节点）
export const listDeptExcludeChild = (deptId: string | number): AxiosPromise<DeptVO[]> => {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  });
};

// 查询部门详细
export const getDept = (deptId: string | number): AxiosPromise<DeptVO> => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  });
};

// 查询部门下拉树结构
export const treeselect = (): AxiosPromise<DeptVO[]> => {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  });
};

// 新增部门
export const addDept = (data: DeptForm) => {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  });
};

// 修改部门
export const updateDept = (data: DeptForm) => {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  });
};

// 删除
// 删除部门
export const delDept = (deptId: number | string) => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  });
};

// 修改 部门状态
export const updateDeptStaus = (deptId: number | string) => {
  return request({
    url: '/system/dept/modifyStatus',
    method: 'post',
    data: { deptId }
  });
};

export const listDeptByOwnerId = (ownerId: string | number): AxiosPromise<DeptVO[]> => {
  return request({
    url: '/system/dept/list/owner/' + ownerId,
    method: 'get'
  });
};


// 获取单位的银行账户列表
export const listDeptBank = (query?: DeptQuery) => {
  return request({
    url: '/system/dept/listDeptBank',
    method: 'get',
  });
};
// 获取单位的银行账户列表
export const updateDeptBank = (_data?: DeptQuery) => {
  return request({
    url: '/system/dept/updateDeptBank',
    method: 'post',
    data:_data
  });
};
// 获取单位的银行账户列表
export const addDeptBank = (_data?: DeptQuery) => {
  return request({
    url: '/system/dept/insertDeptBank',
    method:  'post',
    data:_data
  });
};
// 获取单位的银行账户列表
export const deleteDeptBank = (_data?: DeptQuery) => {
  return request({
    url: '/system/dept/deleteDeptBank',
    method: 'post',
    data:_data
  });
};