<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showDate = true"
  />
  <van-calendar
    :="attrs.attrs"
    v-model:show="showDate"
    @confirm="onConfirm"
  />
</template>

<script lang="ts" setup name="GPicker">
import dayjs from 'dayjs'
import { isType } from '@/utils'
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'

const attrs: any = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  format?: string,
  modelValue?: string|string[],
}>(), {
  format: 'YYYY-MM-DD'
})

const showDate = ref(false)
const value = ref<string>('')


watch(() => props.modelValue, (val) => {
  if (!val) value.value = ''
})

const onConfirm = (val: any) => {
  dateFormat(val)
  showDate.value = false
}

const dateFormat = (val: any) => {
  let res
  if (isType(val) === 'array') {
    let time = val.map((v: Date) => dayjs(new Date(v)).format(props.format))
    if (attrs.attrs?.type === 'range') {
      value.value = time.join(' - ')
    } else if (attrs.attrs?.type === 'multiple') {
      value.value = `您选择了 ${time.length} 个日期`
    }
    res = time
  } else {
    value.value = dayjs(new Date(val)).format(props.format)
    res = value.value
  }
  // return res
  emits('update:modelValue', res)
}
if (props.modelValue) {
  dateFormat(props.modelValue)
}
</script>

<style lang="scss" scoped>

</style>