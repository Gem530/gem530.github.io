import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { EquipmentVO, EquipmentForm, EquipmentQuery } from '@/api/basedata/equipment/types';

/**
 * 查询设备列表
 * @param query
 * @returns {*}
 */

export const listEquipment = (query?: EquipmentQuery): AxiosPromise<EquipmentVO[]> => {
  return request({
    url: '/basedata/equipment/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备列表不分页
 * @param query
 * @returns {*}
 */

export const listEquipmentsNoPage = (query?: EquipmentQuery): AxiosPromise<EquipmentVO[]> => {
  return request({
    url: '/basedata/equipment/listEquipments',
    method: 'get',
    params: query
  });
};



/**
 * 查询设备详细
 * @param id
 */
export const getEquipment = (id: string | number): AxiosPromise<EquipmentVO> => {
  return request({
    url: '/basedata/equipment/' + id,
    method: 'get'
  });
};

/**
 * 新增设备
 * @param data
 */
export const addEquipment = (data: EquipmentForm) => {
  return request({
    url: '/basedata/equipment',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备
 * @param data
 */
export const updateEquipment = (data: EquipmentForm) => {
  return request({
    url: '/basedata/equipment',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备
 * @param id
 */
export const delEquipment = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/equipment/' + id,
    method: 'delete'
  });
};
