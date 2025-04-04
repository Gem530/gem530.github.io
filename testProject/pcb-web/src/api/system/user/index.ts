import { DeptVO } from './../dept/types';
import { RoleVO } from '@/api/system/role/types';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {UserForm, UserQuery, UserVO, UserInfoVO, FlowTaskVo} from './types';
import { parseStrEmpty } from '@/utils/ruoyi';

/**
* 批量导入用户
*/
export const importData = (data: any) => {
 return request({
   url: '/system/user/importData',
   method: 'post',
   data: data
 });
};

/**
 * 查询用户列表
 * @param query
 */
export const listUser = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  });
};

/**
 * 获取用户列表
 * @param query
 */
export const getSysUserList = (query: UserQuery) => {
  return request({
    url: '/system/user/userList',
    method: 'get',
    params: query
  });
};

/**
 * 获取用户详情
 * @param userId
 */
export const getUser = (userId?: string | number): AxiosPromise<UserInfoVO> => {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  });
};

/**
 * 获取用户详情
 * @param userId
 */
export const getAccount = (phoneNumber?: any): AxiosPromise<UserInfoVO> => {
  return request({
    url: '/system/account/selectInfoByPhoneNumber/' + parseStrEmpty(phoneNumber),
    method: 'get'
  });
};

/**
 * 新增用户
 */
export const addUser = (data: UserForm) => {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户
 */
export const updateUser = (data: UserForm) => {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户
 * @param userId 用户ID
 */
export const delUser = (userId: Array<string | number> | string | number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  });
};

/**
 * 用户密码重置
 * @param userId 用户ID
 * @param password 密码
 */
export const resetUserPwd = (userId: string | number, password: string) => {
  const data = {
    userId,
    password
  };
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    headers: {
      isEncrypt: true
    },
    data: data
  });
};

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 用户状态
 */
export const changeUserStatus = (userId: number | string, status: string) => {
  const data = {
    userId,
    status
  };
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  });
};

/**
 * 查询用户个人信息
 */
export const getUserProfile = (): AxiosPromise<UserInfoVO> => {
  return request({
    url: '/system/user/profile',
    method: 'get'
  });
};

/**
 * 修改用户个人信息
 * @param data 用户信息
 */
export const updateUserProfile = (data: UserForm) => {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  });
};

/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export const updateUserPwd = (oldPassword: string, newPassword: string) => {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    headers: {
      isEncrypt: true
    },
    data: data
  });
};

/**
 * 用户头像上传
 * @param data 头像文件
 */
export const uploadAvatar = (data: FormData) => {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  });
};

/**
 * 查询授权角色
 * @param userId 用户ID
 */
export const getAuthRole = (userId: string | number): AxiosPromise<{ user: UserVO; roles: RoleVO[] }> => {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  });
};

/**
 * 保存授权角色
 * @param data 用户ID
 */
export const updateAuthRole = (data: { userId: string; roleIds: string }) => {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  });
};

/**
 * 查询当前部门的所有用户信息
 * @param deptId
 */
export const listUserByDeptId = (deptId: string | number): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/list/dept/' + deptId,
    method: 'get'
  });
};

/**
 * 查询当前部门的所有用户信息
 * @param deptId
 */
export const userListByDeptId = (deptId: string | number): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/list/deptId/' + deptId,
    method: 'get'
  });
};

/**
 * 查询当前单位的所有用户信息
 * @param ownerId
 */
export const listUserByOwnerId = (ownerId: string | number): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/list/owner/' + ownerId,
    method: 'get'
  });
};

/**
 * 查询当前角色的所有用户信息
 * @param roleKey
 */
export const listUserByRoleKey = (roleKey: string | number): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/list/role/' + roleKey,
    method: 'get'
  });
};

/**
 * 查询所有用户信息
 * @param roleKey
 */
export const listAllUser = (): AxiosPromise<UserVO[]> => {
  return request({
    url: '/system/user/listAllUser',
    method: 'get'
  });
};

/**
 * 查询部门下拉树结构
 */
export const deptTreeSelect = (): AxiosPromise<DeptVO[]> => {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  });
};

/**
 * 根据用户Id查询代办列表
 */
export const getListByUserId = (id: string | number): AxiosPromise<FlowTaskVo[]> => {
  return request({
    url: '/flowable/task/getListByUserId/' + id,
    method: 'get'
  });
};

/**
 * 获取当前链接
 */
export const getShareUrl = () => {
  return request({
    url: '/system/shareRecord/getShareUrl',
    method: 'get'
  });
};

/**
 * 重置链接
 */
export const resetLink = (id : any,dayNumber : any) => {
  return request({
    url: '/system/shareRecord/resetLink/' + id + '/' + dayNumber,
    method: 'post'
  });
};

/**
 * 设置过期时间
 */
export const setExpireTime = (id : any,dayNumber : any) => {
  return request({
    url: '/system/shareRecord/setExpireTime/' + id + '/' + dayNumber,
    method: 'post'
  });
};

/**
 * 邀请历史记录
 */
export const shareRecordList = (query : any) => {
  return request({
    url: '/system/shareRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 邀请历史记录
 */
export const isInvalidUrl = (id: any) => {
  return request({
    url: `/system/shareRecord/isInvalid/${id}`,
    method: 'get',
  });
};

/**
 * 批量转办任务
 */
export const batchAssignTask = (data: FlowTaskVo[]) => {
  return request({
    url: '/flowable/task/batchAssignTask',
    method: 'post',
    data: data
  });
};

/**
 * 生成微信短链
 */
export const generateUrlLink = (data: any) => {
  return request({
    url: '/wx/generateUrlLink',
    method: 'post',
    data
  });
};

/**
 * 生成微信短链
 */
export const queryUrlLink = (params: any) => {
  return request({
    url: '/wx/queryUrlLink',
    method: 'get',
    params
  });
};

export default {
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  getUserProfile,
  updateUserProfile,
  updateUserPwd,
  uploadAvatar,
  getAuthRole,
  updateAuthRole,
  deptTreeSelect,
  listUserByDeptId
};
