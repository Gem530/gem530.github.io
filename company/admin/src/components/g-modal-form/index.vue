<template>
  <el-dialog
    :="attrs"
    :model-value="props.show"
    @closed="close"
  >
    <g-form
      ref="GFormRef"
      v-if="props.show"
      label-width="100px"
      :rules="props.rules"
      :formList="props.formList"
      @search="search">
      <template v-for="(item, i) in props.formList" :key="i">
        <!-- <template #item.prop v-if="item.type === 'slot'"></template> -->
      </template>
    </g-form>
    <template #footer>
      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="close">{{props.cancelName}}</el-button>
          <el-button type="primary" @click="confirmHandle">{{props.confirmName}}</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="g-modal-form">
import {
  ref,
  watch,
  useAttrs,
  nextTick,
  defineEmits,
  defineProps,
  withDefaults,
  defineExpose
} from 'vue'

const GFormRef = ref()
const attrs = useAttrs()
const emits = defineEmits(['update:show', 'confirm'])
const props = withDefaults(defineProps<{
  show: boolean,
  rules?: any,
  formList?: any[],
  cancelName?: string,
  confirmName?: string
}>(), {
  show: false,
  rules: {},
  formList: () => [],
  cancelName: '取消',
  confirmName: '确认'
})

watch(() => props.show, (val) => {
  nextTick(() => {
    val && GFormRef.value.clearValidte()
  })
})

const close = () => {
  emits('update:show', false)
}

const confirmHandle = () => {
  GFormRef.value.searchHandle()
}

const search = (item: any) => {
  emits('confirm', item)
}

defineExpose({ close })
</script>
