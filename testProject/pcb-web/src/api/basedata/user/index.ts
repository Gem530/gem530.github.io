import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserVO, UserForm, UserQuery } from '@/api/basedata/user/types';

/**
 * 查询用户列表
 * @param query
 * @returns {*}
 */

export const listUser = (query?: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: '/basedata/user/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户详细
 * @param id
 */
export const getUser = (id: string | number): AxiosPromise<UserVO> => {
  return request({
    url: '/basedata/user/' + id,
    method: 'get'
  });
};

/**
 * 新增用户
 * @param data
 */
export const addUser = (data: UserForm) => {
  return request({
    url: '/basedata/user',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户
 * @param data
 */
export const updateUser = (data: UserForm) => {
  return request({
    url: '/basedata/user',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户
 * @param id
 */
export const delUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/user/' + id,
    method: 'delete'
  });
};
