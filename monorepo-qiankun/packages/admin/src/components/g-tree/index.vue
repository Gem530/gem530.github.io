<template>
  <el-tree-select
    check-strictly
    :="{...attrs}"
    :data="treeList"
    v-model="valueId"
    :props="props.props"
    :render-after-expand="false"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup name="g-tree">
import { baseAPI } from '@/api/base'
import {
  ref,
  useAttrs,
  computed,
  onMounted,
  defineEmits,
  defineProps,
  withDefaults,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['select', 'update:modelValue'])
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const props = withDefaults(defineProps<{
  req?: any,
  props?: any,
  width?: number,
  placeholder?: string,
  modelValue: number|string,
}>(), {
  width: 350,
  placeholder: '请选择',
  req: {
    method: 'get',
    url: '/system/menu/treeselect',
  },
  props: {
    value: 'id',
    label: 'label',
    children: 'children'
  }
})

const valueName = props.props.value || 'id'
const valueLableName = props.props.label || 'label'
const valueChildrenName = props.props.children || 'children'
const treeList = ref<any[]>([])
const valueId = computed({
  get() {
    return props.modelValue
  },
  set(value: number|string){
    emits('update:modelValue', value)
  }
})

const getTree = () => {
  if (!props.req) return
  const params = props.req.params ? props.req.params : undefined
  const data = props.req.data ? props.req.data : undefined
  const req = {
    data,
    params,
    url: props.req.url,
    method: props.req.method
  }
  baseAPI(req).then((res: any) => {
    let baseTree: any = [{}]
    baseTree[0][valueName] = 0
    baseTree[0][valueLableName] = '主类目'
    baseTree[0][valueChildrenName] = res.data || []
    treeList.value = baseTree
  }).catch((err: Error) => {
    proxy.$modal.message({ type: 'error', message: err.message })
  })
}

onMounted(() => {
  getTree()
})

const handleNodeClick = (item: any) => {
  emits('select', item)
}
</script>

<style lang="scss" scoped>
</style>