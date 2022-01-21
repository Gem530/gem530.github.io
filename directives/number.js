// v-toNumber="{isNegative: true, float: 2}"   v-toNumber 不带参数则只能输入整数
/**
 * @author hjj
 * @description 只能输入数字
 * @param float 浮点型，有值就返回小数，没有值就返回整数
 * @param isNegative 是否为负数 true可以输入负数-，false或者不填只能填正数
 */
 export const toNumber = {
  bind (el, binding) {
    const SELECTWRAP_DOM = el
    const float = binding.value && binding.value.float
    const isNegative = binding.value && binding.value.isNegative
    SELECTWRAP_DOM.addEventListener('input', function (e) {
      const reg = float && isNegative ? /[^\d.-]/g : float ? /[^\d.]/g : isNegative ? /[^\d-]/g : /[^\d]/g
      // /[^\d.-]/g 除了数字.-之外所有的
      if (e.target.value.length === 1) {
        // 首位只能是1-9或者-
        const regs = isNegative ? /[^1-9-]/g : /[^1-9]/g
        e.target.value = e.target.value.replace(regs, '')
      } else {
        e.target.value = e.target.value.replace(reg, '')
        if (e.target.value.indexOf('-') !== e.target.value.lastIndexOf('-')) {
          // 如果-的第一次索引和最后一次索引不一样，说明有两个-，所以最后一个-不被选择
          e.target.value = e.target.value.slice(0, e.target.value.toString().length - 1)
        }
        if (e.target.value.indexOf('.') !== e.target.value.lastIndexOf('.')) {
          // 如果.的第一次索引和最后一次索引不一样，说明有两个.，所以最后一个.不被选择
          e.target.value = e.target.value.slice(0, e.target.value.toString().length - 1)
        }
      }
    })
    if (float) {
      const INPUT_DOM = SELECTWRAP_DOM.querySelector('.el-input__inner') // el-input用这个 如果直接是input标签则直接使用SELECTWRAP_DOM
      INPUT_DOM.addEventListener('blur', function (e) {
        if (e.target.value.indexOf('-') !== -1) {
          e.target.value = '-' + Number(e.target.value.slice(1, e.target.value.length)).toFixed(float)
        } else {
          e.target.value = Number(e.target.value).toFixed(float)
        }
      })
    }
  }
}
