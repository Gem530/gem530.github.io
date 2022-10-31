<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showTime = true"
  />
  <van-popup v-model:show="showTime" position="bottom">
    <van-checkbox-group v-model="checked">
      <van-cell-group>
        <van-cell
          clickable
          :key="item"
          :title="item.name"
          v-for="(item, index) in props.data"
          @click="toggle(index)"
        >
          <template #right-icon>
            <van-checkbox
              :name="item.name"
              :ref="el => checkboxRefs[index] = el"
              @click.stop
            />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </van-popup>
</template>

<script lang="ts" setup name="GSelect">
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'

const attrs = useAttrs()
const checkboxRefs = ref<any>([])
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  data: any[]
  modelValue?: any,
}>(), {
  data: () => []
})

const checked = ref<any>([])
const showTime = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

const toggle = (index: number) => {
  checkboxRefs.value[index].toggle()
  console.log(checked.value)
};

const onConfirm = (val: string) => {
  value.value = val
  emits('update:modelValue', val)
  showTime.value = false
}
</script>

<style lang="scss" scoped>

</style>