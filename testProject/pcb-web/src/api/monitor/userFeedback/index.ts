import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserFeedbackVO, UserFeedbackForm, UserFeedbackQuery } from './types';

/**
 * 查询用户反馈意见列表
 * @param query
 * @returns {*}
 */

export const listUserFeedback = (query?: UserFeedbackQuery): AxiosPromise<UserFeedbackVO[]> => {
  return request({
    url: '/outsource/userFeedback/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户反馈意见详细
 * @param id
 */
export const getUserFeedback = (id: string | number): AxiosPromise<UserFeedbackVO> => {
  return request({
    url: '/outsource/userFeedback/' + id,
    method: 'get'
  });
};

/**
 * 查询用户反馈图片
 * @param id
 */
export const getFeedbackFileList = (id: string | number): AxiosPromise<any[]> => {
  return request({
    url: '/outsource/userFeedback/file/' + id,
    method: 'get'
  });
};


/**
 * 新增用户反馈意见
 * @param data
 */
export const addUserFeedback = (data: UserFeedbackForm) => {
  return request({
    url: '/outsource/userFeedback',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户反馈意见
 * @param data
 */
export const updateUserFeedback = (data: UserFeedbackForm) => {
  return request({
    url: '/outsource/userFeedback',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户反馈意见
 * @param id
 */
export const delUserFeedback = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/userFeedback/' + id,
    method: 'delete'
  });
};
