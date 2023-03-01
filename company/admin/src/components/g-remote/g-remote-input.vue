<template>
  <el-autocomplete
    :="attrs"
    v-model="value"
    :fetch-suggestions="querySearchAsync"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup name="g-remote-input">
import { baseAPI } from '@/api/base'
import * as tsType from '@/api/type'
import {
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
  modelValue: string|number,
  req: tsType.baseAPIType<tsType.channleList>
}>(), {
  modelValue: undefined
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value: string|number) {
    //子组件传值给父组件
    emits('update:modelValue', value)
  }
})

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  const temp = {
    phoneNum: queryString,
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
  baseAPI(req).then((res: any) => {
    if (res.code === 200) {
      cb(res.data.rows || [])
    } else {
      proxy.$modal.message({ message: res.msg, type: 'error' })
    }
  }).catch((err: Error) => {
    proxy.$modal.message({ message: err.message, type: 'error' })
  })
}

const handleSelect = (item: any) => {
  // console.log(item)
  emits('change', item)
}
</script>