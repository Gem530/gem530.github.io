/**
 * v-inputNumber el-input-number 在手动输入时，也触发vxe-table的筛选
 */
export default {
    beforeMount(el: any, { value, arg }: any) {
        let dom = el.lastChild.children[0].children[0];
        const handler = (e: any) => {
            value && value(e.target.value, e)
        }
        dom.addEventListener('keyup', handler)
    }
};