import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SignVO, SignForm, SignQuery } from '@/api/basedata/sign/types';

/**
 * 查询签章管理列表
 * @param query
 * @returns {*}
 */

export const listSign = (query?: SignQuery): AxiosPromise<SignVO[]> => {
  return request({
    url: '/pdf/sign/list',
    method: 'get',
    params: query
  });
};
/**
 * 个人签名列表
 * @param query
 * @returns {*}
 */

export const signList = (): AxiosPromise<SignVO[]> => {
  return request({
    url: '/pdf/sign/signList',
    method: 'get'
  });
};

/**
 * 查询签章管理详细
 * @param id
 */
export const getSign = (id: string | number): AxiosPromise<SignVO> => {
  return request({
    url: '/pdf/sign/info/' + id,
    method: 'get'
  });
};

/**
 * 新增签章管理
 * @param data
 */
export const addSign = (data: SignForm) => {
  return request({
    url: '/pdf/sign/addSign',
    method: 'post',
    data: data
  });
};
/**
 * 处理图片
 * @param data
 */
export const handleSign = (data: SignForm) => {
  return request({
    url: '/pdf/sign/handleSign',
    method: 'post',
    data: data
  });
};

/**
 * 修改签章管理
 * @param data
 */
export const updateSign = (data: SignForm) => {
  return request({
    url: '/pdf/sign/edit',
    method: 'post',
    data: data
  });
};

/**
 * 删除签章管理
 * @param id
 */
export const delSign = (id: string | number | Array<string | number>) => {
  return request({
    url: '/pdf/sign/del/' + id,
    method: 'post'
  });
};
/**
 * 查询签字预览
 * @param query
 * @returns {*}
 */
export const getSignPdf = (query?: any): AxiosPromise<any> => {
  return request({
    url: '/pdf/sign/previewSignature',
    method: 'get',
    responseType:'blob',
    params: query,
  });
};