/**
 * v-loadmores 触底加载
 */
export default {
  name: 'loadmores', // 自定义指令名称
  fn: {
      // 自定义指令的生命周期
      created(el:any, binding:any, vnode:any, prevVnode:any) {}, 
      beforeMount() {},
      mounted (el: HTMLElement, binding: any) {
          const SELECTWRAP_DOM = el
          SELECTWRAP_DOM.addEventListener('scroll', function () {
              //  - Number(binding.arg)
              const CONDITION = Math.floor(SELECTWRAP_DOM.scrollHeight) - Math.ceil(SELECTWRAP_DOM.scrollTop) - 20 <= SELECTWRAP_DOM.clientHeight
              // const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
              // console.log('----', CONDITION, SELECTWRAP_DOM.scrollHeight, SELECTWRAP_DOM.scrollTop, SELECTWRAP_DOM.clientHeight)
              if (CONDITION) {
                  binding.value()
              }
          })
      },
      beforeUpdate() {}, 
      updated() {},
      beforeUnmount() {}, 
      unmounted() {}
  }
}