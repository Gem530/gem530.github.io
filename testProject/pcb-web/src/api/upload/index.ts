import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SignedUrlResult, UrlByKeysResult,FileItemVO,FileQuery } from '@/api/upload/types';

/**
 * 根据文件名字，获取上传地址和参数
 * @param query
 * @returns {SignedUrlResult}
 */
export const getUploadUrl = (fileName: string): AxiosPromise<SignedUrlResult> => {
  return request({
    url: '/resource/oss/getSignedUrl',
    method: 'get',
    params: { fileName }
  });
};

/**
 * 根据文件名字，获取上传地址和参数
 * @param data
 * @returns {*}
 */
export const uploadPost = (urlStr: string, data: FormData): AxiosPromise<string[]> => {
  return request({
    url: urlStr,
    method: 'post',
    data
  });
};

/**
 * 文件下载URL获取
 * @param {
 *  keys 支持获取多个文件的下载地址，多个文件的key， 用英文逗号分隔
 * }
 * @returns {*}
 */
export const downloadUrl = (keys: string): AxiosPromise<UrlByKeysResult> => {
  return request({
    url: '/resource/oss/getUrlByKeys',
    method: 'get',
    params: { keys }
  });
};

/**
 * 文件列表查询 暂时放此处
 * @returns {*}
 */
export const listFiles = (query?: FileQuery): AxiosPromise<FileItemVO> => {
  return request({
    url: '/system/file/list',
    method: 'get',
    params: { query }
  });
};

/**
 *业务id 查询文件列表
 * @returns {*}
 */
export const listContractFiles = (id: any): AxiosPromise<FileItemVO> => {
  return request({
    url: '/system/file/listContract/'+id,
    method: 'get',
  });
};

// 上传图片时，获取系统时间，绘制水印
export const getSystemTime = (params:any) => {
  return request({
    url: '/auth/getSystemTime',
    method: 'get',
    params
  });
};

export const addFile = (data:any) => {
  return request({
    url: '/system/file/add',
    method: 'post',
    data:data
  });
};

export const addBatchFile = (data:any) => {
  return request({
    url: '/system/file/addBatch',
    method: 'post',
    data:data
  });
};

export const getFileList = (data:any) => {
  return request({
    url: '/system/file/getFileList',
    method: 'post',
    data:data
  });
};

export const deleteFile = (id:any) => {
  return request({
    url: '/system/file/' + id,
    method: 'delete'
  });
};

