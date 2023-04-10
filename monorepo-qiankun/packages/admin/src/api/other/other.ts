import request from '@/request'
import * as tsType from '../type'

/**
 * @author hjj
 * @description 获取渠道标识列表
 * @param phoneNum 手机号
 * @param sendState 状态
 * @param pageIndex 页码
 * @param pageSize 每页总量
 */
export function getListAPI(params: tsType.channleList) {
  return request({
    url: "/v1/sms/page",
    method: "get",
    params
  });
}

/**
 * @author hjj
 * @description app操作日志列表
 */
export function sysLogAPI(params: tsType.appoperateList) {
  return request({
    url: "/app/operLog/page",
    method: "get",
    params
  });
}

/**
 * @author hjj
 * @description 批量删除app操作日志列表
 */
export function delSysLogAPI(operIds: string) {
  return request({
    url: `/app/operLog/del/${operIds}`,
    method: "delete"
  });
}

/**
 * @author hjj
 * @description 查询菜单列表
 */
export function listMenu(params: tsType.menuList) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params
  })
}

/**
 * @author hjj
 * @description 根据菜单ID获取菜单详情
 */
export function getMenu(menuId: number) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

/**
 * @author hjj
 * @description 查询菜单下拉树结构
 */
export function treeselect(params: Partial<tsType.menuList>) {
  return request({
    url: '/system/menu/treeselect',
    method: 'get',
    params
  })
}

/**
 * @author hjj
 * @description 根据角色ID查询菜单下拉树结构
 */
export function roleMenuTreeselect(roleId: number) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

/**
 * @author hjj
 * @description 新增菜单
 */
export function addMenu(data: tsType.addMenuType) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data
  })
}

/**
 * @author hjj
 * @description 修改菜单
 */
export function updateMenu(data: tsType.addMenuType) {
  return request({
    url: '/system/menu/edit',
    method: 'put',
    data
  })
}

/**
 * @author hjj
 * @description 删除菜单
 */
export function delMenu(menuId: number) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
