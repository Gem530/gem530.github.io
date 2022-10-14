/**
 * v-hasPermi 触底加载
 */
import userStore from '@/store/modules/user'
export default {
  name: 'hasPermi', // 自定义指令名称
  fn: {
      // 自定义指令的生命周期
      created(el:any, binding:any, vnode:any, prevVnode:any) {}, 
      beforeMount() {},
      mounted (el: HTMLElement, binding: any) {
        console.log(userStore)
        console.log(el, binding)
        const { value } = binding
        const all_permission = '*:*:*'
        const permissions = userStore.state.permissions
        if (value && value instanceof Array && value.length > 0) {
          const permissionFlag = value
    
          const hasPermissions = permissions.some((permission: any) => {
            return all_permission === permission || permissionFlag.includes(permission)
          })
    
          if (!hasPermissions) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        } else {
          throw new Error(`请设置操作权限标签值`)
        }
      },
      beforeUpdate() {}, 
      updated() {},
      beforeUnmount() {}, 
      unmounted() {}
  }
}