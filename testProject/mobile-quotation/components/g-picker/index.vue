<template>
  <van-field
    readonly
    :="attrs"
    v-model="value"
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

const attrs: any = useAttrs()
const emits = defineEmits(['update:modelValue', 'change'])
const props = withDefaults(defineProps<{
  data: any[],
  valueKey?: string,
  modelValue?: string|number
}>(), {
  valueKey: 'value',
  data: () => []
})

const showPicker = ref(false)
// const value = ref(props.modelValue)
const value = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emits('update:modelValue', val)
  }
})

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const onConfirm = (val: any) => {
  showPicker.value = false
  if (value.value == val.selectedValues[0]) return
  value.value = val.selectedValues[0]
  emits('change')
  // emits('update:modelValue', val.selectedValues[0])
}
</script>

<style lang="scss" scoped>

</style>