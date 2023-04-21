<script lang="tsx">
import {
  ref,
  toRefs,
  reactive,
  // defineEmits,
  // defineProps,
  // withDefaults,
  defineComponent,
} from 'vue'

interface objConfig {
  [key: string]: any
}

export default defineComponent({
  name: 'g-tsx',
  props: {
    text: {
      type: String,
      default: 'text'
    },
    tsxList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:text', 'getInfo'],
  setup (props: objConfig, ctx: any) {
    const editText = () => {
      // console.log(ctx, props.text)
      ctx.emit('update:text', '修改了text的文案')
    }
    const getInfoHandle = () => {
      console.log(ctx)
      ctx.emit('getInfo', '666')
    }
    const createDom = (item: any) => {
      const dom: any = {
        p: () => {
          return (
            <p>{item.value}</p>
          )
        },
        button: () => {
          return (
            <el-button {...item.attrs}>{item.value}</el-button>
          )
        },
        slot: () => {
          let slot: any = ctx.slots[item.prop] ?? ctx.attrs.slots[item.prop]
          if (!slot) {
            return ''
          }
          return slot({
            item
          })
        }
      }
      return dom[item.type]()
    }
    return {
      editText,
      createDom,
      getInfoHandle,
    }
  },
  render () {
    return (
      <>{
        <div>
          {this.$props.text}
          <div>
            {
              this.$props.tsxList.map((item: any) => {
                return this.createDom(item)
              })
            }
          </div>
          <el-button onclick={this.editText}>修改</el-button>
          <el-button onclick={this.getInfoHandle}>获取信息</el-button>
        </div>
      }</>
    )
  }
})
</script>

<style lang="scss" scoped>
</style>