<template>
  <el-select-v2
    remote
    :="attrs"
    filterable
    v-model="value"
    :options="options"
    :loading="loading"
    style="width: 240px;"
    :remote-method="remoteMethod"
    @change="change"
  />
</template>

<script lang="ts" setup name="g-remote-select">
import { baseAPI } from '@/api/base'
import * as tsType from '@/api/type'
import {
  ref,
  useAttrs,
  computed,
  defineProps,
  defineEmits,
  withDefaults,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue', 'change'])
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any

const props = withDefaults(defineProps<{
  modelValue: string|number|undefined,
  req: tsType.baseAPI<tsType.channleList>
}>(), {
  modelValue: undefined
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value: string|number|undefined) {
    //子组件传值给父组件
    emits('update:modelValue', value)
  }
})

const options = ref([])
const loading = ref(false)
const remoteMethod = (query: string) => {
  if (!query) options.value = []
  const temp = {
    phoneNum: query,
    pageIndex: 1,
    pageSize: 10,
  }
  const params = props.req.params ? Object.assign(props.req.params, temp) : undefined
  const data = props.req.data ? Object.assign(props.req.data, temp) : undefined
  const req = {
    data,
    params,
    url: props.req.url,
    method: props.req.method
  }
  loading.value = true
  baseAPI(req).then((res: any) => {
    loading.value = false
    if (res.code === 200) {
      // cb(res.data.rows || [])
      options.value = res.data.rows || []
      options.value.forEach((v: any) => {
        v.label = v.phoneNum
        v.value = v.phoneNum
      })
    } else {
      proxy.$modal.message({ message: res.msg, type: 'error' })
    }
  }).catch((err: Error) => {
    loading.value = false
    proxy.$modal.message({ message: err.message, type: 'error' })
  })
}

const change = (val: any) => {
  // console.log(item)
  const item = options.value.find((v: any) => v.id === val)
  emits('change', item)
}
</script>