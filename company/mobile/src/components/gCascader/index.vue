<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showCascader = true"
  />
  <van-popup v-model:show="showCascader" position="bottom">
    <van-cascader
      :="attrs.attrs"
      :options="props.data"
      v-model="cascaderValue"
      @finish="onFinish"
      @close="showCascader = false"
    />
  </van-popup>
</template>

<script lang="ts" setup name="GTime">
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'
import { CascaderOption } from 'vant'

interface finish {
  tabIndex: number,
  value: string|number,
  selectedOptions: CascaderOption[]
}

const attrs: any = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  data: any[],
  format?: string,
  // valueKey: string,
  modelValue?: any,
}>(), {
  format: '/',
  data: () => [],
  // valueKey: 'name'
})

const cascaderValue = ref()
const showCascader = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const onFinish = (val: finish) => {
  const str = val.selectedOptions.map((v: any) => v[attrs.attrs.fieldNames.text]).join(props.format)
  // console.log(val, str)
  value.value = str
  emits('update:modelValue', str)
  showCascader.value = false
}
</script>

<style lang="scss" scoped>

</style>