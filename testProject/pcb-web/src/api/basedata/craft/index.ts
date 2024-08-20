import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {CraftVO, CraftForm, CraftQuery} from '@/api/basedata/craft/types';
import {RoleVO} from "@/api/system/role/types";

/**
 * 查询工艺列表
 * @param query
 * @returns {*}
 */

export const listCraft = (query?: CraftQuery): AxiosPromise<CraftVO[]> => {
  return request({
    url: '/basedata/craft/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺列表无分页
 */
export const getCraftList = (query?: CraftQuery): AxiosPromise<CraftVO[]> => {
  return request({
    url: '/basedata/craft/getList',
    method: 'get',
    params: query
  });
};


/**
 * 查询角色列表无分页
 */
export const getRoleLists = (query?: CraftQuery): AxiosPromise<RoleVO[]> => {
  return request({
    url: '/system/role/getRoleList',
    method: 'get',
    params: query
  });
};

/**
 * 查询工艺详细
 * @param id
 */
export const getCraft = (id: string | number): AxiosPromise<CraftVO> => {
  return request({
    url: '/basedata/craft/' + id,
    method: 'get'
  });
};

/**
 * 新增工艺
 * @param data
 */
export const addCraft = (data: CraftForm) => {
  return request({
    url: '/basedata/craft',
    method: 'post',
    data: data
  });
};

/**
 * 修改工艺
 * @param data
 */
export const updateCraft = (data: CraftForm) => {
  return request({
    url: '/basedata/craft',
    method: 'put',
    data: data
  });
};

/**
 * 工艺状态修改
 * @param craftId 工艺ID
 * @param status 用户状态
 */
export const changeCraftStatus = (id: number | string, isOpen: string) => {
  const data = {
    id,
    isOpen
  };
  return request({
    url: '/basedata/craft/changeStatus',
    method: 'put',
    data: data
  });
};


/**
 * 删除工艺
 * @param id
 */
export const delCraft = (id: string | number | Array<string | number>) => {
  return request({
    url: '/basedata/craft/' + id,
    method: 'delete'
  });
};

/**
 * 工艺配置设备
 * @param data
 */
export const configEquipmentInfo = (data: { craftId: number; equipmentIds: string }) => {
  return request({
    url: '/basedata/craft/configEquipment',
    method: 'post',
    data: data
  });
};

/**
 * 根据工艺id查询对应负责人
 */
export const getUserByCraftId = (data: any) => {
  return request({
    url: '/basedata/craft/getUserByCraftId',
    method: 'post',
    data: data
  });
};
