import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CraftEquipmentVO, CraftEquipmentForm, CraftEquipmentQuery } from '@/api/basedata/craftEquipment/types';

/**
 * 查询工艺设备列表
 * @param query
 * @returns {*}
 */

export const listCraftEquipment = (query?: CraftEquipmentQuery): AxiosPromise<CraftEquipmentVO[]> => {
  return request({
    url: '/basedata/craftEquipment/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺设备详细
 * @param id
 */
export const getCraftEquipment = (id: string | number): AxiosPromise<CraftEquipmentVO> => {
  return request({
    url: '/basedata/craftEquipment/' + id,
    method: 'get'
  });
};

/**
 * 新增工艺设备
 * @param data
 */
export const addCraftEquipment = (data: CraftEquipmentForm) => {
  return request({
    url: '/basedata/craftEquipment',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺设备
 * @param data
 */
export const updateCraftEquipment = (data: CraftEquipmentForm) => {
  return request({
    url: '/basedata/craftEquipment',
    method: 'put',
    data: data
  });
};

/**
 * 删除工艺设备
 * @param id
 */
export const delCraftEquipment = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craftEquipment/' + id,
    method: 'delete'
  });
};
