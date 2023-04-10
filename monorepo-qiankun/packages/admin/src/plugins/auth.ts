import useUserStore from '@/store/modules/user'

function authPermission(permission: any) {
  const userStore = useUserStore()
  const all_permission = "*:*:*";
  const permissions = userStore.permissions
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