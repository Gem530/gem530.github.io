import request from '@/utils/request';
import { AxiosPromise } from 'axios';
// @ts-ignore
import { EquipmentUserVO, EquipmentUserForm, EquipmentUserQuery } from '@/api/system/equipmentUser/types';

/**
 * 查询设备用户列表
 * @param query
 * @returns {*}
 */

export const listEquipmentUser = (query?: EquipmentUserQuery): AxiosPromise<EquipmentUserVO[]> => {
  return request({
    url: '/system/equipmentUser/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备用户列表不分页
 * @param query
 * @returns {*}
 */

export const listEquipmentUserNoPage = (query?: EquipmentUserQuery): AxiosPromise<EquipmentUserVO[]> => {
  return request({
    url: '/system/equipmentUser/equipmentUserList',
    method: 'get',
    params: query
  });
};



/**
 * 查询设备用户详细
 * @param id
 */
export const getEquipmentUser = (id: string | number): AxiosPromise<EquipmentUserVO> => {
  return request({
    url: '/system/equipmentUser/' + id,
    method: 'get'
  });
};

/**
 * 新增设备用户
 * @param data
 */
export const addEquipmentUser = (data: EquipmentUserForm) => {
  return request({
    url: '/system/equipmentUser',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备用户
 * @param data
 */
export const updateEquipmentUser = (data: EquipmentUserForm) => {
  return request({
    url: '/system/equipmentUser',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备用户
 * @param id
 */
export const delEquipmentUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/equipmentUser/' + id,
    method: 'delete'
  });
};

export class getEquipmentUserList {
}
