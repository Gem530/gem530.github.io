<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" position="bottom">
    <van-picker
      :="attrs.attrs"
      :columns="props.data"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts" setup name="GPicker">
import { type } from '@/utils'
import { PickerOption } from 'vant'
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
  data: any[],
  valueKey?: string,
  modelValue?: string|number
}>(), {
  data: () => []
})

const showPicker = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const onConfirm = (val: PickerOption|any) => {
  if (type(val) === 'object') {
    value.value = val[attrs.attrs.columnsFieldNames?.text as string]
    emits('update:modelValue', val[props?.valueKey as string])
  } else {
    value.value = val as any
    emits('update:modelValue', val)
  }
  showPicker.value = false
}
</script>

<style lang="scss" scoped>

</style>