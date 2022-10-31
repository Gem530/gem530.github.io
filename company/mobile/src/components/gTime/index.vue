<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showTime = true"
  />
  <van-popup v-model:show="showTime" position="bottom">
    <van-datetime-picker
      :="attrs.attrs"
      v-model="curTime"
      @confirm="onConfirm"
      @cancel="showTime = false"
    />
  </van-popup>
</template>

<script lang="ts" setup name="GTime">
import dayjs from 'dayjs'
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  format?: string,
  modelValue?: any,
}>(), {
  format: 'YYYY-MM-DD'
})

const showTime = ref(false)
const curTime = ref(new Date())
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const onConfirm = (val: Date) => {
  const time = dayjs(new Date(val)).format(props.format)
  value.value = time
  curTime.value = val
  emits('update:modelValue', time)
  showTime.value = false
}
</script>

<style lang="scss" scoped>

</style>