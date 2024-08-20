import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FormConfigVO, FormConfigForm, FormConfigQuery } from "@/api/basedata/config/types";

/**
 * 查询单配置列表
 * @param query
 * @returns {*}
 */

export const listFormConfig = (query?: FormConfigQuery): AxiosPromise<FormConfigVO[]> => {
  return request({
    url: '/basedata/formConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询单配置详细
 * @param id
 */
export const getFormConfig = (id: string | number): AxiosPromise<FormConfigVO> => {
  return request({
    url: '/basedata/formConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增单配置
 * @param data
 */
export const addFormConfig = (data: FormConfigForm) => {
  return request({
    url: '/basedata/formConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改单配置
 * @param data
 */
export const updateFormConfig = (data: FormConfigForm) => {
  return request({
    url: '/basedata/formConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除单配置
 * @param id
 */
export const delFormConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/formConfig/' + id,
    method: 'delete'
  });
};
