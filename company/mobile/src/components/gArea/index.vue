<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showArea = true"
  />
  <van-popup v-model:show="showArea" position="bottom">
    <van-area
      :="attrs.attrs"
      :area-list="areaList"
      @confirm="onConfirm"
      @cancel="showArea = false"
    />
  </van-popup>
</template>

<script lang="ts" setup name="GTime">
import { areaList } from '@vant/area-data' // 需要下载 npm i @vant/area-data
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
  valueKey: string,
  modelValue?: any,
}>(), {
  format: '/',
  valueKey: 'name'
})

const showArea = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const onConfirm = (val: any[]) => {
  const str = val.filter(v => v && v[props.valueKey])
                .map(v => v[props.valueKey]).join(props.format)
  value.value = str
  emits('update:modelValue', str)
  showArea.value = false
}
</script>

<style lang="scss" scoped>

</style>