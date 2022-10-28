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
      :columns-field-names="props.columnsFieldNames"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts" setup name="GPicker">
import { type } from '@/utils'
import { PickerOption, PickerFieldNames } from 'vant'
import {
  ref,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  data: any[],
  valueKey?: string,
  modelValue?: string|number,
  columnsFieldNames?: PickerFieldNames
}>(), {
  data: () => []
})

const value = ref(props.modelValue)

const showPicker = ref(false)

const onConfirm = (val: PickerOption|any) => {
  if (type(val) === 'object') {
    value.value = val[props.columnsFieldNames?.text as string]
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