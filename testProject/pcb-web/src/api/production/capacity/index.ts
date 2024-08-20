import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CapacityVO, CapacityForm, CapacityQuery } from '@/api/personal/capacity/types';
import {CraftPersonalCapacityVo} from "@/api/production/capacity/types";

/**
 * 查询个人产能上报记录列表
 * @param query
 * @returns {*}
 */

export const listCapacity = (query?: CapacityQuery): AxiosPromise<CapacityVO[]> => {
  return request({
    url: '/personal/capacity/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询个人产能上报记录详细
 * @param id
 */
export const getCapacity = (id: string | number): AxiosPromise<CapacityVO> => {
  return request({
    url: '/personal/capacity/' + id,
    method: 'get'
  });
};
/**
 * 查询个人产能上报汇总数据
 * @param id
 */
export const getCount = (query?: CapacityQuery): AxiosPromise<CapacityVO> => {
  return request({
     url: '/personal/capacity/count',
    method: 'get',
    params: query
  });
};

/**
 * 新增个人产能上报记录
 * @param data
 */
export const addCapacity = (data: CapacityForm) => {
  return request({
    url: '/personal/capacity',
    method: 'post',
    data: data
  });
};

/**
 * 修改个人产能上报记录
 * @param data
 */
export const updateCapacity = (data: CapacityForm) => {
  return request({
    url: '/personal/capacity',
    method: 'put',
    data: data
  });
};

/**
 * 删除个人产能上报记录
 * @param id
 */
export const delCapacity = (id: string | number | Array<string | number>) => {
  return request({
    url: '/personal/capacity/' + id,
    method: 'delete'
  });
};

/**
 * 查询工艺产能面积
 * @param query
 * @returns {*}
 */
export const getCraftCapacity = (query?: CapacityQuery): AxiosPromise<CapacityVO[]> => {
  return request({
    url: '/personal/capacity/getCraftCapacity',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺产能面积
 * @param query
 * @returns {*}
 */
export const getPersonalCapacityByCraft = (query?: CapacityQuery): AxiosPromise<CraftPersonalCapacityVo[]> => {
  return request({
    url: '/personal/capacity/getPersonalCapacityByCraft',
    method: 'get',
    params: query
  });
};
