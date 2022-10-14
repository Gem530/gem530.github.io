import userStore from '@/store/modules/user'

function authPermission(permission: any) {
  const all_permission = "*:*:*";
  const permissions = userStore.state.permissions
  if (permission && permission.length > 0) {
    return permissions.some((v: any) => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}
export default {
  // 验证用户是否具备某权限
  hasPermi(permission: any) {
    return authPermission(permission);
  },
}